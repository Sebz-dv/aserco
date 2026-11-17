
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
      className="brand"
    >
      <img
        src={logoAserco}
        alt="Aserco Smart Finance"
        className="brand__logo brand__logo--light"
        draggable={false}
      />

      <img
        src={logoAsercoDark}
        alt=""
        aria-hidden="true"
        className="brand__logo brand__logo--dark"
        draggable={false}
      />
    </a>
  );
}
