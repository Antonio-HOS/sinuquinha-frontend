import Avatar from "@/src/components/Avatar";
import { getButtonClassName } from "@/src/components/Button";
import { gajrajOne } from "@/src/fonts";
import { formatPrice } from "@/src/lib/api";
import Link from "next/link";

export type CoinPackage = {
  id: string;
  coins: number;
  bonus_coins: number;
  price_cents: number;
  currency: string;
};

type FabcoinModalProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function FabcoinModal({ title, subtitle, children }: FabcoinModalProps) {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-5 py-8">
      <section className="w-full max-w-[330px] rounded-2xl border border-[#FFD700] bg-[#004C55]/95 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur">
        <h1 className={`${gajrajOne.className} text-center text-[clamp(2rem,8vw,2.25rem)] text-[#FFD700]`}>
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-center text-sm tracking-[0.12em] text-[#FFEDAD]">
            {subtitle}
          </p>
        ) : null}
        {children}
      </section>
    </div>
  );
}

type CoinPackageCardProps = {
  pack: CoinPackage;
};

export function CoinPackageCard({ pack }: CoinPackageCardProps) {
  return (
    <Link
      href={`/moedas/comprar?packageId=${pack.id}`}
      className="flex items-center justify-between rounded-lg border border-white/20 bg-white/10 px-3 py-3 transition-colors hover:border-[#FFD700] hover:bg-[#FFD700]/10"
    >
      <div className="flex items-center gap-3">
        <Avatar className="size-10" />
        <div>
          <p className={`${gajrajOne.className} text-xl leading-none text-[#FFD700]`}>
            {pack.coins}
          </p>
          {pack.bonus_coins ? (
            <p className="text-xs text-[#2AC054]">+{pack.bonus_coins} bônus</p>
          ) : null}
        </div>
      </div>
      <span className={`${gajrajOne.className} text-sm text-[#FFEDAD]`}>
        {formatPrice(pack.price_cents, pack.currency)}
      </span>
    </Link>
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
