import type { OpenF1PitStop, OpenF1Stint } from "../api/apiTypes";

export interface PitStopAnalysis {
  totalStops: number;
  stopsByDriver: Record<number, number>;
  earliestStop: OpenF1PitStop | null;
  latestStop: OpenF1PitStop | null;
  earliestStopLap: number | null;
  latestStopLap: number | null;
  averageStopLap: number | null;
  medianStopLap: number | null;
  fastestStopDuration: number | null;
  slowestStopDuration: number | null;
  driversWithMultipleStops: number[];
  unusuallyEarlyStops: OpenF1PitStop[];
  unusuallyLateStops: OpenF1PitStop[];
}

export interface StintAnalysis {
  longestStint: OpenF1Stint | null;
  shortestValidStint: OpenF1Stint | null;
  stintsByDriver: Record<number, OpenF1Stint[]>;
  compoundUsageCounts: Record<string, number>;
  averageStintLengthByCompound: Record<string, number>;
  tyreMixSummary: string;
}

export interface StrategyEventEvidence {
  medianPitLap?: number;
  averagePitLap?: number;
  preStopAverage?: number;
  postStopAverage?: number;
  positionBefore?: number;
  positionAfter?: number;
  nearbyRaceControl?: boolean;
  limitation?: string;
}

export interface StrategyEvent {
  type: "possible_undercut" | "possible_overcut" | "safety_car_pit" | "traffic_risk";
  driver_number: number;
  lap: number;
  description: string;
  confidence: "low" | "medium" | "high";
  evidence?: StrategyEventEvidence;
}

export interface RaceNarrative {
  simple: string;
  technical: string;
  dataAvailable: boolean;
}
