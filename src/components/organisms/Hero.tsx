import {
  ArrowUpRight,
  Building2,
  ChartNoAxesCombined,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { motion, useReducedMotion } from "motion/react";
import { Button } from "../atoms/Button";

const benefits = [
  { icon: ShieldCheck, text: "Acompañamiento experto" },
  { icon: Building2, text: "Ecosistema financiero" },
  { icon: ChartNoAxesCombined, text: "Soluciones estratégicas" },
];

const featureCards = [
  {
    icon: Building2,
    eyebrow: "GESTIÓN INTEGRAL",
    title: "Gestión 360°",
    description:
      "De inicio a seguimiento, centraliza y administra tus procesos financieros.",
  },
  {
    icon: ArrowUpRight,
    eyebrow: "EXPERIENCIA INTUITIVA",
    title: "Acceso simple",
    description:
      "Rutas claras y procesos intuitivos para que tu empresa avance.",
  },
  {
    icon: TrendingUp,
    eyebrow: "TECNOLOGÍA E INNOVACIÓN",
    title: "Crecimiento inteligente",
    description: "Soluciones estratégicas para impulsar nuevas oportunidades.",
  },
];

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const revealVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 25,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.75,
        ease: "easeOut" as const,
      },
    },
  };

  const leftContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.14,
        delayChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const cardContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.16,
        delayChildren: shouldReduceMotion ? 0 : 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      x: shouldReduceMotion ? 0 : 25,
      scale: shouldReduceMotion ? 1 : 0.97,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.65,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section
      id="inicio"
      className="relative isolate overflow-hidden text-[#22264b] transition-colors duration-300 dark:text-white"
    >
      {/* AMBIENTACIÓN */}

      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -right-40 -top-32 size-[550px] rounded-full bg-[#9dbf14]/10 blur-[120px] dark:bg-[#9dbf14]/15"
          animate={
            shouldReduceMotion
              ? {}
              : {
                  scale: [1, 1.12, 1],
                  opacity: [0.6, 1, 0.6],
                  x: [0, -20, 0],
                }
          }
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute -bottom-40 left-1/3 size-[450px] rounded-full bg-[#9dbf14]/5 blur-[120px]"
          animate={
            shouldReduceMotion
              ? {}
              : {
                  scale: [1, 1.15, 1],
                  opacity: [0.4, 0.8, 0.4],
                }
          }
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <div className="mx-auto max-w-[1440px] px-5 pb-16 pt-12 sm:px-8 sm:pb-20 lg:px-12 lg:pt-16">
        {/* GRID PRINCIPAL */}

        <div className="grid items-start gap-12 lg:grid-cols-[1fr_0.92fr] lg:gap-14 xl:gap-20">
          {/* COLUMNA IZQUIERDA */}

          <motion.div
            className="relative z-10 w-full max-w-2xl"
            variants={leftContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* ETIQUETA */}

            <motion.div
              variants={revealVariants}
              className="mb-7 inline-flex items-center gap-3 rounded-full border border-[#9dbf14]/40 bg-[#9dbf14]/10 px-4 py-2.5 text-[10px] font-bold tracking-[0.19em] text-[#647d0b] dark:text-[#dff090] sm:mb-8 sm:text-[11px]"
            >
              <motion.span
                className="size-2 shrink-0 rounded-full bg-[#9dbf14] shadow-[0_0_12px_#9dbf14]"
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        scale: [1, 1.35, 1],
                        opacity: [1, 0.6, 1],
                      }
                }
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              FINANCIACIÓN INTELIGENTE
            </motion.div>

            {/* TÍTULO */}

            <div className="relative">
              <motion.div
                className="absolute -left-5 top-1 hidden h-28 w-1 origin-top rounded-full bg-[#9dbf14] sm:block"
                initial={{
                  scaleY: shouldReduceMotion ? 1 : 0,
                }}
                animate={{ scaleY: 1 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.8,
                  delay: 0.3,
                  ease: "easeOut",
                }}
              />

              <motion.h1
                variants={revealVariants}
                className="max-w-[650px] text-[30px] font-semibold leading-[1.3] tracking-[-0.045em] text-[#22264b] sm:text-[36px] lg:text-[42px] xl:text-[46px] dark:text-white"
              >
                Simplificamos el acceso a financiación inteligente para impulsar{" "}
                <motion.span className="inline text-[#789900] dark:text-[#b4d63d]">
                  la liquidez, el crecimiento y la expansión
                </motion.span>{" "}
                de tu negocio a través de un ecosistema financiero integral.
              </motion.h1>
            </div>

            {/* DESCRIPCIÓN */}

            <motion.p
              variants={revealVariants}
              className="mt-6 max-w-[540px] text-[14px] leading-[1.9] text-slate-600 sm:text-[15px] dark:text-slate-400"
            >
              Conectamos empresas con soluciones de financiación estructuradas,
              acompañamiento especializado y herramientas estratégicas para
              optimizar su liquidez y convertir sus objetivos de negocio en
              oportunidades de crecimiento.
            </motion.p>

            {/* BOTONES */}

            <motion.div
              variants={revealVariants}
              className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center"
            >
              <motion.div
                whileHover={
                  shouldReduceMotion
                    ? {}
                    : {
                        y: -4,
                        scale: 1.025,
                      }
                }
                whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
              >
                <Button href="#contacto" type="button">
                  Conversemos sobre tu empresa
                </Button>
              </motion.div>

              <motion.div
                whileHover={
                  shouldReduceMotion
                    ? {}
                    : {
                        y: -4,
                        scale: 1.025,
                      }
                }
                whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
              >
                <Button
                  href="#servicios"
                  type="button"
                  variant="secondary"
                  className="border-slate-300 bg-white/60 text-slate-700 hover:bg-white dark:border-white/25 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                  Ver servicios
                </Button>
              </motion.div>
            </motion.div>

            {/* INDICADORES DE CONFIANZA */}

            <motion.div
              variants={revealVariants}
              className="mt-10 border-t border-slate-200 pt-6 dark:border-white/10"
            >
              <p className="mb-4 text-[9px] font-bold uppercase tracking-[0.17em] text-slate-400">
                Nuestro compromiso
              </p>

              <motion.div
                className="flex flex-wrap gap-x-6 gap-y-4"
                variants={cardContainerVariants}
              >
                {benefits.map((item) => (
                  <motion.div
                    key={item.text}
                    variants={cardVariants}
                    className="group flex items-center gap-2.5"
                    whileHover={
                      shouldReduceMotion
                        ? {}
                        : {
                            x: 4,
                          }
                    }
                  >
                    <motion.span
                      className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#9dbf14]/10 text-[#829f12] dark:text-[#b4d63d]"
                      whileHover={
                        shouldReduceMotion
                          ? {}
                          : {
                              scale: 1.12,
                              rotate: -6,
                            }
                      }
                    >
                      <item.icon size={17} strokeWidth={1.9} />
                    </motion.span>

                    <span className="text-[10px] font-semibold leading-4 text-slate-600 dark:text-slate-300">
                      {item.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>

          {/* COLUMNA DERECHA */}

          <motion.div
            className="relative mx-auto w-full min-w-0 max-w-[620px] lg:ml-auto"
            initial={{
              opacity: 0,
              x: shouldReduceMotion ? 0 : 60,
              scale: shouldReduceMotion ? 1 : 0.96,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            transition={{
              duration: shouldReduceMotion ? 0 : 1,
              delay: 0.25,
              ease: "easeOut",
            }}
          >
            {/* ILUMINACIÓN */}

            <motion.div
              className="pointer-events-none absolute -right-16 -top-16 -z-10 size-72 rounded-full bg-[#9dbf14]/15 blur-[100px]"
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      scale: [1, 1.15, 1],
                      opacity: [0.6, 1, 0.6],
                    }
              }
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <motion.div
              className="pointer-events-none absolute -bottom-16 -left-16 -z-10 size-64 rounded-full bg-[#22264b]/5 blur-[90px]"
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      scale: [1, 1.1, 1],
                    }
              }
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <div className="space-y-5">
              {/* VISIÓN FINANCIERA */}

              <motion.div
                className="group relative isolate overflow-hidden rounded-[26px] border border-[#9dbf14]/20 bg-gradient-to-br from-[#f7f9ed] via-[#eef3dc] to-[#e5edcb] p-6 text-[#22264b] shadow-[0_20px_50px_rgba(34,38,75,0.07)] transition-colors duration-500 sm:p-7 dark:border-white/10 dark:from-[#263047] dark:via-[#202b3e] dark:to-[#182337] dark:text-white"
                initial={{
                  opacity: 0,
                  y: shouldReduceMotion ? 0 : 25,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.8,
                  delay: 0.45,
                }}
                whileHover={
                  shouldReduceMotion
                    ? {}
                    : {
                        y: -5,
                        transition: { duration: 0.3 },
                      }
                }
              >
                {/* DECORACIÓN */}

                <motion.div
                  className="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full border border-[#9dbf14]/20"
                  animate={shouldReduceMotion ? {} : { rotate: 360 }}
                  transition={{
                    duration: 55,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                <motion.div
                  className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-[#9dbf14]/10 blur-[65px]"
                  animate={
                    shouldReduceMotion
                      ? {}
                      : {
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0.9, 0.5],
                        }
                  }
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                <div className="relative z-10">
                  {/* CABECERA */}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <motion.span
                        className="size-2 rounded-full bg-[#8eac13]"
                        animate={
                          shouldReduceMotion
                            ? {}
                            : {
                                scale: [1, 1.4, 1],
                                opacity: [1, 0.5, 1],
                              }
                        }
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      />

                      <span className="text-[9px] font-bold tracking-[0.18em] text-[#647d0b] dark:text-[#c5dc75]">
                        VISIÓN FINANCIERA
                      </span>
                    </div>

                    <motion.div
                      className="grid size-10 place-items-center rounded-xl border border-[#9dbf14]/20 bg-white/60 text-[#789900] shadow-sm dark:border-white/10 dark:bg-white/[0.06] dark:text-[#b4d63d]"
                      whileHover={
                        shouldReduceMotion
                          ? {}
                          : {
                              rotate: 8,
                              scale: 1.1,
                            }
                      }
                    >
                      <ChartNoAxesCombined size={20} />
                    </motion.div>
                  </div>

                  {/* CONTENIDO */}

                  <div className="mt-6">
                    <h2 className="max-w-md text-[25px] font-bold leading-[1.15] tracking-[-0.045em] text-[#22264b] sm:text-[30px] dark:text-white">
                      El futuro de tu empresa
                      <motion.span
                        className="block text-[#789900] dark:text-[#b4d63d]"
                        initial={{
                          opacity: 0,
                          x: shouldReduceMotion ? 0 : 15,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          duration: shouldReduceMotion ? 0 : 0.7,
                          delay: 0.8,
                        }}
                      >
                        merece una mejor estrategia.
                      </motion.span>
                    </h2>

                    <p className="mt-3 max-w-[380px] text-[11px] leading-[1.8] text-[#59627b] dark:text-white/55">
                      Integramos soluciones financieras para impulsar el
                      crecimiento y las oportunidades de tu negocio.
                    </p>
                  </div>

                  {/* INDICADORES */}

                  <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#22264b]/10 pt-4 dark:border-white/10">
                    {[
                      { icon: ShieldCheck, text: "Confianza" },
                      { icon: TrendingUp, text: "Crecimiento" },
                      { icon: Sparkles, text: "Innovación" },
                    ].map((item, index) => (
                      <motion.span
                        key={item.text}
                        className="flex items-center gap-1.5 text-[9px] font-semibold text-[#647d0b] dark:text-[#c5dc75]"
                        initial={{
                          opacity: 0,
                          y: shouldReduceMotion ? 0 : 10,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          duration: shouldReduceMotion ? 0 : 0.5,
                          delay: 0.8 + index * 0.12,
                        }}
                        whileHover={shouldReduceMotion ? {} : { y: -2 }}
                      >
                        <item.icon size={14} />
                        {item.text}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* BENEFICIOS VERTICALES */}

              <div className="relative">
                <motion.div
                  className="mb-4 flex items-center justify-between"
                  initial={{
                    opacity: 0,
                    y: shouldReduceMotion ? 0 : 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.6,
                    delay: 0.65,
                  }}
                >
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#829f12] dark:text-[#b4d63d]">
                      Nuestras soluciones
                    </p>

                    <h3 className="mt-1 text-lg font-bold tracking-tight text-[#22264b] dark:text-white">
                      Todo lo que necesitas para avanzar.
                    </h3>
                  </div>

                  <motion.div
                    className="hidden size-9 place-items-center rounded-xl bg-[#9dbf14]/10 text-[#829f12] sm:grid dark:text-[#b4d63d]"
                    animate={
                      shouldReduceMotion
                        ? {}
                        : {
                            rotate: [0, 10, 0, -10, 0],
                          }
                    }
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                    }}
                  >
                    <Sparkles size={18} />
                  </motion.div>
                </motion.div>

                {/* TARJETAS EN COLUMNA */}

                <motion.div
                  className="flex flex-col gap-3"
                  variants={cardContainerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {featureCards.map((item) => (
                    <motion.article
                      key={item.title}
                      variants={cardVariants}
                      className="group relative flex items-center gap-4 overflow-hidden rounded-[20px] border border-slate-200/80 bg-white p-4 shadow-[0_5px_22px_rgba(34,38,75,0.035)] transition-colors duration-300 hover:border-[#9dbf14]/40 hover:shadow-[0_12px_30px_rgba(34,38,75,0.08)] sm:p-5 dark:border-white/10 dark:bg-[#111c30]"
                      whileHover={
                        shouldReduceMotion
                          ? {}
                          : {
                              x: 6,
                              scale: 1.01,
                              transition: {
                                duration: 0.25,
                              },
                            }
                      }
                    >
                      {/* CÍRCULO DECORATIVO */}

                      <motion.div
                        className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full border border-[#9dbf14]/15"
                        whileHover={
                          shouldReduceMotion
                            ? {}
                            : {
                                scale: 1.4,
                                rotate: 25,
                              }
                        }
                        transition={{
                          duration: 0.5,
                        }}
                      />

                      {/* ICONO */}

                      <motion.div
                        className="relative z-10 grid size-12 shrink-0 place-items-center rounded-2xl border border-[#9dbf14]/15 bg-[#9dbf14]/10 text-[#829f12] transition-colors duration-300 group-hover:bg-[#9dbf14] group-hover:text-white dark:text-[#b4d63d]"
                        whileHover={
                          shouldReduceMotion
                            ? {}
                            : {
                                rotate: -7,
                                scale: 1.08,
                              }
                        }
                      >
                        <item.icon size={22} strokeWidth={1.8} />
                      </motion.div>

                      {/* TEXTO */}

                      <div className="relative z-10 min-w-0 flex-1">
                        <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#829f12] dark:text-[#b4d63d]">
                          {item.eyebrow}
                        </p>

                        <h4 className="mt-1 text-[15px] font-bold tracking-tight text-[#22264b] dark:text-white">
                          {item.title}
                        </h4>

                        <p className="mt-1 text-[11px] leading-[1.6] text-slate-500 dark:text-slate-400">
                          {item.description}
                        </p>
                      </div>

                      {/* INDICADOR */}

                      <motion.div
                        className="relative z-10 grid size-8 shrink-0 place-items-center rounded-full bg-slate-50 text-slate-400 transition-colors duration-300 group-hover:bg-[#9dbf14]/10 group-hover:text-[#829f12] dark:bg-white/5 dark:text-slate-400 dark:group-hover:text-[#b4d63d]"
                        whileHover={
                          shouldReduceMotion
                            ? {}
                            : {
                                x: 3,
                                y: -3,
                              }
                        }
                      >
                        <ArrowUpRight size={16} />
                      </motion.div>
                    </motion.article>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
