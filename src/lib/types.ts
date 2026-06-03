export type Race = {
  season: string;
  round: string;
  raceName: string;
  circuitName: string;
  country: string;
  locality: string;
  date: string;
  time?: string;
  weekendStartDate?: string;
  weekendEndDate?: string;
  previousRaceSummary?: string;
  currentWeekendSummary?: string;
  keyRaceFactor: string;
};

export type DriverStanding = {
  position: number;
  driverId: string;
  driverName: string;
  code?: string;
  constructorName: string;
  points: number;
  wins: number;
};

export type ConstructorStanding = {
  position: number;
  constructorId: string;
  constructorName: string;
  nationality: string;
  points: number;
  wins: number;
};

export type RaceResult = {
  position: number;
  driverName: string;
  constructorName: string;
  grid: string;
  laps: string;
  status: string;
  raceName: string;
  round?: string;
};

export type HistoryMoment = {
  title: string;
  description: string;
  tag: string;
  image?: string;
  slug?: string;
};

export type GlossaryTerm = {
  term: string;
  definition: string;
};

export type StrategyInput = {
  driverName: string;
  startingPosition: number;
  startingTyre: "Soft" | "Medium" | "Hard";
  weather: "Dry" | "Mixed" | "Wet";
  safetyCarChance: "Low" | "Medium" | "High";
  pitLap: number;
};

export type StrategyResult = {
  recommendedStrategy: string;
  pitWindow: string;
  riskScore: number;
  expectedFinishRange: string;
  explanation: string;
};

export type ApiResponse<T> = {
  data: T;
  source: "live" | "fallback";
  error?: string;
};
