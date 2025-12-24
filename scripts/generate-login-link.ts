#!/usr/bin/env tsx
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { randomBytes } from 'crypto'

const prisma = new PrismaClient()

interface Args {
  name?: string
  email?: string
  days?: number
}

function parseArgs(): Args {
  const args: Args = {}
  
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i]
    
    if (arg === '--name' && i + 1 < process.argv.length) {
      args.name = process.argv[++i]
    } else if (arg === '--email' && i + 1 < process.argv.length) {
      args.email = process.argv[++i]
    } else if (arg === '--days' && i + 1 < process.argv.length) {
      args.days = parseInt(process.argv[++i], 10)
    }
  }
  
  return args
}

function generateLoginToken(): string {
  return randomBytes(32).toString('hex')
}

function getTokenExpiration(days: number = 7): Date {
  const expiration = new Date()
  expiration.setDate(expiration.getDate() + days)
  return expiration
}

async function main() {
  const args = parseArgs()
  
  if (!args.name) {
    console.error('Error: --name is required')
    console.log('\nUsage:')
    console.log('  npm run generate-login-link -- --name "John Doe" [--email "john@example.com"] [--days 7]')
    process.exit(1)
  }

  const expirationDays = args.days || 7
  const loginToken = generateLoginToken()
  const loginTokenExpiresAt = getTokenExpiration(expirationDays)

  // Create or update user
  const user = await prisma.user.upsert({
    where: args.email ? { email: args.email } : { id: 'temp-id-will-not-match' },
    update: {
      name: args.name,
      loginToken,
      loginTokenExpiresAt,
    },
    create: {
      name: args.name,
      email: args.email || null,
      loginToken,
      loginTokenExpiresAt,
    },
  })

  const appUrl = process.env.APP_URL || 'http://localhost:3000'
  const loginUrl = `${appUrl}/login?token=${loginToken}`

  console.log('\n✅ Login link generated successfully!\n')
  console.log('User:', user.name)
  if (user.email) console.log('Email:', user.email)
  console.log('Expires:', loginTokenExpiresAt.toLocaleString())
  console.log('\n🔗 Login URL:')
  console.log(loginUrl)
  console.log('')
}

main()
  .catch((error) => {
    console.error('Error generating login link:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
