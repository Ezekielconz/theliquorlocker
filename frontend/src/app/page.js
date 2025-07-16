// src/app/page.js
import { fetchHomepage } from "../lib/strapi";
import Hero from "../components/Hero";

export const revalidate = 60; // ISR: rebuild every minute

export default async function Home() {
  const {
    heroTitle,
    heroImage,
    buttonOneText,
    buttonOneUrl,
    buttonTwoText,
    buttonTwoUrl,
  } = await fetchHomepage();

  return (
    <main>
      <Hero
        title={heroTitle}
        imageUrl={heroImage.data.attributes.url}
        buttonOne={{ text: buttonOneText, url: buttonOneUrl }}
        buttonTwo={{ text: buttonTwoText, url: buttonTwoUrl }}
      />
    </main>
  );
}
