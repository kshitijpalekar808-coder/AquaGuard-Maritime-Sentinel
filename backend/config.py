"""
Maritime Sentinel: Global Configuration & Parameters
SIH 26143 • NTRO Problem Statement
"""
import os
from pathlib import Path

# Base Paths
BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"
MODEL_PATH = MODELS_DIR / "best.pt"
DATA_DIR = BASE_DIR / "data"
SAMPLES_DIR = DATA_DIR / "sample_scenes"
STATIC_DIR = BASE_DIR / "frontend" / "static"
OUTPUTS_DIR = STATIC_DIR / "outputs"
TEMPLATES_DIR = BASE_DIR / "frontend" / "templates"

os.makedirs(OUTPUTS_DIR, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(SAMPLES_DIR, exist_ok=True)

# Detection & Physics Thresholds
CONF_THRESHOLD = 0.35
EDGE_GRADIENT_THRESHOLD = 22.0
MIN_AREA_KM2 = 0.35
DEFAULT_DRIFT_HOURS = 6.0

# Indian EEZ Maritime Corridors with Hydrodynamic Current Baselines
MARITIME_CORRIDORS = [
    {
        "id": "mumbai_high",
        "name": "Mumbai High Shipping Corridor",
        "lat": 19.1245,
        "lon": 71.8412,
        "u_curr": 0.15,
        "v_curr": -0.10,
        "u_fallback": 0.28,
        "v_fallback": -0.19
    },
    {
        "id": "gulf_of_kutch",
        "name": "Gulf of Kutch Tanker Terminal",
        "lat": 22.4180,
        "lon": 69.1520,
        "u_curr": 0.18,
        "v_curr": -0.05,
        "u_fallback": 0.35,
        "v_fallback": -0.12
    },
    {
        "id": "cochin_route",
        "name": "Cochin International Tanker Route",
        "lat": 9.7820,
        "lon": 75.8840,
        "u_curr": 0.12,
        "v_curr": -0.18,
        "u_fallback": 0.22,
        "v_fallback": -0.31
    },
    {
        "id": "goa_karwar",
        "name": "Goa-Karwar Coastal Patrol Sector",
        "lat": 15.3400,
        "lon": 73.4200,
        "u_curr": 0.10,
        "v_curr": -0.12,
        "u_fallback": 0.18,
        "v_fallback": -0.22
    },
    {
        "id": "bay_of_bengal",
        "name": "Bay of Bengal (Paradip Approach)",
        "lat": 19.8200,
        "lon": 86.9100,
        "u_curr": -0.14,
        "v_curr": 0.12,
        "u_fallback": -0.25,
        "v_fallback": 0.20
    },
    {
        "id": "palk_strait",
        "name": "Palk Strait Surveillance Zone",
        "lat": 9.8500,
        "lon": 79.9200,
        "u_curr": -0.08,
        "v_curr": -0.10,
        "u_fallback": -0.15,
        "v_fallback": -0.18
    }
]

# Registered Fleet in Indian Waters
FLEET_REGISTRY = [
    {"name": "MT ARABIAN BREEZE",  "imo": "IMO9511200", "type_code": 80, "type": "Crude Tanker", "length": 244, "width": 42, "draft": 14.2},
    {"name": "MT BHARAT RATNA",    "imo": "IMO9387401", "type_code": 80, "type": "Crude Tanker", "length": 238, "width": 42, "draft": 13.8},
    {"name": "MT GULF HORIZON",    "imo": "IMO9615309", "type_code": 80, "type": "Crude Tanker", "length": 274, "width": 48, "draft": 15.5},
    {"name": "MT NORDIC STAR",     "imo": "IMO9498224", "type_code": 80, "type": "Crude Tanker", "length": 240, "width": 42, "draft": 14.0},
    {"name": "MT CASPIAN LEADER",  "imo": "IMO9553102", "type_code": 80, "type": "Crude Tanker", "length": 245, "width": 43, "draft": 14.4},
    {"name": "MT DESH SHANTI",     "imo": "IMO9295787", "type_code": 80, "type": "Crude Tanker", "length": 280, "width": 50, "draft": 16.2},
    {"name": "MV CHENNAI EXPRESS", "imo": "IMO9321456", "type_code": 70, "type": "Container Cargo", "length": 299, "width": 40, "draft": 12.1},
    {"name": "EVER GIVEN",         "imo": "IMO9811000", "type_code": 70, "type": "Container Cargo", "length": 400, "width": 59, "draft": 14.5},
    {"name": "MAERSK MC-KINNEY",   "imo": "IMO9619907", "type_code": 70, "type": "Container Cargo", "length": 399, "width": 59, "draft": 14.8},
    {"name": "MT PACIFIC GLORY",   "imo": "IMO9412345", "type_code": 80, "type": "Crude Tanker", "length": 274, "width": 48, "draft": 15.6},
    {"name": "MT FRONT ALTAIR",    "imo": "IMO9745902", "type_code": 80, "type": "Crude Tanker", "length": 250, "width": 44, "draft": 14.9},
    {"name": "MT STENA BULK",      "imo": "IMO9688118", "type_code": 80, "type": "Product Tanker", "length": 260, "width": 45, "draft": 15.2},
    {"name": "ICGS SAMRAT",        "imo": "IMO0000001", "type_code": 90, "type": "Coast Guard Patrol", "length": 105, "width": 14, "draft": 4.5}
]
