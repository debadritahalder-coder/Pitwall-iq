import type { OpenF1PitStop, OpenF1RaceControl, OpenF1Lap, OpenF1Position } from "../api/apiTypes";
import type { StrategyEvent } from "./types";

export function detectStrategyEvents(
  pitStops: OpenF1PitStop[],
  raceControl: OpenF1RaceControl[],
  laps: OpenF1Lap[],
  positions: OpenF1Position[] = []
): StrategyEvent[] {
  const events: StrategyEvent[] = [];

  if (!pitStops || pitStops.length === 0) return events;

  const validPitStops = pitStops.filter((stop): stop is OpenF1PitStop & { driver_number: number; lap_number: number } => 
    typeof stop.driver_number === 'number' && typeof stop.lap_number === 'number'
  );
  
  if (!laps || laps.length === 0) {
    events.push({
      type: "traffic_risk", // just a fallback type
      driver_number: 0,
      lap: 0,
      description: "Insufficient lap data for detailed strategy analysis.",
      confidence: "low"
    });
    return events;
  }

  const validLaps = laps.filter((lap): lap is OpenF1Lap & { driver_number: number; lap_number: number; lap_duration: number } => 
    typeof lap.driver_number === 'number' && typeof lap.lap_number === 'number' && typeof lap.lap_duration === 'number'
  );

  // Group laps by driver
  const driverLaps: Record<number, typeof validLaps> = {};
  validLaps.forEach(lap => {
    if (!driverLaps[lap.driver_number]) driverLaps[lap.driver_number] = [];
    driverLaps[lap.driver_number].push(lap);
  });

  // Find SC/VSC periods
  const scEvents = raceControl.filter((rc) => 
    rc.category?.toLowerCase().includes("safety") || 
    rc.message?.toLowerCase().includes("safety car") || 
    rc.message?.toLowerCase().includes("vsc")
  );

  const getSCLaps = () => {
    const scLaps = new Set<number>();
    scEvents.forEach(sc => {
      if (typeof sc.lap_number === 'number') {
        scLaps.add(sc.lap_number);
        scLaps.add(sc.lap_number + 1);
        scLaps.add(sc.lap_number + 2);
      }
    });
    return scLaps;
  };
  const scLapsSet = getSCLaps();

  // Helper to calculate baseline pace excluding pit laps and SC laps
  const calculateBaselinePace = (dLaps: typeof validLaps, startLap: number, endLap: number, excludePitLaps: number[]) => {
    const baselineLaps = dLaps.filter(l => 
      l.lap_number >= startLap && 
      l.lap_number <= endLap &&
      !excludePitLaps.includes(l.lap_number) &&
      !scLapsSet.has(l.lap_number)
    );
    if (baselineLaps.length === 0) return null;
    return baselineLaps.reduce((sum, l) => sum + l.lap_duration, 0) / baselineLaps.length;
  };

  // 1. Safety Car / VSC Pit Opportunities
  scEvents.forEach((sc) => {
    validPitStops.forEach((stop) => {
      if (typeof sc.lap_number === 'number' && stop.lap_number >= sc.lap_number && stop.lap_number <= sc.lap_number + 2) {
        events.push({
          type: "safety_car_pit",
          driver_number: stop.driver_number,
          lap: stop.lap_number,
          description: `Driver ${stop.driver_number} likely reduced effective pit-loss by pitting under SC/VSC conditions around lap ${stop.lap_number}.`,
          confidence: "high"
        });
      }
    });
  });

  // 2. Traffic Risk
  validPitStops.forEach(stop => {
    const dLaps = driverLaps[stop.driver_number] || [];
    const outLap = dLaps.find(l => l.lap_number === stop.lap_number + 1);
    const nextLap = dLaps.find(l => l.lap_number === stop.lap_number + 2);
    
    if (outLap && nextLap && !scLapsSet.has(stop.lap_number + 2)) {
      const avgBefore = calculateBaselinePace(dLaps, stop.lap_number - 5, stop.lap_number - 1, [stop.lap_number]);
      if (avgBefore && nextLap.lap_duration > avgBefore + 1.5) { 
        events.push({
          type: "traffic_risk",
          driver_number: stop.driver_number,
          lap: stop.lap_number,
          description: `Driver ${stop.driver_number} showed significantly slower pace immediately after their lap ${stop.lap_number} stop, suggesting possible traffic on exit.`,
          confidence: "medium"
        });
      }
    }
  });

  // 3. Possible Undercut Attempts (Strict Check)
  // Check if Driver A pit, and Driver B pit 1-2 laps later
  validPitStops.forEach(stopA => {
    const laterStops = validPitStops.filter(stopB => 
      stopB.driver_number !== stopA.driver_number &&
      stopB.lap_number > stopA.lap_number && 
      stopB.lap_number <= stopA.lap_number + 2
    );

    if (laterStops.length > 0) {
      const dLapsA = driverLaps[stopA.driver_number] || [];
      const avgBeforeA = calculateBaselinePace(dLapsA, stopA.lap_number - 4, stopA.lap_number - 1, [stopA.lap_number]);
      const avgAfterA = calculateBaselinePace(dLapsA, stopA.lap_number + 2, stopA.lap_number + 4, [stopA.lap_number]);
      
      // If Driver A improved pace after pitting
      if (avgBeforeA && avgAfterA && avgAfterA < avgBeforeA - 1.0) {
        let gainedPosition = false;
        const driversB = laterStops.map(s => `Driver ${s.driver_number}`).join(", ");
        
        // If positions are available, verify if A gained on any of B
        if (positions && positions.length > 0) {
          // Find A's pos before stop
          const posABefore = positions.find(p => p.driver_number === stopA.driver_number && new Date(p.date).getTime() < new Date(dLapsA.find(l => l.lap_number === stopA.lap_number)?.date_start || "").getTime())?.position;
          
          laterStops.forEach(stopB => {
            const dLapsB = driverLaps[stopB.driver_number] || [];
            // Find B's pos before stop
            const posBBefore = positions.find(p => p.driver_number === stopB.driver_number && new Date(p.date).getTime() < new Date(dLapsB.find(l => l.lap_number === stopB.lap_number)?.date_start || "").getTime())?.position;
            // Find both pos after B's stop
            const posAAfter = positions.find(p => p.driver_number === stopA.driver_number && new Date(p.date).getTime() > new Date(dLapsB.find(l => l.lap_number === stopB.lap_number)?.date_start || "").getTime())?.position;
            const posBAfter = positions.find(p => p.driver_number === stopB.driver_number && new Date(p.date).getTime() > new Date(dLapsB.find(l => l.lap_number === stopB.lap_number)?.date_start || "").getTime())?.position;
            
            // If B was ahead of A before A's stop, and A is ahead of B after B's stop
            if (posABefore && posBBefore && posAAfter && posBAfter) {
              if (posBBefore < posABefore && posAAfter < posBAfter) {
                gainedPosition = true;
              }
            }
          });
          
          if (gainedPosition) {
             events.push({
               type: "possible_undercut",
               driver_number: stopA.driver_number,
               lap: stopA.lap_number,
               description: `Driver ${stopA.driver_number} successfully undercut ${driversB} by pitting early on lap ${stopA.lap_number} and gaining track position.`,
               confidence: "high"
             });
          } else {
             // We have position data but no position was gained (or we couldn't confidently parse it due to timestamps)
             events.push({
               type: "possible_undercut",
               driver_number: stopA.driver_number,
               lap: stopA.lap_number,
               description: `Driver ${stopA.driver_number} pitted early on lap ${stopA.lap_number} and improved pace, attempting an undercut against ${driversB}, but did not immediately gain position.`,
               confidence: "medium"
             });
          }
        } else {
          // No position data available, just detect pit timing
          events.push({
            type: "possible_undercut",
            driver_number: stopA.driver_number,
            lap: stopA.lap_number,
            description: `Driver ${stopA.driver_number} pitted early on lap ${stopA.lap_number} and improved pace, suggesting a possible undercut attempt against ${driversB} who pitted shortly after.`,
            confidence: "medium"
          });
        }
      }
    }
  });

  // 4. Possible Overcut Attempts
  validPitStops.forEach(stopA => {
    // Check if Driver A extended stint while others pitted
    const earlierStops = validPitStops.filter(stopB => 
      stopB.driver_number !== stopA.driver_number &&
      stopB.lap_number < stopA.lap_number && 
      stopB.lap_number >= stopA.lap_number - 3
    );

    if (earlierStops.length >= 2) {
      const dLapsA = driverLaps[stopA.driver_number] || [];
      const avgPaceWhileOthersPit = calculateBaselinePace(dLapsA, stopA.lap_number - 3, stopA.lap_number - 1, [stopA.lap_number]);
      const avgEarlierPace = calculateBaselinePace(dLapsA, stopA.lap_number - 7, stopA.lap_number - 4, [stopA.lap_number]);

      // If Driver A maintained pace while others pitted
      if (avgPaceWhileOthersPit && avgEarlierPace && avgPaceWhileOthersPit <= avgEarlierPace + 0.5) {
        events.push({
          type: "possible_overcut",
          driver_number: stopA.driver_number,
          lap: stopA.lap_number,
          description: `Driver ${stopA.driver_number} extended their stint to lap ${stopA.lap_number} while maintaining steady pace, suggesting a possible overcut strategy based on available data.`,
          confidence: "medium"
        });
      }
    }
  });

  // Remove duplicates simply
  const uniqueEvents = events.filter((v, i, a) => a.findIndex(t => (t.type === v.type && t.driver_number === v.driver_number && t.lap === v.lap)) === i);
  
  return uniqueEvents;
}
