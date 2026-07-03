# TeamSync — B2B Project Management Platform

> A full-stack, production-grade project management platform for teams — monorepo powered by **npm workspaces**.

---

## 📁 Monorepo Structure

```
teamsync/
├── apps/
│   ├── client/          # React + Vite + TypeScript frontend
│   └── server/          # Express + TypeScript + MongoDB backend
├── .env.example         # Shared env variable reference
├── .gitignore
└── package.json         # Root workspace config
```

---

## 🛠️ Tech Stack

| Layer    | Technology |
|----------|------------|
| Frontend | React 18, Vite, TypeScript, TailwindCSS, shadcn/ui |
| State    | Zustand, TanStack Query |
| Backend  | Express.js, TypeScript, Node.js |
| Auth     | Passport.js (JWT + Google OAuth 2.0) |
| Database | MongoDB (Mongoose) |
| Monorepo | npm workspaces |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>=18.0.0`
- npm `>=8.0.0`
- MongoDB (local or Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/ayushgupta-15/teamsync.git
cd teamsync
```

### 2. Install all dependencies

```bash
npm install
```

> This installs dependencies for **both** `apps/client` and `apps/server` via npm workspaces.

### 3. Configure environment variables

```bash
# Server
cp apps/server/.env.example apps/server/.env
# Edit apps/server/.env with your MongoDB URI, secrets, Google OAuth credentials

# Client (optional — defaults work for local dev)
cp apps/client/.env.example apps/client/.env
```

### 4. Run the development servers

```bash
# Run both client and server concurrently
npm run dev

# Or run individually
npm run dev:server   # Express API  → http://localhost:8000
npm run dev:client   # Vite dev     → http://localhost:5173
```

---

## 📜 Available Scripts

All scripts are run from the **root** of the monorepo:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both server + client in parallel |
| `npm run dev:server` | Start backend only |
| `npm run dev:client` | Start frontend only |
| `npm run build` | Build both packages for production |
| `npm run build:server` | Build backend only |
| `npm run build:client` | Build frontend only |
| `npm run start` | Start compiled backend (after build) |
| `npm run lint` | Run ESLint on the frontend |
| `npm run seed` | Run database seeders |

---

## 🔑 Environment Variables

See [`.env.example`](./.env.example) for the full list of required variables.

### Server (`apps/server/.env`)

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | `development` or `production` |
| `PORT` | Server port (default: `8000`) |
| `BASE_PATH` | API prefix (default: `/api`) |
| `MONGO_URI` | MongoDB connection string |
| `SESSION_SECRET` | Cookie-session secret |
| `JWT_SECRET` | JWT signing secret |
| `JWT_EXPIRES_IN` | JWT expiry (e.g. `7d`) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GOOGLE_CALLBACK_URL` | OAuth callback URL on server |
| `FRONTEND_ORIGIN` | Frontend URL for CORS |
| `FRONTEND_GOOGLE_CALLBACK_URL` | Frontend URL for OAuth redirect |

### Client (`apps/client/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL (default: `http://localhost:8000/api`) |

---

## 🗂️ Features

- **Authentication** — Email/password + Google OAuth 2.0
- **Workspaces** — Multi-tenant workspace management
- **Projects** — Project creation with emoji support
- **Tasks** — Full task lifecycle (create, assign, track, filter)
- **Members** — Role-based access control (RBAC)
- **Invites** — Invite members via shareable link
- **Settings** — Workspace customization

---

## 🏗️ API Overview

All routes are prefixed with `/api`.

| Module | Routes |
|--------|--------|
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/google` |
| User | `GET /api/user/current` |
| Workspace | `GET/POST/PATCH/DELETE /api/workspace` |
| Project | `GET/POST/PATCH/DELETE /api/project` |
| Task | `GET/POST/PATCH/DELETE /api/task` |
| Member | `GET /api/member` |

---

## 📄 License

MIT © [ayushgupta-15](https://github.com/ayushgupta-15)
