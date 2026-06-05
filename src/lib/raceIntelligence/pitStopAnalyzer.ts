import type { OpenF1PitStop, OpenF1Stint } from "../api/apiTypes";
import type { PitStopAnalysis, StintAnalysis } from "./types";

export function analyzePitStops(stops: OpenF1PitStop[]): PitStopAnalysis {
  if (!stops || stops.length === 0) {
    return {
      earliestStopLap: null,
      latestStopLap: null,
      averageStopLap: null,
      driversWithMultipleStops: [],
      unusuallyEarlyStops: [],
      unusuallyLateStops: [],
    };
  }

  // Filter out any invalid laps or missing driver numbers
  const validStops = stops.filter((s): s is OpenF1PitStop & { driver_number: number; lap_number: number } => 
    typeof s.lap_number === 'number' && s.lap_number > 0 && typeof s.driver_number === 'number'
  );

  if (validStops.length === 0) {
    return {
      earliestStopLap: null,
      latestStopLap: null,
      averageStopLap: null,
      driversWithMultipleStops: [],
      unusuallyEarlyStops: [],
      unusuallyLateStops: [],
    };
  }

  const laps = validStops.map((s) => s.lap_number);
  const earliestStopLap = Math.min(...laps);
  const latestStopLap = Math.max(...laps);
  const averageStopLap = Math.round(laps.reduce((sum, lap) => sum + lap, 0) / laps.length);

  const stopsByDriver = new Map<number, number>();
  validStops.forEach((s) => {
    stopsByDriver.set(s.driver_number, (stopsByDriver.get(s.driver_number) || 0) + 1);
  });

  const driversWithMultipleStops = Array.from(stopsByDriver.entries())
    .filter(([_, count]) => count > 1)
    .map(([driver]) => driver);

  // Unusually early if < avg - 5 laps (simple heuristic)
  const unusuallyEarlyStops = validStops.filter((s) => s.lap_number < averageStopLap - 5);
  // Unusually late if > avg + 5 laps
  const unusuallyLateStops = validStops.filter((s) => s.lap_number > averageStopLap + 5);

  return {
    earliestStopLap,
    latestStopLap,
    averageStopLap,
    driversWithMultipleStops,
    unusuallyEarlyStops,
    unusuallyLateStops,
  };
}

export function analyzeStints(stints: OpenF1Stint[]): StintAnalysis {
  if (!stints || stints.length === 0) {
    return {
      longestStint: null,
      shortestStint: null,
      stintsByDriver: {},
    };
  }

  const stintsByDriver: Record<number, OpenF1Stint[]> = {};
  let longestStint: OpenF1Stint | null = null;
  let shortestStint: OpenF1Stint | null = null;

  for (const stint of stints) {
    if (!stintsByDriver[stint.driver_number]) {
      stintsByDriver[stint.driver_number] = [];
    }
    stintsByDriver[stint.driver_number].push(stint);

    const length = stint.lap_end - stint.lap_start;
    if (length > 0) {
      if (!longestStint || length > (longestStint.lap_end - longestStint.lap_start)) {
        longestStint = stint;
      }
      if (!shortestStint || length < (shortestStint.lap_end - shortestStint.lap_start)) {
        shortestStint = stint;
      }
    }
  }

  return {
    longestStint,
    shortestStint,
    stintsByDriver,
  };
}
