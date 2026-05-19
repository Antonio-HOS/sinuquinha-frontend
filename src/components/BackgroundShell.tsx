"use client";

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

  return (
    <div className="flex w-full items-center justify-center bg-[#004C55]">
      <div className="md:w-[340px] w-full">
      <div
        className="flex h-screen w-full flex-col bg-contain bg-center bg-no-repeat max-md:bg-[length:100%_auto] max-md:bg-top"
        style={{ backgroundImage }}
      >
        {children}
      </div>
      </div>
    </div>
  );
}
