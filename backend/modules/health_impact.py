"""
MODULE 11: Health Impact Predictor
Predicts health risk based on pollution levels.
"""

from data.city_data import get_all_zones


def _classify_health_risk(aqi: int, co2: float):
    """Classify health risk based on AQI and CO₂."""
    if aqi >= 200 or co2 >= 500:
        return {
            "level": "Severe",
            "color": "#dc2626",
            "index": 5,
            "description": "Health emergency — entire population likely affected",
            "advisory": "Avoid all outdoor activities. Use air purifiers indoors. Vulnerable groups should seek medical attention.",
        }
    elif aqi >= 150 or co2 >= 460:
        return {
            "level": "Very Unhealthy",
            "color": "#ea580c",
            "index": 4,
            "description": "Serious health effects for general population",
            "advisory": "Limit outdoor exposure. Wear N95 masks if going outside. Keep windows closed.",
        }
    elif aqi >= 100 or co2 >= 430:
        return {
            "level": "Unhealthy",
            "color": "#f59e0b",
            "index": 3,
            "description": "Health effects for sensitive groups, discomfort for general population",
            "advisory": "Sensitive groups should limit outdoor activity. General population may experience mild effects.",
        }
    elif aqi >= 50 or co2 >= 400:
        return {
            "level": "Moderate",
            "color": "#84cc16",
            "index": 2,
            "description": "Acceptable quality, minor concern for sensitive individuals",
            "advisory": "Unusually sensitive people should consider reducing prolonged outdoor exertion.",
        }
    else:
        return {
            "level": "Good",
            "color": "#22c55e",
            "index": 1,
            "description": "Air quality is satisfactory, minimal health risk",
            "advisory": "Air quality is good. Enjoy outdoor activities.",
        }


HEALTH_CONDITIONS = [
    {"condition": "Respiratory Issues", "aqi_threshold": 100, "prevalence_factor": 0.12},
    {"condition": "Cardiovascular Risk", "aqi_threshold": 150, "prevalence_factor": 0.08},
    {"condition": "Asthma Exacerbation", "aqi_threshold": 80, "prevalence_factor": 0.15},
    {"condition": "Eye Irritation", "aqi_threshold": 120, "prevalence_factor": 0.20},
    {"condition": "Headaches & Fatigue", "aqi_threshold": 90, "prevalence_factor": 0.18},
]


def get_health_impact():
    """Predict health impact for all zones."""
    zones = get_all_zones()
    results = []

    for zone in zones:
        risk = _classify_health_risk(zone["current_aqi"], zone["current_co2_ppm"])

        # Estimate affected population
        affected_conditions = []
        total_affected = 0
        for cond in HEALTH_CONDITIONS:
            if zone["current_aqi"] >= cond["aqi_threshold"]:
                affected = int(zone["population"] * cond["prevalence_factor"])
                total_affected += affected
                affected_conditions.append({
                    "condition": cond["condition"],
                    "estimated_affected": affected,
                })

        results.append({
            "zone_id": zone["id"],
            "zone_name": zone["name"],
            "current_aqi": zone["current_aqi"],
            "current_co2_ppm": zone["current_co2_ppm"],
            "health_risk": risk,
            "population": zone["population"],
            "estimated_total_affected": total_affected,
            "affected_conditions": affected_conditions,
        })

    # City-level summary
    total_pop = sum(z["population"] for z in zones)
    total_affected = sum(r["estimated_total_affected"] for r in results)

    return {
        "health_impact_analysis": results,
        "city_summary": {
            "total_population": total_pop,
            "total_estimated_affected": total_affected,
            "affected_percentage": round((total_affected / total_pop) * 100, 1) if total_pop > 0 else 0,
            "highest_risk_zone": max(results, key=lambda x: x["health_risk"]["index"])["zone_name"],
        },
    }
