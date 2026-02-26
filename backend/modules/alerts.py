"""
MODULE 13: Sustainability Alert System
Generates alerts for high-risk zones based on environmental thresholds.
"""

from datetime import datetime
from data.city_data import get_all_zones


# Alert thresholds
THRESHOLDS = {
    "co2_critical": 470,
    "co2_warning": 440,
    "co2_caution": 420,
    "aqi_critical": 150,
    "aqi_warning": 120,
    "aqi_caution": 100,
}


def get_alerts():
    """Generate sustainability alerts for all zones."""
    zones = get_all_zones()
    alerts = []
    alert_id = 1

    for zone in zones:
        # CO₂ alerts
        if zone["current_co2_ppm"] >= THRESHOLDS["co2_critical"]:
            alerts.append({
                "id": alert_id,
                "zone_id": zone["id"],
                "zone_name": zone["name"],
                "type": "co2",
                "severity": "critical",
                "color": "#ef4444",
                "title": "🚨 Critical CO₂ Level",
                "message": f"CO₂ levels at {zone['current_co2_ppm']} ppm in {zone['name']} — exceeds critical threshold ({THRESHOLDS['co2_critical']} ppm)",
                "value": zone["current_co2_ppm"],
                "threshold": THRESHOLDS["co2_critical"],
                "recommended_action": "Immediate emission controls required. Activate emergency air quality protocols.",
                "timestamp": datetime.now().isoformat(),
            })
            alert_id += 1
        elif zone["current_co2_ppm"] >= THRESHOLDS["co2_warning"]:
            alerts.append({
                "id": alert_id,
                "zone_id": zone["id"],
                "zone_name": zone["name"],
                "type": "co2",
                "severity": "warning",
                "color": "#f97316",
                "title": "⚠️ Elevated CO₂ Level",
                "message": f"CO₂ at {zone['current_co2_ppm']} ppm in {zone['name']} — approaching critical threshold",
                "value": zone["current_co2_ppm"],
                "threshold": THRESHOLDS["co2_warning"],
                "recommended_action": "Increase monitoring frequency. Prepare emission reduction measures.",
                "timestamp": datetime.now().isoformat(),
            })
            alert_id += 1

        # AQI alerts
        if zone["current_aqi"] >= THRESHOLDS["aqi_critical"]:
            alerts.append({
                "id": alert_id,
                "zone_id": zone["id"],
                "zone_name": zone["name"],
                "type": "aqi",
                "severity": "critical",
                "color": "#ef4444",
                "title": "🚨 Hazardous Air Quality",
                "message": f"AQI at {zone['current_aqi']} in {zone['name']} — hazardous to health",
                "value": zone["current_aqi"],
                "threshold": THRESHOLDS["aqi_critical"],
                "recommended_action": "Issue public health advisory. Restrict outdoor activities.",
                "timestamp": datetime.now().isoformat(),
            })
            alert_id += 1
        elif zone["current_aqi"] >= THRESHOLDS["aqi_warning"]:
            alerts.append({
                "id": alert_id,
                "zone_id": zone["id"],
                "zone_name": zone["name"],
                "type": "aqi",
                "severity": "warning",
                "color": "#f97316",
                "title": "⚠️ Poor Air Quality",
                "message": f"AQI at {zone['current_aqi']} in {zone['name']} — unhealthy for sensitive groups",
                "value": zone["current_aqi"],
                "threshold": THRESHOLDS["aqi_warning"],
                "recommended_action": "Advisory for sensitive groups to limit outdoor exposure.",
                "timestamp": datetime.now().isoformat(),
            })
            alert_id += 1

    # Sort by severity
    severity_order = {"critical": 0, "warning": 1, "info": 2}
    alerts.sort(key=lambda x: severity_order.get(x["severity"], 3))

    return {
        "alerts": alerts,
        "total_alerts": len(alerts),
        "critical_count": sum(1 for a in alerts if a["severity"] == "critical"),
        "warning_count": sum(1 for a in alerts if a["severity"] == "warning"),
        "info_count": sum(1 for a in alerts if a["severity"] == "info"),
        "last_checked": datetime.now().isoformat(),
    }
