const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const mysql = require('mysql2');
const path = require('path');

// Explicitly load .env file relative to this folder
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Fallback to check Render's global environment variables if process.env.DATABASE_URL is missing
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ CRITICAL: DATABASE_URL environment variable is totally missing!");
  throw new Error("DATABASE_URL is not defined in your environment variables.");
}

console.log("🔗 Connecting to database host:", connectionString.split('@')[1] || "Localhost/Unknown");

// Create a native pool using the explicit connection string
const pool = mysql.createPool(connectionString);

// Wrap it with the driver adapter
const adapter = new PrismaMariaDb(pool);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;