# Task Board - Notes

## Project description and features
- Trello-like task board with columns (statuses) and cards (notes).
- Notes belong to a user and a status; can be moved left/right between statuses.
- Status columns have configurable color and priority (order). Priority can be reordered; notes move with their status.
- Seed data creates sample users, statuses, and notes.

## Technology stack
- Backend: Node.js, Express, PostgreSQL, pg, Zod, EJS (server templates not central to the board)
- Frontend: React, Axios, Vite
- Tooling: dotenv, cors

## Local setup
1) Prereqs: Node 18+, PostgreSQL running and accessible.
2) Install dependencies:
```bash
cd backend && npm install
cd ../frontend && npm install
```
3) Configure env (see below).
4) Init DB:
```bash
cd backend
npm run drop   # optional, clears all tables in the schema
npm run seed   # creates tables, trigger, and seed data
```
5) Run backend:
```bash
cd backend
npm start   # default port 3001
```
6) Run frontend:
```bash
cd frontend
npm run dev   # default Vite port 5173
```

## Environment variables (backend/.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
PORT=3001
```

## Database schema (tables)
- users
  - id_user (PK, serial)
  - username (varchar, unique, not null)
  - password (varchar, not null)
  - email (varchar, not null)
  - created_at (timestamp, default now)
- status
  - id_stat (PK, serial)
  - stat_name (text, not null)
  - color (varchar(7), not null, default '#cccccc')
  - priority (integer, auto-assigned by trigger if null/0; lower = leftmost)
  - Trigger `status_priority_trigger` sets `priority = COALESCE(MAX(priority),1)+1` when not provided.
- notes
  - id_note (PK, serial)
  - content (text, not null)
  - important (boolean)
  - id_note_stat (FK -> status.id_stat, on delete set null)
  - id_note_user (FK -> users.id_user, on delete set null)

## API documentation (selected)
Base URL: `http://localhost:3001/api`

### Notes
- GET `/notes` → 200: list of notes with joined status/user info.
- GET `/notes/:id` → 200/404: single note.
- POST `/notes`
  - Body: `{ content: string, important?: boolean, id_note_user: number, id_note_stat?: number }`
  - 201: created note with status/user info.
- PUT `/notes/:id`
  - Body: same fields as POST (any subset to update).
  - 200: updated note with status/user info; 404 if missing.
- DELETE `/notes/:id` → 204/404

### Status
- GET `/status` → ordered by `priority ASC`.
- GET `/status/:id` → 200/404
- POST `/status`
  - Body: `{ stat_name: string, color?: '#RRGGBB', priority?: number }`
  - If `priority` omitted/null/0, DB trigger assigns next priority.
  - 201: created status.
- PUT `/status/:id`
  - Body: `{ stat_name?: string, color?: '#RRGGBB', priority?: number }`
  - Reorders other priorities atomically when priority changes.
  - 200/404
- DELETE `/status/:id`
  - Shifts down higher priorities after delete.
  - 204/404

### Users
- GET `/users` → list users
- GET `/users/:id` → single user

## Notes on behavior
- Column order is driven by `status.priority`; moving a status reorders priorities and notes stay with their status (by FK id).
- Frontend moves notes by updating `id_note_stat` via PUT `/notes/:id`.
- New statuses auto-get the next priority via database trigger.

