import { Request, Response } from "express-serve-static-core";
import { db } from "../db";
import { and, eq, isNull, sql } from "drizzle-orm";
import { dvds, movies, rentals } from "../db/schema";

export async function getAvailableDvds(req: Request, res: Response) {
  const { movieId } = req.params;
  try {
    let availableDvds = await db
      .select({
        id: dvds.id,
        movie_id: dvds.movie_id,
        rentable: dvds.rentable,
      })
      .from(movies)
      .innerJoin(
        dvds,
        and(eq(movies.id, dvds.movie_id), eq(dvds.rentable, true))
      )
      .leftJoin(rentals, eq(dvds.id, rentals.dvd_id))
      .where(and(eq(movies.id, Number(movieId)), isNull(rentals.id)));

    res.send(availableDvds);
  } catch (err) {
    res.status(500).send("Error fetching available DVDs");
  }
}
