import {
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  ChartNoAxesCombined,
  ShieldCheck,
} from "lucide-react";

import { Button } from "../atoms/Button";
import type { AuthUser } from "../../lib/api";

const logoAserco = new URL(
  "../../assets/logos/LogoAserco1.png",
  import.meta.url,
).href;

const logoAsercoDark = new URL(
  "../../assets/logos/logoAsercoDark.png",
  import.meta.url,
).href;

type Props = Readonly<{
  user: AuthUser | null;
}>;

export function Hero({ user }: Props) {
  return (
    <section
      id="inicio"
      data-reveal
      className="relative isolate overflow-hidden bg-[#f7f8f4] text-[#22264b] transition-colors duration-300 dark:bg-[#050b17] dark:text-white"
    >
      {/* Fondo */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="decor-orb absolute -right-40 -top-48 size-150 rounded-full border border-[#9dbf14]/20 bg-[#9dbf14]/5 dark:border-[#9dbf14]/45 dark:bg-[#9dbf14]/10" />
        <div className="decor-ring absolute -right-20 -top-28 size-110 rounded-full border border-[#9dbf14]/15 dark:border-[#9dbf14]/45 dark:bg-[#9dbf14]/5" />
        <div className="decor-orb absolute -left-40 bottom-0 size-110 rounded-full bg-[#9dbf14]/5 blur-3xl dark:bg-[#9dbf14]/15" />

        <div className="absolute inset-0 bg-[linear-gradient(#22264b_1px,transparent_1px),linear-gradient(90deg,#22264b_1px,transparent_1px)] bg-size-[52px_52px] opacity-[0.035] dark:opacity-[0.07] dark:bg-[linear-gradient(#ffffff_1px,transparent_1px),linear-gradient(90deg,#ffffff_1px,transparent_1px)]" />

        <div className="absolute right-[48%] top-1/2 hidden h-px w-40 bg-[#9dbf14]/30 lg:block" />
      </div>

      <div className="relative mx-auto max-w-360 px-5 pb-16 pt-8 sm:px-8 lg:px-12 lg:pb-24 lg:pt-10">
        {/* Logo */}
        <header className="relative z-30 mb-4 translate-y-12 lg:translate-y-16">
          <a
            href="#inicio"
            aria-label="Aserco Smart Finance, inicio"
            className="inline-flex items-center"
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
        </header>

        {/* Hero principal */}
        <div className="grid items-center gap-14 pt-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 lg:pt-0">
          {/* Columna izquierda */}
          <div className="relative z-10 max-w-2xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-[#9dbf14]/40 bg-[#9dbf14]/10 px-4 py-2.5 text-[11px] font-bold tracking-[0.19em] text-[#647d0b] dark:text-[#dff090]">
              <span className="inline-flex items-center gap-3">
                <span className="size-2 rounded-full bg-[#9dbf14] shadow-[0_0_12px_#9dbf14]" />
                <span>FINANCIACIÓN INTELIGENTE</span>
              </span>
            </div>

            {/* Mensaje principal */}
            <div className="relative">
              <div className="absolute -left-5 top-1 hidden h-24 w-1 rounded-full bg-[#9dbf14] sm:block" />

              <p className="max-w-162.5 text-[30px] font-semibold leading-[1.3] tracking-[-0.045em] text-[#22264b] sm:text-[36px] lg:text-[42px] dark:text-white">
                Simplificamos el acceso a financiación inteligente para impulsar
                la{" "}
                <span className="text-[#789900] dark:text-[#b4d63d]">
                  liquidez, el crecimiento y la expansión
                </span>{" "}
                de tu negocio a través de un ecosistema financiero integral.
              </p>
            </div>

            {/* Botones */}
            <div className="mt-10 flex flex-wrap items-center gap-3">
              {user ? (
                <div className="rounded-full border border-[#9dbf14]/40 bg-[#9dbf14]/10 px-5 py-3 text-sm font-semibold text-[#647d0b] dark:text-[#dff090]">
                  Bienvenido, {user.name}
                </div>
              ) : (
                <>
                  <Button href="#contacto" type="button">
                    Conversemos sobre tu empresa
                  </Button>

                  <Button
                    href="#servicios"
                    type="button"
                    variant="secondary"
                    className="border-slate-300 bg-white/60 text-slate-700 hover:bg-white dark:border-white/25 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                  >
                    Ver servicios
                  </Button>
                </>
              )}
            </div>

            {/* Beneficios */}
            <div className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-2">
              <div className="flex items-center gap-3 border-t border-slate-300/80 py-4 dark:border-white/15">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#9dbf14]/15 text-[#789900] dark:text-[#b4d63d]">
                  <ShieldCheck size={22} />
                </span>
                <span className="text-xs font-semibold leading-5 text-slate-700 dark:text-slate-200">
                  Acompañamiento experto
                </span>
              </div>

              <div className="flex items-center gap-3 border-t border-slate-300/80 py-4 dark:border-white/15">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#9dbf14]/15 text-[#789900] dark:text-[#b4d63d]">
                  <Building2 size={22} />
                </span>
                <span className="text-xs font-semibold leading-5 text-slate-700 dark:text-slate-200">
                  Ecosistema financiero
                </span>
              </div>

              <div className="flex items-center gap-3 border-t border-slate-300/80 py-4 dark:border-white/15">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#9dbf14]/15 text-[#789900] dark:text-[#b4d63d]">
                  <ShieldCheck size={22} />
                </span>
                <span className="text-xs font-semibold leading-5 text-slate-700 dark:text-slate-200">
                  Aprobación y desembolso ágil
                </span>
              </div>
            </div>
          </div>

          {/* Composición financiera derecha */}
          <div className="relative mx-auto w-full max-w-155 lg:ml-auto">
            <div className="absolute -right-16 -top-16 size-64 rounded-full bg-[#9dbf14]/10 blur-3xl dark:bg-[#9dbf14]/16" />
            <div className="absolute -bottom-16 -left-16 size-64 rounded-full bg-[#22264b]/10 blur-3xl dark:bg-[#9dbf14]/10" />

            <div className="absolute -right-7 -top-8 size-36 rounded-full border border-[#9dbf14]/30 dark:border-[#9dbf14]/55" />
            <div className="absolute -right-1 -top-2 size-24 rounded-full border border-[#9dbf14]/20 dark:border-[#9dbf14]/50" />

            <div className="relative space-y-4">
              {/* Bloque principal */}
              <div className="relative min-h-62.5 overflow-hidden rounded-[28px] bg-[#22264b] p-7 text-white shadow-2xl shadow-[#22264b]/20 sm:p-10">
                <div className="absolute -right-14 -top-24 size-72 rounded-full border border-[#9dbf14]/30" />
                <div className="absolute -right-5 -top-16 size-52 rounded-full border border-[#9dbf14]/20" />
                <div className="absolute -bottom-28 right-24 size-56 rounded-full border border-white/10" />

                <div className="relative z-10 flex min-h-47.5 flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#d4e58e]/20 bg-white/5 px-3 py-2 text-[10px] font-bold tracking-[0.22em] text-[#d4e58e] backdrop-blur-sm">
                      <span className="size-2 rounded-full bg-[#9dbf14]" />
                      <span>VISIÓN FINANCIERA</span>
                    </span>

                    <span className="grid size-11 place-items-center rounded-full border border-white/20 bg-white/5 text-[#b4d63d]">
                      <ChartNoAxesCombined size={23} />
                    </span>
                  </div>

                  <div>
                    <p className="max-w-sm text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                      Decisiones con dirección
                    </p>

                    <div className="mt-6 h-1 w-20 rounded-full bg-[#9dbf14]" />
                  </div>
                </div>
              </div>

              {/* Módulos secundarios */}
              <div className="grid grid-cols-2 gap-4">
                <div className="group relative min-h-47.5 overflow-hidden border-y border-slate-300/80 py-6 pr-3 transition-all duration-300 hover:border-[#9dbf14] dark:border-white/15">
                  <div className="absolute -right-10 -top-12 size-32 rounded-full bg-[#9dbf14]/10 transition-transform duration-500 group-hover:scale-125" />

                  <div className="relative">
                    <span className="mb-6 grid size-12 place-items-center rounded-xl bg-[#9dbf14]/20 text-[#789900] dark:text-[#b4d63d]">
                      <Building2 size={23} />
                    </span>

                    <div className="space-y-1">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Gestión
                      </p>

                      <p className="text-4xl font-bold tracking-tight text-[#22264b] dark:text-white">
                        360°
                      </p>
                    </div>

                    <p className="mt-3 max-w-52.5 text-xs leading-5 text-slate-600 dark:text-slate-300">
                      De inicio a seguimiento en todo el proceso.
                    </p>
                  </div>
                </div>

                <div className="group relative min-h-47.5 overflow-hidden border-y border-slate-300/80 py-6 pl-3 transition-all duration-300 hover:border-[#9dbf14] dark:border-white/15">
                  <div className="absolute -right-10 -top-12 size-32 rounded-full bg-[#9dbf14]/10 transition-transform duration-500 group-hover:scale-125" />

                  <div className="relative">
                    <span className="mb-6 grid size-12 place-items-center rounded-xl bg-[#9dbf14]/20 text-[#789900] dark:text-[#b4d63d]">
                      <ArrowUpRight size={23} />
                    </span>

                    <div className="space-y-1">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Acceso
                      </p>

                      <p className="text-4xl font-bold tracking-tight text-[#22264b] dark:text-white">
                        Simple
                      </p>
                    </div>

                    <p className="mt-3 max-w-52.5 text-xs leading-5 text-slate-600 dark:text-slate-300">
                      Rutas claras para tu empresa
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="relative overflow-hidden rounded-3xl bg-[#9dbf14] p-7 text-[#22264b] shadow-xl shadow-[#9dbf14]/15 sm:p-8">
                <div className="pointer-events-none absolute -right-10 -top-24 size-60 rounded-full border border-[#22264b]/20" />
                <div className="pointer-events-none absolute -right-2 -top-16 size-44 rounded-full border border-[#22264b]/15" />

                <div className="relative z-10 flex items-start justify-between gap-5">
                  <div>
                    <p className="text-sm font-bold tracking-tight">
                      Tu próximo paso financiero
                    </p>

                    <p className="mt-5 max-w-md text-2xl font-bold leading-tight tracking-tight sm:text-[27px]">
                      Una estrategia clara empieza con una buena conversación.
                    </p>

                    <a
                      href="#contacto"
                      className="mt-6 inline-flex items-center gap-2 text-sm font-bold transition-transform hover:translate-x-1"
                    >
                      Hablemos
                      <ArrowDownRight size={18} />
                    </a>
                  </div>

                  <a
                    href="#contacto"
                    aria-label="Hablemos"
                    className="grid size-12 shrink-0 place-items-center rounded-full bg-[#22264b] text-[#b4d63d] transition-transform hover:scale-110"
                  >
                    <ArrowUpRight size={23} />
                  </a>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -right-5 -z-10 size-28 rounded-[28px] border border-[#9dbf14]/30" />
          </div>
        </div>
      </div>
    </section>
  );
}
