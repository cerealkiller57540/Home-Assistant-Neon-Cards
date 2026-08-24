"""HTML page retrieval classes."""

import logging
import re
import time
from contextlib import suppress
from pathlib import Path
from typing import Any

import requests
import requests.cookies
from lxml import html
from requests import Response

from .models import (
    AutodetectedSwitchModel,
    InvalidCryptFunctionError,
    SwitchModelNotDetectedError,
)
from .netgear_crypt import hex_hmac_md5, merge_hash

DEFAULT_PAGE = "index.htm"
URL_REQUEST_TIMEOUT = 15
status_code_ok = requests.codes.ok
status_code_not_found = requests.codes.not_found
status_code_no_response = requests.codes.no_response
status_code_unauthorized = requests.codes.unauthorized

_LOGGER = logging.getLogger(__name__)
MAX_RAW_RESPONSE_LENGTH = 4096


def _redact_response_content(content: bytes) -> str:
    """Return a bounded response body without common credential fields."""
    raw_content = content.decode("utf-8", errors="replace")
    redacted_content = re.sub(
        r"(?is)(name\s*=\s*[\"']?(?:pwd|password|sid|gambit)[\"']?"
        r"[^>]*value\s*=\s*[\"']?)[^\"'\s>]+",
        r"\1***",
        raw_content,
    )
    redacted_content = re.sub(
        r"(?i)((?:pwd|password|sid|gambit)\s*[=:]\s*[\"'])[^\"']*",
        r"\1***",
        redacted_content,
    )
    if len(redacted_content) > MAX_RAW_RESPONSE_LENGTH:
        return (
            redacted_content[:MAX_RAW_RESPONSE_LENGTH]
            + "\n...[raw response truncated]"
        )
    return redacted_content


class PageFetcherConnectionError(Exception):
    """Connection reset while requesting page."""


class LoginFailedError(Exception):
    """Invalid credentials."""


class NotLoggedInError(Exception):
    """Not logged in."""


class PageNotLoadedError(Exception):
    """Failed to load the page."""


class EmptyTemplateParameterError(Exception):
    """None of the models passed the tests."""


class BaseResponse:
    """Base class for response objects."""

    def __init__(self) -> None:
        """Initialize BaseResponse Object."""
        self.status_code = status_code_not_found
        self.content = b""
        self.cookies = requests.cookies.RequestsCookieJar()

    def __bool__(self) -> bool:
        """Return True if status code is 200."""
        return self.status_code == status_code_ok


class PageFetcher:
    """Class to fetch html pages from switch (or file)."""

    def __init__(self, host: str) -> None:
        """Initialize PageFetcher Object."""
        self.host = host
        # cached login page response
        self._login_page_response = None
        self._password_hash = None

        # login cookie
        self._cookie_name = None
        self._cookie_content = None
        self._last_raw_response = ""

        # offline mode settings
        self.offline_mode = False
        self.offline_path_prefix = ""

    def turn_on_offline_mode(self, path_prefix: str) -> None:
        """Turn on offline mode."""
        self.offline_mode = True
        self.offline_path_prefix = path_prefix

    def turn_on_online_mode(self) -> None:
        """Turn on online mode."""
        self.offline_mode = False

    def check_login_url(self, switch_model: type[AutodetectedSwitchModel]) -> bool:
        """Check and cache login page."""
        templates = switch_model.AUTODETECT_TEMPLATES
        for template in templates:
            url = template["url"].format(ip=self.host)
            if self.offline_mode:
                _LOGGER.debug(
                    "[PageFetcher.check_login_url] reading %s from file.", url
                )
                self._login_page_response = self.get_page_from_file(url)
            else:
                method = template["method"]
                allow_redirects = True
                timeout = URL_REQUEST_TIMEOUT
                _LOGGER.debug(
                    "[PageFetcher.check_login_url] calling request for %s %s"
                    " with allow_redirects=%s, timeout=%d",
                    method.upper(),
                    url,
                    allow_redirects,
                    timeout,
                )
                with suppress(
                    requests.exceptions.Timeout,
                    requests.exceptions.ConnectionError,
                    requests.exceptions.ChunkedEncodingError,
                ):
                    self._login_page_response = requests.request(
                        method, url, allow_redirects=allow_redirects, timeout=timeout
                    )

            if self.has_ok_status(self._login_page_response):
                return True
        message = f"Failed to load any page of templates: {templates}"
        raise PageNotLoadedError(message)

    def get_login_page_response(self) -> Response | BaseResponse | None:
        """Return cached login page."""
        return self._login_page_response

    def clear_login_page_response(self) -> None:
        """Return cached login page."""
        self._login_page_response = None
        self._password_hash = None

    def get_cookie(self) -> tuple[str | None, str | None]:
        """Get cookie."""
        if self._cookie_name and self._cookie_content:
            return (self._cookie_name, self._cookie_content)
        return (None, None)

    def set_cookie(self, cookie_name: str, cookie_content: str) -> None:
        """Set cookie."""
        self._cookie_name = cookie_name
        self._cookie_content = cookie_content

    def clear_cookie(self) -> None:
        """Clear cookie."""
        self._cookie_name = None
        self._cookie_content = None

    def get_last_raw_response(self) -> str:
        """Return the last bounded and redacted response diagnostic."""
        return self._last_raw_response

    def _set_raw_response(self, url: str, response: Response | BaseResponse) -> None:
        """Store response metadata and a bounded, redacted response body."""
        content = getattr(response, "content", b"") or b""
        self._last_raw_response = (
            f"URL: {url}\n"
            f"HTTP status: {response.status_code}\n"
            f"Response bytes: {len(content)}\n"
            f"Location: {getattr(response, 'headers', {}).get('Location', '<none>')}\n"
            "--- body ---\n"
            f"{_redact_response_content(content)}"
        )

    def _set_transport_failure(self, url: str, reason: str) -> None:
        """Store a transport failure as the current raw diagnostic."""
        self._last_raw_response = f"URL: {url}\nTransport failure: {reason}"

    def get_page_from_file(self, url: str) -> BaseResponse:
        """Get page from file."""
        response = BaseResponse()
        page_name = url.split("/")[-1] or DEFAULT_PAGE
        path = Path(f"{self.offline_path_prefix}/{page_name}")
        if path.exists():
            with path.open("r") as file:
                response.content = file.read().encode("utf-8")
                response.status_code = status_code_ok
                _LOGGER.debug(
                    "[NetgearSwitchConnector.get_page_from_file] "
                    "loaded offline page=%s",
                    page_name,
                )
        else:
            _LOGGER.debug(
                "[NetgearSwitchConnector.get_page_from_file] offline page=%s not found",
                page_name,
            )
        return response

    def set_data_from_template(
        self, template: dict[str, Any], source: Any, data: dict[str, Any]
    ) -> None:
        """Populate data from template using class variables."""
        if "params" not in template:
            return
        for key, value in template["params"].items():
            if value.startswith("literal:"):
                data[key] = value[8:]
            else:
                try:
                    data[key] = getattr(source, value)
                except AttributeError as error:
                    message = (
                        "NetgearSwitchConnector._set_data_from_template: "
                        f"missing attribute {key} (class variable {value})"
                    )
                    raise EmptyTemplateParameterError(message) from error
                if not data[key]:
                    message = (
                        "NetgearSwitchConnector._set_data_from_template: "
                        f"empty attribute {key} (class variable {value})"
                    )
                    raise EmptyTemplateParameterError(message)

    def get_login_response(
        self,
        switch_model: type[AutodetectedSwitchModel],
        login_password: str,
        rand: str | None,
    ) -> Response | BaseResponse:
        """Login and save returned cookie."""
        if not switch_model or switch_model.MODEL_NAME == "":
            raise SwitchModelNotDetectedError
        if switch_model.CRYPT_FUNCTION == "merge_hash" and not rand:
            self._password_hash = login_password
            _LOGGER.debug(
                "[PageFetcher.get_login_response] no rand: use plaintext password"
            )
        elif switch_model.CRYPT_FUNCTION == "merge_hash" and rand:
            self._password_hash = merge_hash(login_password, rand)
            _LOGGER.debug(
                "[PageFetcher.get_login_response] use merge_hash password with rand=%s",
                rand,
            )
        elif switch_model.CRYPT_FUNCTION == "hex_hmac_md5":
            self._password_hash = hex_hmac_md5(login_password)
            _LOGGER.debug(
                "[PageFetcher.get_login_response] use hex_hmac_md5 password",
            )
        elif switch_model.CRYPT_FUNCTION == "none":
            # Plain password, no hashing (e.g. GS108T)
            self._password_hash = login_password
            _LOGGER.debug(
                "[PageFetcher.get_login_response] use plaintext password (no crypt)",
            )
        else:
            raise InvalidCryptFunctionError(switch_model.CRYPT_FUNCTION)
        response = None
        template = switch_model.LOGIN_TEMPLATE
        url = template["url"].format(ip=self.host)
        method = template["method"]
        data = {}
        self.set_data_from_template(template, self, data)
        allow_redirects = True
        response = self.request(method, url, data=data, allow_redirects=allow_redirects)
        if not response or response.status_code != status_code_ok:
            raise LoginFailedError

        return response

    def _is_authenticated(self, response: Response | BaseResponse) -> bool:
        """Check for redirect to login when not authenticated (anymore)."""
        if "content" in dir(response) and response.content:
            tree = html.fromstring(response.content)
            title = tree.xpath("//title")
            if len(title) and title[0].text.lower() == "redirect to login":
                _LOGGER.info(
                    "[PageFetcher._is_authenticated] Returning false: title=%s",
                    title[0].text.lower(),
                )
                return False
            if self._cookie_name and tree.xpath(
                '//input[@name="pwd" and @type="password"]'
            ):
                _LOGGER.info(
                    "[PageFetcher._is_authenticated] Returning false: GS108T login form"
                )
                return False
            script = tree.xpath('//script[contains(text(),"/wmi/login")]')
            if len(script) > 0 and 'top.location.href = "/wmi/login"' in script[0].text:
                _LOGGER.info(
                    "[PageFetcher._is_authenticated] Returning false: script=%s",
                    script[0].text,
                )
                return False
        return True

    def request(
        self,
        method: str,
        url: str,
        data: Any = None,
        timeout: int = 0,
        allow_redirects: bool = False,  # noqa: FBT001, FBT002
    ) -> Response | BaseResponse:
        """Make authenticated requests with requests.request."""
        if self.offline_mode:
            return self.get_page_from_file(url)
        if timeout == 0:
            timeout = URL_REQUEST_TIMEOUT
        # BaseResponse (not requests.Response()) so a transport failure below
        # returns an object with a real status_code. A bare Response() leaves
        # status_code=None, and `if not response` triggers Response.__bool__
        # -> raise_for_status() -> `400 <= None` -> unhandled TypeError instead
        # of the intended LoginFailedError/PageNotLoadedError.
        response: Response | BaseResponse = BaseResponse()
        kwargs = {}
        data_key = "data" if method == "post" else "params"
        log_data = data
        if isinstance(data, dict):
            log_data = {
                key: "***"
                if any(
                    secret_name in key.lower()
                    for secret_name in ("password", "pwd", "hash", "cookie", "sid", "gambit")
                )
                else value
                for key, value in data.items()
            }
        if self._cookie_name and self._cookie_content:
            jar = requests.cookies.RequestsCookieJar()
            jar.set(self._cookie_name, self._cookie_content, domain=self.host, path="/")
            kwargs = {
                data_key: data,
                "cookies": jar,
                "allow_redirects": allow_redirects,
                "timeout": timeout,
            }
            _LOGGER.debug(
                "[PageFetcher.request] calling %s %s with %s cookie"
                " with %s=%s, allow_redirects=%s, timeout=%d",
                method.upper(),
                url,
                self._cookie_name,
                data_key,
                log_data,
                allow_redirects,
                timeout,
            )
        else:
            kwargs = {
                data_key: data,
                "allow_redirects": allow_redirects,
                "timeout": timeout,
            }
            _LOGGER.debug(
                "[PageFetcher.request] calling %s %s without cookie"
                " with %s=%s, allow_redirects=%s, timeout=%d",
                method.upper(),
                url,
                data_key,
                log_data,
                allow_redirects,
                timeout,
            )
        started_at = time.perf_counter()
        try:
            response = requests.request(method, url, **kwargs)  # noqa: S113
        except requests.exceptions.Timeout:
            self._set_transport_failure(url, "timeout")
            _LOGGER.debug(
                "[PageFetcher.request] timeout after %.3fs for %s %s",
                time.perf_counter() - started_at,
                method.upper(),
                url,
            )
            return response
        except requests.exceptions.ConnectionError as error:
            self._set_transport_failure(url, f"connection error: {error}")
            _LOGGER.debug(
                "[PageFetcher.request] connection error after %.3fs for %s %s: %s",
                time.perf_counter() - started_at,
                method.upper(),
                url,
                error,
            )
            raise PageFetcherConnectionError from error
        except requests.exceptions.ChunkedEncodingError as error:
            self._set_transport_failure(url, f"chunked response error: {error}")
            _LOGGER.debug(
                "[PageFetcher.request] chunked response error after %.3fs for %s %s: %s",
                time.perf_counter() - started_at,
                method.upper(),
                url,
                error,
            )
            raise PageFetcherConnectionError from error

        self._set_raw_response(url, response)

        _LOGGER.debug(
            "[PageFetcher.request] response for %s %s: status=%s, bytes=%d, "
            "location=%s, elapsed=%.3fs",
            method.upper(),
            url,
            response.status_code,
            len(response.content or b""),
            response.headers.get("Location", "<none>"),
            time.perf_counter() - started_at,
        )

        # Session expired: refresh login cookie and try again. Older firmware
        # redirects unauthenticated requests instead of returning a login page.
        # Observed on this GS108T (2026-08-23): it redirects to the bare root
        # ("http://<ip>/") rather than to a URL containing "login", so relying
        # on the "login" substring alone silently swallowed the expiry and the
        # code kept retrying with the dead SID forever (never re-logged in).
        login_location = response.headers.get("Location", "").lower()
        target_path = login_location.rsplit("://", 1)[-1].partition("/")[-1]
        is_login_redirect = response.is_redirect and (
            "login" in login_location or target_path in ("", "/")
        )
        if is_login_redirect or (
            response.status_code == status_code_ok
            and not self._is_authenticated(response)
        ):
            raise NotLoggedInError
        return response

    def has_ok_status(self, response: Response | BaseResponse | None) -> bool:
        """Check if response has status code 200."""
        return response is not None and response.status_code == status_code_ok
