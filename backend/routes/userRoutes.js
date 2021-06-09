import express from "express";
import Post from "../models/post.js";

const router = express.Router();

// Login Endpoint
router.get("/login", (req, res) => {});

// Signup Endpoint
router.post("/signup", (req, res) => {});

const userRoutes = router;

export default userRoutes;
