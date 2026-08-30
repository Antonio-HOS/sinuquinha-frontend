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
const gameTypes = ["Ímpar ou Par", "Bolinho", "Mata-Mata"] as const;

type GameType = (typeof gameTypes)[number];

const gameTypeDescriptions: Record<GameType, string> = {
  Bolinho:
    "Esta variante é disputada utilizando apenas a bola branca e três bolas numeradas, especificamente a 1, a 2 e a 3. Os participantes devem acumular pontos ou encaçapar as bolas em ordem estrita de valor numérico, culminando na eliminação da última bola da mesa. Durante o desenvolvimento das jogadas, é terminantemente proibido encaçapar a bola branca, um erro conhecido popularmente como \"suicidar o bolão\", cuja ocorrência acarreta a derrota imediata do jogador responsável pela infração.",
  "Mata-Mata":
    "Trata-se de uma variação ágil e dinâmica do bilhar, ideal para partidas rápidas onde qualquer bola encaçapada com sucesso garante ao jogador o direito de continuar a sua vez na mesa. A dinâmica foca em limpar o feltro de forma veloz, dispensando a divisão prévia e estrita de grupos numéricos tradicionais. Ao final da disputa, sagra-se vencedor aquele que conseguir encaçapar o maior volume de bolas ao longo da partida.",
  "Ímpar ou Par":
    "Esta modalidade inicia-se com as 14 bolas numeradas posicionadas no centro da mesa, acompanhadas pela bola 1. O primeiro jogador a encaçapar uma bola define automaticamente o seu grupo de jogo com base na paridade dessa primeira bola que caiu; por exemplo, se a bola encaçapada for a 2, o grupo do jogador passa a ser o dos números pares, enquanto a bola 1 serve como referência neutra e não define grupos por si só. O objetivo da partida é encaçapar todas as bolas pertencentes ao seu grupo correspondente e, por fim, finalizar o jogo encaçapando a bola 1. Caso qualquer jogador derrube a bola 1 antes de ela ser a última bola restante do seu próprio grupo, essa pessoa é desclassificada e perde a partida automaticamente.",
};

const imparOuParTodosContraDescription =
  "Esta modalidade inicia-se com as bolas numeradas posicionadas no centro da mesa. No modo Todos Contra, as bolas são separadas em três grupos: 1 a 5, 6 a 10 e 11 a 15, sendo que o primeiro jogador a encaçapar uma bola define automaticamente o seu grupo com base no intervalo dessa primeira bola encaçapada. O objetivo da partida é encaçapar todas as bolas pertencentes ao seu grupo correspondente e, por fim, finalizar o jogo encaçapando a bola 1. Caso qualquer jogador derrube a bola 1 antes de ela ser a última bola restante do seu próprio grupo, essa pessoa é desclassificada e perde a partida automaticamente.";

function getGameTypeDescription(type: GameType, mode: string) {
  const normalizedMode = normalizeMode(mode);

  if (type === "Ímpar ou Par" && normalizedMode === "Todos Contra (3)") {
    return imparOuParTodosContraDescription;
  }

  return gameTypeDescriptions[type];
}

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
  const [gameType, setGameType] = useState<GameType | "">("");
  const [pendingGameType, setPendingGameType] = useState<GameType | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectGameType = (type: GameType) => {
    setPendingGameType(type);
  };

  const handleConfirmGameType = () => {
    if (!pendingGameType) return;

    setGameType(pendingGameType);
    setPendingGameType(null);
  };

  const handleCloseGameTypeModal = () => {
    setPendingGameType(null);
  };

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

    if (!gameType) {
      setError("Selecione uma modalidade de jogo antes de confirmar.");
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
        <MatchTitle
          title="Moedas"
          subtitle="Aposta"
          className="shrink-0 px-0 text-center"
        />

        <section className="mt-4 shrink-0 rounded-xl border border-white/15 bg-white/10 p-4">
          <div className="flex items-center justify-between gap-2">
            <h2
              className={`${gajrajOne.className} text-sm tracking-[0.08em] text-[#FFEDAD]`}
            >
              Valor da aposta
            </h2>
            <span className="text-[10px] tracking-[0.1em] text-white/50">
              mín. {minStakeCoins}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2.5">
            {coinOptions.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setStakeCoins(value)}
                className="w-full"
              >
                <CoinBadge
                  value={value}
                  active={value === stakeCoins}
                  className="h-[52px] w-full justify-center gap-2 px-2"
                  avatarClassName="size-9"
                  textClassName="text-[1.5rem]"
                />
              </button>
            ))}
          </div>

          <div className="my-3 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/20" />
            <span className="text-[10px] tracking-[0.14em] text-white/40">ou</span>
            <div className="h-px flex-1 bg-white/20" />
          </div>

          <label className="flex h-11 items-center gap-3 rounded-md bg-white px-3">
            <Avatar className="size-8 shrink-0" />
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

        <section className="mt-3 shrink-0 rounded-xl border border-white/15 bg-white/10 p-4">
          <h2
            className={`${gajrajOne.className} text-sm tracking-[0.08em] text-[#FFEDAD]`}
          >
            Tipo de jogo
          </h2>
          <div className="scrollbar-hidden -mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1">
            {gameTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleSelectGameType(type)}
                className={`flex h-11 shrink-0 items-center justify-center rounded-md border px-4 text-center text-xs tracking-wider whitespace-nowrap shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition-colors ${
                  gameType === type
                    ? "border-[#FFD700] bg-[#FFD700]/10 text-[#FFD700]"
                    : "border-white/30 bg-white/5 text-[#FFEDAD] hover:border-[#FFD700] hover:text-[#FFD700]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          {!gameType ? (
            <p className="mt-2 text-center text-[10px] tracking-[0.08em] text-white/50">
              Toque em uma modalidade para ver as regras
            </p>
          ) : null}
        </section>

        {pendingGameType ? (
          <div
            className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-black/60 px-4 py-6"
            onClick={handleCloseGameTypeModal}
            aria-label="Fechar modal de modalidade"
          >
            <section
              className="scrollbar-hidden max-h-[min(80vh,520px)] w-full max-w-[320px] cursor-default overflow-y-auto rounded-2xl border border-[#FFD700]/30 bg-[#004C55]/95 p-4 backdrop-blur-sm"
              aria-label={`Regras de ${pendingGameType}`}
              onClick={(event) => event.stopPropagation()}
            >
              <h2
                className={`${gajrajOne.className} text-center text-xl tracking-[0.06em] text-[#FFD700]`}
              >
                {pendingGameType}
              </h2>
              <div className="mt-4 rounded-lg bg-white p-3">
                <p className="text-left font-[Arial,sans-serif] text-xs leading-relaxed text-black">
                  {getGameTypeDescription(pendingGameType, mode)}
                </p>
              </div>
              <button
                type="button"
                onClick={handleConfirmGameType}
                className={`${gajrajOne.className} mt-5 h-11 w-full rounded-md border border-[#2AC054] text-xl text-[#2AC054] transition-colors hover:bg-[#2AC054] hover:text-[#004C55]`}
              >
                Continuar
              </button>
            </section>
          </div>
        ) : null}

        <footer className="mt-3 shrink-0 space-y-3 rounded-xl border border-[#FFD700]/30 bg-black/20 p-4">
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="tracking-[0.1em] text-[#FFEDAD]/80">Jogadores</span>
              <span className="max-w-[60%] truncate text-right text-[#FFEDAD]">
                {opponents}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="tracking-[0.1em] text-[#FFEDAD]/80">Modo</span>
              <span className="text-[#FFEDAD]">{normalizeMode(mode)}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="tracking-[0.1em] text-[#FFEDAD]/80">Modalidade</span>
              <span className="max-w-[60%] truncate text-right text-[#FFEDAD]">
                {gameType || "—"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-2">
              <span className="tracking-[0.1em] text-[#FFEDAD]/80">Total</span>
              <span
                className={`${gajrajOne.className} flex items-center gap-1.5 text-lg text-[#FFD700]`}
              >
                <Avatar className="size-5" />
                {stakeCoins}
              </span>
            </div>
          </div>

          {error ? (
            <p className="text-center text-xs text-red-300">{error}</p>
          ) : null}

          <button
            type="button"
            onClick={handleCreateMatch}
            disabled={isSubmitting || !gameType}
            className={`${gajrajOne.className} h-11 w-full rounded-md border border-[#2AC054] text-xl text-[#2AC054] transition-colors hover:bg-[#2AC054] hover:text-[#004C55] disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {isSubmitting ? "Criando..." : "Confirmar"}
          </button>
        </footer>
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
