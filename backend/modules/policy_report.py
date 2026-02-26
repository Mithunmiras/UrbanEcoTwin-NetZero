"""
MODULE 12: Policy Report Generator
Generates structured government-ready reports.
"""

from datetime import datetime
from data.city_data import get_all_zones
from modules.sustainability_score import get_sustainability_scores
from modules.carbon_credits import calculate_carbon_credits
from modules.netzero_planner import generate_netzero_roadmap


def generate_report():
    """Generate comprehensive policy report."""
    zones = get_all_zones()
    scores = get_sustainability_scores()
    credits = calculate_carbon_credits()
    roadmap = generate_netzero_roadmap()

    city_avg_co2 = sum(z["current_co2_ppm"] for z in zones) / len(zones)
    city_avg_aqi = sum(z["current_aqi"] for z in zones) / len(zones)

    report = {
        "title": "Urban Sustainability & Net-Zero Planning Report",
        "subtitle": "AI-Powered Environmental Intelligence for Chennai Metropolitan Area",
        "generated_at": datetime.now().isoformat(),
        "report_id": f"UR-{datetime.now().strftime('%Y%m%d-%H%M')}",
        "executive_summary": {
            "city": "Chennai",
            "zones_analyzed": len(zones),
            "current_avg_co2_ppm": round(city_avg_co2, 1),
            "current_avg_aqi": round(city_avg_aqi),
            "sustainability_grade": scores["city_grade"],
            "sustainability_score": scores["city_average_score"],
            "net_zero_target_year": roadmap["target_year"],
            "net_zero_feasible": roadmap["net_zero_achievable"],
            "total_carbon_credit_potential": credits["city_totals"]["total_credits_inr"],
        },
        "current_state": {
            "pollution_overview": [
                {
                    "zone": z["name"],
                    "co2_ppm": z["current_co2_ppm"],
                    "aqi": z["current_aqi"],
                }
                for z in zones
            ],
            "worst_zone": max(zones, key=lambda z: z["current_co2_ppm"])["name"],
            "best_zone": min(zones, key=lambda z: z["current_co2_ppm"])["name"],
        },
        "sustainability_analysis": {
            "scores": scores["zone_scores"],
            "city_average": scores["city_average_score"],
        },
        "recommendations": [
            {
                "priority": "Critical",
                "action": "Implement immediate emission caps in Guindy industrial zone",
                "expected_impact": "25-30% CO₂ reduction in industrial areas",
                "timeline": "0-6 months",
                "estimated_cost": "₹15 Crore",
            },
            {
                "priority": "High",
                "action": "Deploy 5,000 solar panels across T Nagar and Velachery",
                "expected_impact": "15% renewable energy increase",
                "timeline": "6-12 months",
                "estimated_cost": "₹12.5 Crore",
            },
            {
                "priority": "High",
                "action": "Launch urban tree planting drive (50,000 trees across all zones)",
                "expected_impact": "10-12% CO₂ absorption increase",
                "timeline": "12-24 months",
                "estimated_cost": "₹2.5 Crore",
            },
            {
                "priority": "Medium",
                "action": "Transition 40% public transport to electric vehicles",
                "expected_impact": "20% transport emission reduction",
                "timeline": "24-36 months",
                "estimated_cost": "₹200 Crore",
            },
        ],
        "net_zero_roadmap_summary": {
            "target_year": roadmap["target_year"],
            "phases": len(roadmap["milestones"]),
            "total_investment": roadmap["total_investment_estimate_inr"],
            "carbon_credits_potential": roadmap["carbon_credits_potential"],
        },
        "carbon_economics": credits["city_totals"],
    }

    return report
