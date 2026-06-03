"use client";

import AppHeader from "@/src/components/AppHeader";
import Avatar from "@/src/components/Avatar";
import BottomNav from "@/src/components/BottomNav";
import { gajrajOne } from "@/src/fonts";
import { useState } from "react";

// Mock baseado no histórico mostrado no layout
const historyMock = Array(8).fill({
  nome: "Rick",
  tipo: "T-7",
  tempo: "1:00:20",
  points: "+ 20 RU",
  moedas: "+ 10",
});

// Mock de ranking (pode ser usado na aba Estatísticas futuramente)
const rankingMock = [
  { pos: 1, name: "Antonio", score: 1000, bg: "bg-[#6B7280]", text: "text-white" },
  { pos: 2, name: "Galdino", score: 150, bg: "bg-[#FFD700]", text: "text-black" },
  { pos: 3, name: "Henrique", score: 140, bg: "bg-[#C0C0C0]", text: "text-black" },
  { pos: 4, name: "Jorge Lima", score: 130, bg: "bg-[#CD7F32]", text: "text-white" },
  { pos: 5, name: "Rodrigo", score: 130, bg: "bg-[#CD7F32]", text: "text-white" },
  { pos: 6, name: "Thiago", score: 15, bg: "bg-[#374151]", text: "text-white" },
] as const;

export default function ProfilePage() {
  // Controle de estado para as abas
  const [activeTab, setActiveTab] = useState("historico");

  return (
    <div className="flex min-h-full flex-1 flex-col px-4 pb-4 pt-3 sm:px-5">
      <AppHeader />

      {/* Info do Jogador */}
      <div className="mt-6 flex flex-col items-center">
        <h1 className={`${gajrajOne.className} text-[clamp(2rem,8vw,2.5rem)] text-white uppercase tracking-wider leading-none`}>
          Galdinobross
        </h1>
        <span className={`${gajrajOne.className} text-white/40 text-sm mt-1`}>
          #202320098
        </span>
      </div>

      {/* Divisor Central (com o ícone expansivo) */}
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
          <span className={`${gajrajOne.className} text-2xl text-white`}>15</span>
          <span className={`${gajrajOne.className} text-white text-[10px] sm:text-xs uppercase mt-1`}>Vitorias</span>
        </div>
        
        {/* Avatar Centralizado */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-orange-400 border-[3px] border-[#FFD700] overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.3)] relative">
           {/* Caso tenha uma tag em cima do avatar, pode adicionar um absolute aqui */}
           {/* Use a tag <img> com o path correto da foto do cachorro ou o seu componente <Avatar /> */}
           <img src="/sua-imagem-aqui.png" alt="Avatar" className="w-full h-full object-cover bg-orange-300" />
        </div>

        <div className="flex flex-col items-center w-24">
          <span className={`${gajrajOne.className} text-2xl text-white`}>10º</span>
          <span className={`${gajrajOne.className} text-white text-[10px] sm:text-xs uppercase mt-1`}>RANK</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-between w-full border-b-2 border-white/10 mb-4 relative">
        <button 
          onClick={() => setActiveTab("historico")}
          className={`${gajrajOne.className} ${activeTab === "historico" ? "text-[#FFD700]" : "text-white"} text-sm sm:text-base pb-2 flex-1 text-center relative`}
        >
          Histórico
          {activeTab === "historico" && (
            <div className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 w-full h-[2px] bg-[#FFD700]"></div>
          )}
        </button>
        <button 
          onClick={() => setActiveTab("estatisticas")}
          className={`${gajrajOne.className} ${activeTab === "estatisticas" ? "text-[#FFD700]" : "text-white"} text-sm sm:text-base pb-2 flex-1 text-center relative`}
        >
          Estatísticas
          {activeTab === "estatisticas" && (
            <div className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 w-full h-[2px] bg-[#FFD700]"></div>
          )}
        </button>
        <button 
          onClick={() => setActiveTab("amigos")}
          className={`${gajrajOne.className} ${activeTab === "amigos" ? "text-[#FFD700]" : "text-white"} text-sm sm:text-base pb-2 flex-1 text-center relative`}
        >
          Amigos
          {activeTab === "amigos" && (
            <div className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 w-full h-[2px] bg-[#FFD700]"></div>
          )}
        </button>
      </div>

      {/* Container flexível para fazer o scroll da tabela funcionar corretamente */}
      <div className="flex-1 flex flex-col min-h-0"> 
        {activeTab === "historico" && (
          <>
            {/* Cabeçalho da Tabela */}
            <div className={`grid grid-cols-5 gap-1 mb-4 px-1 ${gajrajOne.className} text-white text-[10px] sm:text-xs text-center uppercase`}>
              <div className="text-left">Nome</div>
              <div>Tipo</div>
              <div>Tempo</div>
              <div>Points</div>
              <div>Moedas</div>
            </div>

            {/* Lista Scrollável do Histórico */}
            <div className="scrollbar-hidden flex flex-col gap-4 overflow-y-auto pb-20 px-1">
              {historyMock.map((item, index) => (
                <div key={index} className={`grid grid-cols-5 gap-1 items-center ${gajrajOne.className} text-white text-[10px] sm:text-xs text-center`}>
                  <div className="text-left truncate">{item.nome}</div>
                  <div>{item.tipo}</div>
                  <div>{item.tempo}</div>
                  <div className="whitespace-nowrap">{item.points}</div>
                  <div className="flex items-center justify-center gap-1">
                    {item.moedas} 
                    {/* Placeholder para a imagem da moedinha ao lado do valor */}
                    <div className="w-3 h-3 bg-orange-400 rounded-full border border-yellow-400"></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Ajustado para active="profile" */}
      <BottomNav active="profile" />
    </div>
  );
}