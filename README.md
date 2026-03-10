# keycloak-sso-app

Monorepo demo for authentication and SSO with **Keycloak** across:

- `api` (FastAPI)
- `webapp-one` (React + Vite)
- `webapp-two` (React + Vite)
- local auth infra (`Postgres`, `Keycloak`, `Nginx`) via Docker Compose

This project shows how two frontend apps can share the same Keycloak realm/session while calling a protected backend API with bearer tokens.

## Architecture

```text
webapp-one (5173) ----\
                      >--- Keycloak (8080, proxied by Nginx on :80)
webapp-two (5174) ----/

webapp-one/webapp-two -> FastAPI API (:8000) with Authorization: Bearer <token>
FastAPI -> Keycloak userinfo + admin APIs (profile/password actions)
Keycloak -> Postgres
```

## Repo Structure

```text
api/            FastAPI service with Keycloak token validation + account endpoints
webapp-one/     First frontend app (Keycloak login-required)
webapp-two/     Second frontend app (Keycloak login-required)
docker-compose.yml  Local Keycloak/Postgres/PgAdmin/Nginx stack
nginx.conf      Reverse proxy to Keycloak
```

## Prerequisites

- Docker + Docker Compose
- Python 3.11+
- Node.js 20+
- npm 10+

## 1) Start Keycloak Infrastructure

From repo root:

```bash
docker compose up -d
```

Services:

- Keycloak: `http://localhost:8080` (also via Nginx at `http://localhost`)
- PgAdmin: `http://localhost:5050`
- Postgres: `localhost:5432`

Default Keycloak admin credentials (from `docker-compose.yml`):

- username: `admin`
- password: `admin`

## 2) Configure Keycloak

In Keycloak Admin Console:

1. Create realm, for example: `MyRealm`
2. Create clients:
- `webapp-one` (public client)
- `webapp-two` (public client)
3. Set valid redirect URIs:
- `http://localhost:5173/*`
- `http://localhost:5174/*`
4. Set web origins:
- `http://localhost:5173`
- `http://localhost:5174`
5. Create at least one test user.

For backend admin operations (`/account/profile`, `/account/update-profile`, `/account/change-password`), provide a Keycloak user with rights to manage users in the target realm.

## 3) Configure Environment Files

### API

Copy `api/.env.example` to `api/.env` and update values:

```env
ENV=development
DATABASE_URL=postgresql://user:abcd@localhost:5432/keycloak

KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=MyRealm
KEYCLOAK_CLIENT_ID=webapp-one
KEYCLOAK_USERNAME=admin
KEYCLOAK_PASSWORD=admin

FRONTEND_APP_URL=http://localhost:5173
```

Notes:

- `KEYCLOAK_CLIENT_ID` is used for `userinfo` token validation flow.
- `KEYCLOAK_USERNAME`/`KEYCLOAK_PASSWORD` are used by `KeycloakAdmin` in the API.

### webapp-one

Copy `webapp-one/.env.example` to `webapp-one/.env`:

```env
VITE_APP_NAME=App One
VITE_APP_URL=http://localhost:5173
VITE_APP_VERSION=0.0.1

VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=MyRealm
VITE_KEYCLOAK_CLIENT_ID=webapp-one

VITE_API_URL=http://localhost:8000
```

### webapp-two

Copy `webapp-two/.env.example` to `webapp-two/.env`:

```env
VITE_APP_NAME=App Two
VITE_APP_URL=http://localhost:5174
VITE_APP_VERSION=0.0.1

VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=MyRealm
VITE_KEYCLOAK_CLIENT_ID=webapp-two

VITE_API_URL=http://localhost:8000
```

## 4) Run API

```bash
cd api
python -m venv .venv
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
fastapi dev main.py --port 8000
```

Health check:

- `GET http://localhost:8000/health`

Docs (development only):

- `http://localhost:8000/docs`

## 5) Run Frontends

In terminal 1:

```bash
cd webapp-one
npm install
npm run dev
```

In terminal 2:

```bash
cd webapp-two
npm install
npm run dev
```

Apps:

- `http://localhost:5173`
- `http://localhost:5174`

Both apps initialize Keycloak with `onLoad: "login-required"`, so unauthenticated users are redirected to Keycloak login.

## Authentication Flow

1. App starts and calls `keycloak.init({ onLoad: "login-required", pkceMethod: "S256" })`.
2. User logs in on Keycloak.
3. Frontend stores token in context and injects `Authorization: Bearer <token>` in Axios interceptor.
4. API verifies token with `keycloak_openid.userinfo(token)`.
5. Protected account endpoints return data or perform profile/password actions through Keycloak Admin API.

## API Endpoints

All account endpoints require bearer token.

- `GET /health`
- `GET /account/me`
- `GET /account/profile`
- `POST /account/update-profile`
- `POST /account/change-password`

Example request:

```bash
curl http://localhost:8000/account/me \
  -H "Authorization: Bearer <access_token>"
```

## Notes and Troubleshooting

- If you get `Invalid token` from API, verify `KEYCLOAK_URL`, `KEYCLOAK_REALM`, and that token was issued by that realm/client.
- If frontend keeps redirecting, confirm client redirect URIs/web origins in Keycloak client settings.
- If admin actions fail, check API `KEYCLOAK_USERNAME`/`KEYCLOAK_PASSWORD` has realm permissions.
- CORS is currently open in API (`allow_origins=["*"]`) for local development.
- Current frontend code references `silent-check-sso.html`, but this file is not present in `public/`; add it if you want silent SSO checks.

## Stop Services

```bash
docker compose down
```

To also remove volumes:

```bash
docker compose down -v
```
