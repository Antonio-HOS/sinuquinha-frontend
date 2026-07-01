import { api, clearAccessToken, getAccessToken, type User } from "@/src/lib/api";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function useCurrentUser(options: { redirectToLogin?: boolean } = {}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUser = useCallback(async () => {
    if (!getAccessToken()) {
      setIsLoading(false);
      if (options.redirectToLogin) router.replace("/login");
      return;
    }

    try {
      setError("");
      const currentUser = await api.me();
      setUser(currentUser);
    } catch (err) {
      clearAccessToken();
      setError(err instanceof Error ? err.message : "Sessão inválida.");
      if (options.redirectToLogin) router.replace("/login");
    } finally {
      setIsLoading(false);
    }
  }, [options.redirectToLogin, router]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadUser();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadUser]);

  return { user, setUser, isLoading, error, reloadUser: loadUser };
}
