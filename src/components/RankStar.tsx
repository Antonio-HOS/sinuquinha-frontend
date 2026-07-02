import Image from "next/image";

type RankStarProps = {
  className?: string;
};

export default function RankStar({ className = "size-4" }: RankStarProps) {
  return (
    <span
      className={`relative inline-flex shrink-0 ${className} ml-1 mr-1`}
      aria-hidden
    >
      <Image
        src="/estrela-3d2.png"
        alt=""
        fill
        sizes="32px"
        className="object-contain"
      />
    </span>
  );
}
