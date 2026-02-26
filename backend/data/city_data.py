from __future__ import annotations

"""
City data for Indian metros — Chennai, Mumbai, Delhi.
All environmental readings come live from Open-Meteo / OpenWeatherMap.
Only zone names, coordinates, and city grouping are defined here.
"""

import asyncio
import logging

logger = logging.getLogger(__name__)

# ── City Definitions ───────────────────────────────────────────────────────

CITIES = {
    "chennai": {"name": "Chennai", "lat": 13.08, "lng": 80.27},
    "mumbai":  {"name": "Mumbai",  "lat": 19.08, "lng": 72.88},
    "delhi":   {"name": "Delhi",   "lat": 28.61, "lng": 77.21},
}

# ── Zone Grid ──────────────────────────────────────────────────────────────
# Each zone: name, lat, lng, city

ZONES = {
    # ═══════════════════ CHENNAI (20 zones) ═══════════════════
    "chennai_tondiarpet":     {"name": "Tondiarpet",     "lat": 13.1250, "lng": 80.2870, "city": "chennai"},
    "chennai_madhavaram":     {"name": "Madhavaram",     "lat": 13.1520, "lng": 80.2280, "city": "chennai"},
    "chennai_perambur":       {"name": "Perambur",       "lat": 13.1100, "lng": 80.2450, "city": "chennai"},
    "chennai_ambattur":       {"name": "Ambattur",       "lat": 13.1143, "lng": 80.1548, "city": "chennai"},
    "chennai_egmore":         {"name": "Egmore",         "lat": 13.0732, "lng": 80.2609, "city": "chennai"},
    "chennai_nungambakkam":   {"name": "Nungambakkam",   "lat": 13.0569, "lng": 80.2425, "city": "chennai"},
    "chennai_kilpauk":        {"name": "Kilpauk",        "lat": 13.0842, "lng": 80.2422, "city": "chennai"},
    "chennai_anna_nagar":     {"name": "Anna Nagar",     "lat": 13.0850, "lng": 80.2101, "city": "chennai"},
    "chennai_kodambakkam":    {"name": "Kodambakkam",    "lat": 13.0518, "lng": 80.2244, "city": "chennai"},
    "chennai_t_nagar":        {"name": "T. Nagar",       "lat": 13.0418, "lng": 80.2341, "city": "chennai"},
    "chennai_mylapore":       {"name": "Mylapore",       "lat": 13.0368, "lng": 80.2676, "city": "chennai"},
    "chennai_adyar":          {"name": "Adyar",          "lat": 13.0012, "lng": 80.2565, "city": "chennai"},
    "chennai_guindy":         {"name": "Guindy",         "lat": 13.0067, "lng": 80.2206, "city": "chennai"},
    "chennai_velachery":      {"name": "Velachery",      "lat": 12.9815, "lng": 80.2180, "city": "chennai"},
    "chennai_thiruvanmiyur":  {"name": "Thiruvanmiyur",  "lat": 12.9830, "lng": 80.2640, "city": "chennai"},
    "chennai_porur":          {"name": "Porur",          "lat": 13.0358, "lng": 80.1563, "city": "chennai"},
    "chennai_valasaravakkam": {"name": "Valasaravakkam", "lat": 13.0470, "lng": 80.1710, "city": "chennai"},
    "chennai_sholinganallur": {"name": "Sholinganallur", "lat": 12.9010, "lng": 80.2279, "city": "chennai"},
    "chennai_chromepet":      {"name": "Chromepet",      "lat": 12.9516, "lng": 80.1420, "city": "chennai"},
    "chennai_tambaram":       {"name": "Tambaram",       "lat": 12.9249, "lng": 80.1000, "city": "chennai"},

    # ═══════════════════ MUMBAI (15 zones) ═══════════════════
    "mumbai_colaba":        {"name": "Colaba",        "lat": 18.9067, "lng": 72.8147, "city": "mumbai"},
    "mumbai_bandra":        {"name": "Bandra",        "lat": 19.0596, "lng": 72.8295, "city": "mumbai"},
    "mumbai_andheri":       {"name": "Andheri",       "lat": 19.1197, "lng": 72.8464, "city": "mumbai"},
    "mumbai_borivali":      {"name": "Borivali",      "lat": 19.2307, "lng": 72.8567, "city": "mumbai"},
    "mumbai_dadar":         {"name": "Dadar",         "lat": 19.0178, "lng": 72.8478, "city": "mumbai"},
    "mumbai_kurla":         {"name": "Kurla",         "lat": 19.0726, "lng": 72.8794, "city": "mumbai"},
    "mumbai_powai":         {"name": "Powai",         "lat": 19.1176, "lng": 72.9060, "city": "mumbai"},
    "mumbai_worli":         {"name": "Worli",         "lat": 19.0118, "lng": 72.8157, "city": "mumbai"},
    "mumbai_malad":         {"name": "Malad",         "lat": 19.1868, "lng": 72.8484, "city": "mumbai"},
    "mumbai_goregaon":      {"name": "Goregaon",     "lat": 19.1663, "lng": 72.8494, "city": "mumbai"},
    "mumbai_thane":         {"name": "Thane",         "lat": 19.2183, "lng": 72.9781, "city": "mumbai"},
    "mumbai_navi_mumbai":   {"name": "Navi Mumbai",   "lat": 19.0330, "lng": 73.0297, "city": "mumbai"},
    "mumbai_vashi":         {"name": "Vashi",         "lat": 19.0771, "lng": 72.9987, "city": "mumbai"},
    "mumbai_chembur":       {"name": "Chembur",       "lat": 19.0522, "lng": 72.8994, "city": "mumbai"},
    "mumbai_kandivali":     {"name": "Kandivali",     "lat": 19.2058, "lng": 72.8527, "city": "mumbai"},

    # ═══════════════════ DELHI (15 zones) ═══════════════════
    "delhi_connaught":     {"name": "Connaught Place", "lat": 28.6315, "lng": 77.2167, "city": "delhi"},
    "delhi_chandni_chowk": {"name": "Chandni Chowk",  "lat": 28.6507, "lng": 77.2334, "city": "delhi"},
    "delhi_saket":         {"name": "Saket",           "lat": 28.5244, "lng": 77.2065, "city": "delhi"},
    "delhi_dwarka":        {"name": "Dwarka",          "lat": 28.5921, "lng": 77.0460, "city": "delhi"},
    "delhi_rohini":        {"name": "Rohini",          "lat": 28.7495, "lng": 77.0565, "city": "delhi"},
    "delhi_lajpat_nagar":  {"name": "Lajpat Nagar",   "lat": 28.5700, "lng": 77.2373, "city": "delhi"},
    "delhi_karol_bagh":    {"name": "Karol Bagh",     "lat": 28.6514, "lng": 77.1907, "city": "delhi"},
    "delhi_nehru_place":   {"name": "Nehru Place",    "lat": 28.5491, "lng": 77.2533, "city": "delhi"},
    "delhi_janakpuri":     {"name": "Janakpuri",      "lat": 28.6219, "lng": 77.0818, "city": "delhi"},
    "delhi_pitampura":     {"name": "Pitampura",      "lat": 28.7032, "lng": 77.1315, "city": "delhi"},
    "delhi_greater_kailash":{"name": "Greater Kailash","lat": 28.5460, "lng": 77.2432, "city": "delhi"},
    "delhi_noida":         {"name": "Noida",           "lat": 28.5355, "lng": 77.3910, "city": "delhi"},
    "delhi_gurgaon":       {"name": "Gurgaon",         "lat": 28.4595, "lng": 77.0266, "city": "delhi"},
    "delhi_vasant_kunj":   {"name": "Vasant Kunj",    "lat": 28.5195, "lng": 77.1565, "city": "delhi"},
    "delhi_mayur_vihar":   {"name": "Mayur Vihar",    "lat": 28.5921, "lng": 77.2973, "city": "delhi"},
}


# ── Live Data Integration ──────────────────────────────────────────────────

def _build_zone_entry(zone_id: str, zone: dict, live: dict) -> dict:
    """Merge zone identity with live readings."""
    readings = {
        "current_co2_ppm": live.get("current_co2_ppm", 0),
        "current_aqi": live.get("current_aqi", 0),
        "avg_temperature_c": live.get("avg_temperature_c", 30.0),
        "avg_humidity_pct": live.get("avg_humidity_pct", 70),
        "avg_wind_speed_kmh": live.get("avg_wind_speed_kmh", 12.0),
        "pm10": live.get("pm10", 0),
        "pm2_5": live.get("pm2_5", 0),
        "carbon_monoxide_ugm3": live.get("carbon_monoxide_ugm3", 0),
        "nitrogen_dioxide_ugm3": live.get("nitrogen_dioxide_ugm3", 0),
        "sulphur_dioxide_ugm3": live.get("sulphur_dioxide_ugm3", 0),
        "ozone_ugm3": live.get("ozone_ugm3", 0),
        "source": "live",
        "api_source": live.get("api_source", "Open-Meteo"),
    }
    return {"id": zone_id, **zone, **readings}


def get_all_zones(city: str = None) -> list[dict]:
    """Return zone data with live readings. Optionally filter by city."""
    from data.live_data import fetch_all_zones_live_data

    if city:
        filtered = {k: v for k, v in ZONES.items() if v.get("city") == city}
    else:
        filtered = ZONES

    zone_list = [{"id": zid, **z} for zid, z in filtered.items()]
    live_data = asyncio.run(fetch_all_zones_live_data(zone_list))

    result = []
    for zone_id, zone in filtered.items():
        live = live_data.get(zone_id, {})
        result.append(_build_zone_entry(zone_id, zone, live))
    return result


def get_zone(zone_id: str) -> dict | None:
    """Return data for a specific zone with live readings."""
    zone = ZONES.get(zone_id)
    if not zone:
        return None

    from data.live_data import fetch_zone_live_data
    live = asyncio.run(fetch_zone_live_data(zone["lat"], zone["lng"]))

    return _build_zone_entry(zone_id, zone, live or {})


def get_cities() -> list[dict]:
    """Return list of available cities."""
    return [{"id": cid, **c} for cid, c in CITIES.items()]
