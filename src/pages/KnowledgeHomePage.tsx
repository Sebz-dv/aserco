import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Clock3,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import { Footer } from "../components/organisms/Footer";
import { Header } from "../components/organisms/Header";
import {
  getKnowledgeArticles,
  getKnowledgeCategories,
  type AuthUser,
  type KnowledgeArticleRecord,
} from "../lib/api";

// -----------------------------------------------------------------------------
// Tipos
// -----------------------------------------------------------------------------

type Props = Readonly<{
  dark: boolean;
  user: AuthUser | null;
  onToggleTheme: () => void;
  onConfirmLogout?: () => void;
  onOpenProfile: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenAdmin: (path?: string) => void;
  onOpenKnowledge: () => void;
  onOpenArticle: (slug: string) => void;
}>;

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

type ArticleCardProps = Readonly<{
  article: ArticleView;
  onOpenArticle: (slug: string) => void;
  index: number;
  reducedMotion: boolean | null;
}>;

type ImageWithFallbackProps = Readonly<{
  src: string;
  alt: string;
  className: string;
  loading?: "eager" | "lazy";
}>;

// -----------------------------------------------------------------------------
// Constantes
// -----------------------------------------------------------------------------

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=85";

const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const easeOut = [0.22, 1, 0.36, 1] as const;

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const solutions = [
  {
    number: "01",
    title: "Factoring",
    description: "Convierte tus facturas en oportunidades de liquidez.",
  },
  {
    number: "02",
    title: "Confirming",
    description: "Optimiza la gestión de pagos a tus proveedores.",
  },
  {
    number: "03",
    title: "Leasing",
    description: "Impulsa tu operación con financiación de activos.",
  },
  {
    number: "04",
    title: "Crédito rotativo",
    description: "Cuenta con alternativas para tu flujo de caja.",
  },
  {
    number: "05",
    title: "Capital de trabajo",
    description: "Fortalece la operación y el crecimiento de tu negocio.",
  },
];

// -----------------------------------------------------------------------------
// Utilidades
// -----------------------------------------------------------------------------

function formatDate(date: string | null): string {
  if (!date) return "Reciente";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "Reciente";

  return dateFormatter.format(parsed);
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

function filterKnowledgeArticles(
  articles: ArticleView[],
  categories: CategoryView[],
  searchTerm: string,
  selectedCategory: string,
): ArticleView[] {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const selectedCategoryName = categories.find(
    (category) => category.slug === selectedCategory,
  )?.name;

  return articles.filter((article) => {
    const matchesCategory =
      selectedCategory === "all" ||
      article.categoryName.toLowerCase() ===
        selectedCategoryName?.toLowerCase();

    const searchableText = [
      article.title,
      article.subtitle,
      article.excerpt,
      article.categoryName,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      !normalizedSearch || searchableText.includes(normalizedSearch);

    return matchesCategory && matchesSearch;
  });
}

// -----------------------------------------------------------------------------
// Componentes auxiliares
// -----------------------------------------------------------------------------

function ArticleMeta({ article }: Readonly<{ article: ArticleView }>) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
      <span className="inline-flex items-center gap-1.5">
        <CalendarDays size={13} />
        {formatDate(article.publishedAt)}
      </span>

      <span className="inline-flex items-center gap-1.5">
        <Clock3 size={13} />
        {article.readTime} min de lectura
      </span>
    </div>
  );
}

function ImageWithFallback({
  src,
  alt,
  className,
  loading = "lazy",
}: ImageWithFallbackProps) {
  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      onError={(event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = DEFAULT_IMAGE;
      }}
      className={className}
    />
  );
}

function ArticleCard({
  article,
  onOpenArticle,
  index,
  reducedMotion,
}: ArticleCardProps) {
  return (
    <motion.article
      variants={reveal}
      initial={reducedMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: reducedMotion ? 0 : 0.65,
        delay: reducedMotion ? 0 : Math.min(index * 0.06, 0.3),
        ease: easeOut,
      }}
      whileHover={reducedMotion ? undefined : { y: -7 }}
      className="
        group flex h-full flex-col overflow-hidden rounded-3xl
        border border-[#22264b]/8 bg-[#fffefa]/90
        shadow-[0_12px_40px_rgba(34,38,75,0.045)]
        transition-all duration-300
        hover:border-[#9dbf14]/45
        hover:shadow-[0_24px_55px_rgba(34,38,75,0.11)]
        dark:border-white/9 dark:bg-[#101a2c]/90
        dark:hover:border-[#9dbf14]/40
      "
    >
      <button
        type="button"
        onClick={() => onOpenArticle(article.slug)}
        aria-label={`Leer ${article.title}`}
        className="relative block h-56 w-full overflow-hidden text-left"
      >
        <ImageWithFallback
          src={article.coverImageUrl}
          alt={article.title}
          className="
            h-full w-full object-cover
            transition-transform duration-700
            group-hover:scale-105
          "
        />

        <div className="absolute inset-0 bg-linear-to-t from-[#111827]/70 via-[#111827]/5 to-transparent" />

        <span
          className="
            absolute bottom-4 left-4 rounded-full
            border border-white/20 bg-[#22264b]/80
            px-3.5 py-1.5 text-[10px] font-bold uppercase
            tracking-[0.13em] text-white backdrop-blur-md
          "
        >
          {article.categoryName}
        </span>

        <span
          className="
            absolute right-4 top-4 grid size-9 place-items-center
            rounded-full border border-white/20 bg-white/15
            text-white opacity-0 backdrop-blur-md
            transition-all duration-300
            group-hover:translate-x-0 group-hover:opacity-100
          "
        >
          <ArrowUpRight size={17} />
        </span>
      </button>

      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
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

        <div className="mt-auto border-t border-[#22264b]/7 pt-4 dark:border-white/10">
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
    </motion.article>
  );
}

function ArticleSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="
            h-107.5 animate-pulse rounded-3xl
            border border-slate-200/50 bg-white/60
            dark:border-white/5 dark:bg-white/4
          "
        />
      ))}
    </div>
  );
}

function EmptyArticles({ onReset }: Readonly<{ onReset: () => void }>) {
  return (
    <div
      className="
        rounded-[26px] border border-dashed
        border-slate-300 bg-[#fffefa]/65
        px-6 py-16 text-center
        dark:border-white/15 dark:bg-white/2
      "
    >
      <Search size={30} className="mx-auto mb-4 text-slate-400" />

      <h3 className="text-lg font-bold text-[#22264b] dark:text-white">
        No encontramos artículos
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
        Prueba con otra búsqueda o selecciona una categoría diferente.
      </p>

      <button
        type="button"
        onClick={onReset}
        className="mt-5 text-sm font-bold text-[#789900] hover:underline dark:text-[#b4d63d]"
      >
        Ver todos los artículos
      </button>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Sección de artículo destacado
// -----------------------------------------------------------------------------

function FeaturedArticle({
  article,
  onOpenArticle,
  reducedMotion,
}: Readonly<{
  article: ArticleView;
  onOpenArticle: (slug: string) => void;
  reducedMotion: boolean | null;
}>) {
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reducedMotion ? 0 : 0.85,
        delay: reducedMotion ? 0 : 0.12,
        ease: easeOut,
      }}
      className="
        group relative grid overflow-hidden rounded-[30px]
        border border-[#22264b]/8 bg-[#fffefa]/95
        shadow-[0_28px_80px_rgba(29,53,87,0.09)]
        lg:grid-cols-[1.12fr_0.88fr]
        dark:border-white/10 dark:bg-[#101a2c]/95
        dark:shadow-black/20
      "
    >
      <button
        type="button"
        onClick={() => onOpenArticle(article.slug)}
        aria-label={`Leer ${article.title}`}
        className="
          group/image relative min-h-75
          overflow-hidden text-left lg:min-h-122.5
        "
      >
        <ImageWithFallback
          src={article.coverImageUrl}
          alt={article.title}
          loading="eager"
          className="
            absolute inset-0 h-full w-full object-cover
            transition-transform duration-1000
            group-hover/image:scale-105
          "
        />

        <div className="absolute inset-0 bg-linear-to-t from-[#111827]/65 via-transparent to-transparent" />

        <span
          className="
            absolute bottom-6 left-6 rounded-full
            border border-white/20 bg-[#22264b]/80
            px-4 py-2 text-[10px] font-bold uppercase
            tracking-wider text-white backdrop-blur-md
          "
        >
          {article.categoryName}
        </span>

        <span
          className="
            absolute right-6 top-6 grid size-11 place-items-center
            rounded-full border border-white/25
            bg-white/15 text-white backdrop-blur-md
            transition-transform duration-300
            group-hover/image:rotate-45
          "
        >
          <ArrowUpRight size={20} />
        </span>
      </button>

      <div className="relative flex flex-col justify-center gap-6 p-7 sm:p-10 lg:p-12">
        <div
          className="
            inline-flex w-fit items-center gap-2
            rounded-full bg-[#9dbf14]/10 px-3.5 py-2
            text-[10px] font-bold uppercase
            tracking-[0.18em] text-[#789900]
            dark:text-[#b4d63d]
          "
        >
          <Sparkles size={13} />
          ARTÍCULO DESTACADO
        </div>

        <h2
          className="
            text-3xl font-bold leading-[1.14]
            tracking-tight text-[#22264b]
            sm:text-4xl dark:text-white
          "
        >
          {article.title}
        </h2>

        <p className="text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-400">
          {article.excerpt}
        </p>

        <ArticleMeta article={article} />

        <div className="pt-2">
          <button
            type="button"
            onClick={() => onOpenArticle(article.slug)}
            className="
              group/button inline-flex items-center gap-3
              rounded-full bg-[#9dbf14] px-6 py-3.5
              text-sm font-bold text-[#22264b]
              transition-all hover:gap-5
              hover:bg-[#b4d63d]
              hover:shadow-lg hover:shadow-[#9dbf14]/20
            "
          >
            Leer artículo
            <ArrowRight
              size={17}
              className="transition-transform group-hover/button:translate-x-1"
            />
          </button>
        </div>

        <div
          className="
            pointer-events-none absolute -bottom-24 -right-24
            size-64 rounded-full border border-[#9dbf14]/10
          "
        />
      </div>
    </motion.div>
  );
}

// -----------------------------------------------------------------------------
// Página principal
// -----------------------------------------------------------------------------

export function KnowledgeHomePage({
  dark,
  user,
  onToggleTheme,
  onConfirmLogout,
  onOpenProfile,
  onOpenLogin,
  onOpenRegister,
  onOpenAdmin,
  onOpenKnowledge,
  onOpenArticle,
}: Props) {
  const reducedMotion = useReducedMotion();

  const [categories, setCategories] = useState<CategoryView[]>([]);
  const [articles, setArticles] = useState<ArticleView[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    let mounted = true;

    async function loadContent() {
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
    }

    void loadContent();

    return () => {
      mounted = false;
    };
  }, []);

  const topFeature = articles[0] ?? null;
  const sideArticles = articles.slice(1, 3);

  const filteredArticles = useMemo(
    () =>
      filterKnowledgeArticles(
        articles,
        categories,
        searchTerm,
        selectedCategory,
      ),
    [articles, categories, searchTerm, selectedCategory],
  );

  const hasFilters = searchTerm.trim() !== "" || selectedCategory !== "all";

  function resetFilters() {
    setSearchTerm("");
    setSelectedCategory("all");
  }

  function scrollToArticles() {
    setSelectedCategory("all");

    document.getElementById("articulos")?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  const categoryButtonClass = (active: boolean) =>
    `
      shrink-0 rounded-full px-5 py-3
      text-xs font-bold transition-all
      ${
        active
          ? "bg-[#22264b] text-white shadow-lg shadow-[#22264b]/10 dark:bg-[#9dbf14] dark:text-[#22264b]"
          : "border border-[#22264b]/10 bg-[#fffefa]/75 text-slate-600 hover:border-[#9dbf14] dark:border-white/10 dark:bg-[#101a2c] dark:text-slate-300"
      }
    `;

  return (
    <div className="relative isolate min-h-screen text-[#22264b] dark:text-white">
      <Header
        dark={dark}
        user={user}
        onToggleTheme={onToggleTheme}
        onConfirmLogout={onConfirmLogout}
        onOpenProfile={onOpenProfile}
        onOpenLogin={onOpenLogin}
        onOpenRegister={onOpenRegister}
        onOpenAdmin={onOpenAdmin}
        onOpenKnowledge={onOpenKnowledge}
      />

      <div className="h-22" aria-hidden="true" />

      <main id="conocimiento">
        {/* HERO EDITORIAL */}
        <section className="relative isolate overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
          >
            <motion.div
              animate={
                reducedMotion
                  ? undefined
                  : { y: [0, -18, 0], rotate: [0, 4, 0] }
              }
              transition={{
                duration: 14,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                absolute -right-44 -top-48 size-142.5
                rounded-full border border-[#9dbf14]/20
                bg-[#9dbf14]/2.5
                dark:bg-[#9dbf14]/3.5
              "
            />

            <div
              className="
                absolute -left-40 bottom-0 size-105
                rounded-full bg-[#9dbf14]/5.5 blur-[120px]
                dark:bg-[#9dbf14]/8
              "
            />

            <div
              className="
                absolute right-[12%] top-[28%] size-3 rounded-full
                bg-[#9dbf14]/40
                shadow-[0_0_24px_8px_rgba(157,191,20,0.12)]
              "
            />

            <div
              className="
                absolute left-[12%] top-[68%] size-2 rounded-full
                bg-[#3163a2]/50
                shadow-[0_0_20px_8px_rgba(49,99,162,0.12)]
              "
            />
          </div>

          <div className="mx-auto max-w-360 px-5 pb-14 pt-12 sm:px-8 lg:px-12 lg:pb-20 lg:pt-16">
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reducedMotion ? 0 : 0.8,
                ease: easeOut,
              }}
              className="mb-12 max-w-4xl"
            >
              <div
                className="
                  mb-6 inline-flex items-center gap-2.5
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
                  max-w-4xl text-4xl font-semibold leading-[1.08]
                  tracking-[-0.045em] text-[#22264b]
                  sm:text-5xl lg:text-[68px]
                  dark:text-white
                "
              >
                Ideas que impulsan{" "}
                <span className="block text-[#789900] dark:text-[#b4d63d]">
                  mejores decisiones.
                </span>
              </h1>

              <div className="mt-6 flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
                <p
                  className="
                    max-w-2xl text-base leading-7
                    text-slate-600 sm:text-lg
                    dark:text-slate-400
                  "
                >
                  Conocimiento financiero, estrategias y herramientas para
                  comprender mejor tu negocio y encontrar nuevas oportunidades
                  de crecimiento.
                </p>

                <button
                  type="button"
                  onClick={scrollToArticles}
                  className="
                    inline-flex w-fit shrink-0 items-center gap-3
                    rounded-full bg-[#22264b] px-6 py-3.5
                    text-sm font-bold text-white
                    transition-all hover:-translate-y-1
                    hover:bg-[#3163a2]
                    hover:shadow-xl hover:shadow-[#22264b]/15
                    dark:bg-[#b4d63d] dark:text-[#22264b]
                    dark:hover:bg-[#dff090]
                  "
                >
                  Explorar artículos
                  <ArrowRight size={17} />
                </button>
              </div>
            </motion.div>

            {/* ARTÍCULO DESTACADO */}
            {loading && (
              <div className="h-117.5 animate-pulse rounded-[30px] bg-slate-200/80 dark:bg-white/5" />
            )}

            {!loading && topFeature && (
              <FeaturedArticle
                article={topFeature}
                onOpenArticle={onOpenArticle}
                reducedMotion={reducedMotion}
              />
            )}

            {!loading && !topFeature && (
              <div
                className="
                  rounded-[28px] border border-slate-200
                  bg-white/90 p-10 text-center
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

            {!loading && sideArticles.length > 0 && (
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {sideArticles.map((article, index) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    onOpenArticle={onOpenArticle}
                    index={index}
                    reducedMotion={reducedMotion}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* EXPLORADOR DE ARTÍCULOS */}
        <section
          id="articulos"
          className="scroll-mt-28 border-t border-[#22264b]/6 dark:border-white/6"
        >
          <div className="mx-auto max-w-360 px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
            <motion.div
              variants={reveal}
              initial={reducedMotion ? false : "hidden"}
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: reducedMotion ? 0 : 0.7,
                ease: easeOut,
              }}
              className="
                mb-10 flex flex-col gap-7
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
                    text-[#22264b] sm:text-4xl dark:text-white
                  "
                >
                  Conocimiento para crecer
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Explora contenidos sobre financiación, gestión empresarial y
                  herramientas para tomar decisiones.
                </p>
              </div>

              <div className="relative w-full lg:max-w-md">
                <Search
                  size={18}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="¿Qué tema te interesa?"
                  aria-label="Buscar artículos"
                  className="
                    h-14 w-full rounded-2xl
                    border border-[#22264b]/10
                    bg-[#fffefa]/90 pl-12 pr-12
                    text-sm text-[#22264b]
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
                      transition-colors hover:text-[#789900]
                    "
                  >
                    <X size={17} />
                  </button>
                )}
              </div>
            </motion.div>

            {/* CATEGORÍAS */}
            <div className="mb-9 flex gap-2 overflow-x-auto pb-3 scrollbar-thin">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                aria-pressed={selectedCategory === "all"}
                className={categoryButtonClass(selectedCategory === "all")}
              >
                Todos los temas
              </button>

              {categories.map((category) => (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() => setSelectedCategory(category.slug)}
                  aria-pressed={selectedCategory === category.slug}
                  className={categoryButtonClass(
                    selectedCategory === category.slug,
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* RESULTADOS */}
            {loading && <ArticleSkeleton />}

            {!loading && filteredArticles.length > 0 && (
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
                      onClick={resetFilters}
                      className="
                        font-semibold text-[#3163a2]
                        transition-colors hover:text-[#789900]
                        dark:text-[#b4d63d]
                      "
                    >
                      Limpiar filtros
                    </button>
                  )}
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredArticles.map((article, index) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      onOpenArticle={onOpenArticle}
                      index={index}
                      reducedMotion={reducedMotion}
                    />
                  ))}
                </div>
              </>
            )}

            {!loading && filteredArticles.length === 0 && (
              <EmptyArticles onReset={resetFilters} />
            )}
          </div>
        </section>

        {/* SOLUCIONES FINANCIERAS */}
        <section
          className="
            relative isolate overflow-hidden
            bg-[#22264b] py-20 text-white
            dark:bg-[#0b1424]
          "
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
          >
            <motion.div
              animate={
                reducedMotion
                  ? undefined
                  : { rotate: [0, 8, 0], scale: [1, 1.04, 1] }
              }
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                absolute -right-24 -top-44 size-120
                rounded-full border border-[#9dbf14]/20
              "
            />

            <div
              className="
                absolute -right-5 -top-28 size-72
                rounded-full border border-[#9dbf14]/15
              "
            />

            <div
              className="
                absolute -left-40 -bottom-45 size-96
                rounded-full bg-[#9dbf14]/10 blur-3xl
              "
            />

            <div
              className="
                absolute inset-0 opacity-40
                bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)]
                bg-size-[54px_54px]
              "
            />
          </div>

          <div className="mx-auto max-w-360 px-5 sm:px-8 lg:px-12">
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: reducedMotion ? 0 : 0.7,
                ease: easeOut,
              }}
              className="mb-12 max-w-2xl"
            >
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
                  mt-5 text-3xl font-bold leading-tight
                  tracking-tight sm:text-5xl
                "
              >
                Entender las alternativas es el primer paso para crecer.
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-300 sm:text-base">
                Conoce algunas de las herramientas financieras que pueden ayudar
                a fortalecer la liquidez y operación de tu empresa.
              </p>
            </motion.div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {solutions.map((item, index) => (
                <motion.div
                  key={item.number}
                  initial={reducedMotion ? false : { opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.55,
                    delay: reducedMotion ? 0 : index * 0.07,
                    ease: easeOut,
                  }}
                  whileHover={reducedMotion ? undefined : { y: -6 }}
                  className="
                    group relative overflow-hidden
                    rounded-[22px] border border-white/10
                    bg-white/4.5 p-6
                    transition-all duration-300
                    hover:border-[#9dbf14]/50
                    hover:bg-white/8.5
                  "
                >
                  <div className="mb-7 flex items-center justify-between">
                    <span
                      className="
                        grid size-10 place-items-center
                        rounded-xl bg-[#9dbf14]/15
                        text-[#b4d63d]
                        transition-transform duration-300
                        group-hover:rotate-6 group-hover:scale-110
                      "
                    >
                      <ArrowUpRight size={19} />
                    </span>

                    <span className="text-xs font-semibold tracking-widest text-white/30">
                      {item.number}
                    </span>
                  </div>

                  <h3 className="text-base font-bold">{item.title}</h3>

                  <p className="mt-3 text-xs leading-6 text-slate-400">
                    {item.description}
                  </p>

                  <div
                    className="
                      absolute -bottom-12 -right-12 size-28
                      rounded-full border border-[#9dbf14]/10
                      transition-transform duration-500
                      group-hover:scale-150
                    "
                  />
                </motion.div>
              ))}
            </div>

            <div
              className="
                mt-14 flex flex-col items-start
                justify-between gap-6 border-t
                border-white/15 pt-9
                sm:flex-row sm:items-center
              "
            >
              <div>
                <p className="text-xl font-bold">
                  ¿Buscas alternativas para tu empresa?
                </p>

                <p className="mt-2 text-sm text-slate-300">
                  En Aserco te acompañamos a encontrar soluciones.
                </p>
              </div>

              <a
                href="mailto:hola@asercosmartfinance.com"
                className="
                  inline-flex shrink-0 items-center gap-3
                  rounded-full bg-[#9dbf14] px-6 py-3.5
                  text-sm font-bold text-[#22264b]
                  transition-all hover:-translate-y-1
                  hover:gap-5 hover:bg-[#b4d63d]
                  hover:shadow-lg hover:shadow-[#9dbf14]/20
                "
              >
                Conversemos
                <ArrowRight size={17} />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
