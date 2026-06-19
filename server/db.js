const { PrismaClient } = require('@prisma/client');
const path = require('path');

// Explicitly load .env file relative to this folder
require('dotenv').config({ path: path.join(__dirname, '.env') });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in your environment variables.");
}

// Pass the correct structural format to override the datasource
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

module.exports = prisma;