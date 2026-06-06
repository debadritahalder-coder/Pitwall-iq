import type { PitStopAnalysis, StintAnalysis, StrategyEvent, RaceNarrative } from "./types";

export function generateRaceNarrative(
  pitAnalysis: PitStopAnalysis,
  stintAnalysis: StintAnalysis,
  events: StrategyEvent[]
): RaceNarrative {
  // Check if we have any data
  if (pitAnalysis.earliestStopLap === null || pitAnalysis.totalStops === 0) {
    return {
      simple: "OpenF1 data for this session is incomplete, so PitWall IQ is showing only the signals available.",
      technical: "Insufficient data points (laps/pit stops) to generate a reliable narrative.",
      dataAvailable: false,
    };
  }

  let simple = "This race may have been shaped by pit timing and tyre life. ";
  let technical = "Strategic execution appears to be defined by window optimization. ";
  let limitations = "Note: All analysis is based on available OpenF1 lap data and may not account for unrecorded race control events or undocumented damage.";

  const undercuts = events.filter((e) => e.type === "possible_undercut");
  const scPits = events.filter((e) => e.type === "safety_car_pit");

  if (scPits.length > 0) {
    simple += `The race rhythm was interrupted, and some drivers like Car ${scPits[0].driver_number} may have capitalised by pitting during the interruption. `;
    technical += `Race control interventions likely provided a cheap pit stop opportunity around lap ${scPits[0].lap}, which Car ${scPits[0].driver_number} may have leveraged to minimize pit loss time. `;
  }

  if (undercuts.length > 0) {
    simple += `A key strategic swing may have occurred around lap ${undercuts[0].lap}, where Car ${undercuts[0].driver_number} stopped for fresh tyres to potentially jump rivals. `;
    technical += `A possible undercut window opened around lap ${undercuts[0].lap}. Driver ${undercuts[0].driver_number} showed improved lap-time delta after stopping, suggesting an aggressive track position play. `;
  }

  if (pitAnalysis.medianStopLap) {
    simple += `Most of the field chose to make their stops around lap ${pitAnalysis.medianStopLap}. `;
    technical += `The field median pit window centered on lap ${pitAnalysis.medianStopLap}. `;
  }

  if (pitAnalysis.unusuallyEarlyStops.length > 0) {
    const early = pitAnalysis.unusuallyEarlyStops[0];
    simple += `Car ${early.driver_number} took an alternative route with a very early stop on lap ${early.lap_number}. `;
    technical += `Car ${early.driver_number} committed to an unusually early stop on lap ${early.lap_number}, deviating significantly from the median strategy. `;
  }

  if (stintAnalysis.longestStint) {
    const stint = stintAnalysis.longestStint;
    const length = stint.lap_end - stint.lap_start;
    simple += `We also saw possible strong tyre management, with Car ${stint.driver_number} pushing a set of tyres for ${length} laps. `;
    technical += `Tyre degradation was likely managed well by Car ${stint.driver_number}, extending a stint to ${length} laps on the ${stint.compound} compound. `;
  }

  technical += " " + limitations;

  return {
    simple: simple.trim(),
    technical: technical.trim(),
    dataAvailable: true,
  };
}
