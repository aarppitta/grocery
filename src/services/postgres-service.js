import PG from "pg/lib/index.js";
const { Pool } = PG;

import { Kysely, PostgresDialect, sql } from "kysely";

const dialect = new PostgresDialect({
  pool: new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : null }),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.

const postgresService = new Kysely({
  dialect,
});

export const postgresSQL = sql;

export const postgresDisconnect = async () => {};

export default postgresService;
