"""
Windows NTFS Security Shield
Fixes WinError 1337 (Invalid SID) & WindowsApps / WpSystem permission traps
"""
import os
import errno
import pathlib

# 1. Patch Path.exists directly
_orig_path_exists = pathlib.Path.exists
def _safe_path_exists(self, *args, **kwargs):
    s = str(self)
    if "WpSystem" in s or "WindowsApps" in s:
        if ".git" in s.lower():
            return False
    try:
        return _orig_path_exists(self, *args, **kwargs)
    except Exception:
        return False

pathlib.Path.exists = _safe_path_exists

# 2. Patch Path.is_dir
_orig_path_is_dir = pathlib.Path.is_dir
def _safe_path_is_dir(self, *args, **kwargs):
    s = str(self)
    if "WpSystem" in s and ".git" in s.lower():
        return False
    try:
        return _orig_path_is_dir(self, *args, **kwargs)
    except Exception:
        return False

pathlib.Path.is_dir = _safe_path_is_dir

# 3. Patch Path.stat
_orig_path_stat = pathlib.Path.stat
def _safe_path_stat(self, *args, **kwargs):
    s = str(self)
    if "WpSystem" in s and ".git" in s.lower():
        raise FileNotFoundError(errno.ENOENT, os.strerror(errno.ENOENT), s)
    try:
        return _orig_path_stat(self, *args, **kwargs)
    except OSError as e:
        if getattr(e, "winerror", None) in (1337, 5) or "WpSystem" in s:
            raise FileNotFoundError(errno.ENOENT, os.strerror(errno.ENOENT), s) from None
        raise

pathlib.Path.stat = _safe_path_stat

# 4. Patch os.stat
_orig_stat = os.stat
def _safe_stat(path, *args, **kwargs):
    s = str(path)
    if "WpSystem" in s and ".git" in s.lower():
        raise FileNotFoundError(errno.ENOENT, os.strerror(errno.ENOENT), s)
    try:
        return _orig_stat(path, *args, **kwargs)
    except OSError as e:
        if getattr(e, "winerror", None) in (1337, 5) or "WpSystem" in s:
            raise FileNotFoundError(errno.ENOENT, os.strerror(errno.ENOENT), s) from None
        raise

os.stat = _safe_stat
