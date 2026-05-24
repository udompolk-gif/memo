const { decodeClientPrincipal, userEmail, displayName, isController, json } = require('../../shared/auth');
const { tableConfigured, listUsers } = require('../../shared/usersTable');
module.exports = async function (context, req) {
  const principal = decodeClientPrincipal(req);
  if (!principal) { context.res = json(401, { message: 'Not authenticated.' }); return; }
  if (!isController(principal)) { context.res = json(403, { message: 'Controller only.' }); return; }
  if (!tableConfigured()) {
    context.res = json(200, { storageConfigured: false, users: [{ email: userEmail(principal), displayName: displayName(principal), role: 'controller', status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), approvedBy: 'SYSTEM' }] }); return;
  }
  const users = await listUsers();
  context.res = json(200, { storageConfigured: true, users });
};
