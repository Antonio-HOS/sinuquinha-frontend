import Avatar from "@/src/components/Avatar";
import { gajrajOne } from "@/src/fonts";
import type { User, UserStats } from "@/src/lib/api";

type StatsTabProps = {
  stats: UserStats | null;
  user: User | null;
};

export default function StatsTab({ stats, user }: StatsTabProps) {
  const winRate = stats ? `${Number(stats.win_rate).toFixed(1)}%` : "0%";
  const totalMatches = stats?.total_matches ?? 0;
  const bestStreak = stats?.best_win_streak ?? 0;
  const coinBalance = user?.coin_balance ?? 0;
  const winsPercent = totalMatches
    ? Math.round(((stats?.wins ?? 0) / totalMatches) * 100)
    : 0;
  const lossesPercent = totalMatches ? 100 - winsPercent : 100;

  return (
    <div className="scrollbar-hidden flex flex-col gap-4 overflow-y-auto pb-20 px-1 mt-2">
      <div className="grid grid-cols-2 gap-3">
        <div className="border border-white/60 rounded-xl py-4 flex flex-col items-center justify-center bg-white/5">
          <span className={`${gajrajOne.className} text-[10px] sm:text-xs text-white text-center uppercase`}>Taxa De Vitória</span>
          <span className={`${gajrajOne.className} text-lg sm:text-xl text-white mt-1`}>{winRate}</span>
        </div>

        <div className="border border-white/60 rounded-xl py-4 flex flex-col items-center justify-center bg-white/5">
          <span className={`${gajrajOne.className} text-[10px] sm:text-xs text-white text-center uppercase`}>Total de Partidas</span>
          <span className={`${gajrajOne.className} text-lg sm:text-xl text-white mt-1`}>{totalMatches}</span>
        </div>

        <div className="border border-white/60 rounded-xl py-4 flex flex-col items-center justify-center bg-white/5">
          <span className={`${gajrajOne.className} text-[10px] sm:text-xs text-white text-center uppercase`}>Maior Sequência</span>
          <span className={`${gajrajOne.className} text-lg sm:text-xl text-white mt-1 flex items-center gap-2`}>
            <span className="text-sm">🔥</span> {bestStreak}
          </span>
        </div>

        <div className="border border-white/60 rounded-xl py-4 flex flex-col items-center justify-center bg-white/5">
          <span className={`${gajrajOne.className} text-[10px] sm:text-xs text-white text-center uppercase`}>Saldo De Moedas</span>
          <div className={`${gajrajOne.className} text-lg sm:text-xl text-white mt-1 flex items-center justify-center gap-2`}>
            <div className="w-5 h-5 rounded-full overflow-hidden border-[1.5px] border-[#FFD700] flex items-center justify-center relative">
              <Avatar className="w-full h-full object-cover" />
            </div>
            {coinBalance}
          </div>
        </div>
      </div>

      <div className="border border-white/60 rounded-xl py-4 px-4 flex flex-col items-center justify-center bg-white/5">
        <span className={`${gajrajOne.className} text-xs sm:text-sm text-white text-center uppercase mb-3`}>DISTRIBUIÇÃO DE MODOS</span>
        <div className="w-full flex items-center gap-1 mb-2">
          <div className="bg-[#6B4C9A] h-2.5 rounded-full" style={{ width: `${winsPercent}%` }}></div>
          <div className="bg-[#E0D4F5] h-2.5 rounded-full relative flex items-center justify-end pr-1" style={{ width: `${lossesPercent}%` }}>
            <div className="w-1 h-1 bg-[#6B4C9A] rounded-full"></div>
          </div>
        </div>
        <span className={`${gajrajOne.className} text-[10px] sm:text-xs text-white text-center uppercase`}>
          {stats?.wins ?? 0} Vitórias | {stats?.losses ?? 0} Derrotas
        </span>
      </div>

      <div className="border border-white/60 rounded-xl py-4 px-4 flex flex-col items-center justify-center bg-white/5">
        <span className={`${gajrajOne.className} text-xs sm:text-sm text-white text-center uppercase mb-1`}>ANÁLISE DE RIVAIS</span>
        <span className={`${gajrajOne.className} text-[10px] sm:text-xs text-white text-center uppercase`}>Sequência atual: {stats?.current_win_streak ?? 0}</span>
      </div>
    </div>
  );
}