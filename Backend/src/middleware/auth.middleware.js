import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { db } from "../libs/db.js";

// Jane Se Pehle Mil Ke Jana.....
export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // Obtain the Token From The 'jwt' Cookie Of req.cookies....
    const token = req.cookies.jwt;

    // If Token Is Not Found....
    if (!token) {
      throw new ApiError(401, "UnAuthorized Access");
    }

    let decoded;

    // Nested Try-Catch To Prevent An JWT Based Error.....
    try {
      decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new ApiError(401, "Token expired");
      }
      throw new ApiError(401, "Unauthorized - Invalid token");
    }

    // Search For The Requested User In The database....
    // Fetch the user from the database using Prisma's findUnique method
    const user = await db.user.findUnique({
      // Specify the condition to find the user by their unique ID
      where: {
        id: decoded.id, // 'decoded.id' comes from the decoded JWT token
      },

      // Select only specific fields to return for the user
      // This limits the data fetched, improving performance and security
      select: {
        id: true, // Include user's ID
        image: true, // Include user's profile image
        name: true, // Include user's name
        email: true, // Include user's email
        role: true, // Include user's role (e.g., admin, user)
      },
    });

    // If The user is not found.....
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error authenticating user:", error);
    throw new ApiError(500, "Error authenticating user");
  }
});
