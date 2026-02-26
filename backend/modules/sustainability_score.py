"""
MODULE 9: Sustainability Score Engine
Scores each zone 0–100 based on environmental factors.
"""

from data.city_data import get_all_zones


def _calculate_score(zone):
    """Calculate sustainability score (0-100) for a zone using only live API data."""
    # Weighted scoring based on live pollution and weather data only
    co2_score = max(0, min(100, (500 - zone["current_co2_ppm"]) / 2))
    aqi_score = max(0, min(100, (300 - zone["current_aqi"]) / 2))
    pm25_score = max(0, min(100, (100 - zone.get("pm2_5", 0)) * 2))
    pm10_score = max(0, min(100, (200 - zone.get("pm10", 0)) / 2))

    total = (
        co2_score * 0.30 +
        aqi_score * 0.30 +
        pm25_score * 0.25 +
        pm10_score * 0.15
    )

    return round(total, 1)


def _get_grade(score):
    if score >= 85:
        return "A+"
    elif score >= 75:
        return "A"
    elif score >= 65:
        return "B+"
    elif score >= 55:
        return "B"
    elif score >= 45:
        return "C"
    elif score >= 35:
        return "D"
    else:
        return "F"


def get_sustainability_scores():
    """Calculate sustainability scores for all zones."""
    zones = get_all_zones()
    scores = []

    for zone in zones:
        score = _calculate_score(zone)
        grade = _get_grade(score)

        # Factor breakdown (live API data only)
        breakdown = {
            "air_quality": round(max(0, min(100, (300 - zone["current_aqi"]) / 2)), 1),
            "carbon_emissions": round(max(0, min(100, (500 - zone["current_co2_ppm"]) / 2)), 1),
            "pm25_quality": round(max(0, min(100, (100 - zone.get("pm2_5", 0)) * 2)), 1),
            "pm10_quality": round(max(0, min(100, (200 - zone.get("pm10", 0)) / 2)), 1),
        }

        scores.append({
            "zone_id": zone["id"],
            "zone_name": zone["name"],
            "sustainability_score": score,
            "grade": grade,
            "breakdown": breakdown,
            "improvement_areas": [
                k for k, v in sorted(breakdown.items(), key=lambda x: x[1])[:3]
            ],
        })

    # City average
    city_avg = round(sum(s["sustainability_score"] for s in scores) / len(scores), 1)

    return {
        "city": "Chennai",
        "city_average_score": city_avg,
        "city_grade": _get_grade(city_avg),
        "zone_scores": sorted(scores, key=lambda x: x["sustainability_score"], reverse=True),
        "scoring_factors": ["Air Quality", "Carbon Emissions", "Green Cover", "Renewable Energy", "Transport", "EV Adoption"],
    }
