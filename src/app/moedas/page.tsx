"use client";

import { gajrajOne } from "@/src/fonts";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { api } from "@/src/lib/api";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const FREE_COINS_AMOUNT = 45;
const FREE_COINS_INTERVAL_MS = 12 * 60 * 60 * 1000;

function getFreeCoinsRemainingMs(lastFreeCoinsAt: string | null | undefined, now: number) {
  if (!lastFreeCoinsAt) return 0;

  const lastCollectedAt = new Date(lastFreeCoinsAt).getTime();

  if (Number.isNaN(lastCollectedAt)) return 0;

  return Math.max(0, lastCollectedAt + FREE_COINS_INTERVAL_MS - now);
}

function formatRemainingTime(milliseconds: number) {
  const totalSeconds = Math.ceil(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

type DailyCoinsModalProps = {
  canCollect: boolean;
  isCollecting: boolean;
  remainingTime: string;
  error: string;
  onCollect: () => void;
  onClose: () => void;
  buyHref: string;
};

function DailyCoinsModal({
  canCollect,
  isCollecting,
  remainingTime,
  error,
  onCollect,
  onClose,
  buyHref,
}: DailyCoinsModalProps) {
  return (
    <main
      className="flex min-h-full flex-1 cursor-pointer items-center justify-center bg-[#1f1f1f] px-5 py-10"
      onClick={onClose}
      aria-label="Fechar modal de moedas diárias"
    >
      <section
        className={`relative w-full max-w-[330px] cursor-default ${
          canCollect ? "pt-[96px]" : "pt-[76px]"
        }`}
        aria-label="Moedas diárias"
        onClick={(event) => event.stopPropagation()}
      >
        {canCollect ? (
          <Image
            src="/raios.png"
            alt=""
            width={520}
            height={520}
            priority
            className="pointer-events-none absolute left-1/2 top-0 z-0 w-[124%] max-w-none -translate-x-1/2 translate-y-[-18%] opacity-80"
          />
        ) : null}

        <div
          className={`absolute left-1/2 z-20 -translate-x-1/2 ${
            canCollect ? "top-6 h-[104px] w-[212px]" : "top-0 h-[106px] w-[126px]"
          }`}
          aria-hidden
        >
          {canCollect ? (
            <Image
              src="/monteMoedas.svg"
              alt=""
              width={158}
              height={126}
              priority
              className="absolute bottom-0 left-0 z-20 h-auto w-[132px]"
            />
          ) : null}
          <Image
            src="/presente.png"
            alt=""
            width={154}
            height={130}
            priority
            className={`absolute bottom-0 z-10 h-auto ${
              canCollect ? "right-0 w-[126px]" : "left-1/2 w-[126px] -translate-x-1/2"
            }`}
          />
        </div>

        <div className="relative z-10 rounded-[10px] border-2 border-[#FFC400] bg-white px-5 pb-8 pt-[58px] text-center shadow-[0_10px_22px_rgba(0,0,0,0.28)]">
          <h1
            className={`${gajrajOne.className} text-[clamp(1.8rem,8vw,2.45rem)] leading-none tracking-[0.03em] text-[#FFC400]`}
          >
            Moedas Diárias
          </h1>

          <div className="mt-7 flex items-center justify-center gap-2.5">
            <p className="whitespace-nowrap font-sans text-2xl font-black leading-none tracking-[-0.04em] text-black">
              +{FREE_COINS_AMOUNT} FABCOINS
            </p>
            <Image
              src="/monteMoedas.svg"
              alt=""
              width={78}
              height={58}
              className="h-auto w-[58px] shrink-0 -m-3"
            />
          </div>

          {canCollect ? (
            <button
              type="button"
              disabled={isCollecting}
              onClick={onCollect}
              className={`${gajrajOne.className} mx-auto mt-8 flex h-[46px] w-full max-w-[222px] items-center justify-center rounded-[9px] border-2 border-[#8B6A00] bg-[#FFC400] text-[1.05rem] leading-none tracking-[0.26em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] transition active:scale-[0.98] disabled:cursor-wait disabled:opacity-75`}
            >
              {isCollecting ? "..." : "COLETAR +"}
            </button>
          ) : (
            <div
              className={`${gajrajOne.className} mx-auto mt-8 flex h-[46px] w-full max-w-[222px] items-center justify-center rounded-[8px] border border-[#FFC400] bg-[#FFE58A] text-[1.18rem] leading-none tracking-[0.12em] text-[#7B6A36]`}
            >
              {remainingTime}
            </div>
          )}

          {error ? (
            <p className="mx-auto mt-4 max-w-[270px] text-sm font-semibold text-red-600">
              {error}
            </p>
          ) : null}

          <Link
            href={buyHref}
            className={`${gajrajOne.className} mx-auto mt-4 flex h-[46px] w-full max-w-[222px] items-center justify-center rounded-[9px] border-2 border-[#004C55] bg-[#004C55] text-[0.95rem] leading-none tracking-[0.18em] text-[#FFC400] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition hover:bg-[#003840] active:scale-[0.98]`}
          >
            COMPRAR MOEDAS
          </Link>
        </div>
      </section>
    </main>
  );
}

function DailyCoinsMessage({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-[#1f1f1f] px-5 py-10">
      <section className="w-full max-w-[330px] rounded-[10px] border-2 border-[#FFC400] bg-white px-6 py-10 text-center">
        <h1 className={`${gajrajOne.className} text-4xl leading-none text-[#FFC400]`}>
          Moedas Diárias
        </h1>
        <p className="mt-6 text-sm font-semibold text-black/70">{children}</p>
      </section>
    </main>
  );
}

export default function FabcoinsPage() {
  const router = useRouter();
  const { user, setUser, isLoading } = useCurrentUser({ redirectToLogin: true });
  const [now, setNow] = useState(() => Date.now());
  const [isCollecting, setIsCollecting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);

    return () => window.clearInterval(interval);
  }, []);

  const remainingMs = getFreeCoinsRemainingMs(user?.last_free_coins_at, now);
  const canCollect = Boolean(user) && !isLoading && remainingMs === 0;
  const showCooldown = Boolean(user) && !isLoading && !canCollect;

  const handleCollect = async () => {
    try {
      setIsCollecting(true);
      setError("");
      const updatedUser = await api.freeCoins();
      setUser(updatedUser);
      setNow(Date.now());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível coletar suas moedas agora.",
      );
    } finally {
      setIsCollecting(false);
    }
  };

  const handleClose = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/home");
  };

  if (isLoading) {
    return <DailyCoinsMessage>Carregando suas moedas grátis...</DailyCoinsMessage>;
  }

  if (!user) {
    return (
      <DailyCoinsMessage>
        Entre na sua conta para coletar moedas grátis.
      </DailyCoinsMessage>
    );
  }

  return (
    <DailyCoinsModal
      canCollect={!showCooldown}
      isCollecting={isCollecting}
      remainingTime={formatRemainingTime(remainingMs)}
      error={error}
      onCollect={handleCollect}
      onClose={handleClose}
      buyHref="/moedas/comprar"
    />
  );
}
