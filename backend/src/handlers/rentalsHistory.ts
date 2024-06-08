import { Request, Response } from "express-serve-static-core";
import { db } from "../db";
import { eq, lt, gt, and } from "drizzle-orm";
import { RentalHistory, rentalshistory, dvds } from "../db/schema";

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
  // I don't know how to combine these two queries

  if (movie_id) {
    try {
      let query = await db
        .select()
        .from(rentalshistory)
        .leftJoin(dvds, eq(rentalshistory.dvd_id, dvds.id))
        .where(
          and(
            late
              ? late === "true"
                ? gt(
                    rentalshistory.returned_date,
                    rentalshistory.return_deadline
                  )
                : lt(
                    rentalshistory.returned_date,
                    rentalshistory.return_deadline
                  )
              : undefined,
            user_id ? eq(rentalshistory.user_id, Number(user_id)) : undefined,
            dvd_id ? eq(rentalshistory.dvd_id, Number(dvd_id)) : undefined,
            movie_id ? eq(dvds.movie_id, Number(movie_id)) : undefined
          )
        );
      res.send(query);
    } catch (e) {
      res.status(400).send("Error getting historical rentals");
    }
  } else {
    let query: RentalHistory[] = await db
      .select()
      .from(rentalshistory)
      .where(
        and(
          late
            ? late === "true"
              ? gt(rentalshistory.returned_date, rentalshistory.return_deadline)
              : lt(rentalshistory.returned_date, rentalshistory.return_deadline)
            : undefined,
          user_id ? eq(rentalshistory.user_id, Number(user_id)) : undefined,
          dvd_id ? eq(rentalshistory.dvd_id, Number(dvd_id)) : undefined
        )
      );
    res.send(query);
  }
}
