const User = require("../model/user");
const jwt = require("jsonwebtoken");

/**
 * Helper: create a signed JWT (JSON Web Token) for a given user id.
 * The token is what the client sends back on future requests to prove
 * "I am logged in". It expires after 7 days.
 * process.env.JWT_SECRET is the secret key used to sign it — keep it private.
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
};

/**
 * REGISTER a new user
 * Route:  POST /api/auth/register
 * Body:   { name, email, password }
 * Returns the created user's basic info plus a token so they're
 * immediately "logged in" after signing up.
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // basic validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "name, email and password are all required" });
    }

    // make sure this email isn't already taken
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    // create the user (password gets hashed automatically by the model hook)
    const user = await User.create({ name, email, password });

    // respond with safe fields only (never send the password back)
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * LOGIN an existing user
 * Route:  POST /api/auth/login
 * Body:   { email, password }
 * Verifies the email + password, and returns a token if correct.
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "email and password are required" });
    }

    // We must explicitly ask for the password with .select("+password")
    // because the model hides it by default.
    const user = await User.findOne({ email }).select("+password");

    // Use one generic message for both "no user" and "wrong password"
    // so attackers can't tell which emails exist.
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET the currently logged-in user's profile
 * Route:  GET /api/auth/me   (protected)
 * The `protect` middleware attaches req.user, so we just return it.
 */
exports.getMe = async (req, res) => {
  res.status(200).json(req.user);
};