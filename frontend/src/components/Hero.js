// components/Hero.jsx
'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from '../styles/Hero.module.css';

export default function Hero({
  title,
  imageUrl,
  imageAlt = '',
  buttonOne,
  buttonTwo,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width, height;
    const PARTICLE_COUNT = 60;

    function initParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 3 + 1,
          speedY: Math.random() * 0.5 + 0.2,
          driftX: (Math.random() - 0.5) * 0.2,
          alpha: Math.random() * 0.1 + 0.1,
        });
      }
    }

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.y -= p.speedY;
        p.x += p.driftX;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
    return () => window.removeEventListener('resize', resize);
  }, []);

  const lines = title.split('\n');

  return (
    <section className={styles.hero}>
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={imageAlt || title}
          fill
          priority
          style={{ objectFit: 'cover' }}
        />
      )}

      {/* fixed, full-screen particle canvas */}
      <canvas ref={canvasRef} className={styles.particlesCanvas} />

      <div className={styles.overlay}>
        <h1 className={styles.heroTitle}>
          {lines.map((line, i) => (
            <span
              key={i}
              className={styles.line}
              style={{ animationDelay: `${0.2 + i * 0.8}s` }}
            >
              {line}
            </span>
          ))}
        </h1>

        <div className={styles.buttons}>
          {buttonOne?.text && (
            <a href={buttonOne.url} className={styles.primary}>
              {buttonOne.text}
            </a>
          )}
          {buttonTwo?.text && (
            <a href={buttonTwo.url} className={styles.secondary}>
              {buttonTwo.text}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
