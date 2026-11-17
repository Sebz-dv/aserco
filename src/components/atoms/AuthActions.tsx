
import { LogIn, UserPlus } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

type AuthActionsProps = Readonly<{
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  className?: string;
  variant?: "desktop" | "mobile";
}>;

export function AuthActions({
  onOpenLogin,
  onOpenRegister,
  className = "",
  variant = "desktop",
}: AuthActionsProps) {
  const reduceMotion = useReducedMotion();
  const isMobile = variant === "mobile";

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`
        group/auth relative isolate inline-flex items-center
        gap-0.5 rounded-full border p-0.5
        border-[#3163a2]/15
        bg-white/85
        shadow-[0_3px_12px_rgba(34,38,75,0.06)]
        backdrop-blur-xl
        transition-all duration-300
        hover:border-[#3163a2]/30
        hover:shadow-[0_5px_18px_rgba(49,99,162,0.10)]
        dark:border-white/10
        dark:bg-[#111d35]/85
        dark:shadow-[0_3px_12px_rgba(0,0,0,0.18)]
        ${isMobile ? "w-full" : ""}
        ${className}
      `}
    >
      {/* INICIAR SESIÓN */}
      <motion.button
        type="button"
        onClick={onOpenLogin}
        whileHover={reduceMotion ? undefined : { y: -1 }}
        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
        className={`
          group/login relative inline-flex items-center
          justify-center gap-1.5 rounded-full
          px-2.5 py-1.5
          text-[14px]! font-bold tracking-wide
          text-[#22264b]
          transition-all duration-300
          hover:bg-[#3163a2]/[0.07]
          hover:text-[#3163a2]
          focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-[#3163a2]/50
          dark:text-slate-200
          dark:hover:bg-white/[0.07]
          dark:hover:text-white
          ${isMobile ? "flex-1" : ""}
        `}
      >
        <span
          className="
            grid size-5 shrink-0 place-items-center
            rounded-full
            bg-[#3163a2]/10
            text-[#3163a2]
            transition-all duration-300
            group-hover/login:bg-[#3163a2]
            group-hover/login:text-white
            dark:bg-[#75a9e8]/15
            dark:text-[#75a9e8]
            dark:group-hover/login:bg-[#3163a2]
            dark:group-hover/login:text-white
          "
        >
          <LogIn size={11} strokeWidth={2.2} />
        </span>

        <span className="whitespace-nowrap">
          Iniciar sesión
        </span>
      </motion.button>

      {/* SEPARADOR */}
      <span
        aria-hidden="true"
        className="h-4 w-px shrink-0 bg-[#22264b]/10 dark:bg-white/10"
      />

      {/* REGISTRARSE */}
      <motion.button
        type="button"
        onClick={onOpenRegister}
        whileHover={reduceMotion ? undefined : { y: -1 }}
        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
        className={`
          group/register relative isolate inline-flex
          items-center justify-center gap-1.5
          overflow-hidden rounded-full
          bg-linear-to-r from-[#9dbf14] to-[#789900]
          px-3 py-1.5
          text-[14px]! font-extrabold tracking-wide
          text-[#22264b]
          shadow-[0_2px_8px_rgba(157,191,20,0.20)]
          transition-all duration-300
          hover:shadow-[0_4px_13px_rgba(157,191,20,0.32)]
          focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-[#9dbf14]/60
          focus-visible:ring-offset-2
          dark:focus-visible:ring-offset-[#111d35]
          ${isMobile ? "flex-1" : ""}
        `}
      >
        {/* BRILLO ANIMADO */}
        {!reduceMotion && (
          <motion.span
            aria-hidden="true"
            className="
              pointer-events-none absolute inset-y-0 -left-1/2
              w-1/2 skew-x-[-20deg]
              bg-linear-to-r from-transparent
              via-white/40 to-transparent
            "
            animate={{ left: ["-50%", "150%"] }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              repeatDelay: 2.5,
              ease: "easeInOut",
            }}
          />
        )}

        <span
          className="
            relative grid size-4 shrink-0
            place-items-center rounded-full
            bg-[#22264b]/10
            transition-all duration-300
            group-hover/register:rotate-[-8deg]
            group-hover/register:scale-110
          "
        >
          <UserPlus size={10} strokeWidth={2.3} />
        </span>

        <span className="relative whitespace-nowrap">
          Registrarse
        </span>
      </motion.button>
    </motion.div>
  );
}
