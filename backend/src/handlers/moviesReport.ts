import { Request, Response } from "express-serve-static-core";
import { db } from "../db";
import { movies, dvds, rentals, rentalshistory, Movie } from "../db/schema";
import { eq, and, gte, lte, count, SQLWrapper } from "drizzle-orm";

export async function getMoviesReport(req: Request, res: Response) {
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
      id: movies.id,
      title: movies.title,
      description: movies.description,
      imdb_rate: movies.imdb_rate,
      director: movies.director,
      poster_url: movies.poster_url,
      rentals: count(rentalsUnion.id),
    })
    .from(movies)
    .leftJoin(dvds, eq(movies.id, dvds.movie_id))
    .leftJoin(rentalsUnion, and(...filters))
    .groupBy(
      movies.id,
      movies.title,
      movies.description,
      movies.imdb_rate,
      movies.director,
      movies.poster_url
    );

  try {
    let requestedMovies: Movie[] = await query;
    res.send(requestedMovies);
  } catch (err) {
    res.status(500).send("Error creating movies report");
  }
}
