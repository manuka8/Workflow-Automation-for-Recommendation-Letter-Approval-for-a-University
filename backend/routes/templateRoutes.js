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

module.exports = router;