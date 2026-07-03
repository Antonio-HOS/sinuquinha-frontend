import Image from "next/image";
import { getAvatarUrl } from "../lib/avatarMapping";

type AvatarSize = "sm" | "md" | "lg" | "xl" | number;

type AvatarProps = {
  avatarId?: number | null;
  size?: AvatarSize;
  className?: string;
  objectFit?: "cover" | "contain";
};

const sizeMap: Record<Exclude<AvatarSize, number>, number> = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 88,
};

export function Avatar({ avatarId, size, className = "", objectFit = "cover" }: AvatarProps) {
  const numericSize = typeof size === "number" ? size : size ? sizeMap[size] : undefined;

  return (
    <span
      className={`relative inline-flex shrink-0 overflow-hidden rounded-full ${className}`.trim()}
      style={numericSize ? { width: numericSize, height: numericSize } : undefined}
      aria-hidden
    >
      <Image
        src={getAvatarUrl(avatarId)}
        alt=""
        fill
        sizes={numericSize ? `${numericSize}px` : "64px"}
        className={objectFit === "contain" ? "object-contain" : "object-cover"}
      />
    </span>
  );
}

export default Avatar;
