import { useState } from "react";
import { gajrajOne } from "@/src/fonts";
import { suggestionsMock, friendsMock } from "../mocks";

export default function FriendsTab() {
  const [search, setSearch] = useState("");
  const [seguindo, setSeguindo] = useState<string[]>([]);
  const [desafiados, setDesafiados] = useState<string[]>([]);

  // Filtra as listas com base no que foi digitado (nome ou matrícula)
  const filteredSuggestions = suggestionsMock.filter(
    (s) =>
      s.nome.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase())
  );

  const filteredFriends = friendsMock.filter(
    (f) =>
      f.nome.toLowerCase().includes(search.toLowerCase()) ||
      f.id.toLowerCase().includes(search.toLowerCase())
  );

  // Ações dos botões
  const handleSeguir = (id: string) => {
    setSeguindo((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDesafiar = (id: string) => {
    setDesafiados((prev) => [...prev, id]);
    // Simula um tempo de "Enviando desafio..."
    setTimeout(() => {
      setDesafiados((prev) => prev.filter((item) => item !== id));
    }, 2000);
  };

  return (
    <div className="scrollbar-hidden flex flex-col gap-6 overflow-y-auto pb-24 px-1 mt-2">
      {/* Input de Busca */}
      <div className="relative w-full">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Busca por Nome ou Matrícula"
          className="w-full bg-transparent border border-white/60 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/80 focus:outline-none focus:border-[#FFD700] transition-colors"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 text-white/80"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
      </div>

      {/* Sugestões */}
      {filteredSuggestions.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className={`${gajrajOne.className} text-[#FFD700] text-sm uppercase tracking-wide`}>
            Sugestões
          </h2>
          {filteredSuggestions.map((item) => {
            const isFollowing = seguindo.includes(item.id);
            return (
              <div
                key={item.id}
                className="border border-white/60 rounded-xl p-4 flex justify-between items-center bg-transparent"
              >
                <div className="flex flex-col">
                  <span className={`${gajrajOne.className} text-white text-sm sm:text-base`}>
                    {item.nome}
                  </span>
                  <span className={`${gajrajOne.className} text-white/40 text-[10px] mt-0.5`}>
                    {item.id}
                  </span>
                  <span className={`${gajrajOne.className} text-white text-[10px] mt-2 underline decoration-white/40 underline-offset-4`}>
                    Rank: {item.rank}
                  </span>
                </div>
                <button
                  onClick={() => handleSeguir(item.id)}
                  className={`${gajrajOne.className} text-xs px-4 py-1.5 rounded-lg border-2 transition-all ${
                    isFollowing
                      ? "border-transparent bg-white/20 text-white"
                      : "border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/10"
                  }`}
                >
                  {isFollowing ? "Seguindo" : "Seguir"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Meus Amigos */}
      {filteredFriends.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className={`${gajrajOne.className} text-[#FFD700] text-sm uppercase tracking-wide`}>
            Meus Amigos
          </h2>
          {filteredFriends.map((item) => {
            const isChallenged = desafiados.includes(item.id);
            return (
              <div
                key={item.id}
                className="border border-white/60 rounded-xl p-4 flex justify-between items-center bg-transparent"
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className={`${gajrajOne.className} text-white text-sm sm:text-base uppercase`}>
                      {item.nome}
                    </span>
                    {/* Indicador de Status */}
                    {item.status === "online" ? (
                      <span className={`${gajrajOne.className} flex items-center gap-1 text-[8px] text-white uppercase`}>
                        <span className="w-2 h-2 rounded-full bg-[#10B981]"></span> Online
                      </span>
                    ) : (
                      <span className={`${gajrajOne.className} flex items-center gap-1 text-[8px] text-white uppercase`}>
                        <span className="w-2 h-2 rounded-full bg-[#EF4444]"></span> Offline
                      </span>
                    )}
                  </div>
                  <span className={`${gajrajOne.className} text-white/40 text-[10px] mt-0.5`}>
                    {item.id}
                  </span>
                  <span className={`${gajrajOne.className} text-white text-[10px] mt-2 underline decoration-white/40 underline-offset-4`}>
                    Rank: {item.rank}
                  </span>
                </div>
                <button
                  onClick={() => handleDesafiar(item.id)}
                  disabled={isChallenged}
                  className={`${gajrajOne.className} text-xs px-4 py-2 rounded-lg text-black transition-all ${
                    isChallenged ? "bg-yellow-600" : "bg-[#FFD700] hover:bg-yellow-400"
                  }`}
                >
                  {isChallenged ? "Aguardando..." : "Desafiar"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Mensagem quando a busca não encontra ninguém */}
      {filteredSuggestions.length === 0 && filteredFriends.length === 0 && (
        <div className="text-center text-white/60 text-sm mt-8">
          Nenhum jogador encontrado.
        </div>
      )}
    </div>
  );
}