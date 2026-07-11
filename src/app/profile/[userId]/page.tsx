"use client";

import ProfileView from "../components/ProfileView";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { api, type Match, type User, type UserStats } from "@/src/lib/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserProfilePage() {
  const params = useParams<{ userId: string }>();
  const router = useRouter();
  const userId = params.userId;
  const { user: currentUser, isLoading: isAuthLoading } = useCurrentUser({ redirectToLogin: true });
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthLoading && currentUser && userId === currentUser.id) {
      router.replace("/profile");
    }
  }, [currentUser, isAuthLoading, router, userId]);

  useEffect(() => {
    async function loadUserProfile() {
      if (!userId || (currentUser && userId === currentUser.id)) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const [userResponse, statsResponse, matchesResponse, usersResponse] =
          await Promise.allSettled([
            api.user(userId),
            api.statsUser(userId),
            api.matchesByUser(userId),
            api.users(),
          ]);

        if (userResponse.status === "rejected") {
          throw userResponse.reason;
        }

        setUser(userResponse.value);
        setStats(statsResponse.status === "fulfilled" ? statsResponse.value : null);
        setMatches(matchesResponse.status === "fulfilled" ? matchesResponse.value : []);
        setUsers(usersResponse.status === "fulfilled" ? usersResponse.value : []);
      } catch (loadError) {
        setError(
          loadError instanceof Error ? loadError.message : "Não foi possível carregar o perfil.",
        );
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    if (!isAuthLoading && userId && (!currentUser || userId !== currentUser.id)) {
      void loadUserProfile();
    }
  }, [currentUser, isAuthLoading, userId]);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/home");
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center text-white">
        Carregando perfil...
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 px-4 text-white">
        <p className="text-center text-sm text-white/80">{error ?? "Usuário não encontrado."}</p>
        <button
          type="button"
          onClick={handleBack}
          className="rounded-lg bg-[#FFD700] px-4 py-2 text-sm text-black"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <ProfileView
      user={user}
      stats={stats}
      matches={matches}
      users={users}
      showBackButton
      onBack={handleBack}
    />
  );
}
