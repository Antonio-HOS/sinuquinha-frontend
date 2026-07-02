import AppHeader from "@/src/components/AppHeader";
import Avatar from "@/src/components/Avatar";
import BottomNav from "@/src/components/BottomNav";
import { getButtonClassName } from "@/src/components/Button";
import { gajrajOne } from "@/src/fonts";
import { Hourglass, Trophy } from "lucide-react";
import Link from "next/link";

type MatchShellProps = {
  children: React.ReactNode;
  score?: number;
  exitButton?: boolean;
};

export function MatchShell({ children, score = 150, exitButton = true }: MatchShellProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col px-4 pb-4 pt-3 sm:px-5">
      <AppHeader score={score} />
      <main className="relative flex min-h-0 flex-1 flex-col">
        {exitButton && <Link
          href="/jogar"
          className={`${gajrajOne.className} absolute right-1 top-1 z-10 flex h-8 w-16 items-center justify-center border border-[#FFD700] text-sm text-[#FFD700] transition-colors hover:bg-[#FFD700] hover:text-black`}
        >
          Sair
        </Link>}
        {children}
      </main>
      <BottomNav active="trophy" />
    </div>
  );
}

type MatchTitleProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

export function MatchTitle({ title, subtitle, className = "" }: MatchTitleProps) {
  return (
    <section className={`w-full px-8 ${className}`.trim()}>
      <h1
        className={`${gajrajOne.className} text-center text-[clamp(2rem,8vw,2.25rem)] text-[#FFD700]`}
      >
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-1 text-base tracking-[0.08em] text-[#FFEDAD]">
          {subtitle}
        </p>
      ) : null}
    </section>
  );
}

export function MatchDivider() {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="h-px flex-1 bg-white/30" />
      <div className="relative mx-3 flex size-5 items-center justify-center rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.65)]">
        <span className="absolute -top-2 text-[8px] text-white/80">▲</span>
        <span className="absolute -bottom-2 text-[8px] text-white/80">▼</span>
        <span className="absolute -left-2 text-[8px] text-white/80">◀</span>
        <span className="absolute -right-2 text-[8px] text-white/80">▶</span>
      </div>
      <div className="h-px flex-1 bg-white/30" />
    </div>
  );
}

type MatchCtaProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function MatchCta({ href, children, className = "" }: MatchCtaProps) {
  return (
    <Link
      href={href}
      className={`${gajrajOne.className} flex h-14 items-center justify-center rounded-md border border-[#2AC054] px-6 text-[2rem] leading-none text-[#2AC054] transition-colors hover:bg-[#2AC054] hover:text-[#004C55] ${className}`.trim()}
    >
      {children}
    </Link>
  );
}

type CoinBadgeProps = {
  value: number;
  active?: boolean;
  className?: string;
  avatarClassName?: string;
  textClassName?: string;
};

export function CoinBadge({
  value,
  active = false,
  className = "",
  avatarClassName = "size-12",
  textClassName = "text-[2rem]",
}: CoinBadgeProps) {
  return (
    <div
      className={`flex h-[58px] items-center gap-3 rounded-[3px] border px-2 ${
        active
          ? "border-[#FFD700] bg-[#FFD700]/15"
          : "border-white/30 bg-white/15"
      } ${className}`.trim()}
    >
      <Avatar className={avatarClassName} />
      <span className={`${gajrajOne.className} leading-none text-[#FFD700] ${textClassName}`}>
        {value}
      </span>
    </div>
  );
}

type PlayerPillProps = {
  name: string;
  status?: string;
  href?: string;
};

export function PlayerPill({ name, status, href }: PlayerPillProps) {
  const content = (
    <>
      <Avatar className="size-12 border border-[#FFEDAD]/60" />
      <span className={`${gajrajOne.className} text-sm tracking-[0.07em] text-[#FFD700]`}>
        {name}
      </span>
      {status ? (
        <span className="ml-auto rounded-full bg-[#2AC054] px-2 py-0.5 text-xs font-semibold text-white">
          {status}
        </span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className="flex items-center gap-3 rounded-lg px-2 py-1 transition-colors hover:bg-white/10">
        {content}
      </Link>
    );
  }

  return <div className="flex items-center gap-3 rounded-lg px-2 py-1">{content}</div>;
}

type MatchPlayerCardProps = {
  name: string;
  score?: number;
  status?: string;
};

export function MatchPlayerCard({
  name,
  score = 0,
  status = "Confirmado",
}: MatchPlayerCardProps) {
  return (
    <article className="flex min-h-[158px] flex-col items-center justify-center rounded border border-[#FFD700]/70 bg-white/10 p-3 text-center">
      <Avatar className="size-16 border-2 border-[#FFEDAD]/70" />
      <h2 className={`${gajrajOne.className} mt-3 text-lg tracking-[0.08em] text-[#FFD700]`}>
        {name}
      </h2>
      <MatchStatus status={status} />
      <strong className={`${gajrajOne.className} mt-2 text-3xl text-white`}>
        {score}
      </strong>
    </article>
  );
}

type BetCardProps = {
  value: number;
  opponent?: string;
  gameType?: string;
  bestOf?: number;
  compact?: boolean;
};

export function BetCard({
  value,
  opponent = "codigo",
  gameType = "Bola 8",
  bestOf = 3,
  compact = false,
}: BetCardProps) {
  return (
    <section className="mx-auto w-full max-w-[272px] border border-[#FFD700] p-2">
      <div className="flex items-center justify-between text-[#FFEDAD]">
        <span className="tracking-[0.08em]">Oponente</span>
        <span className={`${gajrajOne.className} flex items-center gap-1 text-[#FFD700]`}>
          Aposta <Avatar className="size-5" /> {value}
        </span>
      </div>

      <div className={`${compact ? "mt-4 gap-2" : "mt-7 gap-4"} flex flex-col items-center`}>
        <Avatar className={`${compact ? "size-16" : "size-20"} border-2 border-[#FFEDAD]/70`} />
        <span className={`${gajrajOne.className} ${compact ? "text-[1.65rem]" : "text-[2rem]"} leading-none tracking-[0.08em] text-[#FFD700]`}>
          {opponent}
        </span>
        <MatchStatus status="Pendente" pending />
      </div>

      <div className={`${compact ? "mt-3 text-sm" : "mt-5"} text-left text-[#FFEDAD]`}>
        <p>
          <span className={`${gajrajOne.className}`}>Tipo de jogo:</span>{" "}
          <span className={compact ? "text-base" : "text-xl"}>{gameType}</span>
        </p>
        <p>
          <span className={`${gajrajOne.className}`}>melhor de:</span>{" "}
          <span className={compact ? "text-base" : "text-xl"}>{bestOf}</span>
        </p>
      </div>
    </section>
  );
}

type RewardBadgeProps = {
  value: number;
};

export function RewardBadge({ value }: RewardBadgeProps) {
  return (
    <div className="relative flex flex-col items-center">
      <div className="relative flex size-24 items-center justify-center text-[#FFD700] drop-shadow-[0_8px_0_rgba(0,0,0,0.35)]">
        <Trophy className="size-24 fill-[#FFD700] stroke-[#FFD700]" strokeWidth={1.6} />
        <Avatar className="absolute top-8 size-10 border-2 border-[#FFD700]" />
      </div>
      <strong className={`${gajrajOne.className} mt-1 text-[2.35rem] leading-none text-[#FFD700]`}>
        {value}
      </strong>
    </div>
  );
}

type MatchStatusProps = {
  status: string;
  pending?: boolean;
};

export function MatchStatus({ status, pending = false }: MatchStatusProps) {
  return (
    <span className={`${gajrajOne.className} mt-1 flex items-center gap-1 text-sm tracking-[0.08em] text-[#FFEDAD]`}>
      {status}
      {pending ? <Hourglass className="size-4 text-[#FFD700]" /> : null}
    </span>
  );
}

type ResultActionsProps = {
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function ResultActions({
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: ResultActionsProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      {secondaryHref && secondaryLabel ? (
        <Link
          href={secondaryHref}
          className={getButtonClassName({ variant: "outline", size: "sm" })}
        >
          {secondaryLabel}
        </Link>
      ) : null}
      <Link
        href={primaryHref}
        className={getButtonClassName({ variant: "success", size: "sm" })}
      >
        {primaryLabel}
      </Link>
    </div>
  );
}
