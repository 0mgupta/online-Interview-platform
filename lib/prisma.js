import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "./generated/prisma/client";

const globalForPrisma = globalThis;

function createPrismaClient() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10, // Limit maximum connections per instance
    idleTimeoutMillis: 5000, // Close idle connections after 5 seconds to prevent PgBouncer timeouts
    connectionTimeoutMillis: 5000, // Timeout connection attempts after 5 seconds
  });

  // Handle errors on idle connections to prevent unhandled exception crashes
  pool.on("error", (err) => {
    console.error("Unexpected error on idle PostgreSQL client:", err);
  });

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

