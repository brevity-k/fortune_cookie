// Google Analytics 4 event tracking helpers

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
}

export function trackCookieBreak(method: string) {
  trackEvent("cookie_break", {
    break_method: method,
  });
}

export function trackFortuneReveal(category: string, rarity: string) {
  trackEvent("fortune_reveal", {
    fortune_category: category,
    fortune_rarity: rarity,
  });
}

export function trackShare(platform: string) {
  trackEvent("share_click", {
    share_platform: platform,
  });
}

export function trackNewCookie() {
  trackEvent("new_cookie");
}
