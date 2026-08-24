"""Definitions of html parsers for Netgear Plus switches."""

import logging
import re
from typing import Any

import requests
from lxml import html
from requests import Response

from .fetcher import BaseResponse
from .utils import get_all_child_classes_dict

_LOGGER = logging.getLogger(__name__)

API_V2_CHECKS = {
    "bootloader": ["V1.00.03", "V2.06.01", "V2.06.02", "V2.06.03", "V1.6.0.2-VB"],
    "firmware": ["V2.06.24GR", "V2.06.24EN", "V1.6.0.17"],
}

POE_PORT_ENABLED_STATUS = ["enable", "aktiv"]


def create_page_parser(switch_model: str | None = None) -> Any:
    """Return the parser for the switch model."""
    if switch_model is None:
        return PageParser()
    if switch_model not in PARSERS:
        message = f"Model {switch_model} not supported by the parser."
        raise NetgearPlusPageParserModelNotSupportedError(message)
    return PARSERS[switch_model]()


def get_first_text(tree: html.HtmlElement, xpath: str) -> str:
    """Get the first text from an xpath."""
    try:
        return tree.xpath(xpath)[0].text
    except IndexError as error:
        message = f"XPath {xpath} not found."
        raise NetgearPlusPageParserError(message) from error


def get_first_value(tree: html.HtmlElement, xpath: str) -> str:
    """Get the first value from an xpath."""
    try:
        return tree.xpath(xpath)[0].value
    except IndexError as error:
        message = f"XPath {xpath} not found."
        raise NetgearPlusPageParserError(message) from error


def get_text_from_next_parent_element(tree: html.HtmlElement, xpath: str) -> str:
    """Get the first text from an xpath."""
    try:
        return tree.xpath(xpath)[0].getparent().getnext().text_content()
    except IndexError as error:
        message = f"XPath {xpath} not found."
        raise NetgearPlusPageParserError(message) from error


def get_text_from_next_element(tree: html.HtmlElement, xpath: str) -> str:
    """Get the first text from an xpath."""
    try:
        return tree.xpath(xpath)[0].getnext().text_content()
    except IndexError as error:
        message = f"XPath {xpath} not found."
        raise NetgearPlusPageParserError(message) from error


def strip_duplex(text: str) -> str:
    """Strip duplex from text."""
    return re.sub(r"full|half", "", text, flags=re.IGNORECASE).strip()


# convert to int
def convert_to_int(
    lst: list,
    output_elems: int,
    base: int = 10,
    attr_name: str = "text",
) -> list:
    """Convert a list of objects to a list of integers."""
    new_lst = []
    for obj in lst:
        try:
            value = int(getattr(obj, attr_name), base)
        except (TypeError, ValueError):
            value = 0
        new_lst.append(value)

    if len(new_lst) < output_elems:
        diff = output_elems - len(new_lst)
        new_lst.extend([0] * diff)
    return new_lst


def convert_gs3xx_to_int(input_1: str, input_2: str, base: int = 10) -> int:
    """Convert two strings to an integer."""
    int32 = 2**32
    return int(input_1, base) * int32 + int(input_2, base)


def convert_gs105_to_int(input_1: int, input_2: int) -> int:
    """Calculate real value from int32 turnover counter and current value."""
    int32 = 2**32
    return input_1 * int32 + input_2


class NetgearPlusPageParserError(Exception):
    """Base class for NetgearSwitchParser errors."""


class NetgearPlusPageParserModelNotSupportedError(NetgearPlusPageParserError):
    """Model not supported by the parser."""


class PageParser:
    """Base class for parsing Netgear Plus html pages."""

    def __init__(self) -> None:
        """Empty contructor."""
        self._switch_firmware = None
        self._switch_bootloader = None
        self._port_status = {}
        _LOGGER.debug("%s object initialized.", self.__class__.__name__)

    def parse_login_form_rand(self, page: Response | BaseResponse | None) -> str | None:
        """Return rand value from login page if present."""
        if page is not None and page.content:
            tree = html.fromstring(page.content)
            input_rand_elems = tree.xpath('//input[@id="rand"]')
            if input_rand_elems and input_rand_elems[0].value:
                return input_rand_elems[0].value
        _LOGGER.debug(
            "[PageParser.parse_login_form_rand] rand INPUT element not found."
        )
        return None

    def check_login_form_rand(self, page: Response | BaseResponse) -> bool:
        """Return true of rand value from login page is present."""
        return bool(self.parse_login_form_rand(page))

    def parse_login_title_tag(self, page: Response | BaseResponse) -> str | None:
        """Return the title tag from the login page."""
        """For new firmwares V2.06.10, V2.06.17, V2.06.24."""
        if page is not None and page.content:
            tree = html.fromstring(page.content)
            title_elems = tree.xpath("//title")
            if title_elems and title_elems[0].text:
                return title_elems[0].text.replace("NETGEAR", "").strip()
        _LOGGER.debug("[PageParser.parse_login_title_tag] TITLE element not found.")
        return None

    def parse_login_switchinfo_tag(self, page: Response | BaseResponse) -> str | None:
        """Return the title tag from the login page."""
        """
        For old firmware V2.00.05, return ""
        or something like: "GS108Ev3 - 8-Port Gigabit ProSAFE Plus Switch".
        Newer firmwares contain that too.
        """
        if page is not None and page.content:
            tree = html.fromstring(page.content)
            switchinfo_elems = tree.xpath('//div[@class="switchInfo"]')
            if switchinfo_elems:
                return switchinfo_elems[0].text
        _LOGGER.debug(
            "[PageParser.parse_login_switchinfo_tag] "
            "DIV with class 'switchInfo' not found."
        )
        return None

    def parse_first_script_tag(self, page: Response | BaseResponse) -> str | None:
        """Parse script tag."""
        if page is not None and page.content:
            tree = html.fromstring(page.content)
            script_elems = tree.xpath("//script")
            if script_elems and script_elems[0].text:
                model_name = re.search("sysGeneInfor = '([^?]+)?", script_elems[0].text)
                if model_name:
                    try:
                        return model_name.group(1)
                    except IndexError:
                        pass
        _LOGGER.debug(
            "[PageParser.parse_script_tag] no sysGeneInfor in SCRIPT element found."
        )
        return None

    def parse_gambit_tag(self, page: Response | BaseResponse) -> str | None:
        """Parse Gambit form element."""
        # GS31xEP(P) series switches return the cookie value in a hidden form element
        if page is not None and page.content:
            tree = html.fromstring(page.content)
            gambit_elems = tree.xpath('//input[@name="Gambit"]')
            if gambit_elems and gambit_elems[0].value:
                return gambit_elems[0].value
        _LOGGER.debug("[PageParser.parse_gambit_tag] Gambit INPUT element not found.")
        return None

    def has_api_v2(self) -> bool:
        """Check if the switch has API v2."""
        if not self._switch_firmware or not self._switch_bootloader:
            error_message = (
                "Firmware or bootloader version not set. "
                "Call parse_switch_metadata first."
            )
            raise NetgearPlusPageParserError(error_message)
        match_bootloader = self._switch_bootloader in API_V2_CHECKS["bootloader"]
        match_firmware = self._switch_firmware in API_V2_CHECKS["firmware"]
        return match_bootloader or match_firmware

    def parse_switch_metadata(self, page: Response | BaseResponse) -> dict[str, Any]:
        """Parse switch info from the html page."""
        tree = html.fromstring(page.content)

        switch_name = get_first_value(tree, '//input[@id="switch_name"]')
        switch_serial_number = get_first_text(tree, '//table[@id="tbl1"]/tr[3]/td[2]')

        # Detect Firmware (2nd xpath is for older firmware)
        self._switch_firmware = get_first_text(
            tree, '//table[@id="tbl1"]/tr[6]/td[2]'
        ) or get_first_text(tree, '//table[@id="tbl1"]/tr[4]/td[2]')

        self._switch_bootloader = get_first_text(tree, '//td[@id="loader"]')

        return {
            "switch_name": switch_name,
            "switch_serial_number": switch_serial_number,
            "switch_bootloader": self._switch_bootloader,
            "switch_firmware": self._switch_firmware,
        }

    def parse_client_hash(self, page: Response | BaseResponse) -> str | None:
        """Parse the client hash from the html page."""
        tree = html.fromstring(page.content)
        return get_first_value(tree, '//input[@name="hash"]')

    def parse_led_status(self, page: Response | BaseResponse) -> dict[str, Any]:
        """Parse status of the front panel LEDs from the html page."""
        raise NotImplementedError

    def parse_port_status(
        self, page: Response | BaseResponse, ports: int
    ) -> dict[int, dict[str, Any]]:
        """Parse port status from the html page."""
        status_by_port = {}

        if self.has_api_v2():
            tree = html.fromstring(page.content)
            _port_elems = tree.xpath('//tr[@class="portID"]/td[2]')
            portstatus_elems = tree.xpath('//tr[@class="portID"]/td[3]')
            portspeed_elems = tree.xpath('//tr[@class="portID"]/td[4]')
            portconnectionspeed_elems = tree.xpath('//tr[@class="portID"]/td[5]')

            for port_nr in range(ports):
                try:
                    status_text = portstatus_elems[port_nr].text.strip()
                    modus_speed_text = portspeed_elems[port_nr].text.strip()
                    connection_speed_text = strip_duplex(
                        portconnectionspeed_elems[port_nr].text
                    )
                except (IndexError, AttributeError):
                    status_text = self.port_status.get(port_nr + 1, {}).get(
                        "status", None
                    )
                    modus_speed_text = self.port_status.get(port_nr + 1, {}).get(
                        "modus_speed", None
                    )
                    connection_speed_text = self.port_status.get(port_nr + 1, {}).get(
                        "connection_speed", None
                    )
                status_by_port[port_nr + 1] = {
                    "status": status_text,
                    "modus_speed": modus_speed_text,
                    "connection_speed": connection_speed_text,
                }

        self.port_status = status_by_port
        _LOGGER.debug("Port Status is %s", self.port_status)
        return status_by_port

    def parse_port_statistics(
        self, page: Response | BaseResponse, ports: int
    ) -> dict[str, Any]:
        """Parse port statistics from the html page."""
        if self.has_api_v2():
            return self.parse_port_statistics_v2(page, ports)
        return self.parse_port_statistics_v1(page, ports)

    def parse_port_statistics_v1(
        self, page: Response | BaseResponse, ports: int
    ) -> dict[str, Any]:
        """Parse port statistics from the html page."""
        tree = html.fromstring(page.content)
        rx_elems = tree.xpath('//tr[@class="portID"]/td[2]')
        tx_elems = tree.xpath('//tr[@class="portID"]/td[3]')
        crc_elems = tree.xpath('//tr[@class="portID"]/td[4]')

        # convert to int (base 10)
        rx = convert_to_int(rx_elems, output_elems=ports, base=10, attr_name="text")
        tx = convert_to_int(tx_elems, output_elems=ports, base=10, attr_name="text")
        crc = convert_to_int(crc_elems, output_elems=ports, base=10, attr_name="text")
        io_zeros = [0] * ports
        return {
            "traffic_rx": rx,
            "traffic_tx": tx,
            "sum_rx": rx,
            "sum_tx": tx,
            "crc_errors": crc,
            "speed_io": io_zeros,
        }

    def parse_port_statistics_v2(
        self, page: Response | BaseResponse, ports: int
    ) -> dict[str, Any]:
        """Parse port statistics from the html page."""
        tree = html.fromstring(page.content)
        rx_elems = tree.xpath('//input[@name="rxPkt"]')
        tx_elems = tree.xpath('//input[@name="txpkt"]')
        crc_elems = tree.xpath('//input[@name="crcPkt"]')

        # convert to int (base 16)
        rx = convert_to_int(rx_elems, output_elems=ports, base=16, attr_name="value")
        tx = convert_to_int(tx_elems, output_elems=ports, base=16, attr_name="value")
        crc = convert_to_int(crc_elems, output_elems=ports, base=16, attr_name="value")
        io_zeros = [0] * ports
        return {
            "traffic_rx": rx,
            "traffic_tx": tx,
            "sum_rx": rx,
            "sum_tx": tx,
            "crc_errors": crc,
            "speed_io": io_zeros,
        }

    def parse_poe_port_config(self, page: Response | BaseResponse) -> dict[str, Any]:
        """Parse PoE port configuration from the html page."""
        raise NotImplementedError

    def parse_poe_port_status(self, page: Response | BaseResponse) -> dict[str, Any]:
        """Parse PoE port status from the html page."""
        raise NotImplementedError

    def parse_error(self, page: Response | BaseResponse) -> str | None:
        """Parse error from the html page."""
        tree = html.fromstring(page.content)
        error_msg = tree.xpath('//input[@id="err_msg"]')
        if error_msg:
            return error_msg[0].value
        return None

    def parse_reboot_success(self, page: Response | BaseResponse) -> bool:
        """Parse if reboot was successful."""
        return page.status_code == requests.codes.ok


class GS105E(PageParser):
    """Parser for the GS105E switch."""

    def __init__(self) -> None:
        """Initialize the GS105E parser."""
        super().__init__()


class GS105Ev2(PageParser):
    """Parser for the GS105Ev2 switch."""

    def __init__(self) -> None:
        """Initialize the GS105Ev2 parser."""
        super().__init__()

    def parse_switch_metadata(self, page: Response | BaseResponse) -> dict[str, Any]:
        """Parse switch info from the html page."""
        tree = html.fromstring(page.content)

        switch_name = get_first_value(tree, '//input[@id="switch_name"]')
        switch_serial_number = get_text_from_next_element(
            tree, '//td[contains(text(),"Serial Number")]'
        )

        # Detect Firmware
        self._switch_firmware = get_text_from_next_element(
            tree, '//td[contains(text(),"Firmware Version")]'
        )

        self._switch_bootloader = get_text_from_next_element(
            tree, '//td[contains(text(),"Bootloader Version")]'
        )

        return {
            "switch_name": switch_name,
            "switch_serial_number": switch_serial_number,
            "switch_bootloader": self._switch_bootloader,
            "switch_firmware": self._switch_firmware,
        }

    def parse_port_status(
        self, page: Response | BaseResponse, ports: int
    ) -> dict[int, dict[str, Any]]:
        """Parse port status from the html page."""
        status_by_port = {}

        tree = html.fromstring(page.content)
        _port_elems = tree.xpath('//tr[@class="portID"]/td[3]')
        portstatus_elems = tree.xpath('//tr[@class="portID"]/td[4]')
        portspeed_elems = tree.xpath('//tr[@class="portID"]/td[5]')
        portconnectionspeed_elems = tree.xpath('//tr[@class="portID"]/td[6]')

        for port_nr in range(ports):
            try:
                status_text = portstatus_elems[port_nr].text.strip()
                modus_speed_text = portspeed_elems[port_nr].text.strip()
                connection_speed_text = strip_duplex(
                    portconnectionspeed_elems[port_nr].text
                )
            except (IndexError, AttributeError):
                status_text = self.port_status.get(port_nr + 1, {}).get("status", None)
                modus_speed_text = self.port_status.get(port_nr + 1, {}).get(
                    "modus_speed", None
                )
                connection_speed_text = self.port_status.get(port_nr + 1, {}).get(
                    "connection_speed", None
                )
            status_by_port[port_nr + 1] = {
                "status": status_text,
                "modus_speed": modus_speed_text,
                "connection_speed": connection_speed_text,
            }

        self.port_status = status_by_port
        _LOGGER.debug("Port Status is %s", self.port_status)
        return status_by_port

    def parse_port_statistics(
        self, page: Response | BaseResponse, ports: int
    ) -> dict[str, Any]:
        """Parse port statistics from the html page."""
        tree = html.fromstring(page.content)
        rx_turnover_elems = tree.xpath('//tr[@class="portID"]/input[1]')
        rx_current_elems = tree.xpath('//tr[@class="portID"]/input[2]')
        tx_turnover_elems = tree.xpath('//tr[@class="portID"]/input[3]')
        tx_current_elems = tree.xpath('//tr[@class="portID"]/input[4]')
        crc_turnover_elems = tree.xpath('//tr[@class="portID"]/input[5]')
        crc_current_elems = tree.xpath('//tr[@class="portID"]/input[6]')

        # calculate int bytes
        rx = [
            convert_gs105_to_int(turnover, current)
            for turnover, current in zip(
                convert_to_int(
                    rx_turnover_elems, output_elems=ports, base=10, attr_name="value"
                ),
                convert_to_int(
                    rx_current_elems, output_elems=ports, base=10, attr_name="value"
                ),
                strict=False,
            )
        ]
        tx = [
            convert_gs105_to_int(turnover, current)
            for turnover, current in zip(
                convert_to_int(
                    tx_turnover_elems, output_elems=ports, base=10, attr_name="value"
                ),
                convert_to_int(
                    tx_current_elems, output_elems=ports, base=10, attr_name="value"
                ),
                strict=True,
            )
        ]
        crc = [
            convert_gs105_to_int(turnover, current)
            for turnover, current in zip(
                convert_to_int(
                    crc_turnover_elems, output_elems=ports, base=10, attr_name="value"
                ),
                convert_to_int(
                    crc_current_elems, output_elems=ports, base=10, attr_name="value"
                ),
                strict=True,
            )
        ]
        io_zeros = [0] * ports
        return {
            "traffic_rx": rx,
            "traffic_tx": tx,
            "sum_rx": rx,
            "sum_tx": tx,
            "crc_errors": crc,
            "speed_io": io_zeros,
        }


class GS105PE(GS105Ev2):
    """Parser for the GS105PE switch."""

    def __init__(self) -> None:
        """Initialize the GS105PE parser."""
        super().__init__()


class GS105Ev3(PageParser):
    """Parser for the GS105Ev3 switch."""

    def __init__(self) -> None:
        """Initialize the GS105Ev3 parser."""
        super().__init__()


class GS108E(PageParser):
    """Parser for the GS108E switch."""

    def __init__(self) -> None:
        """Initialize the GS108E parser."""
        super().__init__()


class GS108Ev3(PageParser):
    """Parser for the GS108Ev3 switch."""

    def __init__(self) -> None:
        """Initialize the GS108Ev3 parser."""
        super().__init__()


class GS108Ev4(PageParser):
    """Parser for the GS108Ev4 switch."""

    def __init__(self) -> None:
        """Initialize the GS108Ev4 parser."""
        super().__init__()

    def parse_switch_metadata(self, page: Response | BaseResponse) -> dict[str, Any]:
        """Parse switch info from the html page."""
        tree = html.fromstring(page.content)

        titles = tree.xpath('//div[@class="hid_info_title"]/span/text()')
        values = tree.xpath(
            '//div[@class="hid_info_title"]/following-sibling::div[1]/span/text()'
        )
        data = dict(zip(titles, values, strict=False))

        switch_name = get_first_value(tree, '//input[@id="switchName"]')
        switch_serial_number = data["ml198"]
        self._switch_firmware = data["ml089"]
        # unable to find bootloader version
        self._switch_bootloader = "unknown"

        return {
            "switch_name": switch_name,
            "switch_serial_number": switch_serial_number,
            "switch_bootloader": self._switch_bootloader,
            "switch_firmware": self._switch_firmware,
        }

    def parse_port_status(
        self, page: Response | BaseResponse, ports: int
    ) -> dict[int, dict[str, Any]]:
        """Parse port status from the html page."""
        status_by_port = {}

        tree = html.fromstring(page.content)
        blocks = tree.xpath('//li[contains(@class, "list_item")]')

        for port_nr in range(ports):
            try:
                port = blocks[port_nr].xpath('.//input[@class="port"]/@value')[0]
                status_text = blocks[port_nr].xpath(
                    './/span[contains(@class, "padding_r_18")]/span/text()'
                )[0]
                speed = blocks[port_nr].xpath('.//input[@class="Speed"]/@value')[0]
                connection_speed_text = blocks[port_nr].xpath(
                    './/input[@class="LinkedSpeed"]/@value'
                )[0]
                modus_speed_text = [
                    "0",
                    "Auto",
                    "Disable",
                    "3",
                    "10M full",
                    "5",
                    "100M full",
                ][int(speed)]
            except (IndexError, AttributeError):
                status_text = self.port_status.get(port_nr + 1, {}).get("status", None)
                modus_speed_text = self.port_status.get(port_nr + 1, {}).get(
                    "modus_speed", None
                )
                connection_speed_text = self.port_status.get(port_nr + 1, {}).get(
                    "connection_speed", None
                )
            status_by_port[int(port)] = {
                "status": status_text,
                "modus_speed": modus_speed_text,
                "connection_speed": connection_speed_text,
            }

        self.port_status = status_by_port
        return status_by_port

    def parse_port_statistics(
        self, page: Response | BaseResponse, ports: int
    ) -> dict[str, Any]:
        """Parse port statistics from the html page."""
        tree = html.fromstring(page.content)
        li_elements = tree.xpath("//li")
        data = {}
        rx = [0] * ports
        tx = [0] * ports
        crc = [0] * ports
        for li in li_elements:
            try:
                port_number = li.xpath(".//span[1]/text()")
                if not port_number:
                    continue
                port_number = int(port_number[0].strip())
            except ValueError:
                continue
            inputs = li.xpath("following-sibling::input[@type='hidden']/@value")
            data[port_number] = list(map(int, inputs[:6]))
            rx[port_number - 1] = int(data[port_number][1])
            tx[port_number - 1] = int(data[port_number][3])
            crc[port_number - 1] = int(data[port_number][5])
        io_zeros = [0] * ports
        return {
            "traffic_rx": rx,
            "traffic_tx": tx,
            "sum_rx": rx,
            "sum_tx": tx,
            "crc_errors": crc,
            "speed_io": io_zeros,
        }


class GS108PEv3(PageParser):
    """Parser for the GS108PEv3 switch."""

    def __init__(self) -> None:
        """Initialize the GS108PEv3 parser."""
        super().__init__()


class GS305E(GS105Ev2):
    """Parser for the GS305E switch."""

    def __init__(self) -> None:
        """Initialize the GS305E parser."""
        super().__init__()


class GS308E(PageParser):
    """Parser for the GS308E switch."""

    def __init__(self) -> None:
        """Initialize the GS308E parser."""
        super().__init__()


class GS308Ev4(GS108Ev4):
    """Parser for the GS308Ev4 switch."""

    def __init__(self) -> None:
        """Initialize the GS308Ev4 parser."""
        super().__init__()

    def parse_reboot_success(self, page: Response | BaseResponse) -> bool:
        """Parse if reboot was successful."""
        return page.status_code in [
            requests.codes.ok,
            requests.codes.no_response,
        ]


class EMxSeries(PageParser):
    """Parser for the GS110EMX switch."""

    def __init__(self) -> None:
        """Initialize the GS110EMX parser."""
        super().__init__()

    def parse_switch_metadata(self, page: Response | BaseResponse) -> dict[str, Any]:
        """Parse switch info from the html page."""
        tree = html.fromstring(page.content)

        switch_name = get_first_value(tree, '//input[@name="switch_name"]')
        switch_serial_number = get_text_from_next_element(
            tree, '//td[contains(text(),"Serial Number")]'
        )
        self._switch_bootloader = "unknown"
        self._switch_firmware = get_text_from_next_element(
            tree, '//td[contains(text(),"Firmware Version")]'
        )

        return {
            "switch_name": switch_name,
            "switch_serial_number": switch_serial_number,
            "switch_bootloader": self._switch_bootloader,
            "switch_firmware": self._switch_firmware,
        }

    def parse_client_hash(self, page: Response | BaseResponse) -> str | None:
        """Return None as these switches do not have a hash value."""
        del page
        return None

    def parse_port_status(
        self, page: Response | BaseResponse, ports: int
    ) -> dict[int, dict[str, Any]]:
        """Parse port status from the html page."""
        tree = html.fromstring(page.content)

        xtree_port_statusses = tree.xpath('//tr[@class="portID"]')

        if len(xtree_port_statusses) != ports:
            message = f"Port count mismatch: {len(xtree_port_statusses)} != {ports}"
            raise NetgearPlusPageParserError(message)

        status_by_port = {}
        for element in xtree_port_statusses:
            try:
                port_nr = element.xpath('./td/input[@name="PORT_NO"]')[0].value
                port_nr = int(port_nr)
            except IndexError as error:
                message = "parse_port_status: Port number not found."
                raise NetgearPlusPageParserError(message) from error
            except ValueError as error:
                message = f"parse_port_status: Port number ({port_nr}) not an integer."
                raise NetgearPlusPageParserError(message) from error

            xtree_port_attributes = element.xpath("./td")
            port_state_text = xtree_port_attributes[3].text.strip()
            modus_speed_text = xtree_port_attributes[4].text.strip()
            connection_speed_text = strip_duplex(xtree_port_attributes[5].text)

            status_by_port[port_nr] = {
                "status": port_state_text,
                "modus_speed": modus_speed_text,
                "connection_speed": connection_speed_text,
            }

        self.port_status = status_by_port
        _LOGGER.debug("Port Status is %s", self.port_status)
        return status_by_port

    def parse_port_statistics(
        self, page: Response | BaseResponse, ports: int
    ) -> dict[str, Any]:
        """Parse port statistics from the html page."""
        tree = html.fromstring(page.content)
        rx = []
        tx = []
        crc = []

        page_inputs = tree.xpath('//table/tr[@class="portID"]/td')

        for port_nr in range(ports):
            try:
                rx_value = int(page_inputs[port_nr * 4 + 1].text)
            except (IndexError, ValueError):
                rx_value = 0
            rx.append(rx_value)
            try:
                tx_value = int(page_inputs[port_nr * 4 + 2].text)
            except (IndexError, ValueError):
                tx_value = 0
            tx.append(tx_value)
            try:
                crc_value = int(page_inputs[port_nr * 4 + 3].text)
            except (IndexError, ValueError):
                crc_value = 0
            crc.append(crc_value)

        io_zeros = [0] * ports
        return {
            "traffic_rx": rx,
            "traffic_tx": tx,
            "sum_rx": rx,
            "sum_tx": tx,
            "crc_errors": crc,
            "speed_io": io_zeros,
        }


class GS110EMX(EMxSeries):
    """Parser for the GS110EMX switch."""

    def __init__(self) -> None:
        """Initialize the GS110EMX parser."""
        super().__init__()


class XS512EM(EMxSeries):
    """Parser for the GS110EMX switch."""

    def __init__(self) -> None:
        """Initialize the GS110EMX parser."""
        super().__init__()


class GS30xSeries(PageParser):
    """Parser for the GS30x switch series."""

    def __init__(self) -> None:
        """Initialize the GS30xSeries parser."""
        super().__init__()

    def parse_switch_metadata(self, page: Response | BaseResponse) -> dict[str, Any]:
        """Parse switch info from the html page."""
        tree = html.fromstring(page.content)

        switch_name = get_first_text(tree, '//div[@id="switch_name"]')
        switch_serial_number = get_text_from_next_parent_element(
            tree, '//span[text()="ml198"]'
        )
        self._switch_bootloader = "unknown"
        self._switch_firmware = get_text_from_next_parent_element(
            tree, '//span[text()="ml089"]'
        )

        return {
            "switch_name": switch_name,
            "switch_serial_number": switch_serial_number,
            "switch_bootloader": self._switch_bootloader,
            "switch_firmware": self._switch_firmware,
        }

    def parse_led_status(self, page: Response | BaseResponse) -> dict[str, Any]:
        """Parse status of the front panel LEDs from the html page."""
        tree = html.fromstring(page.content)
        led_status = get_first_text(tree, '//span[@id="led_switch"]')
        return {"led_status": "on" if led_status == "ON" else "off"}

    def parse_port_status(
        self, page: Response | BaseResponse, ports: int
    ) -> dict[int, dict[str, Any]]:
        """Parse port status from the html page."""
        tree = html.fromstring(page.content)

        status_by_port = {}
        for port0 in range(ports):
            port_nr = port0 + 1
            xtree_port = tree.xpath(f'//div[@name="isShowPot{port_nr}"]')[0]
            port_state_text = xtree_port[1][0].text

            modus_speed_text = tree.xpath('//input[@class="Speed"]')[port0].value
            if modus_speed_text == "1":
                modus_speed_text = "Auto"
            connection_speed_text = strip_duplex(
                tree.xpath('//input[@class="LinkedSpeed"]')[port0].value
            )

            status_by_port[port_nr] = {
                "status": port_state_text,
                "modus_speed": modus_speed_text,
                "connection_speed": connection_speed_text,
            }

        self.port_status = status_by_port
        _LOGGER.debug("Port Status is %s", self.port_status)
        return status_by_port

    def parse_port_statistics(
        self, page: Response | BaseResponse, ports: int
    ) -> dict[str, Any]:
        """Parse port statistics from the html page."""
        tree = html.fromstring(page.content)
        rx = []
        tx = []
        crc = []

        page_inputs = tree.xpath('//*[@id="settingsStatusContainer"]/div/ul/input')
        for port_nr in range(ports):
            input_1_text: str = page_inputs[port_nr * 6].value
            input_2_text: str = page_inputs[port_nr * 6 + 1].value
            rx_value = convert_gs3xx_to_int(input_1_text, input_2_text)
            rx.append(rx_value)

            input_3_text: str = page_inputs[port_nr * 6 + 2].value
            input_4_text: str = page_inputs[port_nr * 6 + 3].value
            tx_value = convert_gs3xx_to_int(input_3_text, input_4_text)
            tx.append(tx_value)

            input_5_text: str = page_inputs[port_nr * 6 + 4].value
            input_6_text: str = page_inputs[port_nr * 6 + 5].value
            crc_value = convert_gs3xx_to_int(input_5_text, input_6_text)
            crc.append(crc_value)
        io_zeros = [0] * ports
        return {
            "traffic_rx": rx,
            "traffic_tx": tx,
            "sum_rx": rx,
            "sum_tx": tx,
            "crc_errors": crc,
            "speed_io": io_zeros,
        }

    def parse_poe_port_config(self, page: Response | BaseResponse) -> dict[str, Any]:
        """Parse PoE port configuration from the html page."""
        switch_data = {}
        tree = html.fromstring(page.content)
        poe_port_config = {}
        poe_port_power_x = tree.xpath('//input[@id="hidPortPwr"]')
        for i, x in enumerate(poe_port_power_x):
            poe_port_config[i + 1] = "on" if x.value == "1" else "off"

        for poe_port_nr, poe_power_config in poe_port_config.items():
            switch_data[f"port_{poe_port_nr}_poe_power_active"] = poe_power_config
        return switch_data

    def parse_poe_port_status(self, page: Response | BaseResponse) -> dict[str, Any]:
        """Parse PoE port status from the html page."""
        switch_data = {}
        tree = html.fromstring(page.content)
        poe_output_power = {}
        # Port name:
        #   //li[contains(@class,"poe_port_list_item")]
        #       //span[contains(@class,"poe_index_li_title")]
        # Power mode:
        #   //li[contains(@class,"poe_port_list_item")]
        #       //span[contains(@class,"poe-power-mode")]
        # Port status:
        #   //li[contains(@class,"poe_port_list_item")]
        #       //div[contains(@class,"poe_port_status")]
        poe_output_power_x = tree.xpath(
            '//li[contains(@class,"poe_port_list_item")]//div[contains(@class,"poe_port_status")]'
        )
        for i, x in enumerate(poe_output_power_x):
            try:
                poe_output_power[i + 1] = float(x.xpath(".//span")[5].text)
            except ValueError:
                poe_output_power[i + 1] = 0.0

        for poe_port_nr, poe_power_status in poe_output_power.items():
            switch_data[f"port_{poe_port_nr}_poe_output_power"] = poe_power_status
        return switch_data

    def parse_error(self, page: Response | BaseResponse) -> str | None:
        """Parse error from the html page."""
        tree = html.fromstring(page.content)
        error_msg = tree.xpath('//div[@class="pwdErrStyle"]')
        if error_msg:
            return error_msg[0].text
        return None

    def parse_reboot_success(self, page: Response | BaseResponse) -> bool:
        """Parse if reboot was successful."""
        return page.status_code in [
            requests.codes.ok,
            requests.codes.no_response,
        ]


class GS305EP(GS30xSeries):
    """Parser for the GS305EP switch."""

    def __init__(self) -> None:
        """Initialize the GS305EP parser."""
        super().__init__()


class GS305EPP(GS30xSeries):
    """Parser for the GS305EP switch."""

    def __init__(self) -> None:
        """Initialize the GS305EP parser."""
        super().__init__()


class GS308EP(GS30xSeries):
    """Parser for the GS108EP switch."""

    def __init__(self) -> None:
        """Initialize the GS308EP parser."""
        super().__init__()


class GS308EPP(GS30xSeries):
    """Parser for the GS108EP switch."""

    def __init__(self) -> None:
        """Initialize the GS308EP parser."""
        super().__init__()


class GS31xSeries(PageParser):
    """Parser for the GS31x switch series."""

    def __init__(self) -> None:
        """Initialize the GS31xSeries parser."""
        super().__init__()

    def parse_switch_metadata(self, page: Response | BaseResponse) -> dict[str, Any]:
        """Parse switch info from the html page."""
        tree = html.fromstring(page.content)

        switch_name = get_first_value(tree, '//input[@name="switchName"]')
        switch_serial_number = get_text_from_next_element(
            tree, '//p[contains(text(),"Serial Number")]'
        )
        self._switch_bootloader = "unknown"
        self._switch_firmware = get_text_from_next_element(
            tree, '//p[contains(text(),"Firmware Version")]'
        )

        return {
            "switch_name": switch_name,
            "switch_serial_number": switch_serial_number,
            "switch_bootloader": self._switch_bootloader,
            "switch_firmware": self._switch_firmware,
        }

    def parse_client_hash(self, page: Response | BaseResponse) -> str | None:
        """Return None as these switches do not have a hash value."""
        del page
        return None

    def parse_led_status(self, page: Response | BaseResponse) -> dict[str, Any]:
        """Parse status of the front panel LEDs from the html page."""
        tree = html.fromstring(page.content)
        xpath = tree.xpath('//input[@id="ledStatus"]')
        if xpath:
            led_status = xpath[0].checked
        return {"led_status": "on" if led_status else "off"}

    def parse_port_status(
        self, page: Response | BaseResponse, ports: int
    ) -> dict[int, dict[str, Any]]:
        """Parse port status from the html page."""
        tree = html.fromstring(page.content)
        xtree_port_statusses = tree.xpath('//span[contains(@class,"status-on-port")]')
        xtree_port_attributes = tree.xpath('//div[@class="port-status"]')
        if len(xtree_port_statusses) != ports or len(xtree_port_attributes) != ports:
            message = (
                "Port count mismatch: Expected %s, got %s (status) and %s (attributes)",
                ports,
                len(xtree_port_statusses),
                len(xtree_port_attributes),
            )
            raise NetgearPlusPageParserError(message)
        status_by_port = {}
        for port_nr0 in range(ports):
            port_nr = port_nr0 + 1
            port_state_text = xtree_port_statusses[port_nr0].text
            port_attributes = xtree_port_attributes[port_nr0].xpath("./div/div/p")
            modus_speed_text = port_attributes[1].text
            connection_speed_text = strip_duplex(port_attributes[3].text)

            status_by_port[port_nr] = {
                "status": port_state_text,
                "modus_speed": modus_speed_text,
                "connection_speed": connection_speed_text,
            }

        self.port_status = status_by_port
        _LOGGER.debug("Port Status is %s", self.port_status)
        return status_by_port

    def parse_port_statistics(
        self, page: Response | BaseResponse, ports: int
    ) -> dict[str, Any]:
        """Parse port statistics from the html page."""
        tree = html.fromstring(page.content)
        rx = []
        tx = []
        crc = []

        page_inputs = tree.xpath("//table/tr/td")

        for port_nr in range(1, ports + 1):
            try:
                rx_value = int(page_inputs[port_nr * 4 + 1].text)
            except (IndexError, ValueError):
                rx_value = 0
            rx.append(rx_value)
            try:
                tx_value = int(page_inputs[port_nr * 4 + 2].text)
            except (IndexError, ValueError):
                tx_value = 0
            tx.append(tx_value)
            try:
                crc_value = int(page_inputs[port_nr * 4 + 3].text)
            except (IndexError, ValueError):
                crc_value = 0
            crc.append(crc_value)

        io_zeros = [0] * ports
        return {
            "traffic_rx": rx,
            "traffic_tx": tx,
            "sum_rx": rx,
            "sum_tx": tx,
            "crc_errors": crc,
            "speed_io": io_zeros,
        }

    def parse_poe_port_config(self, page: Response | BaseResponse) -> dict[str, Any]:
        """Parse PoE port configuration from the html page."""
        switch_data = {}
        tree = html.fromstring(page.content)
        poe_port_config = {}
        poe_port_admin_state_x = tree.xpath(
            '//div[@id="devicesContainer"]//div[contains(@class,"port-wrap")]//span[contains(@class,"admin-state")]'
        )
        for i, x in enumerate(poe_port_admin_state_x):
            poe_port_config[i + 1] = (
                "on" if x.text.lower() in POE_PORT_ENABLED_STATUS else "off"
            )

        for poe_port_nr, poe_power_config in poe_port_config.items():
            switch_data[f"port_{poe_port_nr}_poe_power_active"] = poe_power_config
        return switch_data

    def parse_poe_port_status(self, page: Response | BaseResponse) -> dict[str, Any]:
        """Parse PoE port status from the html page."""
        switch_data = {}
        tree = html.fromstring(page.content)
        poe_output_power = {}
        poe_output_power_x = tree.xpath(
            '//div[contains(@class,"port-wrap")]//p[contains(@class,"OutputPower-text")]'
        )
        for i, x in enumerate(poe_output_power_x):
            try:
                poe_output_power[i + 1] = float(x.text)
            except ValueError:
                poe_output_power[i + 1] = 0.0

        for poe_port_nr, poe_power_status in poe_output_power.items():
            switch_data[f"port_{poe_port_nr}_poe_output_power"] = poe_power_status
        return switch_data


class GS316EP(GS31xSeries):
    """Parser for the GS316EP switch."""

    def __init__(self) -> None:
        """Initialize the GS316EP parser."""
        super().__init__()


class GS316EPP(GS31xSeries):
    """Parser for the GS316EPP switch."""

    def __init__(self) -> None:
        """Initialize the GS316EPP parser."""
        super().__init__()


class JGSxxxSeries(PageParser):
    """Parser for the JGSxxx switch models."""

    META_DATA_PARTS = 9
    META_DATA_NAME = 1
    META_DATA_SERIAL_NUMBER = 8
    META_DATA_FIRMWARE = 3

    def __init__(self) -> None:
        """Initialize the GS108E parser."""
        super().__init__()

    def parse_switch_metadata(self, page: Response | BaseResponse) -> dict[str, Any]:
        """Parse switch info from the html page."""
        switch_metadata = []
        result = re.search("sysGeneInfor = '([^']+)';", page.content.decode("utf8"))
        if result:
            switch_metadata = result.group(1).split("?")
        if len(switch_metadata) != self.META_DATA_PARTS:
            message = (
                "Switch metadata contains"
                f" {len(switch_metadata)} elements instead of "
                f"{self.META_DATA_PARTS}: {switch_metadata}"
            )
            raise NetgearPlusPageParserError(message)

        switch_name = switch_metadata[self.META_DATA_NAME]
        switch_serial_number = switch_metadata[self.META_DATA_SERIAL_NUMBER]
        self._switch_bootloader = "unknown"
        self._switch_firmware = switch_metadata[self.META_DATA_FIRMWARE]

        return {
            "switch_name": switch_name,
            "switch_serial_number": switch_serial_number,
            "switch_bootloader": self._switch_bootloader,
            "switch_firmware": self._switch_firmware,
        }

    def parse_client_hash(self, page: Response | BaseResponse) -> str | None:
        """Parse the client hash from the html page."""
        result = re.search("secureRand = '([^']+)';", page.content.decode("utf8"))
        if result and len(result.groups()):
            return result.group(1)
        return None

    def parse_port_status(
        self, page: Response | BaseResponse, ports: int
    ) -> dict[int, dict[str, Any]]:
        """Parse port status from the html page."""
        result = re.findall(
            r"portConfigEntry\[([0-9]+)\] = '([^']+)';", page.content.decode("utf8")
        )
        if len(result) != ports:
            message = (
                "Port count mismatch: Expected %s, got %s",
                ports,
                len(result),
            )
            raise NetgearPlusPageParserError(message)

        status_by_port = {}
        for status in result:
            port_nr = int(status[0]) + 1
            modus_speed_text = status[1].split("?")[3]
            port_state_text = status[1].split("?")[2]
            connection_speed_text = strip_duplex(status[1].split("?")[4])

            status_by_port[port_nr] = {
                "status": port_state_text,
                "modus_speed": modus_speed_text,
                "connection_speed": connection_speed_text,
            }

        return status_by_port

    def parse_port_statistics(
        self, page: Response | BaseResponse, ports: int
    ) -> dict[str, Any]:
        """Parse port statistics from the html page."""
        result = re.findall(
            r"StatisticsEntry\[([0-9]+)\] = '([^']+)';", page.content.decode("utf8")
        )
        if len(result) != ports:
            message = (
                "Port count mismatch: Expected %s, got %s",
                ports,
                len(result),
            )
            raise NetgearPlusPageParserError(message)

        rx = []
        tx = []
        crc = []

        for port_nr in range(ports):
            statistics_entry = result[port_nr][1].split("?")
            rx.append(int(statistics_entry[1]))
            tx.append(int(statistics_entry[2]))
            crc.append(int(statistics_entry[3]))

        io_zeros = [0] * ports
        return {
            "traffic_rx": rx,
            "traffic_tx": tx,
            "sum_rx": rx,
            "sum_tx": tx,
            "crc_errors": crc,
            "speed_io": io_zeros,
        }

    def parse_error(self, page: Response | BaseResponse) -> str | None:
        """Parse error from the html page."""
        tree = html.fromstring(page.content)
        error_msg = tree.xpath('//div[@class="pwdErrStyle"]')
        if error_msg:
            return error_msg[0].text
        return None


class JGS516PE(JGSxxxSeries):
    """Parser for the JGS516EP switch."""

    def __init__(self) -> None:
        """Initialize the JGS516EP parser."""
        super().__init__()


class JGS524Ev2(JGSxxxSeries):
    """Parser for the JGS524Ev2 switch."""

    def __init__(self) -> None:
        """Initialize the JGS524Ev2 parser."""
        super().__init__()


class GS116Ev2(JGSxxxSeries):
    """Parser for the GS116Ev2 switch."""

    def __init__(self) -> None:
        """Initialize the GS116Ev2 parser."""
        super().__init__()


class GS108T(PageParser):
    """Parser for the Netgear GS108T / GS108Tv2 managed switch.

    The UI is iframe-based with pages under /base/system/.
    Login has no rand/hash — plain pwd field only.
    Ports are named g1..g8 in HTML table rows.
    """

    def __init__(self) -> None:
        """Initialize the GS108T parser."""
        super().__init__()
        self._switch_firmware = "unknown"
        self._switch_bootloader = "unknown"
        self._snmp_host: str | None = None
        self._snmp_community: str = "public"
        self._snmp_cache: dict = {}

    def has_api_v2(self) -> bool:
        """GS108T uses a proprietary HTML UI, not the standard v1/v2 API."""
        return False

    def parse_switch_metadata(self, page: Response) -> dict[str, Any]:
        """Parse sysInfo.html — Versions table + sysName input."""
        tree = html.fromstring(page.content)

        name_elems = tree.xpath('//input[@name="sysName"]')
        switch_name = name_elems[0].value if name_elems else ""

        serial_elems = tree.xpath(
            '//td[contains(text(),"Serial Number")]/following-sibling::td[1]'
        )
        switch_serial_number = (
            serial_elems[0].text_content().strip() if serial_elems else ""
        )

        # Versions table: header row + one data row
        # cols: Model Name | Boot Version | Software Version
        version_rows = tree.xpath('//table[@id="versions"]/tr[position()>1]')
        if version_rows:
            tds = version_rows[0].xpath("./td")
            self._switch_bootloader = (
                tds[1].text_content().strip() if len(tds) > 1 else "unknown"
            )
            self._switch_firmware = (
                tds[2].text_content().strip() if len(tds) > 2 else "unknown"
            )

        return {
            "switch_name": switch_name,
            "switch_serial_number": switch_serial_number,
            "switch_bootloader": self._switch_bootloader,
            "switch_firmware": self._switch_firmware,
        }

    def parse_client_hash(self, page: Response) -> str | None:
        """GS108T has no client hash — session cookie only."""
        return None

    def parse_port_status(
        self, page: Response, ports: int
    ) -> dict[int, dict[str, Any]]:
        """Parse port_cfg.html.

        Row layout (TR class='font10'):
          td[1]  checkbox
          td[2]  port label: g1..g8
          td[3]  description (empty)
          td[4]  port type (empty)
          td[5]  Admin Mode: Enable/Disable
          td[6]  Port Speed config: Auto / MbpsFullDuplex100 / ...
          td[7]  Physical Status: '1000 Mbps Full Duplex' / empty
          td[8]  Link Status: 'Link Up' / 'Link Down'
        """
        tree = html.fromstring(page.content)
        rows = tree.xpath('//tr[@class="font10"]')

        status_by_port: dict[int, dict[str, Any]] = {}
        for row in rows:
            tds = row.xpath("./td")
            if len(tds) < 8:
                continue
            port_label = tds[1].text_content().strip()
            if not port_label.startswith("g"):
                continue
            try:
                port_nr = int(port_label[1:])
            except ValueError:
                continue

            link_status = tds[7].text_content().strip()
            modus = tds[5].text_content().strip()

            # Use SNMP ifSpeed for accurate link speed if available
            snmp = self._snmp_cache or {}
            port_snmp = snmp.get(port_nr, {})
            speed_bps = port_snmp.get("speed_bps", 0)
            oper_status = port_snmp.get("oper_status", None)

            if speed_bps:
                mbps = speed_bps // 1_000_000
                if mbps >= 10000:
                    connection_speed = "10G"
                elif mbps >= 5000:
                    connection_speed = "5G"
                elif mbps >= 2500:
                    connection_speed = "2.5G"
                elif mbps >= 1000:
                    connection_speed = "1G"
                elif mbps >= 100:
                    connection_speed = "100M"
                else:
                    connection_speed = "10M"
            else:
                # fallback to HTML physical status column
                phys_speed = tds[6].text_content().strip()
                speed_map = {"1000": "1G", "100": "100M", "10": "10M"}
                connection_speed = ""
                for prefix, label in speed_map.items():
                    if phys_speed.startswith(prefix):
                        connection_speed = label
                        break

            if oper_status is not None:
                status_text = "Up" if oper_status == 1 else "Down"
            else:
                status_text = "Up" if link_status == "Link Up" else "Down"

            status_by_port[port_nr] = {
                "status": status_text,
                "modus_speed": modus,
                "connection_speed": connection_speed,
            }

        self.port_status = status_by_port
        _LOGGER.debug("GS108T port status: %s", self.port_status)
        return status_by_port

    def parse_port_statistics(
        self, page: Response, ports: int
    ) -> dict[str, Any]:
        """Use SNMP ifTable for accurate octet counters (falls back to HTML)."""
        if self._snmp_host:
            try:
                import sys
                import os
                # find our custom_component dir (two levels up from this file)
                cc_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
                if cc_dir not in sys.path:
                    sys.path.insert(0, cc_dir)
                from snmp_client import snmp_get_if_table
                snmp = snmp_get_if_table(self._snmp_host, self._snmp_community, ports=ports)
                self._snmp_cache = snmp
                rx  = [snmp[p]["in_octets"]  for p in range(1, ports + 1)]
                tx  = [snmp[p]["out_octets"] for p in range(1, ports + 1)]
                crc = [0] * ports
                io_zeros = [0] * ports
                return {
                    "traffic_rx": rx,
                    "traffic_tx": tx,
                    "sum_rx": rx,
                    "sum_tx": tx,
                    "crc_errors": crc,
                    "speed_io": io_zeros,
                }
            except Exception as exc:  # noqa: BLE001
                _LOGGER.warning("GS108T SNMP failed, falling back to HTML: %s", exc)
                self._snmp_cache = {}

        # HTML fallback (packet counters, not octets)
        tree = html.fromstring(page.content)
        rows = tree.xpath('//tr[@class="font10"]')
        rx = [0] * ports
        tx = [0] * ports
        crc = [0] * ports

        def _int(td: Any) -> int:
            try:
                return int(td.text_content().strip())
            except (ValueError, AttributeError):
                return 0

        for row in rows:
            tds = row.xpath("./td")
            if len(tds) < 7:
                continue
            port_label = tds[1].text_content().strip()
            if not port_label.startswith("g"):
                continue
            try:
                port_idx = int(port_label[1:]) - 1
            except ValueError:
                continue
            if port_idx < 0 or port_idx >= ports:
                continue
            rx[port_idx] = _int(tds[2])
            crc[port_idx] = _int(tds[3])
            tx[port_idx] = _int(tds[5])

        io_zeros = [0] * ports
        return {
            "traffic_rx": rx,
            "traffic_tx": tx,
            "sum_rx": rx,
            "sum_tx": tx,
            "crc_errors": crc,
            "speed_io": io_zeros,
        }


PARSERS = get_all_child_classes_dict(PageParser)
