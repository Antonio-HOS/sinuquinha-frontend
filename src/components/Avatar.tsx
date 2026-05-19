type AvatarProps = {
  className?: string;
};

export default function Avatar({ className = "h-8 w-8" }: AvatarProps) {
  return (
    <span
      className={`inline-flex shrink-0 overflow-hidden rounded-full ${className}`}
      aria-hidden
    >
      <img
        src="/rucoin.svg"
        alt=""
        className="size-full object-cover"
      />
    </span>
  );
}
