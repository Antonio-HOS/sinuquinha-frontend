import {
  CoinBadge,
  MatchCta,
  MatchPlayerCard,
  MatchShell,
  MatchTitle,
} from "@/src/app/jogar/components/MatchFlow";
import { gajrajOne } from "@/src/fonts";

const players = [
  { name: "reiDelas", score: 0, status: "Confirmado" },
  { name: "codigo", score: 0, status: "Confirmado" },
];

export default function ActiveMatchPage() {
  return (
    <MatchShell exitButton={false}>
      <div className="scrollbar-hidden mx-auto flex max-h-[calc(100vh-140px)] min-h-0 w-full max-w-[344px] flex-1 flex-col overflow-y-auto">
        <MatchTitle title="Partida" subtitle="Bola 8 | Melhor de 3" className="px-0 text-center" />

        <section className="mt-5 grid grid-cols-2 gap-3 px-1">
          {players.map((player) => (
            <MatchPlayerCard
              key={player.name}
              name={player.name}
              score={player.score}
              status={player.status}
            />
          ))}
        </section>

        <section className="mt-5 flex items-center justify-between gap-4 rounded-md border border-white/15 bg-white/10 px-3 py-3">
          <p className={`${gajrajOne.className} text-base text-[#FFEDAD]`}>
            Aposta da partida
          </p>
          <div className="w-[132px]">
            <CoinBadge
              value={550}
              active
              className="h-12 justify-center gap-2"
              avatarClassName="size-8"
              textClassName="text-xl"
            />
          </div>
        </section>

        <section className="mt-5 rounded-md border border-white/15 bg-white/10 px-4 py-4 text-center">
          <p className="text-base tracking-[0.12em] text-white/85">
            Tempo da Partida
          </p>
          <p className={`${gajrajOne.className} mt-1 text-3xl text-[#FFD700]`}>
            00:12:48
          </p>
        </section>

        <div className="mt-auto flex justify-center pb-4 pt-5">
          <MatchCta href="/jogar/fim" className="h-12 px-8 text-[1.65rem]">
            Finalizar
          </MatchCta>
        </div>
      </div>
    </MatchShell>
  );
}
