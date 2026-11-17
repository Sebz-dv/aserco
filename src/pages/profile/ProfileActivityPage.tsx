import { useEffect, useState } from "react";
import { Activity, CalendarDays, ShieldCheck } from "lucide-react";
import { getAdminUserProfile, getMyUserProfile, type UserProfile } from "../../lib/api";
import { ProfileLayout } from "../../components/profile/ProfileLayout";

type Props = Readonly<{
  mode: "self" | "admin";
  userId?: number;
  onToast?: (message: string, kind?: "success" | "error" | "info" | "confirm", title?: string) => void;
}>;

const formatDate = (value: string | null | undefined) => {
  if (!value) return "No disponible";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No disponible";
  return date.toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
};

export function ProfileActivityPage({ mode, userId, onToast }: Props) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const response = mode === "self"
          ? await getMyUserProfile()
          : await getAdminUserProfile(undefined, userId as number);
        setProfile(response.profile);
      } catch (error) {
        const message = error instanceof Error ? error.message : "No fue posible cargar la actividad.";
        onToast?.(message, "error", "Actividad");
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [mode, userId, onToast]);

  const cards = [
    {
      icon: CalendarDays,
      label: "Fecha de creación",
      value: formatDate(profile?.createdAt),
    },
    {
      icon: Activity,
      label: "Última actualización",
      value: formatDate((profile as UserProfile & { updatedAt?: string | null })?.updatedAt ?? null),
    },
    {
      icon: ShieldCheck,
      label: "Estado de cuenta",
      value: profile?.accountStatus ?? (profile?.isActive ? "Activa" : "Pendiente"),
    },
  ];

  return (
    <ProfileLayout
      title="Actividad de la cuenta"
      subtitle="Consulta metadatos disponibles del perfil y estado actual."
      breadcrumb="Mi perfil / Actividad"
      onBackHome={() => {
        window.location.hash = "#perfil";
      }}
    >
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111d35]">
        {loading ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Cargando actividad...</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-3">
            {cards.map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#3163a2] dark:text-[#9dbf14]">
                  <item.icon size={14} />
                  {item.label}
                </div>
                <p className="mt-3 text-sm font-semibold text-[#22264b] dark:text-white">{item.value}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </ProfileLayout>
  );
}
