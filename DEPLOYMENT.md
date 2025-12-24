# Deployment Guide

This guide covers deploying Year Bingo to various platforms.

## Prerequisites

Before deploying:

1. ✅ Database is accessible from your deployment platform
2. ✅ Environment variables are configured
3. ✅ Build succeeds locally (`npm run build`)

## Environment Variables

All deployment platforms require these environment variables:

```env
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
SESSION_SECRET="secure-random-string-min-32-chars"
APP_URL="https://your-domain.com"
TZ="UTC"
```

### Generating SESSION_SECRET

```bash
openssl rand -base64 32
```

## Platform-Specific Guides

### Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Set environment variables in Vercel Dashboard:
   - Go to Project Settings → Environment Variables
   - Add all required variables

4. Set up PostgreSQL:
   - Use Vercel Postgres, Neon, Supabase, or any PostgreSQL provider
   - Update `DATABASE_URL` with your database connection string

5. Run migrations (one-time):
   ```bash
   # From your local machine with DATABASE_URL pointing to production
   npm run db:migrate
   ```

### Netlify

1. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.output/public`
   - Functions directory: `.output/server`

2. Environment variables:
   - Add all required variables in Site settings → Environment variables

3. Database:
   - Use Neon, Supabase, Railway, or another PostgreSQL provider
   - Run migrations after first deployment

### Railway

1. Create new project from GitHub repo

2. Add PostgreSQL service:
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway will automatically set `DATABASE_URL`

3. Set environment variables in project settings

4. Deploy automatically on push to main branch

5. Run migrations:
   ```bash
   # SSH into Railway or use Railway CLI
   npm run db:migrate
   ```

### DigitalOcean App Platform

1. Create app from GitHub repo

2. App Spec:
   ```yaml
   name: year-bingo
   services:
   - name: web
     github:
       repo: your-username/year-bingo
       branch: main
    build_command: npm install && npm run build
     run_command: node .output/server/index.mjs
     environment_slug: node-js
     envs:
     - key: DATABASE_URL
       scope: RUN_TIME
       value: ${db.DATABASE_URL}
     - key: SESSION_SECRET
       scope: RUN_TIME
       value: your-session-secret
     - key: APP_URL
       scope: RUN_TIME
       value: ${APP_URL}
   databases:
   - name: db
     engine: PG
     production: true
   ```

### Docker Deployment

Build and run with Docker:

```bash
# Build image
docker build -t year-bingo .

# Run container
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e SESSION_SECRET="..." \
  -e APP_URL="https://..." \
  --name year-bingo \
  year-bingo
```

This repo includes a production `Dockerfile` already.

## Database Migrations

### Initial Setup (First Deployment)

After deploying for the first time:

```bash
# Set DATABASE_URL to production
export DATABASE_URL="postgresql://..."

# Run migrations
npm run db:migrate
```

### Subsequent Deployments

When you add new migrations:

1. Commit migration files to git
2. Deploy application code
3. Run migrations:
   ```bash
   npm run db:migrate
   ```

## Health Checks

Set up health checks on your deployment platform:

- Endpoint: `/api/deadline`
- Expected status: `200`
- Interval: 30 seconds

## Monitoring

### Logs

Monitor application logs for errors:
- Authentication failures
- Database connection issues
- API errors

### Database

Monitor PostgreSQL:
- Connection pool usage
- Query performance
- Database size

### Key Metrics

- Response time for API endpoints
- Error rate
- Active sessions
- Database queries per second

## Backup Strategy

### Database Backups

Most PostgreSQL providers offer automated backups:
- Vercel Postgres: Automatic backups
- Railway: Point-in-time recovery
- Supabase: Daily backups
- Neon: Branching and snapshots

### Manual Backup

```bash
# Backup database
pg_dump $DATABASE_URL > backup.sql

# Restore database
psql $DATABASE_URL < backup.sql
```

## Security Checklist

Before going live:

- [ ] Strong `SESSION_SECRET` (min 32 chars)
- [ ] HTTPS enabled
- [ ] Database credentials secured
- [ ] Environment variables not in code
- [ ] CORS configured (if needed)
- [ ] Rate limiting on login endpoint (optional)
- [ ] Database connection pooling configured
- [ ] Regular security updates

## Performance Optimization

### Database

1. Add indexes for frequently queried fields (example SQL):
   ```sql
   CREATE INDEX IF NOT EXISTS "BingoCard_userId_idx" ON "BingoCard" ("userId");
   CREATE INDEX IF NOT EXISTS "User_loginToken_idx" ON "User" ("loginToken");
   ```

2. Enable connection pooling:
   ```env
   DATABASE_URL="postgresql://...?connection_limit=10"
   ```

### Caching

Consider adding caching for:
- Public bingo cards (after deadline)
- Deadline calculations
- User sessions

### CDN

Use a CDN for static assets:
- Images
- CSS/JS bundles
- Fonts

## Troubleshooting

### Build Failures

```bash
# Clear cache and rebuild
rm -rf .nuxt .output node_modules
npm install
npm run build
```

### Database Connection Errors

Check:
- DATABASE_URL format
- Network access (firewall rules)
- SSL requirements (add `?sslmode=require`)

### Session Issues

Verify:
- SESSION_SECRET is set
- Cookies are enabled
- HTTPS is used in production

## Rollback

If you need to rollback:

1. Revert application code deployment
2. Restore the database from a backup (recommended) or manually revert the migration SQL.

## Support

For issues:
1. Check application logs
2. Verify environment variables
3. Test database connection
4. Review Drizzle migration status
