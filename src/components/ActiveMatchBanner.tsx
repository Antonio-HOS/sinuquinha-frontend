"use client";

import { useSocket } from "@/src/providers/SocketProvider";
import { gajrajOne } from "@/src/fonts";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ActiveMatchBanner() {
  const { activeMatch } = useSocket();
  const pathname = usePathname();

  if (!activeMatch || activeMatch.status !== "active") {
    return null;
  }

  if (pathname === "/jogar/partida") {
    return null;
  }

  return (
    <div
      role="status"
      className="sticky top-0 z-50 shrink-0 border-b border-[#FFD700]/60 bg-[#004C55]/95 px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-3 backdrop-blur-sm md:rounded-t-[32px]"
    >
      <div className="flex w-full items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className={`${gajrajOne.className} truncate text-base text-[#FFD700]`}>
            Partida em andamento
          </p>
          <p className="truncate text-xs text-[#FFEDAD]/80">
            {activeMatch.game_type} · {activeMatch.stake_coins} moedas
          </p>
        </div>
        <Link
          href={`/jogar/partida?matchId=${activeMatch.id}`}
          className={`${gajrajOne.className} shrink-0 rounded-md border border-[#2AC054] bg-[#2AC054] px-4 py-2 text-sm leading-none text-[#004C55] transition-colors hover:bg-[#2AC054]/90`}
        >
          Voltar
        </Link>
      </div>
    </div>
  );
}
