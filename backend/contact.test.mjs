import assert from 'node:assert/strict';
import test from 'node:test';
import { createContactHandler } from './contact.mjs';

const origin = 'https://hanielcoquillajr16-spec.github.io';
const env = { ALLOWED_ORIGINS: origin, RESEND_API_KEY: 're_mock_key_not_real', RESEND_FROM_EMAIL: 'Portfolio <contact@example.com>', CONTACT_TO_EMAIL: 'owner@example.com' };
const fixture = { name: 'Portfolio visitor', email: 'visitor@example.com', message: 'I would like to discuss a web development project.' };
const request = (body = fixture, options = {}) => new Request('https://backend.example.com/api/contact', {
  method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify(body), ...options,
});
const accepted = async () => new Response(JSON.stringify({ id: 'test-email-id' }), { status: 200 });

test('CORS preflight accepts the configured GitHub Pages origin', async () => {
  const response = await createContactHandler({ env })(request(undefined, { method: 'OPTIONS', body: undefined }));
  assert.equal(response.status, 204);
  assert.equal(response.headers.get('access-control-allow-origin'), origin);
  assert.equal(response.headers.get('access-control-allow-methods'), 'POST, OPTIONS');
});

test('unapproved origins and unsupported methods cannot send email', async () => {
  const handler = createContactHandler({ env, fetchImpl: () => assert.fail('No email should be sent') });
  const blocked = await handler(request(fixture, { headers: { Origin: 'https://other.example.com', 'Content-Type': 'application/json' } }));
  assert.equal(blocked.status, 403);
  assert.equal(blocked.headers.get('access-control-allow-origin'), null);
  assert.equal((await handler(request(undefined, { method: 'GET', body: undefined }))).status, 405);
});

test('missing credentials return unavailable rather than a false success', async () => {
  const response = await createContactHandler({ env: { ALLOWED_ORIGINS: origin }, fetchImpl: () => assert.fail('No email should be sent') })(request());
  assert.equal(response.status, 503);
  assert.equal((await response.json()).success, false);
});

test('server validates email, required values, JSON, body size, and content type', async () => {
  const handler = createContactHandler({ env, fetchImpl: () => assert.fail('Invalid input should not send email') });
  for (const body of [{ ...fixture, email: 'invalid' }, { ...fixture, name: '   ' }, { ...fixture, message: '' }, { ...fixture, message: 'x'.repeat(5001) }, null, []]) {
    assert.equal((await handler(request(body))).status, 400);
  }
  assert.equal((await handler(request(fixture, { body: '{invalid' }))).status, 400);
  assert.equal((await handler(request(fixture, { body: 'x'.repeat(20001) }))).status, 413);
  assert.equal((await handler(request(fixture, { headers: { Origin: origin, 'Content-Type': 'text/plain' } }))).status, 415);
});

test('honeypot submissions do not call Resend', async () => {
  const response = await createContactHandler({ env, fetchImpl: () => assert.fail('Honeypot should prevent sending') })(request({ ...fixture, _honey: 'bot' }));
  assert.equal(response.status, 200);
});

test('only the configured recipient and sender are used; visitor email becomes Reply-To', async () => {
  let sent;
  const handler = createContactHandler({ env, fetchImpl: async (url, options) => { sent = { url, ...options }; return accepted(); } });
  const response = await handler(request({ ...fixture, name: '  Portfolio\nvisitor  ', from: 'spoof@example.com', to: 'another@example.com', _replyto: 'spoof@example.com' }));
  assert.equal(response.status, 200);
  assert.equal(sent.url, 'https://api.resend.com/emails');
  assert.equal(sent.headers.Authorization, `Bearer ${env.RESEND_API_KEY}`);
  const payload = JSON.parse(sent.body);
  assert.equal(payload.from, env.RESEND_FROM_EMAIL);
  assert.deepEqual(payload.to, [env.CONTACT_TO_EMAIL]);
  assert.equal(payload.reply_to, fixture.email);
  assert.equal(payload.subject, 'Portfolio message from Portfolio visitor');
  assert.ok(payload.text.includes(fixture.message));
  assert.equal(payload.html, undefined, 'Visitor text is not treated as HTML');
  assert.deepEqual(await response.json(), { success: true, id: 'test-email-id' });
});

test('Resend failures do not expose provider errors or credentials', async () => {
  for (const status of [200, 403, 429, 500]) {
    const handler = createContactHandler({ env, fetchImpl: async () => new Response(JSON.stringify({ message: `Private provider detail ${env.RESEND_API_KEY}` }), { status }) });
    const response = await handler(request());
    assert.equal(response.status, 502);
    assert.ok(!(await response.text()).includes(env.RESEND_API_KEY));
  }
});

test('network failure and timeout return an actionable failure', async () => {
  const offline = createContactHandler({ env, fetchImpl: async () => { throw new Error('offline'); } });
  assert.equal((await offline(request())).status, 502);
  const timedOut = createContactHandler({ env, timeoutMs: 5, fetchImpl: async (_url, options) => new Promise((_resolve, reject) => options.signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true })) });
  assert.equal((await timedOut(request())).status, 504);
});

test('per-instance rate limit expires and does not keep sending after its limit', async () => {
  let time = 0;
  let sends = 0;
  const handler = createContactHandler({ env, now: () => time, fetchImpl: async () => { sends++; return accepted(); } });
  for (let index = 0; index < 5; index++) assert.equal((await handler(request())).status, 200);
  const limited = await handler(request());
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get('retry-after'), '60');
  assert.equal(sends, 5);
  time = 60001;
  assert.equal((await handler(request())).status, 200);
  assert.equal(sends, 6);
});
