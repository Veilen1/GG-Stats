# 🎮 GG Stats

> Scalable gaming statistics platform for **League of Legends** and **Teamfight Tactics (TFT)**.  
> Real-time match data, ranked stats, builds, and live game tracking — similar to Porofessor or OP.GG.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📸 Features

- 🔍 **Summoner Search** — Look up any player by Riot ID (Name#Tag) across all regions
- 📊 **Ranked Stats** — Solo/Duo and Flex queue statistics with tier visualization
- 📜 **Match History** — Detailed match history with KDA, CS, items, damage, and more
- ⚡ **Live Game** — Real-time spectator data when a summoner is in-game (polling + WebSocket)
- 🎯 **Champion Builds** — Popular builds aggregated from match data *(coming soon)*
- 🧩 **TFT Support** — Full TFT stats, match history, and meta comps *(coming soon)*
- 🌐 **Multi-Region** — Support for all Riot API regions (LAS, LAN, NA, EUW, KR, etc.)

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
| `WS` | `/live-game` | WebSocket for live updates |
| `GET` | `/api/builds/:championName` | Get champion builds |
| `GET` | `/api/tft/summoner/:region/:name/:tag` | Get TFT profile |
| `GET` | `/api/tft/matches/:region/:name/:tag` | Get TFT match history |

Full API documentation available at `http://localhost:3001/docs` (Swagger UI).

---

## 🚀 Getting Started

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

This starts:
- **PostgreSQL** on port `5432`
- **Redis** on port `6379`

### 4. Run Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start them separately
npm run dev:api    # Backend on http://localhost:3001
npm run dev:web    # Frontend on http://localhost:3000
```

### 5. Open the App

- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:3001/docs

---

## 📂 Project Structure

### Backend (`apps/api/`)

```
src/
├── main.ts                    # Bootstrap, CORS, Swagger
├── app.module.ts              # Root module
├── riot-api/                  # Core Riot API HTTP client
│   ├── riot-api.module.ts     # Global module
│   └── riot-api.service.ts    # Secure HTTP client with retry + rate limiting
├── summoner/                  # Summoner profile & search
│   ├── summoner.controller.ts # REST endpoints
│   └── summoner.service.ts    # Business logic
├── match/                     # Match history & detail
│   ├── match.controller.ts
│   └── match.service.ts
├── live-game/                 # Live/spectator data
│   ├── live-game.controller.ts  # REST fallback
│   ├── live-game.service.ts     # Spectator API client
│   └── live-game.gateway.ts     # Socket.IO WebSocket gateway
├── builds/                    # Champion builds
│   ├── builds.controller.ts
│   └── builds.service.ts
└── tft/                       # TFT-specific endpoints
    ├── tft.controller.ts
    └── tft.service.ts
```

### Frontend (`apps/web/`)

```
src/
├── app/
│   ├── layout.tsx             # Root layout (Navbar, Footer)
│   ├── page.tsx               # Home page (search)
│   ├── globals.css            # Design system
│   ├── summoner/[region]/[name]/[tag]/
│   │   ├── page.tsx           # Summoner profile
│   │   └── loading.tsx        # Loading skeleton
│   ├── live/[region]/[name]/[tag]/
│   │   └── page.tsx           # Live game view
│   ├── champions/
│   │   └── page.tsx           # Champions list (coming soon)
│   └── tft/
│       └── page.tsx           # TFT home
├── components/
│   ├── layout/                # Navbar, Footer
│   ├── search/                # SearchBar with region selector
│   ├── summoner/              # ProfileHeader, RankedCard, MatchHistory
│   └── live-game/             # LiveGameBanner
└── lib/
    ├── api.ts                 # Backend API client
    └── ddragon.ts             # Data Dragon CDN helpers
```

---

## 🎨 Design System

The app uses a **premium dark gaming aesthetic** built with vanilla CSS custom properties:

- **Dark background** with subtle radial gradients
- **Glassmorphism** cards with backdrop blur
- **Tier-based color coding** (Iron → Challenger)
- **Micro-animations** (fade-in, stagger, shimmer loading)
- **Responsive design** (mobile-first breakpoints)
- **Typography**: Inter (UI), Outfit (headings), JetBrains Mono (stats)

---

## 🗺️ Roadmap

| Phase | Features | Status |
|:---|:---|:---|
| **Phase 1** | Core search, profile, match history, live game | ✅ In Progress |
| **Phase 2** | Auth (NextAuth), favorites, search history, player comparison | 📋 Planned |
| **Phase 3** | Advanced analytics (CS/min trends, damage graphs, heatmaps) | 📋 Planned |
| **Phase 4** | More games (Valorant — same Riot API) | 📋 Planned |
| **Phase 5** | PWA / Desktop app, push notifications | 📋 Planned |

---

## 🔐 Security

- API keys are stored **only in `.env`** files (gitignored)
- All Riot API calls are **proxied through the backend** — keys never reach the client
- **Rate limiting** on API endpoints (60 req/min per IP)
- **Input validation** on all endpoints via class-validator
- Riot API client includes **retry with backoff** for rate limit handling

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Backend unit tests
cd apps/api && npm test

# Backend e2e tests
cd apps/api && npm run test:e2e
```

---

## 📦 Deployment

### Frontend (Vercel)

The Next.js frontend is optimized for Vercel deployment:

```bash
# Build
cd apps/web && npm run build
```

Set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_API_URL` — Your backend URL
- `NEXT_PUBLIC_WS_URL` — Your WebSocket URL

### Backend (Railway / Render)

The NestJS backend can be deployed to any Node.js hosting:

```bash
# Build
cd apps/api && npm run build

# Start production
cd apps/api && npm run start:prod
```

Required environment variables:
- `RIOT_API_KEY` — Your Riot Games API key
- `DATABASE_URL` — PostgreSQL connection string
- `REDIS_HOST` / `REDIS_PORT` — Redis connection

---

## 📝 License

This project is for educational and portfolio purposes.

**GG Stats** isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties.

---

## 🤝 Contributing

This is a personal portfolio project, but suggestions and feedback are welcome! Feel free to open an issue.
