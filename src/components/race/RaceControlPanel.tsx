import type { OpenF1RaceControl } from "../../lib/api/apiTypes";

interface RaceControlPanelProps {
  raceControl: OpenF1RaceControl[];
  filterFn: (rc: OpenF1RaceControl) => boolean;
}

export function RaceControlPanel({ raceControl, filterFn }: RaceControlPanelProps) {
  const filteredEvents = raceControl.filter(filterFn);

  return (
    <div className="bg-carbon border border-white/10 p-6">
      <h2 className="mb-4 text-xl font-bold uppercase text-white">Race Control Events</h2>
      {filteredEvents.length === 0 ? (
        <p className="text-slate-400 text-sm">No safety car or flag message events detected in this session's logs.</p>
      ) : (
        <div className="space-y-3">
          {filteredEvents.slice(0, 10).map((rc, idx) => (
            <div key={idx} className="bg-white/5 p-3 flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-white">{rc.message || rc.category}</span>
                <span className="text-xs text-slate-400">{rc.lap_number ? `Lap ${rc.lap_number}` : "Pre-race/Unknown Lap"}</span>
              </div>
              <span className="text-xs text-slate-500 uppercase">{rc.category}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
