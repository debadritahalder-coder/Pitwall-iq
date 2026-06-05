import type { StrategyInput, StrategyResult, StrategyOption } from "./types";

export type CircuitProfile = {
  name: string;
  overtakingDifficulty: "low" | "medium" | "high" | "very high";
  tyreDegradation: "low" | "medium" | "high";
  safetyCarChance: "low" | "medium" | "high";
  pitLoss: "low" | "medium" | "high";
  weatherVolatility: "low" | "medium" | "high";
  strategyNote: string;
};

const circuitProfiles: Record<string, CircuitProfile> = {
  "Monaco": { name: "Monaco", overtakingDifficulty: "very high", tyreDegradation: "low", safetyCarChance: "high", pitLoss: "high", weatherVolatility: "low", strategyNote: "Track position is critical. Undercut is powerful but traffic ruins it." },
  "Monza": { name: "Monza", overtakingDifficulty: "medium", tyreDegradation: "medium", safetyCarChance: "medium", pitLoss: "medium", weatherVolatility: "low", strategyNote: "Straight-line pace and undercut matter. One-stop is standard." },
  "Silverstone": { name: "Silverstone", overtakingDifficulty: "medium", tyreDegradation: "high", safetyCarChance: "medium", pitLoss: "medium", weatherVolatility: "medium", strategyNote: "High speed corners punish front left tyre. Two-stop often viable." },
  "Singapore": { name: "Singapore", overtakingDifficulty: "high", tyreDegradation: "medium", safetyCarChance: "high", pitLoss: "high", weatherVolatility: "medium", strategyNote: "Safety cars routinely reshape the race. Track position is king." },
  "Spa": { name: "Spa", overtakingDifficulty: "medium", tyreDegradation: "medium", safetyCarChance: "medium", pitLoss: "medium", weatherVolatility: "high", strategyNote: "Weather risk matters. Long lap means pitting for wrong tyre is disastrous." },
  "Bahrain": { name: "Bahrain", overtakingDifficulty: "medium", tyreDegradation: "high", safetyCarChance: "medium", pitLoss: "medium", weatherVolatility: "low", strategyNote: "Rear tyre degradation is severe. Undercut is extremely powerful." },
  "Abu Dhabi": { name: "Abu Dhabi", overtakingDifficulty: "medium", tyreDegradation: "medium", safetyCarChance: "medium", pitLoss: "medium", weatherVolatility: "low", strategyNote: "Pit timing and track position matter. Hard to pass in sector 3." }
};

export function getCircuitProfile(name: string): CircuitProfile {
  return circuitProfiles[name] || circuitProfiles["Silverstone"];
}

function calculateRiskBreakdown(input: StrategyInput, circuit: CircuitProfile) {
  // ML-Ready: This function can be replaced by an ML inference model that predicts risk percentages based on live telemetry.
  
  let tyreRisk = input.startingTyre === "Soft" ? 75 : input.startingTyre === "Medium" ? 40 : 15;
  if (circuit.tyreDegradation === "high") tyreRisk += 20;
  if (input.weather === "Wet") tyreRisk = 80;

  let trafficRisk = input.startingPosition > 10 ? 70 : input.startingPosition > 5 ? 40 : 10;
  if (input.pitLap < 15) trafficRisk += 25;

  let scUpside = circuit.safetyCarChance === "high" ? 85 : circuit.safetyCarChance === "medium" ? 50 : 20;
  if (input.weather !== "Dry") scUpside = Math.min(100, scUpside + 30);

  let weatherRisk = input.weather === "Mixed" ? 90 : input.weather === "Wet" ? 60 : 10;
  if (circuit.weatherVolatility === "high" && input.weather === "Dry") weatherRisk = 40;

  let undercut = circuit.tyreDegradation === "high" ? 80 : 40;
  if (input.startingTyre === "Hard") undercut -= 20;

  let trackPosRisk = circuit.overtakingDifficulty === "very high" ? 90 : circuit.overtakingDifficulty === "high" ? 70 : 40;
  if (input.trackPositionPriority === "High") trackPosRisk += 15;

  const clamp = (val: number) => Math.max(5, Math.min(95, val));

  return {
    tyreRisk: clamp(tyreRisk),
    trafficRisk: clamp(trafficRisk),
    safetyCarUpside: clamp(scUpside),
    weatherRisk: clamp(weatherRisk),
    undercutPotential: clamp(undercut),
    trackPositionRisk: clamp(trackPosRisk)
  };
}

function calculatePitWindow(input: StrategyInput, circuit: CircuitProfile) {
  let idealStart = 18;
  let idealEnd = 24;

  if (input.startingTyre === "Soft") {
    idealStart = 12;
    idealEnd = 18;
  } else if (input.startingTyre === "Hard") {
    idealStart = 28;
    idealEnd = 36;
  } else if (input.weather !== "Dry") {
    idealStart = 25;
    idealEnd = 35;
  }

  if (circuit.tyreDegradation === "high") {
    idealStart -= 3;
    idealEnd -= 3;
  }

  if (input.aggressionLevel === "Aggressive") {
    idealStart -= 2;
    idealEnd -= 2;
  } else if (input.aggressionLevel === "Conservative") {
    idealStart += 2;
    idealEnd += 2;
  }

  return { idealStart, idealEnd };
}

function buildStrategyComparison(input: StrategyInput, circuit: CircuitProfile, windowStart: number): StrategyOption[] {
  const secondTyre = input.startingTyre === "Soft" ? "Hard" : input.startingTyre === "Hard" ? "Medium" : "Hard";
  
  return [
    {
      name: "Conservative Strategy",
      tyrePlan: `${input.startingTyre} → ${secondTyre}`,
      pitWindow: `Lap ${windowStart + 2} - ${windowStart + 6}`,
      riskLevel: "Low",
      upside: "Guaranteed track position, avoids early traffic.",
      downside: "Vulnerable to undercut from aggressive cars behind."
    },
    {
      name: "Aggressive Strategy",
      tyrePlan: `${input.startingTyre} → ${secondTyre === 'Hard' ? 'Medium' : 'Soft'} → Soft`,
      pitWindow: `Lap ${Math.max(5, windowStart - 4)} - ${windowStart}`,
      riskLevel: "High",
      upside: "Massive undercut potential and pace advantage.",
      downside: "Forces a two-stop; requires passing on track."
    },
    {
      name: "Safety Car Gamble",
      tyrePlan: `${input.startingTyre} (Extended)`,
      pitWindow: `Wait for SC`,
      riskLevel: "Extreme",
      upside: "Saves ~12 seconds in pit lane if SC deployed.",
      downside: "Massive tyre cliff if race stays green."
    }
  ];
}

function buildSafetyCarPlan(input: StrategyInput, circuit: CircuitProfile) {
  const earlyLaps = `Before Lap ${input.pitLap - 5}`;
  const midLaps = `Lap ${input.pitLap - 5} - ${input.pitLap + 5}`;
  const lateLaps = `After Lap ${input.pitLap + 5}`;

  return {
    early: `Stay out. Pitting now forces an unviable long final stint, unless tyre damage is critical.`,
    mid: `BOX IMMEDIATELY. This is the optimal window to take a cheap pit stop and switch to the final tyre.`,
    late: `If track position allows a free stop, box for Softs to secure fastest lap and late-race pace.`
  };
}

function generatePitwallVerdict(input: StrategyInput, circuit: CircuitProfile, windowStart: number, windowEnd: number) {
  let verdict = `This is a ${input.aggressionLevel.toLowerCase()} strategy favoring a ${input.startingTyre} tyre start. `;
  
  if (circuit.overtakingDifficulty === "very high" || circuit.overtakingDifficulty === "high") {
    verdict += `Because overtaking is difficult at ${input.circuit}, protecting track position is paramount. `;
  }
  
  if (input.weather === "Mixed") {
    verdict += `However, mixed weather makes the pit window extremely volatile. Do not box until crossover times are confirmed. `;
  } else {
    verdict += `The data suggests boxing between Lap ${windowStart} and ${windowEnd} minimizes traffic risk while avoiding the tyre cliff. `;
  }

  if (circuit.safetyCarChance === "high") {
    verdict += `Be prepared to pivot instantly if a Safety Car is deployed.`;
  }

  return verdict;
}

export function simulateStrategy(input: StrategyInput): StrategyResult {
  const circuit = getCircuitProfile(input.circuit);
  const risks = calculateRiskBreakdown(input, circuit);
  const { idealStart, idealEnd } = calculatePitWindow(input, circuit);
  
  const secondTyre = input.weather === "Wet" || input.weather === "Mixed" 
    ? "Intermediate" 
    : input.startingTyre === "Soft" ? "Medium" : "Hard";

  const isAggressive = input.aggressionLevel === "Aggressive";
  const projectedOutcome = isAggressive ? "High variance (±3 positions)" : "Hold position / possible +1 gain";
  const overallRisk = risks.tyreRisk + risks.weatherRisk > 130 ? "High" : risks.trafficRisk > 60 ? "Medium" : "Low";

  // Timeline generation
  const stintTimeline = [
    { tyre: input.startingTyre, startLap: 1, endLap: input.pitLap, type: "stint" as const },
    { tyre: "Pit", startLap: input.pitLap, endLap: input.pitLap, type: "pit" as const },
    { tyre: secondTyre, startLap: input.pitLap + 1, endLap: 50, type: "stint" as const }
  ];

  return {
    recommendedStrategy: {
      plan: `${input.startingTyre} → ${secondTyre}`,
      pitWindow: `Lap ${idealStart}–${idealEnd}`,
      riskLevel: overallRisk,
      projectedOutcome
    },
    pitwallVerdict: generatePitwallVerdict(input, circuit, idealStart, idealEnd),
    strategyOptions: buildStrategyComparison(input, circuit, idealStart),
    stintTimeline,
    riskBreakdown: risks,
    pitWindowAdvisor: {
      idealWindow: `Lap ${idealStart}–${idealEnd}`,
      earlyStopRisk: circuit.tyreDegradation === "high" ? "High degradation in final stint." : "Traffic after pit exit.",
      lateStopRisk: "Severe tyre cliff and high undercut vulnerability."
    },
    safetyCarResponsePlan: buildSafetyCarPlan(input, circuit)
  };
}
