const express = require("express");
const router = express.Router();

const {
    createWood,
    getWoods,
    getWood,
    updateWood,
    deleteWood,
} = require("../controller/woodController");

const { protect, adminOnly } = require("../middleware/auth");

router.use(protect);
router.post("/", createWood);
router.get("/", getWoods);
router.get("/:id", getWood);
router.put("/:id", updateWood);
router.delete("/:id", deleteWood);

module.exports = router;