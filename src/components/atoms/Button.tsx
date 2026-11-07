import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({
  children,
  href,
  variant = "primary",
  className = "",
  ...props
}: Props) {
  const variantStyles = {
    primary:
      "bg-[linear-gradient(135deg,#bfe11f_0%,#9dbf14_45%,#7da30f_100%)] text-[#172039] shadow-[0_12px_30px_rgba(157,191,20,0.32)] hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(157,191,20,0.4)]",
    secondary:
      "border border-[#3163a2]/25 bg-white/80 text-[#22264b] shadow-[0_8px_20px_rgba(34,38,75,0.06)] hover:-translate-y-0.5 hover:border-[#9dbf14]/60 hover:text-[#9dbf14] dark:border-white/15 dark:bg-white/5 dark:text-white",
    ghost: "text-[#3163a2] hover:text-[#9dbf14] dark:text-slate-200",
  };

  const classes = `
    inline-flex items-center justify-center gap-2
    rounded-full px-5 py-3
    text-sm font-semibold transition-all duration-300
    ${variantStyles[variant]}
    ${className}
  `.trim();

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
        <ArrowUpRight size={16} />
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
