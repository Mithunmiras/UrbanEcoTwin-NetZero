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
        # Calculate composite environmental index
        pollution_factor = zone["current_aqi"] / 500  # Normalized 0-1
        traffic_factor = zone["traffic_index"] / 100
        green_factor = 1 - (zone["green_cover_pct"] / 100)
        renewable_factor = 1 - (zone["renewable_energy_pct"] / 100)

        environmental_stress = round(
            (pollution_factor * 0.35 + traffic_factor * 0.25 +
             green_factor * 0.20 + renewable_factor * 0.20) * 100, 1
        )

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
                    "rainfall_mm_annual": zone["rainfall_mm_annual"],
                },
                "traffic": {
                    "traffic_index": zone["traffic_index"],
                    "ev_adoption_pct": zone["ev_adoption_pct"],
                },
                "demographics": {
                    "population": zone["population"],
                    "area_sq_km": zone["area_sq_km"],
                    "population_density": round(zone["population"] / zone["area_sq_km"]),
                },
                "infrastructure": {
                    "green_cover_pct": zone["green_cover_pct"],
                    "renewable_energy_pct": zone["renewable_energy_pct"],
                    "tree_count": zone["tree_count"],
                    "solar_panels": zone["solar_panels_installed"],
                    "factories": zone["factories"],
                },
            },
            "environmental_stress_index": environmental_stress,
            "data_quality_score": 94.5,  # Simulated
            "fusion_confidence": 0.92,
        })

    return {
        "fused_zones": fused,
        "total_data_sources": 5,
        "fusion_method": "Weighted Multi-Source Integration",
        "last_updated": __import__("datetime").datetime.now().isoformat(),
    }
