"""
MODULE 2: Data Fusion Engine
Combines multiple datasets (pollution, weather, traffic, population) into unified profiles.
"""

from data.city_data import get_all_zones


def fuse_data():
    """Merge all environmental data sources into unified zone profiles."""
    zones = get_all_zones()
    fused = []
    for zone in zones:
        # Calculate composite environmental index (only using live API data)
        pollution_factor = zone["current_aqi"] / 500  # Normalized 0-1
        # Environmental stress based purely on live pollution data
        environmental_stress = round(pollution_factor * 100, 1)

        fused.append({
            "zone_id": zone["id"],
            "zone_name": zone["name"],
            "data_sources": {
                "pollution": {
                    "co2_ppm": zone["current_co2_ppm"],
                    "aqi": zone["current_aqi"],
                },
                "weather": {
                    "temperature_c": zone["avg_temperature_c"],
                    "humidity_pct": zone["avg_humidity_pct"],
                    "wind_speed_kmh": zone["avg_wind_speed_kmh"],
                },
            },
            "environmental_stress_index": environmental_stress,
        })

    return {
        "fused_zones": fused,
        "total_data_sources": 2,
        "fusion_method": "Live API Data Only (Open-Meteo + OpenWeatherMap)",
        "last_updated": __import__("datetime").datetime.now().isoformat(),
    }
