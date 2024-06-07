import { Request, Response } from "express-serve-static-core";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { DVD, dvds } from "../db/schema";

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
    let allDVDs: DVD[] = await db.select().from(dvds);
    res.send(allDVDs);
  }
}

export async function postDVD(req: Request, res: Response) {
  const movie_id: number = req.body.movie_id;

  try {
    let addedDVD = await db.insert(dvds).values({ movie_id: movie_id }).returning();
    res.send(addedDVD);
  } catch (err) {
    res.status(500).send("Error adding DVD");
  }
}

export async function getDVD(req: Request, res: Response) {
  const { id } = req.params;

  let dvd: DVD[] = await db
    .select()
    .from(dvds)
    .where(eq(dvds.id, Number(id)));

  if (dvd.length > 0) {
    res.send(dvd[0]);
  } else {
    res.status(404).send("DVD not found");
  }
}

export async function updateDVD(req: Request, res: Response) {
  const { id } = req.params;
  const updateFields: Partial<DVD> = req.body;

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

// TODO: Implement deleteDVD

// export async function deleteDVD(req: Request, res: Response) {
//   const { id } = req.params;

//   try {
//     await db.delete(dvds).where(eq(dvds.id, Number(id)));
//     res.send("DVD deleted");
//   } catch (err) {
//     res.status(500).send("Error deleting DVD");
//   }
// }

// export async function getMovieDVDs(req: Request, res: Response) {
//   const { movie_id } = req.query;

//   let movieDVDs: DVD[] = await db
//     .select()
//     .from(dvds)
//     .where(eq(dvds.movie_id, Number(movie_id)));

//   res.send(movieDVDs);
// }
