import Router from "express-promise-router";
import { getMovie } from "../handlers/movies";

const router = Router();

router.get("/:id", getMovie);

export default router;
