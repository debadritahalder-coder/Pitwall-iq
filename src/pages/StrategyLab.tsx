import { FormEvent, useEffect, useState } from "react";
import ErrorFallback from "../components/ErrorFallback";
import LoadingState from "../components/LoadingState";
import { fallbackDriverStandings } from "../lib/fallbackData";
import { getDriverStandings } from "../lib/f1Api";
import { simulateStrategy } from "../lib/strategyEngine";
import type { ApiResponse, DriverStanding, StrategyInput, StrategyResult } from "../lib/types";

// Helper for tyre colors in timeline
const getTyreColor = (tyre: string) => {
  switch (tyre) {
    case "Soft": return "bg-racing border-racing/50";
    case "Medium": return "bg-gold border-gold/50";
    case "Hard": return "bg-white text-black border-white/50";
    case "Intermediate": return "bg-emerald-500 border-emerald-500/50";
    case "Wet": return "bg-blue-500 border-blue-500/50";
    default: return "bg-slate-700 text-white";
  }
};

const getRiskColor = (risk: number) => {
  if (risk < 30) return "bg-emerald-500";
  if (risk < 70) return "bg-gold";
  return "bg-racing";
};

export default function StrategyLab() {
  const [drivers, setDrivers] = useState<ApiResponse<DriverStanding[]> | null>(null);
  const [form, setForm] = useState<StrategyInput>({
    circuit: "Monza",
    driverName: fallbackDriverStandings[0].driverName,
    startingPosition: 4,
    startingTyre: "Medium",
    weather: "Dry",
    safetyCarChance: "Medium",
    pitLap: 22,
    aggressionLevel: "Balanced",
    trackPositionPriority: "Medium"
  });
  const [result, setResult] = useState<StrategyResult | null>(null);

  useEffect(() => {
    void getDriverStandings().then((data) => {
      setDrivers(data);
      setForm((current) => ({ ...current, driverName: data.data[0]?.driverName ?? current.driverName }));
    });
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(simulateStrategy(form));
  }

  const driverOptions = drivers?.data ?? fallbackDriverStandings;

  return (
    <div className="space-y-10 py-10">
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-racing">Rule-based simulator</p>
        <h1 className="mt-3 text-4xl font-black text-white sm:text-6xl">Strategy Lab</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-400">
          Build a scenario and test advanced track position, tyre, and weather assumptions against our v1.5 rule engine.
        </p>
      </section>

      {!drivers ? <LoadingState label="Loading driver list" /> : null}
      {drivers?.source === "fallback" ? <ErrorFallback message={drivers.error} /> : null}

      <section className="grid gap-6 lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr]">
        
        {/* LEFT SIDE: SCENARIO BUILDER */}
        <form className="panel flex flex-col gap-6 p-6 h-fit" onSubmit={submit}>
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-xl font-black text-white uppercase tracking-wider">Scenario Builder</h2>
            <p className="text-xs text-slate-400 mt-1">Configure telemetry variables</p>
          </div>

          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase text-slate-400">Circuit</span>
              <select className="w-full border border-white/10 bg-carbon px-4 py-3 text-white" value={form.circuit} onChange={(e) => setForm({ ...form, circuit: e.target.value })}>
                {["Monaco", "Monza", "Silverstone", "Singapore", "Spa", "Bahrain", "Abu Dhabi"].map(c => <option key={c}>{c}</option>)}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase text-slate-400">Driver</span>
              <select className="w-full border border-white/10 bg-carbon px-4 py-3 text-white" value={form.driverName} onChange={(e) => setForm({ ...form, driverName: e.target.value })}>
                {driverOptions.map((driver) => <option key={driver.driverId} value={driver.driverName}>{driver.driverName}</option>)}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase text-slate-400">Start Pos</span>
                <input className="w-full border border-white/10 bg-carbon px-4 py-3 text-white" min={1} max={20} type="number" value={form.startingPosition} onChange={(e) => setForm({ ...form, startingPosition: Number(e.target.value) })} />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase text-slate-400">Start Tyre</span>
                <select className="w-full border border-white/10 bg-carbon px-4 py-3 text-white" value={form.startingTyre} onChange={(e) => setForm({ ...form, startingTyre: e.target.value as StrategyInput["startingTyre"] })}>
                  {["Soft", "Medium", "Hard", "Intermediate", "Wet"].map(t => <option key={t}>{t}</option>)}
                </select>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase text-slate-400">Weather</span>
                <select className="w-full border border-white/10 bg-carbon px-4 py-3 text-white" value={form.weather} onChange={(e) => setForm({ ...form, weather: e.target.value as StrategyInput["weather"] })}>
                  {["Dry", "Mixed", "Wet"].map(w => <option key={w}>{w}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase text-slate-400">SC Chance</span>
                <select className="w-full border border-white/10 bg-carbon px-4 py-3 text-white" value={form.safetyCarChance} onChange={(e) => setForm({ ...form, safetyCarChance: e.target.value as StrategyInput["safetyCarChance"] })}>
                  {["Low", "Medium", "High"].map(c => <option key={c}>{c}</option>)}
                </select>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase text-slate-400">Aggression</span>
                <select className="w-full border border-white/10 bg-carbon px-4 py-3 text-white" value={form.aggressionLevel} onChange={(e) => setForm({ ...form, aggressionLevel: e.target.value as StrategyInput["aggressionLevel"] })}>
                  {["Conservative", "Balanced", "Aggressive"].map(c => <option key={c}>{c}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase text-slate-400">Track Pos. Priority</span>
                <select className="w-full border border-white/10 bg-carbon px-4 py-3 text-white" value={form.trackPositionPriority} onChange={(e) => setForm({ ...form, trackPositionPriority: e.target.value as StrategyInput["trackPositionPriority"] })}>
                  {["Low", "Medium", "High"].map(c => <option key={c}>{c}</option>)}
                </select>
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase text-slate-400">Planned Pit Lap</span>
              <input className="w-full border border-white/10 bg-carbon px-4 py-3 text-white" min={5} max={55} type="number" value={form.pitLap} onChange={(e) => setForm({ ...form, pitLap: Number(e.target.value) })} />
            </label>
          </div>

          <button className="mt-4 bg-racing hover:bg-red-700 transition-colors px-5 py-4 text-sm font-black text-white shadow-glow tracking-widest uppercase" type="submit">
            Simulate Strategy
          </button>
        </form>

        {/* RIGHT SIDE: STRATEGY READOUT */}
        <div className="space-y-6">
          {result ? (
            <div className="flex flex-col gap-6 animate-in fade-in">
              {/* Top Readout Panel */}
              <div className="panel border-t-4 border-t-racing p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-racing mb-2">Recommended Strategy</h3>
                    <p className="text-3xl sm:text-4xl font-black text-white">{result.recommendedStrategy.plan}</p>
                    <p className="text-lg font-bold text-slate-400 mt-2">{result.recommendedStrategy.pitWindow}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="inline-block bg-slate-900 border border-white/10 px-4 py-2 text-xs font-bold text-slate-300 rounded uppercase tracking-wider">
                      Risk: {result.recommendedStrategy.riskLevel}
                    </span>
                    <span className="inline-block bg-slate-900 border border-white/10 px-4 py-2 text-xs font-bold text-slate-300 rounded uppercase tracking-wider">
                      Target: {result.recommendedStrategy.projectedOutcome}
                    </span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <h4 className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500 mb-2">Pitwall Verdict</h4>
                  <p className="text-base leading-7 text-slate-300 border-l-2 border-racing pl-4">{result.pitwallVerdict}</p>
                </div>

                {/* Stint Timeline */}
                <div className="mt-8">
                  <h4 className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500 mb-4">Stint Timeline</h4>
                  <div className="flex items-center gap-1">
                    {result.stintTimeline.map((stint, idx) => (
                      stint.type === "pit" ? (
                        <div key={idx} className="flex flex-col items-center justify-center px-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mb-1" />
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">BOX</span>
                        </div>
                      ) : (
                        <div key={idx} className={`flex-1 flex items-center justify-center py-2 border rounded-sm ${getTyreColor(stint.tyre)}`}>
                          <span className="text-xs font-bold tracking-widest">{stint.tyre.toUpperCase()}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>

              {/* Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {result.strategyOptions.map((opt, idx) => (
                  <div key={idx} className="panel p-5 bg-slate-900/50 hover:bg-slate-900 transition-colors border border-white/5">
                    <h5 className="text-xs font-bold uppercase tracking-widest text-white mb-3">{opt.name}</h5>
                    <p className="text-lg font-black text-slate-200 mb-1">{opt.tyrePlan}</p>
                    <p className="text-xs font-bold text-slate-500 mb-4">{opt.pitWindow}</p>
                    
                    <div className="space-y-3 mt-4 pt-4 border-t border-white/5 text-sm">
                      <div>
                        <span className="block text-[10px] uppercase text-emerald-500 font-bold tracking-widest">Upside</span>
                        <span className="text-slate-300">{opt.upside}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase text-racing font-bold tracking-widest">Downside</span>
                        <span className="text-slate-300">{opt.downside}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Deep Analytics Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Risk Breakdown */}
                <div className="panel p-6 border border-white/5">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-racing mb-5">Risk Breakdown</h4>
                  <div className="space-y-4">
                    {Object.entries(result.riskBreakdown).map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span>{value}%</span>
                        </div>
                        <div className="h-1.5 bg-black/50 overflow-hidden rounded-full">
                          <div className={`h-full ${getRiskColor(value)}`} style={{ width: `${value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SC & Pit Window Response */}
                <div className="flex flex-col gap-4">
                  <div className="panel p-6 border border-white/5 flex-1">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-racing mb-4">Pit Window Advisor</h4>
                    <p className="text-sm font-bold text-white mb-2">Ideal Window: <span className="text-gold">{result.pitWindowAdvisor.idealWindow}</span></p>
                    <ul className="text-xs text-slate-400 space-y-2 mt-3 list-disc pl-4">
                      <li><span className="text-slate-300">Early Stop:</span> {result.pitWindowAdvisor.earlyStopRisk}</li>
                      <li><span className="text-slate-300">Late Stop:</span> {result.pitWindowAdvisor.lateStopRisk}</li>
                    </ul>
                  </div>

                  <div className="panel p-6 border border-white/5 flex-1">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-racing mb-4">Safety Car Protocols</h4>
                    <ul className="text-xs space-y-3">
                      <li>
                        <span className="block text-slate-500 font-bold uppercase mb-1">Early SC Phase</span>
                        <span className="text-slate-300">{result.safetyCarResponsePlan.early}</span>
                      </li>
                      <li>
                        <span className="block text-slate-500 font-bold uppercase mb-1">Window SC Phase</span>
                        <span className="text-emerald-400 font-bold">{result.safetyCarResponsePlan.mid}</span>
                      </li>
                      <li>
                        <span className="block text-slate-500 font-bold uppercase mb-1">Late SC Phase</span>
                        <span className="text-slate-300">{result.safetyCarResponsePlan.late}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Engine Footer */}
              <div className="text-right pb-4">
                <span className="inline-block px-3 py-1 bg-carbon text-[10px] font-mono text-slate-500 border border-white/5">
                  Rule-Based Engine v1.5 | ML-ready architecture
                </span>
              </div>
            </div>
          ) : (
            <div className="panel p-8 md:p-12 text-center h-full flex flex-col justify-center items-center border border-white/5">
              <div className="w-16 h-16 rounded-full border-2 border-white/10 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-racing mb-3">Pit Wall Console Offline</p>
              <h2 className="text-2xl font-black text-white">Awaiting Scenario Configuration</h2>
              <p className="mt-4 leading-7 text-slate-400 max-w-md mx-auto">
                Build a scenario in the left panel and click Simulate Strategy to generate a premium pit wall strategy readout.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
