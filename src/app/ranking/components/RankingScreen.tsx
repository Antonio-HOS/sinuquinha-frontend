import AppHeader from "@/src/components/AppHeader";
import Avatar from "@/src/components/Avatar";
import BottomNav from "@/src/components/BottomNav";
import { gajrajOne } from "@/src/fonts";
import Link from "next/link";

type League = "geral" | "bronze" | "prata" | "ouro" | "diamante";

type RankingPlayer = {
  pos: number;
  name: string;
  score: number;
  league: Exclude<League, "geral">;
};

const leagueLabels: Record<League, string> = {
  geral: "Geral",
  bronze: "Bronze",
  prata: "Prata",
  ouro: "Ouro",
  diamante: "Diamante",
};

const leagueStyles: Record<League, string> = {
  geral: "border-[#FFD700] text-[#FFD700]",
  bronze: "border-[#CD7F32] text-[#CD7F32]",
  prata: "border-[#C0C0C0] text-[#C0C0C0]",
  ouro: "border-[#FFD700] text-[#FFD700]",
  diamante: "border-[#7DD3FC] text-[#7DD3FC]",
};

const players: RankingPlayer[] = [
  { pos: 1, name: "Antonio", score: 1000, league: "diamante" },
  { pos: 2, name: "Galdino", score: 750, league: "ouro" },
  { pos: 3, name: "Henrique", score: 640, league: "ouro" },
  { pos: 4, name: "Jorge Lima", score: 520, league: "prata" },
  { pos: 5, name: "Rodrigo", score: 460, league: "prata" },
  { pos: 6, name: "Rick", score: 310, league: "bronze" },
  { pos: 7, name: "Thiago", score: 220, league: "bronze" },
  { pos: 8, name: "codigo", score: 150, league: "bronze" },
];

type RankingScreenProps = {
  league?: League;
};

export default function RankingScreen({ league = "geral" }: RankingScreenProps) {
  const visiblePlayers =
    league === "geral"
      ? players
      : players.filter((player) => player.league === league);

  return (
    <div className="flex min-h-full flex-1 flex-col px-4 pb-4 pt-3 sm:px-5">
      <AppHeader />

      <section className="flex flex-col items-center">
        <h1 className={`${gajrajOne.className} text-center text-[clamp(2rem,8vw,2.25rem)] text-[#FFD700]`}>
          Ranking
        </h1>
        <p className="mt-1 text-sm tracking-[0.18em] text-white/80">
          {leagueLabels[league].toUpperCase()}
        </p>
      </section>

      <nav className="mt-5 grid grid-cols-5 gap-1">
        {(Object.keys(leagueLabels) as League[]).map((item) => (
          <Link
            key={item}
            href={item === "geral" ? "/ranking" : `/ranking/${item}`}
            className={`${gajrajOne.className} rounded border px-1 py-2 text-center text-[10px] transition-colors ${
              league === item
                ? `${leagueStyles[item]} bg-white/10`
                : "border-white/20 text-white/60"
            }`}
          >
            {leagueLabels[item]}
          </Link>
        ))}
      </nav>

      <section className="scrollbar-hidden mt-6 flex flex-1 flex-col gap-3 overflow-y-auto pb-6">
        {visiblePlayers.map((player) => (
          <article
            key={`${player.league}-${player.pos}-${player.name}`}
            className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 rounded-md border border-white/15 bg-white/10 px-3 py-2"
          >
            <span className={`${gajrajOne.className} text-center text-xl text-[#FFD700]`}>
              {player.pos}
            </span>
            <div className="flex min-w-0 items-center gap-3">
              <Avatar className="size-9" />
              <div className="min-w-0">
                <h2 className={`${gajrajOne.className} truncate text-sm text-white`}>
                  {player.name}
                </h2>
                <p className={`text-xs ${leagueStyles[player.league]}`}>
                  Liga {leagueLabels[player.league]}
                </p>
              </div>
            </div>
            <span className={`${gajrajOne.className} flex items-center gap-1 text-sm text-[#FFD700]`}>
              {player.score}
              <Avatar className="size-5" />
            </span>
          </article>
        ))}
      </section>

      <BottomNav active="trophy" />
    </div>
  );
}
