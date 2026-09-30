# Heritage Conquest — React + MySQL

Educational heritage game: Login/Register → Main Menu → India Map → Select Monument →
Historical briefing → Minigame (3 attempts) → Rewards (+10 points, +1 crystal, +1 badge)
saved to **MySQL** → next monument unlocks. 10 stops, ending with the Time Machine finale.

## Project layout

```
server/           Express + mysql2 API (auth with JWT, progress storage)
  schema.sql      MySQL tables: users, monument_progress
src/              React 19 + TanStack Start frontend
  lib/api.ts      fetch client for the MySQL API
  lib/monuments.ts monument list, map coordinates, game hooks
  hooks/useAuth.tsx, hooks/useProgress.ts
  routes/         index (main menu), auth, map, monument.$slug
public/games/     the vanilla-JS minigames (taj-mahal.js, qutub-minar.js, …)
```

## 1. Start MySQL

Install MySQL 8 (or use XAMPP / MySQL Workbench). No manual database creation is needed —
the API creates `heritage_conquest` and applies `server/schema.sql` on first boot.
If you prefer doing it by hand:

```sql
CREATE DATABASE heritage_conquest CHARACTER SET utf8mb4;
-- then run server/schema.sql against it
```

## 2. Run the API

```bash
cd server
cp .env.example .env      # set MYSQL_PASSWORD and JWT_SECRET
npm install
npm run dev               # http://localhost:4000
```

Check `http://localhost:4000/api/health` → `{"ok":true}`.

## 3. Run the frontend

```bash
cd ..
cp .env.example .env      # VITE_API_URL=http://localhost:4000
npm install
npm run dev               # http://localhost:8080
```

Register an account and play. Progress rows land in `monument_progress`; the player's
totals are recomputed on `users.points` / `users.crystals` after every save.

## API

| Method | Route                | Auth   | Purpose                              |
| ------ | -------------------- | ------ | ------------------------------------ |
| POST   | `/api/auth/register` | –      | create account, returns JWT          |
| POST   | `/api/auth/login`    | –      | log in, returns JWT                  |
| GET    | `/api/me`            | Bearer | current player                       |
| GET    | `/api/progress`      | Bearer | all progress rows for the player     |
| POST   | `/api/progress`      | Bearer | upsert one monument's result         |

Passwords are hashed with bcrypt; the JWT is stored in `localStorage` under `hc_token`.

## Still to build (per the original flow chart)

- Real historical videos per monument (currently a briefing placeholder)
- 3-question quiz with 2 attempts (`quiz_completed` column is already in the schema)
- Time Machine final choice with good (2125) / bad (past) endings
