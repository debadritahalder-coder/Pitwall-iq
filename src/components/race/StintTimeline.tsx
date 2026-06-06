import type { OpenF1Stint, OpenF1Driver } from "../../lib/api/apiTypes";
import type { StintAnalysis } from "../../lib/raceIntelligence/types";
import { useNewFanMode } from "../../contexts/NewFanContext";

interface StintTimelineProps {
  stints: OpenF1Stint[];
  stintAnalysis?: StintAnalysis | null;
  driverLookup: Record<number, OpenF1Driver>;
  totalLaps?: number; // optionally normalize width based on max laps
}

export function StintTimeline({ stints, stintAnalysis, driverLookup, totalLaps }: StintTimelineProps) {
  const { isNewFanMode } = useNewFanMode();

  if (stints.length === 0) {
    return (
      <div className="bg-carbon border border-white/10 p-6">
        <h2 className="mb-4 text-xl font-bold uppercase text-white">Tyre Stint Timeline</h2>
        <p className="text-slate-400 text-sm">No stint data available.</p>
      </div>
    );
  }

  // Group stints by driver
  const driverStints: Record<number, OpenF1Stint[]> = {};
  stints.forEach(s => {
    if (!driverStints[s.driver_number]) driverStints[s.driver_number] = [];
    driverStints[s.driver_number].push(s);
  });

  const getCompoundColor = (compound: string | undefined) => {
    if (!compound) return "bg-slate-600";
    const c = compound.toLowerCase();
    if (c.includes("soft")) return "bg-red-500";
    if (c.includes("medium")) return "bg-yellow-500";
    if (c.includes("hard")) return "bg-gray-300";
    if (c.includes("intermediate") || c.includes("inter")) return "bg-green-500";
    if (c.includes("wet")) return "bg-blue-500";
    return "bg-slate-600";
  };

  // Find max lap to calculate widths if totalLaps is not provided
  const maxLap = totalLaps || Math.max(...stints.map(s => s.lap_end));

  return (
    <div className="bg-carbon border border-white/10 p-6 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold uppercase text-white">Tyre Stint Timeline</h2>
        {stintAnalysis?.tyreMixSummary && (
          <span className="text-sm text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            {stintAnalysis.tyreMixSummary}
          </span>
        )}
      </div>

      {isNewFanMode && (
        <div className="mb-6 bg-electric/10 border border-electric/20 p-4 rounded text-sm text-slate-300">
          <strong className="text-electric block mb-1 uppercase tracking-wider text-[10px]">What am I looking at?</strong>
          A "stint" is the set of laps a driver completes on one set of tyres. This chart shows how long each driver kept their tyres alive and which rubber they chose.
        </div>
      )}
      <div className="min-w-[600px] space-y-4">
        {Object.entries(driverStints).map(([driverNumStr, dStints]) => {
          const driverNumber = Number(driverNumStr);
          const driver = driverLookup[driverNumber];
          
          return (
            <div key={driverNumber} className="flex items-center gap-4">
              <div className="w-24 shrink-0 flex items-center gap-2">
                {driver?.team_colour && (
                  <div className="w-1.5 h-6 shrink-0" style={{ backgroundColor: `#${driver.team_colour}` }} />
                )}
                <span className="text-sm font-bold text-white whitespace-nowrap">
                  {driver ? driver.name_acronym || driver.last_name : `Car ${driverNumber}`}
                </span>
              </div>
              
              <div className="flex-1 bg-white/5 h-8 relative flex">
                {dStints.sort((a, b) => a.lap_start - b.lap_start).map((stint, idx) => {
                  const length = stint.lap_end - stint.lap_start;
                  if (length <= 0) return null;
                  const widthPercent = (length / maxLap) * 100;
                  
                  return (
                    <div 
                      key={idx} 
                      className={`h-full border-r border-carbon flex items-center justify-center overflow-hidden px-1 ${getCompoundColor(stint.compound)}`}
                      style={{ width: `${widthPercent}%` }}
                      title={`${stint.compound} | Laps ${stint.lap_start}-${stint.lap_end} (${length} laps)`}
                    >
                      {widthPercent > 5 && (
                        <span className="text-[10px] font-bold text-black uppercase tracking-tighter truncate">
                          {stint.compound?.charAt(0)} {length}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
