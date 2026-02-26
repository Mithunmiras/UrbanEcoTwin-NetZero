"""
Synthetic city data for 5 Chennai zones.
Provides realistic environmental, traffic, and demographic data.
"""

import random
import math
from datetime import datetime

ZONES = {
    "adyar": {
        "name": "Adyar",
        "lat": 13.0012,
        "lng": 80.2565,
        "population": 218823,
        "area_sq_km": 6.75,
        "base_co2_ppm": 420,
        "base_aqi": 112,
        "green_cover_pct": 28.5,
        "industrial_density": 0.15,
        "traffic_index": 68,
        "renewable_energy_pct": 12.0,
        "avg_temperature_c": 30.2,
        "avg_humidity_pct": 72,
        "avg_wind_speed_kmh": 14.5,
        "rainfall_mm_annual": 1400,
        "ev_adoption_pct": 3.2,
        "tree_count": 14500,
        "solar_panels_installed": 320,
        "factories": 8,
    },
    "t_nagar": {
        "name": "T Nagar",
        "lat": 13.0418,
        "lng": 80.2341,
        "population": 198450,
        "area_sq_km": 4.5,
        "base_co2_ppm": 465,
        "base_aqi": 145,
        "green_cover_pct": 15.2,
        "industrial_density": 0.35,
        "traffic_index": 89,
        "renewable_energy_pct": 8.0,
        "avg_temperature_c": 31.5,
        "avg_humidity_pct": 68,
        "avg_wind_speed_kmh": 10.2,
        "rainfall_mm_annual": 1350,
        "ev_adoption_pct": 2.1,
        "tree_count": 6800,
        "solar_panels_installed": 140,
        "factories": 22,
    },
    "velachery": {
        "name": "Velachery",
        "lat": 12.9815,
        "lng": 80.2180,
        "population": 253400,
        "area_sq_km": 7.2,
        "base_co2_ppm": 440,
        "base_aqi": 128,
        "green_cover_pct": 22.0,
        "industrial_density": 0.25,
        "traffic_index": 76,
        "renewable_energy_pct": 10.5,
        "avg_temperature_c": 30.8,
        "avg_humidity_pct": 70,
        "avg_wind_speed_kmh": 12.8,
        "rainfall_mm_annual": 1380,
        "ev_adoption_pct": 2.8,
        "tree_count": 11200,
        "solar_panels_installed": 245,
        "factories": 15,
    },
    "anna_nagar": {
        "name": "Anna Nagar",
        "lat": 13.0850,
        "lng": 80.2101,
        "population": 175600,
        "area_sq_km": 5.8,
        "base_co2_ppm": 395,
        "base_aqi": 95,
        "green_cover_pct": 35.0,
        "industrial_density": 0.10,
        "traffic_index": 55,
        "renewable_energy_pct": 18.0,
        "avg_temperature_c": 29.8,
        "avg_humidity_pct": 74,
        "avg_wind_speed_kmh": 15.5,
        "rainfall_mm_annual": 1420,
        "ev_adoption_pct": 5.1,
        "tree_count": 21000,
        "solar_panels_installed": 520,
        "factories": 4,
    },
    "guindy": {
        "name": "Guindy",
        "lat": 13.0067,
        "lng": 80.2206,
        "population": 165200,
        "area_sq_km": 5.1,
        "base_co2_ppm": 480,
        "base_aqi": 158,
        "green_cover_pct": 18.5,
        "industrial_density": 0.45,
        "traffic_index": 82,
        "renewable_energy_pct": 6.5,
        "avg_temperature_c": 31.8,
        "avg_humidity_pct": 66,
        "avg_wind_speed_kmh": 11.0,
        "rainfall_mm_annual": 1320,
        "ev_adoption_pct": 1.8,
        "tree_count": 8500,
        "solar_panels_installed": 95,
        "factories": 32,
    },
}


def get_all_zones():
    """Return all zone data with computed current readings."""
    result = []
    for zone_id, zone in ZONES.items():
        # Add slight random variation to simulate real-time readings
        hour = datetime.now().hour
        # Diurnal CO₂ variation — higher in rush hours
        diurnal_factor = 1 + 0.08 * math.sin((hour - 8) * math.pi / 12)
        current_co2 = round(zone["base_co2_ppm"] * diurnal_factor + random.uniform(-5, 5), 1)
        current_aqi = round(zone["base_aqi"] * diurnal_factor + random.uniform(-3, 3))

        result.append({
            "id": zone_id,
            **zone,
            "current_co2_ppm": current_co2,
            "current_aqi": current_aqi,
        })
    return result


def get_zone(zone_id: str):
    """Return data for a specific zone."""
    zone = ZONES.get(zone_id)
    if not zone:
        return None
    hour = datetime.now().hour
    diurnal_factor = 1 + 0.08 * math.sin((hour - 8) * math.pi / 12)
    current_co2 = round(zone["base_co2_ppm"] * diurnal_factor + random.uniform(-5, 5), 1)
    current_aqi = round(zone["base_aqi"] * diurnal_factor + random.uniform(-3, 3))
    return {
        "id": zone_id,
        **zone,
        "current_co2_ppm": current_co2,
        "current_aqi": current_aqi,
    }
