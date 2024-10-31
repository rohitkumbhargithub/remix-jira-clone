import { PrismaClient } from "@prisma/client";

// Create a new Prisma Client instance
let db: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

// Ensure Prisma Client is singleton in development to avoid new connections on every hot reload
if (process.env.NODE_ENV === "production") {
  db = new PrismaClient();
} else {
  if (!global.__db) {
    global.__db = new PrismaClient();
  }
  db = global.__db;
}

export { db };