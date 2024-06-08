import { Request, Response } from "express-serve-static-core";
import { db } from "../db";
import { eq, gt, and } from "drizzle-orm";
import {
  rentals,
  Rental,
  dvds,
  rentalshistory,
  RentalHistory,
  NewRentalHistory,
} from "../db/schema";

export async function isDvdAvailable(dvd_id: number) {
  const rental: Rental[] = await db
    .select()
    .from(rentals)
    .where(eq(rentals.dvd_id, dvd_id));

  return rental.length === 0;
}

export async function getRentals(req: Request, res: Response) {
  const { late, user_id, dvd_id, movie_id } = req.query;
  const sqlDate = new Date().toISOString().split("T")[0];

  // I don't know how to combine these two queries
  if (movie_id) {
    let query = await db
      .select({ rentals: rentals })
      .from(rentals)
      .leftJoin(dvds, eq(rentals.dvd_id, dvds.id))
      .where(
        and(
          late ? gt(rentals.return_deadline, sqlDate) : undefined,
          user_id ? eq(rentals.user_id, Number(user_id)) : undefined,
          dvd_id ? eq(rentals.dvd_id, Number(dvd_id)) : undefined,
          movie_id ? eq(dvds.movie_id, Number(movie_id)) : undefined
        )
      );
    res.send(query);
  } else {
    let query: Rental[] = await db
      .select()
      .from(rentals)
      .where(
        and(
          late ? gt(rentals.return_deadline, sqlDate) : undefined,
          user_id ? eq(rentals.user_id, Number(user_id)) : undefined,
          dvd_id ? eq(rentals.dvd_id, Number(dvd_id)) : undefined
        )
      );
    res.send(query);
  }
}

export async function postRental(req: Request, res: Response) {
  const { user_id, dvd_id, return_deadline } = req.body;

  if (await isDvdAvailable(dvd_id)) {
    const rental = await db.insert(rentals).values({
      user_id,
      dvd_id,
      rental_date: new Date().toISOString().split("T")[0],
      return_deadline,
    });

    res.send(rental);
  } else {
    res.send("DVD is not available");
  }
}

export async function getRental(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const rental: Rental[] = await db
      .select()
      .from(rentals)
      .where(eq(rentals.id, Number(id)));

    res.send(rental);
  } catch (error) {
    res.status(500).send("Error retrieving rental");
  }
}

export async function updateRental(req: Request, res: Response) {
  const { id } = req.params;
  const rentalUpdates: Partial<NewRentalHistory> = req.body;

  try {
    const rental = await db
      .update(rentals)
      .set(rentalUpdates)
      .where(eq(rentals.id, Number(id)))
      .returning();

    res.send(rental);
  } catch (error) {
    res.status(500).send("Error updating rental");
  }
}

export async function deleteRental(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const returnedDvd = await db
      .select()
      .from(rentals)
      .where(eq(rentals.id, Number(id)));

    let newRentalHistory: RentalHistory[];

    try {
      newRentalHistory = await db
        .insert(rentalshistory)
        .values({
          id: returnedDvd[0].id,
          user_id: returnedDvd[0].user_id,
          dvd_id: returnedDvd[0].dvd_id,
          rental_date: returnedDvd[0].rental_date,
          return_deadline: returnedDvd[0].return_deadline,
          returned_date: new Date().toISOString().split("T")[0],
        })
        .returning();
    } catch (err) {
      console.error("Error inserting into rental history:", err);
      throw err;
    }

    try {
      await db.delete(rentals).where(eq(rentals.id, Number(id)));
    } catch (err) {
      console.error("Error deleting from rentals:", err);
      throw err;
    }

    res.send(newRentalHistory);
  } catch (err) {
    console.error("Error handling rental:", err);
    res.status(500).send("Error handling rental");
  }
}
