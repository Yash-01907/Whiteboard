import { Router } from "express";
import { registerUser, loginUser, deleteUser} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/verifyJwt.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/delete").delete(verifyJwt, deleteUser);

export default router;
