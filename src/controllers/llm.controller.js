const { summarizeWithOpenAI } = require('../services/llm.service.js');

/**
 * POST /llm/summarize
 * Request: { text: "..." }
 * Response: { summary: "...", model: "..." }
 */
async function summarize(req, res) {
  try {
    const text = req.validatedText;
    const result = await summarizeWithOpenAI(text);
    return res.status(200).json({
      success: true,
      summary: result.summary,
      model: result.model,
    });
  } catch (err) {
    if (err.code === 'CONFIG') {
      return res.status(503).json({
        success: false,
        message: 'Summarization is not configured. Set OPENAI_API_KEY.',
      });
    }
    if (err.code === 'LLM_API') {
      const status = err.status >= 400 && err.status < 600 ? err.status : 502;
      return res.status(status).json({
        success: false,
        message: 'Summarization service error',
        error: err.details?.message || err.details || err.message,
      });
    }
    if (err.code === 'LLM_EMPTY') {
      return res.status(502).json({
        success: false,
        message: 'Summarization returned no content',
      });
    }
    console.error('LLM summarize error:', err);
    return res.status(500).json({
      success: false,
      message: 'Summarization failed',
      error: err.message,
    });
  }
}

module.exports = {
  summarize,
};
