const COMPLIMENTARY_ACCESS_FLAG = "complimentary_access";

function getComplimentaryAccessEmails() {
  return new Set(
    (process.env.COMPLIMENTARY_ACCESS_EMAILS ?? "")
      .split(/[\n,;]+/)
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isComplimentaryAccessEligible(
  email: string | null | undefined,
) {
  if (!email) {
    return false;
  }

  return getComplimentaryAccessEmails().has(email.trim().toLowerCase());
}

export function hasComplimentaryAccess(
  team: { flags?: string[] | null } | null | undefined,
) {
  return (team?.flags ?? []).includes(COMPLIMENTARY_ACCESS_FLAG);
}

export function addComplimentaryAccessFlag(flags?: string[] | null) {
  return Array.from(new Set([...(flags ?? []), COMPLIMENTARY_ACCESS_FLAG]));
}
