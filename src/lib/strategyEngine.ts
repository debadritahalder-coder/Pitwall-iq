import type { StrategyInput, StrategyResult } from "./types";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function simulateStrategy(input: StrategyInput): StrategyResult {
  const tyreRisk = { Soft: 18, Medium: 9, Hard: 5 }[input.startingTyre];
  const weatherRisk = { Dry: 4, Mixed: 18, Wet: 28 }[input.weather];
  const safetyRisk = { Low: 5, Medium: 13, High: 22 }[input.safetyCarChance];
  const positionPressure = clamp(input.startingPosition - 5, 0, 15);
  const earlyStopRisk = input.pitLap < 15 ? 12 : 0;
  const lateStopRisk = input.pitLap > 34 ? 14 : 0;

  const riskScore = clamp(tyreRisk + weatherRisk + safetyRisk + positionPressure + earlyStopRisk + lateStopRisk, 8, 100);

  const secondTyre = input.weather === "Wet" ? "Intermediate/Wet" : input.startingTyre === "Soft" ? "Medium" : "Hard";
  const windowStart = clamp(input.pitLap - 3, 8, 45);
  const windowEnd = clamp(input.pitLap + 4, windowStart + 2, 52);
  const finishFloor = clamp(input.startingPosition - (riskScore < 45 ? 2 : 0), 1, 20);
  const finishCeiling = clamp(input.startingPosition + Math.ceil(riskScore / 22), finishFloor, 20);

  const explanationByTyre = {
    Soft: "Starting on Soft tyres creates strong launch pace, but the first stint needs careful management to avoid early degradation.",
    Medium: "Starting on Medium tyres gives a balanced first stint with enough flexibility to react to traffic and undercut threats.",
    Hard: "Starting on Hard tyres lowers early degradation risk and can open a longer first stint if the race stays calm.",
  };

  const weatherNote =
    input.weather === "Dry"
      ? "In dry conditions, clean air and tyre temperature should be the main focus."
      : "With uncertain weather, keeping the stop flexible matters more than chasing a perfect lap number.";

  return {
    recommendedStrategy: `${input.startingTyre} -> ${secondTyre}`,
    pitWindow: `Lap ${windowStart}-${windowEnd}`,
    riskScore,
    expectedFinishRange: `P${finishFloor}-P${finishCeiling}`,
    explanation: `${explanationByTyre[input.startingTyre]} If ${input.driverName} pits between Lap ${windowStart} and ${windowEnd}, they can limit tyre fade while reducing the chance of being undercut by cars behind. ${weatherNote}`,
  };
}
