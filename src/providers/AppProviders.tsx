"use client";

import { SocketProvider } from "@/src/providers/SocketProvider";
import type { ReactNode } from "react";

export default function AppProviders({ children }: { children: ReactNode }) {
  return <SocketProvider>{children}</SocketProvider>;
}
