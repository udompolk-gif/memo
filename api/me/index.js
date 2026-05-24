const { decodeClientPrincipal, userEmail, displayName, isController, json } = require('../shared/auth');
module.exports = async function (context, req) {
  const principal = decodeClientPrincipal(req);
  if (!principal) { context.res = json(401, { message: 'Not authenticated by Azure Static Web Apps.' }); return; }
  context.res = json(200, { principal, email: userEmail(principal), displayName: displayName(principal), isController: isController(principal) });
};
