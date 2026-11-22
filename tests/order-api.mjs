import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { createServer } from 'node:http';
import { setTimeout as sleep } from 'node:timers/promises';

const orders = new Map();
let writes = 0;
const database = createServer(async (request, response) => {
  const url = new URL(request.url, 'http://localhost');
  const send = (data, status = 200) => {
    response.writeHead(status, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(data));
  };
  assert.equal(request.headers.apikey, 'synthetic-server-key');
  if (url.pathname === '/rest/v1/products' && request.method === 'GET') {
    return send([{ id: 17, title: 'Test product', price: 125000 }]);
  }
  if (url.pathname === '/rest/v1/orders' && request.method === 'GET') {
    const filter = url.searchParams.get('request_id');
    return send(filter ? (orders.has(filter.slice(3)) ? [{ id: 42 }] : []) : [...orders.values()]);
  }
  if (url.pathname === '/rest/v1/orders' && request.method === 'POST') {
    const raw = [];
    for await (const chunk of request) raw.push(chunk);
    const order = JSON.parse(Buffer.concat(raw).toString());
    if (orders.has(order.request_id)) return send([], 201);
    writes++;
    orders.set(order.request_id, { id: 42, ...order });
    return send([{ id: 42 }], 201);
  }
  return send({ message: 'Unexpected database query' }, 404);
});

(async () => {
  await new Promise(resolve => database.listen(0, '127.0.0.1', resolve));
  const origin = 'http://127.0.0.1:43291';
  const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-H', '127.0.0.1', '-p', '43291'], {
    stdio: ['ignore', 'ignore', 'pipe'],
    windowsHide: true,
    env: {
      ...process.env,
      ADMIN_LOGIN: 'synthetic-admin',
      ADMIN_PASSWORD: 'synthetic-password-for-local-test',
      SUPABASE_URL: 'http://127.0.0.1:' + database.address().port,
      SUPABASE_SECRET_KEY: 'synthetic-server-key',
      TELEGRAM_BOT_TOKEN: '',
      TELEGRAM_CHAT_ID: '',
    },
  });
  let routeLogs = '';
  server.stderr.on('data', data => { routeLogs += data.toString(); });
  try {
    for (let attempt = 0; attempt < 30; attempt++) {
      try { await fetch(origin); break; } catch (error) {
        if (attempt === 29) throw error;
        await sleep(200);
      }
    }
    const post = (path, body, site = origin, cookie) => fetch(origin + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: site, ...(cookie ? { Cookie: cookie } : {}) },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    });
    assert.equal((await fetch(origin + '/api/admin/orders')).status, 401);
    assert.equal((await fetch(origin + '/api/admin/products')).status, 401);
    assert.equal((await post('/api/orders', '{')).status, 400);
    assert.equal((await post('/api/orders', '{}', 'https://other.invalid')).status, 403);
    const login = await post('/api/admin/session', { login: 'synthetic-admin', password: 'synthetic-password-for-local-test' });
    assert.equal(login.status, 200);
    assert.match(login.headers.get('set-cookie'), /HttpOnly/i);
    const cookie = login.headers.get('set-cookie').split(';')[0];
    assert.equal((await post('/api/admin/products', {}, 'https://other.invalid', cookie)).status, 403);
    const base = {
      requestId: randomUUID(),
      name: 'Local Test',
      phone: '+998 90 000 00 00',
      address: '',
      expectedTotal: 250000,
      items: [{ id: 17, quantity: 2, price: 1 }],
    };
    const stale = await post('/api/orders', { ...base, expectedTotal: 1 });
    assert.equal(stale.status, 409);
    assert.equal((await stale.json()).code, 'PRICE_CHANGED');
    assert.equal(writes, 0);
    const created = await post('/api/orders', base);
    assert.equal(created.status, 201);
    assert.equal((await post('/api/orders', base)).status, 200);
    assert.equal(writes, 1);
    assert.equal(orders.get(base.requestId).items[0].price, 125000);
    assert.equal(orders.get(base.requestId).total_amount, 250000);
    const adminOrders = await fetch(origin + '/api/admin/orders', { headers: { Cookie: cookie } });
    assert.equal(adminOrders.status, 200);
    assert.equal(adminOrders.headers.get('Cache-Control'), 'no-store');
    assert.equal((await adminOrders.json()).orders.length, 1);
    console.log('Passed: input validation, same-origin checks, server price, single-write retry, and admin access.');
  } catch (error) {
    if (routeLogs) console.error(routeLogs);
    throw error;
  } finally {
    server.kill();
    database.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
