/**
 * MongoDB Connection
 * Uses native MongoDB driver for Atlas connection
 */

import { MongoClient, type Db } from "mongodb";

const DATABASE_URL = process.env["DATABASE_URL"] ?? "";

if (!DATABASE_URL) {
  console.warn("⚠️  DATABASE_URL not set — database calls will fail");
}

let client: MongoClient | null = null;
let db: Db | null = null;

/**
 * Get the MongoDB database instance (singleton)
 */
export async function getDb(): Promise<Db> {
  if (db) return db;

  client = new MongoClient(DATABASE_URL);
  await client.connect();
  db = client.db();

  console.log("✅ Connected to MongoDB");
  return db;
}

/**
 * Close the MongoDB connection (for graceful shutdown)
 */
export async function closeDb(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
