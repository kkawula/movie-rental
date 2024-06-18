import { Request, Response } from "express-serve-static-core";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { Genre, NewGenre, genres } from "../db/schema";

export async function getGenre(req: Request, res: Response) {
  const { id } = req.params;

  try {
    let genre: Genre[] = await db
      .select()
      .from(genres)
      .where(eq(genres.id, Number(id)));

    if (genre.length > 0) {
      res.send(genre[0]);
    } else {
      res.status(404).send("Genre not found");
    }
  } catch (err) {
    res.status(500).send("Error fetching genre");
  }
}

export async function getGenres(req: Request, res: Response) {
  try {
    let allGenres: Genre[] = await db.select().from(genres);
    res.send(allGenres);
  } catch (err) {
    res.status(500).send("Error fetching genres");
  }
}

export async function postGenre(req: Request, res: Response) {
  const newGenre: NewGenre = req.body;

  try {
    let addedGenre = await db.insert(genres).values(newGenre).returning();
    res.send(addedGenre);
  } catch (err) {
    res.status(500).send("Error adding user");
  }
}

export async function updateGenre(req: Request, res: Response) {
  const { id } = req.params;
  const updateFields: Partial<NewGenre> = req.body;

  try {
    let updatedGenre = await db
      .update(genres)
      .set(updateFields)
      .where(eq(genres.id, Number(id)))
      .returning();
    res.send(updatedGenre);
  } catch (err) {
    res.status(500).send("Error updating genre");
  }
}

export async function deleteGenre(req: Request, res: Response) {
  const { id } = req.params;

  try {
    await db.delete(genres).where(eq(genres.id, Number(id)));
    res.send("Genre deleted");
  } catch (err) {
    res.status(500).send("Error deleting genre");
  }
}
