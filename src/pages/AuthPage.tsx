import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

import { loginUser, registerUser, type AuthUser } from "../lib/api";

export type AuthMode = "login" | "register";

type Props = Readonly<{
  mode: AuthMode;
  onSwitchMode: (mode: AuthMode) => void;
  onBackHome: () => void;
  onAuthSuccess: (user: AuthUser) => void;
  onToast?: (message: string, kind?: 'success' | 'error' | 'info', title?: string) => void;
}>;

const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const passwordPolicyRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const validatePasswordStrength = (password: string) => {
  if (!passwordPolicyRegex.test(password)) {
    throw new Error("La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y un carácter especial.");
  }
};

export function AuthPage({
  mode,
  onSwitchMode,
  onBackHome,
  onAuthSuccess,
  onToast,
}: Props) {
  const isLogin = mode === "login";

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field: keyof typeof initialForm, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (isLogin) {
        const response = await loginUser({
          email: form.email,
          password: form.password,
        });

        onAuthSuccess(response.user);
        return;
      }

      if (!form.name.trim()) {
        throw new Error("El nombre es obligatorio.");
      }

      validatePasswordStrength(form.password);

      if (form.password !== form.confirmPassword) {
        throw new Error("Las contraseñas no coinciden.");
      }

      const response = await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      onAuthSuccess(response.user);
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "No se pudo completar la solicitud.";

      onToast?.(message, 'error', 'Error de autenticación');
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-[#3163a2] focus:bg-white focus:ring-4 focus:ring-[#3163a2]/10 dark:border-white/10 dark:bg-[#0e1729] dark:text-white dark:placeholder:text-slate-400 dark:focus:border-[#9dbf14] dark:focus:ring-[#9dbf14]/10";

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f7fb] px-4 py-6 text-[#22264b] dark:bg-[#080e1c] dark:text-white sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-[#3163a2]/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-[#9dbf14]/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_24px_80px_rgba(34,38,75,0.10)] dark:border-white/[0.08] dark:bg-[#101a30] dark:shadow-[0_24px_80px_rgba(0,0,0,0.3)]">
        <div className="grid min-h-[680px] lg:grid-cols-[1.02fr_0.98fr]">
          {/* LEFT PANEL */}
          <aside className="relative flex flex-col justify-between overflow-hidden bg-[#22264b] px-7 py-8 text-white sm:px-10 sm:py-10 lg:px-12 lg:py-12">
            {/* Decorative elements */}
            <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/[0.07]" />
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border border-white/[0.07]" />
            <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full border border-[#9dbf14]/20" />

            <div className="relative z-10">
              {/* Brand */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#9dbf14] text-[#22264b]">
                    <span className="text-lg font-black tracking-tighter">
                      A
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-bold tracking-[0.12em]">
                      ASERCO
                    </p>
                    <p className="text-[9px] font-medium tracking-[0.23em] text-slate-400">
                      SMART FINANCE
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onBackHome}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-2 text-xs font-medium text-slate-300 transition hover:border-[#9dbf14]/50 hover:bg-white/5 hover:text-white"
                >
                  <ArrowLeft size={14} />
                  <span>Volver</span>
                </button>
              </div>

              {/* Main message */}
              <div className="mt-12 sm:mt-20 lg:mt-24">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#9dbf14]/20 bg-[#9dbf14]/10 px-3 py-1.5">
                  <Sparkles size={13} className="text-[#b5d83d]" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#c5df70]">
                    Finanzas inteligentes
                  </span>
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b5d83d]">
                  {isLogin ? "Tu espacio financiero" : "Comienza aquí"}
                </p>

                <h1 className="mt-5 max-w-md text-4xl font-semibold leading-[1.13] tracking-tight sm:text-5xl">
                  {isLogin ? (
                    <>
                      Tus decisiones
                      <br />
                      <span className="text-[#b5d83d]">impulsan</span> tu
                      crecimiento.
                    </>
                  ) : (
                    <>
                      Conecta con nuevas
                      <br />
                      <span className="text-[#b5d83d]">oportunidades.</span>
                    </>
                  )}
                </h1>

                <p className="mt-6 max-w-sm text-sm leading-7 text-slate-300 sm:text-base">
                  {isLogin
                    ? "Accede a tu espacio Aserco y continúa gestionando tus oportunidades y soluciones financieras."
                    : "Crea tu cuenta y descubre una nueva forma de conectar con soluciones financieras."}
                </p>
              </div>
            </div>

            {/* Bottom information */}
            <div className="relative z-10 mt-12">
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-md">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#9dbf14]/15 text-[#b5d83d]">
                    <ShieldCheck size={21} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      Seguridad en cada acceso
                    </p>
                    <p className="mt-1.5 text-xs leading-5 text-slate-400">
                      Tu información y tus datos son tratados con
                      confidencialidad y acceso controlado.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between text-[10px] text-slate-500">
                <span>ASERCO SMART FINANCE</span>
                <span>© {new Date().getFullYear()} Aserco</span>
              </div>
            </div>
          </aside>

          {/* RIGHT PANEL */}
          <main className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12">
            <div className="w-full max-w-[390px]">
              {/* Form heading */}
              <div className="mb-8">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3163a2]/10 text-[#3163a2] dark:bg-[#9dbf14]/10 dark:text-[#b5d83d]">
                  {isLogin ? (
                    <LockKeyhole size={22} />
                  ) : (
                    <UserRound size={22} />
                  )}
                </div>

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3163a2] dark:text-[#b5d83d]">
                  {isLogin ? "Bienvenido de nuevo" : "Nuevo usuario"}
                </p>

                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#22264b] dark:text-white">
                  {isLogin ? "Iniciar sesión" : "Crear cuenta"}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {isLogin
                    ? "Ingresa tus credenciales para acceder a tu cuenta."
                    : "Completa tus datos para comenzar."}
                </p>
              </div>

              {/* Mode selector */}
              <div className="mb-7 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-white/[0.05]">
                <button
                  type="button"
                  onClick={() => onSwitchMode("login")}
                  className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    isLogin
                      ? "bg-white text-[#22264b] shadow-sm dark:bg-[#263653] dark:text-white"
                      : "text-slate-500 hover:text-[#22264b] dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  Iniciar sesión
                </button>

                <button
                  type="button"
                  onClick={() => onSwitchMode("register")}
                  className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    !isLogin
                      ? "bg-white text-[#22264b] shadow-sm dark:bg-[#263653] dark:text-white"
                      : "text-slate-500 hover:text-[#22264b] dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  Registrarse
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Nombre completo
                    </label>

                    <div className="relative">
                      <UserRound
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="text"
                        autoComplete="name"
                        value={form.name}
                        onChange={(event) =>
                          handleChange("name", event.target.value)
                        }
                        placeholder="Tu nombre completo"
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Correo electrónico
                  </label>

                  <div className="relative">
                    <Mail
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(event) =>
                        handleChange("email", event.target.value)
                      }
                      placeholder="nombre@empresa.com"
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Contraseña
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete={
                        isLogin ? "current-password" : "new-password"
                      }
                      value={form.password}
                      onChange={(event) =>
                        handleChange("password", event.target.value)
                      }
                      placeholder="Ingresa tu contraseña"
                      className={`${inputClass} pr-12`}
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#3163a2] dark:hover:text-[#b5d83d]"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                    Mínimo 8 caracteres, con mayúsculas, minúsculas, números y un carácter especial.
                  </p>
                </div>

                {!isLogin && (
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Confirmar contraseña
                    </label>

                    <div className="relative">
                      <LockKeyhole
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={form.confirmPassword}
                        onChange={(event) =>
                          handleChange("confirmPassword", event.target.value)
                        }
                        placeholder="Repite tu contraseña"
                        className={`${inputClass} pr-12`}
                        required
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Ocultar contraseña"
                            : "Mostrar contraseña"
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#3163a2] dark:hover:text-[#b5d83d]"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div
                    role="alert"
                    className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
                  >
                    <span className="mt-0.5 shrink-0">!</span>
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group mt-2 flex w-full items-center justify-center gap-3 rounded-xl bg-[#9dbf14] px-5 py-4 text-sm font-bold text-[#22264b] shadow-[0_8px_20px_rgba(157,191,20,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#b1d52c] hover:shadow-[0_12px_25px_rgba(157,191,20,0.25)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#22264b]/30 border-t-[#22264b]" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      {isLogin ? "Ingresar a mi cuenta" : "Crear mi cuenta"}
                      <ArrowRight
                        size={17}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-8 border-t border-slate-100 pt-6 dark:border-white/[0.07]">
                <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                  <ShieldCheck size={15} className="text-[#9dbf14]" />
                  <span>Acceso seguro y protegido</span>
                </div>

                <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
                  {isLogin
                    ? "¿Todavía no tienes una cuenta?"
                    : "¿Ya tienes una cuenta?"}{" "}
                  <button
                    type="button"
                    onClick={() => onSwitchMode(isLogin ? "register" : "login")}
                    className="font-bold text-[#3163a2] underline-offset-4 transition hover:underline dark:text-[#b5d83d]"
                  >
                    {isLogin ? "Regístrate" : "Inicia sesión"}
                  </button>
                </p>
              </div>

              {/* Trust indicators */}
              <div className="mt-7 flex items-center justify-center gap-5">
                <span className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <CheckCircle2 size={12} />
                  Confidencialidad
                </span>
                <span className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <ShieldCheck size={12} />
                  Protección de datos
                </span>
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
