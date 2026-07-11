"use client";

import { API_URL, getAccessToken, type Match } from "@/src/lib/api";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { io, type Socket } from "socket.io-client";

type SocketContextValue = {
  socket: Socket | null;
  activeInvite: Match | null;
  acceptInvite: (matchId?: string) => void;
  declineInvite: (matchId?: string) => void;
};

const SocketContext = createContext<SocketContextValue | null>(null);

function getUserIdFromToken(token: string) {
  try {
    const payload = JSON.parse(window.atob(token.split(".")[1] ?? ""));
    return typeof payload.id === "string" ? payload.id : null;
  } catch {
    return null;
  }
}

export function SocketProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [activeInvite, setActiveInvite] = useState<Match | null>(null);

  useEffect(() => {
    const connect = () => {
      const token = getAccessToken();

      if (!token) {
        setSocket((current) => {
          current?.disconnect();
          return null;
        });
        return;
      }

      const nextSocket = io(API_URL, {
        auth: { token },
        transports: ["websocket"],
      });
      const currentUserId = getUserIdFromToken(token);

      nextSocket.on("match:invite", (match: Match) => {
        const currentPlayer = match.players?.find(
          (player) => player.user_id === currentUserId,
        );

        if (currentPlayer?.confirmation_status !== "pending") {
          return;
        }

        setActiveInvite(match);
      });

      nextSocket.on("match:started", (match: Match) => {
        setActiveInvite(null);
        router.push(`/jogar/partida?matchId=${match.id}`);
      });

      nextSocket.on("match:updated", (match: Match) => {
        if (match.status !== "waiting_confirmation") {
          setActiveInvite((current) => (current?.id === match.id ? null : current));
        }
      });

      nextSocket.on("match:declined", (match: Match) => {
        setActiveInvite((current) => (current?.id === match.id ? null : current));
      });

      nextSocket.on("match:cancelled", (match: Match) => {
        setActiveInvite((current) => (current?.id === match.id ? null : current));
      });

      setSocket(nextSocket);
    };

    connect();
    window.addEventListener("storage", connect);
    window.addEventListener("sinuquinha:auth-changed", connect);

    return () => {
      window.removeEventListener("storage", connect);
      window.removeEventListener("sinuquinha:auth-changed", connect);
      setSocket((current) => {
        current?.disconnect();
        return null;
      });
    };
  }, [router]);

  const acceptInvite = useCallback(
    (matchId = activeInvite?.id) => {
      if (!socket || !matchId) return;
      socket.emit("match:accept", { matchId }, (match: Match) => {
        setActiveInvite(null);
        if (match.status !== "cancelled") {
          router.push(`/jogar/partida?matchId=${match.id}`);
        }
      });
    },
    [activeInvite?.id, router, socket],
  );

  const declineInvite = useCallback(
    (matchId = activeInvite?.id) => {
      if (!socket || !matchId) return;
      socket.emit("match:decline", { matchId });
      setActiveInvite(null);
    },
    [activeInvite?.id, socket],
  );

  const value = useMemo(
    () => ({ socket, activeInvite, acceptInvite, declineInvite }),
    [acceptInvite, activeInvite, declineInvite, socket],
  );

  return (
    <SocketContext.Provider value={value}>
      {children}
      <MatchInviteModal />
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket deve ser usado dentro de SocketProvider.");
  }

  return context;
}

function MatchInviteModal() {
  const { activeInvite, acceptInvite, declineInvite } = useSocket();

  if (!activeInvite) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 px-6">
      <section className="w-full max-w-[320px] rounded-2xl border border-[#FFD700] bg-[#004C55] p-5 text-center shadow-2xl">
        <h2 className="text-2xl text-[#FFD700]">Convite de Partida</h2>
        <p className="mt-3 text-sm text-[#FFEDAD]">
          Você recebeu um convite para jogar {activeInvite.game_type}, valendo{" "}
          {activeInvite.stake_coins} moedas.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => declineInvite()}
            className="h-11 rounded-md border border-[#FFD700] text-[#FFD700]"
          >
            Recusar
          </button>
          <button
            type="button"
            onClick={() => acceptInvite()}
            className="h-11 rounded-md bg-[#2AC054] text-[#004C55]"
          >
            Aceitar
          </button>
        </div>
      </section>
    </div>
  );
}
