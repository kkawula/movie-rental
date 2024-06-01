import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema"
import { Pool } from "pg";

const pool = new Pool();
export const db = drizzle(pool, { schema, logger: true });