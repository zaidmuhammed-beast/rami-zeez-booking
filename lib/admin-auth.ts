export const ADMIN_COOKIE = "rz_admin_session";

export function isValidAdminCookie(value: string | undefined) {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected) && value === expected;
}
