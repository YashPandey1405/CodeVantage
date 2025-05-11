// Exporting a function named getCookieOptions
// This function returns an object containing configuration options for setting a cookie
export const getCookieOptions = () => ({
  // httpOnly ensures the cookie cannot be accessed via client-side JavaScript (helps prevent XSS attacks)
  httpOnly: true,

  // sameSite set to "strict" prevents the browser from sending this cookie along with cross-site requests
  // This helps protect against CSRF attacks
  sameSite: "strict",

  // secure flag ensures the cookie is only sent over HTTPS connections
  // It is set to true when the environment is not "development"
  secure: process.env.NODE_ENV !== "development",

  // maxAge sets the cookie’s expiration time in milliseconds
  // It converts the JWT_TOKEN_EXPIRY environment variable to a number
  maxAge: 1000 * 60 * 60 * 24 * 7,
});
