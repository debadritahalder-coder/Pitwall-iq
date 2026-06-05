import type { OpenF1PitStop, OpenF1RaceControl, OpenF1Lap } from "../api/apiTypes";
import type { StrategyEvent } from "./types";

export function detectStrategyEvents(
  pitStops: OpenF1PitStop[],
  raceControl: OpenF1RaceControl[],
  laps: OpenF1Lap[]
): StrategyEvent[] {
  const events: StrategyEvent[] = [];

  if (!pitStops || pitStops.length === 0) return events;

  const validPitStops = pitStops.filter((stop): stop is OpenF1PitStop & { driver_number: number; lap_number: number } => 
    typeof stop.driver_number === 'number' && typeof stop.lap_number === 'number'
  );
  
  const validLaps = laps.filter((lap): lap is OpenF1Lap & { driver_number: number; lap_number: number; lap_duration: number } => 
    typeof lap.driver_number === 'number' && typeof lap.lap_number === 'number' && typeof lap.lap_duration === 'number'
  );

  // 1. Safety Car / VSC Pit Opportunities
  // Find SC/VSC periods
  const scEvents = raceControl.filter((rc) => 
    rc.category === "SafetyCar" || 
    rc.message?.toLowerCase().includes("safety car") || 
    rc.message?.toLowerCase().includes("vsc")
  );

  scEvents.forEach((sc) => {
    // If a pit stop happened within 2 laps of this event
    validPitStops.forEach((stop) => {
      if (typeof sc.lap_number === 'number' && stop.lap_number >= sc.lap_number && stop.lap_number <= sc.lap_number + 2) {
        events.push({
          type: "safety_car_pit",
          driver_number: stop.driver_number,
          lap: stop.lap_number,
          description: `Driver ${stop.driver_number} likely gained an advantage by pitting under SC/VSC conditions on lap ${stop.lap_number}.`,
          confidence: "medium"
        });
      }
    });
  });

  // 2. Traffic Risk (very simple heuristic: slow lap immediately after pit out)
  // Group laps by driver
  const driverLaps: Record<number, typeof validLaps> = {};
  validLaps.forEach(lap => {
    if (!driverLaps[lap.driver_number]) driverLaps[lap.driver_number] = [];
    driverLaps[lap.driver_number].push(lap);
  });

  validPitStops.forEach(stop => {
    const dLaps = driverLaps[stop.driver_number] || [];
    const outLap = dLaps.find(l => l.lap_number === stop.lap_number + 1);
    const nextLap = dLaps.find(l => l.lap_number === stop.lap_number + 2);
    
    // If lap after outlap is unusually slow compared to their average, might be traffic
    if (outLap && nextLap) {
      // Find a baseline from 3 laps before the stop
      const beforeLaps = dLaps.filter(l => l.lap_number >= stop.lap_number - 4 && l.lap_number < stop.lap_number);
      if (beforeLaps.length > 0) {
        const avgBefore = beforeLaps.reduce((sum, l) => sum + l.lap_duration, 0) / beforeLaps.length;
        if (nextLap.lap_duration > avgBefore + 2.0) { // 2 seconds slower than old tyres
          events.push({
            type: "traffic_risk",
            driver_number: stop.driver_number,
            lap: stop.lap_number,
            description: `Driver ${stop.driver_number} showed slower pace immediately after their lap ${stop.lap_number} stop, suggesting possible traffic on exit.`,
            confidence: "low"
          });
        }
      }
    }
  });

  // 3. Possible Undercut Candidates
  // Pit stop -> next laps are significantly faster than previous laps
  validPitStops.forEach(stop => {
    const dLaps = driverLaps[stop.driver_number] || [];
    const beforeLaps = dLaps.filter(l => l.lap_number >= stop.lap_number - 4 && l.lap_number < stop.lap_number);
    const afterLaps = dLaps.filter(l => l.lap_number > stop.lap_number + 1 && l.lap_number <= stop.lap_number + 4);

    if (beforeLaps.length > 0 && afterLaps.length > 0) {
      const avgBefore = beforeLaps.reduce((sum, l) => sum + l.lap_duration, 0) / beforeLaps.length;
      const avgAfter = afterLaps.reduce((sum, l) => sum + l.lap_duration, 0) / afterLaps.length;

      if (avgAfter < avgBefore - 1.5) { // 1.5s faster per lap
        events.push({
          type: "possible_undercut",
          driver_number: stop.driver_number,
          lap: stop.lap_number,
          description: `Driver ${stop.driver_number} showed a significant pace improvement after stopping on lap ${stop.lap_number}, opening a possible undercut window.`,
          confidence: "medium"
        });
      }
    }
  });

  // Remove duplicates simply
  const uniqueEvents = events.filter((v, i, a) => a.findIndex(t => (t.type === v.type && t.driver_number === v.driver_number && t.lap === v.lap)) === i);
  
  return uniqueEvents;
}
