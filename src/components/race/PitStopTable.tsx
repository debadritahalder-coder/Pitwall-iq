import type { OpenF1PitStop, OpenF1Driver, OpenF1RaceControl } from "../../lib/api/apiTypes";
import type { PitStopAnalysis, StrategyEvent } from "../../lib/raceIntelligence/types";

interface PitStopTableProps {
  pitStops: OpenF1PitStop[];
  pitAnalysis: PitStopAnalysis | null;
  driverLookup: Record<number, OpenF1Driver>;
  raceControl: OpenF1RaceControl[];
  strategyEvents: StrategyEvent[];
}

export function PitStopTable({ pitStops, pitAnalysis, driverLookup, raceControl, strategyEvents }: PitStopTableProps) {
  const getEventProximity = (lap: number | undefined) => {
    if (!lap) return "Normal";
    const nearbyRc = raceControl.find(rc => 
      rc.lap_number && 
      Math.abs(rc.lap_number - lap) <= 2 &&
      (rc.category?.toLowerCase().includes("safety") || rc.message?.toLowerCase().includes("vsc"))
    );
    if (nearbyRc) {
      if (nearbyRc.message?.toLowerCase().includes("vsc") || nearbyRc.category?.toLowerCase().includes("vsc")) return "Near VSC";
      if (nearbyRc.category?.toLowerCase().includes("safety") || nearbyRc.message?.toLowerCase().includes("safety car")) return "Near SC";
      return "Near Flag";
    }
    return "Normal";
  };

  const getStrategicNote = (lap: number | undefined, driverNumber: number | undefined) => {
    if (!lap || !driverNumber) return "-";
    const evt = strategyEvents.find(e => e.driver_number === driverNumber && Math.abs(e.lap - lap) <= 1);
    if (evt) {
      return evt.type.replace(/_/g, " ").toUpperCase();
    }
    return "-";
  };

  return (
    <div className="bg-carbon border border-white/10 p-6">
      <h2 className="mb-4 text-xl font-bold uppercase text-white">Pit Stop Analyzer</h2>
      
      {pitAnalysis && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6 bg-white/5 p-4 border border-white/10">
          <div>
            <span className="text-xs text-slate-400 uppercase block mb-1">Total Stops</span>
            <span className="font-bold text-white">{pitAnalysis.totalStops}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase block mb-1">Average Stop Lap</span>
            <span className="font-bold text-white">{pitAnalysis.averageStopLap ?? "N/A"}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase block mb-1">Median Stop Lap</span>
            <span className="font-bold text-white">{pitAnalysis.medianStopLap ?? "N/A"}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase block mb-1">Earliest Stop</span>
            <span className="font-bold text-white">{pitAnalysis.earliestStopLap ? `Lap ${pitAnalysis.earliestStopLap}` : "N/A"}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase block mb-1">Fastest Stop</span>
            <span className="font-bold text-white">{pitAnalysis.fastestStopDuration ? `${pitAnalysis.fastestStopDuration.toFixed(2)}s` : "N/A"}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase block mb-1">Multi-Stop Drivers</span>
            <span className="font-bold text-white">{pitAnalysis.driversWithMultipleStops.length ?? 0}</span>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="text-xs uppercase bg-white/5 text-slate-400">
            <tr>
              <th className="px-4 py-3">Driver</th>
              <th className="px-4 py-3">Lap</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Proximity</th>
              <th className="px-4 py-3">Note</th>
            </tr>
          </thead>
          <tbody>
            {pitStops.filter(p => p.lap_number && p.driver_number).sort((a, b) => (a.lap_number || 0) - (b.lap_number || 0)).slice(0, 20).map((stop, idx) => {
              const driver = driverLookup[stop.driver_number!];
              const duration = stop.stop_duration || stop.pit_duration || stop.lane_duration;
              return (
                <tr key={idx} className="border-b border-white/10 hover:bg-white/5">
                  <td className="px-4 py-3 font-semibold text-white flex items-center gap-2">
                    {driver?.team_colour && (
                      <div className="w-1.5 h-4" style={{ backgroundColor: `#${driver.team_colour}` }} />
                    )}
                    {driver?.name_acronym || `Car ${stop.driver_number}`}
                  </td>
                  <td className="px-4 py-3">{stop.lap_number}</td>
                  <td className="px-4 py-3">{duration ? `${duration.toFixed(2)}s` : "-"}</td>
                  <td className="px-4 py-3">{getEventProximity(stop.lap_number)}</td>
                  <td className="px-4 py-3 text-xs font-bold text-racing">{getStrategicNote(stop.lap_number, stop.driver_number)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {pitStops.length > 20 && (
          <p className="text-xs text-slate-400 mt-2 text-center">Showing first 20 stops...</p>
        )}
      </div>
    </div>
  );
}
