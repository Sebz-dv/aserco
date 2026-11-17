import {
  BarChart3,
  BriefcaseBusiness,
  Plus,
  ShieldCheck,
  Users,
} from "lucide-react";

import { animate, motion, useReducedMotion } from "motion/react";

import { useEffect, useState } from "react";

import type { AdminUser } from "../lib/api";

type AdminOverviewPageProps = Readonly<{
  users: readonly AdminUser[];
  isSuperAdmin: boolean;
  canManageUsers: boolean;
  canManageRoles: boolean;
  canManageKnowledge: boolean;
  onOpenUsers: () => void;
  userName: string;
}>;

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 24,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

function AnimatedCounter({
  value,
  reduceMotion,
}: Readonly<{
  value: number;
  reduceMotion: boolean | null;
}>) {
  const [displayValue, setDisplayValue] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (reduceMotion) {
      setDisplayValue(value);
      return;
    }

    const controls = animate(0, value, {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [value, reduceMotion]);

  return <>{displayValue}</>;
}

function getSecurityMessage({
  isSuperAdmin,
  canManageRoles,
  canManageUsers,
  canManageKnowledge,
}: Pick<
  AdminOverviewPageProps,
  "isSuperAdmin" | "canManageRoles" | "canManageUsers" | "canManageKnowledge"
>): string {
  if (isSuperAdmin) {
    return "Tienes permisos completos según la configuración RBAC del sistema.";
  }

  if (canManageRoles) {
    return "Tu usuario tiene permisos para gestionar roles y permisos específicos.";
  }

  if (canManageUsers) {
    return "Tu usuario tiene permisos para operaciones sobre cuentas de usuario.";
  }

  if (canManageKnowledge) {
    return "Tu usuario tiene permisos editoriales sobre el módulo de conocimiento.";
  }

  return "Tu usuario puede visualizar únicamente los módulos autorizados por sus permisos efectivos.";
}

export function AdminOverviewPage({
  users,
  isSuperAdmin,
  canManageUsers,
  canManageRoles,
  canManageKnowledge,
  onOpenUsers,
  userName,
}: AdminOverviewPageProps) {
  const shouldReduceMotion = useReducedMotion();

  const activeUsers = users.filter((user) => user.isActive).length;

  const totalRoles = new Set(users.flatMap((user) => user.roles)).size;

  const securityMessage = getSecurityMessage({
    isSuperAdmin,
    canManageRoles,
    canManageUsers,
    canManageKnowledge,
  });

  return (
    <motion.div
      variants={containerVariants}
      initial={shouldReduceMotion ? false : "hidden"}
      animate="visible"
      className="space-y-6"
    >
      <motion.section
        variants={cardVariants}
        className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-500 hover:border-[#3163a2]/20 hover:shadow-xl hover:shadow-[#3163a2]/5 dark:border-white/10 dark:bg-[#111d35] dark:hover:border-[#9dbf14]/20 dark:hover:shadow-[#9dbf14]/5 md:p-8"
      >
        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  scale: [1, 1.12, 1],
                  opacity: [0.5, 0.9, 0.5],
                }
          }
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute -right-20 -top-28 size-72 rounded-full bg-[#3163a2]/6 blur-3xl dark:bg-[#9dbf14]/8"
        />

        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  scale: [1, 1.2, 1],
                  x: [0, -15, 0],
                }
          }
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute -bottom-24 right-1/4 size-48 rounded-full bg-[#9dbf14]/6 blur-3xl"
        />

        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <motion.div
              variants={cardVariants}
              className="flex items-center gap-2"
            >
              <motion.span
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        opacity: [1, 0.5, 1],
                        scale: [1, 1.25, 1],
                      }
                }
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                }}
                className="size-2 rounded-full bg-[#9dbf14] shadow-[0_0_12px_rgba(157,191,20,0.55)]"
              />

              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#3163a2] dark:text-[#9dbf14]">
                Panel de administración
              </p>
            </motion.div>

            <motion.h1
              variants={cardVariants}
              className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-4xl"
            >
              Bienvenido,{" "}
              <span className="text-[#3163a2] dark:text-[#9dbf14]">
                {userName}
              </span>
            </motion.h1>

            <motion.p
              variants={cardVariants}
              className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500 dark:text-slate-400"
            >
              Administra los recursos, usuarios y accesos de la plataforma desde
              tu centro de control.
            </motion.p>
          </div>

          {canManageUsers && (
            <motion.button
              type="button"
              onClick={onOpenUsers}
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : {
                      scale: 1.04,
                      y: -3,
                      transition: {
                        type: "spring",
                        stiffness: 350,
                        damping: 15,
                      },
                    }
              }
              whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#3163a2] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#3163a2]/20 transition-colors hover:bg-[#254d83] dark:bg-[#9dbf14] dark:text-[#111827] dark:shadow-[#9dbf14]/10 dark:hover:bg-[#b4d831]"
            >
              <Users size={17} />
              Gestionar usuarios
            </motion.button>
          )}
        </div>
      </motion.section>

      {canManageUsers && (
        <motion.div
          variants={containerVariants}
          className="grid gap-4 md:grid-cols-3"
        >
          <motion.div
            variants={cardVariants}
            whileHover={
              shouldReduceMotion
                ? undefined
                : {
                    y: -7,
                    scale: 1.015,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    },
                  }
            }
            className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-[#3163a2]/30 hover:shadow-xl hover:shadow-[#3163a2]/5 dark:border-white/10 dark:bg-[#111d35] dark:hover:border-[#9dbf14]/30 dark:hover:shadow-[#9dbf14]/5"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-[#3163a2]/6 blur-2xl transition-transform duration-500 group-hover:scale-150 dark:bg-[#9dbf14]/6" />

            <div className="relative flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-300">
                Usuarios
              </p>

              <motion.div
                whileHover={
                  shouldReduceMotion ? undefined : { rotate: 10, scale: 1.15 }
                }
                className="grid size-10 place-items-center rounded-2xl bg-[#3163a2]/10 text-[#3163a2] dark:bg-[#9dbf14]/10 dark:text-[#9dbf14]"
              >
                <Users size={19} />
              </motion.div>
            </div>

            <p className="relative mt-5 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              <AnimatedCounter
                value={users.length}
                reduceMotion={shouldReduceMotion}
              />
            </p>

            <p className="relative mt-1 text-xs text-slate-400">
              Usuarios registrados
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover={
              shouldReduceMotion
                ? undefined
                : {
                    y: -7,
                    scale: 1.015,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    },
                  }
            }
            className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-[#9dbf14]/50 hover:shadow-xl hover:shadow-[#9dbf14]/5 dark:border-white/10 dark:bg-[#111d35] dark:hover:border-[#9dbf14]/30"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-[#9dbf14]/6 blur-2xl transition-transform duration-500 group-hover:scale-150" />

            <div className="relative flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-300">
                Activos
              </p>

              <motion.div
                whileHover={
                  shouldReduceMotion ? undefined : { rotate: -10, scale: 1.15 }
                }
                className="grid size-10 place-items-center rounded-2xl bg-[#9dbf14]/10 text-[#819f0c] dark:text-[#9dbf14]"
              >
                <ShieldCheck size={19} />
              </motion.div>
            </div>

            <p className="relative mt-5 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              <AnimatedCounter
                value={activeUsers}
                reduceMotion={shouldReduceMotion}
              />
            </p>

            <p className="relative mt-1 text-xs text-slate-400">
              Cuentas habilitadas
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover={
              shouldReduceMotion
                ? undefined
                : {
                    y: -7,
                    scale: 1.015,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    },
                  }
            }
            className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-[#3163a2]/30 hover:shadow-xl hover:shadow-[#3163a2]/5 dark:border-white/10 dark:bg-[#111d35] dark:hover:border-[#9dbf14]/30"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-[#3163a2]/6 blur-2xl transition-transform duration-500 group-hover:scale-150 dark:bg-[#9dbf14]/6" />

            <div className="relative flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-300">
                Roles
              </p>

              <motion.div
                whileHover={
                  shouldReduceMotion ? undefined : { rotate: 10, scale: 1.15 }
                }
                className="grid size-10 place-items-center rounded-2xl bg-[#3163a2]/10 text-[#3163a2] dark:bg-[#9dbf14]/10 dark:text-[#9dbf14]"
              >
                <BarChart3 size={19} />
              </motion.div>
            </div>

            <p className="relative mt-5 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              <AnimatedCounter
                value={totalRoles}
                reduceMotion={shouldReduceMotion}
              />
            </p>

            <p className="relative mt-1 text-xs text-slate-400">
              Roles asignados
            </p>
          </motion.div>
        </motion.div>
      )}

      <motion.div
        variants={containerVariants}
        className="grid gap-4 lg:grid-cols-2"
      >
        {canManageUsers && (
          <motion.section
            variants={cardVariants}
            whileHover={
              shouldReduceMotion
                ? undefined
                : {
                    y: -5,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 22,
                    },
                  }
            }
            className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#3163a2]/30 hover:shadow-xl hover:shadow-[#3163a2]/5 dark:border-white/10 dark:bg-[#111d35] dark:hover:border-[#9dbf14]/30 dark:hover:shadow-[#9dbf14]/5"
          >
            <motion.div
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      scale: [1, 1.25, 1],
                      opacity: [0.5, 1, 0.5],
                    }
              }
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="pointer-events-none absolute -right-12 -top-12 size-36 rounded-full bg-[#3163a2]/6 blur-2xl dark:bg-[#9dbf14]/6"
            />

            <div className="relative">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={
                    shouldReduceMotion ? undefined : { rotate: 8, scale: 1.12 }
                  }
                  className="grid size-12 place-items-center rounded-2xl bg-[#3163a2]/10 text-[#3163a2] dark:bg-[#9dbf14]/10 dark:text-[#9dbf14]"
                >
                  <BriefcaseBusiness size={21} />
                </motion.div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#3163a2] dark:text-[#9dbf14]">
                    Acción rápida
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                    Gestionar accesos
                  </h2>
                </div>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-slate-500 dark:text-slate-300">
                Administra usuarios, activa o desactiva perfiles y asigna roles
                desde el panel de usuarios.
              </p>

              <motion.button
                type="button"
                onClick={onOpenUsers}
                whileHover={shouldReduceMotion ? undefined : { x: 5 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-[#3163a2] transition-colors hover:border-[#3163a2]/30 hover:bg-[#3163a2]/5 dark:border-white/10 dark:text-[#9dbf14] dark:hover:border-[#9dbf14]/30 dark:hover:bg-[#9dbf14]/5"
              >
                <Plus size={17} />
                Ir a usuarios
              </motion.button>
            </div>
          </motion.section>
        )}

        {!canManageUsers && canManageKnowledge && (
          <motion.section
            variants={cardVariants}
            whileHover={
              shouldReduceMotion
                ? undefined
                : {
                    y: -5,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 22,
                    },
                  }
            }
            className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#3163a2]/30 hover:shadow-xl hover:shadow-[#3163a2]/5 dark:border-white/10 dark:bg-[#111d35] dark:hover:border-[#9dbf14]/30 dark:hover:shadow-[#9dbf14]/5"
          >
            <motion.div
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      scale: [1, 1.25, 1],
                      opacity: [0.5, 1, 0.5],
                    }
              }
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="pointer-events-none absolute -right-12 -top-12 size-36 rounded-full bg-[#3163a2]/6 blur-2xl dark:bg-[#9dbf14]/6"
            />

            <div className="relative">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={
                    shouldReduceMotion ? undefined : { rotate: 8, scale: 1.12 }
                  }
                  className="grid size-12 place-items-center rounded-2xl bg-[#3163a2]/10 text-[#3163a2] dark:bg-[#9dbf14]/10 dark:text-[#9dbf14]"
                >
                  <BriefcaseBusiness size={21} />
                </motion.div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#3163a2] dark:text-[#9dbf14]">
                    Acceso editorial
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                    Gestión de conocimiento
                  </h2>
                </div>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-slate-500 dark:text-slate-300">
                Tu usuario cuenta con permisos para gestionar contenido
                editorial del módulo de conocimiento.
              </p>
            </div>
          </motion.section>
        )}

        <motion.section
          variants={cardVariants}
          whileHover={
            shouldReduceMotion
              ? undefined
              : {
                  y: -5,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 22,
                  },
                }
          }
          className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#9dbf14]/40 hover:shadow-xl hover:shadow-[#9dbf14]/5 dark:border-white/10 dark:bg-[#111d35] dark:hover:border-[#9dbf14]/30"
        >
          <motion.div
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    scale: [1, 1.2, 1],
                    x: [0, -12, 0],
                  }
            }
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute -bottom-16 -right-16 size-48 rounded-full bg-[#9dbf14]/6 blur-3xl"
          />

          <div className="relative">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={
                  shouldReduceMotion ? undefined : { rotate: -8, scale: 1.12 }
                }
                className="grid size-12 place-items-center rounded-2xl bg-[#9dbf14]/10 text-[#819f0c] dark:text-[#9dbf14]"
              >
                <ShieldCheck size={21} />
              </motion.div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#3163a2] dark:text-[#9dbf14]">
                  Seguridad
                </p>

                <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                  Permisos activos
                </h2>
              </div>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-slate-500 dark:text-slate-300">
              {securityMessage}
            </p>

            <div className="mt-5 flex items-center gap-2">
              <motion.span
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        opacity: [1, 0.4, 1],
                        scale: [1, 1.25, 1],
                      }
                }
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="size-2 rounded-full bg-[#9dbf14] shadow-[0_0_10px_rgba(157,191,20,0.5)]"
              />

              <span className="text-xs font-semibold text-[#819f0c] dark:text-[#9dbf14]">
                Sistema de permisos RBAC
              </span>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </motion.div>
  );
}
