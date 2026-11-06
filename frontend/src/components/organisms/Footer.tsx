import {
  ArrowUp,
  ArrowUpRight,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";

import { Brand } from "../atoms/Brand";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-white text-slate-600 transition-colors duration-300 dark:border-white/10 dark:bg-[#080e20] dark:text-slate-300">
      <div className="decor-orb -right-24 -top-28 size-80 bg-[#9dbf14]/7 blur-[120px]" />
      <div className="decor-ring left-8 top-12 size-44 border-[#3163a2]/15" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <a
          href="https://wa.me/573144142937"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chatear por WhatsApp"
          className="fixed bottom-6 right-6 z-50 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_16px_35px_rgba(37,211,102,0.35)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_18px_40px_rgba(37,211,102,0.45)]"
        >
          <MessageCircle size={26} />
        </a>

        {/* Contenido principal */}
        <div className="grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_.7fr_.9fr] lg:gap-16">
          {/* Marca y descripción */}
          <div>
            <Brand />

            <p className="mt-6 max-w-sm text-sm leading-7 text-slate-500 dark:text-slate-400">
              Conectamos empresas con oportunidades financieras a través de una
              gestión estratégica, cercana y orientada a sus necesidades.
            </p>

            <div className="section-kicker mt-6">
              Smart Finance para empresas
            </div>
          </div>

          {/* Navegación */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-900 dark:text-white">
              Explora
            </h3>

            <nav className="mt-6 flex flex-col gap-4 text-sm">
              <a
                href="#inicio"
                className="transition-colors hover:text-[#789900] dark:hover:text-[#b5d83d]"
              >
                Inicio
              </a>
              <a
                href="#servicios"
                className="transition-colors hover:text-[#789900] dark:hover:text-[#b5d83d]"
              >
                Servicios financieros
              </a>
              <a
                href="#nosotros"
                className="transition-colors hover:text-[#789900] dark:hover:text-[#b5d83d]"
              >
                Cómo trabajamos
              </a>
              <a
                href="#personas"
                className="transition-colors hover:text-[#789900] dark:hover:text-[#b5d83d]"
              >
                Línea personas
              </a>
              <a
                href="#contacto"
                className="transition-colors hover:text-[#789900] dark:hover:text-[#b5d83d]"
              >
                Contacto
              </a>
            </nav>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-900 dark:text-white">
              Contáctanos
            </h3>

            <div className="mt-6 space-y-5 text-sm">
              <a
                href="mailto:ceo@aserco.com.co"
                className="group flex items-start gap-3 transition-colors hover:text-[#789900] dark:hover:text-[#b5d83d]"
              >
                <Mail
                  size={18}
                  className="mt-0.5 shrink-0 text-[#789900] dark:text-[#b5d83d]"
                />
                <span className="break-all">ceo@aserco.com.co</span>
              </a>

              <a
                href="https://wa.me/573144142937"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 transition-colors hover:text-[#789900] dark:hover:text-[#b5d83d]"
              >
                <MessageCircle
                  size={18}
                  className="mt-0.5 shrink-0 text-[#789900] dark:text-[#b5d83d]"
                />
                <span>También puedes escribirnos por WhatsApp</span>
              </a>

              <div className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-[#789900] dark:text-[#b5d83d]"
                />
                <span>Villavicencio, Colombia</span>
              </div>
            </div>

            <a
              href="#contacto"
              className="group mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#789900] transition-colors hover:text-[#9dbf14] dark:text-[#b5d83d]"
            >
              Hablemos de tu empresa
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </a>
          </div>
        </div>

        {/* Línea inferior */}
        <div className="flex flex-col gap-5 border-t border-slate-200 py-6 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            © {currentYear} Aserco Smart Finance. Todos los derechos reservados.
          </p>

          <div className="flex items-center gap-6">
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Soluciones financieras
            </span>

            <a
              href="#inicio"
              aria-label="Volver al inicio"
              className="group grid size-10 place-items-center rounded-full border border-slate-200 bg-slate-50 transition-all hover:border-[#9dbf14] hover:bg-[#9dbf14] hover:text-[#22264b] dark:border-white/10 dark:bg-white/4"
            >
              <ArrowUp
                size={17}
                className="transition-transform group-hover:-translate-y-1"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
