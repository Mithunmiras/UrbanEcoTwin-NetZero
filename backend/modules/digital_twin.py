"""
MODULE 1: Urban Digital Twin
Creates a virtual model of the city with zone-level environmental state.
"""

from data.city_data import get_all_zones, get_zone


def classify_risk(co2: float, aqi: int) -> str:
    """Classify zone risk level based on CO₂ and AQI."""
    if aqi >= 150 or co2 >= 470:
        return "Critical"
    elif aqi >= 120 or co2 >= 440:
        return "High"
    elif aqi >= 90 or co2 >= 410:
        return "Medium"
    else:
        return "Low"


RISK_COLORS = {
    "Critical": "#ef4444",
    "High": "#f97316",
    "Medium": "#eab308",
    "Low": "#22c55e",
}


def get_digital_twin():
    """Returns the full digital twin state for all zones."""
    zones = get_all_zones()
    twin_data = []
    for zone in zones:
        risk = classify_risk(zone["current_co2_ppm"], zone["current_aqi"])
        twin_data.append({
            "id": zone["id"],
            "name": zone["name"],
            "lat": zone["lat"],
            "lng": zone["lng"],
            "population": zone["population"],
            "area_sq_km": zone["area_sq_km"],
            "current_co2_ppm": zone["current_co2_ppm"],
            "current_aqi": zone["current_aqi"],
            "green_cover_pct": zone["green_cover_pct"],
            "traffic_index": zone["traffic_index"],
            "renewable_energy_pct": zone["renewable_energy_pct"],
            "risk_level": risk,
            "risk_color": RISK_COLORS[risk],
            "tree_count": zone["tree_count"],
            "solar_panels_installed": zone["solar_panels_installed"],
            "factories": zone["factories"],
        })
    return {
        "city": "Chennai",
        "total_zones": len(twin_data),
        "timestamp": __import__("datetime").datetime.now().isoformat(),
        "zones": twin_data,
    }
