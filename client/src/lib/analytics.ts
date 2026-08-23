/**
 * Analytics + UTM attribution.
 *
 * Events are pushed to `window.dataLayer`, which Google Tag Manager or GA4
 * consume directly. With no tag installed the pushes are inert, so this is
 * safe to ship before the marketing tag exists.
 *
 * Attribution is first-touch with a 30-day window: the campaign that first
 * brought a guest in keeps credit for the booking, which is what matters when
 * the whole pitch is "book direct instead of via an OTA".
 */

const ATTRIBUTION_KEY = 'pd_attribution';
const ATTRIBUTION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const UTM_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;

export interface Attribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  referrer?: string;
  landingPage?: string;
  capturedAt: number;
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

function readStored(): Attribution | null {
  try {
    const raw = localStorage.getItem(ATTRIBUTION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Attribution;
    if (Date.now() - parsed.capturedAt > ATTRIBUTION_TTL_MS) {
      localStorage.removeItem(ATTRIBUTION_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Captures UTM params on first arrival. Later visits within the window do not
 * overwrite the stored campaign unless they carry their own UTM tags.
 */
export function captureAttribution(): Attribution | null {
  if (typeof window === 'undefined') return null;

  let params: URLSearchParams;
  try {
    params = new URLSearchParams(window.location.search);
  } catch {
    return readStored();
  }

  const incoming: Attribution = { capturedAt: Date.now() };
  let hasUtm = false;

  for (const key of UTM_PARAMS) {
    const value = params.get(key);
    if (value) {
      incoming[key] = value.slice(0, 120);
      hasUtm = true;
    }
  }

  // Common paid-click IDs also count as a campaign touch.
  const clickId = params.get('gclid') || params.get('fbclid') || params.get('msclkid');
  if (clickId && !hasUtm) {
    incoming.utm_source = params.get('gclid')
      ? 'google'
      : params.get('fbclid')
        ? 'facebook'
        : 'bing';
    incoming.utm_medium = 'cpc';
    hasUtm = true;
  }

  const existing = readStored();
  if (!hasUtm) {
    if (existing) return existing;

    // No campaign tags: record organic/referral as the first touch.
    const ref = document.referrer;
    const organic: Attribution = {
      utm_source: ref ? safeHostname(ref) : 'direct',
      utm_medium: ref ? 'referral' : 'none',
      referrer: ref || undefined,
      landingPage: window.location.pathname,
      capturedAt: Date.now(),
    };
    persist(organic);
    return organic;
  }

  incoming.referrer = document.referrer || undefined;
  incoming.landingPage = window.location.pathname;
  persist(incoming);
  return incoming;
}

function safeHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return 'unknown';
  }
}

function persist(attribution: Attribution) {
  try {
    localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
  } catch {
    // Private browsing / storage disabled — attribution is best-effort.
  }
}

export function getAttribution(): Attribution | null {
  return readStored();
}

/** Pushes an event with the stored campaign attached. */
export function track(event: string, payload: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];

  const attribution = getAttribution();
  window.dataLayer.push({
    event,
    ...payload,
    ...(attribution
      ? {
          utm_source: attribution.utm_source,
          utm_medium: attribution.utm_medium,
          utm_campaign: attribution.utm_campaign,
        }
      : {}),
  });
}

export function trackPageView(page: string, title: string) {
  track('page_view', { page_path: `/${page === 'home' ? '' : page}`, page_title: title });
}

export function trackVillaView(slug: string, title: string, price: number) {
  track('view_item', {
    item_id: slug,
    item_name: title,
    price,
    currency: 'MYR',
  });
}

export function trackBookingStarted(slug: string, title: string, price: number) {
  track('begin_checkout', {
    item_id: slug,
    item_name: title,
    value: price,
    currency: 'MYR',
  });
}

export function trackBookingCompleted(
  bookingRef: string,
  slug: string,
  title: string,
  total: number,
  nights: number
) {
  track('purchase', {
    transaction_id: bookingRef,
    item_id: slug,
    item_name: title,
    value: total,
    currency: 'MYR',
    nights,
  });
}

export function trackWhatsAppClick(context: string) {
  track('contact_whatsapp', { context });
}

export function trackSearch(query: string, resultCount: number) {
  track('search', { search_term: query, result_count: resultCount });
}
