"""
MODULE 7: Net-Zero Planning Engine
Generates Net-Zero roadmap with year-by-year milestones.
"""

from data.city_data import get_all_zones
from datetime import datetime


def generate_netzero_roadmap():
    """Generate a comprehensive Net-Zero roadmap for the city."""
    zones = get_all_zones()
    city_total_co2 = sum(z["current_co2_ppm"] for z in zones)
    city_avg_co2 = city_total_co2 / len(zones)

    current_year = datetime.now().year
    target_year = current_year + 13  # Net-Zero target

    # Generate year-by-year milestones
    milestones = []
    remaining_reduction = city_avg_co2 - 350  # Target: 350 ppm (safe level)

    phases = [
        {
            "phase": "Phase 1: Foundation",
            "years": [current_year, current_year + 1, current_year + 2],
            "reduction_pct": 15,
            "actions": [
                "Deploy air quality monitoring network across all zones",
                "Launch urban tree-planting initiative (25,000 trees)",
                "Implement industrial emission auditing",
                "Establish green building codes for new construction",
            ],
        },
        {
            "phase": "Phase 2: Acceleration",
            "years": [current_year + 3, current_year + 4, current_year + 5],
            "reduction_pct": 30,
            "actions": [
                "Scale solar panel deployment to 10,000 installations",
                "Launch EV transition program with 40% subsidy",
                "Implement smart traffic management in all zones",
                "Convert 30% of public transport to electric",
            ],
        },
        {
            "phase": "Phase 3: Transformation",
            "years": [current_year + 6, current_year + 7, current_year + 8, current_year + 9],
            "reduction_pct": 55,
            "actions": [
                "Achieve 50% renewable energy grid mix",
                "Full EV transition for public transport",
                "Implement carbon capture in industrial zones",
                "Expand green cover to 40% across all zones",
            ],
        },
        {
            "phase": "Phase 4: Net-Zero Achievement",
            "years": [current_year + 10, current_year + 11, current_year + 12, current_year + 13],
            "reduction_pct": 100,
            "actions": [
                "Achieve 80% renewable energy",
                "Full carbon neutrality in industrial sector",
                "Carbon credit surplus generation",
                "Become carbon-negative city by offset programs",
            ],
        },
    ]

    cumulative_reduction = 0
    for phase in phases:
        phase_reduction = remaining_reduction * (phase["reduction_pct"] - cumulative_reduction) / 100
        projected_co2 = round(city_avg_co2 - (remaining_reduction * phase["reduction_pct"] / 100), 1)
        cumulative_reduction = phase["reduction_pct"]

        milestones.append({
            "phase": phase["phase"],
            "year_range": f"{phase['years'][0]}-{phase['years'][-1]}",
            "target_co2_ppm": projected_co2,
            "reduction_from_baseline_pct": phase["reduction_pct"],
            "key_actions": phase["actions"],
            "status": "in_progress" if phase["years"][0] <= current_year else "planned",
        })

    # Zone-specific targets
    zone_targets = []
    for zone in zones:
        zone_targets.append({
            "zone_id": zone["id"],
            "zone_name": zone["name"],
            "current_co2_ppm": zone["current_co2_ppm"],
            "target_co2_ppm": 350,
            "required_reduction_ppm": round(zone["current_co2_ppm"] - 350, 1),
            "estimated_netzero_year": current_year + (8 if zone["current_co2_ppm"] < 420 else 11 if zone["current_co2_ppm"] < 450 else 13),
            "feasibility": "High" if zone["current_co2_ppm"] < 420 else "Medium" if zone["current_co2_ppm"] < 460 else "Challenging",
        })

    return {
        "city": "Chennai",
        "baseline_co2_ppm": round(city_avg_co2, 1),
        "target_co2_ppm": 350,
        "target_year": target_year,
        "net_zero_achievable": True,
        "milestones": milestones,
        "zone_targets": zone_targets,
        "total_investment_estimate_inr": "₹12,500 Crore",
        "carbon_credits_potential": "₹850 Crore over plan duration",
        "generated_at": datetime.now().isoformat(),
    }
