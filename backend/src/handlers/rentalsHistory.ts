import { Request, Response } from "express-serve-static-core";
import { db } from "../db";
import { eq, lt, gt, and, lte, SQLWrapper } from "drizzle-orm";
import { RentalHistory, rentalshistory, dvds, rentals } from "../db/schema";

export async function getHistoricalRental(req: Request, res: Response) {
  const { id } = req.params;
  const query: RentalHistory[] = await db
    .select()
    .from(rentalshistory)
    .where(eq(rentalshistory.id, Number(id)));
  if (query.length === 0) {
    res.status(404).send("Rental not found");
  } else {
    res.send(query[0]);
  }
}

export async function getHistoricalRentals(req: Request, res: Response) {
  const { late, user_id, dvd_id, movie_id } = req.query;
  const columns = {
    id: rentalshistory.id,
    user_id: rentalshistory.user_id,
    dvd_id: rentalshistory.dvd_id,
    rental_date: rentalshistory.rental_date,
    return_deadline: rentalshistory.return_deadline,
    returned_date: rentalshistory.returned_date
  }

  try {
    let query = db.select(columns).from(rentalshistory);
    const filters: SQLWrapper[] = [];
    
    if (movie_id) {
      query.leftJoin(dvds, eq(rentalshistory.dvd_id, dvds.id));
      filters.push(eq(dvds.movie_id, Number(movie_id)));
    }
    if (late === "true") {
      filters.push(gt(rentalshistory.returned_date, rentalshistory.return_deadline));
    } else if (late === "false") {
      filters.push(lte(rentalshistory.returned_date, rentalshistory.return_deadline));
    }
    if (user_id) {
      filters.push(eq(rentalshistory.user_id, Number(user_id)));
    }
    if (dvd_id) {
      filters.push(eq(rentalshistory.dvd_id, Number(dvd_id)))
    }
    
    let requestedRentals = await query.where(and(...filters));
    res.send(requestedRentals);
  } catch (err) {
    res.status(500).send("Error fetching rentals history");
  }
}
