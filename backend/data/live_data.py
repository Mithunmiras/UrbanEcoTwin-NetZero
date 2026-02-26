from __future__ import annotations

"""
Live Data Client — Fetches real-time environmental data.

Primary:  Open-Meteo APIs (free, no API key)
Fallback: OpenWeatherMap APIs (free tier, API key required)

If Open-Meteo fails, automatically retries with OpenWeatherMap.
"""

import httpx
import asyncio
import time
import logging

logger = logging.getLogger(__name__)

# ── API Configuration ──────────────────────────────────────────────────────

# Primary: Open-Meteo (no key needed)
OPENMETEO_AQ_URL = "https://air-quality-api.open-meteo.com/v1/air-quality"
OPENMETEO_WX_URL = "https://api.open-meteo.com/v1/forecast"

# Fallback: OpenWeatherMap
OWM_API_KEY = "09ed4c62dcfc8967766d2b6388c58e8d"
OWM_AQ_URL = "https://api.openweathermap.org/data/2.5/air_pollution"
OWM_WX_URL = "https://api.openweathermap.org/data/2.5/weather"

# ── Cache ──────────────────────────────────────────────────────────────────
_cache = {}
CACHE_TTL_SECONDS = 300  # 5 minutes


def _cache_get(key):
    entry = _cache.get(key)
    if entry and (time.time() - entry["ts"]) < CACHE_TTL_SECONDS:
        return entry["data"]
    return None


def _cache_set(key, data):
    _cache[key] = {"data": data, "ts": time.time()}


# ═══════════════════════════════════════════════════════════════════════════
#  PRIMARY: Open-Meteo
# ═══════════════════════════════════════════════════════════════════════════

async def _openmeteo_air_quality(client, lat, lng):
    """Fetch air quality from Open-Meteo."""
    resp = await client.get(OPENMETEO_AQ_URL, params={
        "latitude": lat,
        "longitude": lng,
        "current": "pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi",
    }, timeout=10.0)
    resp.raise_for_status()
    return resp.json().get("current")


async def _openmeteo_weather(client, lat, lng):
    """Fetch weather from Open-Meteo."""
    resp = await client.get(OPENMETEO_WX_URL, params={
        "latitude": lat,
        "longitude": lng,
        "current": "temperature_2m,relative_humidity_2m,wind_speed_10m",
    }, timeout=10.0)
    resp.raise_for_status()
    return resp.json().get("current")


async def _fetch_openmeteo(client, lat, lng):
    """Fetch from Open-Meteo (both endpoints in parallel)."""
    aq, wx = await asyncio.gather(
        _openmeteo_air_quality(client, lat, lng),
        _openmeteo_weather(client, lat, lng),
    )
    return _merge_openmeteo(aq, wx)


# ═══════════════════════════════════════════════════════════════════════════
#  FALLBACK: OpenWeatherMap
# ═══════════════════════════════════════════════════════════════════════════

async def _owm_air_quality(client, lat, lng):
    """Fetch air quality from OpenWeatherMap."""
    resp = await client.get(OWM_AQ_URL, params={
        "lat": lat,
        "lon": lng,
        "appid": OWM_API_KEY,
    }, timeout=10.0)
    resp.raise_for_status()
    data = resp.json()
    # OWM returns: {"list": [{"main": {"aqi": 1-5}, "components": {...}}]}
    if data.get("list"):
        entry = data["list"][0]
        return {
            "aqi_level": entry.get("main", {}).get("aqi", 1),  # 1-5 scale
            "components": entry.get("components", {}),
        }
    return None


async def _owm_weather(client, lat, lng):
    """Fetch weather from OpenWeatherMap."""
    resp = await client.get(OWM_WX_URL, params={
        "lat": lat,
        "lon": lng,
        "appid": OWM_API_KEY,
        "units": "metric",
    }, timeout=10.0)
    resp.raise_for_status()
    return resp.json()


async def _fetch_owm(client, lat, lng):
    """Fetch from OpenWeatherMap (both endpoints in parallel)."""
    aq, wx = await asyncio.gather(
        _owm_air_quality(client, lat, lng),
        _owm_weather(client, lat, lng),
    )
    return _merge_owm(aq, wx)


# ═══════════════════════════════════════════════════════════════════════════
#  COMBINED FETCH (Open-Meteo → OpenWeatherMap fallback)
# ═══════════════════════════════════════════════════════════════════════════

async def fetch_zone_live_data(lat, lng):
    """Fetch live data for a single zone. Tries Open-Meteo first, then OWM."""
    cache_key = f"{lat:.4f},{lng:.4f}"
    cached = _cache_get(cache_key)
    if cached is not None:
        return cached

    async with httpx.AsyncClient() as client:
        # Try Open-Meteo first
        try:
            result = await _fetch_openmeteo(client, lat, lng)
            if result:
                result["api_source"] = "Open-Meteo"
                _cache_set(cache_key, result)
                return result
        except Exception as e:
            logger.warning(f"Open-Meteo failed for ({lat},{lng}): {e}")

        # Fallback to OpenWeatherMap
        try:
            result = await _fetch_owm(client, lat, lng)
            if result:
                result["api_source"] = "OpenWeatherMap"
                _cache_set(cache_key, result)
                return result
        except Exception as e:
            logger.warning(f"OpenWeatherMap also failed for ({lat},{lng}): {e}")

    return None


async def fetch_all_zones_live_data(zones):
    """Fetch live data for multiple zones in parallel."""
    # Check cache first
    results = {}
    zones_to_fetch = []
    for z in zones:
        cache_key = f"{z['lat']:.4f},{z['lng']:.4f}"
        cached = _cache_get(cache_key)
        if cached is not None:
            results[z["id"]] = cached
        else:
            zones_to_fetch.append(z)

    if not zones_to_fetch:
        return results

    async with httpx.AsyncClient() as client:
        # Try Open-Meteo for all zones first
        openmeteo_failed = []
        try:
            tasks = [_fetch_openmeteo(client, z["lat"], z["lng"]) for z in zones_to_fetch]
            responses = await asyncio.gather(*tasks, return_exceptions=True)

            for z, resp in zip(zones_to_fetch, responses):
                if isinstance(resp, Exception) or not resp:
                    openmeteo_failed.append(z)
                else:
                    resp["api_source"] = "Open-Meteo"
                    cache_key = f"{z['lat']:.4f},{z['lng']:.4f}"
                    _cache_set(cache_key, resp)
                    results[z["id"]] = resp
        except Exception:
            openmeteo_failed = zones_to_fetch

        # Fallback: fetch failed zones from OpenWeatherMap
        if openmeteo_failed:
            logger.info(f"Falling back to OpenWeatherMap for {len(openmeteo_failed)} zones")
            try:
                tasks = [_fetch_owm(client, z["lat"], z["lng"]) for z in openmeteo_failed]
                responses = await asyncio.gather(*tasks, return_exceptions=True)

                for z, resp in zip(openmeteo_failed, responses):
                    if isinstance(resp, Exception) or not resp:
                        logger.warning(f"Both APIs failed for {z['id']}")
                    else:
                        resp["api_source"] = "OpenWeatherMap"
                        cache_key = f"{z['lat']:.4f},{z['lng']:.4f}"
                        _cache_set(cache_key, resp)
                        results[z["id"]] = resp
            except Exception as e:
                logger.warning(f"OpenWeatherMap batch also failed: {e}")

    return results


# ═══════════════════════════════════════════════════════════════════════════
#  DATA MAPPING
# ═══════════════════════════════════════════════════════════════════════════

# CO (μg/m³) → approximate CO₂-equivalent ppm
CO_TO_CO2_BASELINE = 380.0
CO_TO_CO2_SCALE = 4.0

# OWM AQI (1-5) → US AQI approximate mapping
OWM_AQI_MAP = {1: 25, 2: 65, 3: 110, 4: 170, 5: 300}


def _merge_openmeteo(aq, wx):
    """Merge Open-Meteo air quality + weather into unified format."""
    result = {"source": "live"}

    if aq:
        co_ugm3 = aq.get("carbon_monoxide", 400)
        result["current_aqi"] = aq.get("us_aqi", 0)
        result["pm10"] = aq.get("pm10", 0)
        result["pm2_5"] = aq.get("pm2_5", 0)
        result["carbon_monoxide_ugm3"] = co_ugm3
        result["nitrogen_dioxide_ugm3"] = aq.get("nitrogen_dioxide", 0)
        result["sulphur_dioxide_ugm3"] = aq.get("sulphur_dioxide", 0)
        result["ozone_ugm3"] = aq.get("ozone", 0)
        result["current_co2_ppm"] = round(CO_TO_CO2_BASELINE + (co_ugm3 / CO_TO_CO2_SCALE), 1)

    if wx:
        result["avg_temperature_c"] = wx.get("temperature_2m") or 0
        result["avg_humidity_pct"] = wx.get("relative_humidity_2m") or 0
        result["avg_wind_speed_kmh"] = wx.get("wind_speed_10m") or 0

    return result


def _merge_owm(aq, wx):
    """Merge OpenWeatherMap air quality + weather into unified format."""
    result = {"source": "live"}

    if aq:
        comp = aq.get("components", {})
        co_ugm3 = comp.get("co", 400)
        aqi_level = aq.get("aqi_level", 2)

        result["current_aqi"] = OWM_AQI_MAP.get(aqi_level, 65)
        result["pm10"] = comp.get("pm10", 0)
        result["pm2_5"] = comp.get("pm2_5", 0)
        result["carbon_monoxide_ugm3"] = co_ugm3
        result["nitrogen_dioxide_ugm3"] = comp.get("no2", 0)
        result["sulphur_dioxide_ugm3"] = comp.get("so2", 0)
        result["ozone_ugm3"] = comp.get("o3", 0)
        result["current_co2_ppm"] = round(CO_TO_CO2_BASELINE + (co_ugm3 / CO_TO_CO2_SCALE), 1)

    if wx:
        main = wx.get("main", {})
        wind = wx.get("wind", {})
        result["avg_temperature_c"] = main.get("temp") or 0
        result["avg_humidity_pct"] = main.get("humidity") or 0
        # OWM wind is in m/s, convert to km/h
        result["avg_wind_speed_kmh"] = round((wind.get("speed") or 0) * 3.6, 1)

    return result
