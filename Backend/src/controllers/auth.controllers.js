import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { getCookieOptions } from "../utils/cookie-Options.js";

// DB-Import For Controllers.....
import { db } from "../libs/db.js";
import { UserRole } from "../generated/prisma/index.js";

const register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Invalid Credentials");
  }

  console.log(req.body);

  try {
    // Search Whether the Current user Exists In The DB Or Not....
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    // When The User Is Already registered.....
    if (existingUser) {
      throw new ApiError(400, "User already exists");
    }

    // Hash The Password 2^10 -> 1024 Times.....
    const hashedPassword = await bcrypt.hash(password, 10);

    // Register The New User On The Database.....
    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: UserRole.USER,
      },
    });
    console.log(newUser);

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_TOKEN_SECRET, {
      expiresIn: process.env.JWT_TOKEN_EXPIRY,
    });

    // Set The Cookie In The Response.....
    res.cookie("jwt", token, getCookieOptions());

    // Send The API Response.....
    const response = new ApiResponse(
      201,
      {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          image: newUser.image,
        },
      },
      "User created successfully"
    );

    res.status(response.statusCode).json(response);
  } catch (error) {
    console.error("Error creating user:", error);
    throw new ApiError(500, "Error While Creating user");
  }
});

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  if (!email || !password) {
    throw new ApiError(400, "Invalid Credentials");
  }

  try {
    // Search For The Requested user In The DB.....
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    // If The User is Not Found In the Database....
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Check the Entered Password With the Orignal Password....
    const isMatch = await bcrypt.compare(password, user.password);

    // When The Password Doesn't Match....
    if (!isMatch) {
      throw new ApiError(401, "Invalid credentials");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_TOKEN_SECRET, {
      expiresIn: process.env.JWT_TOKEN_EXPIRY,
    });

    // Set The Cookie In The Response.....
    res.cookie("jwt", token, getCookieOptions());

    // Send The API Response.....
    const response = new ApiResponse(
      200,
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        },
      },
      "User Logged in successfully"
    );

    res.status(response.statusCode).json(response);
  } catch (error) {
    console.error("Error logging user:", error);
    throw new ApiError(500, "Error While Logging user");
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });

    const response = new ApiResponse(200, null, "User logged out successfully");

    res.status(response.statusCode).json(response);
  } catch (error) {
    console.error("Error logging out user:", error);
    throw new ApiError(500, "Error logging out user");
  }
};

const check = async (req, res) => {
  try {
    const response = new ApiResponse(
      200,
      { user: req.user },
      "User authenticated successfully"
    );

    res.status(response.statusCode).json(response);
  } catch (error) {
    console.error("Error checking user:", error);
    throw new ApiError(500, "Error checking user");
  }
};

export { register, login, logout, check };
