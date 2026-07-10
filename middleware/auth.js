const jwt = require("jsonwebtoken");
const User = require("../model/user");

/**
 * "protect" middleware
 * --------------------
 * Put this in front of any route that should require a logged-in user.
 * It looks for a token in the request header:
 *     Authorization: Bearer <token>
 * Then it verifies the token, loads the user, and attaches them to
 * req.user so the next handler knows who is making the request.
 *
 * If there is no valid token, it stops the request with 401 Unauthorized.
 */
const protect = async (req, res, next) => {
  let token;

  // The header looks like: "Bearer eyJhbGciOi..."
  // We check it exists and starts with "Bearer ".
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      // split "Bearer <token>" and take the token part
      token = req.headers.authorization.split(" ")[1];

      // verify the token using our secret; throws if invalid/expired
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      // decoded.id is the user id we put inside the token when signing.
      // Load the user (without the password) and attach to the request.
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ error: "User no longer exists" });
      }

      return next(); // all good — continue to the actual route handler
    } catch (err) {
      return res.status(401).json({ error: "Not authorized, token failed" });
    }
  }

  // no token was provided at all
  return res.status(401).json({ error: "Not authorized, no token" });
};

/**
 * "adminOnly" middleware
 * ----------------------
 * Use AFTER `protect`. Blocks the request unless the logged-in user
 * has role "admin". Handy for things like deleting other users.
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ error: "Admin access required" });
};

module.exports = { protect, adminOnly };