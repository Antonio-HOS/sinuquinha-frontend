"use client";

import AppHeader from "@/src/components/AppHeader";
import Avatar from "@/src/components/Avatar";
import BottomNav from "@/src/components/BottomNav";
import { gajrajOne } from "@/src/fonts";
import Link from "next/link";

const ranking = [
  { pos: 1, name: "Antonio", score: 1000, bg: "bg-[#6B7280]", text: "text-white" },
  { pos: 2, name: "Galdino", score: 150, bg: "bg-[#FFD700]", text: "text-black" },
  { pos: 3, name: "Henrique", score: 140, bg: "bg-[#C0C0C0]", text: "text-black" },
  { pos: 4, name: "Jorge Lima", score: 130, bg: "bg-[#CD7F32]", text: "text-white" },
  { pos: 5, name: "Rodrigo", score: 130, bg: "bg-[#CD7F32]", text: "text-white" },
  { pos: 6, name: "Thiago", score: 15, bg: "bg-[#374151]", text: "text-white" },
] as const;

export default function HomePage() {
  return (
    <div className="flex min-h-full flex-1 flex-col px-4 pb-4 pt-3 sm:px-5">
      <AppHeader  />

      <h1
        className={`${gajrajOne.className} text-center text-[clamp(2rem,8vw,2.25rem)] text-[#FFD700]`}
      >
        Sinuquinha
      </h1>

      <div className="mt-8 flex flex-1 flex-col">
        <section className="scrollbar-hidden flex flex-col gap-2 overflow-y-auto pb-6 h-[230px]">
          <p className="text-center text-xs font-medium tracking-[0.2em] text-white/80">
            <span className="mr-1" aria-hidden>
              🏆
            </span>
            RANKING ATUAL
          </p>
          <ul className="flex flex-col gap-2">
            {ranking.map((player) => (
              <li
                key={player.pos}
                className={`mx-1 flex items-center justify-between rounded-sm px-3 py-0.5 sm:px-4 ${player.bg} ${player.text}`}
              >
                <span className="w-6 shrink-0 text-center text-sm font-bold text-white [-webkit-text-stroke:1px_#000] [paint-order:stroke_fill]">
                  {player.pos}
                </span>
                <span
                  className={`${gajrajOne.className} mx-3 flex min-w-0 flex-1 items-center gap-2 truncate text-xs text-white [-webkit-text-stroke:1px_#000] [paint-order:stroke_fill] sm:text-sm`}
                >
                  <span className="truncate">{player.name}</span>
                </span>
                <span className="flex shrink-0 items-center gap-2 text-xs font-semibold text-white [-webkit-text-stroke:1px_#000] [paint-order:stroke_fill] sm:text-sm">
                  {player.score}
                  <Avatar className="h-5 w-5 sm:h-6 sm:w-6" />
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-col items-center gap-3 pb-4 mt-4">
          <Link
            href="/jogar"
            className="flex h-12 w-full max-w-[280px] items-center justify-center rounded-lg bg-[#FFD700] px-4 text-xl text-black transition-opacity hover:opacity-90"
          >
            Jogar
          </Link>
          <button
            type="button"
            className={`${gajrajOne.className} h-12 w-full max-w-[280px] rounded-lg border border-[#FFD700] px-4 text-xl text-[#FFD700] transition-all duration-300 hover:bg-[#FFD700] hover:text-black`}
          >
            NORMAL
          </button>
        </div>
      </div>
      <BottomNav active="home" />
    </div>
  );
}

