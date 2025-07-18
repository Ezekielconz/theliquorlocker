// Central helpers for Strapi access (v4 + v5 compatible parsing)

export const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL?.replace(/\/$/, '') ?? 'http://localhost:1337';

// Optional server-only token (keep Public role locked down if you use this)
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || null;

// Override these in .env.local if your API IDs differ
export const NAVIGATION_SLUG = process.env.STRAPI_NAVIGATION_SLUG || 'navigation';
export const HOMEPAGE_SLUG   = process.env.STRAPI_HOMEPAGE_SLUG   || 'homepage';

const isDev = process.env.NODE_ENV === 'development';

/** Make absolute URL from Strapi-relative path. */
export function getStrapiURL(path = '') {
  if (!path) return STRAPI_URL;
  if (path.startsWith('http')) return path;
  return `${STRAPI_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

/**
 * Low-level fetch to Strapi. Supports {query:{...}} for search params.
 * Default cache: no-store (change per call if you want ISR).
 */
export async function fetchStrapi(path, options = {}) {
  const { query, ...fetchOpts } = options;

  let url = getStrapiURL(path);
  if (query && typeof query === 'object') {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) {
      if (v != null) qs.append(k, v);
    }
    url += (url.includes('?') ? '&' : '?') + qs.toString();
  }

  const headers = {
    ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
    ...fetchOpts.headers,
  };

  const reqInit = {
    cache: 'no-store',
    ...fetchOpts,
    headers,
  };

  if (isDev) console.log('[fetchStrapi] →', url);
  const res = await fetch(url, reqInit);
  if (isDev) console.log('[fetchStrapi] ←', res.status, res.statusText);

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Strapi request failed ${res.status} ${res.statusText}: ${text}`);
  }

  return res.json();
}

/**
 * Helper: unify v4/v5 doc shape.
 * v4: json.data.attributes
 * v5: json.data.<fields> directly
 */
function extractAttrs(json) {
  if (!json || !json.data) return null;
  const data = json.data;
  return data.attributes ?? data;
}

/** Media normalizer -> {url, alt}. Accepts either relation wrapper or flat media obj. */
export function getMediaFromStrapi(mediaInput) {
  if (!mediaInput) return { url: null, alt: '' };
  const attrs = mediaInput?.data?.attributes ?? mediaInput?.attributes ?? mediaInput;
  const rawUrl = attrs?.url;
  const alt = attrs?.alternativeText || attrs?.name || '';
  return {
    url: rawUrl ? getStrapiURL(rawUrl) : null,
    alt,
  };
}

/** Navigation single type -> {logoUrl, logoAlt}. */
export async function getNavigation() {
  try {
    const json = await fetchStrapi(`/api/${NAVIGATION_SLUG}`, { query: { populate: 'logo' } });
    const attrs = extractAttrs(json);
    if (isDev) console.log('[getNavigation] attrs keys:', attrs ? Object.keys(attrs) : 'none');

    const { url, alt } = getMediaFromStrapi(attrs?.logo);
    if (isDev) console.log('[getNavigation] parsed logoUrl:', url, 'alt:', alt);

    return {
      logoUrl: url,
      logoAlt: alt || 'The Liquor Locker',
    };
  } catch (err) {
    console.error('getNavigation error:', err);
    return { logoUrl: null, logoAlt: 'The Liquor Locker' };
  }
}

/** Homepage single type -> hero + CTA fields. */
export async function getHomepage() {
  try {
    const json = await fetchStrapi(`/api/${HOMEPAGE_SLUG}`, { query: { populate: 'heroImage' } });
    const attrs = extractAttrs(json);
    if (!attrs) return null;

    const { url: heroImageUrl, alt: heroImageAltRaw } = getMediaFromStrapi(attrs?.heroImage);
    if (isDev) console.log('[getHomepage] parsed heroImageUrl:', heroImageUrl);

    return {
      heroTitle: attrs?.heroTitle ?? '',
      heroImageUrl,
      heroImageAlt: heroImageAltRaw || attrs?.heroTitle || 'Homepage hero',
      buttonOneText: attrs?.buttonOneText ?? '',
      buttonOneUrl: attrs?.buttonOneUrl ?? '#',
      buttonTwoText: attrs?.buttonTwoText ?? '',
      buttonTwoUrl: attrs?.buttonTwoUrl ?? '#',
    };
  } catch (err) {
    console.error('getHomepage error:', err);
    return null;
  }
}

/** About single type -> heroImage, pageTitle, heading, body */
export async function getAboutPage() {
  try {
  const json = await fetchStrapi('/api/about', { query: { populate: '*' } });

    const attrs = extractAttrs(json);
    if (!attrs) return null;

    const { url: heroImageUrl, alt: heroImageAlt } = getMediaFromStrapi(attrs.heroImage);
    return {
      heroImageUrl,
      heroImageAlt,
      pageTitle: attrs.pageTitle,
      heading: attrs.heading,
      body: attrs.body,
    };
  } catch (err) {
    console.error('getAboutPage error:', err);
    return null;
  }
}