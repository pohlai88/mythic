#!/usr/bin/env tsx
/**
 * Database Setup Script
 * 
 * This script helps set up the PostgreSQL database for The Apex MVP.
 * 
 * Usage:
 *   pnpm tsx scripts/setup-database.ts
 * 
 * Prerequisites:
 *   - PostgreSQL 15+ installed and running
 *   - Database credentials in environment variables or .env file
 */

import postgres from 'postgres'
import { config } from 'dotenv'
import { readFileSync } from 'fs'
import { join } from 'path'

// Load environment variables
config()

const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || ''}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'mythic'}${process.env.DB_SSL === 'true' ? '?sslmode=require' : ''}`

async function setupDatabase() {
  console.log('🚀 Setting up database for The Apex MVP...\n')

  try {
    // Connect to PostgreSQL
    const sql = postgres(connectionString)

    // Check if database exists
    console.log('📊 Checking database connection...')
    await sql`SELECT 1`
    console.log('✅ Database connection successful\n')

    // Check if users table exists (indicates schema is set up)
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'users'
    `

    if (tables.length > 0) {
      console.log('✅ Database schema already exists')
      console.log('💡 To regenerate schema, run: pnpm drizzle-kit push\n')
    } else {
      console.log('⚠️  Database schema not found')
      console.log('💡 Run migrations: pnpm drizzle-kit push\n')
    }

    // Display current tables
    const allTables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `

    if (allTables.length > 0) {
      console.log('📋 Current tables in database:')
      allTables.forEach((table) => {
        console.log(`   - ${table.table_name}`)
      })
      console.log()
    }

    await sql.end()
    console.log('✅ Database setup check complete\n')
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    console.error('\n💡 Make sure:')
    console.error('   1. PostgreSQL is running')
    console.error('   2. Database credentials are correct')
    console.error('   3. Environment variables are set (DATABASE_URL or DB_*)')
    process.exit(1)
  }
}

setupDatabase()
