# Express Backend Server (TypeScript)

## Setup

- Install dependencies:

```bash
npm install
```

## Scripts

- Build TypeScript:

```bash
npm run build
```

- Start (after build):

```bash
npm run start
```

- Dev (ts-node-dev):

```bash
npm run dev
```

## Endpoints

- GET `/health` → `{ "status": "ok" }`
- GET `/` → `Express server is running (TypeScript)`
- POST `/api/auth/login`
  - Body: `{ "email": "user@example.com", "password": "plainPassword" }`
  - 200: `{ "token": "<jwt>" }`
  - 400: missing fields; 401: invalid credentials

## Auth setup

- Install packages:

```bash
npm install jsonwebtoken bcryptjs
npm install -D @types/jsonwebtoken @types/bcryptjs
```

- Ensure `JWT_SECRET` is set in `src/.env`.
- Create a user record with `passwordHash` from bcrypt.

## Config

- Port: set `PORT` env var (default `3000`).
- Mongo: set `MONGODB_URI` (or `MONGODB_URL`/`MANGODB_URL`) and optional `MONGODB_DB`.
