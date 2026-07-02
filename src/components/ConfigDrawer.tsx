"use client";

import { ArrowLeft, LogOut } from "lucide-react";
import { gajrajOne } from "@/src/fonts";
import { useCurrentUser, USER_UPDATED_EVENT } from "@/src/hooks/useCurrentUser";
import { api, clearAccessToken } from "@/src/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getButtonClassName } from "./Button";

type ConfigDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ConfigDrawer({ isOpen, onClose }: ConfigDrawerProps) {
  const router = useRouter();
  const { user, setUser } = useCurrentUser();
  const [isNicknameFormOpen, setIsNicknameFormOpen] = useState(false);
  const [nickname, setNickname] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [isSavingNickname, setIsSavingNickname] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsNicknameFormOpen(false);
      setNicknameError("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (isNicknameFormOpen && user) {
      setNickname(user.nickname);
      setNicknameError("");
    }
  }, [isNicknameFormOpen, user]);

  const handleLogout = () => {
    clearAccessToken();
    onClose();
    router.replace("/login");
  };

  const handleOpenNicknameForm = () => {
    setIsNicknameFormOpen(true);
  };

  const handleCancelNicknameForm = () => {
    setIsNicknameFormOpen(false);
    setNicknameError("");
  };

  const handleSaveNickname = async () => {
    const trimmedNickname = nickname.trim();

    if (trimmedNickname.length < 2) {
      setNicknameError("Apelido deve ter pelo menos 2 caracteres.");
      return;
    }

    if (trimmedNickname === user?.nickname) {
      setIsNicknameFormOpen(false);
      return;
    }

    setIsSavingNickname(true);
    setNicknameError("");

    try {
      const updatedUser = await api.updateMe({ nickname: trimmedNickname });
      setUser(updatedUser);
      window.dispatchEvent(
        new CustomEvent(USER_UPDATED_EVENT, { detail: updatedUser }),
      );
      setIsNicknameFormOpen(false);
    } catch (err) {
      setNicknameError(
        err instanceof Error ? err.message : "Não foi possível atualizar o apelido.",
      );
    } finally {
      setIsSavingNickname(false);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 z-50 h-full w-[65%] max-w-[300px] bg-[#1a1a1a] shadow-[-10px_0_30px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-in-out flex flex-col p-6 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button 
          onClick={onClose} 
          className="text-white mb-10 w-fit hover:text-white/70 transition-colors"
          aria-label="Fechar configurações"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleOpenNicknameForm}
              className={`${gajrajOne.className} text-white text-lg text-left hover:text-[#FFD700] transition-colors`}
            >
              Mudar Apelido
            </button>

            {isNicknameFormOpen ? (
              <form
                className="flex flex-col gap-3 rounded-lg border border-white/10 bg-white/5 p-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  void handleSaveNickname();
                }}
              >
                <label className="flex flex-col gap-2">
                  <span className={`${gajrajOne.className} text-sm text-[#FFEDAD]`}>
                    Novo apelido
                  </span>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(event) => setNickname(event.target.value)}
                    placeholder="Seu apelido"
                    maxLength={40}
                    autoFocus
                    className="h-10 rounded-md bg-white px-3 text-sm text-black outline-none placeholder:text-black/35"
                  />
                </label>

                {nicknameError ? (
                  <p className="text-sm text-red-400">{nicknameError}</p>
                ) : null}

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSavingNickname}
                    className={getButtonClassName({
                      variant: "success",
                      size: "sm",
                      className: "flex-1 disabled:opacity-50",
                    })}
                  >
                    {isSavingNickname ? "Salvando..." : "Salvar"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelNicknameForm}
                    disabled={isSavingNickname}
                    className={getButtonClassName({
                      variant: "ghost",
                      size: "sm",
                      className: "flex-1 disabled:opacity-50",
                    })}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : null}
          </div>

          <button 
            type="button"
            onClick={handleLogout}
            className={`${gajrajOne.className} text-[#FF0000] text-lg flex items-center gap-2 hover:text-red-400 transition-colors w-fit`}
          >
            <LogOut className="w-5 h-5 rotate-180" />
            Sair
          </button>
        </div>
      </div>
    </>
  );
}