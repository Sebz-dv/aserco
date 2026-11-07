import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";

import { useEffect, useRef, useState } from "react";

export type ToastKind = "success" | "error" | "info" | "confirm";

export type ToastItem = {
  id: number;
  title?: string;
  message: string;
  kind: ToastKind;
  onConfirm?: () => void;
  onCancel?: () => void;
};

type ToastContainerProps = Readonly<{
  toasts: ToastItem[];
  onClose: (id: number) => void;
}>;

const styles: Record<
  Exclude<ToastKind, "confirm">,
  {
    icon: typeof CheckCircle2;
    title: string;
    className: string;
    iconClass: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    title: "Éxito",
    className:
      "border-emerald-200 bg-white text-emerald-800 dark:border-emerald-800 dark:bg-[#172c28] dark:text-emerald-200",
    iconClass: "bg-emerald-100 dark:bg-emerald-900/60",
  },
  error: {
    icon: TriangleAlert,
    title: "Atención",
    className:
      "border-red-200 bg-white text-red-700 dark:border-red-800 dark:bg-[#321e25] dark:text-red-200",
    iconClass: "bg-red-100 dark:bg-red-900/60",
  },
  info: {
    icon: Info,
    title: "Información",
    className:
      "border-sky-200 bg-white text-sky-700 dark:border-sky-800 dark:bg-[#1b293b] dark:text-sky-200",
    iconClass: "bg-sky-100 dark:bg-sky-900/60",
  },
};

const toastShadow = "shadow-[0_12px_35px_rgba(15,23,42,0.16)]";

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  const [closing, setClosing] = useState<Set<number>>(() => new Set());

  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => clearTimeout(timer));
      timers.current.clear();
    };
  }, []);

  const closeToast = (id: number) => {
    if (timers.current.has(id)) return;

    setClosing((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

    const timer = setTimeout(() => {
      onClose(id);

      setClosing((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });

      timers.current.delete(id);
    }, 220);

    timers.current.set(id, timer);
  };

  const handleCancel = (toast: ToastItem) => {
    toast.onCancel?.();
    closeToast(toast.id);
  };

  const handleConfirm = (toast: ToastItem) => {
    toast.onConfirm?.();
    closeToast(toast.id);
  };

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-3">
      {toasts.map((toast) => {
        const isClosing = closing.has(toast.id);

        const animationClass = isClosing ? "toast-exit" : "toast-enter";

        if (toast.kind === "confirm") {
          return (
            <div
              key={toast.id}
              className={`
                toast-card toast-animation
                pointer-events-auto rounded-2xl border
                border-sky-200 bg-white p-4 text-sky-800
                dark:border-sky-800 dark:bg-[#1b293b] dark:text-sky-200
                ${toastShadow}
                ${animationClass}
              `}
            >
              <div className="flex items-start gap-3">
                <div className="toast-icon mt-0.5 rounded-full bg-sky-100 p-1.5 dark:bg-sky-900/60">
                  <Info size={17} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-[0.14em]">
                    {toast.title ?? "Confirmación"}
                  </p>

                  <p className="mt-1 text-sm leading-5">{toast.message}</p>
                </div>

                <button
                  type="button"
                  aria-label="Cerrar alerta"
                  onClick={() => handleCancel(toast)}
                  className="toast-button rounded-full p-1 text-current/60 hover:bg-sky-100 hover:text-current dark:hover:bg-white/10"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleCancel(toast)}
                  className="
                    toast-button rounded-full border border-slate-200
                    bg-white px-4 py-2 text-xs font-semibold
                    text-slate-600 hover:bg-slate-100
                    dark:border-slate-600 dark:bg-[#26364a]
                    dark:text-slate-200 dark:hover:bg-[#31445c]
                  "
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={() => handleConfirm(toast)}
                  className="
                    toast-button rounded-full bg-[#9dbf14] px-4 py-2
                    text-xs font-semibold text-[#22264b]
                    hover:bg-[#b0d42b]
                  "
                >
                  Confirmar
                </button>
              </div>
            </div>
          );
        }

        const config = styles[toast.kind];
        const Icon = config.icon;

        return (
          <div
            key={toast.id}
            className={`
              toast-card toast-animation
              pointer-events-auto flex items-start gap-3
              rounded-2xl border p-4
              ${config.className}
              ${toastShadow}
              ${animationClass}
            `}
          >
            <div
              className={`toast-icon mt-0.5 rounded-full p-1.5 ${config.iconClass}`}
            >
              <Icon size={17} strokeWidth={2} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-[0.14em]">
                {toast.title ?? config.title}
              </p>

              <p className="mt-1 text-sm leading-5">{toast.message}</p>
            </div>

            <button
              type="button"
              aria-label="Cerrar alerta"
              onClick={() => closeToast(toast.id)}
              className="
                toast-button rounded-full p-1 text-current/60
                hover:bg-slate-100 hover:text-current
                dark:hover:bg-white/10
              "
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
