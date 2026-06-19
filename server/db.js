const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const mysql = require('mysql2');
const path = require('path');

// Load env files safely
require('dotenv').config({ path: path.join(__dirname, '.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing from environment variables.");
}

// Parse string cleanly
const dbUrl = new URL(connectionString);
const dbName = dbUrl.pathname.replace(/^\//, '').split('?')[0];

const poolConfig = {
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port) || 3306,
  user: dbUrl.username,
  password: decodeURIComponent(dbUrl.password),
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false
  }
};

console.log(`🚀 CONNECTING VIA ADAPTER TO: ${poolConfig.host}:${poolConfig.port} | Database: ${poolConfig.database}`);

const pool = mysql.createPool(poolConfig);
const adapter = new PrismaMariaDb(pool);

// Instantiate with just the driver adapter
const prisma = new PrismaClient({ adapter });

module.exports = prisma;