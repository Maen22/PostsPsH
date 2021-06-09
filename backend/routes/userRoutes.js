import express from "express";
import bcrypt from "bcrypt";
import User from "../models/user.js";

const router = express.Router();

// Login Endpoint
router.get("/login", (req, res) => {});

// Signup Endpoint
router.post("/signup", (req, res) => {
  const { email, password } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    const user = new User({
      email,
      hash,
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User registered succesfully.",
          result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  });
});

const userRoutes = router;

export default userRoutes;
