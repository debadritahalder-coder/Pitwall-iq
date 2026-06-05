import type { StrategyResult } from "../lib/types";

export default function StrategyResultCard({ result }: { result: StrategyResult }) {
  return (
    <article className="panel border-racing/40 p-6 shadow-glow">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-racing">Simulation Result</p>
      <h3 className="mt-3 text-2xl font-black text-white">{result.recommendedStrategy.plan}</h3>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-sm text-slate-500">Pit window</p>
          <p className="font-black text-white">{result.recommendedStrategy.pitWindow}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Risk</p>
          <p className="font-black text-gold">{result.recommendedStrategy.riskLevel}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Target</p>
          <p className="font-black text-white">{result.recommendedStrategy.projectedOutcome}</p>
        </div>
      </div>
      <p className="mt-6 text-sm leading-6 text-slate-300">{result.pitwallVerdict}</p>
    </article>
  );
}
