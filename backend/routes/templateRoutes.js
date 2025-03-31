const express = require("express");
const router = express.Router();
const Staff = require("../models/Staff");

router.get("/positions", async (req, res) => {
  try {
    const positions = await Staff.distinct("position"); 
    res.status(200).json(positions);
  } catch (error) {
    console.error("Error fetching positions:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
