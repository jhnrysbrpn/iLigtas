const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const mysql = require('mysql2');
const path = require('path');

// Explicitly load .env file relative to this folder
require('dotenv').config({ path: path.join(__dirname, '.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in your environment variables.");
}

// Parse the connection URL manually to eliminate query string incompatibilities
const dbUrl = new URL(connectionString);

const poolConfig = {
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port) || 3306,
  user: dbUrl.username,
  password: decodeURIComponent(dbUrl.password),
  database: dbUrl.pathname.replace(/^\//, ''),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false // Bypasses strict Aiven cert path checks safely on Render
  }
};

console.log(`🔗 Connecting directly to Aiven host: ${poolConfig.host}:${poolConfig.port}`);

// Create the pool from explicit parameters instead of raw string
const pool = mysql.createPool(poolConfig);

const adapter = new PrismaMariaDb(pool);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;