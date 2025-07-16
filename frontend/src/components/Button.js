export default function Button({ href, children, variant = "primary" }) {
  return (
    <a href={href} className={`btn btn--${variant}`}>
      {children}
    </a>
  );
}
