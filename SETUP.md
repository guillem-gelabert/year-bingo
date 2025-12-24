# Quick Setup Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and update `SESSION_SECRET` to a secure random string:

```bash
# Generate a secure session secret
openssl rand -base64 32
```

## 3. Start Database

```bash
docker compose up -d
```

**Note:** If Docker is not available, you can use any PostgreSQL instance. Just update the `DATABASE_URL` in `.env`.

## 4. Run Database Migrations

```bash
npm run db:push
```

If you prefer migrations (recommended for production), use:

```bash
npm run db:generate
npm run db:migrate
```

## 5. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## 6. Create Your First User

In a new terminal:

```bash
npm run generate-login-link -- --name "Your Name" --email "your@email.com"
```

Copy the generated login URL and paste it in your browser.

## That's it! 🎉

You can now:
- Create your bingo card at `/bingo/edit`
- View all cards (after deadline) at `/bingo`

## Common Issues

### "docker: command not found"

Install Docker Desktop or use an external PostgreSQL instance and update `DATABASE_URL` in `.env`.

### Port 5432 already in use

Either:
1. Stop other PostgreSQL instances
2. Change the port in `docker-compose.yml` (e.g., `"5433:5432"`) and update `DATABASE_URL` in `.env`

### Migration errors

Reset the database (⚠️ deletes all data):

```bash
npx drizzle-kit drop
```
