"use client";

import {
  BetCard,
  MatchCta,
  MatchShell,
  MatchTitle,
} from "@/src/app/jogar/components/MatchFlow";
import { api, type Match } from "@/src/lib/api";
import { useSocket } from "@/src/providers/SocketProvider";
import { gajrajOne } from "@/src/fonts";
import { Hourglass } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function WaitingOpponentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const matchId = searchParams.get("matchId");
  const { socket } = useSocket();
  const [match, setMatch] = useState<Match | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!matchId) return;
    const currentMatchId = matchId;

    async function loadMatch() {
      try {
        const response = await api.match(currentMatchId);
        setMatch(response);
        if (response.status === "active") {
          router.push(`/jogar/partida?matchId=${response.id}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Partida não encontrada.");
      }
    }

    void loadMatch();
    const interval = window.setInterval(loadMatch, 5000);
    return () => window.clearInterval(interval);
  }, [matchId, router]);

  useEffect(() => {
    if (!socket || !matchId) return;

    socket.emit("match:join", { matchId });

    const handleStarted = (response: Match) => {
      if (response.id !== matchId) return;
      router.push(`/jogar/partida?matchId=${response.id}`);
    };

    const handleUpdated = (response: Match) => {
      if (response.id !== matchId) return;
      setMatch(response);
    };

    socket.on("match:started", handleStarted);
    socket.on("match:updated", handleUpdated);

    return () => {
      socket.off("match:started", handleStarted);
      socket.off("match:updated", handleUpdated);
    };
  }, [matchId, router, socket]);

  const handleCancel = async () => {
    if (!matchId) return;
    try {
      await api.revokeMatch(matchId);
      router.push("/jogar");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível cancelar.");
    }
  };

  return (
    <MatchShell exitButton={false}>
      <div className="scrollbar-visible mx-auto flex max-h-[calc(100vh-180px)] min-h-0 w-full max-w-[344px] flex-1 flex-col pr-2">
        <MatchTitle
          title="Aguardando"
          subtitle="Confirmação do Oponente"
          className="px-0 text-center"
        />

        <div className="mt-4">
          <BetCard
            value={match?.stake_coins ?? 0}
            opponent="Oponente"
            gameType={match?.game_type ?? "-"}
            bestOf={match?.best_of ?? 3}
            compact
          />
        </div>

        <div className="mx-auto mt-4 flex w-full max-w-[272px] justify-center">
          <Hourglass className="size-14 rotate-12 text-[#FFEDAD]" />
        </div>

        {error ? (
          <p className="mt-4 text-center text-sm text-red-300">{error}</p>
        ) : null}

        <div className="mt-auto grid grid-cols-2 gap-3 pb-4 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className={`${gajrajOne.className} flex h-12 w-full items-center justify-center rounded-md border border-[#FFD700] px-4 text-xl text-[#FFD700] transition-colors hover:bg-[#FFD700] hover:text-[#004C55]`}
          >
            Cancelar
          </button>
          <MatchCta href={`/jogar/partida?matchId=${matchId ?? ""}`} className="h-12 w-full px-4 text-xl">
            Iniciar
          </MatchCta>
        </div>
      </div>
    </MatchShell>
  );
}

export default function WaitingOpponentPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-white">Carregando...</div>}>
      <WaitingOpponentContent />
    </Suspense>
  );
}
