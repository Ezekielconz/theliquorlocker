// src/lib/strapi.js
// Central helpers for Strapi access (v4 + v5 compatible, tuned for ISR)

////////////////////////////////////////////////////////////
// Config & constants
////////////////////////////////////////////////////////////

export const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL?.replace(/\/$/, '') ??
  'http://localhost:1337';

export const NAVIGATION_SLUG =
  process.env.STRAPI_NAVIGATION_SLUG || 'navigation';

export const HOMEPAGE_SLUG =
  process.env.STRAPI_HOMEPAGE_SLUG || 'homepage';

const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || null;

export const DEFAULT_REVALIDATE = 60; // seconds
const isDev = process.env.NODE_ENV === 'development';

////////////////////////////////////////////////////////////
// Utility functions
////////////////////////////////////////////////////////////

/** Turn a Strapi-relative path ("/uploads/…") into an absolute URL. */
export function getStrapiURL(path = '') {
  if (!path) return STRAPI_URL;
  if (path.startsWith('http')) return path;
  return `${STRAPI_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

/**
 * Low-level fetch wrapper.
 * - Accepts `options.query` (object) which is serialised to the URL.
 * - In prod defaults to `force-cache` so ISR can kick in.
 * - Pass `options.nextRevalidate` to override revalidate seconds on this call only.
 */
export async function fetchStrapi(
  /** @type {string} */ path,
  /** @type {{query?:Record<string,string>, nextRevalidate?:number}&RequestInit} */ options = {},
) {
  const { query, nextRevalidate, ...fetchOpts } = options;

  // Build full URL + query-string
  let url = getStrapiURL(path);
  if (query && typeof query === 'object') {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => v != null && params.append(k, v));
    url += (url.includes('?') ? '&' : '?') + params.toString();
  }

  // Default cache policy
  const defaultCache = isDev ? 'no-store' : 'force-cache';

  /** @type {RequestInit} */
  const reqInit = {
    cache: defaultCache,
    ...fetchOpts,
    headers: {
      ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
      ...fetchOpts.headers,
    },
    // `next` is how we add per-request revalidation in Next 15
    ...(nextRevalidate
      ? { next: { revalidate: nextRevalidate } }
      : {}),
  };

  if (isDev) console.log('[fetchStrapi] →', url, reqInit);
  const res = await fetch(url, reqInit);
  if (isDev) console.log('[fetchStrapi] ←', res.status, res.statusText);

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `Strapi request failed ${res.status} ${res.statusText}: ${text}`,
    );
  }
  return res.json();
}

/**
 * Normalise document shape across Strapi versions.
 * v4: json.data.attributes
 * v5: json.data.<fields> directly
 */
function extractAttrs(json) {
  if (!json || !json.data) return null;
  return json.data.attributes ?? json.data; // v5: data IS attrs
}

/** Convert media relation → {url, alt}. */
export function getMediaFromStrapi(mediaInput) {
  if (!mediaInput) return { url: null, alt: '' };
  const attrs =
    mediaInput?.data?.attributes ?? mediaInput?.attributes ?? mediaInput;
  return {
    url: attrs?.url ? getStrapiURL(attrs.url) : null,
    alt: attrs?.alternativeText || attrs?.name || '',
  };
}

////////////////////////////////////////////////////////////
// Domain-specific helpers
////////////////////////////////////////////////////////////

/** Fetch Navigation single-type → {logoUrl, logoAlt}. */
export async function getNavigation() {
  try {
    const json = await fetchStrapi(`/api/${NAVIGATION_SLUG}`, {
      query: { populate: 'logo' },
    });
    const attrs = extractAttrs(json);
    const { url, alt } = getMediaFromStrapi(attrs?.logo);
    return { logoUrl: url, logoAlt: alt || 'The Liquor Locker' };
  } catch (err) {
    console.error('getNavigation error:', err);
    return { logoUrl: null, logoAlt: 'The Liquor Locker' };
  }
}

/** Fetch Homepage single-type → hero + CTA fields. */
export async function getHomepage() {
  try {
    const json = await fetchStrapi(`/api/${HOMEPAGE_SLUG}`, {
      query: { populate: 'heroImage' },
    });
    const attrs = extractAttrs(json);
    const {
      url: heroImageUrl,
      alt: heroImageAltRaw,
    } = getMediaFromStrapi(attrs?.heroImage);

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

/** Fetch About single-type → hero image + plain-text body. */
export async function getAboutPage() {
  try {
    const json = await fetchStrapi('/api/about', {
      query: {
        populate: '*',     // keep media & other relations
        format:   'text',  // ← ask Strapi for plain text
      },
    });

    const attrs          = extractAttrs(json);
    const { url, alt }   = getMediaFromStrapi(attrs?.heroImage);

    return {
      heroImageUrl: url,
      heroImageAlt: alt,
      pageTitle:    attrs?.pageTitle ?? '',
      heading:      attrs?.heading   ?? '',
      body:         attrs?.body      ?? '',  // now a string, not blocks
    };
  } catch (err) {
    console.error('getAboutPage error:', err);
    return null;
  }
}


/** Fetch a Page collection-type by slug → { heroTitle, heroImageUrl, … } */
export async function getPageBySlug(slug) {
  try {
    const json = await fetchStrapi('/api/pages', {
      query: {
        'filters[slug][$eq]': slug,
        populate: 'hero.image',          // deep-populate the media field
      },
    });

    const attrs = extractAttrs(json)?.[0]; // first match
    if (!attrs) return null;

    const { url, alt } = getMediaFromStrapi(attrs.hero?.image);
    return {
      heroTitle: attrs.hero?.title ?? '',
      heroAccent: attrs.hero?.accentColor ?? '#D07854',
      heroSkew:   attrs.hero?.skewDegrees ?? 6,
      heroImageUrl: url,
      heroImageAlt: alt || attrs.hero?.title || 'Hero',
      body: attrs.body ?? '',
    };
  } catch (err) {
    console.error('getPageBySlug', err);
    return null;
  }
}
