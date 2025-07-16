// src/lib/strapi.js
export const STRAPI = process.env.NEXT_PUBLIC_STRAPI_API_URL;

export async function fetchHomepage() {
  const res = await fetch(
    `${STRAPI}/api/homepage?populate=heroImage`,
    { cache: "no-store" } // or revalidate: 60
  );
  const json = await res.json();
  return json.data.attributes;
}
