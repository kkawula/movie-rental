import { Request, Response } from "express-serve-static-core";
import { db } from "../db";
import { movies } from "../db/schema";
import { eq } from "drizzle-orm";

export async function getMovie(req: Request, res: Response) {
  const { id } = req.params;

  // only temporary, probably should use typescript to add type to the Request with id as number
  let movie = await db
    .select()
    .from(movies)
    .where(eq(movies.id, Number(id)));
  res.send(movie[0]);
}
