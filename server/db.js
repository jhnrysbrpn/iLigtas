const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const path = require('path');

// Explicitly load .env file relative to this folder
require('dotenv').config({ path: path.join(__dirname, '.env') });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in your environment variables.");
}

// Parse connection URL
const dbUrl = new URL(process.env.DATABASE_URL);

// Instantiate the Prisma MariaDB/MySQL Driver Adapter directly using the parsed credentials
const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port) || 3306,
  user: dbUrl.username,
  password: decodeURIComponent(dbUrl.password),
  database: dbUrl.pathname.replace(/^\//, ''),
  connectionLimit: 5,
});

// Instantiate PrismaClient with the adapter
const prisma = new PrismaClient({ adapter });

module.exports = prisma;