const express = require('express');
const router = express.Router();
const Template = require('../models/Template'); 

router.post('/create-template', async (req, res) => {
  try {
    const { templateName, type, hierarchy } = req.body;

    if (!templateName || !type || !hierarchy || !Array.isArray(hierarchy)) {
      return res.status(400).json({
        message: 'Template name, type, and hierarchy are required, and hierarchy must be an array.',
      });
    }

    if (!['Students', 'Staff'].includes(type)) {
      return res.status(400).json({
        message: 'Invalid type. Allowed values are "Students" or "Staff".',
      });
    }

    const template = new Template({ templateName, type, hierarchy });

    await template.save();

    res.status(201).json({ templateId: template.templateId });
  } catch (error) {
    console.error('Error in /create-template:', error.message);

    if (error.code === 11000) {
      return res.status(400).json({ message: 'Template name must be unique.' });
    }

    res.status(500).json({ message: 'Failed to create template.' });
  }
});

router.post('/:id/format', async (req, res) => {
  try {
    const { id } = req.params;
    const { questions } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Questions are required and must be an array.' });
    }

    for (const question of questions) {
      if (!question.question || !question.answerType) {
        return res
          .status(400)
          .json({ message: 'Each question must have a question text and answerType.' });
      }
    }

    
    const template = await Template.findOneAndUpdate(
      { templateId: id }, 
      { questions }, 
      { new: true } 
    );

    if (!template) {
      return res.status(404).json({ message: 'Template not found.' });
    }

    res.status(200).json({
      message: 'Template format defined successfully.',
      updatedTemplate: template,
    });
  } catch (error) {
    console.error('Error updating template format:', error);
    res.status(500).json({ message: 'Failed to define format.', error: error.message });
  }
});

module.exports = router;