import express from "express";
import {
    forgotPassword,
    getMe,
    loginUser,
    logoutUser,
    registerUser,
    resetPassword,
    updatePassword
} from "./auth.controller.ts";
import {protect} from "../../middleware/auth.ts";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/me", protect, getMe);
router.put("/updatepassword", protect, updatePassword);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword);

export default router;