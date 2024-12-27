const express = require('express');
const router = express.Router();
const Submitted = require('../models/Submitted');
const Template = require('../models/Template');

router.post('/', async (req, res) => {
  try {
    const { userId, templateId, hierarchy, questions } = req.body;

    if (!userId || !templateId || !questions) {
      return res.status(400).json({ message: 'User ID, template ID, and questions are required.' });
    }

    const template = await Template.findById(templateId);
    if (!template) {
      return res.status(404).json({ message: 'Template not found.' });
    }

    const existingSubmission = await Submitted.findOne({ userId, templateId });
    if (existingSubmission) {
      return res.status(400).json({ message: 'You have already submitted this form.' });
    }

    const processedQuestions = questions.map((q) => {
      if (!q.question) {
        throw new Error('Each question must include a question text.');
      }
      if (!template.questions.find((tq) => tq.question === q.question)) {
        throw new Error(`Question "${q.question}" is not part of the template.`);
      }
      return {
        ...q,
        answer: Array.isArray(q.answer) ? q.answer : q.answer || '', 
      };
    });

    const submission = new Submitted({
      userId,
      templateId,
      hierarchy: template.hierarchy, 
      questions: processedQuestions, 
    });

    await submission.save();

    res.status(201).json({
      message: 'Submission saved successfully.',
      submissionId: submission._id, 
    });
  } catch (err) {
    console.error('Error saving submission:', err.message);
    res.status(500).json({
      message: 'Failed to save submission.',
      error: err.message,
    });
  }
});



module.exports = router;