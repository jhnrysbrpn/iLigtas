const { PrismaClient } = require('@prisma/client');
const path = require('path');

// Explicitly load .env file relative to this folder
require('dotenv').config({ path: path.join(__dirname, '.env') });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in your environment variables.");
}

// Instantiate PrismaClient using the correct singular configuration property
const prisma = new PrismaClient({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});

module.exports = prisma;