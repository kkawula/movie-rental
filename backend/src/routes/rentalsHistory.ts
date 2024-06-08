import Router from "express-promise-router";
import {
  getHistoricalRental,
  getHistoricalRentals,
} from "../handlers/rentalsHistory";
const router = Router();

router.get("/", getHistoricalRentals);

router.get("/:id", getHistoricalRental);

export default router;
