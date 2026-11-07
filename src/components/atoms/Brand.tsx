const logoAserco = new URL(
  "../../assets/logos/LogoAserco1.png",
  import.meta.url,
).href;

const logoAsercoDark = new URL(
  "../../assets/logos/LogoAsercoDark.png",
  import.meta.url,
).href;

export function Brand() {
  return (
    <a
      href="#inicio"
      aria-label="Aserco Smart Finance, inicio"
      className="inline-flex items-center"
    >
      <img
        src={logoAserco}
        alt="Aserco Smart Finance"
        className="block h-10 w-auto object-contain hero-logo-light"
      />

      <img
        src={logoAsercoDark}
        alt=""
        aria-hidden="true"
        className="block h-10 w-auto object-contain hero-logo-dark"
      />
    </a>
  );
}
