import {
  register,
  login,
  logout,
  check,
} from "../controllers/auth.controllers.js";

// Import The Middlewares....
import { verifyJWT } from "../middleware/auth.middleware.js";

import express from "express";

const authRouter = express.Router();

// All 4 Auth Routes & Controllers.....
authRouter.route("/register").post(register);
authRouter.route("/login").post(login);
authRouter.route("/logout").post(verifyJWT, logout);
authRouter.route("/check").get(verifyJWT, check);

export default authRouter;
