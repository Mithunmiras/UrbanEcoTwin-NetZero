"""
API Router — All REST endpoints for UrbanEcoTwin-NetZero.
"""

import json
import hashlib
import secrets
try:
    import numpy as np
    _HAS_NUMPY = True
except ImportError:
    _HAS_NUMPY = False
    np = None

from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from modules.digital_twin import get_digital_twin
from data.city_data import get_cities
from modules.data_fusion import fuse_data
from modules.prediction_engine import get_predictions, get_counterfactual_prediction
from modules.scenario_simulation import simulate_scenario, get_available_actions
from modules.rl_optimizer import optimize, optimize_with_budget
from modules.netzero_planner import generate_netzero_roadmap
from modules.sustainability_score import get_sustainability_scores
from modules.carbon_credits import calculate_carbon_credits
from modules.health_impact import get_health_impact
from modules.policy_report import generate_report
from modules.alerts import get_alerts

router = APIRouter(prefix="/api")


# --- Admin credentials (username: admin, password: admin123) ---
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD_HASH = hashlib.sha256("admin123".encode()).hexdigest()
_active_tokens: dict[str, str] = {}  # token -> username


# --- Request Models ---
class LoginRequest(BaseModel):
    username: str
    password: str


class ActionItem(BaseModel):
    action: str
    quantity: int


class SimulationRequest(BaseModel):
    zone_id: str
    actions: List[ActionItem]


# --- Auth Endpoint ---
@router.post("/auth/login")
def api_login(req: LoginRequest):
    """Authenticate admin user and return a session token."""
    password_hash = hashlib.sha256(req.password.encode()).hexdigest()
    if req.username == ADMIN_USERNAME and password_hash == ADMIN_PASSWORD_HASH:
        token = secrets.token_hex(32)
        _active_tokens[token] = req.username
        return {
            "success": True,
            "token": token,
            "user": {
                "username": ADMIN_USERNAME,
                "role": "admin",
                "name": "Admin",
            },
        }
    raise HTTPException(status_code=401, detail="Invalid username or password")


@router.post("/auth/logout")
def api_logout():
    """Logout (client-side token removal)."""
    return {"success": True, "message": "Logged out"}


# --- Endpoints ---

@router.get("/cities")
def api_cities():
    """Get list of available cities."""
    return {"cities": get_cities()}


@router.get("/zones")
def api_zones(city: Optional[str] = Query(None)):
    """Get digital twin data for all city zones. Optionally filter by city."""
    return get_digital_twin(city=city)


@router.get("/data-fusion")
def api_data_fusion():
    """Get unified environmental data from all sources."""
    return fuse_data()


@router.get("/predictions")
def api_predictions(zone_id: Optional[str] = Query(None)):
    """Get AI-powered multi-horizon CO₂ predictions (1h/24h/7d/30d) with SHAP explainability."""
    return get_predictions(zone_id)


@router.get("/predictions/counterfactual")
def api_counterfactual(
    zone_id: str = Query(..., description="Zone ID"),
    traffic_reduction_pct: float = Query(0, ge=0, le=100, description="Traffic reduction % to simulate"),
):
    """Counterfactual: 'What if traffic reduces by X%?' — recalculates prediction."""
    return get_counterfactual_prediction(zone_id, traffic_reduction_pct)


@router.post("/simulate")
def api_simulate(request: SimulationRequest):
    """Simulate sustainability actions on a zone."""
    actions = [{"action": a.action, "quantity": a.quantity} for a in request.actions]
    return simulate_scenario(request.zone_id, actions)


@router.get("/simulate/actions")
def api_available_actions():
    """Get list of available simulation actions."""
    return get_available_actions()


@router.get("/optimize")
def api_optimize(
    zone_id: Optional[str] = Query(None),
    budget_inr: Optional[float] = Query(None, description="Budget constraint in INR (e.g. 100000000 for ₹100 Cr)"),
):
    """Get RL-optimized sustainability strategies. Optional budget_inr for dynamic budget constraint."""
    result = optimize(zone_id)
    if budget_inr and budget_inr > 0:
        result["budget_constrained"] = optimize_with_budget(budget_inr)
    return result




@router.get("/netzero")
def api_netzero():
    """Get Net-Zero roadmap."""
    return generate_netzero_roadmap()


@router.get("/scores")
def api_scores():
    """Get sustainability scores for all zones."""
    return get_sustainability_scores()


@router.get("/carbon-credits")
def api_carbon_credits(zone_id: Optional[str] = Query(None)):
    """Get carbon credit calculations."""
    return calculate_carbon_credits(zone_id)


@router.get("/health")
def api_health():
    """Get health impact predictions."""
    return get_health_impact()


@router.get("/report")
def api_report():
    """Generate comprehensive policy report."""
    return generate_report()


@router.get("/alerts")
def api_alerts():
    """Get active sustainability alerts."""
    return get_alerts()
