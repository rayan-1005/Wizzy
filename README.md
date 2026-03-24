# Wizzy 🎮💰

> Personal finance tracking — but make it a boss battle.

Wizzy is a gamified finance tracking app that turns budgeting into an RPG. Log expenses, complete daily quests, defeat spending bosses, and level up your financial habits — all in a sleek, dark dashboard built for people who take money seriously.

---

## What Is This?

Most finance apps make you feel guilty. Wizzy makes you feel powerful.

- Log an expense → deal damage to the boss
- Stay under budget for a week → complete a quest & earn XP
- Hit a savings milestone → level up
- Overspend on impulse buys → face the **Spending Phantom** 👻

Built on a clean black-and-orange design aesthetic, Wizzy combines hard financial data with RPG mechanics to keep you engaged and actually building wealth.

---

## Features

**Financial Core**
- Income, expense, and free cash tracking on a real-time dashboard
- Savings goals with progress tracking and deadlines
- Full transaction history with category filtering and pagination
- Spending pattern analysis and anomaly detection

**Gamification Engine**
- Daily quests with XP rewards (e.g. "Log 3 expenses today", "Stay under ₹500 on food")
- Boss battles triggered by overspending anomalies — defeat them by cutting back
- Level progression system (Bronze Tracker → Silver Tracker → Gold Tracker → ...)
- Weekly streaks and leaderboard rankings

**Insights**
- Category-by-category spending breakdown
- Month-over-month trend charts
- Personalized coaching tips based on spending behavior
- Anomaly alerts when spending spikes unexpectedly

**Real-Time**
- Live dashboard updates via Socket.IO
- Quest progress updates as you log transactions
- Boss health depletion in real time

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide React |
| Backend | Node.js 20, Express, TypeScript |
| ORM | Prisma |
| Database | Neon (PostgreSQL) |
| Cache | Upstash (Redis) |
| Real-Time | Socket.IO |
| Background Jobs | BullMQ |
| Auth | JWT + bcryptjs |
| Deployment | Railway.app |

---

## Project Structure

```
wizzy/
├── frontend/                    # React app
│   ├── src/
│   │   ├── components/          # Dashboard, BossBattle, QuestCard, etc.
│   │   ├── pages/               # Dashboard, Expenses, Goals, Insights
│   │   ├── hooks/               # useSocket, useAuth, useExpenses
│   │   └── styles/              # Tailwind config, global styles
│   └── tailwind.config.js
│
└── backend/                     # Express API
    └── src/
        ├── server.ts            # Entry point
        ├── config/              # DB, Redis, env validation
        ├── routes/              # auth, expenses, quests, goals, bosses, insights
        ├── controllers/         # Request handlers
        ├── services/            # Business logic
        ├── middlewares/         # Auth, error handling, validation
        ├── events/              # Socket.IO handlers
        ├── jobs/                # BullMQ background jobs
        ├── prisma/              # Schema + migrations
        ├── types/               # TypeScript interfaces
        └── utils/               # Logger, JWT helpers, validators
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- [Neon](https://neon.tech) account (PostgreSQL)
- [Upstash](https://upstash.com) account (Redis — optional, caching only)

### Backend Setup

```bash
cd backend
npm install

cp .env.example .env
# Paste your Neon DATABASE_URL, Upstash REDIS_URL, and JWT_SECRET

npx prisma migrate dev --name init
npm run dev
# Runs on http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login, get JWT |
| GET | `/api/expenses` | List transactions |
| POST | `/api/expenses` | Log a transaction |
| GET | `/api/quests/today` | Get today's quests |
| PATCH | `/api/quests/:id/complete` | Complete a quest |
| GET | `/api/goals` | List savings goals |
| GET | `/api/bosses` | Active boss battles |
| GET | `/api/insights/dashboard` | Full financial snapshot |
| GET | `/api/insights/trends` | Spending trend data |

Full API docs: [`docs/API.md`](docs/API.md)

---

## Design System

Wizzy uses a stripped-back **black + orange** aesthetic inspired by [Compound Planning](https://compoundplanning.com).

| Token | Value | Usage |
|---|---|---|
| Background | `#000000` | Page background |
| Card | `#111111` | Dashboard panels |
| Border | `#333333` | Subtle dividers |
| Text | `#FFFFFF` | All primary text |
| Accent | `#FF4D00` | Buttons, boss HP bar, XP badges |

Rules:
- **Orange is sacred.** Only used for primary actions and boss mechanics.
- No gradients, no shadows. Flat, intentional, minimal.
- Typography: Inter, tight tracking (`-0.02em`), bold financial numbers at 48px.

---

## Roadmap

| Phase | Focus | Target |
|---|---|---|
| ✅ Scaffold | Backend structure, DB schema, configs | Done |
| 🔄 Phase 1 | Auth, user profiles, error handling | Week 1 |
| Phase 2 | Expense CRUD, savings goals, quests | Weeks 2–3 |
| Phase 3 | Boss battles, levels, streaks, leaderboard | Weeks 3–4 |
| Phase 4 | Socket.IO, analytics, background jobs | Weeks 4–5 |
| Phase 5 | Testing, security, deployment | Weeks 5–6 |
| **Launch** | Production on Railway | ~May 2, 2026 |

---

## Development

```bash
npm run dev          # Start with hot reload
npm run build        # Compile TypeScript
npm run test         # Run Jest tests
npm run lint         # ESLint check
npm run type-check   # TypeScript check
npx prisma studio    # Browse the database
```

### Adding a new endpoint

1. Create route → `src/routes/feature.ts`
2. Create controller → `src/controllers/featureController.ts`
3. Create service → `src/services/featureService.ts`
4. Register route in `src/routes/index.ts`
5. Add tests in `src/tests/feature.test.ts`

---

## Environment Variables

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/wizzy?sslmode=require
REDIS_URL=rediss://default:xxx@xxx.upstash.io:6379
JWT_SECRET=your-32-char-secret-here
SOCKET_CORS_ORIGIN=http://localhost:3000
```

See `.env.example` for the full list.

---

## License

MIT © 2026 [Rayan](https://github.com/rayan-1005)