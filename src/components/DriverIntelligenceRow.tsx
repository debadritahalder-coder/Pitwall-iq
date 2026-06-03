import { useState } from "react";
import type { DriverIntelligence } from "../lib/types";

const labelClass = {
  Hot: "bg-emerald-400/15 text-emerald-300",
  Stable: "bg-electric/15 text-sky-300",
  Risky: "bg-orange-400/15 text-orange-300",
  Rebuilding: "bg-slate-400/15 text-slate-300",
};

const pressureLabelClass = {
  "Composed": "text-emerald-400",
  "Opportunistic": "text-blue-400",
  "Neutral": "text-slate-300",
  "Risk-heavy": "text-orange-400",
  "Error-prone": "text-red-400",
  "Pending": "text-slate-500",
};

export default function DriverIntelligenceRow({ data, rank }: { data: DriverIntelligence; rank: number }) {
  const [expanded, setExpanded] = useState(false);

  // Format race form for the compact view (show last 5)
  const recentForm = data.raceForm.slice(-5).map(r => r.result).join(" · ") || "Data pending";

  return (
    <article className={`border border-white/5 bg-slate-900/40 transition-colors hover:bg-slate-900/60 ${expanded ? 'border-racing/30' : ''}`}>
      {/* Compact Row */}
      <div 
        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 cursor-pointer gap-4"
        onClick={() => setExpanded(!expanded)}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setExpanded(!expanded);
          }
        }}
      >
        <div className="flex items-center gap-4 sm:w-1/3">
          <span className="text-xl font-black text-slate-500 w-6">{rank}</span>
          <div>
            <h3 className="text-lg font-black text-white">{data.fullName}</h3>
            <p className="text-xs text-slate-400">{data.team}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 sm:w-1/3 justify-between sm:justify-start">
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Points</p>
            <p className="font-bold text-white">{data.points}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Wins</p>
            <p className="font-bold text-white">{data.wins}</p>
          </div>
          <div className="text-center hidden md:block">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Recent Form</p>
            <p className="font-bold text-slate-300 text-sm tracking-widest">{recentForm}</p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4 sm:w-1/3">
          <span className={`px-3 py-1 text-xs font-bold ${labelClass[data.status]}`}>
            {data.status} ({data.momentum})
          </span>
          <svg 
            className={`h-5 w-5 text-slate-500 transition-transform ${expanded ? 'rotate-180 text-racing' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-white/5 p-5 bg-black/20 animate-in fade-in slide-in-from-top-2">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            
            {/* Teammate Battle */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-racing border-b border-racing/20 pb-2">Teammate Battle</h4>
              <p className="text-sm font-bold text-white">vs {data.teammateBattle.teammateName}</p>
              <ul className="space-y-1 text-sm text-slate-300">
                <li className="flex justify-between"><span>Race H2H</span> <span className="font-mono font-bold text-white">{data.teammateBattle.raceHeadToHead}</span></li>
                <li className="flex justify-between"><span>Quali H2H</span> <span className="font-mono font-bold text-white">{data.teammateBattle.qualiHeadToHead}</span></li>
                <li className="flex justify-between"><span>Points Gap</span> <span className="font-mono font-bold text-white">{data.teammateBattle.pointsGap > 0 ? '+' : ''}{data.teammateBattle.pointsGap}</span></li>
              </ul>
            </div>

            {/* Quali vs Race */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-racing border-b border-racing/20 pb-2">Quali vs Race</h4>
              <ul className="space-y-1 text-sm text-slate-300">
                <li className="flex justify-between"><span>Avg Quali</span> <span className="font-bold text-white">{data.qualiVsRace.averageQualifying !== "pending" ? `P${data.qualiVsRace.averageQualifying}` : "Pending"}</span></li>
                <li className="flex justify-between"><span>Avg Finish</span> <span className="font-bold text-white">{data.qualiVsRace.averageFinish !== "pending" ? `P${data.qualiVsRace.averageFinish}` : "Pending"}</span></li>
                <li className="flex justify-between"><span>Avg Race Gain</span> 
                  <span className={`font-bold ${
                    data.qualiVsRace.averageRaceGain !== "pending" 
                      ? (data.qualiVsRace.averageRaceGain > 0 ? 'text-emerald-400' : data.qualiVsRace.averageRaceGain < 0 ? 'text-red-400' : 'text-white')
                      : 'text-white'
                  }`}>
                    {data.qualiVsRace.averageRaceGain !== "pending" ? `${data.qualiVsRace.averageRaceGain > 0 ? '+' : ''}${data.qualiVsRace.averageRaceGain}` : "Pending"}
                  </span>
                </li>
              </ul>
            </div>

            {/* Consistency */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-racing border-b border-racing/20 pb-2">Consistency</h4>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-white">{data.consistency.score}</span>
                <span className="text-sm font-bold text-slate-400 pb-1">/ 100</span>
              </div>
              <p className="text-sm font-bold text-white">{data.consistency.label}</p>
              <div className="text-xs text-slate-400 mt-2 space-y-1">
                <p>Points Finishes: <span className="text-white">{data.consistency.pointsFinishes}</span></p>
                <p>DNFs: <span className="text-white">{data.consistency.dnfCount}</span></p>
              </div>
            </div>

            {/* Pressure Index */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-racing border-b border-racing/20 pb-2">Pressure Index</h4>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-white">{data.pressure.score}</span>
                <span className="text-sm font-bold text-slate-400 pb-1">/ 100</span>
              </div>
              <p className={`text-sm font-bold ${pressureLabelClass[data.pressure.label as keyof typeof pressureLabelClass] || 'text-white'}`}>
                {data.pressure.label}
              </p>
              <p className="text-xs text-slate-400 leading-relaxed mt-2">{data.pressure.basis}</p>
            </div>

          </div>
        </div>
      )}
    </article>
  );
}
