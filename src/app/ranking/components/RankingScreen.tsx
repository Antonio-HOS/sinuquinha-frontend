"use client";

import AppHeader from "@/src/components/AppHeader";
import Avatar from "@/src/components/Avatar";
import BottomNav from "@/src/components/BottomNav";
import RankPoints from "@/src/components/RankPoints";
import { api, type RankingEntry } from "@/src/lib/api";
import { gajrajOne } from "@/src/fonts";
import { ChevronLeft, ChevronRight, Gem, Medal, Shield, Sparkles, Trophy } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type League = "geral" | "bronze" | "prata" | "ouro" | "diamante";
type RankedLeague = Exclude<League, "geral">;

const leagueLabels: Record<League, string> = {
  geral: "Geral",
  bronze: "Bronze",
  prata: "Prata",
  ouro: "Ouro",
  diamante: "Diamante",
};

const leagueStyles: Record<League, string> = {
  geral: "border-[#FFD700] text-[#FFD700]",
  bronze: "border-[#CD7F32] text-[#CD7F32]",
  prata: "border-[#C0C0C0] text-[#C0C0C0]",
  ouro: "border-[#FFD700] text-[#FFD700]",
  diamante: "border-[#7DD3FC] text-[#7DD3FC]",
};

const leagueIcons: Record<League, React.ElementType> = {
  geral: Trophy,
  bronze: Shield,
  prata: Medal,
  ouro: Sparkles,
  diamante: Gem,
};

const leagueOrder: League[] = ["geral", "diamante", "ouro", "prata", "bronze"];

const leagueRanges: Record<RankedLeague, { min: number; max?: number }> = {
  bronze: { min: 400, max: 499 },
  prata: { min: 500, max: 599 },
  ouro: { min: 600, max: 749 },
  diamante: { min: 750 },
};

type RankingScreenProps = {
  league?: League;
};

export default function RankingScreen({ league = "geral" }: RankingScreenProps) {
  const [players, setPlayers] = useState<RankingEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const leagueNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadRanking() {
      try {
        const response = await api.rankings();
        setPlayers(response.rankings);
      } catch {
        setPlayers([]);
      } finally {
        setIsLoading(false);
      }
    }

    void loadRanking();
  }, []);

  const visiblePlayers =
    league === "geral"
      ? players
      : players.filter((player) => {
          const range = leagueRanges[league];
          return (
            player.points >= range.min &&
            (range.max === undefined || player.points <= range.max)
          );
        });

  const scrollLeagues = (direction: "left" | "right") => {
    leagueNavRef.current?.scrollBy({
      left: direction === "left" ? -120 : 120,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex min-h-full flex-1 flex-col px-4 pb-4 pt-3 sm:px-5">
      <AppHeader />

      <section className="flex flex-col items-center">
        <h1 className={`${gajrajOne.className} text-center text-[clamp(2rem,8vw,2.25rem)] text-[#FFD700]`}>
          Ranking
        </h1>
        <p className="mt-1 text-sm tracking-[0.18em] text-white/80">
          {leagueLabels[league].toUpperCase()}
        </p>
      </section>

      <div className="mt-5 grid grid-cols-[2.25rem_1fr_2.25rem] items-center gap-2 -mx-4 ">
        <button
          type="button"
          onClick={() => scrollLeagues("left")}
          className="flex size-9 items-center justify-center rounded-full border border-[#FFD700]/50 bg-white/10 text-[#FFD700] transition-colors hover:bg-[#FFD700] hover:text-black"
          aria-label="Ver ligas anteriores"
        >
          <ChevronLeft className="size-5" />
        </button>

        <nav
          ref={leagueNavRef}
          className="scrollbar-hidden flex gap-2 overflow-x-auto pb-1"
        >
          {leagueOrder.map((item) => {
            const Icon = leagueIcons[item];
            const isActive = league === item;

            return (
              <Link
                key={item}
                href={item === "geral" ? "/ranking" : `/ranking/${item}`}
                className={`${gajrajOne.className} flex min-w-[72px] shrink-0 flex-col items-center justify-center gap-1 rounded-lg border px-2 py-1.5 text-center text-[9px] leading-none transition-colors ${
                  isActive
                    ? `${leagueStyles[item]} bg-white/10 shadow-[0_0_16px_rgba(255,215,0,0.12)]`
                    : "border-white/20 text-white/60 hover:border-white/40 hover:bg-white/5"
                }`}
              >
                <Icon className="size-4" strokeWidth={1.8} />
                <span className="max-w-full truncate">{leagueLabels[item]}</span>
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => scrollLeagues("right")}
          className="flex size-9 items-center justify-center rounded-full border border-[#FFD700]/50 bg-white/10 text-[#FFD700] transition-colors hover:bg-[#FFD700] hover:text-black"
          aria-label="Ver próximas ligas"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <section className="scrollbar-hidden mt-6 flex flex-1 flex-col gap-3 overflow-y-auto pb-6">
        {isLoading ? (
          <p className="text-center text-sm text-white/70">Carregando ranking...</p>
        ) : null}
        {!isLoading && visiblePlayers.length === 0 ? (
          <p className="text-center text-sm text-white/70">
            Nenhum jogador encontrado nesta liga.
          </p>
        ) : null}
        {visiblePlayers.map((player, index) => (
          <article
            key={player.user_id}
            className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 rounded-md border border-white/15 bg-white/10 px-3 py-2"
          >
            <span className={`${gajrajOne.className} text-center text-xl text-[#FFD700]`}>
              {player.position ?? index + 1}
            </span>
            <Link
              href={`/profile/${player.user_id}`}
              className="flex min-w-0 items-center gap-3 transition-opacity hover:opacity-80"
            >
              <Avatar
                avatarId={player.avatar_id ? Number.parseInt(player.avatar_id, 10) : null}
                className="size-9"
              />
              <div className="min-w-0">
                <h2 className={`${gajrajOne.className} truncate text-sm text-white`}>
                  {player.nickname}
                </h2>
                <p
                  className={`text-xs ${
                    player.league ? leagueStyles[player.league] : "text-white/50"
                  }`}
                >
                  {player.league
                    ? `Liga ${leagueLabels[player.league]}`
                    : "Sem liga"}
                </p>
              </div>
            </Link>
            <RankPoints
              value={player.points}
              className={`${gajrajOne.className} flex items-center gap-1 text-sm text-[#FFD700]`}
              starClassName="size-4"
            />
          </article>
        ))}
      </section>

      <BottomNav active="trophy" />
    </div>
  );
}
