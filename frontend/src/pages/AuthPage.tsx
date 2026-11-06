import { useState } from 'react';
import { loginUser, registerUser, type AuthUser } from '../lib/api';

export type AuthMode = "login" | "register";

type Props = Readonly<{
  mode: AuthMode;
  onSwitchMode: (mode: AuthMode) => void;
  onBackHome: () => void;
  onAuthSuccess: (user: AuthUser, token: string) => void;
}>;

const initialForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export function AuthPage({ mode, onSwitchMode, onBackHome, onAuthSuccess }: Props) {
  const isLogin = mode === 'login';
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof typeof initialForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (isLogin) {
        const response = await loginUser({
          email: form.email,
          password: form.password,
        });

        const token = response.accessToken ?? response.token ?? '';
        onAuthSuccess(response.user, token);
        return;
      }

      if (!form.name.trim()) {
        throw new Error('El nombre es obligatorio.');
      }

      if (form.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres.');
      }

      if (form.password !== form.confirmPassword) {
        throw new Error('Las contraseñas no coinciden.');
      }

      const response = await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      const token = response.accessToken ?? response.token ?? '';
      onAuthSuccess(response.user, token);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No se pudo completar la solicitud.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#f4f7fb] px-4 py-10 text-[#22264b] dark:bg-[#0b1225] dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(34,38,75,0.12)] dark:border-white/10 dark:bg-[#111d35]">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative overflow-hidden bg-[#22264b] px-8 py-10 text-white sm:px-10 lg:px-12">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-white/10" />
            <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full border border-[#9dbf14]/30" />

            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <button
                  type="button"
                  onClick={onBackHome}
                  className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200 transition hover:border-[#9dbf14] hover:text-[#9dbf14]"
                >
                  Volver al inicio
                </button>

                <div className="mt-14">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#b5d83d]">
                    Aserco Smart Finance
                  </p>
                  <h1 className="mt-5 max-w-md text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                    {isLogin ? "Bienvenido otra vez." : "Crea tu cuenta."}
                  </h1>
                  <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
                    {isLogin
                      ? "Accede a tu espacio para revisar oportunidades financieras y continuar con tu proceso."
                      : "Regístrate para gestionar tus necesidades financieras con un acompañamiento cercano y estratégico."}
                  </p>
                </div>
              </div>

              <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b5d83d]">
                  Seguridad y confianza
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-200">
                  Tu información se maneja con confidencialidad y acceso controlado.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center px-6 py-10 sm:px-8 lg:px-10">
            <div className="w-full max-w-md">
              <div className="mb-8 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3163a2] dark:text-[#9dbf14]">
                    {isLogin ? 'Acceso' : 'Registro'}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">
                    {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
                  </h2>
                </div>
              </div>

              <div className="mb-7 inline-flex w-full rounded-full border border-slate-200 bg-slate-100 p-1 dark:border-white/10 dark:bg-[#1a2544]">
                <button
                  type="button"
                  onClick={() => onSwitchMode('login')}
                  className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                    isLogin
                      ? 'bg-[#9dbf14] text-[#22264b] shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Iniciar sesión
                </button>
                <button
                  type="button"
                  onClick={() => onSwitchMode('register')}
                  className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                    !isLogin
                      ? 'bg-[#9dbf14] text-[#22264b] shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Registrarse
                </button>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {!isLogin && (
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Nombre completo
                    <input
                      type="text"
                      value={form.name}
                      onChange={(event) => handleChange('name', event.target.value)}
                      placeholder="Tu nombre"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#3163a2] focus:bg-white dark:border-white/10 dark:bg-[#18213d] dark:text-white"
                    />
                  </label>
                )}

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Correo electrónico
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => handleChange('email', event.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#3163a2] focus:bg-white dark:border-white/10 dark:bg-[#18213d] dark:text-white"
                  />
                </label>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Contraseña
                  <input
                    type="password"
                    value={form.password}
                    onChange={(event) => handleChange('password', event.target.value)}
                    placeholder="••••••••"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#3163a2] focus:bg-white dark:border-white/10 dark:bg-[#18213d] dark:text-white"
                  />
                </label>

                {!isLogin && (
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Confirmar contraseña
                    <input
                      type="password"
                      value={form.confirmPassword}
                      onChange={(event) => handleChange('confirmPassword', event.target.value)}
                      placeholder="Repite tu contraseña"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#3163a2] focus:bg-white dark:border-white/10 dark:bg-[#18213d] dark:text-white"
                    />
                  </label>
                )}

                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 w-full rounded-full bg-[#9dbf14] px-5 py-3.5 text-sm font-bold text-[#22264b] shadow-lg shadow-[#9dbf14]/20 transition hover:bg-[#b5d83d] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'Procesando...' : isLogin ? 'Entrar' : 'Crear cuenta'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-300">
                {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
                <button
                  type="button"
                  onClick={() => onSwitchMode(isLogin ? 'register' : 'login')}
                  className="font-semibold text-[#3163a2] underline-offset-4 hover:underline dark:text-[#9dbf14]"
                >
                  {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
