import express from "express";
const router = express.Router();

import { signupUser } from "../util/dbQueries.mjs";
import { ReqError } from "../util/errorHandler.mjs";
import bcrypt from "bcrypt";

router.post("/", async (req, res, next) => {
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    signupUser(email, hashedPassword);
    res.status(201).json({ message: "User signed up successfully" });
  } catch (e) {
    next(new ReqError(403, e.message));
  }
});

router.all("/", (req, res) => {
  throw new ReqError(405, `${req.method} not supported on this endpoint.`);
});

export default router;
