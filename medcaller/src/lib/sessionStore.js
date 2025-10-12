// A temporary in-memory session store (per call SID)
const sessions = new Map();

export function setSession(callSid, data) {
  sessions.set(callSid, { ...(sessions.get(callSid) || {}), ...data });
}

export function getSession(callSid) {
  return sessions.get(callSid);
}

export function clearSession(callSid) {
  sessions.delete(callSid);
}
