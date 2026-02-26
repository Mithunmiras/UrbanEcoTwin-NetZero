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


def get_digital_twin(city=None):
    """Returns the full digital twin state for all zones."""
    zones = get_all_zones(city=city)
    twin_data = []
    for zone in zones:
        risk = classify_risk(zone["current_co2_ppm"], zone["current_aqi"])
        twin_data.append({
            "id": zone["id"],
            "name": zone["name"],
            "lat": zone["lat"],
            "lng": zone["lng"],
            "current_co2_ppm": zone["current_co2_ppm"],
            "current_aqi": zone["current_aqi"],
            "avg_temperature_c": zone.get("avg_temperature_c"),
            "avg_humidity_pct": zone.get("avg_humidity_pct"),
            "avg_wind_speed_kmh": zone.get("avg_wind_speed_kmh"),
            "pm10": zone.get("pm10", 0),
            "pm2_5": zone.get("pm2_5", 0),
            "carbon_monoxide_ugm3": zone.get("carbon_monoxide_ugm3", 0),
            "nitrogen_dioxide_ugm3": zone.get("nitrogen_dioxide_ugm3", 0),
            "sulphur_dioxide_ugm3": zone.get("sulphur_dioxide_ugm3", 0),
            "ozone_ugm3": zone.get("ozone_ugm3", 0),
            "risk_level": risk,
            "risk_color": RISK_COLORS[risk],
            "source": zone.get("source", "live"),
            "api_source": zone.get("api_source", "Open-Meteo"),
            "tree_count": zone.get("tree_count"),
            "solar_panels_installed": zone.get("solar_panels_installed"),
            "factories": zone.get("factories"),
        })
    return {
        "city": "Chennai",
        "total_zones": len(twin_data),
        "timestamp": __import__("datetime").datetime.now().isoformat(),
        "zones": twin_data,
    }
