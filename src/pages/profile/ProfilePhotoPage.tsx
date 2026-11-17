import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { Camera, Trash2, UserCircle2 } from "lucide-react";
import {
  deleteMyAvatar,
  getAdminUserProfile,
  getMyUserProfile,
  uploadMyAvatar,
  type UserProfile,
} from "../../lib/api";
import { ProfileLayout } from "../../components/profile/ProfileLayout";

type Props = Readonly<{
  mode: "self" | "admin";
  userId?: number;
  onToast?: (message: string, kind?: "success" | "error" | "info" | "confirm", title?: string) => void;
}>;

const MAX_FILE_BYTES = 5 * 1024 * 1024;

export function ProfilePhotoPage({ mode, userId, onToast }: Props) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
        onToast?.(message, "error", "Fotografía");
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [mode, userId, onToast]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const currentAvatar = useMemo(() => {
    return previewUrl || profile?.avatarUrl || profile?.defaultAvatarUrl || null;
  }, [previewUrl, profile]);

  const onFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      onToast?.("Selecciona un archivo de imagen válido.", "error", "Fotografía");
      return;
    }

    if (file.size > MAX_FILE_BYTES) {
      onToast?.("La imagen no puede superar los 5 MB.", "error", "Fotografía");
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    if (mode !== "self") {
      onToast?.("Vista previa lista. Solo el propio usuario puede guardar avatar desde esta vista.", "info", "Fotografía");
      return;
    }

    setSaving(true);
    try {
      const response = await uploadMyAvatar(file);
      if (response.profile) {
        setProfile(response.profile);
      }
      setPreviewUrl(null);
      onToast?.("Fotografía actualizada correctamente.", "success", "Fotografía");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo actualizar la fotografía.";
      onToast?.(message, "error", "Fotografía");
    } finally {
      setSaving(false);
    }
  };

  const onDeleteAvatar = async () => {
    if (mode !== "self") return;
    setSaving(true);
    try {
      const response = await deleteMyAvatar();
      if (response.profile) {
        setProfile(response.profile);
      }
      setPreviewUrl(null);
      onToast?.("Se eliminó la fotografía personalizada.", "success", "Fotografía");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo eliminar la fotografía.";
      onToast?.(message, "error", "Fotografía");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProfileLayout
      title="Fotografía de perfil"
      subtitle="Administra tu imagen de cuenta con vista previa y validaciones."
      breadcrumb="Mi perfil / Fotografía"
      onBackHome={() => {
        window.location.hash = "#perfil";
      }}
    >
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111d35]">
        {loading ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Cargando fotografía...</p>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              {currentAvatar ? (
                <img src={currentAvatar} alt="Avatar" className="size-24 rounded-2xl border border-slate-200 object-cover dark:border-white/10" />
              ) : (
                <div className="grid size-24 place-items-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-400 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-500">
                  <UserCircle2 size={34} />
                </div>
              )}

              <div>
                <p className="text-sm font-semibold text-[#22264b] dark:text-white">{profile?.name ?? "Usuario"}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">PNG, JPG, WEBP o GIF. Máximo 5 MB.</p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={onFileSelected}
            />

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#22264b] transition hover:border-[#3163a2]/40 hover:text-[#3163a2] disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:hover:border-[#9dbf14]/40 dark:hover:text-[#9dbf14]"
              >
                <Camera size={14} />
                {mode === "self" ? "Subir o cambiar" : "Seleccionar imagen"}
              </button>

              {mode === "self" && profile?.hasCustomAvatar && (
                <button
                  type="button"
                  onClick={onDeleteAvatar}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60 dark:border-red-500/20 dark:bg-transparent dark:text-red-300 dark:hover:bg-red-500/10"
                >
                  <Trash2 size={14} />
                  Eliminar fotografía
                </button>
              )}
            </div>
          </div>
        )}
      </section>
    </ProfileLayout>
  );
}
