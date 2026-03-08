const env = require('../config/env.js');

const OPENAI_CHAT_URL = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_MODEL = 'gpt-4o-mini';

const SUMMARIZE_SYSTEM = `You are a concise summarizer. Summarize the given text in exactly 3-6 bullet points. Each bullet should be one short sentence. Use no preamble or labels—only the bullet list. Maximum ~120 words total.`;

/**
 * Call OpenAI Chat API to summarize text. Returns { summary, model } or throws.
 * @param {string} text - Input text to summarize
 * @returns {Promise<{ summary: string, model: string }>}
 */
async function summarizeWithOpenAI(text) {
  const apiKey = env.openaiApiKey;
  if (!apiKey || typeof apiKey !== 'string' || !apiKey.trim()) {
    const err = new Error('LLM not configured');
    err.code = 'CONFIG';
    throw err;
  }

  const response = await fetch(OPENAI_CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages: [
        { role: 'system', content: SUMMARIZE_SYSTEM },
        { role: 'user', content: text },
      ],
      max_tokens: 300,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const err = new Error(`LLM API error: ${response.status}`);
    err.status = response.status;
    err.code = 'LLM_API';
    let body;
    try {
      body = await response.json();
      err.details = body.error?.message || body;
    } catch {
      err.details = await response.text();
    }
    throw err;
  }

  const data = await response.json();
  const choice = data.choices?.[0];
  const content = choice?.message?.content?.trim();

  if (!content) {
    const err = new Error('Empty response from LLM');
    err.code = 'LLM_EMPTY';
    throw err;
  }

  return {
    summary: content,
    model: data.model || DEFAULT_MODEL,
  };
}

module.exports = {
  summarizeWithOpenAI,
  DEFAULT_MODEL,
};
