type NotFoundPageProps = {
  onBackHome: () => void;
};

export function NotFoundPage({ onBackHome }: NotFoundPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f7f2] px-6 text-[#22264b] dark:bg-[#050b17] dark:text-white">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/40 dark:border-white/10 dark:bg-[#121d2d] dark:shadow-black/20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3163a2] dark:text-[#9dbf14]">404</p>
        <h1 className="mt-4 text-3xl font-bold">Página no encontrada</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          La ruta solicitada no existe o ya no está disponible.
        </p>
        <button
          type="button"
          onClick={onBackHome}
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#3163a2] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#254d83] dark:bg-[#9dbf14] dark:text-[#111827] dark:hover:bg-[#b9d531]"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
