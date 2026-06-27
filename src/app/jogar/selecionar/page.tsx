import {
  MatchShell,
  MatchTitle,
  PlayerPill,
} from "@/src/app/jogar/components/MatchFlow";
import { gajrajOne } from "@/src/fonts";
import { Search } from "lucide-react";

const friends = [
  { name: "reiDelas", status: "+" },
  { name: "Fofinho", status: "+" },
  { name: "Olouco", status: "+" },
];

export default function SelectPlayerPage() {
  return (
    <MatchShell exitButton={false}>
      <div className="scrollbar-visible mx-auto flex max-h-[calc(100vh-180px)] min-h-0 w-full max-w-[344px] flex-1 flex-col pr-2">
        <MatchTitle
          title="Selecionar"
          subtitle="Jogador"
          className="px-0 text-center"
        />

        <section className="mt-6 rounded-xl border border-white/15 bg-white/10 p-4">
          <p className="mb-3 text-center text-sm tracking-[0.12em] text-[#FFEDAD]/90">
            Busque um adversário ou escolha um amigo online
          </p>
          <label className="relative block">
            <span className="sr-only">Nome do jogador</span>
            <input
              type="search"
              placeholder="Nome do jogador"
              className="h-11 w-full rounded-md bg-white px-4 pr-11 text-sm tracking-[0.08em] text-black outline-none placeholder:text-black/35"
            />
            <Search className="absolute right-3 top-1/2 size-5 -translate-y-1/2 text-[#004C55]" />
          </label>
        </section>

        <section className="mt-6 rounded-xl border border-white/15 bg-white/10 p-4 pb-5">
          <div className="flex items-center justify-between">
            <h2
              className={`${gajrajOne.className} text-xl tracking-[0.08em] text-[#FFEDAD]`}
            >
              Amigos
            </h2>
            <span className="rounded-full bg-[#2AC054]/20 px-2 py-1 text-xs text-[#2AC054]">
              {friends.length} online
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {friends.map((friend) => (
              <PlayerPill
                key={friend.name}
                name={friend.name}
                status={friend.status}
                href="/jogar/moedas"
              />
            ))}
          </div>
        </section>
      </div>
    </MatchShell>
  );
}
