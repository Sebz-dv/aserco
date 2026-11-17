import {
  Building2,
  SearchCheck,
  Blocks,
  Landmark,
  ClipboardCheck,
  TrendingUp,
  Check,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

import { motion, useReducedMotion } from "motion/react";
import { SectionHeading } from "../atoms/SectionHeading";

const steps = [
  {
    number: "01",
    icon: Building2,
    title: "Necesidad financiera",
    description:
      "Identificamos las necesidades y oportunidades de financiación de tu empresa.",
    details: [
      "Capital de trabajo",
      "Inversión y expansión",
      "Compra de activos",
      "Modernización",
      "Sostenibilidad y liquidez",
    ],
  },
  {
    number: "02",
    icon: SearchCheck,
    title: "Smart Check",
    description:
      "Evaluamos el perfil financiero y las capacidades de tu negocio.",
    details: [
      "Análisis financiero",
      "Perfilamiento de riesgo",
      "Capacidad de pago",
      "Identificación de oportunidades",
    ],
  },
  {
    number: "03",
    icon: Blocks,
    title: "Estructuración",
    description:
      "Diseñamos una solución financiera alineada con tus objetivos.",
    details: [
      "Monto y plazo",
      "Garantías",
      "Línea financiera",
      "Entidad objetivo",
      "Estructura de operación",
    ],
  },
  {
    number: "04",
    icon: Landmark,
    title: "Canalización multibanca",
    description:
      "Conectamos tu empresa con las alternativas financieras adecuadas.",
    details: [
      "Banca privada",
      "Banca de desarrollo",
      "Fintech",
      "Fondos",
      "Cooperativas",
    ],
  },
  {
    number: "05",
    icon: ClipboardCheck,
    title: "Gestión integral",
    description: "Gestionamos y acompañamos cada etapa hasta el desembolso.",
    details: [
      "Gestión documental",
      "Radicación",
      "Respuesta a observaciones",
      "Seguimiento",
      "Cierre de operación",
    ],
  },
  {
    number: "06",
    icon: TrendingUp,
    title: "Resultados",
    description: "Impulsamos el crecimiento y fortalecimiento de tu empresa.",
    details: [
      "Mayor liquidez",
      "Inversión productiva",
      "Expansión",
      "Competitividad",
      "Sostenibilidad",
    ],
  },
];

export function Approach() {
  const shouldReduceMotion = useReducedMotion();

  const ease = [0.22, 1, 0.36, 1] as const;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 35,
      scale: shouldReduceMotion ? 1 : 0.97,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.7,
        ease,
      },
    },
  };

  return (
    <section
      id="nosotros"
      className="relative isolate overflow-hidden text-[#22264b] transition-colors duration-300 dark:text-white"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8">
        {/* ENCABEZADO */}

        <div className="grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
          <SectionHeading
            eyebrow="Nuestra metodología"
            title="De la necesidad al resultado."
            description="Un proceso estructurado que conecta las necesidades financieras de tu empresa con las alternativas adecuadas, mediante una gestión cercana y estratégica."
          />

          <motion.div
            initial={{
              opacity: 0,
              x: shouldReduceMotion ? 0 : 25,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.75,
              delay: shouldReduceMotion ? 0 : 0.2,
              ease,
            }}
            className="relative overflow-hidden rounded-2xl border border-[#9dbf14]/20 bg-white/60 p-6 shadow-[0_10px_35px_rgba(34,38,75,0.04)] backdrop-blur-md dark:border-white/10 dark:bg-[#101a2b]/60"
          >
            <div className="absolute -right-10 -top-10 size-32 rounded-full bg-[#9dbf14]/10 blur-3xl" />

            <div className="relative flex gap-4">
              <div className="flex h-12 w-1 shrink-0 rounded-full bg-linear-to-b from-[#b5d83d] to-[#3163a2]" />

              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#789900] dark:text-[#b5d83d]">
                  Nuestro enfoque
                </span>

                <p className="mt-2 text-sm font-medium leading-7 text-[#22264b] dark:text-slate-200">
                  Seis etapas. Una gestión integral. Un objetivo: facilitar el
                  acceso a soluciones financieras.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* INDICADOR DEL PROCESO */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
          className="mb-7 mt-16 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl border border-[#9dbf14]/20 bg-[#9dbf14]/10 text-[#789900] dark:text-[#b5d83d]">
              <Blocks size={17} />
            </span>

            <div>
              <p className="text-xs font-bold text-[#22264b] dark:text-white">
                Nuestro proceso
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                De principio a fin
              </p>
            </div>
          </div>

          <span className="rounded-full border border-slate-200 bg-white/60 px-3 py-1.5 text-[10px] font-bold tracking-wide text-slate-500 backdrop-blur-md dark:border-white/10 dark:bg-white/4 dark:text-slate-400">
            06 ETAPAS
          </span>
        </motion.div>

        {/* TARJETAS DEL PROCESO */}

        <div className="relative">
          {/* LÍNEA DE CONEXIÓN */}

          <div className="pointer-events-none absolute left-[8%] right-[8%] top-12 z-0 hidden h-px bg-slate-200 lg:block dark:bg-white/10">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 1.5,
                delay: shouldReduceMotion ? 0 : 0.3,
                ease,
              }}
              className="h-full origin-left bg-linear-to-r from-[#9dbf14] via-[#b5d83d] to-[#3163a2]"
            />
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            className="relative z-10 grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
          >
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.article
                  key={step.number}
                  variants={cardVariants}
                  whileHover={
                    shouldReduceMotion
                      ? {}
                      : {
                          y: -8,
                          transition: { duration: 0.25 },
                        }
                  }
                  className="group relative flex h-full min-h-101.25 flex-col overflow-hidden rounded-3xl border border-slate-200/75 bg-white/75 p-5 shadow-[0_8px_30px_rgba(34,38,75,0.045)] backdrop-blur-md transition-[border-color,box-shadow,background-color] duration-500 hover:border-[#9dbf14]/50 hover:bg-white/95 hover:shadow-[0_20px_45px_rgba(34,38,75,0.10)] dark:border-white/9 dark:bg-[#101a2b]/70 dark:hover:border-[#b5d83d]/40 dark:hover:bg-[#101a2b]/90 dark:hover:shadow-[0_20px_45px_rgba(0,0,0,0.2)]"
                >
                  {/* DECORACIÓN */}

                  <div className="pointer-events-none absolute -right-12 -top-12 size-36 rounded-full border border-[#9dbf14]/10 transition-transform duration-700 group-hover:scale-125 dark:border-[#b5d83d]/10" />

                  <div className="pointer-events-none absolute -right-5 -top-5 size-24 rounded-full bg-[#9dbf14]/4.5 blur-2xl transition-all duration-500 group-hover:bg-[#9dbf14]/15" />

                  {/* ACENTO SUPERIOR */}

                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.7,
                      delay: shouldReduceMotion ? 0 : index * 0.1,
                    }}
                    className="absolute left-0 top-0 h-0.75 w-full origin-left bg-linear-to-r from-[#b5d83d] via-[#9dbf14] to-transparent"
                  />

                  {/* ICONO Y NÚMERO */}

                  <div className="relative z-10 flex items-center justify-between">
                    <motion.div
                      whileHover={
                        shouldReduceMotion
                          ? {}
                          : {
                              rotate: -7,
                              scale: 1.1,
                            }
                      }
                      transition={{ duration: 0.25 }}
                      className="relative grid size-13.5 place-items-center rounded-[18px] border border-[#9dbf14]/20 bg-linear-to-br from-[#b5d83d]/20 to-[#9dbf14]/6 text-[#789900] shadow-[0_5px_20px_rgba(157,191,20,0.08)] dark:text-[#c5e76b]"
                    >
                      <Icon size={24} strokeWidth={1.7} />

                      <span className="absolute -right-1 -top-1 size-2.5 rounded-full border-2 border-white bg-[#9dbf14] dark:border-[#101a2b]" />
                    </motion.div>

                    <span className="text-[34px] font-bold tracking-[-0.07em] text-[#22264b]/8 transition-colors duration-300 group-hover:text-[#9dbf14]/40 dark:text-white/7 dark:group-hover:text-[#b5d83d]/40">
                      {step.number}
                    </span>
                  </div>

                  {/* ETIQUETA */}

                  <div className="relative z-10 mb-2 mt-6 flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-[#9dbf14]" />

                    <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#789900] dark:text-[#b5d83d]">
                      Etapa {step.number}
                    </span>
                  </div>

                  {/* TÍTULO */}

                  <h3 className="relative z-10 min-h-12 text-[15px] font-bold leading-[1.45] tracking-tight text-[#22264b] transition-colors duration-300 group-hover:text-[#789900] dark:text-white dark:group-hover:text-[#c5e76b]">
                    {step.title}
                  </h3>

                  {/* DESCRIPCIÓN */}

                  <p className="relative z-10 mt-3 min-h-19.5 text-[11px] leading-[1.8] text-slate-500 dark:text-slate-400">
                    {step.description}
                  </p>

                  {/* DETALLES */}

                  <div className="relative z-10 mt-5 flex-1 border-t border-slate-100 pt-4 dark:border-white/8">
                    <p className="mb-4 text-[9px] font-extrabold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
                      Aspectos clave
                    </p>

                    <ul className="space-y-3">
                      {step.details.map((detail, detailIndex) => (
                        <motion.li
                          key={detail}
                          initial={{
                            opacity: 0,
                            x: shouldReduceMotion ? 0 : -8,
                          }}
                          whileInView={{
                            opacity: 1,
                            x: 0,
                          }}
                          viewport={{ once: true }}
                          transition={{
                            duration: shouldReduceMotion ? 0 : 0.35,
                            delay: shouldReduceMotion
                              ? 0
                              : index * 0.08 + detailIndex * 0.04,
                          }}
                          className="flex items-start gap-2 text-[10px] leading-normal text-slate-600 dark:text-slate-300"
                        >
                          <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-[#9dbf14]/10 text-[#789900] dark:bg-[#b5d83d]/10 dark:text-[#b5d83d]">
                            <Check size={10} strokeWidth={2.5} />
                          </span>

                          {detail}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* PROGRESO */}

                  <div className="relative z-10 mt-6">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500">
                        Proceso
                      </span>

                      <span className="text-[9px] font-bold tabular-nums text-[#789900] dark:text-[#b5d83d]">
                        {step.number} / 06
                      </span>
                    </div>

                    <div className="h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: shouldReduceMotion ? 0 : 0.8,
                          delay: shouldReduceMotion ? 0 : index * 0.1 + 0.2,
                          ease,
                        }}
                        style={{
                          width: `${((index + 1) / steps.length) * 100}%`,
                        }}
                        className="h-full origin-left rounded-full bg-linear-to-r from-[#9dbf14] to-[#b5d83d]"
                      />
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>

        {/* RESULTADO FINAL */}

        <motion.div
          initial={{
            opacity: 0,
            y: shouldReduceMotion ? 0 : 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.8,
            ease,
          }}
          className="group relative mt-12 overflow-hidden rounded-[30px] border border-white/10 bg-[#22264b] p-8 shadow-[0_25px_70px_rgba(34,38,75,0.18)] sm:p-10 lg:p-12 dark:bg-[#101a2b]"
        >
          {/* FONDO DECORATIVO */}

          <div className="pointer-events-none absolute -right-20 -top-32 size-80 rounded-full border-35 border-white/[0.035] transition-transform duration-1000 group-hover:scale-110" />

          <div className="pointer-events-none absolute -bottom-32 right-[25%] size-72 rounded-full bg-[#9dbf14]/15 blur-[90px]" />

          <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-linear-to-r from-transparent via-[#9dbf14]/60 to-transparent" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#9dbf14]/30 bg-[#9dbf14]/10 px-4 py-2">
                <Sparkles size={13} className="text-[#c5e76b]" />

                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#dff090]">
                  Nuestro compromiso
                </span>
              </div>

              <h3 className="text-2xl font-bold leading-[1.2] tracking-tight text-white sm:text-3xl lg:text-[2.5rem]">
                Más que financiación,{" "}
                <span className="text-[#c5e76b]">
                  conexiones que impulsan tu crecimiento.
                </span>
              </h3>

              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300">
                Acompañamos a tu empresa desde la identificación de sus
                necesidades hasta la materialización de sus oportunidades
                financieras.
              </p>
            </div>

            <motion.a
              href="#contacto"
              whileHover={
                shouldReduceMotion
                  ? {}
                  : {
                      y: -3,
                      scale: 1.025,
                    }
              }
              whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
              className="group/button inline-flex min-h-13.5 shrink-0 items-center justify-center gap-3 rounded-xl bg-[#9dbf14] px-7 py-4 text-sm font-bold text-[#172039] shadow-[0_8px_25px_rgba(157,191,20,0.2)] transition-colors duration-300 hover:bg-[#b5d83d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b5d83d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#22264b]"
            >
              Hablemos de tu empresa
              <ArrowUpRight
                size={18}
                className="transition-transform duration-300 group-hover/button:translate-x-1 group-hover/button:-translate-y-1"
              />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
