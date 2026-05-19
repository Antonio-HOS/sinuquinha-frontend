"use client";

import Avatar from "@/src/components/Avatar";
import BottomNav from "@/src/components/BottomNav";
import { gajrajOne } from "@/src/fonts";
import { Settings } from "lucide-react";

const ranking = [
  { pos: 1, name: "Galdino", score: 150, bg: "bg-[#FFD700]", text: "text-black" },
  { pos: 2, name: "Henrique", score: 140, bg: "bg-[#C0C0C0]", text: "text-black" },
  { pos: 3, name: "Rodrigo", score: 130, bg: "bg-[#CD7F32]", text: "text-white" },
  { pos: 4, name: "Antonio", score: 100, bg: "bg-[#6B7280]", text: "text-white" },
  { pos: 5, name: "Thiago", score: 15, bg: "bg-[#374151]", text: "text-white" },
] as const;

export default function HomePage() {
  return (
    <div className=" flex h-full min-h-0 flex-col px-4 pb-24 pt-3 w-[340px] relative">
      <header className="mb-2 flex items-center justify-end ">
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
          <Settings className="w-8 h-8 ml-2" />
        </button>
      </header>

      <h1
        className={`${gajrajOne.className} text-center text-[36px] text-[#FFD700]`}
      >
        Sinuquinha
      </h1>

    

      <section className="flex  flex-col gap-2 overflow-y-auto mt-12">
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
              className={`flex items-center justify-between rounded-sm px-3 py-0 my-1 mx-3 ${player.bg} ${player.text} justify-between`}
            >
                <span className="w-6 text-center text-sm font-bold text-white [-webkit-text-stroke:1px_#000] [paint-order:stroke_fill]">{player.pos}</span>
              <span className={`${gajrajOne.className} text-sm flex items-center gap-2  text-white [-webkit-text-stroke:1px_#000] [paint-order:stroke_fill]`}>
                {player.name}
              </span>
              <span className="flex items-center gap-2 text-sm font-semibold text-white [-webkit-text-stroke:1px_#000] [paint-order:stroke_fill]">
                {player.score}
                <Avatar className="h-7 w-7" />
              </span>
            </li>
          ))}
        </ul>
      </section>
     
      <div className=" flex flex-col items-center gap-3 mt-8">
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

