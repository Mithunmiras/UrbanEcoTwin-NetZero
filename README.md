# 🌍 UrbanEcoTwin-NetZero

### Multi-Agent AI-Powered Digital Twin for Net-Zero Sustainability Planning

<div align="center">

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Cesium](https://img.shields.io/badge/Cesium.js-3D_Globe-6CADDF?style=for-the-badge&logo=cesium&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)

**An AI-powered sustainability intelligence platform with a 3D Digital Twin covering 109 districts across 4 South Indian states — fetches live pollution data, predicts emissions with ML, simulates strategies, optimizes carbon reduction, and generates Net-Zero roadmaps.**

</div>

---

## 🧠 Project Vision

UrbanEcoTwin-NetZero addresses critical urban sustainability challenges by combining:

- 🌐 **3D Digital Twin** — Cesium.js globe with satellite imagery and real-time environmental overlays
- 📡 **Live Data** — Real-time pollution & weather from Open-Meteo + OpenWeatherMap APIs (dual fallback)
- 🏛️ **4 States, 109 Districts** — Full coverage of **Tamil Nadu** (38), **Kerala** (14), **Karnataka** (31), and **Andhra Pradesh** (26)
- 🔐 **Admin Authentication** — Secure login with SHA-256 hashing and session management
- 🗺️ **State Selection** — Choose a state to view all its districts' environmental data
- 🤖 **Machine Learning** — LSTM, XGBoost, Logistic Regression, and Weighted Ensemble models
- 🧬 **Reinforcement Learning** — DQN-based strategy optimization
- 🤝 **Multi-Agent System** — 4 autonomous AI agents working collaboratively
- 📊 **Sustainability Intelligence** — Net-Zero roadmap, carbon credit economics, and sustainability scoring

## 🎯 Core Problem

Cities currently:
- ❌ React to pollution **after** it occurs
- ❌ Lack predictive tools for emission forecasting
- ❌ Cannot test sustainability strategies safely before implementation
- ❌ Have no intelligent Net-Zero planning system

**UrbanEcoTwin-NetZero solves all of these.**

## 🏗️ System Architecture

```
    Live APIs (Open-Meteo + OpenWeatherMap)
              ↓
    Data Fusion Engine         ← Merges live pollution, weather data for 109 districts
              ↓
    Urban Digital Twin         ← 3D Cesium.js globe with 4 South Indian states
              ↓
    AI Prediction Engine       ← LSTM + XGBoost CO₂ forecasts (1h, 24h, 7-day)
              ↓
    ML Health Impact Predictor ← Logistic Regression + WHO compliance
              ↓
    Scenario Simulation Engine ← Test: trees, solar, EVs, factories
              ↓
    RL Optimizer (DQN)         ← Finds optimal sustainability strategy
              ↓
    Multi-Agent AI Layer       ← 4 autonomous agents collaborate
              ↓
    Net-Zero Planning Engine   ← Phase-wise roadmap to carbon neutrality
              ↓
    Dashboard + 3D Globe       ← Premium interactive visualization
```

## 🌐 Live Data Sources

| API | Data | Key Required? |
|-----|------|---------------|
| **Open-Meteo** (Primary) | AQI, PM2.5, PM10, CO, NO₂, SO₂, O₃, Temperature, Humidity, Wind | ❌ No |
| **OpenWeatherMap** (Fallback) | Air Pollution, Weather | ✅ Free API Key |

- **Dual fallback**: If Open-Meteo fails for any zone, OpenWeatherMap automatically takes over
- **5-minute cache**: Reduces API calls while keeping data fresh
- **Per-zone independent fallback**: Each zone can use a different API source

## 🗺️ States & Districts (109 Zones)

| State | Districts | Coverage |
|-------|-----------|----------|
| 🏛️ **Tamil Nadu** | 38 | Chennai, Coimbatore, Madurai, Tiruchirappalli, Salem, Tirunelveli, Erode, Vellore, Thoothukudi, Dindigul, Thanjavur, Ranipet, Sivaganga, Virudhunagar, Namakkal, Cuddalore, Kanchipuram, Tiruvallur, Tiruppur, Nagapattinam, Ramanathapuram, Theni, Nilgiris, Krishnagiri, Dharmapuri, Karur, Perambalur, Ariyalur, Pudukkottai, Kallakurichi, Tirupattur, Tiruvannamalai, Villupuram, Chengalpattu, Tenkasi, Mayiladuthurai, and more |
| 🌴 **Kerala** | 14 | Thiruvananthapuram, Kochi, Kozhikode, Thrissur, Kollam, Alappuzha, Palakkad, Malappuram, Kannur, Kottayam, Idukki, Pathanamthitta, Wayanad, Kasaragod |
| 🏙️ **Karnataka** | 31 | Bengaluru Urban, Mysuru, Mangaluru, Hubballi-Dharwad, Belagavi, Kalaburagi, Ballari, Davangere, Shivamogga, Tumakuru, Raichur, Bidar, Vijayapura, Hassan, Mandya, Chitradurga, Udupi, Chikkamagaluru, Bagalkote, Gadag, Haveri, Koppal, Ramanagara, Chamarajanagara, Kodagu, Yadgir, Chikkaballapur, Bengaluru Rural, Kolar, and more |
| ⛵ **Andhra Pradesh** | 26 | Visakhapatnam, Vijayawada, Guntur, Nellore, Kurnool, Kakinada, Rajahmundry, Tirupati, Kadapa, Anantapur, Eluru, Ongole, Srikakulam, Vizianagaram, Machilipatnam, Chittoor, Proddatur, Hindupur, Adoni, Narasaraopet, Tenali, Bhimavaram, Amalapuram, Markapur, Parvathipuram, Nandyal |

## 🔐 Authentication

The platform is secured with admin authentication:
- **Login**: Username and password with SHA-256 hashing
- **Session**: Token stored in localStorage with React Context
- **Default credentials**: `admin` / `admin123`

After login, a **State Selection** page lets you choose which state to monitor. All subsequent pages show data filtered for the selected state.

## 🧪 ML Models

| Model | Purpose | Inputs |
|-------|---------|--------|
| **Weighted Ensemble** | Overall health risk score (0-100) | PM2.5, PM10, NO₂, O₃, SO₂, CO, AQI, Temperature |
| **Logistic Regression** | Per-condition probability prediction | 6 pollutants → 6 health conditions |
| **WHO Guideline Checker** | Compliance assessment | Live values vs WHO 2021 safe limits |
| **LSTM (simulated)** | CO₂ time-series forecasting | Historical + current CO₂ |
| **XGBoost (simulated)** | Short-term AQI prediction | Multi-pollutant features |
| **Deep Q-Network** | Optimal sustainability strategy | Zone state → best actions |

## 🌐 Complete Module Breakdown

| # | Module | Description |
|---|--------|-------------|
| 1 | **Urban Digital Twin** | 3D Cesium.js globe — 109 districts, 4 states, satellite imagery, district dropdown |
| 2 | **Data Fusion Engine** | Merges live pollution, weather data from dual APIs |
| 3 | **AI Prediction Engine** | LSTM/XGBoost CO₂ predictions — 1h, 24h, 7-day |
| 4 | **Scenario Simulation** | Simulate: plant trees, add solar, increase traffic, add factory |
| 5 | **RL Optimizer** | Deep Q-Network finds best sustainability strategy per zone |
| 6 | **Multi-Agent AI** | 4 autonomous agents: Monitoring, Prediction, Optimization, Policy |
| 7 | **Net-Zero Planner** | Year-by-year roadmap with 4 phases to Net-Zero |
| 8 | **Sustainability & Carbon Credits** | Multi-factor 0-100 scoring per zone with grades + carbon credit economics |
| 9 | **Health Impact Predictor** | ML-powered: Logistic Regression + WHO compliance |
| 10 | **Policy Report Generator** | Government-ready comprehensive report |
| 11 | **Alert System** | Multi-level threshold alerts (Critical / Warning / Info) |

## 🖥️ Dashboard Features

| Feature | Description |
|---------|-------------|
| 🔐 **Admin Login** | Secure authentication with carbon credit themed UI |
| 🗺️ **State Selector** | Choose Tamil Nadu, Kerala, Karnataka, or Andhra Pradesh |
| 📊 **Overview Dashboard** | Key metrics, CO₂ charts, risk distribution, live alerts |
| 🌍 **3D Digital Twin** | Cesium.js globe with satellite imagery, district dropdown, zone selection |
| 📈 **Prediction Charts** | Area/line charts for hourly and weekly CO₂ forecasts |
| 🎛️ **Scenario Simulator** | Interactive sliders to test sustainability actions |
| 📅 **Net-Zero Timeline** | Phase-wise roadmap with progress indicators |
| ❤️ **Health Dashboard** | ML risk scores, condition probabilities, WHO compliance |
| 🕸️ **Sustainability & Credits** | Radar charts, carbon credit pie charts, zone-wise breakdown |

## 🧰 Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Recharts, Cesium.js, React Router |
| **3D Globe** | Cesium.js with Cesium Ion (satellite imagery + 3D terrain) |
| **Backend** | Python 3.10+, FastAPI, Uvicorn |
| **Live Data** | Open-Meteo API, OpenWeatherMap API (dual fallback) |
| **AI/ML** | NumPy, Logistic Regression, Weighted Ensemble, DQN |
| **Auth** | SHA-256 hashing, localStorage tokens, React Context |
| **Visualization** | Recharts (Bar, Line, Area, Pie, Radar), Cesium.js 3D Globe |

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm

### API Keys Needed
| API | Required? | Get it at |
|-----|-----------|-----------|
| **Open-Meteo** | ❌ No key needed | — |
| **OpenWeatherMap** | ✅ Free key | [openweathermap.org/api](https://openweathermap.org/api) |
| **Cesium Ion** | ✅ Free key | [ion.cesium.com/signup](https://ion.cesium.com/signup) |

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
Backend API at `http://localhost:8000` (Swagger docs at `/docs`)

### 3. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend at `http://localhost:5173`

### 4. Open in Browser
Navigate to **http://localhost:5173**, log in with `admin` / `admin123`, select a state, and explore.

## 📡 API Endpoints

All data endpoints accept an optional `?state=` query parameter (`tamilnadu`, `kerala`, `karnataka`, `andhrapradesh`).

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/states` | List available states |
| GET | `/api/cities?state=` | List districts for a state |
| GET | `/api/zones?state=` | Digital twin zone data |
| GET | `/api/data-fusion?state=` | Unified environmental data |
| GET | `/api/predictions?state=` | AI CO₂ predictions |
| POST | `/api/simulate` | Run scenario simulation |
| GET | `/api/simulate/actions` | Available simulation actions |
| GET | `/api/optimize?state=` | RL optimizer results |
| GET | `/api/agents` | Multi-agent system analysis |
| GET | `/api/netzero?state=` | Net-Zero roadmap |
| GET | `/api/scores?state=` | Sustainability scores |
| GET | `/api/carbon-credits?state=` | Carbon credit calculations |
| GET | `/api/health?state=` | ML health impact predictions |
| GET | `/api/report?state=` | Policy report |
| GET | `/api/alerts?state=` | Active alerts |

## 📂 Project Structure

```
UrbanEcoTwin-NetZero/
├── backend/
│   ├── main.py                    # FastAPI entry point
│   ├── requirements.txt           # Python dependencies
│   ├── data/
│   │   ├── city_data.py           # 109 districts across 4 states (live data)
│   │   └── live_data.py           # Open-Meteo + OpenWeatherMap client
│   ├── modules/
│   │   ├── digital_twin.py        # Urban Digital Twin
│   │   ├── data_fusion.py         # Data Fusion Engine
│   │   ├── prediction_engine.py   # AI Prediction Engine
│   │   ├── scenario_simulation.py # Scenario Simulator
│   │   ├── rl_optimizer.py        # RL Optimizer (DQN)
│   │   ├── multi_agent.py         # Multi-Agent AI System
│   │   ├── netzero_planner.py     # Net-Zero Planning
│   │   ├── sustainability_score.py# Sustainability Scoring
│   │   ├── carbon_credits.py      # Carbon Credit Calculator
│   │   ├── health_impact.py       # ML Health Impact Predictor
│   │   ├── policy_report.py       # Policy Report Generator
│   │   └── alerts.py              # Alert System
│   └── routers/
│       └── api.py                 # All REST endpoints (state-filtered)
├── frontend/
│   ├── src/
│   │   ├── App.jsx                # Main app with auth + state routing
│   │   ├── index.css              # Premium design system
│   │   ├── main.jsx               # React entry point
│   │   ├── api/
│   │   │   └── client.js          # API client (state-aware)
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # Authentication context
│   │   │   └── StateContext.jsx    # State selection context
│   │   ├── components/
│   │   │   ├── Sidebar.jsx        # Navigation sidebar with state indicator
│   │   │   └── CesiumCityView.jsx # 3D globe component (4-state cameras)
│   │   └── pages/
│   │       ├── Login.jsx          # Admin login page
│   │       ├── StateSelector.jsx  # State selection screen
│   │       ├── Dashboard.jsx      # Overview dashboard
│   │       ├── DigitalTwin.jsx    # 3D Cesium globe + district dropdown
│   │       ├── Predictions.jsx    # AI predictions (state-filtered)
│   │       ├── Simulation.jsx     # Scenario simulator
│   │       ├── Optimize.jsx       # RL optimizer
│   │       ├── NetZero.jsx        # Net-Zero roadmap
│   │       ├── Scores.jsx         # Sustainability + Carbon Credits
│   │       ├── Health.jsx         # ML health impact
│   │       ├── Reports.jsx        # Policy reports
│   │       └── Alerts.jsx         # Alert system
│   ├── vite.config.js             # Vite + Cesium plugin
│   └── package.json
├── context.md                     # Project specification
└── README.md
```

## 🌱 Sustainability Impact

- ✅ Real-time environmental intelligence across 4 South Indian states (109 districts)
- ✅ ML-powered health risk assessment with WHO compliance
- ✅ Data-driven Net-Zero planning with carbon credit economics
- ✅ Smart city decision support with scenario simulation
- ✅ Health-aware environmental policy generation
- ✅ State-level comparative analysis and sustainability scoring

## 🏆 Innovation Highlights

| Feature | Novelty |
|---------|---------|
| 3D Cesium Globe Digital Twin | ⭐⭐⭐⭐⭐ Very High |
| Live Dual-API Data Pipeline | ⭐⭐⭐⭐⭐ Very High |
| 4-State Multi-Region Coverage (109 districts) | ⭐⭐⭐⭐⭐ Very High |
| ML Health Impact (Logistic Regression) | ⭐⭐⭐⭐⭐ Very High |
| AI Prediction (LSTM + XGBoost) | ⭐⭐⭐⭐ High |
| Reinforcement Learning Optimizer | ⭐⭐⭐⭐⭐ Very High |
| Multi-Agent AI System | ⭐⭐⭐⭐⭐ Very High |
| Net-Zero Roadmap + Carbon Credits | ⭐⭐⭐⭐⭐ Extremely High |
| Secure Admin Authentication | ⭐⭐⭐⭐ High |
| State Selection + Filtering | ⭐⭐⭐⭐ High |

## 📜 License

This project is built for the **Eco Codethon** hackathon.

---

<div align="center">
<strong>Built with 💚 for a sustainable future</strong>
</div>
