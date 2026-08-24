"""Utility functions for Dreame Mower Implementation.

This module provides common utility functions for file downloads and other
shared operations across the Dreame Mower integration.
"""

from __future__ import annotations

import logging
import os
from typing import Callable, Optional, Dict, Any

import requests

_LOGGER = logging.getLogger(__name__)


def download_file(
    file_path: str,
    get_download_url: Callable[[str], Optional[str]],
    hass_config_dir: str,
    timeout: int = 30,
) -> Optional[Dict[str, Any]]:
    """Download a file from cloud storage and save it to local filesystem.
    
    The file will be saved mirroring the directory structure from the given file_path.
    For example, if file_path is "ali_dreame/2025/10/11/user/device_file.tbz2",
    the file will be saved to "<hass_config_dir>/www/dreame/ali_dreame/2025/10/11/user/device_file.tbz2".
    
    Files are always downloaded and saved in binary mode, which works for both binary
    files (e.g., .tbz2, .pack) and text files (e.g., .json, .txt).
    
    Args:
        file_path: Cloud file path (used as-is for directory structure)
        get_download_url: Function that takes file_path and returns a signed download URL
        hass_config_dir: The Home Assistant configuration directory
        timeout: HTTP request timeout in seconds (default: 30)
        
    Returns:
        Dictionary with download info on success:
        {
            "path": original cloud file path,
            "local_path": full local filesystem path,
            "size_bytes": file size in bytes
        }
        Returns None on failure.
    """
    if not file_path:
        _LOGGER.warning("No file path provided for download")
        return None

    try:
        # Get the download URL from cloud service
        download_url = get_download_url(file_path)
        if not download_url:
            _LOGGER.warning("No download URL available for file: %s", file_path)
            return None

        _LOGGER.info("Downloading file from: %s", file_path)
        
        # Download the file
        resp = requests.get(download_url, timeout=timeout)
        resp.raise_for_status()

        # Construct the save path mirroring the cloud directory structure
        save_path = os.path.join(hass_config_dir, "www", "dreame", file_path)
        
        # Create the directory structure if it doesn't exist
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        
        # Write the file content in binary mode (works for all file types)
        with open(save_path, "wb") as f:
            f.write(resp.content)

        file_size = len(resp.content)
        _LOGGER.info("File downloaded successfully to: %s (%d bytes)", save_path, file_size)
        
        return {
            "path": file_path,
            "local_path": save_path,
            "size_bytes": file_size
        }
        
    except requests.exceptions.RequestException as ex:
        _LOGGER.warning("Failed to download file %s: %s", file_path, ex)
        return None
    except OSError as ex:
        _LOGGER.error("Failed to save file %s: %s", file_path, ex)
        return None
    except Exception as ex:
        _LOGGER.error("Unexpected error downloading file %s: %s", file_path, ex)
        return None
