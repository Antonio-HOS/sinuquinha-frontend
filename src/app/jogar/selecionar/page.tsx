"use client";

import AppHeader from "@/src/components/AppHeader";
import BottomNav from "@/src/components/BottomNav";
import { gajrajOne } from "@/src/fonts";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { friendsMock } from "@/src/app/profile/mocks";

const GAME_MODES = ["1x1", "2x2", "3x3"] as const;
type GameMode = (typeof GAME_MODES)[number];

type Friend = (typeof friendsMock)[number];

function SelectPlayerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [search, setSearch] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [challenged, setChallenged] = useState<string[]>([]);

  const maxPlayers: Record<GameMode, number> = {
    "1x1": 1,
    "2x2": 2,
    "3x3": 3,
  };

  useEffect(() => {
    const modeFromUrl = searchParams.get("mode") as GameMode;
    if (modeFromUrl && GAME_MODES.includes(modeFromUrl)) {
      setSelectedMode(modeFromUrl);
    }
  }, [searchParams]);

  const filteredFriends = friendsMock.filter(
    (f) =>
      f.nome.toLowerCase().includes(search.toLowerCase()) ||
      f.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectPlayer = (id: string) => {
    if (!selectedMode) return;
    const max = maxPlayers[selectedMode];
    setSelectedPlayers((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (prev.length >= max) return prev;
      return [...prev, id];
    });
  };

  const handleChallenge = () => {
    if (selectedPlayers.length === 0) return;
    setChallenged(selectedPlayers);
    setTimeout(() => {
      setChallenged([]);
      setSelectedPlayers([]);
    }, 2000);
  };

  const handleModeSelect = (mode: GameMode) => {
    setSelectedMode(mode);
    setSelectedPlayers([]);
  };

  const canChallenge =
    selectedMode !== null && selectedPlayers.length === maxPlayers[selectedMode!];

  return (
    <div className="flex min-h-full flex-1 flex-col px-4 pb-4 pt-3 sm:px-5">
      <AppHeader />

      {/* Botão Sair */}
      <div className="flex justify-end mt-2">
        <button
          onClick={() => router.back()}
          className={`${gajrajOne.className} border-2 border-[#FFD700] text-[#FFD700] text-sm px-4 py-1.5 rounded-md hover:bg-[#FFD700]/10 transition-colors`}
        >
          Sair
        </button>
      </div>

      {/* Divisor */}
      <Divider />

      {/* Título */}
      <div className="mt-2 mb-5 flex flex-col">
        <h1
          className={`${gajrajOne.className} text-[clamp(2rem,8vw,2rem)] text-[#FFD700] uppercase tracking-wider leading-none`}
        >
          Selecionar
        </h1>
        <span className={`${gajrajOne.className} text-white/70 text-sm`}>
          Jogador
        </span>
      </div>

      {/* Modo de Jogo */}
      <div className="flex flex-col gap-2 mb-5">
        <h2
          className={`${gajrajOne.className} text-white/60 text-xs uppercase tracking-widest`}
        >
          Modo de Jogo
        </h2>
        <div className="flex gap-3">
          {GAME_MODES.map((mode) => (
            <button
              key={mode}
              onClick={() => handleModeSelect(mode)}
              className={`${gajrajOne.className} flex-1 py-2.5 rounded-xl border-2 text-base transition-all duration-200 ${
                selectedMode === mode
                  ? "border-[#FFD700] bg-[#FFD700]/15 text-[#FFD700] scale-105"
                  : "border-white/30 text-white/70 hover:border-white/60"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
        {selectedMode && (
          <p
            className={`${gajrajOne.className} text-white/40 text-[10px] uppercase tracking-wide`}
          >
            Selecione {maxPlayers[selectedMode]}{" "}
            {maxPlayers[selectedMode] === 1 ? "jogador" : "jogadores"} ·{" "}
            {selectedPlayers.length}/{maxPlayers[selectedMode]} selecionado
            {selectedPlayers.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Input de Busca */}
      <div className="relative w-full mb-5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Nome do jogador"
          className={`${gajrajOne.className} w-full bg-transparent border border-white/60 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-[#FFD700] transition-colors`}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 text-[#FFD700]/80"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
      </div>

      {/* Divisor */}
      <Divider />

      {/* Lista de Amigos */}
      <div className="scrollbar-hidden flex flex-col gap-3 overflow-y-auto pb-24 mt-4 px-1">
        <h2
          className={`${gajrajOne.className} text-[#FFD700] text-sm uppercase tracking-wide`}
        >
          Amigos
        </h2>

        {filteredFriends.length === 0 && (
          <p
            className={`${gajrajOne.className} text-white/40 text-sm text-center mt-6`}
          >
            Nenhum jogador encontrado.
          </p>
        )}

        {filteredFriends.map((friend) => {
          const isSelected = selectedPlayers.includes(friend.id);
          const isDisabled =
            !selectedMode ||
            (!isSelected &&
              selectedPlayers.length >= maxPlayers[selectedMode!]);

          return (
            <FriendItem
              key={friend.id}
              friend={friend}
              isSelected={isSelected}
              isDisabled={isDisabled}
              onSelect={handleSelectPlayer}
            />
          );
        })}
      </div>

      {/* Botão Desafiar — fixo acima do BottomNav */}
      {canChallenge && (
        <div className="fixed bottom-[72px] left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm z-10">
          <button
            onClick={handleChallenge}
            disabled={challenged.length > 0}
            className={`${gajrajOne.className} w-full py-3 rounded-xl text-black text-base tracking-wide transition-all ${
              challenged.length > 0
                ? "bg-yellow-600"
                : "bg-[#FFD700] hover:bg-yellow-400 active:scale-95"
            }`}
          >
            {challenged.length > 0
              ? "Aguardando..."
              : `Desafiar · ${selectedMode}`}
          </button>
        </div>
      )}

      <BottomNav active="trophy" />
    </div>
  );
}

export default function SelectPlayerPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen text-white justify-center mt-10">Carregando...</div>}>
      <SelectPlayerContent />
    </Suspense>
  );
}

type FriendItemProps = {
  friend: Friend;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: (id: string) => void;
};

function FriendItem({ friend, isSelected, isDisabled, onSelect }: FriendItemProps) {
  return (
    <div
      onClick={() => !isDisabled && onSelect(friend.id)}
      className={`border rounded-xl p-4 flex justify-between items-center transition-all duration-200 ${
        isSelected
          ? "border-[#FFD700] bg-[#FFD700]/10"
          : isDisabled
          ? "border-white/20 opacity-40 cursor-not-allowed"
          : "border-white/60 cursor-pointer hover:border-white/90"
      }`}
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span
            className={`${gajrajOne.className} text-white text-sm sm:text-base uppercase`}
          >
            {friend.nome}
          </span>
          {friend.status === "online" ? (
            <span
              className={`${gajrajOne.className} flex items-center gap-1 text-[8px] text-white uppercase`}
            >
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>{" "}
              Online
            </span>
          ) : (
            <span
              className={`${gajrajOne.className} flex items-center gap-1 text-[8px] text-white uppercase`}
            >
              <span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>{" "}
              Offline
            </span>
          )}
        </div>
        <span
          className={`${gajrajOne.className} text-white/40 text-[10px] mt-0.5`}
        >
          {friend.id}
        </span>
        <span
          className={`${gajrajOne.className} text-white text-[10px] mt-2 underline decoration-white/40 underline-offset-4`}
        >
          Rank: {friend.rank}
        </span>
      </div>

      {/* Ícone de seleção */}
      <div
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          isSelected
            ? "border-[#FFD700] bg-[#FFD700]"
            : "border-white/40"
        }`}
      >
        {isSelected && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M2 6l3 3 5-5"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center justify-center w-full my-3 opacity-60">
      <div className="h-px bg-white/30 flex-1 max-w-[120px]"></div>
      <div className="mx-3 w-4 h-4 bg-white rounded-full relative flex items-center justify-center">
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] text-white">▲</span>
        <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[8px] text-white">▼</span>
        <span className="absolute top-1/2 -left-3 -translate-y-1/2 text-[8px] text-white">◀</span>
        <span className="absolute top-1/2 -right-3 -translate-y-1/2 text-[8px] text-white">▶</span>
      </div>
      <div className="h-px bg-white/30 flex-1 max-w-[120px]"></div>
    </div>
  );
}
