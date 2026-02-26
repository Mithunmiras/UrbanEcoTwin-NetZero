"""
MODULE 3: AI Prediction Engine
Simulates LSTM/XGBoost-style CO₂ predictions (1h, 24h, 7-day).
"""

import math
import random
from data.city_data import get_all_zones


def _generate_hourly_series(base_co2: float, hours: int):
    """Generate realistic hourly CO₂ predictions with diurnal cycle."""
    series = []
    for h in range(hours):
        # Diurnal pattern + slight upward trend + noise
        diurnal = 15 * math.sin((h - 6) * math.pi / 12)
        trend = h * 0.3  # Slow upward drift
        noise = random.gauss(0, 3)
        val = round(base_co2 + diurnal + trend + noise, 1)
        series.append({"hour_offset": h, "predicted_co2_ppm": val})
    return series


def _generate_daily_series(base_co2: float, days: int):
    """Generate daily CO₂ trend prediction."""
    series = []
    for d in range(days):
        weekly_pattern = 8 * math.sin(d * math.pi / 3.5)
        trend = d * 1.5
        noise = random.gauss(0, 5)
        val = round(base_co2 + weekly_pattern + trend + noise, 1)
        series.append({"day_offset": d, "predicted_co2_ppm": val})
    return series


def get_predictions(zone_id: str = None):
    """Generate predictions for all zones or a specific zone."""
    zones = get_all_zones()
    if zone_id:
        zones = [z for z in zones if z["id"] == zone_id]
        if not zones:
            return {"error": f"Zone '{zone_id}' not found"}

    predictions = []
    for zone in zones:
        base = zone["current_co2_ppm"]
        pred_1h = round(base + random.uniform(3, 12), 1)
        pred_24h = round(base + random.uniform(10, 40), 1)
        pred_7d = round(base + random.uniform(20, 60), 1)

        predictions.append({
            "zone_id": zone["id"],
            "zone_name": zone["name"],
            "current_co2_ppm": base,
            "predictions": {
                "1_hour": {
                    "predicted_co2_ppm": pred_1h,
                    "change_ppm": round(pred_1h - base, 1),
                    "confidence": round(random.uniform(0.88, 0.96), 2),
                    "model": "LSTM-v2",
                },
                "24_hour": {
                    "predicted_co2_ppm": pred_24h,
                    "change_ppm": round(pred_24h - base, 1),
                    "confidence": round(random.uniform(0.80, 0.92), 2),
                    "model": "LSTM-v2 + XGBoost Ensemble",
                },
                "7_day": {
                    "predicted_co2_ppm": pred_7d,
                    "change_ppm": round(pred_7d - base, 1),
                    "confidence": round(random.uniform(0.72, 0.85), 2),
                    "model": "XGBoost-v3",
                },
            },
            "hourly_forecast": _generate_hourly_series(base, 24),
            "daily_forecast": _generate_daily_series(base, 7),
            "risk_trend": "increasing" if pred_24h > base + 15 else "stable",
        })

    return {
        "predictions": predictions,
        "models_used": ["LSTM-v2", "XGBoost-v3", "Ensemble"],
        "timestamp": __import__("datetime").datetime.now().isoformat(),
    }
