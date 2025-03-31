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

const Template = require("../models/Template");

router.post("/create-template", async (req, res) => {
  try {
    const { templateName, type, duplicateSubmissionAllowed, questions, hierarchy } =
      req.body;

    if (!templateName || !type || !questions.length || !hierarchy.length) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    const existingTemplate = await Template.findOne({ templateName });
    if (existingTemplate) {
      return res.status(400).json({ message: "Template name must be unique" });
    }

    const template = new Template({
      templateName,
      type,
      duplicateSubmissionAllowed,
      questions,
      hierarchy,
    });

    await template.save();
    res
      .status(201)
      .json({
        message: "Template created successfully",
        templateId: template._id,
      });
  } catch (error) {
    console.error("Error creating template:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
