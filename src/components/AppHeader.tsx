"use client";

import Avatar from "@/src/components/Avatar";
import { Settings } from "lucide-react";
import { useState } from "react";
import ConfigDrawer from "./ConfigDrawer";

type AppHeaderProps = {
  className?: string;
  score?: number;
  settingsIconClassName?: string;
};

export default function AppHeader({
  className = "",
  score = 150,
  settingsIconClassName = "h-7 w-7 sm:h-8 sm:w-8",
}: AppHeaderProps) {
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  return (
    <>
      <header
        className={`flex items-center justify-end gap-3 border-b border-[#FFEDAD] pb-2 -mx-4 mb-3 px-4 sm:-mx-5 sm:px-5 ${className}`.trim()}
      >
        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            className="flex items-center gap-2 rounded-full bg-[#FFD700] px-2.5 py-1.5 text-black sm:px-3"
            aria-label="Adicionar amigo"
          >
            <span className="text-lg font-bold leading-none">+</span>
            <Avatar className="h-6 w-6 sm:h-7 sm:w-7" />
          </button>

          <div className="flex items-center gap-2 rounded-full bg-black/40 px-2.5 py-1.5 text-white sm:px-3">
            <span className="font-semibold">{score}</span>
            <Avatar className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsConfigOpen(true)}
          className="shrink-0 text-white/90 transition hover:text-white"
          aria-label="Configurações"
        >
          <Settings className={settingsIconClassName} />
        </button>
      </header>

      <ConfigDrawer
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
      />
    </>
  );
}
