import {
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Activity,
  Wallet,
  BarChart3,
} from "lucide-react";

import { motion, useReducedMotion } from "motion/react";

const logo2 = new URL("../../assets/logos/logoColor.png", import.meta.url).href;

export function CTASection() {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 28,
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

  const stagger = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.13,
        delayChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 20,
      scale: shouldReduceMotion ? 1 : 0.96,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  const floatingAnimation = shouldReduceMotion
    ? {}
    : {
        y: [0, -10, 0],
        transition: {
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      };

  return (
    <section className="cta-section relative overflow-hidden py-20 lg:py-28">
      <div className="relative z-10 mx-auto w-full max-w-[1500px] px-5 sm:px-8 lg:px-12">
        <motion.div
          className="cta-shell relative overflow-hidden rounded-[36px]"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.9,
            ease: "easeOut",
          }}
        >
          {/* Decoración del CTA */}

          <motion.div
            className="cta-orbit cta-orbit-one"
            animate={shouldReduceMotion ? {} : { rotate: 360 }}
            transition={{
              duration: 45,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          <motion.div
            className="cta-orbit cta-orbit-two"
            animate={shouldReduceMotion ? {} : { rotate: -360 }}
            transition={{
              duration: 55,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          <motion.div
            className="cta-orbit cta-orbit-three"
            animate={floatingAnimation}
          />

          <motion.div
            className="absolute left-0 top-0 h-1 w-full origin-left bg-gradient-to-r from-[#b5d83d] via-[#9dbf14] to-transparent"
            initial={{ scaleX: shouldReduceMotion ? 1 : 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: shouldReduceMotion ? 0 : 1.2,
              delay: 0.3,
            }}
          />

          <div className="relative grid items-center gap-14 px-7 py-14 sm:px-10 md:px-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-16 lg:py-24 xl:px-20">
            {/* CONTENIDO PRINCIPAL */}

            <motion.div
              className="cta-content relative z-10"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {/* Etiqueta */}

              <motion.div
                variants={fadeUp}
                className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#9dbf14]/30 bg-[#9dbf14]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#789900] dark:border-[#b5d83d]/30 dark:bg-[#b5d83d]/10 dark:text-[#c5e76b]"
              >
                <motion.span
                  animate={
                    shouldReduceMotion ? {} : { rotate: [0, 15, -15, 0] }
                  }
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                >
                  <Sparkles size={15} />
                </motion.span>
                Aserco Smart Finance
              </motion.div>

              {/* Título */}

              <motion.h2
                variants={fadeUp}
                className="max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight text-[#22264b] dark:text-white sm:text-5xl lg:text-[3.8rem]"
              >
                Tu empresa tiene un futuro.
                <motion.span
                  className="cta-gradient-text mt-2 block"
                  initial={{
                    opacity: 0,
                    x: shouldReduceMotion ? 0 : -20,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  viewport={{ once: true }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.8,
                    delay: 0.35,
                  }}
                >
                  Hagamos que suceda.
                </motion.span>
              </motion.h2>

              {/* Descripción */}

              <motion.p
                variants={fadeUp}
                className="mt-7 max-w-lg text-base leading-8 text-slate-600 dark:text-slate-300"
              >
                Conectamos las necesidades de tu negocio con oportunidades
                financieras. Construyamos juntos una estrategia que impulse el
                crecimiento de tu empresa.
              </motion.p>

              {/* Acción */}

              <motion.div
                variants={fadeUp}
                className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center"
              >
                <motion.a
                  href="https://wa.me/573144142937"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-button group inline-flex items-center gap-3 rounded-full bg-[#b5d83d] px-7 py-4 text-sm font-bold text-[#22264b] shadow-[0_10px_35px_rgba(181,216,61,0.2)] transition-colors duration-300 hover:bg-[#c5e76b]"
                  whileHover={
                    shouldReduceMotion
                      ? {}
                      : {
                          y: -5,
                          scale: 1.035,
                          boxShadow: "0 18px 45px rgba(181,216,61,0.32)",
                        }
                  }
                  whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                >
                  Conocer nuestra propuesta
                  <motion.span
                    className="inline-flex"
                    whileHover={shouldReduceMotion ? {} : { x: 4, y: -4 }}
                  >
                    <ArrowUpRight size={19} />
                  </motion.span>
                </motion.a>

                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Construyamos nuevas oportunidades.
                </span>
              </motion.div>

              {/* Firma de marca */}

              <motion.div
                variants={fadeUp}
                className="mt-14 flex items-center gap-4 border-t border-[#22264b]/10 pt-7 dark:border-white/10"
              >
                <motion.img
                  src={logo2}
                  alt="Aserco Smart Finance"
                  className="h-10 w-10 rounded-xl bg-white p-1.5 object-contain"
                  whileHover={
                    shouldReduceMotion ? {} : { rotate: -8, scale: 1.08 }
                  }
                />

                <div>
                  <p className="text-xs font-bold tracking-[0.15em] text-[#22264b] dark:text-white">
                    ASERCO SMART FINANCE
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Entender. Conectar. Acompañar.
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* VISUAL FINANCIERO */}

            <motion.div
              className="cta-visual relative mx-auto w-full max-w-[620px]"
              initial={{
                opacity: 0,
                x: shouldReduceMotion ? 0 : 65,
                scale: shouldReduceMotion ? 1 : 0.94,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 1,
                delay: 0.15,
                ease: "easeOut",
              }}
            >
              {/* Luz ambiental */}

              <motion.div
                className="cta-visual-glow"
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        scale: [1, 1.12, 1],
                        opacity: [0.65, 1, 0.65],
                      }
                }
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Elementos orbitales */}

              <motion.div
                className="cta-visual-orbit orbit-a"
                animate={shouldReduceMotion ? {} : { rotate: 360 }}
                transition={{
                  duration: 35,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              <motion.div
                className="cta-visual-orbit orbit-b"
                animate={shouldReduceMotion ? {} : { rotate: -360 }}
                transition={{
                  duration: 45,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* Dashboard principal */}

              <motion.div
                className="cta-dashboard relative z-10 overflow-hidden rounded-[32px] border border-white/15 bg-[#20294a]/95 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8 lg:p-9"
                animate={floatingAnimation}
                whileHover={
                  shouldReduceMotion
                    ? {}
                    : {
                        y: -5,
                        transition: {
                          duration: 0.35,
                        },
                      }
                }
              >
                {/* Header */}

                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="flex size-10 items-center justify-center rounded-xl bg-[#b5d83d]/15 text-[#c5e76b]"
                      animate={
                        shouldReduceMotion
                          ? {}
                          : {
                              scale: [1, 1.06, 1],
                            }
                      }
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                      }}
                    >
                      <BarChart3 size={21} />
                    </motion.div>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        Financial overview
                      </p>

                      <p className="mt-1 text-[11px] text-slate-400">
                        Smart business solutions
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full border border-[#b5d83d]/20 bg-[#b5d83d]/10 px-3 py-1 text-[10px] font-semibold tracking-wide text-[#c5e76b]">
                    SMART FINANCE
                  </span>
                </div>

                {/* Métricas */}

                <motion.div
                  className="grid grid-cols-2 gap-3 py-6"
                  variants={stagger}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <motion.div
                    variants={cardVariants}
                    whileHover={
                      shouldReduceMotion
                        ? {}
                        : {
                            y: -5,
                            borderColor: "rgba(181,216,61,0.45)",
                          }
                    }
                    className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 transition-colors duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        Visión estratégica
                      </span>

                      <TrendingUp size={16} className="text-[#b5d83d]" />
                    </div>

                    <p className="mt-3 text-lg font-semibold text-white">
                      Estrategia
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">
                      Decisiones con propósito
                    </p>
                  </motion.div>

                  <motion.div
                    variants={cardVariants}
                    whileHover={
                      shouldReduceMotion
                        ? {}
                        : {
                            y: -5,
                            borderColor: "rgba(181,216,61,0.45)",
                          }
                    }
                    className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 transition-colors duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        Gestión integral
                      </span>

                      <Wallet size={16} className="text-[#b5d83d]" />
                    </div>

                    <p className="mt-3 text-lg font-semibold text-white">
                      Conexión
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">
                      Soluciones para empresas
                    </p>
                  </motion.div>
                </motion.div>

                {/* Gráfica */}

                <motion.div
                  className="rounded-2xl border border-white/10 bg-[#151d37]/80 p-5"
                  initial={{
                    opacity: 0,
                    y: shouldReduceMotion ? 0 : 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{ once: true }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.7,
                    delay: 0.2,
                  }}
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-white">
                        Crecimiento empresarial
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        Una visión hacia nuevas oportunidades
                      </p>
                    </div>

                    <Activity size={18} className="text-[#b5d83d]" />
                  </div>

                  <svg
                    viewBox="0 0 420 150"
                    className="w-full overflow-visible"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    aria-label="Gráfica ilustrativa de crecimiento"
                  >
                    <defs>
                      <linearGradient id="ctaArea" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="#B5D83D"
                          stopOpacity=".3"
                        />

                        <stop
                          offset="100%"
                          stopColor="#B5D83D"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>

                    {[30, 65, 100, 135].map((y) => (
                      <path
                        key={y}
                        d={`M0 ${y} H420`}
                        stroke="white"
                        strokeOpacity=".08"
                        strokeDasharray="4 6"
                      />
                    ))}

                    <motion.path
                      d="M0 125 C45 115 55 105 95 110 S150 85 185 92 S235 55 270 70 S330 28 365 38 S395 15 420 10 V150 H0 Z"
                      fill="url(#ctaArea)"
                      initial={{
                        opacity: 0,
                      }}
                      whileInView={{
                        opacity: 1,
                      }}
                      viewport={{ once: true }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : 1.2,
                        delay: 0.4,
                      }}
                    />

                    <motion.path
                      d="M0 125 C45 115 55 105 95 110 S150 85 185 92 S235 55 270 70 S330 28 365 38 S395 15 420 10"
                      stroke="#B5D83D"
                      strokeWidth="3"
                      strokeLinecap="round"
                      initial={{
                        pathLength: shouldReduceMotion ? 1 : 0,
                      }}
                      whileInView={{
                        pathLength: 1,
                      }}
                      viewport={{ once: true }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : 2,
                        delay: 0.3,
                        ease: "easeInOut",
                      }}
                    />

                    <motion.circle
                      cx="270"
                      cy="70"
                      r="5"
                      fill="#B5D83D"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: shouldReduceMotion ? 0 : 1.2,
                        duration: 0.4,
                      }}
                    />

                    <motion.circle
                      cx="270"
                      cy="70"
                      r="11"
                      stroke="#B5D83D"
                      strokeOpacity=".35"
                      animate={
                        shouldReduceMotion
                          ? {}
                          : {
                              scale: [1, 1.8, 1],
                              opacity: [0.6, 0, 0.6],
                            }
                      }
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />

                    <motion.circle
                      cx="420"
                      cy="10"
                      r="5"
                      fill="#B5D83D"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: shouldReduceMotion ? 0 : 2,
                        duration: 0.4,
                      }}
                    />
                  </svg>

                  <div className="mt-3 flex justify-between text-[9px] uppercase tracking-widest text-slate-400">
                    <span>Visión</span>
                    <span>Estrategia</span>
                    <span>Oportunidad</span>
                  </div>
                </motion.div>

                {/* Footer dashboard */}

                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-[#b5d83d]" />

                    <span className="text-[11px] text-slate-300">
                      Acompañamiento estratégico
                    </span>
                  </div>

                  <motion.span
                    className="size-2 rounded-full bg-[#b5d83d] shadow-[0_0_12px_#b5d83d]"
                    animate={
                      shouldReduceMotion
                        ? {}
                        : {
                            opacity: [1, 0.4, 1],
                            scale: [1, 1.25, 1],
                          }
                    }
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                </div>
              </motion.div>

              {/* Elemento flotante */}

              <motion.div
                className="cta-floating-card absolute -bottom-13 -left-5 z-20 flex items-center gap-3 rounded-2xl border border-white/15 bg-[#293454]/95 px-4 py-3 shadow-2xl backdrop-blur-xl sm:-left-10"
                initial={{
                  opacity: 0,
                  x: shouldReduceMotion ? 0 : -25,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{ once: true }}
                animate={floatingAnimation}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.8,
                  delay: 0.6,
                }}
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-[#b5d83d]/15 text-[#c5e76b]">
                  <Sparkles size={19} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-white">
                    Smart thinking
                  </p>

                  <p className="mt-1 text-[10px] text-slate-400">
                    Financial solutions
                  </p>
                </div>
              </motion.div>

              {/* Punto decorativo */}

              <motion.div
                className="cta-floating-dot absolute -right-3 top-12 z-20 size-5 rounded-full border-4 border-[#b5d83d]/30 bg-[#b5d83d] shadow-[0_0_25px_rgba(181,216,61,0.5)]"
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        y: [0, -12, 0],
                        scale: [1, 1.12, 1],
                      }
                }
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
