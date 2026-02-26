"""
MODULE 10: Carbon Credit Calculator
Converts carbon reduction to monetary value.
"""

from data.city_data import get_all_zones


# Carbon credit rates
CREDIT_RATE_PER_TONNE_INR = 500  # ₹500 per tonne CO₂
CREDIT_RATE_PER_TONNE_USD = 6    # $6 per tonne (approximate)
CO2_PPM_TO_TONNES_FACTOR = 7.82  # Conversion factor (city-scale approximation)


def calculate_carbon_credits(zone_id: str = None, reduction_ppm: float = None):
    """Calculate carbon credits for CO₂ reduction."""
    zones = get_all_zones()
    if zone_id:
        zones = [z for z in zones if z["id"] == zone_id]

    results = []
    total_credits_inr = 0
    total_credits_usd = 0
    total_reduction_tonnes = 0

    for zone in zones:
        # Calculate potential reduction (from current to safe level 350 ppm)
        zone_reduction_ppm = reduction_ppm if reduction_ppm else max(0, zone["current_co2_ppm"] - 350)
        reduction_tonnes = round(zone_reduction_ppm * CO2_PPM_TO_TONNES_FACTOR, 2)
        credit_value_inr = round(reduction_tonnes * CREDIT_RATE_PER_TONNE_INR, 2)
        credit_value_usd = round(reduction_tonnes * CREDIT_RATE_PER_TONNE_USD, 2)

        total_credits_inr += credit_value_inr
        total_credits_usd += credit_value_usd
        total_reduction_tonnes += reduction_tonnes

        results.append({
            "zone_id": zone["id"],
            "zone_name": zone["name"],
            "current_co2_ppm": zone["current_co2_ppm"],
            "target_co2_ppm": 350,
            "reduction_ppm": round(zone_reduction_ppm, 1),
            "reduction_tonnes": reduction_tonnes,
            "carbon_credits": {
                "value_inr": f"₹{credit_value_inr:,.2f}",
                "value_usd": f"${credit_value_usd:,.2f}",
                "credits_earned": round(reduction_tonnes, 1),
            },
        })

    return {
        "carbon_credit_analysis": results,
        "city_totals": {
            "total_reduction_tonnes": round(total_reduction_tonnes, 2),
            "total_credits_inr": f"₹{total_credits_inr:,.2f}",
            "total_credits_usd": f"${total_credits_usd:,.2f}",
            "total_credits_earned": round(total_reduction_tonnes, 1),
        },
        "market_rates": {
            "rate_per_tonne_inr": f"₹{CREDIT_RATE_PER_TONNE_INR}",
            "rate_per_tonne_usd": f"${CREDIT_RATE_PER_TONNE_USD}",
            "market": "Voluntary Carbon Market (VCM)",
        },
    }
