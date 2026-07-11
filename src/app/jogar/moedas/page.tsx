"use client";

import {
  CoinBadge,
  MatchShell,
  MatchTitle,
} from "@/src/app/jogar/components/MatchFlow";
import { gajrajOne } from "@/src/fonts";
import Avatar from "@/src/components/Avatar";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { api, type MatchParticipantInput } from "@/src/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

const minStakeCoins = 45;
const coinOptions = [45, 60, 70, 100];
const gameTypes = ["Mata Mata", "Bola 8", "Brasileirinha"];

function normalizeMode(mode: string) {
  return mode === "Todos Contra" ? "Todos Contra (3)" : mode;
}

function buildParticipants(
  currentUserId: string,
  opponentIds: string[],
  mode: string,
): MatchParticipantInput[] | null {
  const normalizedMode = normalizeMode(mode);

  if (normalizedMode === "1x1" && opponentIds.length === 1) {
    return [
      { userId: currentUserId, team: "A" },
      { userId: opponentIds[0], team: "B" },
    ];
  }

  if (normalizedMode === "2x2" && opponentIds.length === 3) {
    return [
      { userId: currentUserId, team: "A" },
      { userId: opponentIds[0], team: "A" },
      { userId: opponentIds[1], team: "B" },
      { userId: opponentIds[2], team: "B" },
    ];
  }

  if (normalizedMode === "Todos Contra (3)" && opponentIds.length === 2) {
    return [
      { userId: currentUserId, team: "solo" },
      { userId: opponentIds[0], team: "solo" },
      { userId: opponentIds[1], team: "solo" },
    ];
  }

  return null;
}

function MatchCoinsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useCurrentUser({ redirectToLogin: true });
  const mode = searchParams.get("mode") ?? "1x1";
  const opponentIds = (
    searchParams.get("opponentIds") ??
    searchParams.get("opponentId") ??
    ""
  )
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const opponents =
    searchParams.get("opponents") ??
    searchParams.get("opponent") ??
    "oponente";
  const [stakeCoins, setStakeCoins] = useState(minStakeCoins);
  const [gameType, setGameType] = useState("Bola 8");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateMatch = async () => {
    if (!user) {
      setError("Usuário não autenticado.");
      return;
    }

    const players = buildParticipants(user.id, opponentIds, mode);

    if (!players) {
      setError("Selecione todos os jogadores necessários antes de confirmar.");
      return;
    }

    if (stakeCoins < minStakeCoins) {
      setError(`O valor mínimo para iniciar uma partida é ${minStakeCoins} moedas.`);
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      const match = await api.createMatch({
        players,
        mode: normalizeMode(mode),
        gameType,
        stakeCoins,
      });
      router.push(`/jogar/partida?matchId=${match.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível criar a partida.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MatchShell exitButton={false}>
      <div className="scrollbar-hidden mx-auto flex min-h-0 w-full max-h-[calc(100vh-140px)] max-w-[344px] flex-1 flex-col overflow-y-auto">
        <MatchTitle title="Moedas" className="px-0 text-center" />

        <section className="mt-6 grid grid-cols-2 gap-3 px-2">
          {coinOptions.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setStakeCoins(value)}
            >
              <CoinBadge
                value={value}
                active={value === stakeCoins}
                className="justify-center gap-2 px-2"
                avatarClassName="size-10"
                textClassName="text-[1.65rem]"
              />
            </button>
          ))}
        </section>

        <section className="mt-6 px-5">
          <label className="flex h-12 items-center gap-3 rounded-md bg-white px-3">
            <Avatar className="size-9" />
            <span className="sr-only">Digite o valor</span>
            <input
              type="number"
              min={minStakeCoins}
              value={stakeCoins}
              onChange={(event) => setStakeCoins(Number(event.target.value))}
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
                onClick={() => setGameType(type)}
                className={`flex h-11 items-center justify-center rounded border px-1 text-center text-[0.72rem] leading-tight tracking-wider shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition-colors sm:text-xs ${
                  gameType === type
                    ? "border-[#FFD700] text-[#FFD700]"
                    : "border-white/80 text-[#FFEDAD] hover:border-[#FFD700] hover:text-[#FFD700]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </section>

        <p className="mt-4 text-center text-sm text-[#FFEDAD]">
          Jogadores: {opponents}
        </p>
        {error ? (
          <p className="mt-3 text-center text-sm text-red-300">{error}</p>
        ) : null}

        <div className="mt-auto flex justify-center pb-4 pt-6">
          <button
            type="button"
            onClick={handleCreateMatch}
            disabled={isSubmitting}
            className={`${gajrajOne.className} flex h-12 items-center justify-center rounded-md border border-[#2AC054] px-8 text-[1.65rem] leading-none text-[#2AC054] transition-colors hover:bg-[#2AC054] hover:text-[#004C55]`}
          >
            {isSubmitting ? "Criando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </MatchShell>
  );
}

export default function MatchCoinsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-white">Carregando...</div>}>
      <MatchCoinsContent />
    </Suspense>
  );
}
