import {
  ArrowUp,
  ArrowUpRight,
  Mail,
  MapPin,
  MessageCircle,
  Sparkles,
} from "lucide-react";

import { motion, useReducedMotion } from "motion/react";
import { Brand } from "../atoms/Brand";

const footerLinks = [
  { label: "Inicio", href: "#inicio" },
  { label: "Servicios financieros", href: "#servicios" },
  { label: "Cómo trabajamos", href: "#nosotros" },
  { label: "Línea personas", href: "#personas" },
  { label: "Contacto", href: "#contacto" },
];

const footerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const footerItem = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export function Footer() {
  const currentYear = new Date().getFullYear();
  const reduceMotion = useReducedMotion();

  const reveal = reduceMotion
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.1 },
      };

  return (
    <footer
      className="
        relative isolate overflow-hidden
        border-t border-slate-200/70
        bg-white text-slate-600
        transition-colors duration-300
        dark:border-white/[0.07]
        dark:bg-[#080e20]
        dark:text-slate-300
      "
    >
      {/* Fondo decorativo */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="
            absolute -right-32 -top-40
            size-105 rounded-full
            bg-[#9dbf14]/10 blur-[130px]
          "
        />

        <div
          className="
            absolute -left-32 bottom-0
            size-95 rounded-full
            bg-[#3163a2]/10 blur-[120px]
          "
        />

        <div
          className="
            absolute left-[10%] top-10
            size-48 rounded-full
            border border-[#3163a2]/10
          "
        />

        <div
          className="
            absolute left-[12%] top-16
            size-36 rounded-full
            border border-[#9dbf14]/10
          "
        />
      </div>

      {/* WhatsApp flotante */}
      <motion.a
        href="https://wa.me/573144142937"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chatear por WhatsApp"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        whileHover={reduceMotion ? undefined : { scale: 1.1, y: -4 }}
        whileTap={reduceMotion ? undefined : { scale: 0.92 }}
        className="
          fixed bottom-6 right-6 z-50
          grid size-14 place-items-center
          rounded-full bg-[#25D366] text-white
          shadow-[0_16px_35px_rgba(37,211,102,0.35)]
          transition-shadow duration-300
          hover:shadow-[0_18px_45px_rgba(37,211,102,0.45)]
        "
      >
        <MessageCircle size={26} />

        <motion.span
          aria-hidden="true"
          animate={
            reduceMotion
              ? undefined
              : { scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }
          }
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute inset-0 rounded-full
            border-2 border-[#25D366]
          "
        />
      </motion.a>

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        {/* Contenido principal */}
        <motion.div
          {...reveal}
          variants={footerContainer}
          animate={reduceMotion ? "visible" : undefined}
          className="
            grid gap-12 py-16
            md:grid-cols-2
            lg:grid-cols-[1.3fr_.7fr_1fr]
            lg:gap-16 lg:py-20
          "
        >
          {/* Marca */}
          <motion.div variants={footerItem}>
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-block"
            >
              <Brand />
            </motion.div>

            <p
              className="
                mt-6 max-w-sm text-sm leading-7
                text-slate-500 dark:text-slate-400
              "
            >
              Conectamos empresas con oportunidades financieras a través de una
              gestión estratégica, cercana y orientada a sus necesidades.
            </p>

            <div
              className="
                mt-7 inline-flex items-center gap-2
                rounded-full border border-[#9dbf14]/20
                bg-[#9dbf14]/10 px-4 py-2
                text-[10px] font-bold uppercase
                tracking-[0.16em]
                text-[#789900] dark:text-[#b5d83d]
              "
            >
              <Sparkles size={13} />
              Smart Finance para empresas
            </div>
          </motion.div>

          {/* Navegación */}
          <motion.div variants={footerItem}>
            <h3
              className="
                text-xs font-bold uppercase
                tracking-[0.2em]
                text-slate-900 dark:text-white
              "
            >
              Explora
            </h3>

            <nav className="mt-7 flex flex-col gap-4">
              {footerLinks.map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  whileHover={reduceMotion ? undefined : { x: 5 }}
                  className="
                    group inline-flex w-fit items-center gap-2
                    text-sm text-slate-500
                    transition-colors duration-200
                    hover:text-[#789900]
                    dark:text-slate-400
                    dark:hover:text-[#b5d83d]
                  "
                >
                  <span
                    className="
                      size-1.5 rounded-full bg-[#9dbf14]
                      opacity-0 transition-opacity duration-200
                      group-hover:opacity-100
                    "
                  />
                  {link.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>

          {/* Contacto */}
          <motion.div variants={footerItem}>
            <h3
              className="
                text-xs font-bold uppercase
                tracking-[0.2em]
                text-slate-900 dark:text-white
              "
            >
              Contáctanos
            </h3>

            <div className="mt-7 space-y-4">
              {/* Correo */}
              <motion.a
                href="mailto:ceo@aserco.com.co"
                whileHover={reduceMotion ? undefined : { x: 4 }}
                className="
                  group flex items-start gap-3
                  rounded-xl transition-colors
                  hover:text-[#789900]
                  dark:hover:text-[#b5d83d]
                "
              >
                <div
                  className="
                    grid size-10 shrink-0 place-items-center
                    rounded-xl bg-[#9dbf14]/10
                    text-[#789900]
                    transition-colors duration-300
                    group-hover:bg-[#9dbf14]/20
                    dark:text-[#b5d83d]
                  "
                >
                  <Mail size={18} />
                </div>

                <div className="min-w-0 pt-1.5">
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Correo electrónico
                  </p>
                  <p className="mt-1 break-all text-sm font-semibold">
                    ceo@aserco.com.co
                  </p>
                </div>

                <ArrowUpRight
                  size={15}
                  className="
                    ml-auto mt-2 shrink-0
                    text-slate-400 opacity-0
                    transition-all duration-300
                    group-hover:translate-x-1
                    group-hover:-translate-y-1
                    group-hover:opacity-100
                  "
                />
              </motion.a>

              {/* WhatsApp */}
              <motion.a
                href="https://wa.me/573144142937"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={reduceMotion ? undefined : { x: 4 }}
                className="
                  group flex items-start gap-3
                  rounded-xl transition-colors
                  hover:text-[#789900]
                  dark:hover:text-[#b5d83d]
                "
              >
                <div
                  className="
                    grid size-10 shrink-0 place-items-center
                    rounded-xl bg-[#25D366]/10
                    text-[#0d9c43]
                    transition-colors duration-300
                    group-hover:bg-[#25D366]/20
                    dark:text-[#58d98d]
                  "
                >
                  <MessageCircle size={18} />
                </div>

                <div className="min-w-0 pt-1.5">
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    WhatsApp
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    Escríbenos directamente
                  </p>
                </div>

                <ArrowUpRight
                  size={15}
                  className="
                    ml-auto mt-2 shrink-0
                    text-slate-400 opacity-0
                    transition-all duration-300
                    group-hover:translate-x-1
                    group-hover:-translate-y-1
                    group-hover:opacity-100
                  "
                />
              </motion.a>

              {/* Ubicación */}
              <div className="flex items-start gap-3">
                <div
                  className="
                    grid size-10 shrink-0 place-items-center
                    rounded-xl bg-[#9dbf14]/10
                    text-[#789900] dark:text-[#b5d83d]
                  "
                >
                  <MapPin size={18} />
                </div>

                <div className="pt-1.5">
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Ubicación
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    Villavicencio, Colombia
                  </p>
                </div>
              </div>
            </div>

            <motion.a
              href="#contacto"
              whileHover={reduceMotion ? undefined : { x: 4 }}
              className="
                group mt-8 inline-flex items-center gap-2
                text-sm font-bold
                text-[#789900]
                transition-colors duration-200
                hover:text-[#9dbf14]
                dark:text-[#b5d83d]
              "
            >
              Hablemos de tu empresa
              <ArrowUpRight
                size={17}
                className="
                  transition-transform duration-300
                  group-hover:translate-x-1
                  group-hover:-translate-y-1
                "
              />
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Línea inferior */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="
            flex flex-col gap-5
            border-t border-slate-200/80
            py-7
            dark:border-white/10
            sm:flex-row sm:items-center
            sm:justify-between
          "
        >
          <p
            className="
              text-xs text-slate-500
              dark:text-slate-400
            "
          >
            © {currentYear} Aserco Smart Finance. Todos los derechos reservados.
          </p>

          <div className="flex items-center justify-between gap-6 sm:justify-end">
            <span
              className="
                text-[10px] font-semibold uppercase
                tracking-[0.16em]
                text-slate-400 dark:text-slate-500
              "
            >
              Soluciones financieras
            </span>

            <motion.a
              href="#inicio"
              aria-label="Volver al inicio"
              whileHover={
                reduceMotion ? undefined : { y: -4, scale: 1.05, rotate: 0 }
              }
              whileTap={reduceMotion ? undefined : { scale: 0.9 }}
              className="
                group grid size-11 place-items-center
                rounded-full border border-slate-200
                bg-slate-50 text-slate-600
                shadow-sm transition-colors duration-300
                hover:border-[#9dbf14]
                hover:bg-[#9dbf14]
                hover:text-[#22264b]
                dark:border-white/10
                dark:bg-white/4
                dark:text-slate-300
              "
            >
              <ArrowUp
                size={18}
                className="transition-transform duration-300 group-hover:-translate-y-1"
              />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
