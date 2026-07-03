"use client";

import AppHeader from "@/src/components/AppHeader";
import Avatar from "@/src/components/Avatar";
import BottomNav from "@/src/components/BottomNav";
import RankPoints from "@/src/components/RankPoints";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { api, type RankingEntry } from "@/src/lib/api";
import { gajrajOne } from "@/src/fonts";
import Link from "next/link";
import { useEffect, useState } from "react";

const rowStyle = (position: number) => {
  if (position === 1) return "bg-[#FFD700] text-black";
  if (position === 2) return "bg-[#C0C0C0] text-black";
  if (position === 3) return "bg-[#CD7F32] text-white";
  return "bg-[#374151] text-white";
};

export default function HomePage() {
  const { isLoading } = useCurrentUser({ redirectToLogin: true });
  const [ranking, setRanking] = useState<RankingEntry[]>([]);

  useEffect(() => {
    async function loadRanking() {
      try {
        const response = await api.rankings();
        setRanking(response.rankings.slice(0, 6));
      } catch {
        setRanking([]);
      }
    }

    void loadRanking();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center text-white">
        Carregando...
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col px-4 pb-4 pt-3 sm:px-5">
      <AppHeader  />

      <h1
        className={`${gajrajOne.className} text-center text-[clamp(2rem,8vw,2.25rem)] text-[#FFD700]`}
      >
        Sinuquinha
      </h1>

      <div className="md:mt-8  mt-28 flex flex-1 flex-col">
        <section className="scrollbar-hidden flex flex-col gap-2 overflow-y-auto pb-6 h-[230px]">
          <p className="text-center text-xs font-medium tracking-[0.2em] text-white/80">
            <span className="mr-1" aria-hidden>
              🏆
            </span>
            RANKING ATUAL
          </p>
          <ul className="flex flex-col gap-2">
            {ranking.map((player, index) => (
              <li
                key={player.user_id}
                className={`mx-1 flex items-center justify-between rounded-sm px-3 py-0.5 sm:px-4 ${rowStyle(player.position ?? index + 1)}`}
              >
                <span className="w-6 shrink-0 text-center text-sm font-bold text-white [-webkit-text-stroke:1px_#000] [paint-order:stroke_fill]">
                  {player.position ?? index + 1}
                </span>
                <span
                  className={`${gajrajOne.className}  flex min-w-0 flex-1 items-center gap-1.5 truncate text-xs text-white [-webkit-text-stroke:1px_#000] [paint-order:stroke_fill] sm:gap-2 sm:text-sm`}
                >
                  <Avatar
                    avatarId={player.avatar_id ? Number.parseInt(player.avatar_id, 10) : null}
                    className="size-6 border border-black/25 sm:size-7"
                  />
                  <span className="truncate">{player.nickname}</span>
                </span>
                <RankPoints
                  value={player.points}
                  className="shrink-0 text-xs font-semibold text-white [-webkit-text-stroke:1px_#000] [paint-order:stroke_fill] sm:text-sm"
                  starClassName="h-4 w-4 sm:h-5 sm:w-5"
                />
              </li>
            ))}
            {ranking.length === 0 ? (
              <li className="text-center text-sm text-white/70">
                Nenhum ranking ativo encontrado.
              </li>
            ) : null}
          </ul>
        </section>

        <div className="flex flex-col items-center gap-3 pb-4 mt-4">
          <Link
            href="/jogar"
            className="flex h-12 w-full max-w-[280px] items-center justify-center rounded-lg bg-[#FFD700] px-4 text-xl text-black transition-opacity hover:opacity-90"
          >
            Jogar
          </Link>
          {/* <button
            type="button"
            className={`${gajrajOne.className} h-12 w-full max-w-[280px] rounded-lg border border-[#FFD700] px-4 text-xl text-[#FFD700] transition-all duration-300 hover:bg-[#FFD700] hover:text-black`}
          >
            NORMAL
          </button> */}
        </div>
      </div>
      <BottomNav active="home" />
    </div>
  );
}

