import { submitText } from '../lib/horde.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    if (!Array.isArray(body.messages) || !body.messages.some(m => m?.role === 'user' && String(m?.content || '').trim())) {
      return res.status(400).json({ error: 'At least one user message is required.' });
    }
    const result = await submitText({
      messages: body.messages,
      model: body.model || 'auto',
      mode: body.mode || 'balanced',
      apiKey: body.hordeApiKey || undefined,
      systemPrompt: body.systemPrompt || 'Be useful, accurate and direct. Clearly distinguish facts from uncertainty.',
      maxTokens: body.maxTokens,
      temperature: body.temperature,
    });
    return res.status(202).json(result);
  } catch (error) {
    const status = Number(error.status) >= 400 && Number(error.status) < 500 ? Number(error.status) : 502;
    return res.status(status).json({ error: error.message || 'Generation submission failed', details: error.data || undefined });
  }
}
