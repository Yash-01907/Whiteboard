import { Router } from "express";
import {
  createWhiteboard,
  deleteWhiteboard,
  getAllWhiteboards,
  getWhiteboard,
  updateWhiteboard,
} from "../controllers/whiteboard.controller.js";
import { verifyJwt } from "../middlewares/verifyJwt.js";

const router = Router();
router.use(verifyJwt);
router.route("/").get(getAllWhiteboards);
router.route("/").post(createWhiteboard);
router.route("/:id").get(getWhiteboard);
router.route("/:id").put(updateWhiteboard);
router.route("/:id").delete(deleteWhiteboard);

export default router;
