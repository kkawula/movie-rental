import { Request, Response } from "express-serve-static-core";
import { db } from "../db";
import {
  movies,
  dvds,
  rentals,
  rentalshistory,
  genres,
  moviesgenres,
  Genre,
} from "../db/schema";
import { eq, and, gte, lte, count, SQLWrapper } from "drizzle-orm";

export async function getGenresReport(req: Request, res: Response) {
  const { rental_before, rental_after } = req.query;

  const rentalsUnion = db
    .select({
      id: rentals.id,
      dvd_id: rentals.dvd_id,
      rental_date: rentals.rental_date,
    })
    .from(rentals)
    .unionAll(
      db
        .select({
          id: rentalshistory.id,
          dvd_id: rentalshistory.dvd_id,
          rental_date: rentalshistory.rental_date,
        })
        .from(rentalshistory)
    )
    .as("rs");

  const filters: SQLWrapper[] = [eq(rentalsUnion.dvd_id, dvds.id)];

  if (rental_before) {
    filters.push(lte(rentalsUnion.rental_date, String(rental_before)));
  }

  if (rental_after) {
    filters.push(gte(rentalsUnion.rental_date, String(rental_after)));
  }

  const query = db
    .select({
      id: genres.id,
      name: genres.name,
      rentals: count(rentalsUnion.id),
    })
    .from(genres)
    .leftJoin(moviesgenres, eq(genres.id, moviesgenres.genre_id))
    .leftJoin(movies, eq(moviesgenres.movie_id, movies.id))
    .leftJoin(dvds, eq(movies.id, dvds.movie_id))
    .leftJoin(rentalsUnion, and(...filters))
    .groupBy(genres.id, genres.name);

  try {
    let genres: Genre[] = await query;
    res.send(genres);
  } catch (err) {
    res.status(500).send("Error creating genres report");
  }
}
