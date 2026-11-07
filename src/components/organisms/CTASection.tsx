import { ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react";
const logo2 = new URL("../../assets/logos/logoColor.png", import.meta.url).href;

export function CTASection() {
  return (
    <section className="section-surface py-24 text-slate-900 transition-colors duration-300 dark:bg-[#0c1124] dark:text-white">
      <div className="decor-ring -left-24 bottom-6 size-72 border-[#9dbf14]/20" />
      <div className="decor-orb -bottom-28 -left-24 size-80 bg-[#9dbf14]/6 blur-3xl" />
      <div className="decor-ring right-8 top-10 size-40 border-[#3163a2]/20" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="soft-card relative overflow-hidden rounded-[32px] shadow-[0_24px_60px_rgba(34,38,75,0.08)] dark:shadow-[0_24px_60px_rgba(2,6,23,0.32)]">
          <div className="absolute left-0 top-0 h-1 w-full bg-[linear-gradient(90deg,#b4d831_0%,#9dbf14_45%,rgba(157,191,20,0)_100%)]" />

          <div className="grid lg:grid-cols-[1.3fr_.7fr]">
            {/* Contenido principal */}
            <div className="relative z-10 px-8 py-12 md:px-12 md:py-16 lg:py-20">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#9dbf14]/30 bg-[#9dbf14]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#789900] dark:text-[#c5e76b]">
                <Sparkles size={15} />
                Soluciones financieras
              </div>

              <h2 className="max-w-2xl text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl lg:text-[3.5rem]">
                El siguiente paso de tu empresa comienza con una{" "}
                <span className="text-[#789900] dark:text-[#b5d83d]">
                  buena estrategia financiera.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-300">
                En Aserco Smart Finance conectamos las necesidades de tu negocio
                con oportunidades financieras. Conversemos y descubre cómo
                podemos acompañar el crecimiento de tu empresa.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-5">
                <a
                  href="https://landing.clara.com/es-co/aserco?utm_campaign=danielbalcazar&utm_medium=partnership&utm_source=aserco"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 rounded-full bg-[#9dbf14] px-7 py-4 text-sm font-bold text-[#22264b] shadow-lg shadow-[#9dbf14]/20 transition duration-300 hover:-translate-y-1 hover:bg-[#b5d83d] hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9dbf14]"
                >
                  Conocer nuestra propuesta
                  <ArrowUpRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </a>

                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Construyamos nuevas oportunidades.
                </span>
              </div>
            </div>

            {/* Panel visual */}
            <div className="relative flex min-h-80 items-center justify-center overflow-hidden bg-slate-100 p-8 dark:bg-[#172747] lg:min-h-full">
              <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full border border-[#9dbf14]/20" />
              <div className="pointer-events-none absolute -right-8 -top-8 size-52 rounded-full border border-[#9dbf14]/20" />
              <div className="pointer-events-none absolute -bottom-32 -left-20 size-64 rounded-full bg-[#9dbf14]/10 blur-3xl" />

              <div className="relative w-full max-w-sm">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex size-20 items-center justify-center rounded-2xl bg-[#9dbf14] shadow-lg shadow-[#9dbf14]/20">
                    <img
                      src={logo2}
                      alt="Aserco Smart Finance"
                      className="max-h-14 max-w-14 object-contain"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      Aserco Smart Finance
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      Tu aliado financiero
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-2xl shadow-slate-900/5 backdrop-blur dark:border-white/10 dark:bg-white/6 dark:shadow-black/20">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#789900] dark:text-[#b5d83d]">
                    Nuestro compromiso
                  </p>

                  <h3 className="mt-4 text-2xl font-semibold leading-snug">
                    Entender. Conectar. Acompañar.
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    Una gestión cercana y estratégica, enfocada en las
                    necesidades reales de cada empresa.
                  </p>

                  <div className="mt-6 flex items-center gap-3 border-t border-slate-200 pt-5 dark:border-white/10">
                    <ShieldCheck
                      size={20}
                      className="shrink-0 text-[#789900] dark:text-[#b5d83d]"
                    />

                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Acompañamiento durante el proceso financiero.
                    </span>
                  </div>
                </div>

                <div className="absolute -bottom-10 -right-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl dark:border-white/10 dark:bg-[#0c1124] sm:-right-5">
                  <p className="text-xs font-bold text-[#789900] dark:text-[#b5d83d]">
                    SMART FINANCE
                  </p>

                  <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                    Soluciones para empresas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
