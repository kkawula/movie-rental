import { Request, Response } from "express-serve-static-core";
import { db } from "../db";
import { eq, and } from "drizzle-orm";
import { moviesgenres, genres, NewMovieGenre } from "../db/schema";

export async function getMovieGenres(req: Request, res: Response) {
  const { movieId } = req.params;

  try {
    const result = await db
      .select()
      .from(moviesgenres)
      .leftJoin(genres, eq(moviesgenres.genre_id, genres.id))
      .where(eq(moviesgenres.movie_id, Number(movieId)));
    res.send(result);
  } catch (err) {
    res.status(500).send("Error getting movie genres");
  }
}

// TODO: change to PUT on movie
export async function postMovieGenre(req: Request, res: Response) {
  const { movieId } = req.params;
  const newGenre: number = req.body.genre_id;

  try {
    let addedMovieGenre = await db
      .insert(moviesgenres)
      .values({ movie_id: Number(movieId), genre_id: Number(newGenre) })
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
