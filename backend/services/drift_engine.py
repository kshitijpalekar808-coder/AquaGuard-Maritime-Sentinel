"""
Service: Lagrangian Ocean Hydrodynamic Drift Backtracking Engine & Live Metocean API
"""
import math
import requests
from datetime import datetime, timedelta

class DriftEngine:
    @staticmethod
    def fetch_live_winds(lat, lon, u_curr=0.15, v_curr=-0.10, fallback_u=0.28, fallback_v=-0.19):
        """
        Queries Open-Meteo Marine/Atmospheric API for real-time 10m surface winds.
        Applies the empirical 3% wind drift law: V_drift = V_curr + 0.03 * V_wind.
        Falls back to regional calibrated corridor climatology if offline or rate-limited.
        """
        try:
            url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=wind_speed_10m,wind_direction_10m&wind_speed_unit=ms"
            res = requests.get(url, timeout=2.0)
            if res.status_code == 200:
                data = res.json()
                w_spd = float(data["current"]["wind_speed_10m"])
                w_dir = float(data["current"]["wind_direction_10m"])
                
                # Oceanographic drift angle (wind pushes TOWARDS)
                drift_bearing_deg = (w_dir + 180.0) % 360.0
                rad = math.radians(drift_bearing_deg)
                u_wind = w_spd * math.sin(rad)
                v_wind = w_spd * math.cos(rad)

                u_net = round(u_curr + (0.03 * u_wind), 3)
                v_net = round(v_curr + (0.03 * v_wind), 3)
                source_label = f"Open-Meteo Live API ({w_spd:.1f} m/s @ {w_dir:.0f}°)"
                return {
                    "u_drift": u_net,
                    "v_drift": v_net,
                    "wind_speed": w_spd,
                    "wind_direction": w_dir,
                    "source": source_label
                }
        except Exception:
            pass

        return {
            "u_drift": fallback_u,
            "v_drift": fallback_v,
            "wind_speed": 5.8,
            "wind_direction": 240.0,
            "source": "Calibrated Indian EEZ Climatology (5.8 m/s)"
        }

    @staticmethod
    def haversine_km(lat1, lon1, lat2, lon2):
        R = 6371.0
        dlat, dlon = math.radians(lat2 - lat1), math.radians(lon2 - lon1)
        a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
        return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    def backtrack_origin(self, sighting_lat, sighting_lon, u_drift, v_drift, hours=6.0):
        """
        Rewinds Lagrangian advection by hours to pinpoint the original discharge coordinate.
        """
        dt_sec = hours * 3600.0
        dx_m = -(u_drift * dt_sec)
        dy_m = -(v_drift * dt_sec)

        orig_lat = round(sighting_lat + (dy_m / 111139.0), 4)
        orig_lon = round(sighting_lon + (dx_m / (111139.0 * math.cos(math.radians(sighting_lat)))), 4)

        drift_dist_km = self.haversine_km(sighting_lat, sighting_lon, orig_lat, orig_lon)
        net_drift_speed_knots = (math.sqrt(u_drift**2 + v_drift**2) * 1.94384)

        t_sighting = datetime.utcnow()
        t_discharge = t_sighting - timedelta(hours=hours)

        return {
            "sighting_coords": {"lat": sighting_lat, "lon": sighting_lon},
            "discharge_coords": {"lat": orig_lat, "lon": orig_lon},
            "drift_distance_km": round(drift_dist_km, 2),
            "drift_speed_knots": round(net_drift_speed_knots, 2),
            "hours_rewound": hours,
            "sighting_time_utc": t_sighting.strftime("%Y-%m-%d %H:%M:%S UTC"),
            "discharge_time_utc": t_discharge.strftime("%Y-%m-%d %H:%M:%S UTC")
        }
