# Service Request Management

Users submit workplace requests. Administrators follow those requests from a dashboard and update their status.

A request is IT, Maintenance, or General, with priority Low, Medium, or High. It starts Open, moves to In progress, and stays Resolved. A request that is still Open or In progress after 24 hours counts as overdue on the admin dashboard. That count is calculated from the created time. It is not stored as its own column.

## Requirements

- Node.js
- PostgreSQL
- Redis, optional. The API keeps working if Redis is down. The dashboard summary is cached for 60 seconds when Redis is available.

## Database

Create an empty database, then load the tables:

```bash
psql "postgresql://USER:PASSWORD@localhost:5432/service_request_db" -f server/schema.sql
```

`server/schema.sql` creates `users` and `service_requests`. It does not insert accounts or requests.

## API

```bash
cd server
copy .env.example .env
npm install
npm run create-admin
npm run dev
```

On macOS or Linux, use `cp` instead of `copy`.

Fill in `.env` on the server only. Do not commit it. `.env` is gitignored.

| Name | Purpose |
| --- | --- |
| `PORT` | API port. Default in the example is 5000. |
| `DATABASE_URL` | PostgreSQL connection string. |
| `JWT_SECRET` | Secret used to sign login tokens. |
| `JWT_EXPIRES_IN` | Token lifetime. The example uses `1d`. |
| `REDIS_URL` | Optional. Example is `redis://localhost:6379`. If Docker publishes Redis on another host port, use that port. |
| `ADMIN_NAME` | Name stored for the administrator. |
| `ADMIN_EMAIL` | Email the administrator uses to sign in. |
| `ADMIN_PASSWORD` | At least 8 characters. The script stores a hash, not the plain password. |

`npm run create-admin` creates the administrator from those three `ADMIN_` values. If that email is already registered, the script promotes that person to admin and replaces the password. Sign-up cannot create an administrator. Share the email and password with the client once, outside this repository, and do not write the real password into the README.

`npm run dev` restarts the API when files change. `npm start` runs it without watching.

## Client

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`. In development the client calls `http://localhost:5000`. Set `VITE_API_URL` only when the API is on another address.

## Who can do what

A user signs up, creates a request, edits their own request while it is Open or In progress, and deletes their own request only while it is Open. A user cannot change status.

An administrator sees every request, opens the dashboard, and changes status until the request is Resolved. An administrator cannot create, edit, or delete a request. A resolved request cannot change status.
