import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Moon,
  Search,
  Sparkles,
  Sun,
  X,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import {
  getKnowledgeArticles,
  getKnowledgeCategories,
  type KnowledgeArticleRecord,
} from "../lib/api";

const logoAserco = new URL(
  "../assets/logos/LogoAserco1.png",
  import.meta.url,
).href;

const logoAsercoDark = new URL(
  "../assets/logos/logoAsercoDark.png",
  import.meta.url,
).href;

type Props = {
  onOpenArticle: (slug: string) => void;
  onOpenAdminDashboard?: () => void;
};

type ArticleView = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  coverImageUrl: string;
  categoryName: string;
  publishedAt: string | null;
  readTime: number;
};

type CategoryView = {
  slug: string;
  name: string;
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80";

const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function formatDate(date: string | null) {
  if (!date) return "Reciente";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Reciente";
  }

  return dateFormatter.format(parsedDate);
}

function mapArticle(article: KnowledgeArticleRecord): ArticleView {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    subtitle:
      article.subtitle ?? article.excerpt ?? "Contenido editorial de Aserco.",
    excerpt:
      article.excerpt ??
      article.subtitle ??
      "Descubre nuevas perspectivas para tomar mejores decisiones.",
    coverImageUrl: article.cover_image_url || DEFAULT_IMAGE,
    categoryName: article.category_name ?? "General",
    publishedAt: article.published_at ?? article.created_at ?? null,
    readTime: article.read_time ?? 5,
  };
}

function ThemeToggle() {
  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark"),
  );

  const toggleTheme = () => {
    const nextTheme = !document.documentElement.classList.contains("dark");

    document.documentElement.classList.toggle("dark", nextTheme);
    setIsDark(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      aria-pressed={isDark}
      title={isDark ? "Modo claro" : "Modo oscuro"}
      className="
        grid size-10 shrink-0 place-items-center rounded-full
        border border-slate-200 bg-white text-[#22264b]
        transition-all duration-300
        hover:border-[#9dbf14] hover:bg-[#9dbf14]/10
        dark:border-white/10 dark:bg-white/5 dark:text-[#dff090]
        dark:hover:bg-white/10
      "
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

function ArticleMeta({ article }: { article: ArticleView }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
      <span className="inline-flex items-center gap-1.5">
        <CalendarDays size={14} />
        {formatDate(article.publishedAt)}
      </span>

      <span className="inline-flex items-center gap-1.5">
        <Clock3 size={14} />
        {article.readTime} min de lectura
      </span>
    </div>
  );
}

function ArticleCard({
  article,
  onOpenArticle,
}: {
  article: ArticleView;
  onOpenArticle: (slug: string) => void;
}) {
  return (
    <article
      className="
        group flex h-full flex-col overflow-hidden rounded-[22px]
        border border-slate-200/80 bg-white
        transition-all duration-300
        hover:-translate-y-1 hover:border-[#9dbf14]/50
        hover:shadow-xl hover:shadow-[#22264b]/5
        dark:border-white/10 dark:bg-[#101a2c]
        dark:hover:border-[#9dbf14]/40
      "
    >
      <button
        type="button"
        onClick={() => onOpenArticle(article.slug)}
        aria-label={`Leer ${article.title}`}
        className="relative block h-52 w-full overflow-hidden text-left"
      >
        <img
          src={article.coverImageUrl}
          alt={article.title}
          loading="lazy"
          className="
            h-full w-full object-cover
            transition-transform duration-700
            group-hover:scale-105
          "
          onError={(event) => {
            event.currentTarget.src = DEFAULT_IMAGE;
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/35 to-transparent opacity-60" />

        <span
          className="
            absolute bottom-4 left-4 rounded-full
            border border-white/20 bg-[#22264b]/85
            px-3 py-1.5 text-[10px] font-bold uppercase
            tracking-wider text-white backdrop-blur-md
          "
        >
          {article.categoryName}
        </span>
      </button>

      <div className="flex flex-1 flex-col space-y-4 p-5">
        <ArticleMeta article={article} />

        <h3
          className="
            line-clamp-2 text-xl font-semibold leading-snug
            tracking-tight text-[#22264b]
            transition-colors group-hover:text-[#789900]
            dark:text-white dark:group-hover:text-[#b4d63d]
          "
        >
          {article.title}
        </h3>

        <p className="line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
          {article.subtitle}
        </p>

        <div className="mt-auto pt-2">
          <button
            type="button"
            onClick={() => onOpenArticle(article.slug)}
            className="
              inline-flex items-center gap-2 text-sm font-bold
              text-[#3163a2] transition-all
              hover:gap-3 hover:text-[#789900]
              dark:text-[#b4d63d] dark:hover:text-[#dff090]
            "
          >
            Leer artículo
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}

export function KnowledgeHomePage({
  onOpenArticle, 
}: Props) {
  const [categories, setCategories] = useState<CategoryView[]>([]);
  const [articles, setArticles] = useState<ArticleView[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    let mounted = true;

    const loadContent = async () => {
      try {
        const [categoryData, articleData] = await Promise.all([
          getKnowledgeCategories(),
          getKnowledgeArticles({ limit: 12 }),
        ]);

        if (!mounted) return;

        setCategories(
          categoryData.map((category) => ({
            slug: category.slug,
            name: category.name,
          })),
        );

        setArticles(articleData.map(mapArticle));
      } catch (error) {
        console.error("Error cargando el centro de conocimiento:", error);

        if (!mounted) return;

        setCategories([]);
        setArticles([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void loadContent();

    return () => {
      mounted = false;
    };
  }, []);

  const topFeature = articles[0] ?? null;
  const sideArticles = articles.slice(1, 3);

  const filteredArticles = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesCategory =
        selectedCategory === "all" ||
        article.categoryName.toLowerCase() ===
          categories
            .find((category) => category.slug === selectedCategory)
            ?.name.toLowerCase();

      const searchableText = [
        article.title,
        article.subtitle,
        article.excerpt,
        article.categoryName,
      ]
        .join(" ")
        .toLowerCase();

      return (
        matchesCategory &&
        (!normalizedSearch || searchableText.includes(normalizedSearch))
      );
    });
  }, [articles, categories, searchTerm, selectedCategory]);

  const hasFilters = searchTerm.trim() !== "" || selectedCategory !== "all";

  return (
    <div
      className="
    relative isolate min-h-screen overflow-hidden
    bg-[#f7f8f4] text-[#22264b]
    transition-colors duration-300
    dark:bg-[#050b17] dark:text-white
  "
    >
      {/* FONDO GLOBAL DECORATIVO */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        {/* Círculos superiores */}
        <div
          className="
      absolute -right-40 top-[5%] size-[480px]
      rounded-full border border-[#9dbf14]/20
      bg-[#9dbf14]/[0.025]
      dark:border-[#9dbf14]/20 dark:bg-[#9dbf14]/[0.04]
    "
        />

        <div
          className="
      absolute -right-20 top-[8%] size-[340px]
      rounded-full border border-[#9dbf14]/20
      dark:border-[#9dbf14]/25
    "
        />

        <div
          className="
      absolute right-[5%] top-[12%] size-[190px]
      rounded-full border border-[#22264b]/10
      dark:border-white/10
    "
        />

        {/* Luz ambiental superior izquierda */}
        <div
          className="
      absolute -left-40 top-[8%] size-[420px]
      rounded-full bg-[#9dbf14]/[0.06] blur-[100px]
      dark:bg-[#9dbf14]/[0.09]
    "
        />

        {/* Zona central */}
        <div
          className="
      absolute -left-52 top-[35%] size-[500px]
      rounded-full border border-[#9dbf14]/15
      dark:border-[#9dbf14]/20
    "
        />

        <div
          className="
      absolute -left-28 top-[39%] size-[350px]
      rounded-full border border-[#3163a2]/10
      dark:border-[#3163a2]/20
    "
        />

        <div
          className="
      absolute right-[-180px] top-[43%] size-[460px]
      rounded-full bg-[#3163a2]/[0.04] blur-[100px]
      dark:bg-[#3163a2]/[0.10]
    "
        />

        <div
          className="
      absolute right-[-90px] top-[48%] size-[280px]
      rounded-full border border-[#9dbf14]/20
      dark:border-[#9dbf14]/20
    "
        />

        {/* Zona inferior */}
        <div
          className="
      absolute -right-48 top-[72%] size-[500px]
      rounded-full border border-[#9dbf14]/20
      dark:border-[#9dbf14]/20
    "
        />

        <div
          className="
      absolute right-[-70px] top-[76%] size-[300px]
      rounded-full border border-[#22264b]/10
      dark:border-white/10
    "
        />

        <div
          className="
      absolute -left-40 top-[80%] size-[400px]
      rounded-full bg-[#9dbf14]/[0.05] blur-[100px]
      dark:bg-[#9dbf14]/[0.08]
    "
        />

        {/* Círculos pequeños */}
        <div
          className="
      absolute left-[18%] top-[28%] size-16
      rounded-full border border-[#9dbf14]/25
      dark:border-[#9dbf14]/30
    "
        />

        <div
          className="
      absolute right-[22%] top-[62%] size-24
      rounded-full border border-[#3163a2]/15
      dark:border-[#3163a2]/25
    "
        />

        {/* Cuadrícula sutil global */}
        <div
          className="
      absolute inset-0 opacity-[0.025]
      bg-[linear-gradient(#22264b_1px,transparent_1px),linear-gradient(90deg,#22264b_1px,transparent_1px)]
      bg-size-[64px_64px]
      dark:bg-[linear-gradient(#ffffff_1px,transparent_1px),linear-gradient(90deg,#ffffff_1px,transparent_1px)]
      dark:opacity-[0.035]
    "
        />

        {/* Círculos decorativos adicionales */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden="true"
        >
          {/* Parte superior */}
          <div className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full border border-[#9dbf14]/15" />
          <div className="absolute -top-20 -left-20 h-[300px] w-[300px] rounded-full border border-[#9dbf14]/20" />
          <div className="absolute top-20 left-40 h-20 w-20 rounded-full bg-[#9dbf14]/10 blur-xl" />

          <div className="absolute top-24 right-[12%] h-44 w-44 rounded-full border border-[#22264b]/10 dark:border-white/10" />
          <div className="absolute top-36 right-[15%] h-28 w-28 rounded-full border border-[#9dbf14]/20" />
          <div className="absolute top-52 right-[8%] h-8 w-8 rounded-full bg-[#9dbf14]/20 blur-sm" />

          {/* Zona central */}
          <div className="absolute top-[38%] -left-40 h-[480px] w-[480px] rounded-full border border-[#22264b]/10 dark:border-white/10" />
          <div className="absolute top-[42%] -left-20 h-[320px] w-[320px] rounded-full border border-[#9dbf14]/20" />
          <div className="absolute top-[48%] left-20 h-16 w-16 rounded-full bg-[#9dbf14]/10 blur-2xl" />

          <div className="absolute top-[45%] right-[-180px] h-[460px] w-[460px] rounded-full border border-[#9dbf14]/20" />
          <div className="absolute top-[49%] right-[-100px] h-[300px] w-[300px] rounded-full border border-[#22264b]/10 dark:border-white/10" />
          <div className="absolute top-[55%] right-[8%] h-12 w-12 rounded-full bg-[#9dbf14]/10 blur-xl" />

          {/* Parte inferior */}
          <div className="absolute bottom-[12%] left-[20%] h-40 w-40 rounded-full border border-[#9dbf14]/20" />
          <div className="absolute bottom-[15%] left-[23%] h-24 w-24 rounded-full bg-[#9dbf14]/10 blur-2xl" />

          <div className="absolute bottom-[-180px] right-[18%] h-[460px] w-[460px] rounded-full border border-[#22264b]/10 dark:border-white/10" />
          <div className="absolute bottom-[-100px] right-[22%] h-[300px] w-[300px] rounded-full border border-[#9dbf14]/20" />
          <div className="absolute bottom-10 right-[10%] h-10 w-10 rounded-full bg-[#9dbf14]/15 blur-lg" />

          {/* Círculos pequeños dispersos */}
          <div className="absolute top-[28%] left-[48%] h-5 w-5 rounded-full bg-[#9dbf14]/15" />
          <div className="absolute top-[68%] left-[65%] h-8 w-8 rounded-full border border-[#9dbf14]/25" />
          <div className="absolute top-[82%] left-[8%] h-6 w-6 rounded-full bg-[#22264b]/10 dark:bg-white/10" />
          <div className="absolute top-[18%] left-[70%] h-3 w-3 rounded-full bg-[#9dbf14]/30" />
        </div>
      </div>

      {/* HEADER */}
      <header
        className="
          sticky top-0 z-50 border-b border-slate-200/80
          bg-white/90 backdrop-blur-xl
          dark:border-white/10 dark:bg-[#050b17]/90
        "
      >
        <div className="mx-auto flex max-w-360 items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-12">
          {/* LOGO */}
          <a
            href="#conocimiento"
            aria-label="Aserco Smart Finance - Inicio"
            className="flex shrink-0 items-center"
          >
            <img
              src={logoAserco}
              alt="Aserco Smart Finance"
              className="hero-logo hero-logo-light"
            />

            <img
              src={logoAsercoDark}
              alt=""
              aria-hidden="true"
              className="hero-logo hero-logo-dark"
            />
          </a>

          {/* NAVEGACIÓN */}
          <nav className="hidden items-center gap-6 lg:flex">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                document
                  .getElementById("articulos")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="
                text-sm font-semibold text-slate-600
                transition-colors hover:text-[#789900]
                dark:text-slate-300 dark:hover:text-[#b4d63d]
              "
            >
              Inicio
            </button>

            {categories.slice(0, 4).map((category) => (
              <button
                key={category.slug}
                type="button"
                onClick={() => {
                  setSelectedCategory(category.slug);
                  document
                    .getElementById("articulos")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="
                  whitespace-nowrap text-sm font-medium
                  text-slate-600 transition-colors
                  hover:text-[#789900]
                  dark:text-slate-300 dark:hover:text-[#b4d63d]
                "
              >
                {category.name}
              </button>
            ))}
          </nav>

          {/* ACCIONES */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => {
                window.location.hash = '#inicio'
              }}
              className="
                inline-flex items-center gap-2 rounded-full
                border border-[#22264b]/10 bg-white px-3 py-2
                text-xs font-bold text-[#22264b]
                transition-all hover:border-[#9dbf14]
                hover:bg-[#9dbf14]/10 dark:border-white/10
                dark:bg-white/5 dark:text-white dark:hover:border-[#9dbf14]
              "
            >
              <ArrowUpRight size={14} />
              Inicio
            </button>

            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="conocimiento">
        {/* HERO EDITORIAL */}
        <section
          className="
            relative isolate overflow-hidden
            border-b border-slate-200/70
            dark:border-white/10
          "
        >
          {/* DECORACIÓN */}
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div
              className="
              absolute -right-40 -top-48 size-120 rounded-full
              border border-[#9dbf14]/20 bg-[#9dbf14]/5
              dark:border-[#9dbf14]/20 dark:bg-[#9dbf14]/5
            "
            />

            <div
              className="
              absolute -left-40 bottom-0 size-100 rounded-full
              bg-[#9dbf14]/5 blur-3xl
              dark:bg-[#9dbf14]/10
            "
            />

            <div
              className="
              absolute inset-0 opacity-[0.025]
              bg-[linear-gradient(#22264b_1px,transparent_1px),linear-gradient(90deg,#22264b_1px,transparent_1px)]
              bg-size-[52px_52px]
              dark:bg-[linear-gradient(#ffffff_1px,transparent_1px),linear-gradient(90deg,#ffffff_1px,transparent_1px)]
              dark:opacity-[0.035]
            "
            />
          </div>

          <div className="mx-auto max-w-360 px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
            {/* INTRODUCCIÓN */}
            <div className="mb-10 max-w-3xl">
              <div
                className="
                mb-5 inline-flex items-center gap-2
                rounded-full border border-[#9dbf14]/30
                bg-[#9dbf14]/10 px-4 py-2
                text-[10px] font-bold tracking-[0.2em]
                text-[#647d0b] dark:text-[#dff090]
              "
              >
                <Sparkles size={13} />
                CENTRO DE CONOCIMIENTO
              </div>

              <h1
                className="
                text-4xl font-semibold leading-[1.12]
                tracking-[-0.045em] text-[#22264b]
                sm:text-5xl lg:text-6xl
                dark:text-white
              "
              >
                Ideas que impulsan
                <span className="block text-[#789900] dark:text-[#b4d63d]">
                  mejores decisiones.
                </span>
              </h1>

              <p
                className="
                mt-5 max-w-2xl text-base leading-7
                text-slate-600 sm:text-lg
                dark:text-slate-400
              "
              >
                Conocimiento financiero, estrategias y herramientas para
                comprender mejor tu negocio y encontrar nuevas oportunidades de
                crecimiento.
              </p>
            </div>

            {/* PORTADA */}
            {loading ? (
              <div
                className="
                h-[500px] animate-pulse rounded-[28px]
                bg-slate-200 dark:bg-white/5
              "
              />
            ) : topFeature ? (
              <div
                className="
                grid overflow-hidden rounded-[28px]
                border border-slate-200/80 bg-white
                shadow-[0_25px_70px_rgba(29,53,87,0.07)]
                lg:grid-cols-[1.1fr_0.9fr]
                dark:border-white/10 dark:bg-[#101a2c]
                dark:shadow-black/20
              "
              >
                {/* IMAGEN PRINCIPAL */}
                <div
                  className="
                  group relative min-h-[300px]
                  overflow-hidden lg:min-h-[490px]
                "
                >
                  <img
                    src={topFeature.coverImageUrl}
                    alt={topFeature.title}
                    className="
                      absolute inset-0 h-full w-full object-cover
                      transition-transform duration-1000
                      group-hover:scale-105
                    "
                    onError={(event) => {
                      event.currentTarget.src = DEFAULT_IMAGE;
                    }}
                  />

                  <div
                    className="
                    absolute inset-0
                    bg-gradient-to-t from-[#111827]/50
                    via-transparent to-transparent
                  "
                  />

                  <span
                    className="
                    absolute bottom-6 left-6
                    rounded-full border border-white/20
                    bg-[#22264b]/80 px-4 py-2
                    text-[10px] font-bold uppercase
                    tracking-wider text-white backdrop-blur-md
                  "
                  >
                    {topFeature.categoryName}
                  </span>
                </div>

                {/* CONTENIDO */}
                <div
                  className="
                  flex flex-col justify-center
                  space-y-6 p-7 sm:p-10 lg:p-12
                "
                >
                  <div
                    className="
                    inline-flex w-fit items-center gap-2
                    text-[10px] font-bold uppercase
                    tracking-[0.2em] text-[#789900]
                    dark:text-[#b4d63d]
                  "
                  >
                    <Sparkles size={14} />
                    DESTACADO
                  </div>

                  <h2
                    className="
                    text-3xl font-bold leading-[1.15]
                    tracking-tight text-[#22264b]
                    sm:text-4xl
                    dark:text-white
                  "
                  >
                    {topFeature.title}
                  </h2>

                  <p
                    className="
                    text-sm leading-7 text-slate-600 sm:text-base
                    dark:text-slate-400
                  "
                  >
                    {topFeature.excerpt}
                  </p>

                  <ArticleMeta article={topFeature} />

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => onOpenArticle(topFeature.slug)}
                      className="
                        inline-flex items-center gap-3
                        rounded-full bg-[#9dbf14]
                        px-6 py-3.5 text-sm font-bold
                        text-[#22264b] transition-all
                        hover:gap-5 hover:bg-[#b4d63d]
                        hover:shadow-lg hover:shadow-[#9dbf14]/20
                      "
                    >
                      Leer artículo
                      <ArrowRight size={17} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="
                rounded-[28px] border border-slate-200
                bg-white p-10 text-center
                dark:border-white/10 dark:bg-[#101a2c]
              "
              >
                <BookOpen className="mx-auto mb-4 text-[#789900]" size={32} />
                <h2 className="text-xl font-bold dark:text-white">
                  Próximamente
                </h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Estamos preparando nuevos contenidos para ti.
                </p>
              </div>
            )}

            {/* ARTÍCULOS SECUNDARIOS */}
            {!loading && sideArticles.length > 0 && (
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {sideArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    onOpenArticle={onOpenArticle}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ARTÍCULOS */}
        <section id="articulos" className="scroll-mt-24">
          <div className="mx-auto max-w-360 px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
            {/* ENCABEZADO */}
            <div
              className="
              mb-9 flex flex-col gap-6
              lg:flex-row lg:items-end lg:justify-between
            "
            >
              <div>
                <p
                  className="
                  text-[10px] font-bold uppercase
                  tracking-[0.22em] text-[#789900]
                  dark:text-[#b4d63d]
                "
                >
                  EXPLORA Y APRENDE
                </p>

                <h2
                  className="
                  mt-3 text-3xl font-bold tracking-tight
                  text-[#22264b] sm:text-4xl
                  dark:text-white
                "
                >
                  Conocimiento para crecer
                </h2>

                <p
                  className="
                  mt-3 max-w-xl text-sm leading-6
                  text-slate-600 dark:text-slate-400
                "
                >
                  Explora contenidos sobre financiación, gestión empresarial y
                  herramientas para tomar decisiones.
                </p>
              </div>

              {/* BUSCADOR */}
              <div className="relative w-full lg:max-w-sm">
                <Search
                  size={18}
                  className="
                    absolute left-4 top-1/2
                    -translate-y-1/2 text-slate-400
                  "
                />

                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Buscar artículos..."
                  aria-label="Buscar artículos"
                  className="
                    h-12 w-full rounded-full
                    border border-slate-200 bg-white
                    pl-11 pr-11 text-sm text-[#22264b]
                    outline-none transition-all
                    placeholder:text-slate-400
                    focus:border-[#9dbf14]
                    focus:ring-4 focus:ring-[#9dbf14]/10
                    dark:border-white/10 dark:bg-[#101a2c]
                    dark:text-white dark:placeholder:text-slate-500
                  "
                />

                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    aria-label="Limpiar búsqueda"
                    className="
                      absolute right-4 top-1/2
                      -translate-y-1/2 text-slate-400
                      hover:text-[#789900]
                    "
                  >
                    <X size={17} />
                  </button>
                )}
              </div>
            </div>

            {/* CATEGORÍAS */}
            <div
              className="
              mb-9 flex gap-2 overflow-x-auto pb-3
              [scrollbar-width:thin]
            "
            >
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`
                  shrink-0 rounded-full px-5 py-2.5
                  text-xs font-bold transition-all
                  ${
                    selectedCategory === "all"
                      ? "bg-[#22264b] text-white dark:bg-[#9dbf14] dark:text-[#22264b]"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-[#9dbf14] dark:border-white/10 dark:bg-[#101a2c] dark:text-slate-300"
                  }
                `}
              >
                Todos los temas
              </button>

              {categories.map((category) => (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`
                    shrink-0 rounded-full px-5 py-2.5
                    text-xs font-bold transition-all
                    ${
                      selectedCategory === category.slug
                        ? "bg-[#22264b] text-white dark:bg-[#9dbf14] dark:text-[#22264b]"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-[#9dbf14] dark:border-white/10 dark:bg-[#101a2c] dark:text-slate-300"
                    }
                  `}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* RESULTADOS */}
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="
                      h-[430px] animate-pulse rounded-[22px]
                      bg-slate-200 dark:bg-white/5
                    "
                  />
                ))}
              </div>
            ) : filteredArticles.length > 0 ? (
              <>
                <div
                  className="
                  mb-6 flex items-center justify-between
                  text-xs text-slate-500 dark:text-slate-400
                "
                >
                  <span>
                    {filteredArticles.length}{" "}
                    {filteredArticles.length === 1
                      ? "artículo encontrado"
                      : "artículos encontrados"}
                  </span>

                  {hasFilters && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("all");
                      }}
                      className="
                        font-semibold text-[#3163a2]
                        hover:text-[#789900]
                        dark:text-[#b4d63d]
                      "
                    >
                      Limpiar filtros
                    </button>
                  )}
                </div>

                <div
                  className="
                  grid gap-6 sm:grid-cols-2 lg:grid-cols-3
                "
                >
                  {filteredArticles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      onOpenArticle={onOpenArticle}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div
                className="
                rounded-[26px] border border-dashed
                border-slate-300 bg-white/60 px-6 py-16
                text-center dark:border-white/15 dark:bg-white/[0.02]
              "
              >
                <Search size={30} className="mx-auto mb-4 text-slate-400" />

                <h3 className="text-lg font-bold dark:text-white">
                  No encontramos artículos
                </h3>

                <p
                  className="
                  mx-auto mt-2 max-w-md text-sm
                  leading-6 text-slate-500 dark:text-slate-400
                "
                >
                  Prueba con otra búsqueda o selecciona una categoría diferente.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                  className="
                    mt-5 text-sm font-bold text-[#789900]
                    hover:underline dark:text-[#b4d63d]
                  "
                >
                  Ver todos los artículos
                </button>
              </div>
            )}
          </div>
        </section>

        {/* SECCIÓN FINANCIERA */}
        <section
          className="
          relative isolate overflow-hidden
          bg-[#22264b] py-16 text-white
          dark:bg-[#0d1728]
        "
        >
          {/* DECORACIÓN */}
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div
              className="
              absolute -right-20 -top-40 size-96 rounded-full
              border border-[#9dbf14]/20
            "
            />

            <div
              className="
              absolute -right-8 -top-28 size-72 rounded-full
              border border-[#9dbf14]/15
            "
            />

            <div
              className="
              absolute -left-40 bottom-[-180px] size-96 rounded-full
              bg-[#9dbf14]/10 blur-3xl
            "
            />
          </div>

          <div className="mx-auto max-w-360 px-5 sm:px-8 lg:px-12">
            <div className="mb-10 max-w-2xl">
              <div
                className="
                inline-flex items-center gap-2
                text-[10px] font-bold uppercase
                tracking-[0.22em] text-[#dff090]
              "
              >
                <Sparkles size={14} />
                SOLUCIONES FINANCIERAS
              </div>

              <h2
                className="
                mt-4 text-3xl font-bold leading-tight
                tracking-tight sm:text-4xl
              "
              >
                Entender las alternativas es el primer paso para crecer.
              </h2>

              <p
                className="
                mt-4 text-sm leading-7 text-slate-300
              "
              >
                Conoce algunas de las herramientas financieras que pueden ayudar
                a fortalecer la liquidez y operación de tu empresa.
              </p>
            </div>

            <div
              className="
              grid gap-3 sm:grid-cols-2
              lg:grid-cols-5
            "
            >
              {[
                {
                  name: "Factoring",
                  description: "Convierte tus facturas en liquidez.",
                },
                {
                  name: "Confirming",
                  description: "Gestiona los pagos a proveedores.",
                },
                {
                  name: "Leasing",
                  description: "Financia activos para tu operación.",
                },
                {
                  name: "Crédito rotativo",
                  description: "Accede a un cupo de financiación.",
                },
                {
                  name: "Capital de trabajo",
                  description: "Fortalece el flujo de tu negocio.",
                },
              ].map((item) => (
                <div
                  key={item.name}
                  className="
                    group rounded-[20px]
                    border border-white/10 bg-white/[0.04]
                    p-5 transition-all duration-300
                    hover:-translate-y-1 hover:border-[#9dbf14]/50
                    hover:bg-white/[0.08]
                  "
                >
                  <div
                    className="
                    mb-5 grid size-10 place-items-center
                    rounded-xl bg-[#9dbf14]/15
                    text-[#b4d63d]
                  "
                  >
                    <ArrowUpRight size={19} />
                  </div>

                  <h3 className="text-base font-bold">{item.name}</h3>

                  <p
                    className="
                    mt-2 text-xs leading-5 text-slate-400
                  "
                  >
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* CIERRE */}
            <div
              className="
              mt-12 flex flex-col items-start
              justify-between gap-6 border-t
              border-white/15 pt-8 sm:flex-row
              sm:items-center
            "
            >
              <div>
                <p className="text-lg font-bold">
                  ¿Buscas alternativas para tu empresa?
                </p>

                <p
                  className="
                  mt-1 text-sm text-slate-300
                "
                >
                  En Aserco te acompañamos a encontrar soluciones.
                </p>
              </div>

              <a
                href="mailto:hola@asercosmartfinance.com"
                className="
                  inline-flex shrink-0 items-center gap-3
                  rounded-full bg-[#9dbf14] px-6 py-3.5
                  text-sm font-bold text-[#22264b]
                  transition-all hover:gap-5
                  hover:bg-[#b4d63d]
                "
              >
                Conversemos
                <ArrowRight size={17} />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer
        className="
        border-t border-slate-200/80 bg-white
        py-7 dark:border-white/10 dark:bg-[#050b17]
      "
      >
        <div
          className="
          mx-auto flex max-w-360 flex-col
          items-center justify-between gap-4
          px-5 text-center sm:flex-row sm:px-8
          sm:text-left lg:px-12
        "
        >
          <img
            src={logoAserco}
            alt="Aserco Smart Finance"
            className="h-8 w-auto object-contain dark:hidden"
          />

          <img
            src={logoAsercoDark}
            alt=""
            aria-hidden="true"
            className="hidden h-8 w-auto object-contain dark:block"
          />

          <p
            className="
            text-xs text-slate-500 dark:text-slate-400
          "
          >
            © {new Date().getFullYear()} Aserco Smart Finance. Todos los
            derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
