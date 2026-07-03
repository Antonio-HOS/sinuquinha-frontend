import RankStar from "@/src/components/RankStar";

type RankPointsProps = {
  value: number | string;
  className?: string;
  starClassName?: string;
};

export default function RankPoints({
  value,
  className = "inline-flex items-center gap-1",
  starClassName,
}: RankPointsProps) {
  return (
    <span className={className}>
      <span>{value}</span>
      <RankStar className={starClassName ?? "size-4"} />
    </span>
  );
}
