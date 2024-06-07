import Router from "express-promise-router";
import {
  getMovie,
  getMovies,
  postMovie,
  updateMovie,
  // deleteMovie,
} from "../handlers/movies";

import {
  getMovieGenres,
  postMovieGenre,
  // putMovieGenre,
  deleteMovieGenre,
} from "../handlers/movieGenres";

const router = Router();

router.get("/", getMovies);
router.post("/", postMovie);

router.get("/:id", getMovie);
router.patch("/:id", updateMovie);
// router.delete("/:id", deleteMovie);

router.get("/:movieId/genres", getMovieGenres);
router.post("/:movieId/genres", postMovieGenre);

// router.put("/:movieId/genres/:genreId", putMovieGenre);
router.delete("/:movieId/genres/:genreId", deleteMovieGenre);

export default router;
