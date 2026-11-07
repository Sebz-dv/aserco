import { ArrowLeft, Clock3, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getKnowledgeArticle, type KnowledgeArticleRecord } from '../lib/api';

type Props = {
  slug: string;
  onBack: () => void;
};

export function KnowledgeArticlePage({ slug, onBack }: Props) {
  const [article, setArticle] = useState<KnowledgeArticleRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const data = await getKnowledgeArticle(slug);
        if (!active) return;
        setArticle(data);
      } catch {
        if (!active) return;
        setArticle(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7f2] p-10 text-[#1c2440]">
        <div className="mx-auto max-w-5xl animate-pulse rounded-[32px] bg-white p-8 shadow-[0_20px_60px_rgba(29,53,87,0.08)]">
          <div className="mb-6 h-6 w-32 rounded bg-slate-200" />
          <div className="h-[420px] w-full rounded-[24px] bg-slate-200" />
          <div className="mt-8 h-8 w-2/3 rounded bg-slate-200" />
          <div className="mt-5 h-4 w-full rounded bg-slate-200" />
          <div className="mt-3 h-4 w-5/6 rounded bg-slate-200" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#f5f7f2] p-10 text-[#1c2440]">
        <div className="mx-auto max-w-3xl rounded-[24px] bg-white p-8 shadow-xl">
          <h1 className="text-3xl font-bold">Artículo no encontrado</h1>
          <p className="mt-4 text-slate-600">El contenido solicitado no existe o aún no está publicado.</p>
          <button type="button" onClick={onBack} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#1d3557]">
            <ArrowLeft size={14} /> Volver a conocimiento
          </button>
        </div>
      </div>
    );
  }

  const articleContent = article.content?.trim().startsWith('<')
    ? article.content
    : article.content?.replace(/\n{2,}/g, '</p><p>').replace(/\n/g, '<br />')
  const contentHtml = articleContent ? `<p>${articleContent}</p>` : '<p>Contenido editorial disponible próximamente.</p>';

  return (
    <div className="min-h-screen bg-[#f5f7f2] text-[#1c2440]">
      <main className="mx-auto max-w-5xl px-5 py-10 lg:py-16">
        <button type="button" onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#1d3557]">
          <ArrowLeft size={14} /> Volver a Conocimiento
        </button>

        <article className="overflow-hidden rounded-[32px] bg-white shadow-[0_20px_60px_rgba(29,53,87,0.08)]">
          <img src={article.cover_image_url ?? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'} alt={article.title} className="h-[420px] w-full object-cover" />
          <div className="space-y-7 p-6 lg:p-10">
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span className="rounded-full bg-[#edf5c5] px-3 py-1 font-bold uppercase tracking-[0.2em] text-[#1d3557]">
                {article.category_name ?? 'General'}
              </span>
              <span className="inline-flex items-center gap-2"><Clock3 size={14} /> {article.read_time ?? 5} min de lectura</span>
              <span className="inline-flex items-center gap-2"><UserRound size={14} /> {article.author_name ?? 'Aserco'}</span>
            </div>

            <h1 className="text-4xl font-bold leading-tight text-[#1c2440] lg:text-5xl">{article.title}</h1>
            <p className="text-xl text-slate-600">{article.subtitle ?? article.excerpt ?? 'Información editorial disponible.'}</p>

            <div
              className="max-w-none text-lg leading-8 text-slate-700"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </div>
        </article>
      </main>
    </div>
  );
}
