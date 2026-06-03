import type { DriverStanding } from "./types";
import type { FullRaceResult, FullQualifyingResult } from "./f1Api";
import type { DriverIntelligence } from "./types";

function calculateMomentumScore(driver: DriverStanding, raceForm: any[], maxPoints: number) {
  const positionScore = Math.max(0, 42 - driver.position * 2.5);
  const pointsScore = maxPoints > 0 ? (driver.points / maxPoints) * 38 : 16;
  const winsScore = Math.min(driver.wins * 5, 15);
  const constructorScore = ["Red Bull", "McLaren", "Ferrari", "Mercedes"].includes(driver.constructorName) ? 5 : 0;
  
  // Recent form bonus: Look at last 3 races
  let formBonus = 0;
  const recentRaces = raceForm.slice(-3);
  for (const race of recentRaces) {
    if (race.result === "1") formBonus += 5;
    else if (["2", "3"].includes(race.result)) formBonus += 3;
    else if (parseInt(race.result) <= 10) formBonus += 1;
    else if (race.status === "DNF") formBonus -= 2;
  }

  return Math.round(Math.min(Math.max(positionScore + pointsScore + winsScore + constructorScore + formBonus, 0), 100));
}

function labelForMomentum(score: number): "Hot" | "Stable" | "Risky" | "Rebuilding" {
  if (score >= 78) return "Hot";
  if (score >= 58) return "Stable";
  if (score >= 38) return "Risky";
  return "Rebuilding";
}

function calculateStandardDeviation(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}

export function buildDriverIntelligenceData(
  standings: DriverStanding[],
  raceResults: FullRaceResult[],
  qualiResults: FullQualifyingResult[]
): DriverIntelligence[] {
  const maxPoints = Math.max(...(standings.map((d) => d.points) ?? [0]));

  // Group by constructor to easily find teammates
  const teamMap: Record<string, DriverStanding[]> = {};
  for (const driver of standings) {
    if (!teamMap[driver.constructorName]) teamMap[driver.constructorName] = [];
    teamMap[driver.constructorName].push(driver);
  }

  return standings.map((driver) => {
    // 1. Race Form
    const raceForm: DriverIntelligence["raceForm"] = [];
    let finishes: number[] = [];
    let starts: number[] = [];
    let dnfCount = 0;
    let pointsFinishes = 0;
    let totalRaceGain = 0;
    let gainRacesCount = 0;
    let placesGainedFromOutsideTop10 = 0;
    let placesLostFromTop5 = 0;

    for (const race of raceResults) {
      const driverResult = race.Results.find(r => r.Driver.driverId === driver.driverId);
      if (driverResult) {
        const startPos = parseInt(driverResult.grid) || 0;
        const finishPos = parseInt(driverResult.position) || 0;
        const isDnf = driverResult.positionText === "R" || driverResult.positionText === "W" || driverResult.status.toLowerCase().includes("retire") || driverResult.status.toLowerCase().includes("crash");
        
        const resultLabel = isDnf ? "DNF" : finishPos > 0 ? `P${finishPos}` : driverResult.positionText;

        raceForm.push({
          round: race.round,
          raceName: race.raceName,
          result: resultLabel,
          startPosition: startPos,
          finishPosition: finishPos,
          status: isDnf ? "DNF" : "Finished"
        });

        if (startPos > 0) starts.push(startPos);
        if (!isDnf && finishPos > 0) {
          finishes.push(finishPos);
          if (finishPos <= 10) pointsFinishes++;
          if (startPos > 0) {
            const gain = startPos - finishPos;
            totalRaceGain += gain;
            gainRacesCount++;

            // Pressure tracking
            if (startPos > 10 && gain > 0) placesGainedFromOutsideTop10 += gain;
            if (startPos <= 5 && gain < 0) placesLostFromTop5 += Math.abs(gain);
          }
        }
        if (isDnf) dnfCount++;
      }
    }

    // 2. Teammate Battle
    const teammates = teamMap[driver.constructorName]?.filter(d => d.driverId !== driver.driverId) || [];
    const mainTeammate = teammates[0];
    let teammateName = mainTeammate ? mainTeammate.driverName : "N/A";
    let pointsGap = 0;
    let raceHeadToHead = "0-0";
    let qualiHeadToHead = "0-0";

    if (mainTeammate) {
      pointsGap = driver.points - mainTeammate.points;
      
      let driverRaceWins = 0;
      let teammateRaceWins = 0;
      for (const race of raceResults) {
        const dRes = race.Results.find(r => r.Driver.driverId === driver.driverId);
        const tRes = race.Results.find(r => r.Driver.driverId === mainTeammate.driverId);
        if (dRes && tRes) {
          const dPos = parseInt(dRes.position) || 99;
          const tPos = parseInt(tRes.position) || 99;
          if (dPos < tPos) driverRaceWins++;
          else if (tPos < dPos) teammateRaceWins++;
        }
      }
      raceHeadToHead = `${driverRaceWins}-${teammateRaceWins}`;

      let driverQualiWins = 0;
      let teammateQualiWins = 0;
      for (const quali of qualiResults) {
        const dRes = quali.QualifyingResults.find(r => r.Driver.driverId === driver.driverId);
        const tRes = quali.QualifyingResults.find(r => r.Driver.driverId === mainTeammate.driverId);
        if (dRes && tRes) {
          const dPos = parseInt(dRes.position) || 99;
          const tPos = parseInt(tRes.position) || 99;
          if (dPos < tPos) driverQualiWins++;
          else if (tPos < dPos) teammateQualiWins++;
        }
      }
      qualiHeadToHead = qualiResults.length > 0 ? `${driverQualiWins}-${teammateQualiWins}` : "Pending";
    }

    // 3. Quali vs Race
    let avgQuali: number | "pending" = "pending";
    if (qualiResults.length > 0) {
      let qTotal = 0;
      let qCount = 0;
      for (const quali of qualiResults) {
        const dRes = quali.QualifyingResults.find(r => r.Driver.driverId === driver.driverId);
        if (dRes && parseInt(dRes.position) > 0) {
          qTotal += parseInt(dRes.position);
          qCount++;
        }
      }
      if (qCount > 0) avgQuali = Math.round((qTotal / qCount) * 10) / 10;
    } else if (starts.length > 0) {
      avgQuali = Math.round((starts.reduce((a, b) => a + b, 0) / starts.length) * 10) / 10;
    }

    const avgFinish = finishes.length > 0 ? Math.round((finishes.reduce((a, b) => a + b, 0) / finishes.length) * 10) / 10 : "pending";
    const avgRaceGain = gainRacesCount > 0 ? Math.round((totalRaceGain / gainRacesCount) * 10) / 10 : "pending";

    // 4. Consistency
    // Start with a base of 60. Max 100.
    // +2 for every points finish.
    // -5 for every DNF.
    // - (stdDev * 1.5) for high variance.
    let consistencyScore = 50;
    const stdDev = calculateStandardDeviation(finishes);
    if (finishes.length > 0) {
      consistencyScore = 70 + (pointsFinishes * 3) - (dnfCount * 6) - (stdDev * 1.5);
    }
    consistencyScore = Math.round(Math.max(10, Math.min(100, consistencyScore)));
    
    let consistencyLabel = "Unknown";
    if (consistencyScore >= 80) consistencyLabel = "Clinical";
    else if (consistencyScore >= 60) consistencyLabel = "Stable";
    else if (consistencyScore >= 40) consistencyLabel = "Volatile";
    else consistencyLabel = "Erratic";

    // 5. Pressure Index
    // Focuses on performance when starting out of position or avoiding errors.
    let pressureScore = 50;
    let pressureLabel = "Pending";
    let pressureBasis = "Insufficient data to determine pressure performance.";

    if (finishes.length > 0 || dnfCount > 0) {
      // Base score 60.
      // High gains from outside top 10 improves score.
      // Losses from top 5 hurts score.
      // DNFs hurt score.
      pressureScore = 60 + (placesGainedFromOutsideTop10 * 1.5) - (placesLostFromTop5 * 2) - (dnfCount * 5);
      pressureScore = Math.round(Math.max(10, Math.min(100, pressureScore)));

      if (pressureScore >= 80) {
        pressureLabel = "Composed";
        pressureBasis = "Consistently recovers positions and rarely drops places when starting at the front.";
      } else if (placesGainedFromOutsideTop10 > 10) {
        pressureLabel = "Opportunistic";
        pressureBasis = "Excels at fighting through the pack and recovering from poor starting positions.";
      } else if (pressureScore < 40 || dnfCount > 2) {
        pressureLabel = "Error-prone";
        pressureBasis = "Frequent race-ending incidents or drops positions when starting in high-pressure slots.";
      } else if (placesLostFromTop5 > 5) {
        pressureLabel = "Risk-heavy";
        pressureBasis = "Takes risks that often result in losing track position in critical moments.";
      } else {
        pressureLabel = "Neutral";
        pressureBasis = "Performs generally as expected given the car's qualifying pace.";
      }
    }

    const momentum = calculateMomentumScore(driver, raceForm, maxPoints);

    return {
      driverId: driver.driverId,
      fullName: driver.driverName,
      team: driver.constructorName,
      points: driver.points,
      wins: driver.wins,
      momentum: momentum,
      status: labelForMomentum(momentum),
      raceForm,
      teammateBattle: {
        teammateName,
        pointsGap,
        raceHeadToHead,
        qualiHeadToHead
      },
      qualiVsRace: {
        averageQualifying: avgQuali,
        averageFinish: avgFinish,
        averageRaceGain: avgRaceGain
      },
      consistency: {
        score: consistencyScore,
        label: consistencyLabel,
        dnfCount,
        pointsFinishes
      },
      pressure: {
        score: pressureScore,
        label: pressureLabel,
        basis: pressureBasis
      }
    };
  });
}
