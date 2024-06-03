import Router from "express-promise-router";
import {
  getMovie,
  getMovies,
  postMovie,
  updateMovie,
} from "../handlers/movies";

const router = Router();

router.get("/", getMovies);
router.post("/", postMovie);

router.get("/:id", getMovie);
router.patch("/:id", updateMovie);

export default router;
