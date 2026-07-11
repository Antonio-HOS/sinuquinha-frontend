"use client";

import AppHeader from "@/src/components/AppHeader";
import { Avatar } from "@/src/components/Avatar";
import BottomNav from "@/src/components/BottomNav";
import RankPoints from "@/src/components/RankPoints";
import type { Match, User, UserStats } from "@/src/lib/api";
import { api } from "@/src/lib/api";
import { gajrajOne } from "@/src/fonts";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import AvatarEditModal from "./AvatarEditModal";
import HistoryTab from "./HistoryTab";
import StatsTab from "./StatsTab";
import FriendsTab from "./FriendsTab";

type ProfileTab = "historico" | "estatisticas" | "amigos";

type ProfileViewProps = {
  user: User;
  stats: UserStats | null;
  matches: Match[];
  users: User[];
  isOwnProfile?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
  onUserUpdate?: (user: User) => void;
};

export default function ProfileView({
  user,
  stats,
  matches,
  users,
  isOwnProfile = false,
  showBackButton = false,
  onBack,
  onUserUpdate,
}: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("historico");
  const [copiado, setCopiado] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedAvatarId, setSelectedAvatarId] = useState<number | null>(
    user.avatar_id ? Number.parseInt(user.avatar_id, 10) : null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tabs: ProfileTab[] = isOwnProfile
    ? ["historico", "estatisticas", "amigos"]
    : ["historico", "estatisticas"];

  const handleCopiarId = () => {
    navigator.clipboard.writeText(user.id);
    setCopiado(true);
    setTimeout(() => {
      setCopiado(false);
    }, 2000);
  };

  const currentAvatarId = editMode
    ? selectedAvatarId
    : user.avatar_id
      ? Number.parseInt(user.avatar_id, 10)
      : null;

  const handleSaveAvatar = async () => {
    if (!selectedAvatarId || !onUserUpdate) return;

    setIsSaving(true);
    setError(null);

    try {
      const updatedUser = await api.updateMe({ avatarId: String(selectedAvatarId) });
      onUserUpdate(updatedUser);
      setEditMode(false);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Não foi possível salvar o avatar.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setSelectedAvatarId(user.avatar_id ? Number.parseInt(user.avatar_id, 10) : null);
    setError(null);
  };

  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden px-4 pb-4 pt-3 sm:px-5">
      {showBackButton ? (
        <button
          type="button"
          onClick={onBack}
          className="absolute left-4 top-3 z-20 flex size-9 items-center justify-center rounded-full border border-[#FFD700]/50 bg-black/40 text-[#FFD700] transition-colors hover:bg-[#FFD700] hover:text-black sm:left-5"
          aria-label="Voltar"
        >
          <ChevronLeft className="size-5" />
        </button>
      ) : null}

      <AppHeader />

      <div className="mt-6 flex flex-col">
        <h1
          className={`${gajrajOne.className} text-[clamp(2rem,8vw,2rem)] uppercase leading-none tracking-wider text-white`}
        >
          {user.nickname}
        </h1>
        {isOwnProfile ? (
          <button
            type="button"
            onClick={handleCopiarId}
            className={`${gajrajOne.className} no-select mt-1 flex w-max cursor-pointer items-center gap-1 text-sm text-white/40 transition-colors duration-300 hover:text-white`}
            title="Copiar ID"
          >
            {copiado ? (
              <>Copiado! ✅</>
            ) : (
              <>
                {user.id.slice(0, 10)}...{user.id.slice(-4)}{" "}
                <span className="text-xs">📋</span>
              </>
            )}
          </button>
        ) : null}
      </div>

      <div className="mb-3 flex w-full items-center justify-between px-2">
        <div className="flex w-24 flex-col items-center">
          <span className={`${gajrajOne.className} text-2xl text-white`}>{stats?.wins ?? 0}</span>
          <span className={`${gajrajOne.className} mt-1 text-[10px] uppercase text-white sm:text-xs`}>
            Vitorias
          </span>
        </div>

        <div className="flex items-center justify-center">
          {isOwnProfile ? (
            <button
              type="button"
              onClick={() => setEditMode(true)}
              className="cursor-pointer transition-transform duration-300 hover:scale-105"
              aria-label="Alterar avatar"
            >
              <Avatar avatarId={currentAvatarId} size="xl" objectFit="contain" />
            </button>
          ) : (
            <Avatar avatarId={currentAvatarId} size="xl" objectFit="contain" />
          )}
        </div>

        <div className="flex w-24 flex-col items-center">
          <RankPoints
            value={user.rank_points ?? 0}
            className={`${gajrajOne.className} text-2xl text-white`}
            starClassName="size-5"
          />
          <span className={`${gajrajOne.className} mt-1 text-[10px] uppercase text-white sm:text-xs`}>
            RANK
          </span>
        </div>
      </div>

      {!isOwnProfile ? (
        <div className="mb-10 flex justify-center">
          <Link
            href={`/jogar/moedas?opponentId=${user.id}&opponent=${encodeURIComponent(user.nickname)}`}
            className={`${gajrajOne.className} rounded-lg bg-[#FFD700] px-6 py-2 text-sm text-black transition-all hover:bg-yellow-400`}
          >
            Desafiar
          </Link>
        </div>
      ) : null}

      {editMode ? (
        <AvatarEditModal
          selectedAvatarId={selectedAvatarId}
          isSaving={isSaving}
          error={error}
          onChange={setSelectedAvatarId}
          onSave={() => void handleSaveAvatar()}
          onClose={handleCancelEdit}
        />
      ) : null}

      <div className="relative -mt-5 mb-4 flex w-full justify-between border-b-2 border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`${gajrajOne.className} relative flex-1 pb-2 text-center text-[13px] capitalize sm:text-sm ${
              activeTab === tab ? "text-[#FFD700]" : "text-white"
            }`}
          >
            {tab}
            {activeTab === tab ? (
              <div className="absolute bottom-[-2px] left-1/2 h-[2px] w-full -translate-x-1/2 bg-[#FFD700]" />
            ) : null}
          </button>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        {activeTab === "historico" ? (
          <HistoryTab matches={matches} users={users} currentUserId={user.id} />
        ) : null}
        {activeTab === "estatisticas" ? (
          <StatsTab stats={stats} user={user} />
        ) : null}
        {activeTab === "amigos" && isOwnProfile ? (
          <FriendsTab users={users} currentUserId={user.id} />
        ) : null}
      </div>

      {isOwnProfile ? <BottomNav active="profile" /> : null}
    </div>
  );
}
