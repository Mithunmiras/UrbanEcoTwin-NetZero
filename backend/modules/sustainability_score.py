"""
MODULE 9: Sustainability Score Engine
Scores each zone 0–100 based on environmental factors.
"""

from data.city_data import get_all_zones


def _calculate_score(zone):
    """Calculate sustainability score (0-100) for a zone."""
    # Weighted scoring based on multiple factors
    co2_score = max(0, min(100, (500 - zone["current_co2_ppm"]) / 2))
    aqi_score = max(0, min(100, (300 - zone["current_aqi"]) / 2))
    green_score = min(100, zone["green_cover_pct"] * 2.5)
    renewable_score = min(100, zone["renewable_energy_pct"] * 4)
    traffic_score = max(0, 100 - zone["traffic_index"])
    ev_score = min(100, zone["ev_adoption_pct"] * 15)

    total = (
        co2_score * 0.25 +
        aqi_score * 0.20 +
        green_score * 0.20 +
        renewable_score * 0.15 +
        traffic_score * 0.10 +
        ev_score * 0.10
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

        # Factor breakdown
        breakdown = {
            "air_quality": round(max(0, min(100, (300 - zone["current_aqi"]) / 2)), 1),
            "carbon_emissions": round(max(0, min(100, (500 - zone["current_co2_ppm"]) / 2)), 1),
            "green_cover": round(min(100, zone["green_cover_pct"] * 2.5), 1),
            "renewable_energy": round(min(100, zone["renewable_energy_pct"] * 4), 1),
            "transport": round(max(0, 100 - zone["traffic_index"]), 1),
            "ev_adoption": round(min(100, zone["ev_adoption_pct"] * 15), 1),
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
