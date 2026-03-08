const env = require('../config/env.js');

const MIN_LENGTH = 50;
const MAX_LENGTH = env.llmMaxTextLength || 10000;

function validateSummarize(req, res, next) {
  const text = req.body && req.body.text;

  if (text === undefined || text === null) {
    return res.status(400).json({
      success: false,
      message: 'Request body must include "text"',
    });
  }

  if (typeof text !== 'string') {
    return res.status(400).json({
      success: false,
      message: '"text" must be a string',
    });
  }

  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return res.status(400).json({
      success: false,
      message: '"text" cannot be empty',
    });
  }

  if (trimmed.length < MIN_LENGTH) {
    return res.status(400).json({
      success: false,
      message: '"text" is too short (minimum ' + MIN_LENGTH + ' characters)',
    });
  }

  if (trimmed.length > MAX_LENGTH) {
    return res.status(413).json({
      success: false,
      message: '"text" exceeds maximum length (' + MAX_LENGTH + ' characters)',
    });
  }

  req.validatedText = trimmed;
  next();
}

module.exports = {
  validateSummarize,
};
