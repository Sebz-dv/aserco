export type KnowledgeArticlePreview = {
  id: number;
  slug: string;
  title: string;
  subtitle?: string | null;
  excerpt?: string | null;
  coverImageUrl?: string | null;
  categoryName?: string | null;
  publishedAt?: string | null;
  readTime?: number | null;
};

export const knowledgeMockArticles: KnowledgeArticlePreview[] = [
  {
    id: 1,
    slug: 'factoring-para-pymes',
    title: 'Factoring para pymes: cómo acelerar liquidez sin comprometer crecimiento',
    subtitle: 'Una guía para tomar decisiones financieras con más control y previsión.',
    excerpt: 'Explora cómo el factoring puede mejorar el flujo de caja y fortalecer la operación de negocios con ventas a crédito.',
    coverImageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    categoryName: 'Finanzas empresariales',
    publishedAt: '2026-11-01',
    readTime: 6,
  },
  {
    id: 2,
    slug: 'flujo-de-caja',
    title: 'Flujo de caja: la brújula que guía decisiones más inteligentes',
    subtitle: 'Entender el movimiento real del dinero evita errores costosos.',
    excerpt: 'Revisa los indicadores clave, los puntos críticos y cómo anticiparse a la volatilidad del negocio.',
    coverImageUrl: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
    categoryName: 'Planeación financiera',
    publishedAt: '2026-10-18',
    readTime: 4,
  },
  {
    id: 3,
    slug: 'capital-de-trabajo',
    title: 'Capital de trabajo: cómo sostener operaciones saludables en temporadas difíciles',
    subtitle: 'Más allá del crecimiento, la operación necesita estabilidad.',
    excerpt: 'Descubre cómo prevenir desbalances de liquidez y responder mejor a la demanda estacional.',
    coverImageUrl: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80',
    categoryName: 'Operación y crecimiento',
    publishedAt: '2026-09-28',
    readTime: 5,
  },
];

export const knowledgeCategories = [
  { slug: 'finanzas-empresariales', name: 'Finanzas empresariales' },
  { slug: 'educacion-financiera', name: 'Educación financiera' },
  { slug: 'alianzas', name: 'Alianzas e innovación' },
  { slug: 'eventos', name: 'Eventos y actividades' },
  { slug: 'convocatorias', name: 'Convocatorias' },
];
