const logoAserco = new URL(
  "../../assets/logos/LogoAserco1.png",
  import.meta.url,
).href;

const logoAsercoDark = new URL(
  "../../assets/logos/logoAsercoDark.png",
  import.meta.url,
).href;

type Props = Readonly<{
  visible: boolean;
}>;

export function SplashLoader({ visible }: Props) {
  if (!visible) return null;

  return (
    <div className="page-loader" aria-live="polite" aria-label="Cargando contenido">
      <div className="loader-shell">
        <div className="loader-visual" aria-hidden="true">
          <span className="loader-ring loader-ring-outer" />
          <span className="loader-ring loader-ring-inner" />
          <span className="loader-core" />
        </div>

        <div className="loader-brand">
          <img
            src={logoAserco}
            alt="Aserco Smart Finance"
            className="loader-logo loader-logo-light"
          />
          <img
            src={logoAsercoDark}
            alt="Aserco Smart Finance"
            className="loader-logo loader-logo-dark"
          />
        </div>

        <span className="loader-label">Cargando experiencia</span>
      </div>
    </div>
  );
}
