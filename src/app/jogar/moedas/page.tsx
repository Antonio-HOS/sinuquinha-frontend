import {
  CoinBadge,
  MatchCta,
  MatchShell,
  MatchTitle,
} from "@/src/app/jogar/components/MatchFlow";
import { gajrajOne } from "@/src/fonts";
import Avatar from "@/src/components/Avatar";

const coinOptions = [500, 600, 550, 650];
const gameTypes = ["Mata Mata", "Bola 8", "Brasileirinha"];
const bestOfOptions = [3, 5, 7];

export default function MatchCoinsPage() {
  return (
    <MatchShell exitButton={false}>
      <div className="scrollbar-hidden mx-auto flex min-h-0 w-full max-h-[calc(100vh-60px)] max-w-[344px] flex-1 flex-col overflow-y-auto">
        <MatchTitle title="Moedas" className="px-0 text-center" />

        <section className="mt-6 grid grid-cols-2 gap-3 px-2">
          {coinOptions.map((value) => (
            <CoinBadge
              key={value}
              value={value}
              active={value === 550}
              className="justify-center gap-2 px-2"
              avatarClassName="size-10"
              textClassName="text-[1.65rem]"
            />
          ))}
        </section>

        <section className="mt-6 px-5">
          <label className="flex h-12 items-center gap-3 rounded-md bg-white px-3">
            <Avatar className="size-9" />
            <span className="sr-only">Digite o valor</span>
            <input
              type="number"
              placeholder="Digite o valor"
              className={`${gajrajOne.className} min-w-0 flex-1 bg-transparent text-lg text-black outline-none placeholder:text-black/20`}
            />
          </label>
        </section>

        <section className="mt-6 px-1">
          <h2 className={`${gajrajOne.className} text-base text-[#FFEDAD]`}>
            Tipo de jogo:
          </h2>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {gameTypes.map((type) => (
              <button
                key={type}
                type="button"
                className="flex h-11 items-center justify-center rounded border border-white/80 px-1 text-center text-[0.72rem] leading-tight tracking-wider text-[#FFEDAD] shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition-colors hover:border-[#FFD700] hover:text-[#FFD700] sm:text-xs"
              >
                {type}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-5 px-1">
          <h2 className={`${gajrajOne.className} text-base text-[#FFEDAD]`}>
            Melhor de:
          </h2>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {bestOfOptions.map((option) => (
              <button
                key={option}
                type="button"
                className="flex h-11 items-center justify-center rounded border border-white/80 px-2 text-sm tracking-[0.08em] text-[#FFEDAD] shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition-colors hover:border-[#FFD700] hover:text-[#FFD700]"
              >
                {option}
              </button>
            ))}
          </div>
        </section>

        <div className="mt-auto flex justify-center pb-4 pt-6">
          <MatchCta href="/jogar/aguardando" className="h-12 px-8 text-[1.65rem]">
            Confirmar
          </MatchCta>
        </div>
      </div>
    </MatchShell>
  );
}
