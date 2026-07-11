"use client";

import {
  CoinPackageCard,
  FabcoinModal,
} from "../components/FabcoinComponents";
import { getButtonClassName } from "@/src/components/Button";
import { gajrajOne } from "@/src/fonts";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { api, formatPrice, type CoinPackage, type Purchase } from "@/src/lib/api";
import { ArrowLeft, Check, Copy, Loader2, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

type Step = "select" | "cpf" | "pay" | "success";

const CHECKOUT_STEPS: { id: Exclude<Step, "success">; label: string }[] = [
  { id: "select", label: "Pacote" },
  { id: "cpf", label: "CPF" },
  { id: "pay", label: "Pagamento" },
];

function formatExpiresAt(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatCpf(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function PackageSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-white/10 bg-white/5 px-3.5 py-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-white/15" />
          <div className="space-y-2">
            <div className="h-5 w-16 rounded bg-white/15" />
            <div className="h-3 w-12 rounded bg-white/10" />
          </div>
        </div>
        <div className="h-7 w-16 rounded-lg bg-white/15" />
      </div>
    </div>
  );
}

function WaitingDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-hidden>
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className="size-1.5 animate-bounce rounded-full bg-[#00BDAE]"
          style={{ animationDelay: `${index * 150}ms` }}
        />
      ))}
    </span>
  );
}

function StepIndicator({ currentStep }: { currentStep: Exclude<Step, "success"> }) {
  const currentIndex = CHECKOUT_STEPS.findIndex((item) => item.id === currentStep);

  return (
    <nav aria-label="Etapas da compra" className="mt-5">
      <ol className="flex items-center justify-between gap-1">
        {CHECKOUT_STEPS.map((item, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = item.id === currentStep;

          return (
            <li key={item.id} className="flex min-w-0 flex-1 items-center">
              <div className="flex w-full flex-col items-center gap-1.5">
                <div
                  className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors ${
                    isComplete
                      ? "border-[#2AC054] bg-[#2AC054] text-[#004C55]"
                      : isCurrent
                        ? "border-[#FFC400] bg-[#FFC400] text-[#004C55]"
                        : "border-white/25 bg-white/5 text-white/40"
                  }`}
                >
                  {isComplete ? <Check className="size-3.5 stroke-[3]" aria-hidden /> : index + 1}
                </div>
                <span
                  className={`text-[10px] font-medium uppercase tracking-wider ${
                    isCurrent ? "text-[#FFEDAD]" : isComplete ? "text-white/60" : "text-white/35"
                  }`}
                >
                  {item.label}
                </span>
              </div>

              {index < CHECKOUT_STEPS.length - 1 ? (
                <div
                  className={`mx-1 mb-5 h-px min-w-3 flex-1 ${
                    index < currentIndex ? "bg-[#2AC054]/70" : "bg-white/15"
                  }`}
                  aria-hidden
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function SelectedPackageSummary({ pack }: { pack: CoinPackage }) {
  const totalCoins = pack.coins + (pack.bonus_coins ?? 0);

  return (
    <div className="rounded-xl border border-[#FFC400]/30 bg-[#FFC400]/10 px-3.5 py-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-[#FFEDAD]/70">
            Pacote selecionado
          </p>
          <p className={`${gajrajOne.className} mt-0.5 text-lg leading-none text-[#FFD700]`}>
            {pack.coins} moedas
            {pack.bonus_coins ? (
              <span className="ml-1 text-sm text-[#2AC054]">+{pack.bonus_coins}</span>
            ) : null}
          </p>
          {pack.bonus_coins ? (
            <p className="mt-1 text-xs text-white/55">{totalCoins} moedas no total</p>
          ) : null}
        </div>
        <p className={`${gajrajOne.className} shrink-0 text-lg text-[#FFC400]`}>
          {formatPrice(pack.price_cents, pack.currency)}
        </p>
      </div>
    </div>
  );
}

function BuyFabcoinsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPackageId = searchParams.get("packageId");
  const { setUser } = useCurrentUser({ redirectToLogin: true });
  const [coinPackages, setCoinPackages] = useState<CoinPackage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [step, setStep] = useState<Step>("select");
  const [isLoading, setIsLoading] = useState(true);
  const [isBuying, setIsBuying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [taxId, setTaxId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPackages() {
      try {
        const packages = await api.coinPackages();
        setCoinPackages(packages);
        setSelectedId(
          selectedPackageId && packages.some((pack) => pack.id === selectedPackageId)
            ? selectedPackageId
            : (packages[0]?.id ?? null),
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Não foi possível carregar pacotes.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadPackages();
  }, [selectedPackageId]);

  const selectedPackage = useMemo(
    () => coinPackages.find((pack) => pack.id === selectedId) ?? null,
    [coinPackages, selectedId],
  );

  const normalizedTaxId = taxId.replace(/\D/g, "");
  const isCpfValid = normalizedTaxId.length === 11;

  useEffect(() => {
    if (step !== "pay" || !purchase?.id) return;

    const interval = window.setInterval(async () => {
      try {
        const updated = await api.getPurchase(purchase.id);
        setPurchase(updated);

        if (updated.status === "paid") {
          setStep("success");
          const user = await api.me();
          setUser(user);
        }
      } catch {
        // Mantém polling silencioso até o pagamento ou expiração.
      }
    }, 4000);

    return () => window.clearInterval(interval);
  }, [purchase?.id, setUser, step]);

  const handleStartPayment = async () => {
    if (!selectedPackage) return;

    if (!isCpfValid) {
      setError("Informe um CPF válido com 11 dígitos.");
      setStep("cpf");
      return;
    }

    try {
      setIsBuying(true);
      setError("");
      const created = await api.createPurchase(selectedPackage.id, normalizedTaxId);
      setPurchase(created);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Compra não iniciada.");
    } finally {
      setIsBuying(false);
    }
  };

  const handleCopyPix = async () => {
    const pixCode = purchase?.payment?.qrCodeText;
    if (!pixCode) return;

    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Não foi possível copiar o código PIX.");
    }
  };

  const handleBack = () => {
    setError("");

    if (step === "cpf") {
      setStep("select");
      return;
    }

    if (step === "pay") {
      setPurchase(null);
      setStep("cpf");
    }
  };

  const modalMeta = useMemo(() => {
    switch (step) {
      case "select":
        return { title: "Comprar", subtitle: "Escolha o pacote de moedas", accent: "gold" as const };
      case "cpf":
        return { title: "Seus dados", subtitle: "Informe o CPF do pagador", accent: "gold" as const };
      case "pay":
        return purchase?.payment
          ? { title: "PIX", subtitle: "Escaneie ou copie o código", accent: "pix" as const }
          : { title: "Confirmar", subtitle: "Revise e finalize a compra", accent: "gold" as const };
      default:
        return { title: "Comprar", subtitle: "", accent: "gold" as const };
    }
  }, [purchase?.payment, step]);

  if (step === "success") {
    return (
      <FabcoinModal
        title="Pago!"
        subtitle="Suas moedas já estão na conta"
        accent="green"
        showCoins={false}
      >
        <div className="relative mt-6 overflow-hidden rounded-xl border border-[#2AC054]/40 bg-[#2AC054]/10 px-4 py-5 text-center">
          <Image
            src="/raios.png"
            alt=""
            width={320}
            height={320}
            className="pointer-events-none absolute left-1/2 top-1/2 w-[140%] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-30"
            aria-hidden
          />

          <div className="relative z-10">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full border-2 border-[#2AC054] bg-[#2AC054]/20">
              <Check className="size-7 text-[#2AC054] stroke-[2.5]" aria-hidden />
            </div>

            <p className={`${gajrajOne.className} mt-4 text-3xl leading-none text-[#FFD700]`}>
              +{purchase?.coins ?? 0}
            </p>
            <p className="mt-1 text-sm tracking-[0.08em] text-[#FFEDAD]/90">Fabcoins creditadas</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Link
            href="/home"
            className={getButtonClassName({ variant: "outline", className: "w-full" })}
          >
            Voltar
          </Link>
          <button
            type="button"
            onClick={() => router.push("/home")}
            className={getButtonClassName({ variant: "success", className: "w-full" })}
          >
            Jogar
          </button>
        </div>
      </FabcoinModal>
    );
  }

  return (
    <FabcoinModal
      title={modalMeta.title}
      subtitle={modalMeta.subtitle}
      accent={modalMeta.accent}
      showCoins={step === "select"}
    >
      <StepIndicator currentStep={step} />

      {step === "select" ? (
        <>
          <div className="mt-5">
            <p className={`${gajrajOne.className} text-sm tracking-[0.08em] text-[#FFEDAD]/90`}>
              Pacotes disponíveis
            </p>

            <div className="mt-2.5 grid grid-cols-1 gap-2.5">
              {isLoading
                ? Array.from({ length: 3 }).map((_, index) => <PackageSkeleton key={index} />)
                : coinPackages.map((pack) => (
                    <button
                      key={pack.id}
                      type="button"
                      onClick={() => setSelectedId(pack.id)}
                      className={`rounded-xl text-left transition-transform active:scale-[0.99] ${
                        selectedId === pack.id ? "scale-[1.01]" : ""
                      }`}
                    >
                      <CoinPackageCard pack={pack} selected={selectedId === pack.id} />
                    </button>
                  ))}
            </div>
          </div>

          {error ? (
            <p className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-center text-sm text-red-200">
              {error}
            </p>
          ) : null}

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Link
              href="/home"
              className={getButtonClassName({ variant: "outline", className: "w-full" })}
            >
              Voltar
            </Link>
            <button
              type="button"
              disabled={!selectedPackage || isLoading}
              onClick={() => {
                setError("");
                setStep("cpf");
              }}
              className={getButtonClassName({ variant: "primary", className: "w-full" })}
            >
              Continuar
            </button>
          </div>
        </>
      ) : null}

      {step === "cpf" && selectedPackage ? (
        <>
          <div className="mt-5 space-y-4">
            <SelectedPackageSummary pack={selectedPackage} />

            <div className="rounded-xl border border-white/15 bg-white/8 p-3.5">
              <label className="flex items-center gap-2 text-sm text-[#FFEDAD]">
                <Shield className="size-4 shrink-0 text-[#FFC400]" aria-hidden />
                CPF do pagador
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="000.000.000-00"
                value={taxId}
                onChange={(event) => setTaxId(formatCpf(event.target.value))}
                className="mt-2.5 h-12 w-full rounded-lg border border-white/20 bg-white px-3 text-black outline-none transition-colors focus:border-[#FFC400] focus:ring-2 focus:ring-[#FFC400]/25"
              />
              <p className="mt-2 text-xs leading-relaxed text-white/55">
                Obrigatório pelo PagBank para gerar o PIX com segurança.
              </p>
            </div>
          </div>

          {error ? (
            <p className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-center text-sm text-red-200">
              {error}
            </p>
          ) : null}

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleBack}
              className={`${getButtonClassName({ variant: "outline", className: "w-full gap-1.5" })} inline-flex`}
            >
              <ArrowLeft className="size-4" aria-hidden />
              Voltar
            </button>
            <button
              type="button"
              disabled={!isCpfValid}
              onClick={() => {
                setError("");
                setStep("pay");
              }}
              className={getButtonClassName({ variant: "primary", className: "w-full" })}
            >
              Continuar
            </button>
          </div>
        </>
      ) : null}

      {step === "pay" && selectedPackage ? (
        <>
          {purchase?.payment ? (
            <div className="mt-5 flex flex-col items-center gap-4">
              <SelectedPackageSummary pack={selectedPackage} />

              <div className="relative rounded-2xl border-2 border-dashed border-[#00BDAE]/50 bg-white p-4 shadow-[0_8px_32px_rgba(0,189,174,0.15)]">
                <QRCodeSVG value={purchase.payment.qrCodeText} size={176} />
              </div>

              <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1.5">
                <span className="text-xs text-white/60">Expira em</span>
                <span className="text-xs font-semibold text-[#FFEDAD]">
                  {formatExpiresAt(purchase.payment.expiresAt)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyPix}
                className={`${getButtonClassName({ variant: "primary", className: "w-full gap-2" })} inline-flex`}
              >
                {copied ? (
                  <>
                    <Check className="size-4" aria-hidden />
                    Código copiado!
                  </>
                ) : (
                  <>
                    <Copy className="size-4" aria-hidden />
                    Copiar código PIX
                  </>
                )}
              </button>

              <p className="flex items-center gap-2 text-center text-xs text-white/70">
                <Loader2 className="size-3.5 animate-spin text-[#00BDAE]" aria-hidden />
                Aguardando confirmação
                <WaitingDots />
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              <SelectedPackageSummary pack={selectedPackage} />

              <div className="rounded-xl border border-white/15 bg-white/8 p-3.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">CPF</span>
                  <span className="font-medium text-[#FFEDAD]">{formatCpf(taxId)}</span>
                </div>
                <div className="mt-3 border-t border-white/10 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Forma de pagamento</span>
                    <span className="text-sm font-semibold text-[#00BDAE]">PIX</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-[#FFC400]/40 bg-[#FFC400]/15 px-4 py-3">
                <span className="text-sm font-medium text-[#FFEDAD]">Total a pagar</span>
                <span className={`${gajrajOne.className} text-2xl text-[#FFC400]`}>
                  {formatPrice(selectedPackage.price_cents, selectedPackage.currency)}
                </span>
              </div>
            </div>
          )}

          {error ? (
            <p className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-center text-sm text-red-200">
              {error}
            </p>
          ) : null}

          {!purchase?.payment ? (
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleBack}
                disabled={isBuying}
                className={`${getButtonClassName({ variant: "outline", className: "w-full gap-1.5" })} inline-flex`}
              >
                <ArrowLeft className="size-4" aria-hidden />
                Voltar
              </button>
              <button
                type="button"
                disabled={isBuying}
                onClick={() => void handleStartPayment()}
                className={`${getButtonClassName({ variant: "primary", className: "w-full gap-2" })} inline-flex disabled:opacity-50`}
              >
                {isBuying ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Gerando PIX...
                  </>
                ) : (
                  "Gerar PIX"
                )}
              </button>
            </div>
          ) : null}
        </>
      ) : null}
    </FabcoinModal>
  );
}

export default function BuyFabcoinsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full flex-1 items-center justify-center p-6 text-center text-[#FFEDAD]">
          <Loader2 className="size-6 animate-spin" aria-hidden />
        </div>
      }
    >
      <BuyFabcoinsContent />
    </Suspense>
  );
}
