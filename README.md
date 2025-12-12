# Task Board - Notes

## Project description and features
- Trello-like task board with columns (statuses) and cards (notes).
- Notes belong to a user and a status; can be moved left/right between statuses.
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

## Database schema
Our database is in 3NF. There are places that can be improved, like some asserts against negative values... But, we think for this project, this is sufficient.
<img width="1280" height="446" alt="image" src="https://github.com/user-attachments/assets/16f1135e-d041-4c76-85bc-c6720eb0ff78" />
- NN - Not null

### Non-visible components
- Function **assign_status_priority** - used to assign priority automatically upon creation of a new record
- Trigger **status_priority_trigger** - used to apply the function on the status table before inserting a new record


## API documentation
Base URL: `http://localhost:3001/api`

### Notes
- GET `/notes` → list of notes with joined status/user info.
- GET `/notes/:id` → single note.
- POST `/notes` → created note with status/user info.
- PUT `/notes/:id` → same fields as POST (any subset to update).
- DELETE `/notes/:id` → deletes a note based on the id

### Status
- GET `/status` → ordered by `priority ASC`.
- GET `/status/:id` → single status
- DELETE `/status/:id` → Shifts down higher priorities after delete.

### Users
- GET `/users` → list users
- GET `/users/:id` → single user

## Notes on behavior
- Column order is driven by `status.priority`; moving a status reorders priorities and notes stay with their status (by FK id).
- Frontend moves notes by updating `id_note_stat` via PUT `/notes/:id`.
- New statuses auto-get the next priority via database trigger.

