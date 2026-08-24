"""Mower control property handling for Dreame Mower Implementation.

This module provides parsing and handling for Service 2 mower control properties:
- 2:56 - Mower control status (pause/continue/completed operations)

The property manages mower operational state changes like pause, continue, and completion commands.
Supported status codes:
- -1: Queued — zone is waiting to be mowed in a multi-zone session
-  0: Continue / actively mowing
-  2: Completed/Stopped
-  4: Pause operation

During zone mowing the status array contains one entry per zone:
    [[zone_id, status_code], ...]  (e.g. [[1, -1], [3, 0]] = zone 1 queued, zone 3 active)
"""

from __future__ import annotations

import json
import logging
from typing import Dict, Any
from enum import Enum

_LOGGER = logging.getLogger(__name__)

# Property name constants for notifications
MOWER_CONTROL_STATUS_PROPERTY_NAME = "mower_control_status"

# Control status field constants
CONTROL_ACTION_FIELD = "action"
CONTROL_STATUS_FIELD = "status"
CONTROL_VALUE_FIELD = "value"
CONTROL_ZONES_FIELD = "zones"


class MowerControlAction(Enum):
    """Mower control action enumeration."""
    QUEUED = "queued"      # zone waiting in a multi-zone session
    CONTINUE = "continue"  # actively mowing
    PAUSE = "pause"
    COMPLETED = "completed"


# Maps raw status codes from piid=56 entries to actions
_STATUS_CODE_TO_ACTION: dict[int, MowerControlAction] = {
    -1: MowerControlAction.QUEUED,
     0: MowerControlAction.CONTINUE,
     2: MowerControlAction.COMPLETED,
     4: MowerControlAction.PAUSE,
}


class MowerControlStatusHandler:
    """Handler for mower control status property (2:56)."""
    
    def __init__(self) -> None:
        """Initialize mower control status handler."""
        self._action: MowerControlAction | None = None
        self._status_code: int | None = None
        self._raw_status: list[list[int]] | None = None
        self._zone_entries: list[list[int]] = []
    
    def parse_value(self, value: Any) -> bool:
        """Parse mower control status value."""
        try:
            if not isinstance(value, dict):
                _LOGGER.warning("Invalid mower control status value type: %s", type(value))
                return False
            
            # Extract status array - required field
            if "status" not in value:
                raise ValueError("Missing 'status' field in mower control data")
            
            status_array = value["status"]
            if not isinstance(status_array, list):
                raise ValueError(f"Invalid status array format: {status_array}")
            
            self._raw_status = status_array
            
            # Handle empty status array as valid case (no active zone session)
            if len(status_array) == 0:
                self._status_code = None
                self._action = None
                self._zone_entries = []
                return True
            
            # Validate and collect all entries [[zone_id, status_code], ...]
            zone_entries: list[list[int]] = []
            for entry in status_array:
                if not isinstance(entry, list) or len(entry) < 2:
                    raise ValueError(f"Invalid status entry format: {entry}")
                code = int(entry[1])
                if code not in _STATUS_CODE_TO_ACTION:
                    _LOGGER.warning(
                        "Unknown mower control status code: %d in message %s",
                        code, status_array
                    )
                    return False
                zone_entries.append([entry[0], code])
            
            self._zone_entries = zone_entries
            
            # Primary action: use the actively-mowing zone (code=0), fall back to first entry
            primary = next((e for e in zone_entries if e[1] == 0), zone_entries[0])
            self._status_code = primary[1]
            self._action = _STATUS_CODE_TO_ACTION[self._status_code]
            
            return True
            
        except (KeyError, ValueError, TypeError, IndexError) as ex:
            _LOGGER.error("Failed to parse mower control status - invalid format: %s", ex)
            return False
        except Exception as ex:
            _LOGGER.error("Failed to parse mower control status: %s", ex)
            return False
    
    def get_notification_data(self) -> Dict[str, Any]:
        """Get mower control notification data for Home Assistant."""
        return {
            CONTROL_ACTION_FIELD: self._action.value if self._action else None,
            CONTROL_STATUS_FIELD: self._status_code,
            CONTROL_VALUE_FIELD: self._raw_status,
            CONTROL_ZONES_FIELD: self._zone_entries,
        }
    
    # Properties for direct access
    @property
    def status_code(self) -> int | None:
        """Return raw status code (0=continue, 2=completed, 4=pause, etc.)."""
        return self._status_code
    
    @property
    def action(self) -> MowerControlAction | None:
        """Return mower control action enum."""
        return self._action
    
    @property
    def raw_status(self) -> list[list[int]] | None:
        """Return raw status array."""
        return self._raw_status

    @property
    def zone_entries(self) -> list[list[int]]:
        """Return all zone entries [[zone_id, status_code], ...] from last parse."""
        return self._zone_entries
    
    @property
    def is_paused(self) -> bool | None:
        """Return True if mower is paused."""
        return self._action == MowerControlAction.PAUSE if self._action else None
    
    @property
    def is_continuing(self) -> bool | None:
        """Return True if mower is continuing."""
        return self._action == MowerControlAction.CONTINUE if self._action else None
    
    @property
    def is_completed(self) -> bool | None:
        """Return True if mower has completed/stopped."""
        return self._action == MowerControlAction.COMPLETED if self._action else None


class MowerControlPropertyHandler:
    """Combined handler for mower control properties with state management."""
    
    def __init__(self) -> None:
        """Initialize mower control property handler."""
        self._status_handler = MowerControlStatusHandler()
        
        # State storage for mower control
        self._current_action: MowerControlAction | None = None
        self._last_status_code: int | None = None
    
    def handle_property_update(self, siid: int, piid: int, value: Any, notify_callback) -> bool:
        """Handle mower control property update.
        
        This is the main entry point for mower control property 2:56.
        
        Args:
            siid: Service instance ID
            piid: Property instance ID  
            value: Property value from MQTT
            notify_callback: Callback function for property change notifications
            
        Returns:
            True if property was handled successfully, False otherwise
        """
        from ..const import MOWER_CONTROL_STATUS_PROPERTY
        
        try:
            # Handle mower control status (2:56)
            if MOWER_CONTROL_STATUS_PROPERTY.matches(siid, piid):
                return self._handle_status_property(value, notify_callback)
            else:
                # Not a mower control property
                return False
                
        except Exception as ex:
            _LOGGER.error("Failed to handle mower control property %d:%d: %s", siid, piid, ex)
            return False
    
    def _handle_status_property(self, value: Any, notify_callback) -> bool:
        """Handle mower control status (2:56)."""
        # Store old values for change detection
        old_action = self._current_action
        old_status_code = self._last_status_code
        
        if self._status_handler.parse_value(value):
            # Update state
            self._current_action = self._status_handler.action
            self._last_status_code = self._status_handler.status_code
            
            # Send notification
            status_data = self._status_handler.get_notification_data()
            notify_callback(MOWER_CONTROL_STATUS_PROPERTY_NAME, status_data)
            
            # Notify individual state changes for backward compatibility
            if old_action != self._current_action:
                notify_callback("mower_action", self._current_action.value if self._current_action else None)
            if old_status_code != self._last_status_code:
                notify_callback("mower_status_code", self._last_status_code)
            
            return True
        else:
            _LOGGER.warning("Failed to parse mower control status value: %s", value)
            return False

    # Device state properties
    @property
    def current_action(self) -> MowerControlAction | None:
        """Return current mower control action."""
        return self._current_action
    
    @property
    def last_status_code(self) -> int | None:
        """Return last status code."""
        return self._last_status_code
    
    @property
    def is_paused(self) -> bool | None:
        """Return True if mower is currently paused."""
        return self._current_action == MowerControlAction.PAUSE if self._current_action else None
    
    @property
    def is_continuing(self) -> bool | None:
        """Return True if mower is currently continuing."""
        return self._current_action == MowerControlAction.CONTINUE if self._current_action else None
    
    @property
    def is_completed(self) -> bool | None:
        """Return True if mower has completed/stopped."""
        return self._current_action == MowerControlAction.COMPLETED if self._current_action else None