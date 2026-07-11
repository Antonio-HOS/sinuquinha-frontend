"use client";

import ProfileView from "./components/ProfileView";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { api, type Match, type User, type UserStats } from "@/src/lib/api";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { user, setUser, isLoading } = useCurrentUser({ redirectToLogin: true });
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

  if (isLoading) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center text-white">
        Carregando perfil...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <ProfileView
      user={user}
      stats={stats}
      matches={matches}
      users={users}
      isOwnProfile
      onUserUpdate={setUser}
    />
  );
}
