from __future__ import annotations

"""
District data for 4 South Indian states:
  Tamil Nadu (38), Kerala (14), Karnataka (31), Andhra Pradesh (26).

All environmental readings come live from Open-Meteo / OpenWeatherMap.
Only district names, coordinates, and state grouping are defined here.
"""

import asyncio
import logging

logger = logging.getLogger(__name__)

# ── State Definitions ──────────────────────────────────────────────────────

STATES = {
    "tamilnadu":       {"name": "Tamil Nadu",       "lat": 11.13, "lng": 78.66},
    "kerala":          {"name": "Kerala",            "lat": 10.85, "lng": 76.27},
    "karnataka":       {"name": "Karnataka",         "lat": 15.32, "lng": 75.71},
    "andhrapradesh":   {"name": "Andhra Pradesh",    "lat": 15.91, "lng": 79.74},
}

# ── District / Zone Grid ──────────────────────────────────────────────────
# Each zone: name, lat, lng, city (district key), state

ZONES = {
    # ═══════════════════════════════════════════════════════════════════════
    #  TAMIL NADU — 38 districts
    # ═══════════════════════════════════════════════════════════════════════
    "tn_chennai":            {"name": "Chennai",            "lat": 13.0827, "lng": 80.2707, "city": "chennai",            "state": "tamilnadu"},
    "tn_coimbatore":         {"name": "Coimbatore",         "lat": 11.0168, "lng": 76.9558, "city": "coimbatore",         "state": "tamilnadu"},
    "tn_madurai":            {"name": "Madurai",            "lat": 9.9252,  "lng": 78.1198, "city": "madurai",            "state": "tamilnadu"},
    "tn_tiruchirappalli":    {"name": "Tiruchirappalli",    "lat": 10.7905, "lng": 78.7047, "city": "tiruchirappalli",    "state": "tamilnadu"},
    "tn_salem":              {"name": "Salem",              "lat": 11.6643, "lng": 78.1460, "city": "salem",              "state": "tamilnadu"},
    "tn_tirunelveli":        {"name": "Tirunelveli",        "lat": 8.7139,  "lng": 77.7567, "city": "tirunelveli",        "state": "tamilnadu"},
    "tn_erode":              {"name": "Erode",              "lat": 11.3410, "lng": 77.7172, "city": "erode",              "state": "tamilnadu"},
    "tn_vellore":            {"name": "Vellore",            "lat": 12.9165, "lng": 79.1325, "city": "vellore",            "state": "tamilnadu"},
    "tn_thoothukudi":        {"name": "Thoothukudi",        "lat": 8.7642,  "lng": 78.1348, "city": "thoothukudi",        "state": "tamilnadu"},
    "tn_thanjavur":          {"name": "Thanjavur",          "lat": 10.7870, "lng": 79.1378, "city": "thanjavur",          "state": "tamilnadu"},
    "tn_dindigul":           {"name": "Dindigul",           "lat": 10.3624, "lng": 77.9695, "city": "dindigul",           "state": "tamilnadu"},
    "tn_cuddalore":          {"name": "Cuddalore",          "lat": 11.7480, "lng": 79.7714, "city": "cuddalore",          "state": "tamilnadu"},
    "tn_kancheepuram":       {"name": "Kancheepuram",       "lat": 12.8342, "lng": 79.7036, "city": "kancheepuram",       "state": "tamilnadu"},
    "tn_tiruvallur":         {"name": "Tiruvallur",         "lat": 13.1431, "lng": 79.9084, "city": "tiruvallur",         "state": "tamilnadu"},
    "tn_villupuram":         {"name": "Villupuram",         "lat": 11.9401, "lng": 79.4861, "city": "villupuram",         "state": "tamilnadu"},
    "tn_nagapattinam":       {"name": "Nagapattinam",       "lat": 10.7672, "lng": 79.8449, "city": "nagapattinam",       "state": "tamilnadu"},
    "tn_namakkal":           {"name": "Namakkal",           "lat": 11.2189, "lng": 78.1674, "city": "namakkal",           "state": "tamilnadu"},
    "tn_theni":              {"name": "Theni",              "lat": 10.0104, "lng": 77.4769, "city": "theni",              "state": "tamilnadu"},
    "tn_sivaganga":          {"name": "Sivaganga",          "lat": 10.3500, "lng": 78.7500, "city": "sivaganga",          "state": "tamilnadu"},
    "tn_ramanathapuram":     {"name": "Ramanathapuram",     "lat": 9.3639,  "lng": 78.8395, "city": "ramanathapuram",     "state": "tamilnadu"},
    "tn_virudhunagar":       {"name": "Virudhunagar",       "lat": 9.5850,  "lng": 77.9624, "city": "virudhunagar",       "state": "tamilnadu"},
    "tn_the_nilgiris":       {"name": "The Nilgiris",       "lat": 11.4916, "lng": 76.7337, "city": "the_nilgiris",       "state": "tamilnadu"},
    "tn_karur":              {"name": "Karur",              "lat": 10.9601, "lng": 78.0766, "city": "karur",              "state": "tamilnadu"},
    "tn_tiruvarur":          {"name": "Tiruvarur",          "lat": 10.7713, "lng": 79.6345, "city": "tiruvarur",          "state": "tamilnadu"},
    "tn_perambalur":         {"name": "Perambalur",         "lat": 11.2320, "lng": 78.8849, "city": "perambalur",         "state": "tamilnadu"},
    "tn_ariyalur":           {"name": "Ariyalur",           "lat": 11.1428, "lng": 79.0786, "city": "ariyalur",           "state": "tamilnadu"},
    "tn_krishnagiri":        {"name": "Krishnagiri",        "lat": 12.5186, "lng": 78.2138, "city": "krishnagiri",        "state": "tamilnadu"},
    "tn_dharmapuri":         {"name": "Dharmapuri",         "lat": 12.1211, "lng": 78.1582, "city": "dharmapuri",         "state": "tamilnadu"},
    "tn_tirupathur":         {"name": "Tirupathur",         "lat": 12.4955, "lng": 78.5730, "city": "tirupathur",         "state": "tamilnadu"},
    "tn_ranipet":            {"name": "Ranipet",            "lat": 12.9224, "lng": 79.3333, "city": "ranipet",            "state": "tamilnadu"},
    "tn_tiruppur":           {"name": "Tiruppur",           "lat": 11.1085, "lng": 77.3411, "city": "tiruppur",           "state": "tamilnadu"},
    "tn_chengalpattu":       {"name": "Chengalpattu",       "lat": 12.6819, "lng": 79.9888, "city": "chengalpattu",       "state": "tamilnadu"},
    "tn_kallakurichi":       {"name": "Kallakurichi",       "lat": 11.7383, "lng": 78.9594, "city": "kallakurichi",       "state": "tamilnadu"},
    "tn_tenkasi":            {"name": "Tenkasi",            "lat": 8.9604,  "lng": 77.3152, "city": "tenkasi",            "state": "tamilnadu"},
    "tn_kanyakumari":        {"name": "Kanyakumari",        "lat": 8.0883,  "lng": 77.5385, "city": "kanyakumari",        "state": "tamilnadu"},
    "tn_pudukkottai":        {"name": "Pudukkottai",        "lat": 10.3833, "lng": 78.8001, "city": "pudukkottai",        "state": "tamilnadu"},
    "tn_mayiladuthurai":     {"name": "Mayiladuthurai",     "lat": 11.1014, "lng": 79.6528, "city": "mayiladuthurai",     "state": "tamilnadu"},
    "tn_madurai_south":      {"name": "Madurai (South)",    "lat": 9.8500,  "lng": 78.0000, "city": "madurai",            "state": "tamilnadu"},

    # ═══════════════════════════════════════════════════════════════════════
    #  KERALA — 14 districts
    # ═══════════════════════════════════════════════════════════════════════
    "kl_thiruvananthapuram":  {"name": "Thiruvananthapuram", "lat": 8.5241,  "lng": 76.9366, "city": "thiruvananthapuram", "state": "kerala"},
    "kl_kollam":              {"name": "Kollam",             "lat": 8.8932,  "lng": 76.6141, "city": "kollam",             "state": "kerala"},
    "kl_pathanamthitta":      {"name": "Pathanamthitta",     "lat": 9.2648,  "lng": 76.7870, "city": "pathanamthitta",     "state": "kerala"},
    "kl_alappuzha":           {"name": "Alappuzha",          "lat": 9.4981,  "lng": 76.3388, "city": "alappuzha",          "state": "kerala"},
    "kl_kottayam":            {"name": "Kottayam",           "lat": 9.5916,  "lng": 76.5222, "city": "kottayam",           "state": "kerala"},
    "kl_idukki":              {"name": "Idukki",             "lat": 9.8494,  "lng": 76.9720, "city": "idukki",             "state": "kerala"},
    "kl_ernakulam":           {"name": "Ernakulam",          "lat": 9.9816,  "lng": 76.2999, "city": "ernakulam",          "state": "kerala"},
    "kl_thrissur":            {"name": "Thrissur",           "lat": 10.5276, "lng": 76.2144, "city": "thrissur",           "state": "kerala"},
    "kl_palakkad":            {"name": "Palakkad",           "lat": 10.7867, "lng": 76.6548, "city": "palakkad",           "state": "kerala"},
    "kl_malappuram":          {"name": "Malappuram",         "lat": 11.0510, "lng": 76.0711, "city": "malappuram",         "state": "kerala"},
    "kl_kozhikode":           {"name": "Kozhikode",          "lat": 11.2588, "lng": 75.7804, "city": "kozhikode",          "state": "kerala"},
    "kl_wayanad":             {"name": "Wayanad",            "lat": 11.6854, "lng": 76.1320, "city": "wayanad",            "state": "kerala"},
    "kl_kannur":              {"name": "Kannur",             "lat": 11.8745, "lng": 75.3704, "city": "kannur",             "state": "kerala"},
    "kl_kasaragod":           {"name": "Kasaragod",          "lat": 12.4996, "lng": 74.9869, "city": "kasaragod",          "state": "kerala"},

    # ═══════════════════════════════════════════════════════════════════════
    #  KARNATAKA — 31 districts
    # ═══════════════════════════════════════════════════════════════════════
    "ka_bengaluru_urban":     {"name": "Bengaluru Urban",    "lat": 12.9716, "lng": 77.5946, "city": "bengaluru_urban",    "state": "karnataka"},
    "ka_bengaluru_rural":     {"name": "Bengaluru Rural",    "lat": 13.2257, "lng": 77.5750, "city": "bengaluru_rural",    "state": "karnataka"},
    "ka_mysuru":              {"name": "Mysuru",             "lat": 12.2958, "lng": 76.6394, "city": "mysuru",             "state": "karnataka"},
    "ka_mangaluru":           {"name": "Dakshina Kannada",   "lat": 12.8438, "lng": 74.8585, "city": "mangaluru",          "state": "karnataka"},
    "ka_hubli_dharwad":       {"name": "Dharwad",            "lat": 15.4589, "lng": 75.0078, "city": "dharwad",            "state": "karnataka"},
    "ka_belagavi":            {"name": "Belagavi",           "lat": 15.8497, "lng": 74.4977, "city": "belagavi",           "state": "karnataka"},
    "ka_kalaburagi":          {"name": "Kalaburagi",         "lat": 17.3297, "lng": 76.8343, "city": "kalaburagi",         "state": "karnataka"},
    "ka_ballari":             {"name": "Ballari",            "lat": 15.1394, "lng": 76.9214, "city": "ballari",            "state": "karnataka"},
    "ka_tumakuru":            {"name": "Tumakuru",           "lat": 13.3392, "lng": 77.1017, "city": "tumakuru",           "state": "karnataka"},
    "ka_raichur":             {"name": "Raichur",            "lat": 16.2036, "lng": 77.3556, "city": "raichur",            "state": "karnataka"},
    "ka_hassan":              {"name": "Hassan",             "lat": 13.0068, "lng": 76.1004, "city": "hassan",             "state": "karnataka"},
    "ka_shimoga":             {"name": "Shimoga",            "lat": 13.9299, "lng": 75.5681, "city": "shimoga",            "state": "karnataka"},
    "ka_chitradurga":         {"name": "Chitradurga",        "lat": 14.2226, "lng": 76.3987, "city": "chitradurga",        "state": "karnataka"},
    "ka_davanagere":          {"name": "Davanagere",         "lat": 14.4664, "lng": 75.9218, "city": "davanagere",         "state": "karnataka"},
    "ka_mandya":              {"name": "Mandya",             "lat": 12.5244, "lng": 76.8958, "city": "mandya",             "state": "karnataka"},
    "ka_chikkamagaluru":      {"name": "Chikkamagaluru",     "lat": 13.3161, "lng": 75.7720, "city": "chikkamagaluru",     "state": "karnataka"},
    "ka_kodagu":              {"name": "Kodagu",             "lat": 12.4218, "lng": 75.7382, "city": "kodagu",             "state": "karnataka"},
    "ka_udupi":               {"name": "Udupi",              "lat": 13.3409, "lng": 74.7421, "city": "udupi",              "state": "karnataka"},
    "ka_uttara_kannada":      {"name": "Uttara Kannada",     "lat": 14.7937, "lng": 74.6899, "city": "uttara_kannada",     "state": "karnataka"},
    "ka_haveri":              {"name": "Haveri",             "lat": 14.7951, "lng": 75.4046, "city": "haveri",             "state": "karnataka"},
    "ka_gadag":               {"name": "Gadag",              "lat": 15.4166, "lng": 75.6260, "city": "gadag",              "state": "karnataka"},
    "ka_bagalkot":            {"name": "Bagalkot",           "lat": 16.1691, "lng": 75.6615, "city": "bagalkot",           "state": "karnataka"},
    "ka_bidar":               {"name": "Bidar",              "lat": 17.9104, "lng": 77.5199, "city": "bidar",              "state": "karnataka"},
    "ka_yadgir":              {"name": "Yadgir",             "lat": 16.7700, "lng": 77.1400, "city": "yadgir",             "state": "karnataka"},
    "ka_ramanagara":          {"name": "Ramanagara",         "lat": 12.7159, "lng": 77.2810, "city": "ramanagara",         "state": "karnataka"},
    "ka_chikkaballapur":      {"name": "Chikkaballapur",     "lat": 13.4355, "lng": 77.7315, "city": "chikkaballapur",     "state": "karnataka"},
    "ka_kolar":               {"name": "Kolar",              "lat": 13.1362, "lng": 78.1292, "city": "kolar",              "state": "karnataka"},
    "ka_koppal":              {"name": "Koppal",             "lat": 15.3473, "lng": 76.1551, "city": "koppal",             "state": "karnataka"},
    "ka_chamarajanagar":      {"name": "Chamarajanagar",     "lat": 11.9236, "lng": 76.9398, "city": "chamarajanagar",     "state": "karnataka"},
    "ka_vijayapura":          {"name": "Vijayapura",         "lat": 16.8302, "lng": 75.7100, "city": "vijayapura",         "state": "karnataka"},
    "ka_vijayanagara":        {"name": "Vijayanagara",       "lat": 15.3350, "lng": 76.4600, "city": "vijayanagara",       "state": "karnataka"},

    # ═══════════════════════════════════════════════════════════════════════
    #  ANDHRA PRADESH — 26 districts
    # ═══════════════════════════════════════════════════════════════════════
    "ap_visakhapatnam":        {"name": "Visakhapatnam",       "lat": 17.6868, "lng": 83.2185, "city": "visakhapatnam",       "state": "andhrapradesh"},
    "ap_vijayawada":           {"name": "NTR (Vijayawada)",    "lat": 16.5062, "lng": 80.6480, "city": "vijayawada",          "state": "andhrapradesh"},
    "ap_guntur":               {"name": "Guntur",              "lat": 16.3067, "lng": 80.4365, "city": "guntur",              "state": "andhrapradesh"},
    "ap_nellore":              {"name": "Nellore",             "lat": 14.4426, "lng": 79.9865, "city": "nellore",             "state": "andhrapradesh"},
    "ap_kurnool":              {"name": "Kurnool",             "lat": 15.8281, "lng": 78.0373, "city": "kurnool",             "state": "andhrapradesh"},
    "ap_anantapur":            {"name": "Anantapur",           "lat": 14.6819, "lng": 77.6006, "city": "anantapur",           "state": "andhrapradesh"},
    "ap_tirupati":             {"name": "Tirupati",            "lat": 13.6288, "lng": 79.4192, "city": "tirupati",            "state": "andhrapradesh"},
    "ap_kadapa":               {"name": "YSR Kadapa",          "lat": 14.4674, "lng": 78.8241, "city": "kadapa",              "state": "andhrapradesh"},
    "ap_chittoor":             {"name": "Chittoor",            "lat": 13.2172, "lng": 79.1003, "city": "chittoor",            "state": "andhrapradesh"},
    "ap_prakasam":             {"name": "Prakasam",            "lat": 15.3500, "lng": 79.5600, "city": "prakasam",            "state": "andhrapradesh"},
    "ap_east_godavari":        {"name": "East Godavari",       "lat": 17.3200, "lng": 82.0400, "city": "east_godavari",       "state": "andhrapradesh"},
    "ap_west_godavari":        {"name": "West Godavari",       "lat": 16.9174, "lng": 81.3400, "city": "west_godavari",       "state": "andhrapradesh"},
    "ap_krishna":              {"name": "Krishna",             "lat": 16.6100, "lng": 80.7200, "city": "krishna",             "state": "andhrapradesh"},
    "ap_srikakulam":           {"name": "Srikakulam",          "lat": 18.2949, "lng": 83.8938, "city": "srikakulam",          "state": "andhrapradesh"},
    "ap_vizianagaram":         {"name": "Vizianagaram",        "lat": 18.1067, "lng": 83.3956, "city": "vizianagaram",        "state": "andhrapradesh"},
    "ap_eluru":                {"name": "Eluru",               "lat": 16.7107, "lng": 81.0952, "city": "eluru",               "state": "andhrapradesh"},
    "ap_bapatla":              {"name": "Bapatla",             "lat": 15.9048, "lng": 80.4672, "city": "bapatla",             "state": "andhrapradesh"},
    "ap_palnadu":              {"name": "Palnadu",             "lat": 16.2500, "lng": 79.7000, "city": "palnadu",             "state": "andhrapradesh"},
    "ap_nandyal":              {"name": "Nandyal",             "lat": 15.4787, "lng": 78.4836, "city": "nandyal",             "state": "andhrapradesh"},
    "ap_annamayya":            {"name": "Annamayya",           "lat": 14.2200, "lng": 78.7400, "city": "annamayya",           "state": "andhrapradesh"},
    "ap_sri_sathya_sai":       {"name": "Sri Sathya Sai",      "lat": 14.4800, "lng": 77.7200, "city": "sri_sathya_sai",      "state": "andhrapradesh"},
    "ap_parvathipuram_manyam": {"name": "Parvathipuram Manyam","lat": 18.7663, "lng": 83.4293, "city": "parvathipuram_manyam","state": "andhrapradesh"},
    "ap_alluri_sitharama_raju":{"name": "Alluri Sitharama Raju","lat": 17.7500, "lng": 82.1000, "city": "alluri_sitharama_raju","state": "andhrapradesh"},
    "ap_kakinada":             {"name": "Kakinada",            "lat": 16.9891, "lng": 82.2475, "city": "kakinada",            "state": "andhrapradesh"},
    "ap_konaseema":            {"name": "Konaseema",           "lat": 16.7500, "lng": 82.0000, "city": "konaseema",           "state": "andhrapradesh"},
    "ap_anakapalli":           {"name": "Anakapalli",          "lat": 17.6914, "lng": 83.0037, "city": "anakapalli",          "state": "andhrapradesh"},
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


def get_all_zones(city: str = None, state: str = None) -> list[dict]:
    """Return zone data with live readings. Optionally filter by city or state."""
    from data.live_data import fetch_all_zones_live_data

    filtered = ZONES
    if state:
        filtered = {k: v for k, v in filtered.items() if v.get("state") == state}
    if city:
        filtered = {k: v for k, v in filtered.items() if v.get("city") == city}

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


def get_cities(state: str = None) -> list[dict]:
    """Return list of unique districts, optionally filtered by state."""
    seen = set()
    result = []
    for zid, z in ZONES.items():
        if state and z.get("state") != state:
            continue
        cid = z["city"]
        if cid not in seen:
            seen.add(cid)
            result.append({"id": cid, "name": z["name"], "state": z.get("state", ""), "lat": z["lat"], "lng": z["lng"]})
    return result


def get_states() -> list[dict]:
    """Return list of available states."""
    return [{"id": sid, **s} for sid, s in STATES.items()]
