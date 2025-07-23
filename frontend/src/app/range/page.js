import PageHero       from '../../components/PageHero';

export const revalidate = 60;

export default function RangePage() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'Fraunces, serif' }}>
      <h1>Our Range</h1>
      <ul style={{ lineHeight: 1.6 }}>
        <li>Product A – A short description.</li>
        <li>Product B – Another highlight.</li>
        <li>Product C – What makes it special.</li>
      </ul>
    </main>
  );
}
