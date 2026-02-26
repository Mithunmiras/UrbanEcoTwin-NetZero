# 🌍 UrbanEcoTwin-NetZero

### Multi-Agent AI-Powered Digital Twin for Net-Zero Sustainability Planning

<div align="center">

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)

**An AI-powered sustainability intelligence platform that creates a Digital Twin of Chennai and autonomously predicts emissions, simulates strategies, optimizes carbon reduction, and generates a Net-Zero roadmap.**

</div>

---

## 🧠 Project Vision

UrbanEcoTwin-NetZero addresses critical urban sustainability challenges by combining:

- 🏙️ **Digital Twin** — Virtual replica of a city with real-time environmental monitoring
- 🤖 **Artificial Intelligence** — LSTM & XGBoost-based CO₂ prediction engine
- 🧬 **Reinforcement Learning** — DQN-based strategy optimization
- 🤝 **Multi-Agent System** — 4 autonomous AI agents working collaboratively
- 📊 **Sustainability Intelligence** — Net-Zero roadmap & carbon credit economics

## 🎯 Core Problem

Cities currently:
- ❌ React to pollution **after** it occurs
- ❌ Lack predictive tools for emission forecasting
- ❌ Cannot test sustainability strategies safely before implementation
- ❌ Have no intelligent Net-Zero planning system

**UrbanEcoTwin-NetZero solves all of these.**

## 🏗️ System Architecture

```
Real-World Environmental Data
        ↓
   Data Fusion Engine         ← Merges pollution, weather, traffic, population data
        ↓
  Urban Digital Twin Model    ← Virtual city with 5 monitored zones
        ↓
   AI Prediction Engine       ← LSTM + XGBoost CO₂ forecasts (1h, 24h, 7-day)
        ↓
 Scenario Simulation Engine   ← Test: trees, solar, EVs, factories
        ↓
Reinforcement Learning Optimizer ← DQN finds optimal strategy
        ↓
  Multi-Agent AI Layer        ← 4 autonomous agents (Monitor, Predict, Optimize, Policy)
        ↓
  Net-Zero Planning Engine    ← Phase-wise roadmap to carbon neutrality
        ↓
  Carbon Credit Calculator    ← CO₂ reduction → monetary value
        ↓
   Dashboard + Reports        ← Premium interactive visualization
```

## 🌐 Complete Module Breakdown

| # | Module | Description |
|---|--------|-------------|
| 1 | **Urban Digital Twin** | Virtual model of Chennai with 5 zones — CO₂, AQI, risk levels |
| 2 | **Data Fusion Engine** | Combines pollution, weather, traffic & population datasets |
| 3 | **AI Prediction Engine** | LSTM/XGBoost CO₂ predictions — 1 hour, 24 hour, 7 day |
| 4 | **Scenario Simulation** | Simulate: plant trees, add solar, increase traffic, add factory |
| 5 | **RL Optimizer** | Deep Q-Network finds best sustainability strategy per zone |
| 6 | **Multi-Agent AI** | 4 autonomous agents: Monitoring, Prediction, Optimization, Policy |
| 7 | **Net-Zero Planner** | Generates year-by-year roadmap with 4 phases to Net-Zero |
| 8 | **Renewable Energy Sim** | Simulates coal→solar, petrol→EV transitions |
| 9 | **Sustainability Score** | Multi-factor 0–100 scoring per zone with grades |
| 10 | **Carbon Credit Calculator** | Converts CO₂ reduction to ₹ / $ monetary value |
| 11 | **Health Impact Predictor** | Population health risk assessment based on AQI/CO₂ |
| 12 | **Policy Report Generator** | Government-ready comprehensive report |
| 13 | **Alert System** | Multi-level threshold alerts (Critical / Warning / Info) |

## 🖥️ Dashboard Features

| Feature | Description |
|---------|-------------|
| 📊 **Overview Dashboard** | Key metrics, CO₂ charts, risk distribution, live alerts |
| 🗺️ **Interactive Map** | Leaflet map of Chennai with colored zone markers |
| 📈 **Prediction Charts** | Area/line charts for hourly and weekly CO₂ forecasts |
| 🎛️ **Scenario Simulator** | Interactive sliders to test sustainability actions |
| 📅 **Net-Zero Timeline** | Phase-wise roadmap with progress indicators |
| 🕸️ **Radar Charts** | Multi-factor sustainability scoring per zone |
| 💰 **Carbon Economics** | Pie charts and tables for carbon credit calculations |
| ❤️ **Health Dashboard** | Population health risk cards with advisories |

## 🧰 Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Recharts, Leaflet, React Router |
| **Backend** | Python 3.10+, FastAPI, Uvicorn |
| **AI/ML** | Simulated LSTM, XGBoost, Deep Q-Network (DQN) |
| **Data** | NumPy, Pandas, Synthetic Chennai zone data |
| **Visualization** | Recharts (Bar, Line, Area, Pie, Radar), Leaflet Maps |

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm

### 1. Clone the repository
```bash
git clone https://github.com/Mithunmiras/UrbanEcoTwin-NetZero.git
cd UrbanEcoTwin-NetZero
```

### 2. Start the Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```
Backend API will be available at `http://localhost:8000` (Swagger docs at `/docs`)

### 3. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend will be available at `http://localhost:5173`

### 4. Open in Browser
Navigate to **http://localhost:5173** to view the dashboard.

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/zones` | Digital twin zone data |
| GET | `/api/data-fusion` | Unified environmental data |
| GET | `/api/predictions` | AI CO₂ predictions |
| POST | `/api/simulate` | Run scenario simulation |
| GET | `/api/simulate/actions` | Available simulation actions |
| GET | `/api/optimize` | RL optimizer results |
| GET | `/api/agents` | Multi-agent system analysis |
| GET | `/api/netzero` | Net-Zero roadmap |
| GET | `/api/scores` | Sustainability scores |
| GET | `/api/carbon-credits` | Carbon credit calculations |
| GET | `/api/health` | Health impact predictions |
| GET | `/api/report` | Policy report |
| GET | `/api/alerts` | Active alerts |

## 📊 Example Output

| Metric | Value |
|--------|-------|
| Current CO₂ | 420 ppm |
| Predicted (24h) | 460 ppm |
| After Optimization | 350 ppm |
| Carbon Credits | ₹10,000 |
| Sustainability Score | 90 / 100 |

## 🌱 Sustainability Impact

- ✅ Climate action intelligence
- ✅ Data-driven Net-Zero planning
- ✅ Carbon reduction optimization
- ✅ Smart city decision support
- ✅ Health-aware environmental policy

## 🏆 Innovation Highlights

| Feature | Novelty Level |
|---------|--------------|
| Digital Twin | ⭐⭐⭐⭐⭐ Very High |
| AI Prediction | ⭐⭐⭐⭐ High |
| Reinforcement Learning | ⭐⭐⭐⭐⭐ Very High |
| Multi-Agent System | ⭐⭐⭐⭐⭐ Very High |
| Net-Zero Planning | ⭐⭐⭐⭐⭐ Extremely High |
| Carbon Credits | ⭐⭐⭐⭐⭐ Rare |

## 📂 Project Structure

```
UrbanEcoTwin-NetZero/
├── backend/
│   ├── main.py                    # FastAPI entry point
│   ├── requirements.txt           # Python dependencies
│   ├── data/
│   │   └── city_data.py           # Synthetic Chennai zone data
│   ├── modules/
│   │   ├── digital_twin.py        # Urban Digital Twin
│   │   ├── data_fusion.py         # Data Fusion Engine
│   │   ├── prediction_engine.py   # AI Prediction Engine
│   │   ├── scenario_simulation.py # Scenario Simulator
│   │   ├── rl_optimizer.py        # RL Optimizer
│   │   ├── multi_agent.py         # Multi-Agent AI System
│   │   ├── netzero_planner.py     # Net-Zero Planning
│   │   ├── sustainability_score.py# Sustainability Scoring
│   │   ├── carbon_credits.py      # Carbon Credit Calculator
│   │   ├── health_impact.py       # Health Impact Predictor
│   │   ├── policy_report.py       # Policy Report Generator
│   │   └── alerts.py              # Alert System
│   └── routers/
│       └── api.py                 # All REST endpoints
├── frontend/
│   ├── src/
│   │   ├── App.jsx                # Main app with routing
│   │   ├── index.css              # Premium design system
│   │   ├── main.jsx               # React entry point
│   │   ├── api/
│   │   │   └── client.js          # API client
│   │   ├── components/
│   │   │   └── Sidebar.jsx        # Navigation sidebar
│   │   └── pages/
│   │       ├── Dashboard.jsx      # Overview dashboard
│   │       ├── DigitalTwin.jsx    # Interactive map
│   │       ├── Predictions.jsx    # AI predictions
│   │       ├── Simulation.jsx     # Scenario simulator
│   │       ├── Optimize.jsx       # RL optimizer
│   │       ├── Agents.jsx         # Multi-agent system
│   │       ├── NetZero.jsx        # Net-Zero roadmap
│   │       ├── Scores.jsx         # Sustainability scores
│   │       ├── CarbonCredits.jsx  # Carbon credits
│   │       ├── Health.jsx         # Health impact
│   │       ├── Reports.jsx        # Policy reports
│   │       └── Alerts.jsx         # Alert system
│   └── package.json
├── context.md                     # Project specification
└── README.md
```

## 📜 License

This project is built for the **Eco Codethon** hackathon.

---

<div align="center">
<strong>Built with 💚 for a sustainable future</strong>
</div>
