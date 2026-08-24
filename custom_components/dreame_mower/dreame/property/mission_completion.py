"""Mission completion event handling for Dreame Mower Implementation.

This module provides parsing and handling for Service 4 mission completion events:
- 4:1 - Mission completion event with comprehensive session summary

The event provides detailed information about completed mowing sessions including:
- Progress percentage
- Duration 
- Area covered
- Timestamps
- Mission data file path
- Success status
"""

from __future__ import annotations

import logging
import os
from typing import Dict, Any, List, Callable
from datetime import datetime

from ..utils import download_file

_LOGGER = logging.getLogger(__name__)

# Event name constants for notifications
MISSION_COMPLETION_EVENT_PROPERTY_NAME = "mission_completion_event"

# Mission completion event field constants
PROGRESS_FIELD = "progress_percent"
DURATION_FIELD = "duration_minutes"
AREA_FIELD = "area_sqm"
STATUS_FIELD = "status"  # Task status (piid 7); 1=FINISHED, 2=UNFINISHED, 3=INTERRUPTED
START_TIMESTAMP_FIELD = "start_timestamp"
DATA_FILE_PATH_FIELD = "data_file_path"
UNKNOWN_FIELD_11 = "unknown_field_11"
CHARGING_EVENTS_FIELD = "charging_events"
PLANNED_AREA_FIELD = "planned_area_sqm"  # Planned mowing area for the session in m²
UNKNOWN_FIELD_15 = "unknown_field_15"
STOP_REASON_FIELD = "stop_reason"  # Why the mission ended (piid 60); 101 = low battery / returned to dock early
MAP_NAME_FIELD = "map_name"

# Task status codes (piid 7)
STATUS_FINISHED = 1     # Mission completed normally
STATUS_UNFINISHED = 2   # Mission did not finish
STATUS_INTERRUPTED = 3  # Mission was interrupted (e.g. low battery)


class MissionCompletionEventHandler:
    """Handler for mission completion event (4:1) with detailed session data."""
    
    def __init__(self) -> None:
        """Initialize mission completion event handler."""
        
        # Mission completion data
        self._progress_percent: int | None = None
        self._duration_minutes: int | None = None
        self._area_sqm: float | None = None
        self._status: int | None = None  # piid 7: STATUS_FINISHED/UNFINISHED/INTERRUPTED
        self._start_timestamp: int | None = None
        self._data_file_path: str | None = None
        self._unknown_field_11: int | None = None
        self._stop_reason: int | None = None  # Why the mission ended (piid 60); 101 = low battery
        # Charging events during mission: list of [timestamp, duration_minutes] pairs
        # Each entry represents a charging session that occurred during the mowing mission
        self._charging_events: list | None = None
        self._planned_area_sqm: int | None = None  # Planned mowing area for the session in m²
        self._unknown_field_15: int | None = None  # Purpose unknown - observed values: -1, 2
        self._map_name: str | None = None  # Map identifier the mission was performed on (e.g. "map1")
        
        # Derived data
        self._start_datetime: datetime | None = None
        # Raw content of the mission data file (JSON text) downloaded via device API
        self._data_file_content: str | None = None
    
    def handle_event(self, siid: int, eiid: int, arguments: List[Dict[str, Any]], notify_callback) -> bool:
        """Handle mission completion event.
        
        Args:
            siid: Service instance ID
            eiid: Event instance ID
            arguments: Event arguments with piid/value pairs
            notify_callback: Callback function for event notifications
            
        Returns:
            True if event was handled successfully, False otherwise
        """
        from ..const import MISSION_COMPLETION_EVENT
        
        try:
            # Check if this is the mission completion event
            if not MISSION_COMPLETION_EVENT.matches(siid, eiid):
                return False
            
            return self._parse_mission_completion_event(arguments, notify_callback)
                
        except Exception as ex:
            _LOGGER.error("Failed to handle mission completion event %d:%d: %s", siid, eiid, ex)
            return False
    
    def _parse_mission_completion_event(self, arguments: List[Dict[str, Any]], notify_callback) -> bool:
        """Parse mission completion event arguments."""
        try:
            # Reset previous values
            self._reset_values()
            
            # Parse each argument
            for arg in arguments:
                piid = arg['piid']  # Will raise KeyError if missing
                value = arg['value']  # Will raise KeyError if missing
                
                # Parse known fields based on piid
                if piid == 1:  # Progress percentage
                    self._progress_percent = int(value)
                elif piid == 2:  # Duration in minutes
                    self._duration_minutes = int(value)
                elif piid == 3:  # Area (divide by 100 to get m²)
                    self._area_sqm = float(value) / 100.0  # Convert to m²
                elif piid == 7:  # Task completion status (FINISHED=1, UNFINISHED=2, INTERRUPTED=3)
                    self._status = int(value)
                elif piid == 8:  # Start timestamp
                    self._start_timestamp = int(value)
                    self._start_datetime = datetime.fromtimestamp(value)
                elif piid == 9:  # Data file path
                    self._data_file_path = str(value)
                elif piid == 11:  # Unknown field 11 (possibly success indicator)
                    self._unknown_field_11 = int(value)
                elif piid == 13:  # Charging events during mission
                    # List of [timestamp, duration_minutes] pairs for charging sessions
                    # Example: [[1759318403, 24], [1759328060, 24]]
                    self._charging_events = value
                elif piid == 14:  # Planned area for the mowing session in m²
                    self._planned_area_sqm = int(value)
                elif piid == 15:  # Unknown field 15
                    self._unknown_field_15 = int(value)
                elif piid == 60:  # Stop reason (101 = low battery / returned to dock early)
                    self._stop_reason = int(value)
                elif piid == 16:  # Map name/identifier
                    self._map_name = str(value)
                else:
                    raise ValueError(f"Unknown piid {piid} in mission completion event")
            
            # Create notification data
            event_data = self._get_notification_data()
            notify_callback(MISSION_COMPLETION_EVENT_PROPERTY_NAME, event_data)
            
            # Notify individual fields for backward compatibility
            if self._progress_percent is not None:
                notify_callback("mission_progress_percent", self._progress_percent)
            if self._duration_minutes is not None:
                notify_callback("mission_duration_minutes", self._duration_minutes)
            if self._area_sqm is not None:
                notify_callback("mission_area_sqm", self._area_sqm)
            if self._data_file_path is not None:
                notify_callback("mission_data_file_path", self._data_file_path)
            if self._start_timestamp is not None:
                notify_callback("mission_start_timestamp", self._start_timestamp)
            
            return True
            
        except Exception as ex:
            _LOGGER.error("Failed to parse mission completion event: %s", ex)
            return False
    
    def _reset_values(self) -> None:
        """Reset all stored values."""
        self._progress_percent = None
        self._duration_minutes = None
        self._area_sqm = None
        self._status = None
        self._start_timestamp = None
        self._data_file_path = None
        self._unknown_field_11 = None
        self._charging_events = None
        self._planned_area_sqm = None
        self._unknown_field_15 = None
        self._stop_reason = None
        self._map_name = None
        self._start_datetime = None
        self._data_file_content = None
    
    def _get_notification_data(self) -> Dict[str, Any]:
        """Get mission completion notification data for Home Assistant."""
        return {
            PROGRESS_FIELD: self._progress_percent,
            DURATION_FIELD: self._duration_minutes,
            AREA_FIELD: self._area_sqm,
            STATUS_FIELD: self._status,
            START_TIMESTAMP_FIELD: self._start_timestamp,
            DATA_FILE_PATH_FIELD: self._data_file_path,
            UNKNOWN_FIELD_11: self._unknown_field_11,
            CHARGING_EVENTS_FIELD: self._charging_events,
            PLANNED_AREA_FIELD: self._planned_area_sqm,
            UNKNOWN_FIELD_15: self._unknown_field_15,
            STOP_REASON_FIELD: self._stop_reason,
            MAP_NAME_FIELD: self._map_name,
        }
   
    # Properties for direct access
    @property
    def progress_percent(self) -> int | None:
        """Return mission progress percentage."""
        return self._progress_percent
    
    @property
    def duration_minutes(self) -> int | None:
        """Return mission duration in minutes."""
        return self._duration_minutes
    
    @property
    def area_sqm(self) -> float | None:
        """Return mowed area in square meters."""
        return self._area_sqm
    
    @property
    def start_timestamp(self) -> int | None:
        """Return mission start timestamp."""
        return self._start_timestamp
    
    @property
    def start_datetime(self) -> datetime | None:
        """Return mission start as datetime object."""
        return self._start_datetime
    
    @property
    def data_file_path(self) -> str | None:
        """Return mission data file path (for potential download)."""
        return self._data_file_path
    
    @property
    def data_file_content(self) -> str | None:
        """Return downloaded mission data file raw content (JSON text) if available."""
        return self._data_file_content
    
    def set_data_file_content(self, content: str) -> None:
        """Store downloaded mission data file content.
        
        Args:
            content: Raw JSON (or text) content of the mission data file.
        """
        self._data_file_content = content
    
    @property
    def status(self) -> int | None:
        """Return task completion status (piid 7): 1=FINISHED, 2=UNFINISHED, 3=INTERRUPTED."""
        return self._status

    @property
    def unknown_field_11(self) -> int | None:
        """Return unknown field 11 value (possibly success indicator)."""
        return self._unknown_field_11
    
    @property
    def charging_events(self) -> list | None:
        """Return charging events that occurred during the mission.
        
        Each charging event is a list of [timestamp, duration_minutes]:
        - timestamp: Unix timestamp when charging started
        - duration_minutes: How long the charging session lasted
        
        Example: [[1759318403, 24], [1759328060, 24]] represents two 24-minute
        charging sessions during the mowing mission.
        """
        return self._charging_events
    
    @property
    def planned_area_sqm(self) -> int | None:
        """Return planned mowing area for the session in m²."""
        return self._planned_area_sqm

    @property
    def unknown_field_15(self) -> int | None:
        """Return unknown field 15 value."""
        return self._unknown_field_15

    @property
    def stop_reason(self) -> int | None:
        """Return why the mission ended (piid 60); 101 = low battery / returned to dock early."""
        return self._stop_reason

    @property
    def map_name(self) -> str | None:
        """Return the map identifier the mission was performed on (e.g. 'map1')."""
        return self._map_name

    @property
    def has_data_file(self) -> bool:
        """Return True if mission data file path is available."""
        return self._data_file_path is not None and self._data_file_path != ""
    
    @property
    def is_complete(self) -> bool | None:
        """Return True if the mission completed normally (not interrupted).

        Uses status (piid 7) as the primary signal:
        STATUS_FINISHED (1) → True; STATUS_UNFINISHED (2) or STATUS_INTERRUPTED (3) → False.
        Returns True when status is absent — assume normal completion.
        """
        if self._status is not None:
            return self._status == STATUS_FINISHED
        return True
    
    @property
    def charging_event_count(self) -> int:
        """Return the number of charging events during the mission."""
        return len(self._charging_events) if self._charging_events else 0
    
    @property
    def total_charging_time_minutes(self) -> int:
        """Return total time spent charging during the mission in minutes."""
        if not self._charging_events:
            return 0
        return sum(event[1] for event in self._charging_events if len(event) >= 2)
    
    def get_charging_events_with_datetime(self) -> list[Dict[str, Any]] | None:
        """Return charging events with parsed datetime objects.
        
        Returns:
            List of dicts with keys:
            - timestamp: Unix timestamp
            - datetime: datetime object
            - duration_minutes: Duration of charging session
            - offset_from_start_minutes: Minutes from mission start to this charging event
            
        Returns None if no charging events or no start timestamp available.
        """
        if not self._charging_events or self._start_timestamp is None:
            return None
        
        result = []
        for event in self._charging_events:
            if len(event) < 2:
                continue
            
            timestamp, duration = event[0], event[1]
            offset_minutes = (timestamp - self._start_timestamp) // 60
            
            result.append({
                "timestamp": timestamp,
                "datetime": datetime.fromtimestamp(timestamp),
                "duration_minutes": duration,
                "offset_from_start_minutes": offset_minutes,
            })
        
        return result if result else None
    
    def download_and_set_data_file(self, get_file_download_url: Callable[[str], str | None], hass_config_dir: str) -> bool:
        """
        Download and process the mission data file using a provided URL getter,
        and save it to the HA config directory.
        
        The file will be saved mirroring the directory structure from the data file path.
        
        Args:
            get_file_download_url: A function that takes a file path and returns a download URL.
            hass_config_dir: The path to the Home Assistant configuration directory.
            
        Returns:
            True if the file was downloaded and processed successfully, False otherwise.
        """
        if not self.has_data_file or self._data_file_path is None:
            _LOGGER.warning("No mission data file path available to download.")
            return False

        # Use utility function to download the text file
        result = download_file(
            file_path=self._data_file_path,
            get_download_url=get_file_download_url,
            hass_config_dir=hass_config_dir,
            timeout=15
        )
        
        if result:
            # Also set the content for in-memory processing
            # Re-read the file that was just saved
            try:
                with open(result["local_path"], "r", encoding="utf-8") as f:
                    content = f.read()
                self.set_data_file_content(content)
                return True
            except Exception as ex:
                _LOGGER.warning("Failed to read downloaded mission data file: %s", ex)
                return False
        
        return False