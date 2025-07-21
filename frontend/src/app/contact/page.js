'use client';

import { useState } from 'react';

export const revalidate = 60;

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: hook up to your API/Strapi endpoint
    alert(`Thanks, ${form.name}! We got your message.`);
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'Fraunces, serif' }}>
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <label>
          Name
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            style={{ width: '100%', marginBottom: '1rem' }}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ width: '100%', marginBottom: '1rem' }}
          />
        </label>
        <label>
          Message
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            style={{ width: '100%', height: '120px', marginBottom: '1rem' }}
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
          Send Message
        </button>
      </form>
    </main>
  );
}
