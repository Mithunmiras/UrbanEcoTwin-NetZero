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
        traffic_factor = zone.get("traffic_index", 70) / 100
        green_factor = 1 - (zone.get("green_cover_pct", 20.0) / 100)
        renewable_factor = 1 - (zone.get("renewable_energy_pct", 10.0) / 100)

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
                    "rainfall_mm_annual": zone.get("rainfall_mm_annual", 1350),
                },
                "traffic": {
                    "traffic_index": zone.get("traffic_index", 70),
                    "ev_adoption_pct": zone.get("ev_adoption_pct", 3.0),
                },
                "demographics": {
                    "population": zone.get("population", 200000),
                    "area_sq_km": zone.get("area_sq_km", 5.0),
                    "population_density": round(zone.get("population", 200000) / zone.get("area_sq_km", 5.0)),
                },
                "infrastructure": {
                    "green_cover_pct": zone.get("green_cover_pct", 20.0),
                    "renewable_energy_pct": zone.get("renewable_energy_pct", 10.0),
                    "tree_count": zone.get("tree_count", 10000),
                    "solar_panels": zone.get("solar_panels_installed", 200),
                    "factories": zone.get("factories", 10),
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
