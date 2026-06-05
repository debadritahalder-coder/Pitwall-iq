import type { OpenF1PitStop, OpenF1Stint } from "../api/apiTypes";

export interface PitStopAnalysis {
  earliestStopLap: number | null;
  latestStopLap: number | null;
  averageStopLap: number | null;
  driversWithMultipleStops: number[];
  unusuallyEarlyStops: OpenF1PitStop[];
  unusuallyLateStops: OpenF1PitStop[];
}

export interface StintAnalysis {
  longestStint: OpenF1Stint | null;
  shortestStint: OpenF1Stint | null;
  stintsByDriver: Record<number, OpenF1Stint[]>;
}

export interface StrategyEvent {
  type: "possible_undercut" | "possible_overcut" | "safety_car_pit" | "traffic_risk";
  driver_number: number;
  lap: number;
  description: string;
  confidence: "low" | "medium" | "high";
}

export interface RaceNarrative {
  simple: string;
  technical: string;
  dataAvailable: boolean;
}
