from __future__ import annotations

"""
City data for Tamil Nadu metros — Chennai, Coimbatore, Madurai.
All environmental readings come live from Open-Meteo / OpenWeatherMap.
Only zone names, coordinates, and city grouping are defined here.
"""

import asyncio
import logging

logger = logging.getLogger(__name__)

# ── City Definitions ───────────────────────────────────────────────────────

CITIES = {
    "chennai":    {"name": "Chennai",    "lat": 13.08, "lng": 80.27},
    "coimbatore": {"name": "Coimbatore", "lat": 11.01, "lng": 76.96},
    "madurai":    {"name": "Madurai",    "lat": 9.93,  "lng": 78.12},
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

    # ═══════════════════ COIMBATORE (15 zones) ═══════════════════
    "coimbatore_rs_puram":       {"name": "R.S. Puram",       "lat": 11.0051, "lng": 76.9569, "city": "coimbatore"},
    "coimbatore_gandhipuram":    {"name": "Gandhipuram",      "lat": 11.0168, "lng": 76.9558, "city": "coimbatore"},
    "coimbatore_peelamedu":      {"name": "Peelamedu",        "lat": 11.0273, "lng": 77.0252, "city": "coimbatore"},
    "coimbatore_saibaba_colony": {"name": "Saibaba Colony",   "lat": 11.0237, "lng": 76.9476, "city": "coimbatore"},
    "coimbatore_race_course":    {"name": "Race Course",      "lat": 11.0073, "lng": 76.9675, "city": "coimbatore"},
    "coimbatore_ukkadam":        {"name": "Ukkadam",          "lat": 10.9904, "lng": 76.9547, "city": "coimbatore"},
    "coimbatore_singanallur":    {"name": "Singanallur",      "lat": 10.9979, "lng": 77.0237, "city": "coimbatore"},
    "coimbatore_kuniyamuthur":   {"name": "Kuniyamuthur",     "lat": 10.9615, "lng": 76.9533, "city": "coimbatore"},
    "coimbatore_ganapathy":      {"name": "Ganapathy",        "lat": 11.0396, "lng": 76.9720, "city": "coimbatore"},
    "coimbatore_vadavalli":      {"name": "Vadavalli",        "lat": 11.0229, "lng": 76.9015, "city": "coimbatore"},
    "coimbatore_tidel_park":     {"name": "Tidel Park",       "lat": 11.0294, "lng": 77.0026, "city": "coimbatore"},
    "coimbatore_podanur":        {"name": "Podanur",          "lat": 10.9595, "lng": 76.9854, "city": "coimbatore"},
    "coimbatore_sulur":          {"name": "Sulur",            "lat": 11.0344, "lng": 77.1252, "city": "coimbatore"},
    "coimbatore_karumbukkadai":  {"name": "Karumbukkadai",    "lat": 10.9833, "lng": 76.9100, "city": "coimbatore"},
    "coimbatore_saravanampatti": {"name": "Saravanampatti",   "lat": 11.0771, "lng": 77.0011, "city": "coimbatore"},

    # ═══════════════════ MADURAI (15 zones) ═══════════════════
    "madurai_anna_nagar":      {"name": "Anna Nagar",      "lat": 9.9252, "lng": 78.1198, "city": "madurai"},
    "madurai_goripalayam":     {"name": "Goripalayam",     "lat": 9.9195, "lng": 78.1193, "city": "madurai"},
    "madurai_tallakulam":      {"name": "Tallakulam",      "lat": 9.9368, "lng": 78.1214, "city": "madurai"},
    "madurai_pasumalai":       {"name": "Pasumalai",       "lat": 9.9051, "lng": 78.1012, "city": "madurai"},
    "madurai_kk_nagar":        {"name": "K.K. Nagar",      "lat": 9.9429, "lng": 78.1448, "city": "madurai"},
    "madurai_ss_colony":       {"name": "S.S. Colony",     "lat": 9.9252, "lng": 78.1478, "city": "madurai"},
    "madurai_meenakshi":       {"name": "Meenakshi Amman", "lat": 9.9195, "lng": 78.1193, "city": "madurai"},
    "madurai_thiruparankundram": {"name": "Thiruparankundram", "lat": 9.8789, "lng": 78.0711, "city": "madurai"},
    "madurai_vilangudi":       {"name": "Vilangudi",       "lat": 9.9466, "lng": 78.0901, "city": "madurai"},
    "madurai_ponmeni":         {"name": "Ponmeni",         "lat": 9.9350, "lng": 78.1055, "city": "madurai"},
    "madurai_avaniyapuram":    {"name": "Avaniyapuram",    "lat": 9.8642, "lng": 78.1128, "city": "madurai"},
    "madurai_teppakulam":      {"name": "Teppakulam",      "lat": 9.9158, "lng": 78.1344, "city": "madurai"},
    "madurai_harveypatti":     {"name": "Harveypatti",     "lat": 9.8987, "lng": 78.1567, "city": "madurai"},
    "madurai_bypass_road":     {"name": "Bypass Road",     "lat": 9.9642, "lng": 78.1421, "city": "madurai"},
    "madurai_sellur":          {"name": "Sellur",          "lat": 9.9517, "lng": 78.1583, "city": "madurai"},
}


# ── Live Data Integration ──────────────────────────────────────────────────

def _build_zone_entry(zone_id: str, zone: dict, live: dict) -> dict:
    """Merge zone identity with live readings."""
    readings = {
        "current_co2_ppm": live.get("current_co2_ppm") or 0,
        "current_aqi": live.get("current_aqi") or 0,
        "avg_temperature_c": live.get("avg_temperature_c"),
        "avg_humidity_pct": live.get("avg_humidity_pct"),
        "avg_wind_speed_kmh": live.get("avg_wind_speed_kmh"),
        "pm10": live.get("pm10") or 0,
        "pm2_5": live.get("pm2_5") or 0,
        "carbon_monoxide_ugm3": live.get("carbon_monoxide_ugm3") or 0,
        "nitrogen_dioxide_ugm3": live.get("nitrogen_dioxide_ugm3") or 0,
        "sulphur_dioxide_ugm3": live.get("sulphur_dioxide_ugm3") or 0,
        "ozone_ugm3": live.get("ozone_ugm3") or 0,
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
