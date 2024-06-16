import { Request, Response } from "express-serve-static-core";
import { db } from "../db";
import { sql } from "drizzle-orm";
import { dvds, rentals } from "../db/schema";

export async function getAvailableDvds(req: Request, res: Response) {
  const { movieId } = req.params;
  try {
    let availableDvds = await db.execute(
      sql`select * from ${dvds} where ${dvds.movie_id} = ${movieId} and ${dvds.rentable} = true and ${dvds.id} not in (select ${rentals.dvd_id} from ${rentals} join ${dvds} on ${dvds.id} = ${rentals.dvd_id} where ${dvds.movie_id} = ${movieId})`
    );

    res.send(availableDvds.rows);
  } catch (err) {
    res.status(500).send("Error fetching available DVDs");
  }
}
