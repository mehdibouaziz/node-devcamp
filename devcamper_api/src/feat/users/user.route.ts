import express from "express";
import {protect} from "../../middleware/auth.ts";
import {updateUserDetails} from "./user.controller.ts";


const router = express.Router();

router.put("/:id", protect, updateUserDetails);

export default router;