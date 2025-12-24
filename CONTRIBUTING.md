# Contributing to Year Bingo

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/year-bingo.git
   cd year-bingo
   ```
3. Follow the setup instructions in [SETUP.md](./SETUP.md)

## Development Workflow

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Test your changes:
   ```bash
   npm run build
   npm run dev
   ```

4. Commit your changes:
   ```bash
   git commit -m "Description of changes"
   ```

5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Create a Pull Request

## Code Style

- Use TypeScript for type safety
- Follow Vue 3 Composition API patterns
- Use Tailwind CSS for styling
- Write descriptive commit messages

## Database Changes

When modifying the database schema:

1. Update `server/db/schema.ts`
2. Create + apply migrations:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```
3. Include migration files in your PR

## Testing

Before submitting:

- [ ] Application builds without errors
- [ ] All new features work as expected
- [ ] Existing features still work
- [ ] No console errors

## Pull Request Guidelines

- Describe what changes you made and why
- Link to any related issues
- Include screenshots for UI changes
- Keep PRs focused on a single feature/fix

## Feature Ideas

Ideas for future enhancements:

- Mark predictions as "completed"
- Scoring system
- Leaderboard
- Email notifications for login links
- Social sharing
- Admin dashboard
- Comments on predictions
- Analytics dashboard

## Questions?

Open an issue for discussion before starting work on major changes.
