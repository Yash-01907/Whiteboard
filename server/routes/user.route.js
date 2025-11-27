import { Router } from "express";
import { registerUser, loginUser, deleteUser, getCurrentUser } from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/verifyJwt.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/delete").delete(verifyJwt, deleteUser);
router.route("/current-user").get(verifyJwt, getCurrentUser);

export default router;
