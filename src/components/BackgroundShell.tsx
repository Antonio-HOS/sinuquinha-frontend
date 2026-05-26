"use client";

import type { CSSProperties } from "react";
import { usePathname } from "next/navigation";

const AUTH_PATHS = ["/", "/login", "/cadastrar"];

type BackgroundShellProps = {
  children: React.ReactNode;
};

export default function BackgroundShell({ children }: BackgroundShellProps) {
  const pathname = usePathname();
  const isAuthScreen = AUTH_PATHS.includes(pathname);
  const backgroundImage = isAuthScreen
    ? "url('/sinuca.svg')"
    : "url('/home.svg')";
  const shellStyle = {
    "--shell-mobile-min-height": "max(100svh, calc(100vw * 874 / 402))",
    "--shell-desktop-width": "calc(100svh * 402 / 874)",
  } as CSSProperties;

  return (
    <div className="flex min-h-svh w-full items-start justify-center bg-[#004C55] px-0 md:items-stretch md:px-0 md:py-0">
      <div
        className="flex min-h-(--shell-mobile-min-height) w-full flex-col overflow-hidden bg-[#00525B] md:h-svh md:min-h-0 md:w-(--shell-desktop-width) md:rounded-[32px] md:border md:border-[#FFEDAD]/60 md:shadow-[0_24px_70px_rgba(0,0,0,0.4)]"
        style={shellStyle}
      >
        <div
          className="flex min-h-full flex-1 flex-col bg-top bg-no-repeat bg-size-[100%_auto]"
          style={{ backgroundImage }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
