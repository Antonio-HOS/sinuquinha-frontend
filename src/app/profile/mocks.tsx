export const userMock = {
  nome: "Galdinobross",
  id: "202320098",
  vitorias: 15,
  rank: "10º",
};

export const historyMock = Array(8).fill({
  nome: "Rick",
  tipo: "1x1",
  tempo: "1:00:20",
  points: "+ 20 RU",
  moedas: "+ 10",
});

export const statsMock = {
  taxaVitoria: "68%",
  totalPartidas: 120,
  maiorSequencia: 5,
  saldoMoedas: "+ 150",
  distribuicao: {
    competitivo: 70,
    casual: 30,
  },
  maiorFregues: "Rick (7 vitórias)",
};

export const rankingMock = [
  { pos: 1, name: "Antonio", score: 1000, bg: "bg-[#6B7280]", text: "text-white" },
  { pos: 2, name: "Galdino", score: 150, bg: "bg-[#FFD700]", text: "text-black" },
  { pos: 3, name: "Henrique", score: 140, bg: "bg-[#C0C0C0]", text: "text-black" },
  { pos: 4, name: "Jorge Lima", score: 130, bg: "bg-[#CD7F32]", text: "text-white" },
  { pos: 5, name: "Rodrigo", score: 130, bg: "bg-[#CD7F32]", text: "text-white" },
  { pos: 6, name: "Thiago", score: 15, bg: "bg-[#374151]", text: "text-white" },
] as const;

export const suggestionsMock = [
  { id: "#202320098", nome: "Antonio Henrique", rank: "42º" },
  { id: "#202510101", nome: "Ariel Pina", rank: "28º" },
];

export const friendsMock = [
  { id: "#202320098", nome: "RICK", rank: "12º", status: "online" },
  { id: "#202320099", nome: "Rodrigo", rank: "10º", status: "offline" },
  { id: "#202510102", nome: "thigas", rank: "15º", status: "online" },
];