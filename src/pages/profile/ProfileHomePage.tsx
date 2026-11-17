import { useEffect, useState } from "react";
import { getAdminUserProfile, getMyUserProfile, type UserProfile } from "../../lib/api";
import { ProfileHeader } from "../../components/profile/ProfileHeader";
import { ProfileNavigation } from "../../components/profile/ProfileNavigation";
import { ProfileLayout } from "../../components/profile/ProfileLayout";

type Props = Readonly<{
  mode: "self" | "admin";
  userId?: number;
  onToast?: (message: string, kind?: "success" | "error" | "info" | "confirm", title?: string) => void;
}>;

export function ProfileHomePage({ mode, userId, onToast }: Props) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const response = mode === "self"
          ? await getMyUserProfile()
          : await getAdminUserProfile(undefined, userId as number);
        setProfile(response.profile);
      } catch (error) {
        const message = error instanceof Error ? error.message : "No fue posible cargar el perfil.";
        onToast?.(message, "error", "Mi perfil");
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [mode, userId, onToast]);

  return (
    <ProfileLayout
      title="Centro de configuración"
      subtitle="Administra tu perfil por secciones independientes."
      breadcrumb="Mi perfil"
      onBackHome={() => {
        window.location.hash = "#perfil";
      }}
    >
      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500 dark:border-white/10 dark:bg-[#111d35] dark:text-slate-400">Cargando información...</div>
      ) : profile ? (
        <>
          <ProfileHeader profile={profile} />
          <ProfileNavigation onNavigate={(path) => { window.location.hash = path; }} />
        </>
      ) : (
        <div className="rounded-2xl border border-red-200 bg-white p-8 text-sm text-red-600 dark:border-red-500/20 dark:bg-[#111d35] dark:text-red-300">No se pudo obtener la información del perfil.</div>
      )}
    </ProfileLayout>
  );
}
