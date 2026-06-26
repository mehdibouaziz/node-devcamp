import express from "express";
import {getMe, loginUser, registerUser} from "./auth.controller.ts";
import {protect} from "../../middleware/auth.ts";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.route("/me").get(protect, getMe);

export default router;