import Router from "express-promise-router";
import {
  getGenres,
  postGenre,
  getGenre,
  updateGenre,
  deleteGenre,
} from "../handlers/genres";

const router = Router();

router.get("/", getGenres);
router.post("/", postGenre);

router.get("/:id", getGenre);
router.patch("/:id", updateGenre);
router.delete("/:id", deleteGenre);

export default router;
