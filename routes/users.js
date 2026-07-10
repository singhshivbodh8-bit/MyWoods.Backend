const express = require("express");
const router = express.Router();

const {
    
    getUsers,
    getUser,
    updateUser,
    deleteUser,
} = require("../Controller/userController");

const { protect, adminOnly } = require("../middleware/auth");

/**
 * All user routes below require a logged-in user.
 * `router.use(protect)` applies the `protect` middleware to EVERY route
 * defined after it in this file — so you don't have to repeat it.
 */

router.use(protect);
router.get("/", getUsers); // GET    /api/users
router.get("/:id", getUser); // GET    /api/users/:id
router.put("/:id", updateUser); // PUT    /api/users/:id
router.delete("/:id", deleteUser);

module.exports = router;



