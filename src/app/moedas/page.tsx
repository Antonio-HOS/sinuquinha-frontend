import {
  CoinPackageCard,
  FabcoinModal,
  ModalActions,
  coinPackages,
} from "./components/FabcoinComponents";

export default function FabcoinsPage() {
  return (
    <FabcoinModal title="FABCOINS" subtitle="Compre moedas para entrar nas partidas">
      <div className="mt-5 flex flex-col gap-3">
        {coinPackages.slice(0, 3).map((pack) => (
          <CoinPackageCard key={pack.coins} pack={pack} />
        ))}
      </div>
      <ModalActions primaryHref="/moedas/comprar" primaryLabel="Ver Mais" />
    </FabcoinModal>
  );
}
