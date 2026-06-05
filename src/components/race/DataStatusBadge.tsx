import type { RaceNarrative } from "../../lib/raceIntelligence/types";

interface DataStatusBadgeProps {
  isLoading: boolean;
  error: string;
  selectedSessionKey: number | "";
  narrative: RaceNarrative | null;
  counts: {
    drivers: number;
    laps: number;
    pitStops: number;
    stints: number;
    raceControl: number;
    weather: number;
  };
}

export function DataStatusBadge({
  isLoading,
  error,
  selectedSessionKey,
  narrative,
  counts
}: DataStatusBadgeProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between bg-carbon border border-white/10 p-4">
        <span className="text-sm font-medium text-slate-300">Data Source: OpenF1 API (Historical)</span>
        {isLoading ? (
          <span className="flex items-center gap-2 text-sm font-medium text-amber-400">
            <div className="h-2 w-2 animate-pulse bg-amber-400 rounded-full" /> Fetching Historical Data...
          </span>
        ) : error ? (
           <span className="text-sm font-medium text-red-400">{error}</span>
        ) : !selectedSessionKey ? (
          <span className="flex items-center gap-2 text-sm font-medium text-slate-400">
            <div className="h-2 w-2 bg-slate-400 rounded-full" /> Select a completed session
          </span>
        ) : narrative && !narrative.dataAvailable ? (
          <span className="flex items-center gap-2 text-sm font-medium text-slate-400">
            <div className="h-2 w-2 bg-slate-400 rounded-full" /> Waiting for session data
          </span>
        ) : narrative && narrative.dataAvailable ? (
          <span className="flex items-center gap-2 text-sm font-medium text-green-400">
            <div className="h-2 w-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]" /> Historical Analysis Loaded
          </span>
        ) : (
          <span className="flex items-center gap-2 text-sm font-medium text-slate-400">
            <div className="h-2 w-2 bg-slate-400 rounded-full" /> No analysis loaded
          </span>
        )}
      </div>
      
      {narrative?.dataAvailable && !isLoading && !error && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 bg-carbon border border-white/10 p-4">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 uppercase">Drivers</span>
            <span className="text-sm font-bold text-white">{counts.drivers}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 uppercase">Laps</span>
            <span className="text-sm font-bold text-white">{counts.laps}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 uppercase">Pit Stops</span>
            <span className="text-sm font-bold text-white">{counts.pitStops}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 uppercase">Stints</span>
            <span className="text-sm font-bold text-white">{counts.stints}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 uppercase">Race Control</span>
            <span className="text-sm font-bold text-white">{counts.raceControl}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 uppercase">Weather</span>
            <span className="text-sm font-bold text-white">{counts.weather}</span>
          </div>
        </div>
      )}
    </div>
  );
}
