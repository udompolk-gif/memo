const { decodeClientPrincipal, userEmail, isController, json } = require('../../shared/auth');
const { tableConfigured, updateStatus } = require('../../shared/usersTable');
module.exports = async function (context, req) {
  const principal = decodeClientPrincipal(req);
  if (!principal) { context.res = json(401, { message: 'Not authenticated.' }); return; }
  if (!isController(principal)) { context.res = json(403, { message: 'Controller only.' }); return; }
  if (!tableConfigured()) { context.res = json(400, { message: 'Storage is not configured. Set MEMO_STORAGE_CONNECTION_STRING first.' }); return; }
  const body = req.body || {};
  const email = String(body.email || '').trim().toLowerCase();
  const status = String(body.status || '').trim().toLowerCase();
  const role = body.role ? String(body.role).trim().toLowerCase() : undefined;
  if (!email || !['pending','active','rejected','disabled'].includes(status)) { context.res = json(400, { message: 'Invalid email or status.' }); return; }
  const user = await updateStatus(email, status, role, userEmail(principal));
  context.res = json(200, { ok: true, user });
};
