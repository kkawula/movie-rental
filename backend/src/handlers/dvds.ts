import { Request, Response } from "express-serve-static-core";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { DVD, NewDVD, dvds } from "../db/schema";

export async function getDVDs(req: Request, res: Response) {
  const { movie_id } = req.query;

  if (movie_id) {
    try {
      let movieDVDs: DVD[] = await db
        .select()
        .from(dvds)
        .where(eq(dvds.movie_id, Number(movie_id)));
      res.send(movieDVDs);
    } catch (err) {
      res.status(500).send("Invalid movie_id");
    }
  } else {
    try {
      let allDVDs: DVD[] = await db.select().from(dvds);
      res.send(allDVDs);
    } catch (err) {
      res.status(500).send("Error fetching DVDs");
    }
  }
}

export async function postDVD(req: Request, res: Response) {
  const newDVD: NewDVD = req.body;

  try {
    let addedDVD = await db.insert(dvds).values(newDVD).returning();
    res.send(addedDVD);
  } catch (err) {
    res.status(500).send("Error adding DVD");
  }
}

export async function getDVD(req: Request, res: Response) {
  const { id } = req.params;

  try {
    let dvd: DVD[] = await db
      .select()
      .from(dvds)
      .where(eq(dvds.id, Number(id)));

    if (dvd.length > 0) {
      res.send(dvd[0]);
    } else {
      res.status(404).send("DVD not found");
    }
  } catch (err) {
    res.status(500).send("Error fetching DVD");
  }
}

export async function updateDVD(req: Request, res: Response) {
  const { id } = req.params;
  const updateFields: Partial<NewDVD> = req.body;

  try {
    let updatedDVD = await db
      .update(dvds)
      .set(updateFields)
      .where(eq(dvds.id, Number(id)))
      .returning();
    res.send(updatedDVD);
  } catch (err) {
    res.status(500).send("Error updating DVD");
  }
}

export async function deleteDVD(req: Request, res: Response) {
  const { id } = req.params;

  try {
    await db.delete(dvds).where(eq(dvds.id, Number(id)));
    res.send("DVD deleted");
  } catch (err) {
    res.status(500).send("Error deleting DVD");
  }
}
