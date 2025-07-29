// components/ContactForm.jsx
'use client';

import { useState } from 'react';
import { fetchStrapi } from '@/lib/strapi';
import styles from '../styles/Contact.module.css';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [feedback, setFeedback] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetchStrapi('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: form }),
      });
      setFeedback({ type: 'success', text: `Thanks, ${form.name}! We got your message.` });
      setForm({ name: '', email: '', message: '' });
    } catch {
      setFeedback({ type: 'error', text: 'Sorry, an error occurred. Please try again.' });
    }
  };

  return (
    <section className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          Name
          <input
            className={styles.input}
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>
        <label className={styles.label}>
          Email
          <input
            className={styles.input}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>
        <label className={styles.label}>
          Message
          <textarea
            className={styles.textarea}
            name="message"
            rows={6}
            value={form.message}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" className={styles.button}>
          Send Message
        </button>
        {feedback && (
          <div className={`${styles.feedback} ${styles[feedback.type]}`}>
            {feedback.text}
          </div>
        )}
      </form>
    </section>
  );
}
