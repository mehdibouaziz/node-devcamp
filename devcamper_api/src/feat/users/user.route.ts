import express from "express";
import {authorizeRole, protect} from "../../middleware/auth.ts";
import {createUser, getUsers, getUser, updateUserDetails, deleteUser} from "./user.controller.ts";


const router = express.Router();

router
    .route('/')
    .get(protect, authorizeRole('admin'), getUsers)
    .post(protect, authorizeRole('admin'), createUser);

router
    .route('/:id')
    .put(protect, updateUserDetails)
    .get(protect, authorizeRole('admin'), getUser)
    .delete(protect, authorizeRole('admin'), deleteUser);

export default router;