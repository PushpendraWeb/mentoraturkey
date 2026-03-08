const express = require('express');
const rateLimit = require('express-rate-limit');
const { summarize } = require('../../controllers/llm.controller.js');
const { validateSummarize } = require('../../validation/llm.validation.js');

const router = express.Router();

const summarizerLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many summarization requests; try again in a minute.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/summarize', summarizerLimiter, validateSummarize, summarize);

module.exports = router;
