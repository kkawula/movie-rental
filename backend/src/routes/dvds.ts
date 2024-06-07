import Router from "express-promise-router";
import {
  getDVDs,
  postDVD,
  getDVD,
  updateDVD,
  // getMovieDVDs,
} from "../handlers/dvds";

const router = Router();

router.get("/", getDVDs);
router.post("/", postDVD);

router.get("/:id", getDVD);
router.patch("/:id", updateDVD);
// router.delete("/:id", deleteDVD);

export default router;
