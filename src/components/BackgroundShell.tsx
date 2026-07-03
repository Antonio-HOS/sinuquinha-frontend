"use client";

import type { CSSProperties } from "react";
import { usePathname } from "next/navigation";

const HOME_BACKGROUND_PATHS = ["/", "/login", "/cadastrar", "/home", "/jogar"];

type BackgroundShellProps = {
  children: React.ReactNode;
};

export default function BackgroundShell({ children }: BackgroundShellProps) {
  const pathname = usePathname();
  const backgroundImage = HOME_BACKGROUND_PATHS.includes(pathname)
    ? "url('/HOME.svg')"
    : "url('/BgProfile.svg')";

  const shellStyle = {
    "--shell-desktop-width": "calc(100svh * 402 / 874)",
  } as CSSProperties;

  return (
    <div className="flex h-svh w-full items-stretch justify-center overflow-hidden bg-[#004C55]">
      <div
        className="relative flex h-full w-full flex-col overflow-hidden bg-[#00525B] md:h-svh md:w-(--shell-desktop-width) md:rounded-[32px] md:border md:border-[#FFEDAD]/60 md:shadow-[0_24px_70px_rgba(0,0,0,0.4)]"
        style={shellStyle}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-top bg-no-repeat bg-size-[100%_100%]"
          style={{ backgroundImage }}
        />
        <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
