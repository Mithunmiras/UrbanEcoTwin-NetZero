"""
MODULE 4: Scenario Simulation Engine
Simulates sustainability actions and calculates CO₂ impact.
"""

from data.city_data import get_zone


# CO₂ impact factors per action
ACTION_IMPACTS = {
    "plant_trees": {
        "label": "Plant Trees",
        "co2_reduction_per_unit": 0.022,  # ppm per tree
        "unit": "trees",
        "description": "Each tree absorbs ~22kg CO₂/year",
    },
    "add_solar_panels": {
        "label": "Add Solar Panels",
        "co2_reduction_per_unit": 0.15,  # ppm per panel
        "unit": "panels",
        "description": "Each solar panel offsets ~150kg CO₂/year",
    },
    "increase_traffic": {
        "label": "Increase Traffic",
        "co2_reduction_per_unit": -0.005,  # Increases CO₂
        "unit": "vehicles",
        "description": "Each additional vehicle adds ~5kg CO₂/day",
    },
    "add_factory": {
        "label": "Add Factory",
        "co2_reduction_per_unit": -2.5,  # ppm per factory
        "unit": "factories",
        "description": "Each factory emits ~2500kg CO₂/day",
    },
    "ev_transition": {
        "label": "EV Transition",
        "co2_reduction_per_unit": 0.008,  # ppm per vehicle converted
        "unit": "vehicles",
        "description": "Each EV conversion saves ~8kg CO₂/day",
    },
    "green_cover": {
        "label": "Increase Green Cover",
        "co2_reduction_per_unit": 0.5,  # ppm per % increase
        "unit": "percent",
        "description": "Each 1% green cover increase absorbs ~500kg CO₂/year",
    },
}


def simulate_scenario(zone_id: str, actions: list):
    """
    Simulate a set of sustainability actions on a zone.
    
    actions: list of {"action": str, "quantity": int}
    """
    zone = get_zone(zone_id)
    if not zone:
        return {"error": f"Zone '{zone_id}' not found"}

    base_co2 = zone["current_co2_ppm"]
    total_reduction = 0
    action_results = []

    for act in actions:
        action_type = act.get("action", "")
        quantity = act.get("quantity", 0)

        if action_type not in ACTION_IMPACTS:
            continue

        impact_info = ACTION_IMPACTS[action_type]
        reduction = round(impact_info["co2_reduction_per_unit"] * quantity, 2)
        total_reduction += reduction

        action_results.append({
            "action": action_type,
            "label": impact_info["label"],
            "quantity": quantity,
            "unit": impact_info["unit"],
            "co2_change_ppm": reduction,
            "description": impact_info["description"],
        })

    new_co2 = round(max(base_co2 - total_reduction, 280), 1)  # Pre-industrial min ~280
    reduction_pct = round((total_reduction / base_co2) * 100, 2) if base_co2 > 0 else 0

    return {
        "zone_id": zone_id,
        "zone_name": zone["name"],
        "original_co2_ppm": base_co2,
        "new_co2_ppm": new_co2,
        "total_co2_reduction_ppm": round(total_reduction, 2),
        "reduction_percentage": reduction_pct,
        "action_results": action_results,
        "available_actions": list(ACTION_IMPACTS.keys()),
    }


def get_available_actions():
    """Return all available simulation actions."""
    return {
        "actions": [
            {"key": k, **v} for k, v in ACTION_IMPACTS.items()
        ]
    }
