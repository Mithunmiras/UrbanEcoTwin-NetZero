const API_BASE = 'http://localhost:8000/api';

function _qs(params) {
  const entries = Object.entries(params).filter(([, v]) => v != null && v !== '');
  if (!entries.length) return '';
  return '?' + entries.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
}

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
  getStates: () => fetchAPI('/states'),
  getCities: (state) => fetchAPI(`/cities${_qs({ state })}`),
  getZones: (city, state) => fetchAPI(`/zones${_qs({ city, state })}`),
  getDataFusion: (state) => fetchAPI(`/data-fusion${_qs({ state })}`),
  getPredictions: (zoneId, state) => fetchAPI(`/predictions${_qs({ zone_id: zoneId, state })}`),
  simulate: (zoneId, actions) => postAPI('/simulate', { zone_id: zoneId, actions }),
  getAvailableActions: () => fetchAPI('/simulate/actions'),
  getOptimize: (zoneId, budgetCr, state) => {
    const budget_inr = budgetCr ? Number(budgetCr) * 10000000 : undefined;
    return fetchAPI(`/optimize${_qs({ zone_id: zoneId, budget_inr, state })}`);
  },
  getNetZero: (state) => fetchAPI(`/netzero${_qs({ state })}`),
  getScores: (state) => fetchAPI(`/scores${_qs({ state })}`),
  getCarbonCredits: (zoneId, state) => fetchAPI(`/carbon-credits${_qs({ zone_id: zoneId, state })}`),
  getHealth: (state) => fetchAPI(`/health${_qs({ state })}`),
  getReport: (state) => fetchAPI(`/report${_qs({ state })}`),
  getAlerts: (state) => fetchAPI(`/alerts${_qs({ state })}`),
};
