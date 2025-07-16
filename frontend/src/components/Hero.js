import Image from "next/image";
import styles from "../styles/Hero.module.css";

export default function Hero({
  title,
  imageUrl,
  buttonOne,
  buttonTwo,
}) {
  return (
    <section className={styles.hero}>
      <Image
        src={imageUrl}
        alt={title}
        fill
        style={{ objectFit: "cover" }}
        priority
      />
      <div className={styles.overlay}>
        <h1>{title}</h1>
        <div className={styles.buttons}>
          <a href={buttonOne.url} className={styles.primary}>
            {buttonOne.text}
          </a>
          <a href={buttonTwo.url} className={styles.secondary}>
            {buttonTwo.text}
          </a>
        </div>
      </div>
    </section>
  );
}
