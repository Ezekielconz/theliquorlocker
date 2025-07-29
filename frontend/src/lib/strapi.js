// src/lib/strapi.js
export const STRAPI_URL = (process.env.NEXT_PUBLIC_STRAPI_API_URL || '').replace(/\/$/, '');
export const NAVIGATION_SLUG = process.env.STRAPI_NAVIGATION_SLUG || 'navigation';
export const HOMEPAGE_SLUG   = process.env.STRAPI_HOMEPAGE_SLUG   || 'homepage';

const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || null;
export const DEFAULT_REVALIDATE = 60;
const isDev = process.env.NODE_ENV === 'development';

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */
export function getStrapiURL(path = '') {
  if (!path) return STRAPI_URL;
  if (path.startsWith('http')) return path;
  return `${STRAPI_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

export async function fetchStrapi(path, options = {}) {
  const { query, nextRevalidate, ...fetchOpts } = options;

  let url = getStrapiURL(path);
  if (query && typeof query === 'object') {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => v != null && params.append(k, v));
    url += (url.includes('?') ? '&' : '?') + params.toString();
  }

  const reqInit = {
    cache: isDev ? 'no-store' : 'force-cache',
    ...fetchOpts,
    headers: {
      ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
      ...fetchOpts.headers,
    },
    ...(nextRevalidate ? { next: { revalidate: nextRevalidate } } : {}),
  };

  if (isDev) console.log('[fetchStrapi] →', url, reqInit);
  const res = await fetch(url, reqInit);
  if (isDev) console.log('[fetchStrapi] ←', res.status, res.statusText);

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Strapi request failed ${res.status} ${res.statusText}: ${text}`);
  }
  return res.json();
}

function extractAttrs(json) {
  if (!json || !json.data) return null;
  return json.data.attributes ?? json.data;
}

export function getMediaFromStrapi(mediaInput) {
  if (!mediaInput) return { url: null, alt: '' };
  const attrs = mediaInput?.data?.attributes ?? mediaInput?.attributes ?? mediaInput;
  return {
    url: attrs?.url ? getStrapiURL(attrs.url) : null,
    alt: attrs?.alternativeText || attrs?.name || '',
  };
}

/* ------------------------------------------------------------------ */
/* Site-wide data                                                     */
/* ------------------------------------------------------------------ */
export async function getNavigation() {
  try {
    const json  = await fetchStrapi(`/api/${NAVIGATION_SLUG}`, { query: { populate: 'logo' } });
    const attrs = extractAttrs(json);
    const { url, alt } = getMediaFromStrapi(attrs?.logo);
    return { logoUrl: url, logoAlt: alt || 'The Liquor Locker' };
  } catch (err) {
    console.error('getNavigation error:', err);
    return { logoUrl: null, logoAlt: 'The Liquor Locker' };
  }
}

export async function getHomepage() {
  try {
    const json  = await fetchStrapi(`/api/${HOMEPAGE_SLUG}`, { query: { populate: 'heroImage' } });
    const attrs = extractAttrs(json);
    const { url: heroImageUrl, alt: heroImageAltRaw } = getMediaFromStrapi(attrs?.heroImage);
    return {
      heroTitle:     attrs?.heroTitle ?? '',
      heroImageUrl,
      heroImageAlt:  heroImageAltRaw || attrs?.heroTitle || 'Homepage hero',
      buttonOneText: attrs?.buttonOneText ?? '',
      buttonOneUrl:  attrs?.buttonOneUrl  ?? '#',
      buttonTwoText: attrs?.buttonTwoText ?? '',
      buttonTwoUrl:  attrs?.buttonTwoUrl  ?? '#',
    };
  } catch (err) {
    console.error('getHomepage error:', err);
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* About                                                              */
/* ------------------------------------------------------------------ */
export async function getAboutPage() {
  try {
    const json  = await fetchStrapi('/api/about', { query: { populate: '*', format: 'text' } });
    const attrs = extractAttrs(json);
    const { url, alt } = getMediaFromStrapi(attrs?.heroImage);
    const cta = attrs?.cta ?? {};
    return {
      heroImageUrl: url,
      heroImageAlt: alt,
      pageTitle: attrs?.pageTitle ?? '',
      heading:   attrs?.heading   ?? '',
      body:      attrs?.body      ?? '',
      cta: {
        heading:    cta.heading    ?? '',
        body:       cta.body       ?? '',
        buttonText: cta.buttonText ?? '',
        buttonUrl:  cta.buttonUrl  ?? '',
      },
    };
  } catch (err) {
    console.error('getAboutPage error:', err);
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Generic pages by slug                                              */
/* ------------------------------------------------------------------ */
export async function getPageBySlug(slug) {
  try {
    const json  = await fetchStrapi('/api/pages', {
      query: {
        'filters[slug][$eq]': slug,
        populate: '*',
        format: 'text',
      },
    });
    const attrs = extractAttrs(json)?.[0];
    if (!attrs) return null;

    const { url, alt } = getMediaFromStrapi(attrs.hero?.image);
    const cta = attrs?.cta ?? {};

    return {
      heroTitle:    attrs.hero?.title       ?? '',
      heroAccent:   attrs.hero?.accentColor ?? '#D07854',
      heroSkew:     attrs.hero?.skewDegrees ?? 6,
      heroImageUrl: url,
      heroImageAlt: alt || attrs.hero?.title || 'Hero',
      body:         attrs.body ?? '',
      cta: {
        heading:    cta.heading    ?? '',
        body:       cta.body       ?? '',
        buttonText: cta.buttonText ?? '',
        buttonUrl:  cta.buttonUrl  ?? '',
      },
    };
  } catch (err) {
    console.error('getPageBySlug', err);
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Range                                                              */
/* ------------------------------------------------------------------ */
export async function getRangePage() {
  try {
    const json  = await fetchStrapi('/api/range', {
      query: {
        populate: '*',
        format: 'text',
        status: process.env.NEXT_PUBLIC_PREVIEW === 'true' ? 'draft' : 'published',
      },
    });

    const attrs = extractAttrs(json);
    if (!attrs) return null;

    const hero     = getMediaFromStrapi(attrs.heroImage);
    const download = getMediaFromStrapi(attrs.downloadFile);

    const rawCta  = attrs.cta ?? null;
    const ctaItem = Array.isArray(rawCta) ? rawCta[0] ?? null : rawCta;
    const cta     = ctaItem && typeof ctaItem === 'object'
      ? {
          heading:    ctaItem.heading    ?? '',
          body:       ctaItem.body       ?? '',
          buttonText: ctaItem.buttonText ?? '',
          buttonUrl:  ctaItem.buttonUrl  ?? '',
        }
      : null;

    return {
      pageTitle:       attrs.pageTitle  ?? 'Our Range',
      heroImageUrl:    hero.url,
      heroImageAlt:    hero.alt || attrs.pageTitle || 'Range hero',
      body:            attrs.body       ?? '',
      buttonText:      attrs.buttonText ?? '',
      downloadFileUrl: download.url,
      downloadFileAlt: download.alt || 'PDF',
      cta,
    };
  } catch (err) {
    console.error('getRangePage error:', err);
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Suppliers                                                          */
/* ------------------------------------------------------------------ */
export function extractSizes(sizeArray = []) {
  return (sizeArray || [])
    .map((s) => {
      const item = s?.attributes ?? s;
      return item.size ?? item.sizeOption ?? null;
    })
    .filter(Boolean);
}

export async function getSuppliersWithDetails() {
  const json = await fetchStrapi('/api/suppliers', {
    query: {
      sort: 'name:asc',
      format: 'text',
      'populate[logo]': 'true',
      'populate[coverImage]': 'true',
      'populate[products][populate][image]': 'true',
      'populate[products][populate][sizeOption]': 'true',
    },
  });

  return (json.data || []).map((item) => {
    const attrs = item.attributes ?? item;
    const logo  = getMediaFromStrapi(attrs.logo);
    const cover = getMediaFromStrapi(attrs.coverImage);

    return {
      id:   item.id ?? attrs.id,
      slug: attrs.slug,
      name: attrs.name,
      logoUrl:  logo.url,
      logoAlt:  logo.alt || attrs.name,
      coverUrl: cover.url,
      coverAlt: cover.alt || attrs.name,
      description: attrs.description,
      products: (attrs.products || []).map((p) => {
        const pAttrs = p.attributes ?? p;
        const img    = getMediaFromStrapi(pAttrs.image);
        return {
          id:    p.id ?? pAttrs.id,
          name:  pAttrs.name,
          sizes: extractSizes(pAttrs.sizeOption),
          imageUrl: img.url,
          imageAlt: img.alt || pAttrs.name,
        };
      }),
    };
  });
}

export async function getSupplierBySlug(slug) {
  const json = await fetchStrapi('/api/suppliers', {
    query: {
      'filters[slug][$eq]': slug,
      format: 'text',
      'populate[coverImage]': 'true',
      'populate[products][populate][image]': 'true',
      'populate[products][populate][sizeOption]': 'true',
    },
  });

  const raw   = json?.data?.[0];
  const attrs = raw?.attributes ?? raw;
  if (!attrs) return null;

  const cover = getMediaFromStrapi(attrs.coverImage);

  return {
    name: attrs.name,
    slug: attrs.slug,
    coverUrl: cover.url,
    coverAlt: cover.alt || attrs.name,
    description: attrs.description,
    products: (attrs.products || []).map((p) => {
      const pAttrs = p.attributes ?? p;
      const img    = getMediaFromStrapi(pAttrs.image);
      return {
        id:    p.id ?? pAttrs.id,
        name:  pAttrs.name,
        sizes: extractSizes(pAttrs.sizeOption),
        imageUrl: img.url,
        imageAlt: img.alt || pAttrs.name,
      };
    }),
  };
}

/**
 * Fetch the “Contact” singleton from Strapi
 */
export async function getContactPage() {
  try {
    // pull in all relational data, and request HTML for rich text fields
    const json = await fetchStrapi('/api/contact', {
      query: { populate: '*', format: 'text' }
    });

    let entry = json.data;
    if (Array.isArray(entry)) entry = entry[0];
    if (!entry) return null;
    const attrs = entry.attributes ?? entry;

    const { url: heroImageUrl, alt: heroImageAlt } =
      getMediaFromStrapi(attrs.heroImage);

    // Strapi returns rich text as HTML when you use format=text
    const businessDetails = attrs.businessDetails ?? '';

    const rawCta = attrs.cta ?? {};

    return {
      pageTitle:       attrs.pageTitle       ?? '',
      heroImageUrl,
      heroImageAlt:    attrs.heroImageAlt    ?? heroImageAlt,
      businessDetails,                     // <-- new field
      cta: {
        heading:    rawCta.heading    ?? '',
        body:       rawCta.body       ?? '',
        buttonText: rawCta.buttonText ?? '',
        buttonUrl:  rawCta.buttonUrl  ?? ''
      }
    };
  } catch (err) {
    console.error('getContactPage error:', err);
    return null;
  }
}

export async function getBusinessInfo() {
  try {
    // populate all relations so you get every field
    const json = await fetchStrapi('/api/business-info', {
      query: { populate: '*' }
    });

    let entry = json.data;
    if (Array.isArray(entry)) entry = entry[0];
    if (!entry) return null;

    const attrs = entry.attributes ?? entry;

    return {
      companyName:  attrs.companyName   ?? '',
      address:      attrs.address       ?? '', // rich-text HTML
      phone:        attrs.phone         ?? '',
      email:        attrs.email         ?? '',
      openingHours: attrs.openingHours  ?? ''  // rich-text HTML
    };
  } catch (err) {
    console.error('getBusinessInfo error:', err);
    return null;
  }
}