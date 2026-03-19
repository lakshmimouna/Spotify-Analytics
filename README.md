<div align="center">

  <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_White.png" alt="Spotify Logo" width="200"/>

  <h1>🎧 Spotify Analytics Dashboard</h1>

  <p>A full-stack web application that connects to your Spotify account and visualizes your personal listening data — top artists, top tracks, genre categories, and listening patterns.</p>

  <p>
    <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
    <img src="https://img.shields.io/badge/Python-Flask-3776AB?style=for-the-badge&logo=python&logoColor=white" />
    <img src="https://img.shields.io/badge/Spotify-Web_API-1DB954?style=for-the-badge&logo=spotify&logoColor=white" />
    <img src="https://img.shields.io/badge/OAuth_2.0-PKCE-orange?style=for-the-badge&logo=auth0&logoColor=white" />
  </p>

</div>

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Frontend Setup](#frontend-setup-react)
  - [Backend Setup](#backend-setup-python-flask)
- [How Authentication Works](#-how-authentication-works-oauth-20-pkce)
- [Project Structure](#-project-structure)
- [Known Limitations](#-known-limitations)
- [Future Improvements](#-future-improvements)

---

## 🎯 About the Project

**Spotify Analytics Dashboard** is a personal data visualization tool built on top of the [Spotify Web API](https://developer.spotify.com/documentation/web-api). After logging in with your Spotify account, the app fetches your real listening data and presents it in a clean, interactive dashboard.

Unlike a music player, this is purely an **analytics experience** — designed to give you deep insights into your music taste.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Secure Login** | Spotify OAuth 2.0 with PKCE — no backend secret required |
| 📊 **Overview Tab** | Recently played tracks + animated listening time bar chart |
| 🎤 **Top Artists Tab** | Scrollable carousel of your top 10 most-played artists |
| 🎵 **Top Tracks Tab** | Grid of your top 12 tracks with popularity and duration stats |
| 🎭 **Categories Tab** | Auto-generated genre breakdown (Telugu, Hindi, Tamil, Pop, Rock, etc.) |
| 💾 **Session Persistence** | Access token stored locally — no re-login needed on page refresh |
| 🐍 **Analytics Backend** | Python Flask API with Pandas for deep listening time analysis |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **React Context API + useReducer** | Global state management (Redux-like, no extra library) |
| **spotify-web-api-js** | Spotify API SDK wrapper |
| **Material UI (MUI)** | Icons for the sidebar navigation |
| **Vanilla CSS** | Custom animations, responsive layouts, carousel & charts |
| **react-router-dom** | Routing |

### Backend
| Technology | Purpose |
|---|---|
| **Python** | Backend language |
| **Flask** | REST API framework |
| **Pandas** | Listening time data aggregation and analysis |
| **flask-cors** | Cross-origin request handling |

### External APIs
| API | Usage |
|---|---|
| **Spotify Accounts API** | OAuth 2.0 PKCE authentication |
| **Spotify Web API** | Fetching top tracks, top artists, recently played |

---

## 🏗️ Architecture

### System Overview

```
┌──────────────────────────────────────────────┐
│              Browser (React App)             │
│                  Port 3000                   │
│                                              │
│  ┌──────────┐    ┌────────────────────────┐  │
│  │ Sidebar  │    │     Analytics Hub      │  │
│  │ Nav Tabs │───▶│ Overview | Artists     │  │
│  └──────────┘    │ Tracks  | Categories  │  │
│                  └────────────────────────┘  │
└─────────────────────┬────────────────────────┘
                      │ Spotify Web API calls
                      ▼
┌──────────────────────────────────────────────┐
│            Spotify Cloud Services            │
│                                              │
│  ┌────────────────┐  ┌─────────────────────┐ │
│  │  Accounts API  │  │    Web API          │ │
│  │  (OAuth PKCE)  │  │  /me/top/tracks     │ │
│  └────────────────┘  │  /me/top/artists    │ │
│                      │  /me/player/recently│ │
│                      └─────────────────────┘ │
└──────────────────────────────────────────────┘
                      │ (optional)
                      ▼
┌──────────────────────────────────────────────┐
│         Python Flask Backend                 │
│               Port 5000                      │
│                                              │
│  POST /api/analytics/complete                │
│  → Pandas: weekly/monthly listening time     │
│  → Peak listening hours analysis            │
└──────────────────────────────────────────────┘
```

### OAuth 2.0 PKCE Flow

```
User clicks LOGIN
      │
      ▼
Generate code_verifier (128-char random string)
      │
      ▼
Hash it → code_challenge (SHA-256)
      │
      ▼
Redirect to Spotify with code_challenge
      │
      ▼
User approves on Spotify
      │
      ▼
Spotify redirects back with ?code=AUTH_CODE
      │
      ▼
Exchange code + code_verifier → access_token
      │
      ▼
Store token → Fetch user profile → Show Dashboard ✅
```

### React Component Tree

```
index.js
└── <DataLayer>              ← Global state (Context + useReducer)
    └── <App>                ← Auth gate: Login vs Dashboard
        ├── <Login />        ← Shown when not authenticated
        └── <Player>         ← Main layout shell
            ├── <Sidebar />  ← Tab navigation
            └── <Body>
                ├── <Header />       ← Search bar + user avatar
                └── <Analytics />    ← Data fetcher + tab router
                    ├── <OverviewPage />
                    ├── <TopArtistsPage />
                    ├── <TopTracksPage />
                    └── <CategoriesPage />
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v16 or higher
- **npm** v8 or higher
- **Python** 3.8 or higher (for backend)
- A **Spotify Developer Account** → [Create one here](https://developer.spotify.com/dashboard)

### Spotify App Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click **"Create App"**
3. Fill in any name/description
4. Set **Redirect URI** to: `http://127.0.0.1:3000/`
5. Copy your **Client ID**
6. Open `src/js/spotify.js` and replace:
   ```js
   export const clientId = "YOUR_CLIENT_ID_HERE";
   ```

---

### Frontend Setup (React)

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/Spotify-Analytics.git
cd Spotify-Analytics

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

The app will open at **http://127.0.0.1:3000**

> ⚠️ Important: Use `127.0.0.1:3000` not `localhost:3000` — this must match the Redirect URI set in your Spotify App dashboard exactly.

---

### Backend Setup (Python Flask)

The backend is optional — the frontend works without it. Run it if you want the advanced Pandas-based listening time analysis.

```bash
# 1. Navigate to the Python directory
cd src/py

# 2. (Recommended) Create a virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# 3. Install dependencies
pip install flask flask-cors pandas

# 4. Start the Flask server
python app.py
```

The backend will run at **http://localhost:5000**

---

## 🔐 How Authentication Works (OAuth 2.0 PKCE)

This app uses the **Authorization Code Flow with PKCE** — the recommended method for client-side web apps that can't safely store a client secret.

**Why PKCE?**
- No backend server needed to keep secrets
- Cryptographically secure via SHA-256 code challenge
- The `code_verifier` never leaves the browser

**Scopes requested** (permissions your Spotify account grants):
```
user-read-currently-playing    user-read-recently-played
user-read-playback-state       user-top-read
user-modify-playback-state     user-read-private
user-library-read              playlist-read-private
playlist-read-collaborative    user-follow-read
streaming
```

---

## 📁 Project Structure

```
Spotify-Analytics/
│
├── public/
│   └── index.html              ← HTML shell
│
├── src/
│   ├── index.js                ← App entry point
│   │
│   ├── js/
│   │   ├── App.js              ← Auth logic & root component
│   │   ├── spotify.js          ← OAuth PKCE helpers
│   │   ├── DataLayer.js        ← Global state context provider
│   │   ├── reducer.js          ← State reducer (actions & initial state)
│   │   ├── Login.js            ← Login page
│   │   ├── Player.js           ← Main layout (Sidebar + Body)
│   │   ├── Sidebar.js          ← Navigation panel
│   │   ├── SidebarOption.js    ← Reusable nav item
│   │   ├── Body.js             ← Content area
│   │   ├── Header.js           ← Top bar with search & user avatar
│   │   ├── Analytics.js        ← Analytics hub: data fetching & routing
│   │   ├── analyticsAPI.js     ← API client for Python backend
│   │   ├── OverviewPage.js     ← Overview tab
│   │   ├── TopArtistsPage.js   ← Top Artists carousel tab
│   │   ├── TopTracksPage.js    ← Top Tracks grid tab
│   │   └── CategoriesPage.js   ← Genre categories tab
│   │
│   ├── css/                    ← Component-specific stylesheets
│   │   ├── Analytics.css
│   │   ├── CategoriesPage.css
│   │   ├── Login.css
│   │   ├── OverviewPage.css
│   │   ├── Sidebar.css
│   │   ├── TopArtistsPage.css
│   │   ├── TopTracksPage.css
│   │   └── ...
│   │
│   └── py/
│       └── app.py              ← Flask REST API + Pandas analyzer
│
├── package.json
└── README.md
```

---

## ⚠️ Known Limitations

- **Listening time charts use estimated data** — Spotify's API doesn't expose total listening hours. The charts display data calculated from recently played track durations as an approximation.
- **No token refresh** — Spotify access tokens expire after **1 hour**. The user must log in again after expiry.
- **Search bar is non-functional** — The search input in the header is a UI placeholder.
- **Python backend is optional** — `analyticsAPI.js` is implemented but the React components currently fetch directly from Spotify; the backend is available for future integration.

---

## 🔮 Future Improvements

- [ ] Implement **Spotify token refresh** to keep sessions alive beyond 1 hour
- [ ] Connect **Python backend** to power the listening time charts with real data
- [ ] Make the **search bar functional** using Spotify's Search API
- [ ] Add a **playlist browser** to explore user playlists
- [ ] Add **dark/light theme toggle**
- [ ] Deploy frontend to **Vercel** and backend to **Render**
- [ ] Store listening history in a **database** to track trends over time

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <p>Built with ❤️ using React + Spotify Web API</p>
  <p>
    <a href="https://developer.spotify.com/documentation/web-api">Spotify API Docs</a> •
    <a href="https://reactjs.org/">React Docs</a> •
    <a href="https://flask.palletsprojects.com/">Flask Docs</a>
  </p>
</div>
