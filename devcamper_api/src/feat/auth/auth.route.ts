import express from "express";
import {forgotPassword, getMe, loginUser, registerUser, resetPassword} from "./auth.controller.ts";
import {protect} from "../../middleware/auth.ts";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword);

export default router;