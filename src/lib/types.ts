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
  id: string;
  title: string;
  year: string;
  description: string;
  tag: string;
  image?: string;
  slug?: string;
  detailImage?: string;
  longSummary?: string;
  whyItMattered?: string;
  keyFacts?: {
    circuit?: string;
    winner?: string;
    constructorTeam?: string;
    championshipImpact?: string;
    definingMoment?: string;
  };
  quoteOrPressReaction?: string;
  sources?: { name: string; url: string }[];
};

export type GlossaryTerm = {
  term: string;
  definition: string;
};

export type StrategyInput = {
  circuit: string;
  driverName: string;
  startingPosition: number;
  startingTyre: "Soft" | "Medium" | "Hard" | "Intermediate" | "Wet";
  weather: "Dry" | "Mixed" | "Wet";
  safetyCarChance: "Low" | "Medium" | "High";
  pitLap: number;
  aggressionLevel: "Conservative" | "Balanced" | "Aggressive";
  trackPositionPriority: "Low" | "Medium" | "High";
};

export type StrategyOption = {
  name: string;
  tyrePlan: string;
  pitWindow: string;
  riskLevel: string;
  upside: string;
  downside: string;
};

export type StrategyResult = {
  recommendedStrategy: {
    plan: string;
    pitWindow: string;
    riskLevel: string;
    projectedOutcome: string;
  };
  pitwallVerdict: string;
  strategyOptions: StrategyOption[];
  stintTimeline: { tyre: string; startLap: number; endLap: number; type: "stint" | "pit" }[];
  riskBreakdown: {
    tyreRisk: number;
    trafficRisk: number;
    safetyCarUpside: number;
    weatherRisk: number;
    undercutPotential: number;
    trackPositionRisk: number;
  };
  pitWindowAdvisor: {
    idealWindow: string;
    earlyStopRisk: string;
    lateStopRisk: string;
  };
  safetyCarResponsePlan: {
    early: string;
    mid: string;
    late: string;
  };
};

export type ApiResponse<T> = {
  data: T;
  source: "live" | "fallback";
  error?: string;
};

export type DriverIntelligence = {
  driverId: string;
  fullName: string;
  team: string;
  points: number;
  wins: number;
  momentum: number;
  status: "Hot" | "Stable" | "Risky" | "Rebuilding";
  raceForm: { round: string; raceName: string; result: string; startPosition: number; finishPosition: number; status: string }[];
  teammateBattle: {
    teammateName: string;
    pointsGap: number;
    raceHeadToHead: string; 
    qualiHeadToHead: string; 
  };
  qualiVsRace: {
    averageQualifying: number | "pending";
    averageFinish: number | "pending";
    averageRaceGain: number | "pending";
  };
  consistency: {
    score: number;
    label: string;
    dnfCount: number;
    pointsFinishes: number;
  };
  pressure: {
    score: number;
    label: string;
    basis: string;
  };
};
