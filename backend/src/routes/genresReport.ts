import Router from "express-promise-router";

import { getGenresReport } from "../handlers/genresReport";

const router = Router();

router.get("/", getGenresReport);

export default router;
