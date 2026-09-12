"""HomeAssistant Setup for Netgear API."""

from __future__ import annotations

import asyncio
import logging
from abc import abstractmethod
from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_HOST, CONF_PASSWORD
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.update_coordinator import (
    CoordinatorEntity,
    DataUpdateCoordinator,
)
from .py_netgear_plus_local import NetgearSwitchConnector
from .py_netgear_plus_local import __version__ as api_version

from .const import DOMAIN
from .errors import CannotLoginError

_LOGGER = logging.getLogger(__name__)


def get_api(host: str, password: str = "") -> NetgearSwitchConnector:
    """Get the Netgear API and login to it."""
    api: NetgearSwitchConnector = NetgearSwitchConnector(host, password)
    api.autodetect_model()
    _LOGGER.info(
        "Created NetgearSwitchConnector API version %s for model %s.",
        str(api_version),
        str(api.switch_model.MODEL_NAME),
    )
    # Only login if password is not empty.
    # This allows to call get_unique_id before the user has provided a password
    #
    # GS108T : le daemon HTTP du firmware 2010 tombe par periodes et la page
    # port_cfg.html est de toute facon inexploitable (tronquee en plein milieu
    # du port 3, aucune ligne portID). Tout ce dont l'integration a besoin est
    # lu en SNMP. On ne fait donc plus echouer le setup sur un login HTTP :
    # sans cookie, l'entree monte quand meme et les capteurs SNMP remontent.
    logged_in = False
    if password:
        try:
            logged_in = bool(api.get_login_cookie())
        except Exception:  # noqa: BLE001 - LoginFailedError & co : non bloquant en SNMP
            _LOGGER.debug("Login HTTP en echec sur %s", host, exc_info=True)
    if password and not logged_in:
        if getattr(api._page_parser, "_snmp_host", None):  # noqa: SLF001
            _LOGGER.warning(
                "Login HTTP impossible sur %s ; on continue en SNMP seul.", host
            )
        else:
            raise CannotLoginError
    return api


class HomeAssistantNetgearSwitch:
    """Class to manage the Netgear switch integration with Home Assistant."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        """Initialize the HomeAssistantNetgearSwitch class."""
        if not entry.unique_id:
            error_message = "ConfigEntry must have a unique_id"
            raise ValueError(error_message)
        self.hass = hass
        self.entry = entry
        self.entry_id = entry.entry_id
        self.unique_id = entry.unique_id
        self.device_name = entry.title
        self._host: str = entry.data[CONF_HOST]
        self._password = entry.data[CONF_PASSWORD]
        # Communaute SNMP en ECRITURE, utilisee seulement pour ifAdminStatus.
        # La lecture reste sur "public" (cf. parsers.py). Surchargeable par
        # l'option "snmp_write_community" de l'entree, sans toucher au code.
        self.snmp_write_community: str = entry.options.get(
            "snmp_write_community", "private"
        )

        # set on setup
        self.api: NetgearSwitchConnector | None = None
        self.model = None
        self.hw_version: str | None = None
        self.sw_version: str | None = None
        self.serial_number: str | None = None

        # async lock
        self.api_lock = asyncio.Lock()

    def _setup(self) -> bool:
        self.api = get_api(host=self._host, password=self._password)
        if not self.api.switch_model:
            _LOGGER.info(
                "[HomeAssistantNetgearSwitch._setup] "
                "No NetgearSwitchConnector switch_model set, "
                "autodetecting model via NetgearSwitchConnector.autodetect_model()"
            )
            self.api.autodetect_model()
            _LOGGER.info(
                "[HomeAssistantNetgearSwitch._setup] Autodetected model: %s",
                str(self.api.switch_model),
            )
        self.model = self.api.switch_model.MODEL_NAME
        # MODEL_NAME vient de MODELS et vaut "GS108T" : la revision materielle y est
        # perdue. NETGEAR-INVENTORY-MIB donne le modele exact ("GS108Tv2"), c'est
        # celui-la qu'on affiche. Echec non fatal : on garde MODEL_NAME.
        try:
            from .snmp_client import snmp_get_hardware_info

            hw = snmp_get_hardware_info(self._host)
        except Exception:  # noqa: BLE001
            _LOGGER.debug("Inventaire SNMP indisponible sur %s", self._host)
            hw = {}
        self.model = hw.get("model") or self.model
        # HA prefixe deja le champ par "Materiel" : une valeur nue "A" ne dit rien.
        # "revision A" se lit comme une phrase complete dans la fiche d'appareil.
        hw_rev = hw.get("hw_rev")
        self.hw_version = f"revision {hw_rev}" if hw_rev else None
        try:
            from .snmp_client import snmp_get_entity_info

            entity = snmp_get_entity_info(self._host)
            self.sw_version = entity.get("firmware") or None
            self.serial_number = entity.get("serial_number") or None
        except Exception:  # noqa: BLE001
            self.sw_version = None
            self.serial_number = None
        return True

    async def async_setup(self) -> bool:
        """Set up the Netgear switch asynchronously."""
        async with self.api_lock:
            if not await self.hass.async_add_executor_job(self._setup):
                return False
        return True

    async def async_get_switch_infos(self) -> dict[str, Any] | None:
        """Get switch information asynchronously."""
        async with self.api_lock:
            return await self.hass.async_add_executor_job(self.api.get_switch_infos)  # type: ignore[attr-defined]

    def get_last_raw_response(self) -> str:
        """Return the last bounded and redacted HTTP response diagnostic."""
        if self.api is None:
            return ""
        return self.api.get_last_raw_response()


class NetgearCoordinatorEntity(CoordinatorEntity):
    """Base class for a Netgear router entity."""

    def __init__(
        self, coordinator: DataUpdateCoordinator, switch: HomeAssistantNetgearSwitch
    ) -> None:
        """Initialize a Netgear device."""
        super().__init__(coordinator)
        self._switch = switch
        self._name = switch.device_name
        self._unique_id = switch.unique_id

    @callback
    def _handle_coordinator_update(self) -> None:
        """Handle updated data from the coordinator."""
        super()._handle_coordinator_update()

    @property
    def unique_id(self) -> str:
        """Return a unique ID."""
        return self._unique_id

    @property
    def name(self) -> str:
        """Return the name."""
        return self._name

    @property
    def device_info(self) -> DeviceInfo:
        """Return the device information."""
        # Sans ces champs la fiche d'appareil HA reste vide. model vaut "GS108Tv2"
        # (inventaire SNMP), pas le "GS108T" generique de MODELS.
        return DeviceInfo(
            identifiers={(DOMAIN, self._switch.unique_id)},
            name=self._switch.device_name,
            manufacturer="NETGEAR",
            model=self._switch.model,
            sw_version=self._switch.sw_version,
            hw_version=self._switch.hw_version,
            serial_number=self._switch.serial_number,
            configuration_url=f"http://{self._switch._host}",  # noqa: SLF001
        )


class NetgearAPICoordinatorEntity(NetgearCoordinatorEntity):
    """Base class for a Netgear router entity."""

    def __init__(
        self, coordinator: DataUpdateCoordinator, switch: HomeAssistantNetgearSwitch
    ) -> None:
        """Initialize a Netgear device."""
        super().__init__(coordinator, switch)

    @abstractmethod
    @callback
    def async_update_device(self) -> None:
        """Update the Netgear device."""

    @callback
    def _handle_coordinator_update(self) -> None:
        """Handle updated data from the coordinator."""
        self.async_update_device()
        super()._handle_coordinator_update()
