import { Request, Response } from "express-serve-static-core";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { Genre, NewGenre, genres } from "../db/schema";

export async function getGenre(req: Request, res: Response) {
  const { id } = req.params;

  let genre: Genre[] = await db
    .select()
    .from(genres)
    .where(eq(genres.id, Number(id)));

  if (genre.length > 0) {
    res.send(genre[0]);
  } else {
    res.status(404).send("Genre not found");
  }
}

export async function getGenres(req: Request, res: Response) {
  let allGenres: Genre[] = await db.select().from(genres);
  res.send(allGenres);
}

export async function postGenre(req: Request, res: Response) {
  const newGenre: NewGenre = req.body;

  await db.insert(genres).values(newGenre).returning();
}

export async function updateGenre(req: Request, res: Response) {
  const { id } = req.params;
  const updateFields: Partial<NewGenre> = req.body;

  try {
    await db
      .update(genres)
      .set(updateFields)
      .where(eq(genres.id, Number(id)));
    res.send("Genre updated");
  } catch (err) {
    res.status(500).send("Error updating genre");
  }
}

// TODO: Implement deleteGenre

// export async function deleteGenre(req: Request, res: Response) {
//   const { id } = req.params;

//   try {
//     await db.delete(genres).where(eq(genres.id, Number(id)));
//     res.send("Genre deleted");
//   } catch (err) {
//     res.status(500).send("Error deleting genre");
//   }
// }
