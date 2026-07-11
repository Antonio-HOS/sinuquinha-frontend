"use client";

import AppHeader from "@/src/components/AppHeader";
import BottomNav from "@/src/components/BottomNav";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { api, type Match, type User } from "@/src/lib/api";
import { gajrajOne } from "@/src/fonts";
import { useEffect, useState } from "react";
import HistoryTab from "@/src/app/profile/components/HistoryTab";

export default function MatchesHistoryScreen() {
  const { user, isLoading: isUserLoading } = useCurrentUser({ redirectToLogin: true });
  const [matches, setMatches] = useState<Match[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const [matchesResponse, usersResponse] = await Promise.allSettled([
          api.matchesAll(),
          api.users(),
        ]);

        setMatches(
          matchesResponse.status === "fulfilled" ? matchesResponse.value : [],
        );
        setUsers(usersResponse.status === "fulfilled" ? usersResponse.value : []);
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      void loadHistory();
    }
  }, [user]);

  if (isUserLoading) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center text-white">
        Carregando...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden px-4 pb-4 pt-3 sm:px-5">
      <AppHeader />

      <section className="flex flex-col items-center">
        <h1
          className={`${gajrajOne.className} text-center text-[clamp(2rem,8vw,2.25rem)] text-[#FFD700]`}
        >
          Histórico
        </h1>
        <p className="mt-1 text-sm tracking-[0.18em] text-white/80">
          TODAS AS PARTIDAS
        </p>
      </section>

      <div className="mt-5 flex min-h-0 flex-1 flex-col">
        {isLoading ? (
          <p className="text-center text-sm text-white/70">Carregando partidas...</p>
        ) : (
          <HistoryTab
            matches={matches}
            users={users}
            currentUserId={user.id}
            variant="global"
          />
        )}
      </div>

      <BottomNav active="history" />
    </div>
  );
}
