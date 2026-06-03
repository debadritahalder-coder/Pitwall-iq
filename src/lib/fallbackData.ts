import type {
  ConstructorStanding,
  DriverStanding,
  GlossaryTerm,
  HistoryMoment,
  Race,
  RaceResult,
} from "./types";

export const fallbackRaceSchedule: Race[] = [
  {
    season: "2026",
    round: "10",
    raceName: "Canadian Grand Prix",
    circuitName: "Circuit Gilles Villeneuve",
    country: "Canada",
    locality: "Montreal",
    date: "2026-06-07",
    time: "18:00:00Z",
    keyRaceFactor: "Low-grip exits and heavy braking zones can punish tyre wear and reward decisive undercut timing.",
  },
  {
    season: "2026",
    round: "11",
    raceName: "Austrian Grand Prix",
    circuitName: "Red Bull Ring",
    country: "Austria",
    locality: "Spielberg",
    date: "2026-06-28",
    time: "13:00:00Z",
    keyRaceFactor: "Short laps, track limits, and DRS trains can make qualifying position unusually valuable.",
  },
];

export const fallbackDriverStandings: DriverStanding[] = [
  { position: 1, driverId: "verstappen", driverName: "Max Verstappen", code: "VER", constructorName: "Red Bull", points: 169, wins: 4 },
  { position: 2, driverId: "norris", driverName: "Lando Norris", code: "NOR", constructorName: "McLaren", points: 150, wins: 2 },
  { position: 3, driverId: "leclerc", driverName: "Charles Leclerc", code: "LEC", constructorName: "Ferrari", points: 138, wins: 1 },
  { position: 4, driverId: "piastri", driverName: "Oscar Piastri", code: "PIA", constructorName: "McLaren", points: 132, wins: 1 },
  { position: 5, driverId: "sainz", driverName: "Carlos Sainz", code: "SAI", constructorName: "Ferrari", points: 108, wins: 1 },
  { position: 6, driverId: "hamilton", driverName: "Lewis Hamilton", code: "HAM", constructorName: "Mercedes", points: 92, wins: 0 },
  { position: 7, driverId: "russell", driverName: "George Russell", code: "RUS", constructorName: "Mercedes", points: 86, wins: 0 },
  { position: 8, driverId: "perez", driverName: "Sergio Perez", code: "PER", constructorName: "Red Bull", points: 74, wins: 0 },
  { position: 9, driverId: "alonso", driverName: "Fernando Alonso", code: "ALO", constructorName: "Aston Martin", points: 45, wins: 0 },
  { position: 10, driverId: "tsunoda", driverName: "Yuki Tsunoda", code: "TSU", constructorName: "RB", points: 29, wins: 0 },
];

export const fallbackConstructorStandings: ConstructorStanding[] = [
  { position: 1, constructorId: "mclaren", constructorName: "McLaren", nationality: "British", points: 282, wins: 3 },
  { position: 2, constructorId: "ferrari", constructorName: "Ferrari", nationality: "Italian", points: 246, wins: 2 },
  { position: 3, constructorId: "red_bull", constructorName: "Red Bull", nationality: "Austrian", points: 243, wins: 4 },
  { position: 4, constructorId: "mercedes", constructorName: "Mercedes", nationality: "German", points: 178, wins: 0 },
  { position: 5, constructorId: "aston_martin", constructorName: "Aston Martin", nationality: "British", points: 66, wins: 0 },
];

export const fallbackLatestRaceResults: RaceResult[] = [
  {
    position: 1,
    driverName: "Max Verstappen",
    constructorName: "Red Bull",
    grid: "2",
    laps: "70",
    status: "Finished",
    raceName: "Monaco Grand Prix",
  },
  {
    position: 2,
    driverName: "Lando Norris",
    constructorName: "McLaren",
    grid: "4",
    laps: "70",
    status: "Finished",
    raceName: "Monaco Grand Prix",
  },
];

export const historyMoments: HistoryMoment[] = [
  {
    title: "1950 British Grand Prix",
    description: "The first official Formula 1 World Championship race.",
    tag: "Origins",
  },
  {
    title: "1976 Nurburgring",
    description: "Niki Lauda's crash and comeback became one of the defining stories of courage in F1 history.",
    tag: "Legacy",
  },
  {
    title: "1988 Senna vs Prost",
    description: "One of the most famous teammate rivalries, shaping the McLaren-Honda era.",
    tag: "Rivalry",
  },
  {
    title: "1994 Imola",
    description: "A tragic weekend that changed Formula 1 safety forever.",
    tag: "Safety",
  },
  {
    title: "2008 Brazilian Grand Prix",
    description: "Lewis Hamilton won the championship on the final corner of the final lap.",
    tag: "Title Decider",
  },
  {
    title: "2009 Brawn GP",
    description: "A shock championship-winning season from a team that almost did not exist.",
    tag: "Underdog",
  },
  {
    title: "2012 Brazilian Grand Prix",
    description: "A chaotic title finale remembered for drama, rain, and championship pressure.",
    tag: "Chaos",
  },
  {
    title: "2021 Abu Dhabi Grand Prix",
    description: "One of the most controversial modern title finales in Formula 1.",
    tag: "Controversy",
  },
];

export const glossaryTerms: GlossaryTerm[] = [
  { term: "Undercut", definition: "Pitting earlier than a rival to use fresher tyres and gain time before they stop." },
  { term: "Overcut", definition: "Staying out longer than a rival to gain track position or use clear air before pitting." },
  { term: "Tyre degradation", definition: "The loss of tyre performance as laps, heat, and sliding wear the rubber down." },
  { term: "Dirty air", definition: "Disturbed airflow behind another car that reduces grip and makes following harder." },
  { term: "DRS", definition: "A movable rear wing flap that reduces drag on selected straights when a driver is close enough." },
  { term: "Safety car", definition: "A race neutralization that slows the field after an incident and can reshape pit strategy." },
  { term: "Pit window", definition: "The range of laps where stopping is likely to work best for a planned strategy." },
  { term: "Track position", definition: "A car's place on the road, often valuable when overtaking is difficult." },
  { term: "Parc ferme", definition: "The restricted period when teams cannot freely change car setup after qualifying begins." },
  { term: "Formation lap", definition: "The slow lap before the start when drivers warm tyres and line up on the grid." },
  { term: "Blue flags", definition: "Signals shown to slower cars when faster leaders are approaching to lap them." },
  { term: "DNF", definition: "Did Not Finish, used when a driver retires before completing the race." },
];
