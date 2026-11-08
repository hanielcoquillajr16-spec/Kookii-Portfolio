import { createServer } from 'node:http';
import { createContactHandler } from './contact.mjs';

const port = Number(process.env.CONTACT_API_PORT || 3001);
const handleContact = createContactHandler();
const server = createServer(async (incoming, outgoing) => {
  try {
    const url = new URL(incoming.url || '/', `http://127.0.0.1:${port}`);
    if (url.pathname !== '/api/contact') {
      outgoing.writeHead(404, { 'Content-Type': 'application/json' });
      outgoing.end(JSON.stringify({ success: false, message: 'Not found.' }));
      return;
    }
    const headers = new Headers();
    for (const [name, value] of Object.entries(incoming.headers)) if (value) headers.set(name, Array.isArray(value) ? value.join(', ') : value);
    const method = incoming.method || 'GET';
    const request = new Request(url, { method, headers, ...(!['GET', 'HEAD'].includes(method) ? { body: incoming, duplex: 'half' } : {}) });
    const response = await handleContact(request);
    outgoing.writeHead(response.status, Object.fromEntries(response.headers));
    outgoing.end(Buffer.from(await response.arrayBuffer()));
  } catch {
    outgoing.writeHead(500, { 'Content-Type': 'application/json' });
    outgoing.end(JSON.stringify({ success: false, message: 'Messaging is temporarily unavailable.' }));
  }
});

server.listen(port, '127.0.0.1', () => console.log(`Contact backend: http://127.0.0.1:${port}/api/contact`));
