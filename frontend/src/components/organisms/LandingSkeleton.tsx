export function LandingSkeleton() {
  return (
    <div className="landing-skeleton" aria-label="Cargando contenido de la landing" aria-busy="true">
      <header className="skeleton-header">
        <div className="skeleton-brand" />
        <nav className="skeleton-nav">
          <span className="skeleton-line short" />
          <span className="skeleton-line short" />
          <span className="skeleton-line short" />
        </nav>
        <div className="skeleton-actions">
          <span className="skeleton-pill" />
          <span className="skeleton-cta" />
        </div>
      </header>

      <main className="skeleton-main">
        <section className="skeleton-hero">
          <div className="skeleton-copy">
            <span className="skeleton-logo-block" />
            <span className="skeleton-line long" />
            <span className="skeleton-line long" />
            <span className="skeleton-line medium" />
            <div className="skeleton-buttons">
              <span className="skeleton-button primary" />
              <span className="skeleton-button secondary" />
            </div>
            <div className="skeleton-stats">
              <span className="skeleton-stat" />
              <span className="skeleton-stat" />
              <span className="skeleton-stat" />
            </div>
          </div>

          <div className="skeleton-visual">
            <div className="skeleton-card large" />
            <div className="skeleton-grid">
              <div className="skeleton-card small" />
              <div className="skeleton-card small" />
            </div>
            <div className="skeleton-card cta" />
          </div>
        </section>

        <section className="skeleton-section">
          <div className="skeleton-section-title" />
          <div className="skeleton-cards">
            <span className="skeleton-card-item" />
            <span className="skeleton-card-item" />
            <span className="skeleton-card-item" />
          </div>
        </section>
      </main>
    </div>
  );
}
