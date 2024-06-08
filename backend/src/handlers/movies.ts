import { Request, Response } from "express-serve-static-core";
import { db } from "../db";
import { Movie, NewMovie, movies, moviesAvailabilityView } from "../db/schema";
import { SQLWrapper, eq, and, ilike, gte, lte, gt, desc } from "drizzle-orm";

export async function getMovie(req: Request, res: Response) {
  const { id } = req.params;

  try {
    let movie: Movie[] = await db
    .select()
    .from(movies)
    .where(eq(movies.id, Number(id)));

    if (movie.length > 0) {
      res.send(movie[0]);
    } else {
      res.status(404).send("Movie not found");
    }
  } catch (err) {
    res.status(500).send("Error fetching movie");
  }
}

export async function getMovies(req: Request, res: Response) {
  // TODO: what about genre_id? -> allow multiple?
  const { availability, title, description, imdb_gte, imdb_lte, director } = req.query; 
  const moviesAvailabilityColumns = {
    id: moviesAvailabilityView.id,
    title: moviesAvailabilityView.title,
    description: moviesAvailabilityView.description,
    imdb_rate: moviesAvailabilityView.imdb_rate,
    director: moviesAvailabilityView.director,
    poster_url: moviesAvailabilityView.poster_url
  }
  
  let query;
  const filters: SQLWrapper[] = [];
  try {
    if (availability === "true") {
      query = db.select(moviesAvailabilityColumns).from(moviesAvailabilityView);
      filters.push(gt(moviesAvailabilityView.available, 0));
    } else if (availability === "false") {
      query = db.select(moviesAvailabilityColumns).from(moviesAvailabilityView);
      filters.push(eq(moviesAvailabilityView.available, 0));
    } else {
      query = db.select().from(movies);
    }
  
    if (title) {
      filters.push(ilike(movies.title, `%${title}%`));
    }
    if (description) {
      filters.push(ilike(movies.description, `%${description}%`));
    }
    if (director) {
      filters.push(ilike(movies.director, `%${director}%`));
    }
    if (imdb_gte) {
      filters.push(gte(movies.imdb_rate, imdb_gte.toString()));
    }
    if (imdb_lte) {
      filters.push(lte(movies.imdb_rate, imdb_lte.toString()));
    }
  
    let requestedMovies: Movie[] = await query.where(and(...filters));
    res.send(requestedMovies);
  } catch (err) {
    res.status(500).send("Error fetching movies");
  }
}

export async function postMovie(req: Request, res: Response) {
  const newMovie: NewMovie = req.body;

  try {
    let addedMovie = await db.insert(movies).values(newMovie).returning();
    res.send(addedMovie);
  } catch (err) {
    res.status(500).send("Error adding movie");
  }
}

export async function updateMovie(req: Request, res: Response) {
  const { id } = req.params;
  const updateFields: Partial<NewMovie> = req.body;

  try {
    let updatedMovie = await db
      .update(movies)
      .set(updateFields)
      .where(eq(movies.id, Number(id)))
      .returning();
    res.send(updatedMovie);
  } catch (err) {
    res.status(500).send("Error updating movie");
  }
}

export async function deleteMovie(req: Request, res: Response) {
  const { id } = req.params;

  try {
    await db.delete(movies).where(eq(movies.id, Number(id)));
    res.send("Movie deleted");
  } catch (err) {
    res.status(500).send("Error deleting movie");
  }
}
