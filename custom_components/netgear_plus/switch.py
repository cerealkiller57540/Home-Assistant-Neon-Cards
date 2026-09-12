"""Module to set up the Netgear PoE switch entities for Home Assistant."""

import logging

from homeassistant.components.switch import SwitchDeviceClass
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from . import NetgearSwitchConfigEntry
from .netgear_entities import (
    NetgearBinarySensorEntityDescription,
    NetgearLedSwitchEntity,
    NetgearPOESwitchEntity,
    NetgearPortAdminSwitchEntity,
)

_LOGGER = logging.getLogger(__name__)

# Ports dont la coupure casserait l'infra : pas d'interrupteur cree du tout.
# Le port 3 porte le bond du NAS ; le couper depuis HA rendrait le NAS
# injoignable, y compris le partage \\.60\config dont HA lui-meme depend.
# Surchargeable par l'option "protected_ports" de l'entree.
DEFAULT_PROTECTED_PORTS = [3]


async def async_setup_entry(
    hass: HomeAssistant,
    config_entry: NetgearSwitchConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the Fritzbox smarthome switch from config_entry."""
    del hass
    entities = []
    gs_switch = config_entry.runtime_data.gs_switch
    coordinator_switch_infos = config_entry.runtime_data.coordinator_switch_infos

    if gs_switch.api and gs_switch.api.poe_ports and len(gs_switch.api.poe_ports) > 0:
        _LOGGER.info(
            "[switch.async_setup_entry] setting up Platform.SWITCH for %s Switch Ports",
            len(gs_switch.api.poe_ports),
        )

        for poe_port in gs_switch.api.poe_ports:
            switch_entity = NetgearPOESwitchEntity(
                coordinator=coordinator_switch_infos,
                hub=gs_switch,
                entity_description=NetgearBinarySensorEntityDescription(
                    key=f"port_{poe_port}_poe_power_active",
                    name=f"Port {poe_port} PoE Power",
                    device_class=SwitchDeviceClass.OUTLET,
                ),
                port_nr=poe_port,
            )

            entities.append(switch_entity)

    # Activation administrative des ports (SNMP RW). L'entite n'est creee que si
    # la cle admin_status existe, c'est-a-dire uniquement par le chemin SNMP.
    data = coordinator_switch_infos.data or {}
    protected = set(
        config_entry.options.get("protected_ports", DEFAULT_PROTECTED_PORTS)
    )
    if gs_switch.api:
        for port_nr in range(1, gs_switch.api.ports + 1):
            key = f"port_{port_nr}_admin_status"
            if key not in data:
                continue
            if port_nr in protected:
                _LOGGER.info(
                    "[switch.async_setup_entry] port %s protege, pas d'interrupteur",
                    port_nr,
                )
                continue
            entities.append(
                NetgearPortAdminSwitchEntity(
                    coordinator=coordinator_switch_infos,
                    hub=gs_switch,
                    entity_description=NetgearBinarySensorEntityDescription(
                        key=key,
                        name=f"Port {port_nr} Enabled",
                        device_class=SwitchDeviceClass.SWITCH,
                    ),
                    port_nr=port_nr,
                )
            )

    if gs_switch.api and gs_switch.api.switch_model.has_led_switch():  # type: ignore call-issue
        _LOGGER.info(
            "[switch.async_setup_entry] setting up Platform.SWITCH for Front Panel LEDs"
        )

        switch_entity = NetgearLedSwitchEntity(
            coordinator=coordinator_switch_infos,
            hub=gs_switch,
            entity_description=NetgearBinarySensorEntityDescription(
                key="led_status",
                name="Front Panel LEDs",
                device_class=SwitchDeviceClass.SWITCH,
            ),
        )

        entities.append(switch_entity)

    async_add_entities(entities)
