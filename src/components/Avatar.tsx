import Image from "next/image";

type AvatarProps = {
  className?: string;
};

export default function Avatar({ className = "h-8 w-8" }: AvatarProps) {
  return (
    <span
      className={`relative inline-flex shrink-0 overflow-hidden rounded-full ${className}`}
      aria-hidden
    >
      <Image
        src="/rucoin.svg"
        alt=""
        fill
        sizes="48px"
        className="object-cover"
      />
    </span>
  );
}
