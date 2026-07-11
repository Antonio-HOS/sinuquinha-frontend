import Avatar from "@/src/components/Avatar";
import { getButtonClassName } from "@/src/components/Button";
import { gajrajOne } from "@/src/fonts";
import { formatPrice } from "@/src/lib/api";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type CoinPackage = {
  id: string;
  coins: number;
  bonus_coins: number;
  price_cents: number;
  currency: string;
};

type FabcoinModalAccent = "gold" | "green" | "pix";

type FabcoinModalProps = {
  title: string;
  subtitle?: string;
  accent?: FabcoinModalAccent;
  showCoins?: boolean;
  children: React.ReactNode;
};

const accentTitleClass: Record<FabcoinModalAccent, string> = {
  gold: "text-[#FFC400]",
  green: "text-[#2AC054]",
  pix: "text-[#00BDAE]",
};

export function FabcoinModal({
  title,
  subtitle,
  accent = "gold",
  showCoins = true,
  children,
}: FabcoinModalProps) {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-5 py-8">
      <section className="relative w-full max-w-[340px] pt-[72px]">
        {showCoins ? (
          <div className="pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2" aria-hidden>
            <Image
              src="/monteMoedas.svg"
              alt=""
              width={158}
              height={126}
              priority
              className="h-auto w-[132px] drop-shadow-[0_8px_18px_rgba(0,0,0,0.35)]"
            />
          </div>
        ) : null}

        <div className="relative z-10 rounded-[14px] border-2 border-[#FFC400] bg-[#004C55]/95 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-sm">
          <div
            className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-[#FFD700]/60 to-transparent"
            aria-hidden
          />

          <h1
            className={`${gajrajOne.className} text-center text-[clamp(1.9rem,8vw,2.35rem)] leading-none tracking-[0.04em] ${accentTitleClass[accent]}`}
          >
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 text-center text-sm tracking-[0.1em] text-[#FFEDAD]/90">
              {subtitle}
            </p>
          ) : null}
          {children}
        </div>
      </section>
    </div>
  );
}

type CoinPackageCardProps = {
  pack: CoinPackage;
  selected?: boolean;
};

export function CoinPackageCard({ pack, selected = false }: CoinPackageCardProps) {
  return (
    <div
      className={`relative flex items-center justify-between rounded-xl border px-3.5 py-3.5 transition-all duration-200 ${
        selected
          ? "border-[#FFC400] bg-[#FFC400]/15 shadow-[0_0_0_1px_rgba(255,196,0,0.35),0_8px_24px_rgba(255,196,0,0.12)]"
          : "border-white/20 bg-white/8 hover:border-[#FFD700]/50 hover:bg-white/12"
      }`}
    >
      {selected ? (
        <span className="absolute -right-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full bg-[#FFC400] text-[#004C55] shadow-md">
          <Check className="size-3.5 stroke-[3]" aria-hidden />
        </span>
      ) : null}

      <div className="flex items-center gap-3">
        <div
          className={`rounded-full p-0.5 transition-colors ${
            selected ? "bg-[#FFC400]/30" : "bg-white/10"
          }`}
        >
          <Avatar className="size-10" />
        </div>
        <div className="text-left">
          <p className={`${gajrajOne.className} text-xl leading-none text-[#FFD700]`}>
            {pack.coins}
          </p>
            <p className="ml-1 text-xs tracking-wider text-[#FFEDAD]/80">moedas</p>
          {pack.bonus_coins ? (
            <p className="mt-1 text-xs font-semibold text-[#2AC054]">+{pack.bonus_coins} bônus</p>
          ) : null}
        </div>
      </div>
      <span
        className={`${gajrajOne.className} rounded-lg px-2.5 py-1 text-sm ${
          selected ? "bg-[#FFC400] text-[#004C55]" : "text-[#FFEDAD]"
        }`}
      >
        {formatPrice(pack.price_cents, pack.currency)}
      </span>
    </div>
  );
}

type CoinAmountInputProps = {
  placeholder?: string;
};

export function CoinAmountInput({ placeholder = "Digite o valor" }: CoinAmountInputProps) {
  return (
    <label className="flex h-12 items-center gap-3 rounded-md bg-white px-3">
      <Avatar className="size-9" />
      <span className="sr-only">{placeholder}</span>
      <input
        type="number"
        placeholder={placeholder}
        className={`${gajrajOne.className} min-w-0 flex-1 bg-transparent text-xl text-black outline-none placeholder:text-black/25`}
      />
    </label>
  );
}

type ModalActionsProps = {
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function ModalActions({
  primaryHref,
  primaryLabel,
  secondaryHref = "/home",
  secondaryLabel = "Fechar",
}: ModalActionsProps) {
  return (
    <div className="mt-5 grid grid-cols-2 gap-3">
      <Link
        href={secondaryHref}
        className={getButtonClassName({ variant: "outline", className: "w-full" })}
      >
        {secondaryLabel}
      </Link>
      <Link
        href={primaryHref}
        className={getButtonClassName({ variant: "primary", className: "w-full" })}
      >
        {primaryLabel}
      </Link>
    </div>
  );
}
