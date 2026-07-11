export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:8000";

const TOKEN_KEY = "sinuquinha_access_token";

export type User = {
  id: string;
  name: string;
  nickname: string;
  registration_number?: string | null;
  email: string;
  avatar_id?: string | null;
  rank_points: number;
  coin_balance: number;
  created_at: string;
  updated_at: string;
  last_free_coins_at?: string | null;
};

export type RankingEntry = {
  id: string;
  season_id?: string | null;
  user_id: string;
  league?: "bronze" | "prata" | "ouro" | "diamante" | null;
  points: number;
  wins: number;
  losses: number;
  matches_played: number;
  position?: number | null;
  name: string;
  nickname: string;
  avatar_id?: string | null;
};

export type UserStats = {
  user_id: string;
  total_matches: number;
  wins: number;
  losses: number;
  win_rate: string | number;
  best_win_streak: number;
  current_win_streak: number;
  coins_won: number;
  coins_lost: number;
  name?: string;
  nickname?: string;
  avatar_id?: string | null;
};

export type CoinPackage = {
  id: string;
  name: string;
  coins: number;
  bonus_coins: number;
  price_cents: number;
  currency: string;
  is_active: boolean;
};

export type MatchPlayer = {
  id: string;
  match_id: string;
  user_id: string;
  team?: "A" | "B" | "solo" | string | null;
  score: number;
  confirmation_status: "pending" | "confirmed" | "declined";
  result: "winner" | "loser" | "draw" | "none";
};

export type MatchParticipantInput = {
  userId: string;
  team: "A" | "B" | "solo";
};

export type Match = {
  id: string;
  mode: string;
  game_type: string;
  best_of: number;
  status:
    | "draft"
    | "waiting_confirmation"
    | "active"
    | "finished"
    | "cancelled"
    | "revoked";
  created_by_user_id: string;
  winner_user_id?: string | null;
  stake_coins: number;
  file?: string | null;
  started_at?: string | null;
  ended_at?: string | null;
  players?: MatchPlayer[];
  rounds?: Array<{
    id: string;
    round_number: number;
    winner_user_id?: string | null;
  }>;
};

export type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  read_at?: string | null;
  reference_type?: string | null;
  reference_id?: string | null;
  created_at: string;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new Event("sinuquinha:auth-changed"));
}

export function clearAccessToken() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event("sinuquinha:auth-changed"));
}

export const DEFAULT_MATCH_PHOTO = "/sinuca.svg";

export function getMatchPhotoUrl(match?: Pick<Match, "file"> | null) {
  if (match?.file) {
    return match.file.startsWith("http") ? match.file : `${API_URL}${match.file}`;
  }

  return DEFAULT_MATCH_PHOTO;
}

export function getProjectedWinnerUserIds(match: Match): string[] | null {
  const players = match.players ?? [];

  if (match.mode === "2x2") {
    const teamScores = ["A", "B"].map((team) => ({
      team,
      score: Math.max(
        0,
        ...players
          .filter((player) => player.team === team)
          .map((player) => Number(player.score)),
      ),
    }));
    teamScores.sort((a, b) => b.score - a.score);

    if (!teamScores[0] || teamScores[0].score === teamScores[1]?.score) {
      return null;
    }

    return players
      .filter((player) => player.team === teamScores[0].team)
      .map((player) => player.user_id);
  }

  const sortedPlayers = [...players].sort(
    (a, b) => Number(b.score) - Number(a.score),
  );
  const winner = sortedPlayers[0];
  const runnerUp = sortedPlayers[1];

  if (!winner || Number(winner.score) === Number(runnerUp?.score ?? -1)) {
    return null;
  }

  return [winner.user_id];
}

export function isProjectedWinner(match: Match, userId: string) {
  const winnerUserIds = getProjectedWinnerUserIds(match);
  return Boolean(winnerUserIds?.includes(userId));
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAccessToken();
  const headers = new Headers(options.headers);

  if (
    !headers.has("Content-Type") &&
    options.body &&
    !(options.body instanceof FormData)
  ) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof data === "object" && data && "message" in data
        ? Array.isArray(data.message)
          ? data.message.join(", ")
          : String(data.message)
        : "Não foi possível concluir a operação.";
    throw new ApiError(message, response.status);
  }

  return data as T;
}

export const api = {
  register: (input: {
    name: string;
    nickname: string;
    registrationNumber: string;
    email: string;
    password: string;
  }) =>
    apiRequest<{ user: User; accessToken: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  login: (input: { email: string; password: string }) =>
    apiRequest<{ user: User; accessToken: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  me: () => apiRequest<User>("/users/me"),
  user: (userId: string) => apiRequest<User>(`/users/${userId}`),
  updateMe: (input: Partial<Pick<User, "name" | "nickname">> & { avatarId?: string }) =>
    apiRequest<User>("/users/me", {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  freeCoins: () => apiRequest<User>("/users/me/free-coins", { method: "POST" }),
  users: (search = "") =>
    apiRequest<User[]>(`/users?search=${encodeURIComponent(search)}`),
  rankings: () =>
    apiRequest<{ season: unknown; rankings: RankingEntry[] }>(
      "/rankings/current",
    ),
  statsMe: () => apiRequest<UserStats>("/stats/me"),
  statsUser: (userId: string) => apiRequest<UserStats>(`/stats/users/${userId}`),
  coinPackages: () => apiRequest<CoinPackage[]>("/coins/packages"),
  createPurchase: (coinPackageId: string) =>
    apiRequest<{ id: string }>("/purchases", {
      method: "POST",
      body: JSON.stringify({ coinPackageId, paymentProvider: "manual" }),
    }),
  confirmPurchase: (purchaseId: string) =>
    apiRequest<unknown>(`/purchases/${purchaseId}/confirm-payment`, {
      method: "POST",
      body: JSON.stringify({ providerReference: `front-${Date.now()}` }),
    }),
  matches: (status = "") =>
    apiRequest<Match[]>(
      status ? `/matches?status=${encodeURIComponent(status)}` : "/matches",
    ),
  matchesAll: (status = "") =>
    apiRequest<Match[]>(
      status ? `/matches/all?status=${encodeURIComponent(status)}` : "/matches/all",
    ),
  matchesByUser: (userId: string, status = "") =>
    apiRequest<Match[]>(
      status
        ? `/matches/users/${userId}?status=${encodeURIComponent(status)}`
        : `/matches/users/${userId}`,
    ),
  match: (matchId: string) => apiRequest<Match>(`/matches/${matchId}`),
  createMatch: (input: {
    players: MatchParticipantInput[];
    mode: string;
    gameType: string;
    bestOf: number;
    stakeCoins: number;
  }) =>
    apiRequest<Match>("/matches", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  confirmMatch: (matchId: string) =>
    apiRequest<Match>(`/matches/${matchId}/confirm`, { method: "POST" }),
  revokeMatch: (matchId: string) =>
    apiRequest<Match>(`/matches/${matchId}/revoke`, { method: "POST" }),
  addRound: (matchId: string, roundNumber: number, winnerUserId: string) =>
    apiRequest<Match>(`/matches/${matchId}/rounds`, {
      method: "POST",
      body: JSON.stringify({ roundNumber, winnerUserId }),
    }),
  finishMatchWithPhoto: (matchId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return apiRequest<Match>(`/matches/${matchId}/finish`, {
      method: "POST",
      body: formData,
    });
  },
  notifications: () => apiRequest<Notification[]>("/notifications"),
};

export function formatCoins(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

export function formatPrice(cents: number, currency = "BRL") {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export function getMatchDurationMs(match?: Pick<Match, "started_at" | "ended_at"> | null) {
  if (!match?.started_at) return null;

  const startedAt = new Date(match.started_at).getTime();
  const endedAt = match.ended_at ? new Date(match.ended_at).getTime() : Date.now();

  if (Number.isNaN(startedAt) || Number.isNaN(endedAt) || endedAt < startedAt) {
    return null;
  }

  return endedAt - startedAt;
}

export function formatMatchDuration(match?: Pick<Match, "started_at" | "ended_at"> | null) {
  const durationMs = getMatchDurationMs(match);

  if (durationMs === null) return "Aguardando início";

  const totalSeconds = Math.floor(durationMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(seconds).padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${paddedMinutes}:${paddedSeconds}`;
  }

  return `${minutes}:${paddedSeconds}`;
}
