# Year Bingo 🎯

A web application where users create bingo cards with 9 predictions for the upcoming year. Users can edit their predictions until December 31st, 23:59:59, after which all bingo cards become publicly visible.

## Tech Stack

- **Frontend/Backend**: Nuxt 4
- **Database ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **Infrastructure**: Docker Compose
- **Styling**: Tailwind CSS
- **Authentication**: Login links (no passwords)

## Features

- 🔐 **Secure login link authentication** - Users receive unique login links
- ✏️ **Auto-save predictions** - Changes are automatically saved as you type
- ⏰ **Deadline-based editing** - Edit until December 31st, 23:59:59
- 🌐 **Public reveal** - All predictions become visible after the deadline
- 📱 **Responsive design** - Works on all devices

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for PostgreSQL)

## Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd year-bingo
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Update `.env` with your settings:
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Random string for session encryption (change in production!)
- `APP_URL` - Your application URL
- `TZ` - Timezone for deadline calculations (default: UTC)

### 3. Start PostgreSQL

Start the PostgreSQL database with Docker Compose:

```bash
docker compose up -d
```

Check that the database is running:

```bash
docker compose ps
```

### 4. Set Up Database

Push the schema to the database (development convenience):

```bash
npm run db:push
```

If you prefer migrations (recommended for production), generate + apply migrations instead:

```bash
npm run db:generate
npm run db:migrate
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000

## Run the app with Docker (frontend + backend)

This runs the Nuxt app (UI + API) and PostgreSQL via Docker Compose:

```bash
docker compose up --build -d
```

Then initialize the database schema (first run):

```bash
docker compose exec web npm run db:push
```

## Usage

### Generating Login Links

To create a new user and generate a login link, use the npm script:

```bash
# Basic usage with name only
npm run generate-login-link -- --name "John Doe"

# With email
npm run generate-login-link -- --name "John Doe" --email "john@example.com"

# With custom expiration (days)
npm run generate-login-link -- --name "John Doe" --email "john@example.com" --days 30
```

The script will output a login URL that you can share with the user.

### Using the Application

1. **Login**: Use the login link provided to access your account
2. **Create Predictions**: Fill in your 9 predictions in the bingo grid
3. **Auto-save**: Changes are automatically saved after 500ms of inactivity
4. **Edit Deadline**: You can edit until December 31st, 23:59:59
5. **Public View**: After the deadline, visit `/bingo` to see everyone's predictions

## Project Structure

```
year-bingo/
├── app/
│   └── app.vue              # Main app component
├── components/              # Reusable Vue components (if any)
├── composables/             # Vue composables
│   ├── useAuth.ts          # Authentication logic
│   ├── useBingoCard.ts     # Bingo card management
│   └── useDeadline.ts      # Deadline calculations
├── middleware/              # Route middleware
│   └── auth.ts             # Client-side auth guard
├── pages/                   # Application pages
│   ├── index.vue           # Home page
│   ├── login.vue           # Login page
│   └── bingo/
│       ├── edit.vue        # Edit bingo card (protected)
│       └── index.vue       # View all cards (public after deadline)
├── drizzle.config.ts        # Drizzle Kit configuration
├── scripts/
│   └── generate-login-link.ts  # CLI script for login links
├── server/
│   ├── api/                # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   └── bingo/         # Bingo card endpoints
│   ├── middleware/         # Server middleware
│   │   └── auth.ts        # API authentication
│   └── utils/              # Server utilities
│       ├── auth.ts        # Auth helpers
│       ├── deadline.ts    # Deadline helpers
│       └── db.ts          # Drizzle connection
├── docker-compose.yml      # PostgreSQL container
├── .env                    # Environment variables (not in git)
├── .env.example           # Example environment file
└── package.json           # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run generate-login-link` - Generate login link for a user
- `npm run db:push` - Push schema to DB (dev convenience)
- `npm run db:generate` - Generate migrations
- `npm run db:migrate` - Apply migrations
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## Database Management

### View Database with Drizzle Studio

```bash
npm run db:studio
```

This opens a GUI at http://localhost:5555 where you can view and edit data.

### Create New Migration

After modifying `server/db/schema.ts`:

```bash
npm run db:generate
npm run db:migrate
```

### Reset Database (Development)

**Warning: This deletes all data!**

```bash
npx drizzle-kit drop
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Bingo Cards
- `GET /api/bingo/my` - Get current user's bingo card
- `PUT /api/bingo/predictions/:id` - Update a prediction
- `GET /api/bingo/all` - Get all bingo cards (public after deadline)

### Utility
- `GET /api/deadline` - Get deadline info and status

## Business Rules

### Editing Window
- Users can edit predictions until **December 31, 23:59:59** of the current year
- After this deadline, all predictions become **read-only**

### Visibility Rules
- Bingo cards are **private** until the deadline passes
- After **December 31, 23:59:59**, all cards become **publicly visible**

### Validation
- Each bingo card has exactly **9 predictions** (3x3 grid)
- Predictions have a maximum length of **500 characters**
- Each prediction has a unique position (1-9)

## Deployment

### Environment Variables

Ensure these are set in production:
- `DATABASE_URL` - Production PostgreSQL connection
- `SESSION_SECRET` - Strong random string (use `openssl rand -base64 32`)
- `APP_URL` - Production URL (e.g., https://yearbingo.com)
- `TZ` - Timezone for deadlines (e.g., "America/New_York" or "UTC")

### Build and Deploy

```bash
# Install dependencies
npm ci

# Run migrations
npm run db:migrate

# Build application
npm run build

# Start production server
node .output/server/index.mjs
```

## Troubleshooting

### Database Connection Issues

If you can't connect to PostgreSQL:

1. Check Docker is running: `docker compose ps`
2. Check PostgreSQL logs: `docker compose logs postgres`
3. Verify DATABASE_URL in `.env`
4. Try restarting containers: `docker compose restart`

### Drizzle Issues

If your schema and database drift:

```bash
npm run db:push
```

If you want to validate migrations:

```bash
npx drizzle-kit check
```

### Session Issues

If sessions aren't working:
1. Verify `SESSION_SECRET` is set in `.env`
2. Check that cookies are enabled in browser
3. In production, ensure HTTPS is used

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
