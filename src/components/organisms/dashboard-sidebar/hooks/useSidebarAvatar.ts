import { useEffect, useState } from "react";
import { getMyUserProfile, type AuthUser } from "../../../../lib/api";

type UseSidebarAvatarResult = {
  avatarSrc: string | null;
  onAvatarError: () => void;
};

function resolveAvatarUrl(value: string | null | undefined): string | null {
  const next = value?.trim();
  if (!next) return null;
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
  const apiOrigin = apiBaseUrl.replace(/\/api\/?$/, "");
  const useProxy = import.meta.env.DEV && typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
  if (/^(https?:|data:|blob:)/i.test(next)) return next;
  if (next.startsWith("//")) {
    const protocol = typeof window !== "undefined" ? window.location.protocol : "https:";
    return `${protocol}${next}`;
  }
  if (next.startsWith("/")) {
    return useProxy && typeof window !== "undefined" ? `${window.location.origin}${next}` : `${apiOrigin}${next}`;
  }
  return useProxy && typeof window !== "undefined"
    ? `${window.location.origin}/${next}`
    : `${apiOrigin}/${next}`;
}

export function useSidebarAvatar(user: AuthUser | null): UseSidebarAvatarResult {
  const sourceUrl = resolveAvatarUrl(user?.avatarUrl ?? user?.defaultAvatarUrl ?? null);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(sourceUrl);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!user) { setAvatarSrc(null); return; }
      if (sourceUrl) { setAvatarSrc(sourceUrl); return; }
      try {
        const response = await getMyUserProfile();
        const resolved = resolveAvatarUrl(response.profile.avatarUrl ?? response.profile.defaultAvatarUrl ?? null);
        if (mounted) setAvatarSrc(resolved);
      } catch {
        if (mounted) setAvatarSrc(null);
      }
    };
    void load();
    return () => { mounted = false; };
  }, [user?.id, sourceUrl]);

  useEffect(() => setLoadError(false), [avatarSrc]);
  return { avatarSrc: loadError ? null : avatarSrc, onAvatarError: () => setLoadError(true) };
}
