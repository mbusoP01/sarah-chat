import { getLiveModels, rankModels } from '../lib/horde.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const ranked = rankModels(await getLiveModels());
    res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=30');
    return res.status(200).json({
      updatedAt: new Date().toISOString(),
      total: ranked.length,
      models: ranked.slice(0, 40).map(m => ({
        name: m.name, family: m.family, workers: m.workers, queued: m.queued,
        jobs: m.jobs, eta: m.eta, performance: m.performance, score: Math.round(m.score)
      }))
    });
  } catch (error) {
    return res.status(502).json({ error: error.message || 'Unable to load Horde models' });
  }
}
