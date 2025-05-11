import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config({
  path: "./.env",
});

// Routes Imports.....
import authRouter from "./routes/auth.routes.js";

const app = express();
const port = process.env.PORT || 8080;

// Important To Read The JSON & Form data.....
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Error Handling Middleware Which Will Handle All The Errors In The Application.....
const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    statusCode: statusCode,
    message: err.message || "Internal Server Error",
    success: false,
    errors: err.errors || [],
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // optional
  });
};

app.use("/api/v1/auth", authRouter);

// Finally adding the error handler at the very bottom
// This Will Improve The Readability Of The Api-Errors.....
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is Listening At Port : ${port}`);
});
