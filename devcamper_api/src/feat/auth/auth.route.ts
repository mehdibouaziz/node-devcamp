import express from "express";
import {registerUser} from "./auth.controller.ts";


const router = express.Router();

router.post("/register", registerUser);

export default router;