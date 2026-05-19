type AvatarProps = {
  className?: string;
};

export default function Avatar({ className = "h-8 w-8" }: AvatarProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-white/20 text-xs ${className}`}
      aria-hidden
    >
      🐕
    </span>
  );
}
