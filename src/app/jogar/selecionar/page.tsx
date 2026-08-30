"use client";

import {
  MatchShell,
  MatchTitle,
  PlayerPill,
} from "@/src/app/jogar/components/MatchFlow";
import Avatar from "@/src/components/Avatar";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { api, type User } from "@/src/lib/api";
import { gajrajOne } from "@/src/fonts";
import { GripVertical, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  type DragEvent,
  type ReactNode,
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";

const modeConfig: Record<string, { label: string; requiredOpponents: number }> = {
  "1x1": { label: "Selecione 1 adversário", requiredOpponents: 1 },
  "2x2": { label: "Selecione 3 jogadores para formar as equipes", requiredOpponents: 3 },
  "Todos Contra (3)": { label: "Selecione 2 adversários", requiredOpponents: 2 },
  "Todos Contra": { label: "Selecione 2 adversários", requiredOpponents: 2 },
};

type Team2x2Layout = {
  partner: User;
  teamB: [User, User];
};

type DragPayload = {
  source: "partner" | "teamB";
  index?: number;
};

function initTeam2x2Layout(users: User[]): Team2x2Layout {
  return {
    partner: users[0],
    teamB: [users[1], users[2]],
  };
}

function getOrderedOpponentIds(
  mode: string,
  selectedUsers: User[],
  team2x2: Team2x2Layout | null,
): string[] {
  if (mode === "2x2" && team2x2) {
    return [team2x2.partner.id, team2x2.teamB[0].id, team2x2.teamB[1].id];
  }

  return selectedUsers.map((item) => item.id);
}

function getOrderedOpponentNames(
  mode: string,
  selectedUsers: User[],
  team2x2: Team2x2Layout | null,
): string[] {
  if (mode === "2x2" && team2x2) {
    return [
      team2x2.partner.nickname,
      team2x2.teamB[0].nickname,
      team2x2.teamB[1].nickname,
    ];
  }

  return selectedUsers.map((item) => item.nickname);
}

type DraggableTeamPlayerProps = {
  user: User;
  dragId: DragPayload;
  onDragStart: (payload: DragPayload) => void;
  onDragEnd: () => void;
  isDragging: boolean;
};

function DraggableTeamPlayer({
  user,
  dragId,
  onDragStart,
  onDragEnd,
  isDragging,
}: DraggableTeamPlayerProps) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(dragId)}
      onDragEnd={onDragEnd}
      className={`flex cursor-grab items-center gap-2 rounded-full border border-[#2AC054]/50 bg-[#2AC054]/10 py-1 pl-1 pr-2 transition-opacity active:cursor-grabbing ${
        isDragging ? "opacity-40" : ""
      }`}
    >
      <GripVertical className="size-3.5 shrink-0 text-[#FFEDAD]/50" />
      <Avatar
        avatarId={user.avatar_id ? Number.parseInt(user.avatar_id, 10) : null}
        className="size-7 border border-[#FFEDAD]/60"
      />
      <span className="max-w-[72px] truncate text-xs text-[#FFEDAD]">
        {user.nickname}
      </span>
    </div>
  );
}

type TeamDropZoneProps = {
  label: string;
  children: ReactNode;
  isOver: boolean;
  onDragOver: (event: DragEvent) => void;
  onDragLeave: () => void;
  onDrop: () => void;
};

function TeamDropZone({
  label,
  children,
  isOver,
  onDragOver,
  onDragLeave,
  onDrop,
}: TeamDropZoneProps) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={(event) => {
        event.preventDefault();
        onDrop();
      }}
      className={`min-h-[88px] rounded-lg border p-2 transition-colors ${
        isOver
          ? "border-[#2AC054]/70 bg-[#2AC054]/10"
          : "border-white/15 bg-white/5"
      }`}
    >
      <p className="mb-2 text-center text-xs font-semibold text-[#FFEDAD]/80">
        {label}
      </p>
      <div className="flex flex-col items-center gap-2">{children}</div>
    </div>
  );
}

type SelectionConfirmModalProps = {
  mode: string;
  user: User;
  selectedUsers: User[];
  team2x2: Team2x2Layout | null;
  requiredOpponents: number;
  onClear: () => void;
  onContinue: () => void;
  onRemoveUser: (user: User) => void;
  onTeam2x2Change: (layout: Team2x2Layout) => void;
};

function SelectionConfirmModal({
  mode,
  user,
  selectedUsers,
  team2x2,
  requiredOpponents,
  onClear,
  onContinue,
  onRemoveUser,
  onTeam2x2Change,
}: SelectionConfirmModalProps) {
  const [dragging, setDragging] = useState<DragPayload | null>(null);
  const [dropTarget, setDropTarget] = useState<DragPayload | null>(null);

  const handleDragOver = (event: DragEvent, target: DragPayload) => {
    event.preventDefault();
    setDropTarget(target);
  };

  const handleDrop = (target: DragPayload) => {
    if (!dragging || !team2x2) return;

    const getUserAt = (slot: DragPayload): User => {
      if (slot.source === "partner") return team2x2.partner;
      return team2x2.teamB[slot.index ?? 0];
    };

    const sourceUser = getUserAt(dragging);
    const targetUser = getUserAt(target);

    if (sourceUser.id === targetUser.id) {
      setDragging(null);
      setDropTarget(null);
      return;
    }

    const next: Team2x2Layout = {
      partner: team2x2.partner,
      teamB: [...team2x2.teamB] as [User, User],
    };

    if (dragging.source === "partner") {
      next.partner = targetUser;
    } else {
      next.teamB[dragging.index ?? 0] = targetUser;
    }

    if (target.source === "partner") {
      next.partner = sourceUser;
    } else {
      next.teamB[target.index ?? 0] = sourceUser;
    }

    onTeam2x2Change(next);
    setDragging(null);
    setDropTarget(null);
  };

  const isDropOver = (target: DragPayload) =>
    dropTarget?.source === target.source && dropTarget?.index === target.index;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6"
      aria-label="Confirmar seleção de jogadores"
    >
      <section
        className="w-full max-w-[344px] space-y-3 rounded-xl border border-[#FFD700]/30 bg-[#004C55]/95 p-4 backdrop-blur-sm"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm tracking-[0.12em] text-[#FFEDAD]">Selecionados</p>
          <span className="rounded-full bg-[#2AC054]/25 px-2.5 py-0.5 text-xs font-semibold text-[#2AC054]">
            {selectedUsers.length}/{requiredOpponents}
          </span>
        </div>

        {mode === "2x2" && team2x2 ? (
          <>
            <p className="text-center text-[10px] tracking-[0.1em] text-white/60">
              Arraste os jogadores para reorganizar os times
            </p>
            <div className="grid grid-cols-2 gap-2">
              <TeamDropZone
                label="Time A"
                isOver={isDropOver({ source: "partner" })}
                onDragOver={(event) =>
                  handleDragOver(event, { source: "partner" })
                }
                onDragLeave={() => setDropTarget(null)}
                onDrop={() => handleDrop({ source: "partner" })}
              >
                <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 py-1 pl-1 pr-2">
                  <Avatar
                    avatarId={
                      user.avatar_id
                        ? Number.parseInt(user.avatar_id, 10)
                        : null
                    }
                    className="size-7 border border-[#FFEDAD]/60"
                  />
                  <span className="max-w-[72px] truncate text-xs text-[#FFEDAD]">
                    {user.nickname}
                  </span>
                </div>
                <DraggableTeamPlayer
                  user={team2x2.partner}
                  dragId={{ source: "partner" }}
                  onDragStart={setDragging}
                  onDragEnd={() => {
                    setDragging(null);
                    setDropTarget(null);
                  }}
                  isDragging={
                    dragging?.source === "partner" && dragging.index === undefined
                  }
                />
              </TeamDropZone>

              <TeamDropZone
                label="Time B"
                isOver={
                  isDropOver({ source: "teamB", index: 0 }) ||
                  isDropOver({ source: "teamB", index: 1 })
                }
                onDragOver={(event) => {
                  event.preventDefault();
                  setDropTarget({ source: "teamB", index: 0 });
                }}
                onDragLeave={() => setDropTarget(null)}
                onDrop={() => {
                  if (dragging?.source === "teamB") {
                    handleDrop(dragging);
                  } else {
                    handleDrop({ source: "teamB", index: 0 });
                  }
                }}
              >
                {team2x2.teamB.map((player, index) => (
                  <div
                    key={player.id}
                    onDragOver={(event) =>
                      handleDragOver(event, { source: "teamB", index })
                    }
                    onDrop={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      handleDrop({ source: "teamB", index });
                    }}
                  >
                    <DraggableTeamPlayer
                      user={player}
                      dragId={{ source: "teamB", index }}
                      onDragStart={setDragging}
                      onDragEnd={() => {
                        setDragging(null);
                        setDropTarget(null);
                      }}
                      isDragging={
                        dragging?.source === "teamB" && dragging.index === index
                      }
                    />
                  </div>
                ))}
              </TeamDropZone>
            </div>
          </>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedUsers.map((selected) => (
              <button
                key={selected.id}
                type="button"
                onClick={() => onRemoveUser(selected)}
                className="flex items-center gap-2 rounded-full border border-[#2AC054]/50 bg-[#2AC054]/10 py-1 pl-1 pr-2 transition-colors hover:bg-[#2AC054]/20"
              >
                <Avatar
                  avatarId={
                    selected.avatar_id
                      ? Number.parseInt(selected.avatar_id, 10)
                      : null
                  }
                  className="size-7 border border-[#FFEDAD]/60"
                />
                <span className="max-w-[88px] truncate text-xs text-[#FFEDAD]">
                  {selected.nickname}
                </span>
                <X className="size-3.5 shrink-0 text-[#FFEDAD]/70" />
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-2 pt-1">
          <button
            type="button"
            onClick={onContinue}
            className={`${gajrajOne.className} h-11 w-full rounded-md border border-[#2AC054] text-xl text-[#2AC054] transition-colors hover:bg-[#2AC054] hover:text-[#004C55]`}
          >
            Continuar
          </button>
          <button
            type="button"
            onClick={onClear}
            className="h-9 w-full rounded-md border border-white/25 text-xs tracking-[0.1em] text-white/70 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white"
          >
            Limpar escolhas
          </button>
        </div>
      </section>
    </div>
  );
}

function SelectPlayerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") ?? "1x1";
  const { user } = useCurrentUser({ redirectToLogin: true });
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [team2x2, setTeam2x2] = useState<Team2x2Layout | null>(null);
  const config = modeConfig[mode] ?? modeConfig["1x1"];
  const isComplete = selectedUsers.length === config.requiredOpponents;

  useEffect(() => {
    async function loadUsers() {
      try {
        setUsers(await api.users(search));
      } catch {
        setUsers([]);
      }
    }

    void loadUsers();
  }, [search]);

  useEffect(() => {
    if (!isComplete) {
      setShowConfirmModal(false);
      setTeam2x2(null);
      return;
    }

    setShowConfirmModal(true);

    if (mode === "2x2" && selectedUsers.length === 3) {
      setTeam2x2((current) => current ?? initTeam2x2Layout(selectedUsers));
    }
  }, [isComplete, mode, selectedUsers]);

  const availableUsers = useMemo(
    () => users.filter((item) => item.id !== user?.id),
    [users, user?.id],
  );

  const toggleSelectedUser = (selectedUser: User) => {
    if (showConfirmModal) return;

    setSelectedUsers((current) => {
      if (current.some((item) => item.id === selectedUser.id)) {
        return current.filter((item) => item.id !== selectedUser.id);
      }

      if (current.length >= config.requiredOpponents) {
        return current;
      }

      return [...current, selectedUser];
    });
  };

  const handleClearChoices = () => {
    setSelectedUsers([]);
    setTeam2x2(null);
    setShowConfirmModal(false);
  };

  const handleRemoveUser = (removedUser: User) => {
    setSelectedUsers((current) =>
      current.filter((item) => item.id !== removedUser.id),
    );
  };

  const handleContinue = () => {
    if (!isComplete) return;

    const opponentIds = getOrderedOpponentIds(mode, selectedUsers, team2x2);
    const opponentNames = getOrderedOpponentNames(mode, selectedUsers, team2x2);

    const params = new URLSearchParams({
      mode,
      opponentIds: opponentIds.join(","),
      opponents: opponentNames.join(", "),
    });

    router.push(`/jogar/moedas?${params.toString()}`);
  };

  return (
    <MatchShell exitButton={false}>
      <div className="mx-auto flex max-h-[calc(100vh-140px)] min-h-0 w-full max-w-[344px] flex-1 flex-col overflow-hidden">
        <MatchTitle title="Selecionar" className="shrink-0 px-0 text-center" />

        <section className="mt-4 shrink-0 space-y-3">
          <p className="text-center text-xs tracking-[0.12em] text-[#FFEDAD]/80">
            {config.label}
          </p>
          <label className="relative block">
            <span className="sr-only">Nome do jogador</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar jogador..."
              className="h-11 w-full rounded-md bg-white px-4 pr-11 text-sm tracking-[0.08em] text-black outline-none placeholder:text-black/35"
            />
            <Search className="absolute right-3 top-1/2 size-5 -translate-y-1/2 text-[#004C55]" />
          </label>
        </section>

        <section className="mt-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-white/15 bg-white/10 p-2.5">
          <div className="flex shrink-0 items-center justify-between gap-2">
            <h2
              className={`${gajrajOne.className} text-sm tracking-[0.08em] text-[#FFEDAD]`}
            >
              Amigos
            </h2>
            <span className="rounded-full bg-[#2AC054]/20 px-1.5 py-0.5 text-[10px] text-[#2AC054]">
              {availableUsers.length}
            </span>
          </div>
          <div className="mt-1.5 min-h-0 flex-1 overflow-y-auto pr-0.5">
            <div className="flex flex-col gap-0.5 pb-0.5">
              {availableUsers.map((friend) => (
                <button
                  key={friend.id}
                  type="button"
                  onClick={() => toggleSelectedUser(friend)}
                  disabled={showConfirmModal}
                  className="rounded-md text-left transition-colors hover:bg-white/10 disabled:pointer-events-none [&_.size-12]:size-8 [&_span]:text-xs"
                >
                  <PlayerPill
                    name={friend.nickname}
                    avatarId={
                      friend.avatar_id
                        ? Number.parseInt(friend.avatar_id, 10)
                        : null
                    }
                    status={
                      selectedUsers.some((item) => item.id === friend.id)
                        ? "OK"
                        : "+"
                    }
                  />
                </button>
              ))}
              {availableUsers.length === 0 ? (
                <p className="py-3 text-center text-xs text-white/70">
                  Nenhum jogador encontrado.
                </p>
              ) : null}
            </div>
          </div>
        </section>
      </div>

      {showConfirmModal && user ? (
        <SelectionConfirmModal
          mode={mode}
          user={user}
          selectedUsers={selectedUsers}
          team2x2={team2x2}
          requiredOpponents={config.requiredOpponents}
          onClear={handleClearChoices}
          onContinue={handleContinue}
          onRemoveUser={handleRemoveUser}
          onTeam2x2Change={setTeam2x2}
        />
      ) : null}
    </MatchShell>
  );
}

export default function SelectPlayerPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-white">Carregando...</div>}>
      <SelectPlayerContent />
    </Suspense>
  );
}
