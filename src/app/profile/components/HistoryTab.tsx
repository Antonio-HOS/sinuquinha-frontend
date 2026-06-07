import { gajrajOne } from "@/src/fonts";
import { historyMock } from "../mocks";

export default function HistoryTab() {
  return (
    <>
      <div className={`grid grid-cols-5 gap-1 mb-4 px-1 ${gajrajOne.className} text-white text-[10px] sm:text-xs text-center uppercase`}>
        <div className="text-left">Nome</div>
        <div>Tipo</div>
        <div>Tempo</div>
        <div>Points</div>
        <div>Moedas</div>
      </div>

      <div className="scrollbar-hidden flex flex-col gap-4 overflow-y-auto pb-20 px-1">
        {historyMock.map((item, index) => (
          <div key={index} className={`grid grid-cols-5 gap-1 items-center ${gajrajOne.className} text-white text-[10px] sm:text-xs text-center`}>
            <div className="text-left truncate">{item.nome}</div>
            <div>{item.tipo}</div>
            <div>{item.tempo}</div>
            <div className="whitespace-nowrap">{item.points}</div>
            <div className="flex items-center justify-center gap-1">
              {item.moedas}
              <div className="w-3 h-3 bg-orange-400 rounded-full border border-yellow-400"></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}