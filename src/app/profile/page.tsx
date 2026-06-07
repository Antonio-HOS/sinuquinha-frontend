"use client";

import AppHeader from "@/src/components/AppHeader";
import Avatar from "@/src/components/Avatar";
import BottomNav from "@/src/components/BottomNav";
import { gajrajOne } from "@/src/fonts";
import { useState } from "react";
import { userMock } from "./mocks";
import HistoryTab from "./components/HistoryTab";
import StatsTab from "./components/StatsTab";
import FriendsTab from "./components/FriendsTab";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("historico");
  const [copiado, setCopiado] = useState(false);

  const handleCopiarId = () => {
    navigator.clipboard.writeText(userMock.id);
    setCopiado(true);
    setTimeout(() => {
      setCopiado(false);
    }, 2000);
  };

  return (
    <div className="flex min-h-full flex-1 flex-col px-4 pb-4 pt-3 sm:px-5">
      <AppHeader />

      {/* Info do Jogador */}
      <div className="mt-6 flex flex-col">
        <h1 className={`${gajrajOne.className} text-[clamp(2rem,8vw,2rem)] text-white uppercase tracking-wider leading-none`}>
          {userMock.nome}
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
              {userMock.id} <span className="text-xs">📋</span>
            </>
          )}
        </button>
      </div>

      {/* Divisor */}
      <div className="flex items-center justify-center w-full my-6 opacity-60">
        <div className="h-px bg-white/30 flex-1 max-w-[120px]"></div>
        <div className="mx-3 w-4 h-4 bg-white rounded-full relative flex items-center justify-center">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] text-white">▲</span>
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[8px] text-white">▼</span>
          <span className="absolute top-1/2 -left-3 -translate-y-1/2 text-[8px] text-white">◀</span>
          <span className="absolute top-1/2 -right-3 -translate-y-1/2 text-[8px] text-white">▶</span>
        </div>
        <div className="h-px bg-white/30 flex-1 max-w-[120px]"></div>
      </div>

      {/* Estatísticas Principais */}
      <div className="flex justify-between items-center w-full px-2 mb-8">
        <div className="flex flex-col items-center w-24">
          <span className={`${gajrajOne.className} text-2xl text-white`}>{userMock.vitorias}</span>
          <span className={`${gajrajOne.className} text-white text-[10px] sm:text-xs uppercase mt-1`}>Vitorias</span>
        </div>

        {/* Avatar */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 overflow-hidden flex items-center justify-center relative">
          <Avatar className="w-full h-full" />
        </div>

        <div className="flex flex-col items-center w-24">
          <span className={`${gajrajOne.className} text-2xl text-white`}>{userMock.rank}</span>
          <span className={`${gajrajOne.className} text-white text-[10px] sm:text-xs uppercase mt-1`}>RANK</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-between w-full border-b-2 border-white/10 mb-4 relative">
        {(["historico", "estatisticas", "amigos"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`${gajrajOne.className} ${activeTab === tab ? "text-[#FFD700]" : "text-white"} text-sm sm:text-base pb-2 flex-1 text-center relative capitalize`}
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
        {activeTab === "historico" && <HistoryTab />}
        {activeTab === "estatisticas" && <StatsTab />}
        {activeTab === "amigos" && <FriendsTab />}
      </div>

      <BottomNav active="profile" />
    </div>
  );
}