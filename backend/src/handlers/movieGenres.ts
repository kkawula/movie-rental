import { Request, Response } from "express-serve-static-core";
import { db } from "../db";
import { eq, and } from "drizzle-orm";
import { moviesgenres, genres } from "../db/schema";

export async function getMovieGenres(req: Request, res: Response) {
  const { movieId } = req.params;

  try {
    const result = await db
      .select({ id: genres.id, name: genres.name })
      .from(moviesgenres)
      .innerJoin(genres, eq(moviesgenres.genre_id, genres.id))
      .where(eq(moviesgenres.movie_id, Number(movieId)));

    res.send(result);
  } catch (err) {
    res.status(500).send("Error getting movie genres");
  }
}

export async function putMovieGenre(req: Request, res: Response) {
  const { movieId, genreId } = req.params;

  try {
    let addedMovieGenre = await db
      .insert(moviesgenres)
      .values({ movie_id: Number(movieId), genre_id: Number(genreId) })
      .returning();
    res.send(addedMovieGenre);
  } catch (err) {
    res.status(500).send("Error with adding genre to movie");
  }
}

export async function deleteMovieGenre(req: Request, res: Response) {
  const { movieId, genreId } = req.params;

  try {
    await db
      .delete(moviesgenres)
      .where(
        and(
          eq(moviesgenres.movie_id, Number(movieId)),
          eq(moviesgenres.genre_id, Number(genreId))
        )
      );
    res.send("Genre deleted from movie");
  } catch (err) {
    res.status(500).send("Error deleting movie genre");
  }
}
