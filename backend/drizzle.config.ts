import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",

  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",

  dbCredentials: {
    host: process.env.PGHOST!,
    port: Number(process.env.PGPORT!),
    user: process.env.PGUSER!,
    password: process.env.PGPASSWORD!,
    database: process.env.PGDATABASE!,
  },

  verbose: true,
  strict: true,
});
