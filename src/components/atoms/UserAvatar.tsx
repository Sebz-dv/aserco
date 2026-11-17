import { UserCircle } from "lucide-react";

type UserAvatarSize = "sm" | "md" | "lg";

type UserAvatarProps = Readonly<{
  name: string;
  src?: string | null;
  size?: UserAvatarSize;
  className?: string;
  onError?: () => void;
}>;

const sizeStyles: Record<UserAvatarSize, { container: string; icon: number }> = {
  sm: { container: "size-5", icon: 14 },
  md: { container: "size-7", icon: 18 },
  lg: { container: "size-9", icon: 22 },
};

export function UserAvatar({
  name,
  src,
  size = "md",
  className = "",
  onError,
}: UserAvatarProps) {
  const style = sizeStyles[size];
  const baseClass = `${style.container} shrink-0 overflow-hidden rounded-full ring-1 ring-black/10 dark:ring-white/20 ${className}`.trim();

  if (src) {
    return (
      <img
        src={src}
        alt={`Foto de ${name}`}
        onError={onError}
        className={`${baseClass} object-cover`}
      />
    );
  }

  return (
    <span
      className={`${baseClass} grid place-items-center bg-white/80 text-[#3163a2] dark:bg-white/10 dark:text-[#dff090]`}
      aria-hidden="true"
    >
      <UserCircle size={style.icon} />
    </span>
  );
}