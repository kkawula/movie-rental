import { Request, Response } from "express-serve-static-core";
import { db } from "../db";
import { Movie, movies } from "../db/schema";
import { eq, max } from "drizzle-orm";

export async function getMovie(req: Request, res: Response) {
  const { id } = req.params;

  let movie: Movie[] = await db
    .select()
    .from(movies)
    .where(eq(movies.id, Number(id)));
  res.send(movie[0]);
}

export async function getMovies(req: Request, res: Response) {
  let allMovies: Movie[] = await db.select().from(movies);
  res.send(allMovies);
}

export async function postMovie(req: Request, res: Response) {
  const { title, description, imdb_rate, director, poster_url } = req.body;

  const maxIdResult: { id: number | null }[] = await db
    .select({ id: max(movies.id) })
    .from(movies)
    .execute();
  const newId = maxIdResult[0].id ? maxIdResult[0].id + 1 : 0;
  try {
    await db.insert(movies).values({
      id: newId,
      title,
      description,
      imdb_rate,
      director,
      poster_url,
    });
    res.send("Movie added");
  } catch (err) {
    res.status(500).send("Error adding movie");
  }
}

export async function updateMovie(req: Request, res: Response) {
  const { id } = req.params;
  const { title, description, imdb_rate, director, poster_url } = req.body;

  const updateFields: Partial<{
    title: string;
    description: string;
    imdb_rate: string;
    director: string;
    poster_url: string;
  }> = {};
  if (title !== undefined) updateFields.title = title;
  if (description !== undefined) updateFields.description = description;
  if (imdb_rate !== undefined) updateFields.imdb_rate = imdb_rate;
  if (director !== undefined) updateFields.director = director;
  if (poster_url !== undefined) updateFields.poster_url = poster_url;

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
