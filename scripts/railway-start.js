#!/usr/bin/env node
/**
 * Railway deployment entrypoint script
 * Runs database migrations, then starts the Nuxt server
 */

import { execSync, spawn } from 'child_process';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

console.log('🚂 Railway deployment starting...');
console.log(`📦 Node version: ${process.version}`);
console.log(`🌐 Listening on ${HOST}:${PORT}`);

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL is not set');
  process.exit(1);
}

// Run database migrations
console.log('🔄 Running database migrations...');
try {
  execSync('npm run db:migrate', {
    stdio: 'inherit',
    env: process.env,
    cwd: projectRoot,
  });
  console.log('✅ Database migrations completed');
} catch (error) {
  console.error('❌ Database migration failed:', error.message);
  process.exit(1);
}

// Check if .output directory exists (from build)
const serverPath = resolve(projectRoot, '.output/server/index.mjs');
if (!existsSync(serverPath)) {
  console.error('❌ ERROR: .output/server/index.mjs not found. Did the build complete?');
  process.exit(1);
}

// Start the Nuxt server
console.log('🚀 Starting Nuxt server...');
process.env.PORT = PORT;
process.env.HOST = HOST;

// Spawn the server process
const server = spawn('node', [serverPath], {
  stdio: 'inherit',
  env: process.env,
  cwd: projectRoot,
});

server.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

server.on('exit', (code) => {
  console.error(`❌ Server exited with code ${code}`);
  process.exit(code || 1);
});

// Handle termination signals
process.on('SIGTERM', () => {
  console.log('📛 Received SIGTERM, shutting down gracefully...');
  server.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('📛 Received SIGINT, shutting down gracefully...');
  server.kill('SIGINT');
});
