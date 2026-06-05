import { useEffect, useState } from "react";
import ErrorFallback from "../components/ErrorFallback";
import LoadingState from "../components/LoadingState";
import StatCard from "../components/StatCard";
import DriverIntelligenceRow from "../components/DriverIntelligenceRow";
import { getDriverStandings, getAllRaceResults, getAllQualifyingResults } from "../lib/f1Api";
import { buildDriverIntelligenceData } from "../lib/driverIntelligence";
import type { DriverIntelligence } from "../lib/types";

export default function Drivers() {
  const [intelligenceData, setIntelligenceData] = useState<DriverIntelligence[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void Promise.all([
      getDriverStandings(),
      getAllRaceResults(),
      getAllQualifyingResults()
    ]).then(([standingsRes, raceRes, qualiRes]) => {
      if (standingsRes.source === "fallback" && standingsRes.error) {
        setError(standingsRes.error);
      }
      const data = buildDriverIntelligenceData(standingsRes.data, raceRes.data, qualiRes.data);
      // Sort by points to ensure correct ranking order
      data.sort((a, b) => b.points - a.points);
      setIntelligenceData(data);
    });
  }, []);

  if (!intelligenceData) {
    return <LoadingState label="Loading driver intelligence..." />;
  }

  const best = [...intelligenceData].sort((a, b) => b.momentum - a.momentum)[0];
  const consistent = intelligenceData.find((item) => item.status === "Stable") ?? intelligenceData[1];
  
  // Find a driver outside the top 5 with high momentum
  const darkHorseRankIndex = intelligenceData.findIndex(item => {
    const isOutsideTop5 = intelligenceData.indexOf(item) >= 5;
    return isOutsideTop5;
  });
  
  const darkHorsePool = darkHorseRankIndex >= 0 ? intelligenceData.slice(darkHorseRankIndex) : intelligenceData;
  const darkHorse = [...darkHorsePool].sort((a, b) => b.momentum - a.momentum)[0] ?? intelligenceData[intelligenceData.length - 1];

  return (
    <div className="space-y-10 py-10">
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-racing">Driver intelligence</p>
        <h1 className="mt-3 text-4xl font-black text-white sm:text-6xl">Driver Form Tracker</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-400">Standings show points. Form shows momentum.</p>
      </section>

      {error ? <ErrorFallback message={error} /> : null}

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Best current momentum" value={best?.fullName ?? "TBC"} detail={`${best?.momentum ?? 0}/100`} accent="green" />
        <StatCard label="Most consistent contender" value={consistent?.fullName ?? "TBC"} detail={consistent?.status} accent="blue" />
        <StatCard label="Biggest dark horse" value={darkHorse?.fullName ?? "TBC"} detail={`Rank ${intelligenceData.indexOf(darkHorse) + 1}`} accent="gold" />
      </section>

      {/* NEW: Driver Intelligence Hub replacing the grid */}
      <section className="mt-16">
        <div className="mb-6 border-b border-white/10 pb-4">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-racing mb-2">Analytics Engine</p>
          <h2 className="text-2xl font-black text-white">DRIVER INTELLIGENCE HUB</h2>
          <p className="text-sm text-slate-400 mt-1">Deep analysis computed from live season data. Click a driver to view advanced metrics.</p>
          
          <details className="mt-4 bg-white/5 border border-white/10 p-4 cursor-pointer group">
            <summary className="text-sm font-bold text-white uppercase tracking-wider outline-none group-hover:text-racing transition">Methodology</summary>
            <div className="mt-4 text-sm text-slate-300 space-y-3 cursor-text">
              <p><strong className="text-white">Momentum:</strong> A weighted rolling average of recent race finishes. Higher scores mean better recent form.</p>
              <p><strong className="text-white">Consistency:</strong> Calculated based on the percentage of points finishes and lack of DNFs.</p>
              <p><strong className="text-white">Pressure Scoring:</strong> An evaluation combining recent performance dips, teammate point gaps, and historical expectation baselines. Higher pressure implies the driver needs to deliver results soon.</p>
            </div>
          </details>
        </div>
        
        <div className="panel overflow-hidden p-0 bg-slate-950">
          <div className="flex flex-col">
            {intelligenceData.map((driver, index) => (
              <DriverIntelligenceRow key={driver.driverId} data={driver} rank={index + 1} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
