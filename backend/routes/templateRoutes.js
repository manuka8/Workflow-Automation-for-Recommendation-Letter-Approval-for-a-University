const express = require("express");
const router = express.Router();
const Submitted = require("../models/Submitted");
const Template = require("../models/Template");

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

router.post("/findalltemplates", async (req, res) => {
  const { userID, userType } = req.body;

  try {
    const submittedTemplates = await Submitted.find(
      { userId: userID },
      "templateId"
    );
    const submittedTemplateIds = submittedTemplates.map(
      (doc) => doc.templateId
    );

    let templates = await Template.find();

    if (userType === "Students") {
      const submittedTemplates = await Submitted.find(
        { userId: userID },
        "templateId"
      );
      const submittedTemplateIds = submittedTemplates.map(
        (doc) => doc.templateId
      );

      let templates = await Template.find();
      templates = templates.filter(
        (template) =>
          (template.type === "Students" ||  template.type === "BothStuandAcedamicStff" || template.type ==="all") &&
          !submittedTemplateIds.includes(template._id.toString())
      );
    } else if (userType === "Staff") {
      templates = templates.filter(
        (template) =>
          (template.type === "Staff" || template.type === "BothStuandStaff" || template.type === "Bothnonandacademic" || template.type ==="all") &&
          !submittedTemplateIds.includes(template._id.toString())
      );
    }else if (userType === "NonAcademicStaff"){
      templates = templates.filter(
        (template) =>
          (template.type === "NonAcademicStaff" || template.type === "Bothnonandacademic" || template.type ==="all") &&
          !submittedTemplateIds.includes(template._id.toString())
      );
    }

    res.status(200).json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).json({ message: "Failed to fetch templates." });
  }
});
router.post("/findalltemplates/admin", async (req, res) => {
  const { userID, userType } = req.body;
  try {
    let templates = await Template.find();
    res.status(200).json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).json({ message: "Failed to fetch templates." });
  }
});

router.get("/findalltemplates/:id", async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) return res.status(404).send("Template not found");
    res.json(template);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

router.get("/:templateId/hierarchy", async (req, res) => {
  try {
    const { templateId } = req.params;
    const template = await Template.findById(templateId);

    if (!template) {
      return res.status(404).json({ message: "Template not found." });
    }

    res.status(200).json({ hierarchy: template.hierarchy });
  } catch (error) {
    console.error("Error fetching hierarchy:", error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch hierarchy.", error: error.message });
  }
});

router.get("/findtemplates/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const template = await Template.findById(id);
    if (!template) return res.status(404).json({ message: "Template not found" });

    const submissions = await Submitted.find({ templateId: id }).sort({ submittedAt: -1 });

    const canEditOrDelete =
      submissions.length === 0 ||
      (submissions.length > 0 &&
        new Date(submissions[0].submittedAt) < new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000));

    res.json({ template, canEditOrDelete });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/edittemplates/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { templateName, type, duplicateSubmissionAllowed, questions } = req.body;

    const submissions = await Submitted.find({ templateId: id });
    const canEditOrDelete =
      submissions.length === 0 ||
      (submissions.length > 0 &&
        new Date(submissions[0].submittedAt) < new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000));

    if (!canEditOrDelete) {
      return res.status(403).json({ message: "Cannot edit this template." });
    }

    const updatedTemplate = await Template.findByIdAndUpdate(
      id,
      { templateName, type, duplicateSubmissionAllowed, questions },
      { new: true }
    );

    res.json(updatedTemplate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/deletetemplate/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const submissions = await Submitted.find({ templateId: id });
    const canEditOrDelete =
      submissions.length === 0 ||
      (submissions.length > 0 &&
        new Date(submissions[0].submittedAt) < new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000));

    if (!canEditOrDelete) {
      return res.status(403).json({ message: "Cannot delete this template." });
    }

    await Template.findByIdAndDelete(id);
    res.json({ message: "Template deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/check-submissions/:templateId', async (req, res) => {
  try {
    const count = await Submitted.countDocuments({ templateId: req.params.templateId });
    res.json({ hasSubmissions: count > 0 });
  } catch (err) {
    res.status(500).json({ message: 'Error checking submissions' });
  }
});

module.exports = router;
