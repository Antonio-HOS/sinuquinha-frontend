"use client";

import {
  MatchShell,
  MatchTitle,
  PlayerPill,
} from "@/src/app/jogar/components/MatchFlow";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { api, type User } from "@/src/lib/api";
import { gajrajOne } from "@/src/fonts";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

const modeConfig: Record<string, { label: string; requiredOpponents: number }> = {
  "1x1": { label: "Selecione 1 adversário", requiredOpponents: 1 },
  "2x2": { label: "Selecione 3 jogadores para formar as equipes", requiredOpponents: 3 },
  "Todos Contra (3)": { label: "Selecione 2 adversários", requiredOpponents: 2 },
  "Todos Contra": { label: "Selecione 2 adversários", requiredOpponents: 2 },
};

function SelectPlayerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") ?? "1x1";
  const { user } = useCurrentUser({ redirectToLogin: true });
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const config = modeConfig[mode] ?? modeConfig["1x1"];

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

  const availableUsers = useMemo(
    () => users.filter((item) => item.id !== user?.id),
    [users, user?.id],
  );

  const toggleSelectedUser = (selectedUser: User) => {
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

  const handleContinue = () => {
    if (selectedUsers.length !== config.requiredOpponents) return;

    const params = new URLSearchParams({
      mode,
      opponentIds: selectedUsers.map((item) => item.id).join(","),
      opponents: selectedUsers.map((item) => item.nickname).join(", "),
    });

    router.push(`/jogar/moedas?${params.toString()}`);
  };

  return (
    <MatchShell exitButton={false}>
      <div className="scrollbar-visible mx-auto flex max-h-[calc(100vh-180px)] min-h-0 w-full max-w-[344px] flex-1 flex-col pr-2">
        <MatchTitle
          title="Selecionar"
          subtitle="Jogador"
          className="px-0 text-center"
        />

        <section className="mt-6 rounded-xl border border-white/15 bg-white/10 p-4">
          <p className="mb-3 text-center text-sm tracking-[0.12em] text-[#FFEDAD]/90">
            {config.label}
          </p>
          <label className="relative block">
            <span className="sr-only">Nome do jogador</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Nome do jogador"
              className="h-11 w-full rounded-md bg-white px-4 pr-11 text-sm tracking-[0.08em] text-black outline-none placeholder:text-black/35"
            />
            <Search className="absolute right-3 top-1/2 size-5 -translate-y-1/2 text-[#004C55]" />
          </label>
        </section>

        <section className="mt-6 rounded-xl border border-white/15 bg-white/10 p-4 pb-5">
          <div className="flex items-center justify-between">
            <h2
              className={`${gajrajOne.className} text-xl tracking-[0.08em] text-[#FFEDAD]`}
            >
              Amigos
            </h2>
            <span className="rounded-full bg-[#2AC054]/20 px-2 py-1 text-xs text-[#2AC054]">
              {availableUsers.length} disponíveis
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {availableUsers.map((friend) => (
              <button
                key={friend.id}
                type="button"
                onClick={() => toggleSelectedUser(friend)}
                className="rounded-lg text-left transition-colors hover:bg-white/10"
              >
                <PlayerPill
                  name={friend.nickname}
                  status={
                    selectedUsers.some((item) => item.id === friend.id)
                      ? "OK"
                      : "+"
                  }
                />
              </button>
            ))}
            {availableUsers.length === 0 ? (
              <p className="text-center text-sm text-white/70">
                Nenhum jogador encontrado.
              </p>
            ) : null}
          </div>
        </section>

        <section className="mt-4 rounded-xl border border-[#FFD700]/30 bg-black/15 p-3 text-center">
          <p className="text-sm tracking-[0.12em] text-[#FFEDAD]">
            Selecionados: {selectedUsers.length}/{config.requiredOpponents}
          </p>
          {mode === "2x2" && user ? (
            <p className="mt-2 text-xs text-white/70">
              Time A: você e {selectedUsers[0]?.nickname ?? "..."} | Time B:{" "}
              {selectedUsers[1]?.nickname ?? "..."} e {selectedUsers[2]?.nickname ?? "..."}
            </p>
          ) : null}
          <button
            type="button"
            onClick={handleContinue}
            disabled={selectedUsers.length !== config.requiredOpponents}
            className={`${gajrajOne.className} mt-3 h-11 rounded-md border border-[#2AC054] px-6 text-xl text-[#2AC054] transition-colors hover:bg-[#2AC054] hover:text-[#004C55] disabled:opacity-50`}
          >
            Continuar
          </button>
        </section>
      </div>
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
