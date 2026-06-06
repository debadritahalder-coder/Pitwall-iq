import type { OpenF1PitStop, OpenF1Stint } from "../api/apiTypes";
import type { PitStopAnalysis, StintAnalysis } from "./types";

function getStopDuration(stop: OpenF1PitStop): number | null {
  if (typeof stop.stop_duration === 'number') return stop.stop_duration;
  if (typeof stop.pit_duration === 'number') return stop.pit_duration;
  if (typeof stop.lane_duration === 'number') return stop.lane_duration;
  return null;
}

export function analyzePitStops(stops: OpenF1PitStop[]): PitStopAnalysis {
  const emptyResult: PitStopAnalysis = {
    totalStops: 0,
    stopsByDriver: {},
    earliestStop: null,
    latestStop: null,
    earliestStopLap: null,
    latestStopLap: null,
    averageStopLap: null,
    medianStopLap: null,
    fastestStopDuration: null,
    slowestStopDuration: null,
    driversWithMultipleStops: [],
    unusuallyEarlyStops: [],
    unusuallyLateStops: [],
  };

  if (!stops || stops.length === 0) return emptyResult;

  // Filter out any invalid laps or missing driver numbers
  const validStops = stops.filter((s): s is OpenF1PitStop & { driver_number: number; lap_number: number } => 
    typeof s.lap_number === 'number' && s.lap_number > 0 && typeof s.driver_number === 'number'
  );

  if (validStops.length === 0) return emptyResult;

  const laps = validStops.map((s) => s.lap_number).sort((a, b) => a - b);
  
  const earliestStop = validStops.reduce((prev, curr) => prev.lap_number < curr.lap_number ? prev : curr);
  const latestStop = validStops.reduce((prev, curr) => prev.lap_number > curr.lap_number ? prev : curr);
  const earliestStopLap = earliestStop.lap_number;
  const latestStopLap = latestStop.lap_number;
  
  const averageStopLap = Math.round(laps.reduce((sum, lap) => sum + lap, 0) / laps.length);
  
  const mid = Math.floor(laps.length / 2);
  const medianStopLap = laps.length % 2 !== 0 ? laps[mid] : (laps[mid - 1] + laps[mid]) / 2;

  let fastestDuration: number | null = null;
  let slowestDuration: number | null = null;

  const stopsByDriverMap = new Map<number, number>();
  
  validStops.forEach((s) => {
    stopsByDriverMap.set(s.driver_number, (stopsByDriverMap.get(s.driver_number) || 0) + 1);
    
    const duration = getStopDuration(s);
    if (duration !== null) {
      if (fastestDuration === null || duration < fastestDuration) fastestDuration = duration;
      if (slowestDuration === null || duration > slowestDuration) slowestDuration = duration;
    }
  });

  const stopsByDriver: Record<number, number> = {};
  stopsByDriverMap.forEach((count, driver) => {
    stopsByDriver[driver] = count;
  });

  const driversWithMultipleStops = Array.from(stopsByDriverMap.entries())
    .filter(([_, count]) => count > 1)
    .map(([driver]) => driver);

  // Unusually early/late based on median stop lap
  const unusuallyEarlyStops = validStops.filter((s) => s.lap_number < medianStopLap - 5);
  const unusuallyLateStops = validStops.filter((s) => s.lap_number > medianStopLap + 5);

  return {
    totalStops: validStops.length,
    stopsByDriver,
    earliestStop,
    latestStop,
    earliestStopLap,
    latestStopLap,
    averageStopLap,
    medianStopLap,
    fastestStopDuration: fastestDuration,
    slowestStopDuration: slowestDuration,
    driversWithMultipleStops,
    unusuallyEarlyStops,
    unusuallyLateStops,
  };
}

export function analyzeStints(stints: OpenF1Stint[]): StintAnalysis {
  const emptyResult: StintAnalysis = {
    longestStint: null,
    shortestValidStint: null,
    stintsByDriver: {},
    compoundUsageCounts: {},
    averageStintLengthByCompound: {},
    tyreMixSummary: "",
  };

  if (!stints || stints.length === 0) return emptyResult;

  const stintsByDriver: Record<number, OpenF1Stint[]> = {};
  const compoundUsageCounts: Record<string, number> = {};
  const compoundLaps: Record<string, number[]> = {};

  let longestStint: OpenF1Stint | null = null;
  let shortestValidStint: OpenF1Stint | null = null;

  for (const stint of stints) {
    if (!stint.compound || stint.lap_end === undefined || stint.lap_start === undefined) continue;
    
    const length = stint.lap_end - stint.lap_start;
    // Ignore 0-lap stints
    if (length <= 0) continue;

    if (!stintsByDriver[stint.driver_number]) {
      stintsByDriver[stint.driver_number] = [];
    }
    stintsByDriver[stint.driver_number].push(stint);

    compoundUsageCounts[stint.compound] = (compoundUsageCounts[stint.compound] || 0) + 1;
    
    if (!compoundLaps[stint.compound]) {
      compoundLaps[stint.compound] = [];
    }
    compoundLaps[stint.compound].push(length);

    if (!longestStint || length > (longestStint.lap_end - longestStint.lap_start)) {
      longestStint = stint;
    }
    if (!shortestValidStint || length < (shortestValidStint.lap_end - shortestValidStint.lap_start)) {
      shortestValidStint = stint;
    }
  }

  const averageStintLengthByCompound: Record<string, number> = {};
  for (const compound in compoundLaps) {
    const laps = compoundLaps[compound];
    averageStintLengthByCompound[compound] = Math.round(laps.reduce((a, b) => a + b, 0) / laps.length);
  }

  const compoundsUsed = Object.keys(compoundUsageCounts);
  let tyreMixSummary = "No tyre data available.";
  if (compoundsUsed.length > 0) {
    tyreMixSummary = `Compounds used: ${compoundsUsed.join(", ")}.`;
  }

  return {
    longestStint,
    shortestValidStint,
    stintsByDriver,
    compoundUsageCounts,
    averageStintLengthByCompound,
    tyreMixSummary,
  };
}
