import { Request, Response } from "express-serve-static-core";
import { db } from "../db";
import { eq, and, SQLWrapper, lt, gte } from "drizzle-orm";
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

  const columns = {
    id: rentals.id,
    user_id: rentals.user_id,
    dvd_id: rentals.dvd_id,
    rental_date: rentals.rental_date,
    return_deadline: rentals.return_deadline,
  };
  try {
    let query = db.select(columns).from(rentals);
    const filters: SQLWrapper[] = [];

    if (movie_id) {
      query.innerJoin(dvds, eq(rentals.dvd_id, dvds.id));
      filters.push(eq(dvds.movie_id, Number(movie_id)));
    }
    if (late === "true") {
      filters.push(lt(rentals.return_deadline, sqlDate));
    } else if (late === "false") {
      filters.push(gte(rentals.return_deadline, sqlDate));
    }
    if (user_id) {
      filters.push(eq(rentals.user_id, Number(user_id)));
    }
    if (dvd_id) {
      filters.push(eq(rentals.dvd_id, Number(dvd_id)));
    }

    let requestedRentals = await query.where(and(...filters));
    res.send(requestedRentals);
  } catch (err) {
    res.status(500).send("Error fetching rentals");
  }
}

export async function postRental(req: Request, res: Response) {
  const { user_id, dvd_id, return_deadline } = req.body;

  const returnDeadlineDate = new Date(return_deadline);
  if (isNaN(returnDeadlineDate.getTime()) || returnDeadlineDate < new Date()) {
    res
      .status(400)
      .send(
        "Invalid return_deadline. It must be a valid date and later than the current time."
      );
    return;
  }

  try {
    if (await isDvdAvailable(dvd_id)) {
      const rental = await db
        .insert(rentals)
        .values({
          user_id,
          dvd_id,
          rental_date: new Date().toISOString().split("T")[0],
          return_deadline,
        })
        .returning();
      res.send(rental);
    } else {
      res.send("DVD is not available");
    }
  } catch (err) {
    res.status(500).send("Error adding rental");
  }
}

export async function getRental(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const rental: Rental[] = await db
      .select()
      .from(rentals)
      .where(eq(rentals.id, Number(id)));

    if (rental.length > 0) {
      res.send(rental[0]);
    } else {
      res.status(404).send("Rental not found");
    }
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
      newRentalHistory = await db.transaction(async (tx) => {
        let newRentalHistoryTx = await tx
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
        await tx.delete(rentals).where(eq(rentals.id, Number(id)));
        return newRentalHistoryTx;
      });
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
