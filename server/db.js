const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const path = require('path');

// Load environment variables cleanly
require('dotenv').config({ path: path.join(__dirname, '.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing from environment variables.");
}

// Clean the string (remove trailing spaces if any)
const cleanUrl = connectionString.trim();

// Parse connection URL details out to ensure a clean config object
const dbUrl = new URL(cleanUrl);
const dbName = dbUrl.pathname.replace(/^\//, '').split('?')[0];

console.log(`🚀 INITIALIZING PRISMA 7 MARIADB ADAPTER FOR: ${dbUrl.hostname}:${dbUrl.port || 3306}`);

// Pass the raw connection configuration parameters directly to PrismaMariaDb
const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port) || 3306,
  user: dbUrl.username,
  password: decodeURIComponent(dbUrl.password),
  database: dbName,
  connectionLimit: 10,
  ssl: {
    rejectUnauthorized: false
  }
});

// Pass the configured adapter instance to Prisma Client
const prisma = new PrismaClient({ adapter });

module.exports = prisma;