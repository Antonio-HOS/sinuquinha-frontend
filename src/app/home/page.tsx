"use client";

import Avatar from "@/src/components/Avatar";
import BottomNav from "@/src/components/BottomNav";
import { gajrajOne } from "@/src/fonts";

const ranking = [
  { pos: 1, name: "Galdino", score: 150, bg: "bg-[#FFD700]", text: "text-black" },
  { pos: 2, name: "Henrique", score: 140, bg: "bg-[#C0C0C0]", text: "text-black" },
  { pos: 3, name: "Rodrigo", score: 130, bg: "bg-[#CD7F32]", text: "text-white" },
  { pos: 4, name: "Antonio", score: 100, bg: "bg-[#6B7280]", text: "text-white" },
  { pos: 5, name: "Thiago", score: 15, bg: "bg-[#374151]", text: "text-white" },
] as const;

export default function HomePage() {
  return (
    <div className=" flex h-full min-h-0 flex-col px-4 pb-24 pt-6 w-[340px] relative">
      <header className="mb-2 flex items-start justify-between">
        <div className="flex gap-2">
          <button
            type="button"
            className="flex items-center gap-2 rounded-full bg-[#FFD700] px-3 py-1.5 text-black"
            aria-label="Adicionar amigo"
          >
            <span className="text-lg font-bold leading-none">+</span>
            <Avatar className="h-7 w-7" />
          </button>
          <div className="flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-white">
            <span className="font-semibold">150</span>
            <Avatar className="h-7 w-7" />
          </div>
        </div>
        <button
          type="button"
          className="text-white/90 transition hover:text-white"
          aria-label="Configurações"
        >
          <SettingsIcon />
        </button>
      </header>

      <h1
        className={`${gajrajOne.className} text-center text-[36px] text-[#FFD700]`}
      >
        Sinuquinha
      </h1>

    

      <section className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto mt-14">
        <p className="text-center text-xs font-medium tracking-[0.2em] text-white/80">
          <span className="mr-1" aria-hidden>
            🏆
          </span>
          RANKING ATUAL
        </p>
        <ul className="flex flex-col gap-1.5">
          {ranking.map((player) => (
            <li
              key={player.pos}
              className={`flex items-center justify-between rounded-lg px-3 py-2 ${player.bg} ${player.text}`}
            >
              <span className={`${gajrajOne.className} text-sm flex items-center gap-2  text-white`}>
                <span className="w-6 text-center text-sm font-bold text-white">{player.pos}</span>
                {player.name}
              </span>
              <span className="flex items-center gap-2 text-sm font-semibold text-black">
                {player.score}
                <Avatar className="h-7 w-7" />
              </span>
            </li>
          ))}
        </ul>
      </section>
      <div className="mt-4 flex flex-col items-center gap-3">
        <button
          type="button"
          className="h-12 w-full max-w-[280px] rounded-lg bg-[#FFD700] text-xl text-black transition-opacity hover:opacity-90"
        >
          Jogar
        </button>
        <button
          type="button"
          className={`${gajrajOne.className} h-12 w-full max-w-[280px] rounded-lg border border-[#FFD700] text-xl text-[#FFD700] transition-all duration-300 hover:bg-[#FFD700] hover:text-black`}
        >
          NORMAL
        </button>
      </div>
      <div
        className="mt-3 flex flex-col items-center gap-0.5 pb-2 text-xl leading-none"
        aria-hidden
      >
      </div>
      <BottomNav active="home" />
    </div>
  );
}

function SettingsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}
