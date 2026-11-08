const MAX_BODY_BYTES = 20000;
const WINDOW_MS = 60000;
const MAX_REQUESTS = 5;

export function createContactHandler({ env = process.env, fetchImpl = globalThis.fetch, now = Date.now, timeoutMs = 10000 } = {}) {
  const requestsByIp = new Map();

  return async function handleContact(request) {
    const origin = request.headers.get('origin');
    const allowedOrigins = (env.ALLOWED_ORIGINS || '').split(',').map(value => value.trim()).filter(Boolean);
    const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', Vary: 'Origin' };
    const respond = (status, body, extra = {}) => new Response(JSON.stringify(body), { status, headers: { ...headers, ...extra } });

    if (!origin || !allowedOrigins.includes(origin)) {
      return respond(403, { success: false, message: 'This website is not allowed to submit messages.' });
    }

    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type';
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (request.method !== 'POST') return respond(405, { success: false, message: 'Use POST to submit a message.' }, { Allow: 'POST, OPTIONS' });
    if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
      return respond(415, { success: false, message: 'Messages must use JSON.' });
    }

    let body;
    try {
      const reader = request.body?.getReader();
      const chunks = [];
      let size = 0;
      if (!reader) return respond(400, { success: false, message: 'A message is required.' });
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > MAX_BODY_BYTES) {
          await reader.cancel();
          return respond(413, { success: false, message: 'Your message is too long.' });
        }
        chunks.push(value);
      }
      const bytes = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
      body = JSON.parse(new TextDecoder().decode(bytes));
    } catch {
      return respond(400, { success: false, message: 'The message could not be read.' });
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return respond(400, { success: false, message: 'Your message is invalid.' });
    }
    if (body._honey) return respond(200, { success: true });

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    if (!name || name.length > 100 || email.length > 254 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) || !message || message.length > 5000) {
      return respond(400, { success: false, message: 'Please check your name, email address, and message.' });
    }

    const key = env.RESEND_API_KEY?.trim();
    const from = env.RESEND_FROM_EMAIL?.trim();
    const recipient = env.CONTACT_TO_EMAIL?.trim();
    if (!key || !from || !recipient) {
      return respond(503, { success: false, message: 'Messaging is temporarily unavailable. Please use Email Me.' });
    }

    // This per-instance limit complements the hosting provider's production firewall.
    const currentTime = now();
    for (const [ip, entry] of requestsByIp) if (entry.until <= currentTime) requestsByIp.delete(ip);
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    const entry = requestsByIp.get(ip);
    if (entry && entry.count >= MAX_REQUESTS) {
      return respond(429, { success: false, message: 'Please wait a minute before sending another message.' }, { 'Retry-After': String(Math.max(1, Math.ceil((entry.until - currentTime) / 1000))) });
    }
    if (requestsByIp.size >= 1000 && !entry) {
      return respond(429, { success: false, message: 'Messaging is busy. Please try again shortly.' }, { 'Retry-After': '60' });
    }
    requestsByIp.set(ip, { count: (entry?.count || 0) + 1, until: entry?.until || currentTime + WINDOW_MS });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          from,
          to: [recipient],
          reply_to: email,
          subject: `Portfolio message from ${name.replace(/[\r\n]+/g, ' ')}`,
          text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || typeof result?.id !== 'string' || !result.id) {
        return respond(502, { success: false, message: "Your message couldn't be sent. Please try again, or use Email Me." });
      }
      return respond(200, { success: true, id: result.id });
    } catch {
      return respond(controller.signal.aborted ? 504 : 502, { success: false, message: "Your message couldn't be sent. Please try again, or use Email Me." });
    } finally {
      clearTimeout(timeout);
    }
  };
}
