import { gajrajOne } from "@/src/fonts";
import RankPoints from "@/src/components/RankPoints";
import { formatMatchDuration, getMatchPhotoUrl, getWinnerCoinPayout, type Match, type User } from "@/src/lib/api";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import Image from "next/image";

type HistoryTabProps = {
  matches: Match[];
  users: User[];
  currentUserId?: string;
  variant?: "profile" | "global";
};

function getHistoryValues(
  match: Match,
  currentUserId?: string,
  userById?: Map<string, User>,
) {
  const currentPlayer = currentUserId
    ? match.players?.find((player) => player.user_id === currentUserId)
    : undefined;
  const participated = Boolean(currentPlayer);
  const isWinner = currentPlayer?.result === "winner";
  const isWaitingPhoto = match.status === "waiting_photo";
  const isFinished = match.status === "finished";
  const isConcluded = isFinished || isWaitingPhoto;
  const winnerPlayer = match.players?.find((player) => player.result === "winner");
  const winnerName = winnerPlayer
    ? userById?.get(winnerPlayer.user_id)?.nickname ??
      winnerPlayer.user_id.slice(0, 8)
    : null;
  const points = !isConcluded || !currentPlayer
    ? "-"
    : isWinner
      ? match.mode === "Todos Contra (3)"
        ? "+66"
        : "+33"
      : "-30";
  const coins = !currentPlayer
    ? "-"
    : !isConcluded
      ? match.stake_coins
      : isWinner
        ? getWinnerCoinPayout(match, currentUserId)
        : -match.stake_coins;

  return {
    result: !isConcluded
      ? match.status
      : isWaitingPhoto
        ? participated
          ? isWinner
            ? "Vitória (aguardando foto)"
            : "Derrota (aguardando foto)"
          : winnerName
            ? `Vencedor: ${winnerName}`
            : "Aguardando foto"
        : participated
          ? isWinner
            ? "Vitória"
            : "Derrota"
          : winnerName
            ? `Vencedor: ${winnerName}`
            : "Finalizada",
    isWinner,
    isFinished,
    isWaitingPhoto,
    participated,
    duration: formatMatchDuration(match),
    points,
    coins,
    winnerName,
  };
}

function formatDateTime(value?: string | null) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function getResultLabel(result: string) {
  const labels: Record<string, string> = {
    winner: "Vencedor",
    loser: "Perdedor",
    draw: "Empate",
    none: "Sem resultado",
  };

  return labels[result] ?? result;
}

export default function HistoryTab({
  matches,
  users,
  currentUserId,
  variant = "profile",
}: HistoryTabProps) {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const userById = useMemo(
    () => new Map(users.map((item) => [item.id, item])),
    [users],
  );
  const selectedValues = selectedMatch
    ? getHistoryValues(selectedMatch, currentUserId, userById)
    : null;

  return (
    <>
      <div className="scrollbar-hidden flex flex-col gap-3 overflow-y-auto pb-20 px-1">
        {matches.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-6 text-center text-sm text-white/70">
            Nenhuma partida encontrada.
          </p>
        ) : null}
        {matches.map((item) => {
          const values = getHistoryValues(item, currentUserId, userById);
          const resultClassName = values.isFinished
            ? values.participated
              ? values.isWinner
                ? "border-[#2AC054]/50 bg-[#2AC054]/15 text-[#2AC054]"
                : "border-red-300/50 bg-red-500/10 text-red-200"
              : "border-[#7DD3FC]/50 bg-sky-500/10 text-sky-100"
            : values.isWaitingPhoto
              ? values.participated
                ? values.isWinner
                  ? "border-[#2AC054]/40 bg-[#2AC054]/10 text-[#2AC054]"
                  : "border-red-300/40 bg-red-500/10 text-red-200"
                : "border-[#FFD700]/40 bg-[#FFD700]/10 text-[#FFD700]"
              : "border-[#FFD700]/40 bg-[#FFD700]/10 text-[#FFD700]";

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedMatch(item)}
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-3 text-left text-white shadow-[0_8px_20px_rgba(0,0,0,0.18)] transition-colors hover:border-[#FFD700]/50 hover:bg-white/15"
            >
              <div className="flex items-start gap-3">
                {item.file ? (
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-white/15 bg-black/20">
                    <Image
                      src={getMatchPhotoUrl(item)}
                      alt={`Foto da partida ${item.game_type}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : null}
                <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className={`${gajrajOne.className} truncate text-base leading-none tracking-[0.08em] text-[#FFD700]`}>
                    {item.game_type}
                  </h3>
                  <p className="mt-1 text-xs tracking-widest text-[#FFEDAD]/75">
                    {item.mode} - {values.duration}
                    {variant === "global" && values.winnerName
                      ? ` - ${values.winnerName}`
                      : ""}
                  </p>
                </div>
                <span className={`${gajrajOne.className} shrink-0 rounded-full border px-2 py-1 text-[10px] tracking-[0.08em] max-w-[45%] truncate ${resultClassName}`}>
                  {values.result}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-black/20 px-3 py-2 text-center">
                  <span className="block text-[10px] uppercase tracking-[0.14em] text-white/55">
                    Points
                  </span>
                  <strong className={`${gajrajOne.className} text-lg leading-none text-white`}>
                    <RankPoints value={values.points} starClassName="size-3.5" />
                  </strong>
                </div>
                <div className="rounded-lg bg-black/20 px-3 py-2 text-center">
                  <span className="block text-[10px] uppercase tracking-[0.14em] text-white/55">
                    Moedas
                  </span>
                  <strong className={`${gajrajOne.className} inline-flex items-center justify-center gap-1 text-lg leading-none text-white`}>
                    {typeof values.coins === "number"
                      ? values.coins > 0
                        ? `+${values.coins}`
                        : values.coins
                      : values.coins}
                    <span className="inline-block size-3 rounded-full border border-yellow-400 bg-orange-400" />
                  </strong>
                </div>
              </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedMatch && selectedValues ? (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm">
          <button
            type="button"
            aria-label="Fechar detalhes da partida"
            onClick={() => setSelectedMatch(null)}
            className="absolute inset-0 cursor-default"
          />
          <section className="relative z-10 flex max-h-full w-full max-w-[420px] flex-col overflow-hidden rounded-2xl border border-[#FFD700]/40 bg-[#004C55] text-white shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-4">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.18em] text-[#FFEDAD]/70">
                  Detalhes da partida
                </p>
                <h2 className={`${gajrajOne.className} mt-1 truncate text-2xl leading-none text-[#FFD700]`}>
                  {selectedMatch.game_type}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMatch(null)}
                className={`${gajrajOne.className} rounded-md border border-[#FFD700] px-3 py-1 text-sm text-[#FFD700] transition-colors hover:bg-[#FFD700] hover:text-black`}
              >
                Fechar
              </button>
            </div>

            <div className="scrollbar-hidden min-h-0 overflow-y-auto px-4 py-4">
              {selectedMatch.file ? (
                <div className="relative h-48 w-full overflow-hidden rounded-xl border border-white/15 bg-black/20">
                  <Image
                    src={getMatchPhotoUrl(selectedMatch)}
                    alt={`Foto da partida ${selectedMatch.game_type}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : null}

              <div className={`grid grid-cols-2 gap-2 ${selectedMatch.file ? "mt-4" : ""}`}>
                <DetailItem label="Modo" value={selectedMatch.mode} />
                <DetailItem label="Resultado" value={selectedValues.result} />
                <DetailItem label="Tempo" value={selectedValues.duration} />
                <DetailItem label="Início" value={formatDateTime(selectedMatch.started_at)} />
                <DetailItem label="Fim" value={formatDateTime(selectedMatch.ended_at)} />
                <DetailItem
                  label="Points"
                  value={<RankPoints value={selectedValues.points} starClassName="size-3.5" />}
                />
                <DetailItem
                  label="Moedas"
                  value={
                    typeof selectedValues.coins === "number"
                      ? selectedValues.coins > 0
                        ? `+${selectedValues.coins}`
                        : String(selectedValues.coins)
                      : selectedValues.coins
                  }
                />
              </div>

              <div className="mt-4">
                <h3 className={`${gajrajOne.className} text-lg text-[#FFEDAD]`}>
                  Jogadores
                </h3>
                <div className="mt-2 flex flex-col gap-2">
                  {(selectedMatch.players ?? []).map((player) => (
                    <div
                      key={player.id}
                      className="rounded-xl border border-white/10 bg-black/20 px-3 py-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className={`${gajrajOne.className} truncate text-base text-[#FFD700]`}>
                            {userById.get(player.user_id)?.nickname ?? player.user_id.slice(0, 8)}
                          </p>
                          <p className="text-xs tracking-widest text-white/60">
                            Time {player.team ?? "-"} - {getResultLabel(player.result)}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <span className="block text-[10px] uppercase tracking-[0.14em] text-white/50">
                            Placar
                          </span>
                          <strong className={`${gajrajOne.className} text-xl text-white`}>
                            {player.score}
                          </strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="rounded-lg bg-black/20 px-3 py-2">
      <span className="block text-[10px] uppercase tracking-[0.14em] text-white/55">
        {label}
      </span>
      <strong className={`${gajrajOne.className} text-sm leading-none text-white`}>
        {value}
      </strong>
    </div>
  );
}