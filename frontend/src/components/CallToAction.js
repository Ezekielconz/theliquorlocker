// components/CallToAction.jsx
import React, { useMemo } from 'react'
import Link from 'next/link'
import styles from '../styles/CallToAction.module.css'

export default function CallToAction({ heading, body, buttonText, buttonUrl }) {
  if (!heading) return null

  const bubbles = useMemo(() => {
    const count = Math.floor(Math.random() * 10) + 5  // 5–14 bubbles
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left:     `${Math.random() * 100}%`,                           // anywhere across width
      size:     `${Math.random() * (16 - 6) + 6}px`,                // 6–16px diameter
      duration: `${Math.random() * (8 - 4) + 4}s`,                   // 4–8s rise
      delay:    `${Math.random() * 4}s`,                             // 0–4s before starting
    }))
  }, [])

  return (
    <aside className={styles.cta}>
      <h3 className={styles.heading}>{heading}</h3>
      {body && <p className={styles.body}>{body}</p>}
      {buttonText && buttonUrl && (
        <Link href={buttonUrl} className={styles.button}>
          {buttonText}
        </Link>
      )}

      <div className={styles.waveContainer}>
        <div className={styles.bubbles}>
          {bubbles.map(({ id, left, size, duration, delay }) => (
            <span
              key={id}
              className={styles.bubble}
              style={{
                left,
                width: size,
                height: size,
                animationDuration: duration,
                animationDelay: delay,
              }}
            />
          ))}
        </div>
        <div className={styles.waveSvg}>
          <svg
            viewBox="0 0 2880 320"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#E5B7A5"
              d="M0,96L40,90.7C80,85,160,75,240,80C320,85,400,107,480,112C560,117,640,107,720,112C800,117,880,139,960,138.7C1040,139,1120,117,1200,106.7C1280,96,1360,96,1440,96L1440,96L1440,320L0,320Z"
            />
            <path
              fill="#E5B7A5"
              transform="translate(1440,0)"
              d="M0,96L40,90.7C80,85,160,75,240,80C320,85,400,107,480,112C560,117,640,107,720,112C800,117,880,139,960,138.7C1040,139,1120,117,1200,106.7C1280,96,1360,96,1440,96L1440,96L1440,320L0,320Z"
            />
          </svg>
        </div>
      </div>
    </aside>
  )
}
