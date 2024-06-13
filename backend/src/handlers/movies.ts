import { Request, Response } from "express-serve-static-core";
import { db } from "../db";
import { Movie, NewMovie, movies, moviesAvailabilityView, moviesgenres } from "../db/schema";
import { SQLWrapper, eq, and, ilike, gte, lte, gt, desc, or, count, inArray } from "drizzle-orm";

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
  const { genre_ids } = req.body;
  const { availability, title, description, imdb_gte, imdb_lte, director } = req.query; 
  const moviesAvailabilityColumns = {
    id: moviesAvailabilityView.id,
    title: moviesAvailabilityView.title,
    description: moviesAvailabilityView.description,
    imdb_rate: moviesAvailabilityView.imdb_rate,
    director: moviesAvailabilityView.director,
    poster_url: moviesAvailabilityView.poster_url
  }
  
  let query = db.select(moviesAvailabilityColumns).from(moviesAvailabilityView);

  const filters: SQLWrapper[] = [];
  try {
    if (availability === "true") {
      filters.push(gt(moviesAvailabilityView.available, 0));
    } else if (availability === "false") {
      filters.push(eq(moviesAvailabilityView.available, 0));
    }
  
    if (title) {
      filters.push(ilike(moviesAvailabilityView.title, `%${title}%`));
    }
    if (description) {
      filters.push(ilike(moviesAvailabilityView.description, `%${description}%`));
    }
    if (director) {
      filters.push(ilike(moviesAvailabilityView.director, `%${director}%`));
    }
    if (imdb_gte) {
      filters.push(gte(moviesAvailabilityView.imdb_rate, imdb_gte.toString()));
    }
    if (imdb_lte) {
      filters.push(lte(moviesAvailabilityView.imdb_rate, imdb_lte.toString()));
    }

    if (genre_ids) {
      query.innerJoin(moviesgenres, eq(moviesAvailabilityView.id, moviesgenres.movie_id))
      if (Array.isArray(genre_ids)) {
        filters.push(inArray(moviesgenres.genre_id, genre_ids));
      } else {
        filters.push(eq(moviesgenres.genre_id, genre_ids));
      }
    }
  
    query.where(and(...filters));
    
    if (genre_ids && Array.isArray(genre_ids)) {
      query
        .groupBy((columns) => Object.values(columns))
        .having(({}) => eq(count(moviesgenres.genre_id), genre_ids.length));
    }

    let requestedMovies: Movie[] = await query;
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
