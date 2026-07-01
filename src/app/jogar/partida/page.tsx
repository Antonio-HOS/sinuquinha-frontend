"use client";

import {
  CoinBadge,
  MatchPlayerCard,
  MatchShell,
  MatchTitle,
} from "@/src/app/jogar/components/MatchFlow";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { api, formatMatchDuration, type Match, type User } from "@/src/lib/api";
import { useSocket } from "@/src/providers/SocketProvider";
import { gajrajOne } from "@/src/fonts";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

function ActiveMatchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const matchId = searchParams.get("matchId");
  const { user } = useCurrentUser({ redirectToLogin: true });
  const { socket } = useSocket();
  const [match, setMatch] = useState<Match | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    async function loadData() {
      if (!matchId) return;
      try {
        const [matchResponse, usersResponse] = await Promise.all([
          api.match(matchId),
          api.users(),
        ]);
        setMatch(matchResponse);
        setUsers(usersResponse);
        if (matchResponse.status === "finished") {
          router.push(`/jogar/fim?matchId=${matchResponse.id}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Partida não encontrada.");
      }
    }

    void loadData();
  }, [matchId, router]);

  useEffect(() => {
    if (!socket || !matchId) return;

    socket.emit("match:join", { matchId }, (response: Match) => {
      setMatch(response);
    });

    const handleMatchUpdate = (response: Match) => {
      if (response.id !== matchId) return;
      setMatch(response);
    };

    const handleFinished = (response: Match) => {
      if (response.id !== matchId) return;
      setMatch(response);
      router.push(`/jogar/fim?matchId=${response.id}`);
    };

    socket.on("match:state", handleMatchUpdate);
    socket.on("match:updated", handleMatchUpdate);
    socket.on("match:score:updated", handleMatchUpdate);
    socket.on("match:finished", handleFinished);
    socket.on("match:started", handleMatchUpdate);

    return () => {
      socket.off("match:state", handleMatchUpdate);
      socket.off("match:updated", handleMatchUpdate);
      socket.off("match:score:updated", handleMatchUpdate);
      socket.off("match:finished", handleFinished);
      socket.off("match:started", handleMatchUpdate);
    };
  }, [matchId, router, socket]);

  useEffect(() => {
    if (match?.status !== "active") return;

    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, [match?.status]);

  const userById = useMemo(
    () => new Map(users.map((item) => [item.id, item])),
    [users],
  );

  const currentPlayer = match?.players?.find(
    (player) => player.user_id === user?.id,
  );
  const scoreEntries = useMemo(() => {
    const players = match?.players ?? [];

    if (match?.mode === "2x2") {
      return ["A", "B"].map((team) => {
        const teamPlayers = players.filter((player) => player.team === team);
        const names = teamPlayers
          .map((player) => userById.get(player.user_id)?.nickname ?? player.user_id.slice(0, 8))
          .join(" + ");

        return {
          id: team,
          targetUserId: teamPlayers[0]?.user_id ?? "",
          name: `Time ${team}`,
          description: names,
          score: Math.max(0, ...teamPlayers.map((player) => Number(player.score))),
          status: teamPlayers.every((player) => player.confirmation_status === "confirmed")
            ? "Confirmado"
            : "Pendente",
        };
      });
    }

    return players.map((player) => ({
      id: player.id,
      targetUserId: player.user_id,
      name: userById.get(player.user_id)?.nickname ?? player.user_id.slice(0, 8),
      description: player.team === "solo" ? "Todos Contra" : `Time ${player.team ?? "-"}`,
      score: player.score,
      status: player.confirmation_status === "confirmed" ? "Confirmado" : "Pendente",
    }));
  }, [match?.mode, match?.players, userById]);

  const handleConfirm = async () => {
    if (!matchId) return;
    try {
      setIsSubmitting(true);
      setMatch(await api.confirmMatch(matchId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível confirmar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScoreUpdate = (targetUserId: string, delta: number) => {
    if (!socket || !matchId) return;
    socket.emit(
      "match:score:update",
      { matchId, targetUserId, delta },
      (response: Match) => {
        setMatch(response);
      },
    );
  };

  const handleFinish = () => {
    if (!socket || !matchId) return;
    setIsSubmitting(true);
    socket.emit("match:finish", { matchId }, (response: Match) => {
      setIsSubmitting(false);
      setMatch(response);
      router.push(`/jogar/fim?matchId=${response.id}`);
    });
  };

  return (
    <MatchShell exitButton={false}>
      <div className="scrollbar-hidden mx-auto flex max-h-[calc(100vh-140px)] min-h-0 w-full max-w-[344px] flex-1 flex-col overflow-y-auto">
        <MatchTitle
          title="Partida"
          subtitle={`${match?.game_type ?? "-"} | Melhor de ${match?.best_of ?? "-"}`}
          className="px-0 text-center"
        />

        <section className={`mt-5 grid gap-3 px-1 ${scoreEntries.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
          {scoreEntries.map((entry) => (
            <div key={entry.id} className="flex flex-col gap-2">
              <MatchPlayerCard
                name={entry.name}
                score={entry.score}
                status={entry.status}
              />
              <p className="min-h-8 text-center text-[10px] text-white/70">
                {entry.description}
              </p>
              {match?.status === "active" ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleScoreUpdate(entry.targetUserId, -1)}
                    disabled={!entry.targetUserId}
                    className="rounded border border-red-300 py-1 text-sm text-red-200"
                  >
                    -1
                  </button>
                  <button
                    type="button"
                    onClick={() => handleScoreUpdate(entry.targetUserId, 1)}
                    disabled={!entry.targetUserId}
                    className="rounded border border-[#2AC054] py-1 text-sm text-[#2AC054]"
                  >
                    +1
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </section>

        <section className="mt-5 flex items-center justify-between gap-4 rounded-md border border-white/15 bg-white/10 px-3 py-3">
          <p className={`${gajrajOne.className} text-base text-[#FFEDAD]`}>
            Aposta da partida
          </p>
          <div className="w-[132px]">
            <CoinBadge
              value={match?.stake_coins ?? 0}
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
            {now && formatMatchDuration(match)}
          </p>
        </section>

        {error ? (
          <p className="mt-4 text-center text-sm text-red-300">{error}</p>
        ) : null}

        <div className="mt-auto flex justify-center pb-4 pt-5">
          {match?.status === "waiting_confirmation" &&
          currentPlayer?.confirmation_status !== "confirmed" ? (
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className={`${gajrajOne.className} flex h-12 items-center justify-center rounded-md border border-[#2AC054] px-8 text-[1.65rem] leading-none text-[#2AC054] transition-colors hover:bg-[#2AC054] hover:text-[#004C55]`}
            >
              {isSubmitting ? "Confirmando..." : "Confirmar"}
            </button>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <p className="text-center text-xs text-white/70">
                Participantes podem alterar o placar em tempo real.
              </p>
              <button
                type="button"
                onClick={handleFinish}
                disabled={isSubmitting || match?.status !== "active"}
                className={`${gajrajOne.className} flex h-12 items-center justify-center rounded-md border border-[#2AC054] px-8 text-[1.65rem] leading-none text-[#2AC054] transition-colors hover:bg-[#2AC054] hover:text-[#004C55] disabled:opacity-50`}
              >
                {isSubmitting ? "Finalizando..." : "Finalizar"}
              </button>
            </div>
          )}
        </div>
      </div>
    </MatchShell>
  );
}

export default function ActiveMatchPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-white">Carregando...</div>}>
      <ActiveMatchContent />
    </Suspense>
  );
}
