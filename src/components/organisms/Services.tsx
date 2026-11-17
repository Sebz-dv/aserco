import {
  Building2,
  Zap,
  Landmark,
  ChartNoAxesCombined,
  Globe2,
  Plane,
  House,
  Users,
  ShieldCheck,
  CreditCard,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

import { motion, useReducedMotion } from "motion/react";
import type { Variants } from "motion/react";

import { SectionHeading } from "../atoms/SectionHeading";

const businessServices = [
  {
    number: "01",
    title: "Tarjetas corporativas y cupo rotativo",
    description:
      "Optimiza los gastos de tu empresa con tarjetas corporativas y herramientas inteligentes para administrar, controlar y monitorear cada movimiento.",
    icon: CreditCard,
    href: "https://landing.clara.com/es-co/aserco?utm_campaign=danielbalcazar&utm_medium=partnership&utm_source=aserco",
    featured: true,
  },
  {
    number: "02",
    title: "SaaS de administración de gastos",
    description:
      "Plataforma inteligente para centralizar, categorizar y analizar los gastos y movimientos de la empresa, con trazabilidad y apoyo para decisiones más eficientes.",
    icon: ChartNoAxesCombined,
    href: "https://wa.me/573144142937",
  },
  {
    number: "03",
    title: "Factoring y Confirming",
    description:
      "Soluciones para gestionar cuentas por cobrar, anticipar liquidez y optimizar los pagos de tu empresa.",
    icon: ChartNoAxesCombined,
    href: "https://wa.me/573144142937",
  },
  {
    number: "04",
    title: "Eficiencia energética",
    description:
      "Alternativas de financiación para proyectos que buscan optimizar el consumo energético empresarial.",
    icon: Zap,
    href: "https://wa.me/573144142937",
  },
  {
    number: "05",
    title: "Créditos con garantía real",
    description:
      "Financiación empresarial respaldada con garantías reales, con procesos ágiles de aprobación y desembolso.",
    icon: ShieldCheck,
    href: "https://wa.me/573144142937",
  },
  {
    number: "06",
    title: "Créditos productivos",
    description:
      "Estructuración de soluciones de crédito de acuerdo con las necesidades y capacidad financiera de cada empresa.",
    icon: Building2,
    href: "https://wa.me/573144142937",
  },
  {
    number: "07",
    title: "Trade Finance",
    description:
      "Instrumentos financieros para facilitar y respaldar las operaciones de comercio exterior.",
    icon: Globe2,
    href: "https://wa.me/573144142937",
  },
  {
    number: "08",
    title: "Factoring de exportación",
    description:
      "Alternativas de liquidez para empresas que venden sus productos y servicios en mercados internacionales.",
    icon: Plane,
    href: "https://wa.me/573144142937",
  },
];

const personalServices = [
  {
    number: "01",
    title: "Crédito para vivienda",
    description:
      "Alternativas de financiación para quienes buscan adquirir su vivienda.",
    icon: House,
    href: "https://wa.me/573144142937",
  },
  {
    number: "02",
    title: "Créditos para pensionados",
    description:
      "Opciones de financiación con procesos de aprobación ágiles para pensionados.",
    icon: Users,
    href: "https://wa.me/573144142937",
  },
  {
    number: "03",
    title: "Créditos con garantía real",
    description: "Soluciones de financiación respaldadas por bienes inmuebles.",
    icon: Landmark,
    href: "https://wa.me/573144142937",
  },
];

// Animaciones generales
const sectionVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Animaciones de las tarjetas
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.08,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 45,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Animación de encabezados de categoría
const headingVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function Services() {
  const shouldReduceMotion = useReducedMotion();

  const renderCards = (
    items: typeof businessServices | typeof personalServices,
    category: string,
  ) => (
    <motion.div
      className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      variants={containerVariants}
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isClara = "featured" in item && item.featured;

        return (
          <motion.a
            key={item.number + item.title}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            variants={cardVariants}
            whileHover={
              shouldReduceMotion
                ? undefined
                : {
                    y: -10,
                    scale: 1.015,
                    transition: {
                      duration: 0.3,
                      ease: "easeOut",
                    },
                  }
            }
            whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
            className={`group relative flex h-full min-h-[310px] flex-col overflow-hidden rounded-[26px] border p-6 transition-[border-color,box-shadow] duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9dbf14] focus-visible:ring-offset-2 ${
              isClara
                ? "border-[#9dbf14]/60 bg-gradient-to-br from-[#f7fbe9] via-white to-[#edf4d8] shadow-[0_12px_38px_rgba(157,191,20,0.16)] hover:border-[#9dbf14] hover:shadow-[0_24px_60px_rgba(157,191,20,0.25)] dark:from-[#26351e] dark:via-[#172239] dark:to-[#1d2b25] dark:border-[#b5d83d]/40"
                : "border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(34,38,75,0.045)] hover:border-[#9dbf14]/50 hover:shadow-[0_22px_50px_rgba(34,38,75,0.11)] dark:border-white/[0.09] dark:bg-[#172239] dark:hover:border-[#b5d83d]/40 dark:hover:shadow-[0_22px_50px_rgba(0,0,0,0.25)]"
            }`}
          >
            {/* Barra superior animada */}
            <motion.div
              className="absolute left-0 top-0 h-[3px] w-full origin-left bg-gradient-to-r from-[#b5d83d] via-[#9dbf14] to-transparent"
              initial={{ scaleX: shouldReduceMotion ? 1 : 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.9,
                delay: shouldReduceMotion ? 0 : 0.2,
                ease: "easeOut",
              }}
            />

            {/* Decoración circular */}
            <motion.div
              className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full border border-[#9dbf14]/10 dark:border-[#b5d83d]/10"
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      rotate: [0, 12, 0],
                      scale: [1, 1.06, 1],
                    }
              }
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <motion.div
              className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-[#9dbf14]/[0.045] blur-2xl dark:bg-[#b5d83d]/[0.04]"
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : {
                      scale: 1.5,
                      opacity: 1,
                    }
              }
              transition={{ duration: 0.6 }}
            />

            <motion.div
              className="pointer-events-none absolute -bottom-16 -left-16 size-40 rounded-full bg-[#9dbf14]/[0.035] blur-3xl"
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      x: [0, 15, 0],
                      y: [0, -12, 0],
                    }
              }
              transition={{
                duration: 9,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Etiquetas Clara */}
            {isClara && (
              <motion.div
                className="relative z-10 mb-5 flex flex-wrap items-center justify-between gap-2"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#9dbf14]/30 bg-[#9dbf14]/10 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.13em] text-[#718d0b] dark:text-[#c5e76b]">
                  <Sparkles size={12} />
                  Parceria Aserco
                </span>

                <span className="rounded-full bg-[#9dbf14] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-wider text-[#22264b] shadow-sm">
                  Solución destacada
                </span>
              </motion.div>
            )}

            {/* Cabecera */}
            <div className="relative z-10 flex items-center justify-between">
              <motion.div
                className="relative grid size-[62px] shrink-0 place-items-center rounded-[21px] border border-[#9dbf14]/20 bg-gradient-to-br from-[#b5d83d]/20 via-[#9dbf14]/10 to-transparent text-[#789900] shadow-[0_5px_20px_rgba(157,191,20,0.08)] dark:border-[#b5d83d]/20 dark:from-[#b5d83d]/20 dark:text-[#c5e76b]"
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : {
                        rotate: -8,
                        scale: 1.12,
                        borderRadius: "24px",
                      }
                }
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                }}
              >
                <Icon size={27} strokeWidth={1.7} />

                <motion.span
                  className="absolute -right-1 -top-1 size-3 rounded-full border-2 border-white bg-[#b5d83d] dark:border-[#172239]"
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : {
                          scale: [1, 1.35, 1],
                          opacity: [1, 0.65, 1],
                        }
                  }
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>

              <span className="select-none text-[34px] font-bold tracking-[-0.06em] text-[#22264b]/[0.07] transition-colors duration-500 group-hover:text-[#9dbf14]/40 dark:text-white/[0.07] dark:group-hover:text-[#b5d83d]/40">
                {item.number}
              </span>
            </div>

            {/* Contenido */}
            <div className="relative z-10 mt-5 flex flex-1 flex-col">
              <div className="mb-3 flex items-center gap-2">
                <motion.span
                  className="size-1.5 rounded-full bg-[#9dbf14]"
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.8 }}
                />

                <span className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#829f12] dark:text-[#b5d83d]">
                  {category}
                </span>
              </div>

              <h4 className="text-[17px] font-bold leading-[1.4] tracking-tight text-[#22264b] transition-colors duration-300 group-hover:text-[#789900] dark:text-white dark:group-hover:text-[#c5e76b]">
                {item.title}
              </h4>

              <p className="mt-3 flex-1 text-[12px] leading-[1.8] text-slate-500 dark:text-slate-400">
                {item.description}
              </p>

              {/* Footer */}
              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-white/[0.08]">
                <span className="text-[10px] font-bold tracking-wide text-[#789900] transition-colors duration-300 group-hover:text-[#9dbf14] dark:text-[#b5d83d]">
                  {isClara ? "Descubre los beneficios" : "Conoce esta solución"}
                </span>

                <motion.div
                  className="grid size-9 place-items-center rounded-full border border-[#9dbf14]/15 bg-[#9dbf14]/[0.07] text-[#829f12] transition-colors duration-300 group-hover:border-[#9dbf14] group-hover:bg-[#9dbf14] group-hover:text-white dark:border-[#b5d83d]/15 dark:bg-[#b5d83d]/[0.07] dark:text-[#b5d83d] dark:group-hover:bg-[#b5d83d] dark:group-hover:text-[#22264b]"
                  whileHover={
                    shouldReduceMotion
                      ? undefined
                      : {
                          x: 4,
                          y: -4,
                          rotate: 8,
                        }
                  }
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                  }}
                >
                  <ArrowUpRight size={17} />
                </motion.div>
              </div>
            </div>
          </motion.a>
        );
      })}
    </motion.div>
  );

  return (
    <section
      id="servicios"
      className="relative isolate scroll-mt-32 overflow-hidden bg-transparent pt-8 pb-24 text-slate-900 dark:text-white"
    >
      {/* Fondo decorativo superior */}
      <motion.div
        className="pointer-events-none absolute -right-40 top-20 size-[420px] rounded-full bg-[#9dbf14]/[0.05] blur-[110px]"
        animate={
          shouldReduceMotion
            ? undefined
            : {
                scale: [1, 1.15, 1],
                opacity: [0.5, 0.9, 0.5],
                x: [0, -20, 0],
              }
        }
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Fondo decorativo inferior */}
      <motion.div
        className="pointer-events-none absolute -bottom-40 -left-40 size-[450px] rounded-full bg-[#9dbf14]/[0.04] blur-[120px]"
        animate={
          shouldReduceMotion
            ? undefined
            : {
                scale: [1, 1.12, 1],
                opacity: [0.4, 0.8, 0.4],
                x: [0, 25, 0],
              }
        }
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8">
        {/* Encabezado principal */}
        <motion.div
          className="mb-16"
          variants={sectionVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <SectionHeading
            eyebrow="Nuestro portafolio"
            title="Soluciones financieras para cada necesidad."
            description="Conectamos empresas y personas con alternativas de financiación, liquidez y crecimiento a través de nuestro ecosistema de aliados financieros."
          />
        </motion.div>

        {/* Línea empresarial */}
        <div id="linea-empresarial" className="mb-20 scroll-mt-32">
          <motion.div
            className="mb-9 flex flex-col justify-between gap-4 md:flex-row md:items-end"
            variants={headingVariants}
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div>
              <span className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[#9dbf14]">
                <Building2 size={17} />
                01 / Línea empresarial
              </span>

              <h3 className="text-2xl font-bold text-[#22264b] dark:text-white md:text-3xl">
                Soluciones para impulsar empresas.
              </h3>
            </div>

            <p className="max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              Financiación estratégica, gestión de liquidez y soluciones
              especializadas para acompañar cada etapa del negocio.
            </p>
          </motion.div>

          {renderCards(businessServices, "Solución empresarial")}
        </div>

        {/* Línea personas */}
        <motion.div
          id="linea-personas"
          className="scroll-mt-32 border-t border-slate-200 pt-16 dark:border-white/10"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <motion.div
            className="mb-9 flex flex-col justify-between gap-4 md:flex-row md:items-end"
            variants={headingVariants}
          >
            <div>
              <span className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[#9dbf14]">
                <Users size={17} />
                02 / Línea personas
              </span>

              <h3 className="text-2xl font-bold text-[#22264b] dark:text-white md:text-3xl">
                Alternativas para tus proyectos personales.
              </h3>
            </div>

            <p className="max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              Productos financieros complementarios para acompañar decisiones
              importantes y necesidades personales.
            </p>
          </motion.div>

          {renderCards(personalServices, "Solución personal")}
        </motion.div>
      </div>
    </section>
  );
}
