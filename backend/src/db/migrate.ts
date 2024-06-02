import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { Client } from "pg";

async function main() {
  const client = new Client();
  await client.connect();
  const db = drizzle(client);

  await migrate(db, { migrationsFolder: "./migrations" });

  await client.end();
}

main();
