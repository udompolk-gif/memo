const { TableClient, AzureNamedKeyCredential } = require('@azure/data-tables');
const TABLE_NAME = process.env.MEMO_USERS_TABLE || 'MemoUsers';
function safeRowKey(email) { return Buffer.from(String(email || '').toLowerCase()).toString('base64url'); }
function tableConfigured() { return !!(process.env.MEMO_STORAGE_CONNECTION_STRING || process.env.AzureWebJobsStorage); }
function client() {
  const conn = process.env.MEMO_STORAGE_CONNECTION_STRING || process.env.AzureWebJobsStorage;
  if (!conn) return null;
  return TableClient.fromConnectionString(conn, TABLE_NAME, { allowInsecureConnection: false });
}
async function ensureTable() {
  const c = client();
  if (!c) return null;
  try { await c.createTable(); } catch (err) { if (err.statusCode !== 409) throw err; }
  return c;
}
function cleanEntity(e) {
  if (!e) return null;
  return {
    email: e.email,
    username: e.username || e.email,
    displayName: e.displayName || e.email,
    role: e.role || 'member',
    status: e.status || 'pending',
    createdAt: e.createdAt || '',
    updatedAt: e.updatedAt || '',
    approvedBy: e.approvedBy || '',
    approvedAt: e.approvedAt || ''
  };
}
async function getUser(email) {
  const c = await ensureTable();
  if (!c) return null;
  try { return cleanEntity(await c.getEntity('USER', safeRowKey(email))); }
  catch (err) { if (err.statusCode === 404) return null; throw err; }
}
async function upsertUser(user) {
  const c = await ensureTable();
  if (!c) return null;
  const now = new Date().toISOString();
  const entity = {
    partitionKey: 'USER', rowKey: safeRowKey(user.email),
    email: String(user.email || '').toLowerCase(),
    username: user.username || user.email,
    displayName: user.displayName || user.email,
    role: user.role || 'member', status: user.status || 'pending',
    createdAt: user.createdAt || now, updatedAt: now,
    approvedBy: user.approvedBy || '', approvedAt: user.approvedAt || ''
  };
  await c.upsertEntity(entity, 'Merge');
  return cleanEntity(entity);
}
async function listUsers() {
  const c = await ensureTable();
  if (!c) return [];
  const out = [];
  for await (const e of c.listEntities({ queryOptions: { filter: `PartitionKey eq 'USER'` } })) out.push(cleanEntity(e));
  return out;
}
async function updateStatus(email, status, role, approvedBy) {
  const existing = await getUser(email);
  if (!existing) throw new Error('User not found: ' + email);
  const now = new Date().toISOString();
  return upsertUser({ ...existing, status, role: role || existing.role, approvedBy, approvedAt: status === 'active' ? now : existing.approvedAt, updatedAt: now });
}
module.exports = { tableConfigured, getUser, upsertUser, listUsers, updateStatus };
