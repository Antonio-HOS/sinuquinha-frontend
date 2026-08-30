"use client";

import { gajrajOne } from "@/src/fonts";
import RankPoints from "@/src/components/RankPoints";
import { API_URL, formatMatchDuration, getAccessToken, getMatchPhotoUrl, getWinnerCoinPayout, type Match, type User } from "@/src/lib/api";
import { Download, Loader2, X } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useRef, useState } from "react";
import Image from "next/image";

const SITE_NAME = "Sinuquinha";

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

function formatMatchDay(value?: string | null) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
  }).format(new Date(value));
}

function formatMatchTime(value?: string | null) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("pt-BR", {
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

async function waitForImages(element: HTMLElement) {
  const images = Array.from(element.querySelectorAll("img"));

  await Promise.all(
    images.map(
      (image) =>
        image.complete
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              image.addEventListener("load", () => resolve(), { once: true });
              image.addEventListener("error", () => resolve(), { once: true });
            }),
    ),
  );
}

function resolveAssetUrl(src: string) {
  if (!src || src.startsWith("data:") || src.startsWith("blob:")) {
    return src;
  }

  if (src.startsWith("http")) {
    return src;
  }

  if (src.startsWith("/uploads/")) {
    return `${window.location.origin}${src}`;
  }

  return `${window.location.origin}${src.startsWith("/") ? src : `/${src}`}`;
}

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Falha ao ler imagem"));
    reader.readAsDataURL(blob);
  });
}

async function fetchAssetDataUrl(url: string) {
  const absoluteUrl = resolveAssetUrl(url);
  const token = getAccessToken();
  const headers: HeadersInit = {};

  if (token && absoluteUrl.startsWith(API_URL)) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(absoluteUrl, {
    credentials: "include",
    headers,
  });

  if (!response.ok) {
    throw new Error(`Falha ao carregar ${absoluteUrl}`);
  }

  return blobToDataUrl(await response.blob());
}

function expandTruncatedText(element: HTMLElement) {
  const restores: Array<() => void> = [];

  element.querySelectorAll<HTMLElement>("*").forEach((node) => {
    const computed = window.getComputedStyle(node);
    const shouldExpand =
      node.classList.contains("truncate") ||
      computed.textOverflow === "ellipsis" ||
      computed.overflow === "hidden";

    if (!shouldExpand) {
      return;
    }

    const previous = {
      overflow: node.style.overflow,
      textOverflow: node.style.textOverflow,
      whiteSpace: node.style.whiteSpace,
      maxWidth: node.style.maxWidth,
      className: node.className,
    };

    node.classList.remove("truncate");
    node.style.overflow = "visible";
    node.style.textOverflow = "clip";
    node.style.whiteSpace = "normal";
    node.style.maxWidth = "none";

    restores.push(() => {
      node.className = previous.className;
      node.style.overflow = previous.overflow;
      node.style.textOverflow = previous.textOverflow;
      node.style.whiteSpace = previous.whiteSpace;
      node.style.maxWidth = previous.maxWidth;
    });
  });

  return () => restores.forEach((restore) => restore());
}

async function inlineImagesInElement(element: HTMLElement) {
  const restores: Array<() => void> = [];

  for (const image of Array.from(element.querySelectorAll("img"))) {
    const source = image.currentSrc || image.getAttribute("src") || "";

    if (!source || source.startsWith("data:")) {
      continue;
    }

    try {
      const dataUrl = await fetchAssetDataUrl(source);
      const previous = {
        src: image.src,
        srcset: image.getAttribute("srcset"),
        sizes: image.getAttribute("sizes"),
        style: image.getAttribute("style"),
      };

      image.src = dataUrl;
      image.removeAttribute("srcset");
      image.removeAttribute("sizes");

      if (image.closest("[data-export-photo-container]")) {
        image.style.display = "block";
        image.style.width = "100%";
        image.style.height = "100%";
        image.style.objectFit = "cover";
      }

      restores.push(() => {
        image.src = previous.src;
        if (previous.srcset) image.setAttribute("srcset", previous.srcset);
        if (previous.sizes) image.setAttribute("sizes", previous.sizes);
        if (previous.style) image.setAttribute("style", previous.style);
        else image.removeAttribute("style");
      });
    } catch (error) {
      console.warn("Falha ao embutir imagem para exportação:", source, error);
    }
  }

  return () => restores.forEach((restore) => restore());
}

const EXPORT_CARD_WIDTH = 420;

async function downloadElementAsPng(element: HTMLElement, filename: string) {
  const wrapper = document.createElement("div");
  wrapper.setAttribute("aria-hidden", "true");
  wrapper.style.cssText = [
    "position: fixed",
    `left: -${EXPORT_CARD_WIDTH + 32}px`,
    "top: 0",
    `width: ${EXPORT_CARD_WIDTH}px`,
    "overflow: visible",
    "opacity: 0",
    "pointer-events: none",
  ].join(";");

  const clone = element.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("[data-export-exclude]").forEach((node) => node.remove());
  clone.style.width = `${EXPORT_CARD_WIDTH}px`;
  clone.style.minWidth = `${EXPORT_CARD_WIDTH}px`;
  clone.style.maxWidth = `${EXPORT_CARD_WIDTH}px`;
  clone.style.maxHeight = "none";
  clone.style.overflow = "visible";
  clone.style.margin = "0";
  clone.style.boxSizing = "border-box";
  clone.style.flex = "none";
  clone.style.borderRadius = "16px";

  const scrollArea = clone.querySelector<HTMLElement>("[data-export-scroll]");
  if (scrollArea) {
    scrollArea.style.maxHeight = "none";
    scrollArea.style.overflow = "visible";
    scrollArea.style.flex = "none";
    scrollArea.style.width = "100%";
  }

  clone.querySelectorAll("[data-export-photo-container], footer").forEach((node) => {
    if (node instanceof HTMLElement) {
      node.style.width = "100%";
    }
  });

  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  const restoreTruncation = expandTruncatedText(clone);
  const restoreImages = await inlineImagesInElement(clone);

  try {
    await document.fonts.ready;
    await waitForImages(clone);
    void clone.offsetHeight;

    const exportHeight = clone.scrollHeight;
    const { domToPng } = await import("modern-screenshot");

    const dataUrl = await domToPng(clone, {
      scale: 2,
      backgroundColor: "#004C55",
      timeout: 60_000,
      width: EXPORT_CARD_WIDTH,
      height: exportHeight,
      style: {
        width: `${EXPORT_CARD_WIDTH}px`,
        minWidth: `${EXPORT_CARD_WIDTH}px`,
        maxWidth: `${EXPORT_CARD_WIDTH}px`,
        margin: "0",
        boxSizing: "border-box",
      },
      features: {
        restoreScrollPosition: true,
      },
    });

    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } finally {
    restoreImages();
    restoreTruncation();
    wrapper.remove();
  }
}

export default function HistoryTab({
  matches,
  users,
  currentUserId,
  variant = "profile",
}: HistoryTabProps) {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const matchCardRef = useRef<HTMLElement | null>(null);
  const userById = useMemo(
    () => new Map(users.map((item) => [item.id, item])),
    [users],
  );
  const selectedValues = selectedMatch
    ? getHistoryValues(selectedMatch, currentUserId, userById)
    : null;
  const selectedResultClassName = selectedValues
    ? selectedValues.isFinished
      ? selectedValues.participated
        ? selectedValues.isWinner
          ? "border-[#2AC054]/50 bg-[#2AC054]/15 text-[#2AC054]"
          : "border-red-300/50 bg-red-500/10 text-red-200"
        : "border-[#7DD3FC]/50 bg-sky-500/10 text-sky-100"
      : selectedValues.isWaitingPhoto
        ? selectedValues.participated
          ? selectedValues.isWinner
            ? "border-[#2AC054]/40 bg-[#2AC054]/10 text-[#2AC054]"
            : "border-red-300/40 bg-red-500/10 text-red-200"
          : "border-[#FFD700]/40 bg-[#FFD700]/10 text-[#FFD700]"
        : "border-[#FFD700]/40 bg-[#FFD700]/10 text-[#FFD700]"
    : "";

  async function handleDownloadMatchCard() {
    if (!matchCardRef.current || !selectedMatch || isDownloading) return;

    setIsDownloading(true);

    try {
      const safeGameType = selectedMatch.game_type
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const filename = `sinuquinha-${safeGameType || "partida"}-${selectedMatch.id.slice(0, 8)}.png`;

      await downloadElementAsPng(matchCardRef.current, filename);
    } catch (error) {
      console.error("Erro ao baixar card da partida:", error);
      window.alert("Não foi possível baixar o card. Tente novamente.");
    } finally {
      setIsDownloading(false);
    }
  }

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
        <div className="absolute inset-0 z-30 flex items-end justify-center bg-black/65 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <button
            type="button"
            aria-label="Fechar detalhes da partida"
            onClick={() => setSelectedMatch(null)}
            className="absolute inset-0 cursor-default"
          />
          <section
            ref={matchCardRef}
            className="relative z-10 flex max-h-[92vh] w-full max-w-[420px] flex-col overflow-hidden rounded-t-2xl border border-[#FFD700]/40 bg-[#004C55] text-white shadow-2xl sm:max-h-full sm:rounded-2xl"
          >
            {selectedMatch.file ? (
              <div className="relative h-44 shrink-0 overflow-hidden sm:h-48" data-export-photo-container>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getMatchPhotoUrl(selectedMatch)}
                  alt={`Foto da partida ${selectedMatch.game_type}`}
                  className="absolute inset-0 block h-full w-full object-cover"
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#004C55] via-[#004C55]/70 to-black/20" />
                <div className="absolute inset-x-0 top-0 flex justify-end p-3">
                  <MatchCardActions
                    isDownloading={isDownloading}
                    onClose={() => setSelectedMatch(null)}
                    onDownload={() => void handleDownloadMatchCard()}
                    variant="overlay"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4 pt-10">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#FFEDAD]/80">
                    Detalhes da partida
                  </p>
                  <h2 className={`${gajrajOne.className} mt-1 text-2xl leading-tight text-[#FFD700] break-words`}>
                    {selectedMatch.game_type}
                  </h2>
                  <MatchSummaryChips
                    result={selectedValues.result}
                    resultClassName={selectedResultClassName}
                    mode={selectedMatch.mode}
                  />
                </div>
              </div>
            ) : (
              <div className="relative shrink-0 border-b border-white/10 px-4 pb-4 pt-3">
                <div className="absolute top-3 right-3">
                  <MatchCardActions
                    isDownloading={isDownloading}
                    onClose={() => setSelectedMatch(null)}
                    onDownload={() => void handleDownloadMatchCard()}
                  />
                </div>
                <p className="pr-20 text-xs uppercase tracking-[0.18em] text-[#FFEDAD]/70">
                  Detalhes da partida
                </p>
                <h2 className={`${gajrajOne.className} mt-1 pr-16 text-2xl leading-tight text-[#FFD700] break-words`}>
                  {selectedMatch.game_type}
                </h2>
                <MatchSummaryChips
                  className="mt-3"
                  result={selectedValues.result}
                  resultClassName={selectedResultClassName}
                  mode={selectedMatch.mode}
                />
              </div>
            )}

            <div
              data-export-scroll
              className="scrollbar-hidden min-h-0 flex-1 overflow-y-auto px-4 py-4"
            >
              <div className="grid grid-cols-2 gap-2">
                <StatCard
                  label="Points"
                  value={<RankPoints value={selectedValues.points} starClassName="size-4" />}
                />
                <StatCard
                  label="Moedas"
                  value={
                    typeof selectedValues.coins === "number"
                      ? selectedValues.coins > 0
                        ? `+${selectedValues.coins}`
                        : String(selectedValues.coins)
                      : selectedValues.coins
                  }
                  showCoin
                />
              </div>

              <MatchSchedulePanel
                day={formatMatchDay(selectedMatch.started_at)}
                start={formatMatchTime(selectedMatch.started_at)}
                end={formatMatchTime(selectedMatch.ended_at)}
                duration={selectedValues.duration}
              />

              <div className="mt-5">
                <h3 className={`${gajrajOne.className} text-base text-[#FFEDAD]`}>
                  Jogadores
                </h3>
                <div className="mt-2 flex flex-col gap-2">
                  {[...(selectedMatch.players ?? [])]
                    .sort((a, b) => {
                      if (a.result === "winner") return -1;
                      if (b.result === "winner") return 1;
                      return (b.score ?? 0) - (a.score ?? 0);
                    })
                    .map((player) => {
                      const isCurrentUser = player.user_id === currentUserId;
                      const playerClassName =
                        player.result === "winner"
                          ? "border-[#2AC054]/45 bg-[#2AC054]/12"
                          : player.result === "loser"
                            ? "border-red-300/35 bg-red-500/8"
                            : "border-white/10 bg-black/20";

                      return (
                        <div
                          key={player.id}
                          className={`rounded-xl border px-3 py-2.5 ${playerClassName} ${isCurrentUser ? "ring-1 ring-[#FFD700]/50" : ""}`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <p className={`${gajrajOne.className} text-base text-[#FFD700] break-words`}>
                                {userById.get(player.user_id)?.nickname ?? player.user_id.slice(0, 8)}
                                {isCurrentUser ? (
                                  <span className="ml-1.5 text-xs tracking-widest text-[#FFEDAD]/70">
                                    (você)
                                  </span>
                                ) : null}
                              </p>
                              <p className="mt-0.5 text-[11px] tracking-widest text-white/60">
                                Time {player.team ?? "-"} · {getResultLabel(player.result)}
                              </p>
                            </div>
                            <span
                              className={`${gajrajOne.className} shrink-0 rounded-lg bg-black/25 px-2.5 py-1 text-center text-xl leading-none text-white`}
                            >
                              {player.score}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            <footer className="shrink-0 border-t border-[#FFD700]/25 bg-black/20 px-4 py-3 text-center">
              <p className={`${gajrajOne.className} text-lg leading-none tracking-[0.22em] text-[#FFD700]`}>
                {SITE_NAME}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-[#FFEDAD]/55">
                Histórico de partidas
              </p>
            </footer>
          </section>
        </div>
      ) : null}
    </>
  );
}

function MatchSummaryChips({
  result,
  resultClassName,
  mode,
  className = "mt-2",
}: {
  result: string;
  resultClassName: string;
  mode: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      <span
        className={`${gajrajOne.className} inline-flex rounded-full border px-2.5 py-0.5 text-[11px] tracking-[0.08em] ${resultClassName}`}
      >
        {result}
      </span>
      <span className="rounded-full border border-white/15 bg-black/25 px-2.5 py-0.5 text-[11px] tracking-widest text-[#FFEDAD]/85">
        {mode}
      </span>
    </div>
  );
}

function MatchSchedulePanel({
  day,
  start,
  end,
  duration,
}: {
  day: string;
  start: string;
  end: string;
  duration: string;
}) {
  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-black/20">
      <div className="border-b border-white/10 px-4 py-3 text-center">
        <span className="block text-[10px] uppercase tracking-[0.14em] text-white/55">
          Dia
        </span>
        <p className={`${gajrajOne.className} mt-1 text-base leading-snug text-[#FFEDAD] break-words`}>
          {day}
        </p>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 py-3">
        <div className="text-center">
          <span className="block text-[10px] uppercase tracking-[0.14em] text-white/55">
            Início
          </span>
          <strong className={`${gajrajOne.className} mt-1 block text-lg leading-none text-white`}>
            {start}
          </strong>
        </div>
        <div className="flex flex-col items-center px-1">
          <span className="h-px w-6 bg-white/20" aria-hidden />
          <span className={`${gajrajOne.className} my-1 text-[11px] tracking-widest text-[#FFD700]/80`}>
            {duration}
          </span>
          <span className="h-px w-6 bg-white/20" aria-hidden />
        </div>
        <div className="text-center">
          <span className="block text-[10px] uppercase tracking-[0.14em] text-white/55">
            Fim
          </span>
          <strong className={`${gajrajOne.className} mt-1 block text-lg leading-none text-white`}>
            {end}
          </strong>
        </div>
      </div>
    </div>
  );
}

function MatchCardActions({
  onClose,
  onDownload,
  isDownloading,
  variant = "default",
}: {
  onClose: () => void;
  onDownload: () => void;
  isDownloading: boolean;
  variant?: "default" | "overlay";
}) {
  const buttonClassName =
    variant === "overlay"
      ? "inline-flex size-8 shrink-0 items-center justify-center rounded-md text-[#FFD700] transition-colors hover:bg-[#FFD700]/15 disabled:cursor-not-allowed disabled:opacity-60 sm:size-9"
      : "inline-flex size-9 shrink-0 items-center justify-center rounded-md text-[#FFD700] transition-colors hover:bg-[#FFD700]/15 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className="flex shrink-0 items-center gap-2" data-export-exclude>
      <button
        type="button"
        onClick={onDownload}
        disabled={isDownloading}
        aria-label={isDownloading ? "Gerando card da partida" : "Baixar card da partida"}
        className={buttonClassName}
      >
        {isDownloading ? (
          <Loader2 className="size-4 animate-spin sm:size-[1.125rem]" aria-hidden />
        ) : (
          <Download className="size-4 sm:size-[1.125rem]" aria-hidden />
        )}
      </button>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar detalhes da partida"
        className={buttonClassName}
      >
        <X className="size-4 sm:size-[1.125rem]" aria-hidden />
      </button>
    </div>
  );
}

function StatCard({
  label,
  value,
  showCoin = false,
}: {
  label: string;
  value: ReactNode;
  showCoin?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/25 px-3 py-3 text-center">
      <span className="block text-[10px] uppercase tracking-[0.14em] text-white/55">
        {label}
      </span>
      <strong className={`${gajrajOne.className} mt-1 inline-flex items-center justify-center gap-1 text-xl leading-none text-white`}>
        {value}
        {showCoin ? (
          <span className="inline-block size-3 rounded-full border border-yellow-400 bg-orange-400" />
        ) : null}
      </strong>
    </div>
  );
}