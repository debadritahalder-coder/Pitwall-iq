import type { StrategyEvent } from "../../lib/raceIntelligence/types";
import type { OpenF1Driver } from "../../lib/api/apiTypes";

interface StrategyEventCardProps {
  events: StrategyEvent[];
  driverLookup: Record<number, OpenF1Driver>;
  replaceDriverLabels: (text: string) => string;
}

export function StrategyEventCard({ events, driverLookup, replaceDriverLabels }: StrategyEventCardProps) {
  if (events.length === 0) {
    return (
      <div className="bg-carbon border border-white/10 p-6">
        <h2 className="mb-4 text-xl font-bold uppercase text-white">Strategy Events Detected</h2>
        <p className="text-slate-400 text-sm">No major strategy anomalies detected based on available data.</p>
      </div>
    );
  }

  const getConfidenceColor = (conf: string) => {
    switch (conf) {
      case "high": return "text-green-400";
      case "medium": return "text-amber-400";
      case "low": return "text-slate-400";
      default: return "text-slate-400";
    }
  };

  return (
    <div className="bg-carbon border border-white/10 p-6">
      <h2 className="mb-4 text-xl font-bold uppercase text-white">Strategy Events Detected</h2>
      <div className="space-y-4">
        {events.map((evt, idx) => {
          const driver = driverLookup[evt.driver_number];
          return (
            <div key={idx} className="flex gap-4 border-l-2 border-racing pl-4 py-2">
              {driver?.team_colour && (
                <div 
                  className="w-1 self-stretch" 
                  style={{ backgroundColor: `#${driver.team_colour}` }} 
                />
              )}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-black uppercase text-racing tracking-wider">
                    {evt.type.replace(/_/g, " ")} 
                    {driver ? ` - ${driver.full_name} (${driver.name_acronym})` : ` - Driver ${evt.driver_number}`}
                  </span>
                  <span className={`text-xs font-bold uppercase ${getConfidenceColor(evt.confidence)}`}>
                    Confidence: {evt.confidence}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Lap: {evt.lap}</p>
                <p className="text-sm text-slate-300 mt-2">
                  {replaceDriverLabels(evt.description)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
