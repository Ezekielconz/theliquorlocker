'use client';

import { useState } from 'react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: connect to your Strapi sign-up endpoint
    alert(`Thanks for signing up with ${email}!`);
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'Fraunces, serif' }}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <label>
          Email Address
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', marginBottom: '1rem' }}
          />
        </label>
        <button
          type="submit"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#C17558',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Sign Up
        </button>
      </form>
    </main>
  );
}
