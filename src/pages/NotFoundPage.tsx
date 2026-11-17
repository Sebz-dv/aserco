import { motion } from "motion/react";
import { ArrowUpRight, Compass, Home, Search } from "lucide-react";

type NotFoundPageProps = Readonly<{
  onBackHome: () => void;
}>;

export function NotFoundPage({ onBackHome }: NotFoundPageProps) {
  return (
    <main className="app-background relative isolate flex min-h-screen items-center justify-center overflow-hidden px-6 py-16 text-[#22264b] dark:text-white">
      {/* Elementos decorativos */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 top-10 size-[420px] rounded-full bg-[#9dbf14]/10 blur-[120px]" />
        <div className="absolute -right-40 bottom-0 size-[460px] rounded-full bg-[#3163a2]/10 blur-[130px]" />
        <div className="absolute left-1/2 top-1/2 size-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#3163a2]/10" />
        <div className="absolute left-1/2 top-1/2 size-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#9dbf14]/10" />
      </div>

      <motion.section
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto w-full max-w-2xl text-center"
      >
        {/* Icono superior */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-auto mb-8 flex size-16 items-center justify-center rounded-2xl border border-[#9dbf14]/25 bg-white/70 text-[#3163a2] shadow-lg shadow-[#3163a2]/10 backdrop-blur-xl dark:bg-[#101c32]/70 dark:text-[#9dbf14]"
        >
          <Compass size={29} strokeWidth={1.7} />
        </motion.div>

        {/* Número 404 */}
        <div className="relative mb-5">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="select-none text-[clamp(7rem,22vw,13rem)] leading-[0.85] font-extrabold tracking-[-0.09em] text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(120deg, #3163a2 10%, #527eb4 45%, #9dbf14 90%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
            }}
          >
            404
          </motion.p>

          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-1 top-0 hidden rounded-2xl border border-[#9dbf14]/25 bg-white/80 p-3 text-[#9dbf14] shadow-xl backdrop-blur-xl sm:block dark:bg-[#101c32]/80"
          >
            <Search size={23} />
          </motion.div>
        </div>

        {/* Contenido */}
        <div className="mx-auto max-w-xl rounded-[2rem] border border-white/70 bg-white/65 p-8 shadow-2xl shadow-[#22264b]/10 backdrop-blur-2xl sm:p-10 dark:border-white/10 dark:bg-[#101c32]/65 dark:shadow-black/20">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#3163a2]/15 bg-[#3163a2]/5 px-3.5 py-1.5 text-xs font-bold tracking-[0.14em] text-[#3163a2] uppercase dark:border-[#9dbf14]/20 dark:bg-[#9dbf14]/10 dark:text-[#b9d531]">
            <span className="size-1.5 rounded-full bg-[#9dbf14]" />
            Error de navegación
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#22264b] sm:text-3xl dark:text-white">
            Parece que nos hemos
            <span className="block text-[#3163a2] dark:text-[#9dbf14]">
              salido del camino.
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-300">
            La página que buscas no existe, fue movida o ya no está disponible.
            Pero no te preocupes, podemos ayudarte a encontrar el camino de
            regreso.
          </p>

          {/* Acciones */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <motion.button
              type="button"
              onClick={onBackHome}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#3163a2] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#3163a2]/20 transition-colors hover:bg-[#254d83] sm:w-auto dark:bg-[#9dbf14] dark:text-[#17200b] dark:hover:bg-[#b9d531]"
            >
              <Home size={17} />
              Volver al inicio
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </motion.button>
          </div>
        </div>

        {/* Pie */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-8 text-xs font-medium tracking-wide text-slate-500 dark:text-slate-400"
        >
          ASERCO SMART FINANCE
          <span className="mx-2 text-[#9dbf14]">•</span>
          Soluciones financieras inteligentes
        </motion.p>
      </motion.section>
    </main>
  );
}
