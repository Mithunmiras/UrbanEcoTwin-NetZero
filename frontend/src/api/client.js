const API_BASE = 'http://localhost:8000/api';

async function fetchAPI(endpoint) {
  const res = await fetch(`${API_BASE}${endpoint}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function postAPI(endpoint, body) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  getCities: () => fetchAPI('/cities'),
  getZones: (city) => fetchAPI(`/zones${city ? `?city=${city}` : ''}`),
  getDataFusion: () => fetchAPI('/data-fusion'),
  getPredictions: (zoneId) => fetchAPI(`/predictions${zoneId ? `?zone_id=${zoneId}` : ''}`),
  simulate: (zoneId, actions) => postAPI('/simulate', { zone_id: zoneId, actions }),
  getAvailableActions: () => fetchAPI('/simulate/actions'),
  getOptimize: (zoneId) => fetchAPI(`/optimize${zoneId ? `?zone_id=${zoneId}` : ''}`),
  getAgents: () => fetchAPI('/agents'),
  getNetZero: () => fetchAPI('/netzero'),
  getScores: () => fetchAPI('/scores'),
  getCarbonCredits: (zoneId) => fetchAPI(`/carbon-credits${zoneId ? `?zone_id=${zoneId}` : ''}`),
  getHealth: () => fetchAPI('/health'),
  getReport: () => fetchAPI('/report'),
  getAlerts: () => fetchAPI('/alerts'),
};
