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

export async function postMovieGenre(req: Request, res: Response) {
  const { movieId } = req.params;
  const newMovieGneres: number[] = req.body.newMovieGenres;
  console.log(newMovieGneres);

  newMovieGneres.forEach(async (genreId: number) => {
    try {
      await db
        .insert(moviesgenres)
        .values({ movie_id: Number(movieId), genre_id: genreId });
      res.send("Genre added to movie");
    } catch (err) {
      res.status(500).send("Error adding genre to movie");
    }
  });
}

export async function getMovieGenre(req: Request, res: Response) {
  const { movieId, genreId } = req.params;

  try {
    const result = await db
      .select()
      .from(moviesgenres)
      .leftJoin(genres, eq(moviesgenres.genre_id, genres.id))
      .where(
        and(
          eq(moviesgenres.movie_id, Number(movieId)),
          eq(genres.id, Number(genreId))
        )
      );
    if (result.length === 0) {
      res.status(404).send("Genre not found for movie");
    }
    res.send(result[0].Genres?.name);
  } catch (err) {
    res.status(500).send("Error getting movie genre");
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
