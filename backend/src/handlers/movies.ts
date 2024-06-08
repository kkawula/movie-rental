import { Request, Response } from "express-serve-static-core";
import { db } from "../db";
import { Movie, NewMovie, movies, moviesAvailabilityView, moviesgenres } from "../db/schema";
import { SQLWrapper, eq, and, ilike, gte, lte, gt, desc, or } from "drizzle-orm";

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
  
  let query;
  let chosenTable;
  const filters: SQLWrapper[] = [];
  try {
    if (availability === "true") {
      chosenTable = moviesAvailabilityView;
      query = db.select(moviesAvailabilityColumns).from(moviesAvailabilityView);
      filters.push(gt(moviesAvailabilityView.available, 0));
    } else if (availability === "false") {
      chosenTable = moviesAvailabilityView;
      query = db.select(moviesAvailabilityColumns).from(moviesAvailabilityView);
      filters.push(eq(moviesAvailabilityView.available, 0));
    } else {
      chosenTable = movies;
      query = db.select().from(movies);
    }
  
    if (title) {
      filters.push(ilike(chosenTable.title, `%${title}%`));
    }
    if (description) {
      filters.push(ilike(chosenTable.description, `%${description}%`));
    }
    if (director) {
      filters.push(ilike(chosenTable.director, `%${director}%`));
    }
    if (imdb_gte) {
      filters.push(gte(chosenTable.imdb_rate, imdb_gte.toString()));
    }
    if (imdb_lte) {
      filters.push(lte(chosenTable.imdb_rate, imdb_lte.toString()));
    }

    if (genre_ids) {
      query.innerJoin(moviesgenres, eq(chosenTable.id, moviesgenres.movie_id));
      if (Array.isArray(genre_ids)) {
        // TODO: this is basically an OR of genres. To do AND you need to use grouping and count().
        const genreFilters: SQLWrapper[] = [];
        genre_ids.forEach((genre_id) => genreFilters.push(eq(moviesgenres.genre_id, Number(genre_id))));
        filters.push(or(...genreFilters) as SQLWrapper);
      } else {
        filters.push(eq(moviesgenres.genre_id, genre_ids));
      }
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
