import {
  BetCard,
  MatchCta,
  MatchShell,
  MatchTitle,
} from "@/src/app/jogar/components/MatchFlow";
import { gajrajOne } from "@/src/fonts";
import { Hourglass } from "lucide-react";
import Link from "next/link";

export default function WaitingOpponentPage() {
  return (
    <MatchShell exitButton={false}>
      <div className="scrollbar-visible mx-auto flex max-h-[calc(100vh-180px)] min-h-0 w-full max-w-[344px] flex-1 flex-col pr-2">
        <MatchTitle
          title="Aguardando"
          subtitle="Confirmação do Oponente"
          className="px-0 text-center"
        />

        <div className="mt-4">
          <BetCard value={550} compact />
        </div>

        <div className="mx-auto mt-4 flex w-full max-w-[272px] justify-center">
          <Hourglass className="size-14 rotate-12 text-[#FFEDAD]" />
        </div>

        <div className="mt-auto grid grid-cols-2 gap-3 pb-4 pt-4">
          <Link
            href="/jogar"
            className={`${gajrajOne.className} flex h-12 w-full items-center justify-center rounded-md border border-[#FFD700] px-4 text-xl text-[#FFD700] transition-colors hover:bg-[#FFD700] hover:text-[#004C55]`}
          >
            Cancelar
          </Link>
          <MatchCta href="/jogar/partida" className="h-12 w-full px-4 text-xl">
            Iniciar
          </MatchCta>
        </div>
      </div>
    </MatchShell>
  );
}
