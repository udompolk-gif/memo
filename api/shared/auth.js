function decodeClientPrincipal(req) {
  const raw = req.headers['x-ms-client-principal'];
  if (!raw) return null;
  try {
    const json = Buffer.from(raw, 'base64').toString('utf8');
    return JSON.parse(json);
  } catch (err) { return null; }
}
function claim(principal, names) {
  if (!principal || !Array.isArray(principal.claims)) return '';
  const list = Array.isArray(names) ? names : [names];
  const item = principal.claims.find(c => list.includes(c.typ) || list.includes(c.type));
  return item ? String(item.val || item.value || '') : '';
}
function userEmail(principal) {
  return String(
    claim(principal, ['preferred_username','emails','email','upn','http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']) ||
    principal?.userDetails || principal?.userId || ''
  ).trim().toLowerCase();
}
function displayName(principal) {
  return String(claim(principal, ['name','http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']) || principal?.userDetails || userEmail(principal) || 'Azure User').trim();
}
function csv(name) { return String(process.env[name] || '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean); }
function emailLocalPart(email) { return String(email || '').split('@')[0].toLowerCase(); }
function isController(principal) {
  const email = userEmail(principal);
  const local = emailLocalPart(email);
  const controllerEmails = csv('CONTROLLER_EMAILS');
  const controllerUsers = csv('CONTROLLER_USERNAMES');
  return controllerEmails.includes(email) || controllerUsers.includes(local) || controllerUsers.includes('udompol.k') && local === 'udompol.k';
}
function allowedDomain(email) {
  const domains = csv('ALLOWED_EMAIL_DOMAINS');
  if (!domains.length) return true;
  return domains.some(d => email.endsWith('@' + d.replace(/^@/, '')));
}
function json(status, body) {
  return { status, headers: { 'Content-Type': 'application/json; charset=utf-8' }, body };
}
module.exports = { decodeClientPrincipal, userEmail, displayName, isController, allowedDomain, json };
