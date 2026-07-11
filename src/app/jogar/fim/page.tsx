"use client";

import {
  ResultActions,
  RewardBadge,
} from "@/src/app/jogar/components/MatchFlow";
import AppHeader from "@/src/components/AppHeader";
import Avatar from "@/src/components/Avatar";
import BottomNav from "@/src/components/BottomNav";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { api, formatMatchDuration, getMatchPhotoUrl, type Match, type User } from "@/src/lib/api";
import { gajrajOne } from "@/src/fonts";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

function MatchEndContent() {
  const searchParams = useSearchParams();
  const matchId = searchParams.get("matchId");
  const { user } = useCurrentUser({ redirectToLogin: true });
  const [match, setMatch] = useState<Match | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function loadResult() {
      if (!matchId) return;
      const [matchResponse, usersResponse] = await Promise.all([
        api.match(matchId),
        api.users(),
      ]);
      setMatch(matchResponse);
      setUsers(usersResponse);
    }

    void loadResult();
  }, [matchId]);

  const userById = useMemo(
    () => new Map(users.map((item) => [item.id, item])),
    [users],
  );
  const winnerPlayers =
    match?.players?.filter((player) => player.result === "winner") ?? [];
  const winnerNames = winnerPlayers
    .map((player) => userById.get(player.user_id)?.nickname ?? player.user_id.slice(0, 8))
    .join(" + ");
  const winnerAvatarId = winnerPlayers[0]
    ? userById.get(winnerPlayers[0].user_id)?.avatar_id
      ? Number.parseInt(userById.get(winnerPlayers[0].user_id)?.avatar_id ?? "", 10)
      : null
    : null;
  const isCurrentUserWinner = Boolean(
    user?.id && winnerPlayers.some((player) => player.user_id === user.id),
  );
  const totalReward = (match?.stake_coins ?? 0) * (match?.players?.length ?? 0);
  const reward = winnerPlayers.length
    ? Math.floor(totalReward / winnerPlayers.length)
    : totalReward;

  return (
    <div className="flex min-h-full flex-1 flex-col px-4 pb-4 pt-3 sm:px-5">
      <AppHeader />

      <main className="relative flex min-h-0 flex-1 flex-col items-center text-center">
        <div className="scrollbar-hidden mx-auto flex min-h-0 w-full max-w-[344px] flex-1 flex-col items-center overflow-y-scroll px-2">
          <section className="w-full rounded-xl border border-white/15 bg-white/10 p-4">

            <div className="mt-5 text-center">
              <h1
                className={`${gajrajOne.className} text-center text-[clamp(2rem,9vw,2.5rem)] leading-none tracking-[0.07em] text-[#2AC054]`}
              >
                {isCurrentUserWinner ? "Vencedor" : "Fim de Jogo"}
              </h1>
              <p className="mt-2 text-center text-sm tracking-[0.12em] text-[#2AC054]">
                {isCurrentUserWinner ? "Você venceu a partida" : "Resultado registrado"}
              </p>
            </div>
          </section>

          <section className="mt-4 flex w-full justify-center rounded-xl border border-[#FFD700]/30 bg-black/15 p-4">
            <RewardBadge value={reward} />
          </section>

          <section className="mt-4 flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/10 px-4 py-3">
            <div className="flex items-center justify-center gap-3">
              <Avatar avatarId={winnerAvatarId} className="size-14 border-2 border-[#FFEDAD]/70" />
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.16em] text-[#FFEDAD]/70">
                  {winnerPlayers.length > 1 ? "Vencedores" : "Jogador"}
                </p>
                <span
                  className={`${gajrajOne.className} text-xl leading-none tracking-[0.08em] text-[#FFD700]`}
                >
                  {winnerNames || "Aguardando resultado"}
                </span>
              </div>
            </div>
          </section>

          <section className="mt-4 w-full overflow-hidden rounded-xl border border-white/15 bg-white/10">
            <div className="relative h-44 w-full bg-black/20">
              <Image
                src={getMatchPhotoUrl(match)}
                alt="Foto da partida"
                fill
                className="object-cover"
                unoptimized={Boolean(match?.file)}
              />
            </div>
            <div className="px-4 py-3">
            <p className={`${gajrajOne.className} text-center text-xl text-white/90`}>
              Fim de Jogo
            </p>
            <div className="mt-3 flex flex-col items-center justify-center gap-1 rounded-md bg-black/15 px-3 py-2">
              <span className="text-center text-xs tracking-[0.12em] text-[#FFEDAD]">
                Tempo da Partida
              </span>
              <span className={`${gajrajOne.className} text-lg text-white`}>
                {formatMatchDuration(match)}
              </span>
            </div>
            </div>
          </section>

          <div className="mt-auto flex w-full justify-center pb-4 pt-5">
            <ResultActions
              primaryHref="/jogar/selecionar"
              primaryLabel="Revanche"
              secondaryHref="/jogar"
              secondaryLabel="Revogar"
            />
          </div>
        </div>
      </main>

      <BottomNav active="trophy" />
    </div>
  );
}

export default function MatchEndPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-white">Carregando...</div>}>
      <MatchEndContent />
    </Suspense>
  );
}
