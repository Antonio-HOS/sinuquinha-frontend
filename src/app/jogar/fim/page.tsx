import {
  MatchDivider,
  ResultActions,
  RewardBadge,
} from "@/src/app/jogar/components/MatchFlow";
import AppHeader from "@/src/components/AppHeader";
import Avatar from "@/src/components/Avatar";
import BottomNav from "@/src/components/BottomNav";
import { gajrajOne } from "@/src/fonts";

const matchResult = {
  winner: "Vencedor",
  subtitle: "Farmou Aura",
  playerName: "codigo",
  reward: 750,
  duration: "1h:20min",
  score: 150,
};

export default function MatchEndPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col px-4 pb-4 pt-3 sm:px-5">
      <AppHeader score={matchResult.score} />

      <main className="relative flex min-h-0 flex-1 flex-col items-center text-center">
        <div className="scrollbar-hidden mx-auto flex min-h-0 w-full max-w-[344px] flex-1 flex-col items-center overflow-y-scroll px-2">
          <section className="w-full rounded-xl border border-white/15 bg-white/10 p-4">

            <div className="mt-5 text-center">
              <h1
                className={`${gajrajOne.className} text-center text-[clamp(2rem,9vw,2.5rem)] leading-none tracking-[0.07em] text-[#2AC054]`}
              >
                {matchResult.winner}
              </h1>
              <p className="mt-2 text-center text-sm tracking-[0.12em] text-[#2AC054]">
                {matchResult.subtitle}
              </p>
            </div>
          </section>

          <section className="mt-4 flex w-full justify-center rounded-xl border border-[#FFD700]/30 bg-black/15 p-4">
            <RewardBadge value={matchResult.reward} />
          </section>

          <section className="mt-4 flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/10 px-4 py-3">
            <div className="flex items-center justify-center gap-3">
              <Avatar className="size-14 border-2 border-[#FFEDAD]/70" />
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.16em] text-[#FFEDAD]/70">
                  Jogador
                </p>
                <span
                  className={`${gajrajOne.className} text-xl leading-none tracking-[0.08em] text-[#FFD700]`}
                >
                  {matchResult.playerName}
                </span>
              </div>
            </div>
          </section>

          <section className="mt-4 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3">
            <p className={`${gajrajOne.className} text-center text-xl text-white/90`}>
              Fim de Jogo
            </p>
            <div className="mt-3 flex flex-col items-center justify-center gap-1 rounded-md bg-black/15 px-3 py-2">
              <span className="text-center text-xs tracking-[0.12em] text-[#FFEDAD]">
                Tempo da Partida
              </span>
              <span className={`${gajrajOne.className} text-lg text-white`}>
                {matchResult.duration}
              </span>
            </div>
          </section>

          <div className="mt-auto flex w-full justify-center pb-4 pt-5">
            <ResultActions
              primaryHref="/jogar/selecionar"
              primaryLabel="Revanche"
              secondaryHref="/jogar"
              secondaryLabel="Revogar"
            />
          </div>
        </div>
      </main>

      <BottomNav active="trophy" />
    </div>
  );
}
