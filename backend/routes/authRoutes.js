import express from "express";
import { loginOrCreate, getAllusers } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", loginOrCreate);
router.get("/", getAllusers); //checking

export default router;
