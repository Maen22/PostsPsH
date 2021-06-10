import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

const router = express.Router();

// Signup Endpoint
router.post("/signup", (req, res) => {
  const { email, password } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    const user = new User({
      email,
      password: hash,
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

// Login Endpoint
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  let fetchedUser;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed.",
        });
      }
      fetchedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed.",
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        "this_should_be_longer",
        {
          expiresIn: "1h",
        }
      );
      res.status(200).json({
        token,
        expiresIn: 3600,
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Auth failed.",
      });
    });
});

const userRoutes = router;

export default userRoutes;
