import Router from "express-promise-router";
import {
  getUser,
  postUser,
  getUsers,
  updateUser,
  // deleteUser,
} from "../handlers/users";
const router = Router();

router.get("/", getUsers);
router.post("/", postUser);

router.get("/:id", getUser);
router.patch("/:id", updateUser);
// router.delete("/:id", deleteUser);

export default router;
