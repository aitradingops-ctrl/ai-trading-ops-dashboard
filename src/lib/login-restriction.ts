export const TEMP_ALLOWED_LOGIN_EMAIL = "aitradingops@gmail.com";

export function getAllowedLoginEmail(): string {
  return (process.env.ALLOWED_LOGIN_EMAIL || TEMP_ALLOWED_LOGIN_EMAIL)
    .trim()
    .toLowerCase();
}

export function isAllowedLoginEmail(email?: string | null): boolean {
  return email?.trim().toLowerCase() === getAllowedLoginEmail();
}
