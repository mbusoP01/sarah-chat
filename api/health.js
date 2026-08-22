import { getHealth, getLiveModels, rankModels } from '../lib/horde.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const [health, models] = await Promise.all([getHealth(), getLiveModels()]);
    const ranked = rankModels(models);
    return res.status(200).json({
      ok: ranked.length > 0,
      activeTextModels: ranked.length,
      bestModel: ranked[0]?.name || null,
      horde: health,
      checkedAt: new Date().toISOString()
    });
  } catch (error) {
    return res.status(502).json({ ok: false, error: error.message });
  }
}
