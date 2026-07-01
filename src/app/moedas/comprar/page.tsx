"use client";

import {
  CoinAmountInput,
  CoinPackageCard,
  FabcoinModal,
} from "../components/FabcoinComponents";
import { getButtonClassName } from "@/src/components/Button";
import { api, type CoinPackage } from "@/src/lib/api";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

function BuyFabcoinsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPackageId = searchParams.get("packageId");
  const [coinPackages, setCoinPackages] = useState<CoinPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuying, setIsBuying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPackages() {
      try {
        setCoinPackages(await api.coinPackages());
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Não foi possível carregar pacotes.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadPackages();
  }, []);

  const selectedPackage = useMemo(
    () =>
      coinPackages.find((pack) => pack.id === selectedPackageId) ??
      coinPackages[0],
    [coinPackages, selectedPackageId],
  );

  const handleConfirm = async () => {
    if (!selectedPackage) return;

    try {
      setIsBuying(true);
      setError("");
      const purchase = await api.createPurchase(selectedPackage.id);
      await api.confirmPurchase(purchase.id);
      router.push("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Compra não concluída.");
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <FabcoinModal title="Comprar" subtitle="Selecione um pacote ou informe outro valor">
      <div className="mt-5 grid grid-cols-1 gap-3">
        {isLoading ? (
          <p className="text-center text-sm text-white/70">Carregando pacotes...</p>
        ) : null}
        {coinPackages.map((pack) => (
          <CoinPackageCard key={pack.id} pack={pack} />
        ))}
      </div>

      <div className="mt-5">
        <CoinAmountInput placeholder="Outro valor" />
      </div>

      {error ? (
        <p className="mt-4 text-center text-sm text-red-300">{error}</p>
      ) : null}

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Link
          href="/moedas"
          className={getButtonClassName({ variant: "outline", className: "w-full" })}
        >
          Voltar
        </Link>
        <button
          type="button"
          disabled={!selectedPackage || isBuying}
          onClick={handleConfirm}
          className={getButtonClassName({ variant: "primary", className: "w-full" })}
        >
          {isBuying ? "Comprando..." : "Confirmar"}
        </button>
      </div>
    </FabcoinModal>
  );
}

export default function BuyFabcoinsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-white">Carregando...</div>}>
      <BuyFabcoinsContent />
    </Suspense>
  );
}
