"use client";

import AppHeader from "@/src/components/AppHeader";
import Avatar from "@/src/components/Avatar";
import BottomNav from "@/src/components/BottomNav";
import RankPoints from "@/src/components/RankPoints";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { api, type Match, type User, type UserStats } from "@/src/lib/api";
import { gajrajOne } from "@/src/fonts";
import { useEffect, useState } from "react";
import HistoryTab from "./components/HistoryTab";
import StatsTab from "./components/StatsTab";
import FriendsTab from "./components/FriendsTab";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("historico");
  const [copiado, setCopiado] = useState(false);
  const { user, isLoading } = useCurrentUser({ redirectToLogin: true });
  const [stats, setStats] = useState<UserStats | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function loadProfileData() {
      const [statsResponse, matchesResponse, usersResponse] = await Promise.allSettled([
        api.statsMe(),
        api.matches(),
        api.users(),
      ]);

      setStats(statsResponse.status === "fulfilled" ? statsResponse.value : null);
      setMatches(matchesResponse.status === "fulfilled" ? matchesResponse.value : []);
      setUsers(usersResponse.status === "fulfilled" ? usersResponse.value : []);
    }

    if (user) {
      void loadProfileData();
    }
  }, [user]);

  const handleCopiarId = () => {
    if (!user) return;
    navigator.clipboard.writeText(user.id);
    setCopiado(true);
    setTimeout(() => {
      setCopiado(false);
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center text-white">
        Carregando perfil...
      </div>
    );
  }

  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden px-4 pb-4 pt-3 sm:px-5">
      <AppHeader />

      {/* Info do Jogador */}
      <div className="mt-6 flex flex-col">
        <h1 className={`${gajrajOne.className} text-[clamp(2rem,8vw,2rem)] text-white uppercase tracking-wider leading-none`}>
          {user?.nickname ?? "Jogador"}
        </h1>
        <button
          onClick={handleCopiarId}
          className={`${gajrajOne.className} text-white/40 text-sm mt-1 no-select cursor-pointer flex items-center gap-1 w-max transition-colors duration-300 hover:text-white`}
          title="Copiar ID"
        >
          {copiado ? (
            <>Copiado! ✅</>
          ) : (
            <>
              {user?.id} <span className="text-xs">📋</span>
            </>
          )}
        </button>
      </div>

      {/* Divisor
      <div className="flex items-center justify-center w-full my-6 opacity-60">
        <div className="h-px bg-white/30 flex-1 max-w-[120px]"></div>
        <div className="mx-3 w-4 h-4 bg-white rounded-full relative flex items-center justify-center">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] text-white">▲</span>
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[8px] text-white">▼</span>
          <span className="absolute top-1/2 -left-3 -translate-y-1/2 text-[8px] text-white">◀</span>
          <span className="absolute top-1/2 -right-3 -translate-y-1/2 text-[8px] text-white">▶</span>
        </div>
        <div className="h-px bg-white/30 flex-1 max-w-[120px]"></div>
      </div> */}

      {/* Estatísticas Principais */}
      <div className="flex justify-between items-center w-full px-2 mb-8">
        <div className="flex flex-col items-center w-24">
          <span className={`${gajrajOne.className} text-2xl text-white`}>{stats?.wins ?? 0}</span>
          <span className={`${gajrajOne.className} text-white text-[10px] sm:text-xs uppercase mt-1`}>Vitorias</span>
        </div>

        {/* Avatar */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 overflow-hidden flex items-center justify-center relative">
          <Avatar className="w-full h-full" />
        </div>

        <div className="flex flex-col items-center w-24">
          <RankPoints
            value={user?.rank_points ?? 0}
            className={`${gajrajOne.className} text-2xl text-white`}
            starClassName="size-5"
          />
          <span className={`${gajrajOne.className} text-white text-[10px] sm:text-xs uppercase mt-1`}>RANK</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-between w-full border-b-2 border-white/10 mb-4 relative">
        {(["historico", "estatisticas", "amigos"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`${gajrajOne.className} ${activeTab === tab ? "text-[#FFD700]" : "text-white"} flex-1 pb-2 text-center text-[13px] capitalize sm:text-sm relative`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 w-full h-[2px] bg-[#FFD700]"></div>
            )}
          </button>
        ))}
      </div>

      {/* Conteúdo da Aba Ativa */}
      <div className="flex-1 flex flex-col min-h-0">
        {activeTab === "historico" && (
          <HistoryTab matches={matches} users={users} currentUserId={user?.id} />
        )}
        {activeTab === "estatisticas" && <StatsTab stats={stats} user={user} />}
        {activeTab === "amigos" && <FriendsTab users={users} currentUserId={user?.id} />}
      </div>

      <BottomNav active="profile" />
    </div>
  );
}