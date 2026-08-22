const HORDE = 'https://aihorde.net/api/v2';
const ANON_KEY = '0000000000';
const CLIENT_AGENT = 'NexalAI:1.0:mbusoP01';

export const preferredPatterns = [
  { re: /skyfall/i, bonus: 120, label: 'Skyfall' },
  { re: /cydonia/i, bonus: 112, label: 'Cydonia' },
  { re: /behemoth/i, bonus: 106, label: 'Behemoth' },
  { re: /drummer/i, bonus: 85, label: 'TheDrummer' },
  { re: /magnum|mag-mell/i, bonus: 68, label: 'Magnum' },
  { re: /heretic|abliterat|uncensor|derestrict/i, bonus: 62, label: 'Low-refusal' },
  { re: /llama.?3|qwen|mistral|gemma/i, bonus: 20, label: 'General' },
];

export function headers(apiKey) {
  return {
    'Content-Type': 'application/json',
    'Client-Agent': CLIENT_AGENT,
    'apikey': apiKey || process.env.AI_HORDE_API_KEY || ANON_KEY,
  };
}

export async function hordeFetch(path, options = {}, timeoutMs = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${HORDE}${path}`, {
      ...options,
      signal: controller.signal,
      headers: { 'Client-Agent': CLIENT_AGENT, ...(options.headers || {}) },
    });
    const text = await response.text();
    let data;
    try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }
    if (!response.ok) {
      const message = data?.message || data?.error || `AI Horde returned ${response.status}`;
      const error = new Error(typeof message === 'string' ? message : JSON.stringify(message));
      error.status = response.status;
      error.data = data;
      throw error;
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
}

export async function getLiveModels() {
  const models = await hordeFetch('/status/models?type=text');
  return Array.isArray(models) ? models : [];
}

export function modelScore(model) {
  const name = String(model?.name || '');
  const workers = Number(model?.count ?? model?.workers ?? 0);
  const queued = Number(model?.queued ?? 0);
  const jobs = Number(model?.jobs ?? 0);
  const eta = Number(model?.eta ?? 9999);
  const performance = Number(model?.performance ?? 0);
  let score = workers * 22 + Math.min(performance, 100) * 1.8 - Math.min(eta, 600) * 0.65 - jobs * 2 - queued / 1000;
  let family = 'Community';
  for (const p of preferredPatterns) {
    if (p.re.test(name)) { score += p.bonus; family = p.label; break; }
  }
  if (workers < 1) score -= 1000;
  return { score, family, workers, queued, jobs, eta, performance };
}

export function rankModels(models) {
  return models
    .map(m => ({ ...m, ...modelScore(m) }))
    .filter(m => m.workers > 0)
    .sort((a, b) => b.score - a.score);
}

export function chooseModel(models, requested = 'auto', mode = 'balanced') {
  const ranked = rankModels(models);
  if (!ranked.length) throw new Error('No AI Horde text workers are online right now.');
  if (requested && requested !== 'auto') {
    const exact = ranked.find(m => m.name === requested);
    if (exact) return exact;
  }
  if (mode === 'fast') {
    return [...ranked].sort((a,b) => (a.eta - b.eta) || (b.performance - a.performance) || (b.workers - a.workers))[0];
  }
  if (mode === 'large') {
    const large = ranked.filter(m => /123b|70b|72b|65b|behemoth/i.test(m.name));
    if (large.length) return large[0];
  }
  if (mode === 'low-refusal') {
    const low = ranked.filter(m => /skyfall|cydonia|drummer|heretic|abliterat|uncensor|derestrict/i.test(m.name));
    if (low.length) return low[0];
  }
  return ranked[0];
}

export function formatMessages(messages = [], systemPrompt = '') {
  const clean = Array.isArray(messages) ? messages.slice(-30) : [];
  const parts = [];
  if (systemPrompt?.trim()) parts.push(`### System:\n${systemPrompt.trim()}`);
  for (const msg of clean) {
    const role = msg?.role === 'assistant' ? 'Assistant' : msg?.role === 'system' ? 'System' : 'User';
    const content = String(msg?.content || '').trim();
    if (content) parts.push(`### ${role}:\n${content}`);
  }
  parts.push('### Assistant:\n');
  return parts.join('\n\n');
}

export async function submitText({ messages, model, mode, apiKey, systemPrompt, maxTokens = 500, temperature = 0.75 }) {
  const live = await getLiveModels();
  const chosen = chooseModel(live, model, mode);
  const prompt = formatMessages(messages, systemPrompt);
  const payload = {
    prompt,
    params: {
      n: 1,
      max_length: Math.max(32, Math.min(Number(maxTokens) || 500, 1200)),
      max_context_length: 4096,
      temperature: Math.max(0.05, Math.min(Number(temperature) || 0.75, 1.5)),
      top_p: 0.92,
      top_k: 0,
      rep_pen: 1.08,
      rep_pen_range: 1024,
      frmtadsnsp: false,
      frmtrmblln: false,
      frmtrmspch: false,
      frmttriminc: false
    },
    models: [chosen.name],
    trusted_workers: false,
    slow_workers: true
  };
  const result = await hordeFetch('/generate/text/async', {
    method: 'POST',
    headers: headers(apiKey),
    body: JSON.stringify(payload),
  }, 15000);
  if (!result?.id) throw new Error(result?.message || 'AI Horde did not return a generation ID.');
  return { jobId: result.id, model: chosen, warnings: result.warnings || [] };
}

export async function getTextJob(id) {
  return hordeFetch(`/generate/text/status/${encodeURIComponent(id)}`, {}, 12000);
}

export async function cancelTextJob(id) {
  return hordeFetch(`/generate/text/status/${encodeURIComponent(id)}`, { method: 'DELETE' }, 12000);
}

export async function getHealth() {
  const [heartbeat, performance] = await Promise.all([
    hordeFetch('/status/heartbeat').catch(() => ({ ok: false })),
    hordeFetch('/status/performance').catch(() => ({})),
  ]);
  return { heartbeat, performance };
}
