"use client";

import { useState } from "react";
import { gajrajOne } from "@/src/fonts";
import RankPoints from "@/src/components/RankPoints";
import type { User } from "@/src/lib/api";
import Link from "next/link";

type FriendsTabProps = {
  users: User[];
  currentUserId?: string;
};

export default function FriendsTab({ users, currentUserId }: FriendsTabProps) {
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((user) => {
    const query = search.toLowerCase();
    return (
      user.id !== currentUserId &&
      (user.name.toLowerCase().includes(query) ||
        user.nickname.toLowerCase().includes(query) ||
        user.registration_number?.toLowerCase().includes(query))
    );
  });

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

      {filteredUsers.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className={`${gajrajOne.className} text-[#FFD700] text-sm uppercase tracking-wide`}>
            Jogadores
          </h2>
          {filteredUsers.map((item) => (
              <div
                key={item.id}
                className="border border-white/60 rounded-xl p-4 flex justify-between items-center bg-transparent"
              >
                <Link
                  href={`/profile/${item.id}`}
                  className="flex min-w-0 flex-1 flex-col"
                >
                  <span className={`${gajrajOne.className} text-white text-sm sm:text-base`}>
                    {item.nickname}
                  </span>
                  <span className={`${gajrajOne.className} text-white/40 text-[10px] mt-0.5`}>
                    {item.registration_number ?? item.email}
                  </span>
                  <span className={`${gajrajOne.className} text-white text-[10px] mt-2 underline decoration-white/40 underline-offset-4 inline-flex items-center gap-1`}>
                    Rank:
                    <RankPoints value={item.rank_points} starClassName="size-3" />
                  </span>
                </Link>
                <Link
                  href={`/jogar/moedas?opponentId=${item.id}&opponent=${encodeURIComponent(item.nickname)}`}
                  className={`${gajrajOne.className} shrink-0 text-xs px-4 py-2 rounded-lg text-black bg-[#FFD700] hover:bg-yellow-400 transition-all`}
                >
                  Desafiar
                </Link>
              </div>
          ))}
        </div>
      )}

      {filteredUsers.length === 0 && (
        <div className="text-center text-white/60 text-sm mt-8">
          Nenhum jogador encontrado.
        </div>
      )}
    </div>
  );
}