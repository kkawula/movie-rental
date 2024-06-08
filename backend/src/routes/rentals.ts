import Router from "express-promise-router";
import {
  getRentals,
  postRental,
  getRental,
  updateRental,
  deleteRental,
} from "../handlers/rentals";
const router = Router();

router.get("/", getRentals);
router.post("/", postRental);

router.get("/:id", getRental);
router.patch("/:id", updateRental);
router.delete("/:id", deleteRental);

export default router;
