export const NEW_USER_CUTOFF = "2026-04-20T00:00:00.000Z";

export function isNewUserGateEnabled() {
  return process.env.ENABLE_NEW_USER_GATE === "true";
}

export function isBlockedNewUser(createdAt: string | null | undefined) {
  if (!isNewUserGateEnabled()) return false;
  if (!createdAt) return false;
  return new Date(createdAt) >= new Date(NEW_USER_CUTOFF);
}
