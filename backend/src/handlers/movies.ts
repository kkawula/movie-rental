import { Request, Response } from "express-serve-static-core";
import { db } from "../db";
import { Movie, NewMovie, movies, moviesgenres } from "../db/schema";
import { eq } from "drizzle-orm";

export async function getMovie(req: Request, res: Response) {
  const { id } = req.params;

  let movie: Movie[] = await db
    .select()
    .from(movies)
    .where(eq(movies.id, Number(id)));

  if (movie.length > 0) {
    res.send(movie[0]);
  } else {
    res.status(404).send("Movie not found");
  }
}

export async function getMovies(req: Request, res: Response) {
  let allMovies: Movie[] = await db.select().from(movies);
  res.send(allMovies);
}

export async function postMovie(req: Request, res: Response) {
  const newMovie: NewMovie = req.body;

  try {
    await db.insert(movies).values(newMovie);
    res.send("Movie added");
  } catch (err) {
    res.status(500).send("Error adding movie");
  }
}

export async function updateMovie(req: Request, res: Response) {
  const { id } = req.params;
  const updateFields: Partial<NewMovie> = req.body;

  try {
    await db
      .update(movies)
      .set(updateFields)
      .where(eq(movies.id, Number(id)));
    res.send("Movie updated");
  } catch (err) {
    res.status(500).send("Error updating movie");
  }
}

// TODO: Implement deleteMovie

// export async function deleteMovie(req: Request, res: Response) {
//   const { id } = req.params;

//   try {
//     await db.delete(movies).where(eq(movies.id, Number(id)));
//     res.send("Movie deleted");
//   } catch (err) {
//     res.status(500).send("Error deleting movie");
//   }
// }
