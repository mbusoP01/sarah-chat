import { cancelTextJob, getTextJob } from '../lib/horde.js';

export default async function handler(req, res) {
  const id = String(req.query?.id || '').trim();
  if (!id) return res.status(400).json({ error: 'Missing job id.' });
  try {
    if (req.method === 'DELETE') {
      const data = await cancelTextJob(id);
      return res.status(200).json({ cancelled: true, data });
    }
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    const data = await getTextJob(id);
    const generation = Array.isArray(data.generations) ? data.generations[0] : null;
    return res.status(200).json({
      done: Boolean(data.done),
      faulted: Boolean(data.faulted),
      waitTime: data.wait_time ?? null,
      queuePosition: data.queue_position ?? null,
      waiting: data.waiting ?? null,
      processing: data.processing ?? null,
      finished: data.finished ?? null,
      kudos: data.kudos ?? null,
      response: generation?.text || null,
      model: generation?.model || null,
      worker: generation?.worker_name || null,
      rawState: generation?.state || null
    });
  } catch (error) {
    const status = Number(error.status) >= 400 && Number(error.status) < 500 ? Number(error.status) : 502;
    return res.status(status).json({ error: error.message || 'Unable to read generation status' });
  }
}
