export const introCookieName = "crue_intro";

const sevenDays = 7 * 24 * 60 * 60 * 1000;

export function hasSeenIntro(value: string | undefined, now = Date.now()) {
  const seenAt = Number(value);
  if (!Number.isFinite(seenAt)) return false;
  return now - seenAt < sevenDays;
}

export function introCookie(now = Date.now()) {
  return `${introCookieName}=${now}; Path=/; SameSite=Lax`;
}

export function clearIntroCookie() {
  return `${introCookieName}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function showIntroForVisit(
  value: string | undefined,
  options: { intro?: boolean; development?: boolean; now?: number } = {},
) {
  if (options.development && options.intro) return true;
  return !hasSeenIntro(value, options.now);
}
