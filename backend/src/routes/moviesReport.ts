import Router from "express-promise-router";

import { getMoviesReport } from "../handlers/moviesReport";

const router = Router();

router.get("/", getMoviesReport);

export default router;
