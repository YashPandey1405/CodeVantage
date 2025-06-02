import express from "express";

// Middleware Imports....
import { authMiddleware, checkAdmin } from "../middleware/auth.middleware.js";

// Controller Imports....
import {
  createProblem,
  deleteProblem,
  getAllProblems,
  getAllProblemsSolvedByUser,
  getProblemById,
  updateProblem,
} from "../controllers/problem.controller.js";

const problemRoutes = express.Router();

// Route TO create An Problem.....
problemRoutes.post(
  "/create-problem",
  authMiddleware,
  checkAdmin,
  createProblem,
);

// Route TO Get-Problem.....
problemRoutes.get("/get-all-problems", authMiddleware, getAllProblems);

problemRoutes.get("/get-problem/:id", authMiddleware, getProblemById);

// Update Problem Route.....
problemRoutes.put(
  "/update-problem/:id",
  authMiddleware,
  checkAdmin,
  updateProblem,
);

// Delete Problem Route.....
problemRoutes.delete(
  "/delete-problem/:id",
  authMiddleware,
  checkAdmin,
  deleteProblem,
);

// Special Route TO Get All The Problems Solved By The User.....
problemRoutes.get(
  "/get-solved-problems",
  authMiddleware,
  getAllProblemsSolvedByUser,
);

export default problemRoutes;
