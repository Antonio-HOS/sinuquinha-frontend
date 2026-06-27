import {
  CoinAmountInput,
  CoinPackageCard,
  FabcoinModal,
  ModalActions,
  coinPackages,
} from "../components/FabcoinComponents";

export default function BuyFabcoinsPage() {
  return (
    <FabcoinModal title="Comprar" subtitle="Selecione um pacote ou informe outro valor">
      <div className="mt-5 grid grid-cols-1 gap-3">
        {coinPackages.map((pack) => (
          <CoinPackageCard key={pack.coins} pack={pack} />
        ))}
      </div>

      <div className="mt-5">
        <CoinAmountInput placeholder="Outro valor" />
      </div>

      <ModalActions
        primaryHref="/home"
        primaryLabel="Confirmar"
        secondaryHref="/moedas"
        secondaryLabel="Voltar"
      />
    </FabcoinModal>
  );
}
