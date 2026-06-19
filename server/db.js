const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const mysql = require('mysql2');
const path = require('path');

// Force-load environmental fallback strings
require('dotenv').config({ path: path.join(__dirname, '.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing from environment variables.");
}

// Strip out query parameters safely to find clean database name
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

console.log(`🚀 FORCE CONNECTING TO AIVEN: ${poolConfig.host}:${poolConfig.port} | Database: ${poolConfig.database}`);

const pool = mysql.createPool(poolConfig);
const adapter = new PrismaMariaDb(pool);

// Pass the adapter directly and explicitly override the url parameter to lock it in
const prisma = new PrismaClient({ 
  adapter,
  datasources: {
    db: {
      url: connectionString
    }
  }
});

module.exports = prisma;