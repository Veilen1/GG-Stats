# 🎮 GG Stats

> Scalable gaming statistics platform for **League of Legends** and **Teamfight Tactics (TFT)**.  
> Real-time match data, ranked stats, builds, and live game tracking — similar to Porofessor or OP.GG.

![Status](https://img.shields.io/badge/status-ready%20for%20deployment-success)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📸 Features

- 🔍 **Summoner Search** — Look up any player by Riot ID (Name#Tag) across all regions
- 📊 **Ranked Stats** — Solo/Duo and Flex queue statistics with tier visualization
- 📜 **Match History** — Detailed match history with KDA, CS, items, damage, and more
- ⚡ **Live Game** — Real-time spectator data when a summoner is in-game (polling + WebSocket)
- 🧩 **TFT Support (Complete)** — Full TFT stats, match history, and smart icon resolution (handling DDragon/CDragon fallbacks and Riot's PUUID deprecations).
- 🌐 **Multi-Region** — Support for all Riot API regions (LAS, LAN, NA, EUW, KR, etc.)
- 🎯 **Champion Builds** — Popular builds aggregated from match data *(coming soon)*

---

## 🏗️ Architecture

```
gg-stats/
├── apps/
│   ├── api/          → NestJS backend (REST + WebSocket)
│   └── web/          → Next.js 15 frontend (App Router, SSR)
├── packages/
│   └── shared/       → Shared TypeScript types & constants
├── docker-compose.yml
├── turbo.json
└── package.json
```

### Tech Stack

| Layer | Technology | Purpose |
|:---|:---|:---|
| **Monorepo** | Turborepo | Efficient multi-app workspace management |
| **Frontend** | Next.js 15, React 19, TypeScript | SSR/ISR, App Router, SEO-optimized pages |
| **Styling** | Vanilla CSS (custom properties) | Premium dark gaming aesthetic with glassmorphism |
| **Backend** | NestJS, TypeScript | Modular API with guards, interceptors, Swagger docs |
| **Real-time** | Socket.IO | WebSocket for live game data updates |
| **Database** | PostgreSQL + Prisma ORM | Match data storage, user data *(Phase 2)* |
| **Cache** | Redis | API response caching, rate limiting *(Phase 2)* |
| **External API** | Riot Games API | Summoner, Match, Spectator, TFT data |
| **Static Assets** | Data Dragon / Community Dragon | Champion icons, items, ranked emblems |
| **Deployment** | Vercel (frontend), Railway/Render (backend) | Production hosting |

### Data Flow

```
Client (Next.js) ──→ Backend (NestJS) ──→ Riot Games API
                            │
                   ┌────────┴────────┐
                   │                 │
                 Redis            PostgreSQL
               (cache)           (storage)
```

### API Endpoints

| Method | Path | Description |
|:---|:---|:---|
| `GET` | `/api/summoner/:region/:name/:tag` | Get summoner profile |
| `GET` | `/api/summoner/:region/:name/:tag/ranked` | Get ranked stats |
| `GET` | `/api/summoner/:region/:name/:tag/champion-mastery` | Get champion mastery |
| `GET` | `/api/matches/:region/:name/:tag?count=20&queue=420` | Get match history |
| `GET` | `/api/matches/detail/:region/:matchId` | Get match detail |
| `GET` | `/api/live-game/:region/:name/:tag` | Check live game |
| `WS`  | `/live-game` | WebSocket for live updates |
| `GET` | `/api/tft/summoner/:region/:name/:tag` | Get TFT profile & ranked stats (PUUID supported) |
| `GET` | `/api/tft/matches/:region/:name/:tag` | Get TFT match history |

Full API documentation available at `http://localhost:3001/docs` (Swagger UI).

---

## 🚀 Getting Started (Local Development)

### Prerequisites

- **Node.js** ≥ 20.0.0
- **npm** ≥ 10.0.0
- **Docker & Docker Compose** (for PostgreSQL + Redis)
- **Riot Games API Key** — [Get one here](https://developer.riotgames.com/)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/gg-stats.git
cd gg-stats
npm install
```

### 2. Configure Environment

```bash
# Copy the environment template
cp .env.example .env

# Edit .env and add your Riot API key
# RIOT_API_KEY=RGAPI-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

> ⚠️ **Security**: The `.env` file is gitignored. Never commit your API key.

### 3. Start Services (Database + Cache)

```bash
docker compose up -d
```

### 4. Run Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start them separately
npm run dev:api    # Backend on http://localhost:3001
npm run dev:web    # Frontend on http://localhost:3000
```

---

## 📦 Deployment Guide

To deploy this monorepo to production for free (or extremely low cost), follow this architecture:

### 1. Database & Cache (The Infrastructure)
- **PostgreSQL**: Create a free serverless Postgres database on **[Neon.tech](https://neon.tech/)** or **[Supabase](https://supabase.com/)**. Get your `DATABASE_URL`.
- **Redis**: Create a free serverless Redis database on **[Upstash](https://upstash.com/)**. Get your `REDIS_HOST` and `REDIS_PORT`.

### 2. Backend (Render / Railway)
Deploy the NestJS API to **[Render](https://render.com/)** or **[Railway](https://railway.app/)**:
1. Connect your GitHub repository.
2. Build Command: `npm install && npm run build --filter=api`
3. Start Command: `npm run start:prod --filter=api`
4. Set the following **Environment Variables**:
   - `RIOT_API_KEY`: Your production Riot API Key
   - `DATABASE_URL`: Your Neon/Supabase connection string
   - `REDIS_HOST` / `REDIS_PORT`: Your Upstash Redis credentials
   - `NODE_ENV`: `production`

### 3. Frontend (Vercel)
Deploy the Next.js Web App to **[Vercel](https://vercel.com/)**:
1. Import your GitHub repository to Vercel.
2. Vercel automatically detects the **Turborepo** and **Next.js** framework.
3. Set the **Root Directory** to `apps/web`.
4. Set the following **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: The URL provided by your Backend deployment (e.g., `https://ggstats-api.onrender.com`).
5. Click **Deploy**.

*With this setup, every `git push origin main` will automatically trigger a zero-downtime deployment for both your frontend and backend.*

---

## 🎨 Design System

The app uses a **premium dark gaming aesthetic** built with vanilla CSS custom properties:

- **Dark background** with subtle radial gradients
- **Glassmorphism** cards with backdrop blur
- **Tier-based color coding** (Iron → Challenger)
- **Micro-animations** (fade-in, stagger, shimmer loading)
- **Responsive design** (mobile-first breakpoints)

---

## 🗺️ Roadmap

| Phase | Features | Status |
|:---|:---|:---|
| **Phase 1** | Core search, profile, match history, live game, **TFT Integration** | ✅ Completed |
| **Phase 2** | Auth (NextAuth), favorites, search history, player comparison | 📋 Planned |
| **Phase 3** | Advanced analytics (CS/min trends, damage graphs, heatmaps) | 📋 Planned |
| **Phase 4** | More games (Valorant — same Riot API) | 📋 Planned |

---

## 📝 License

This project is for educational and portfolio purposes.

**GG Stats** isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties.
