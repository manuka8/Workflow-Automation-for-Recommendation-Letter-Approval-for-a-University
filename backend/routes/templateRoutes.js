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

router.post("/:id/format", async (req, res) => {
    try {
      const { id } = req.params;
      const { questions } = req.body;
  
      if (!questions || !Array.isArray(questions) || questions.length === 0) {
        return res
          .status(400)
          .json({ message: "Questions are required and must be an array." });
      }
  
      for (const question of questions) {
        if (!question.question || !question.answerType) {
          return res
            .status(400)
            .json({
              message: "Each question must have a question text and answerType.",
            });
        }
      }
  
      const template = await Template.findByIdAndUpdate(
        id,
        { questions },
        { new: true }
      );
  
      if (!template) {
        return res.status(404).json({ message: "Template not found." });
      }
  
      res.status(200).json({
        message: "Template format defined successfully.",
        updatedTemplate: template,
      });
    } catch (error) {
      console.error("Error updating template format:", error);
      res
        .status(500)
        .json({ message: "Failed to define format.", error: error.message });
    }
  });
  

module.exports = router;
