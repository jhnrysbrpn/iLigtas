const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const mysql = require('mysql2');
const path = require('path');

// Explicitly load .env file relative to this folder
require('dotenv').config({ path: path.join(__dirname, '.env') });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in your environment variables.");
}

// 1. Create a native mysql2 connection pool
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10, // Gives Render plenty of connection room
  queueLimit: 0
});

// 2. Wrap it with the Prisma 7 driver adapter
const adapter = new PrismaMariaDb(pool);

// 3. Pass the adapter to the constructor (Required in Prisma 7)
const prisma = new PrismaClient({ adapter });

module.exports = prisma;