import AppHeader from "@/src/components/AppHeader";
import BottomNav from "@/src/components/BottomNav";
import { gajrajOne } from "@/src/fonts";
import Link from "next/link";

const modosDeJogo = ["1x1", "2x2", "3x3"] as const;

export default function JogarPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col px-4 pb-4 pt-3 sm:px-5">
      <AppHeader className="" />

      <section className="flex flex-col items-center">
        <h1
          className={`${gajrajOne.className} text-center text-[clamp(2rem,8vw,2.2rem)] text-[#FFEDAD]`}
        >
          Ranking
        </h1>
      </section>

      <section className="flex flex-1 flex-col items-center mt-10">
        <h2
          className={`${gajrajOne.className} text-center text-[clamp(2rem,8vw,2.2rem)] text-[#FFEDAD]`}
        >
          Modo de Jogo
        </h2>

        <div className="mt-10 flex w-full max-w-[280px] flex-col items-center gap-5 sm:gap-6">
          {modosDeJogo.map((modo) => (
            <Link
              key={modo}
              href={`/jogar/selecionar?mode=${modo}`}
              className={`${gajrajOne.className} flex items-center justify-center h-14 w-full rounded-xl border border-[#FFD700] bg-[#0B6670]/30 px-4 text-[22px] text-[#FFD700] shadow-[0_0_0_1px_rgba(255,215,0,0.05)] transition-all duration-300 hover:bg-[#FFD700] hover:text-black`}
            >
              {modo}
            </Link>
          ))}
        </div>
      </section>

      <BottomNav active="trophy" />
    </div>
  );
}
