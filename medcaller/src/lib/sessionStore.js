// A temporary in-memory session store (per call SID)
const sessions = new Map();

export function setSession(callSid, data) {
  const current = sessions.get(callSid) || {
    stage: "intro",          // default starting point
    available: null,         // whether the doctor is available (1 or 0)
    takesInsurance: null,    // whether they take the insurance (1 or 0)
    doctorFound: false       // final flag
  };

  // Merge the new data into the current session
  const updated = { ...current, ...data };

  // Automatically set doctorFound if both conditions are true
  if (updated.available === true && updated.takesInsurance === true) {
    updated.doctorFound = true;
  }

  sessions.set(callSid, updated);
}

export function getSession(callSid) {
  return sessions.get(callSid);
}

export function clearSession(callSid) {
  sessions.delete(callSid);
}

export function getAllSessions() {
  return Object.fromEntries(sessions);
}