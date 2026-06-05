import { useEffect, useState } from "react";
import { getOpenF1Meetings, getOpenF1Sessions, getOpenF1Drivers } from "../lib/api/openF1Client";
import type { OpenF1Driver, OpenF1Session } from "../lib/api/apiTypes";

function selectBestCompletedSession(sessions: OpenF1Session[]): OpenF1Session | null {
  const now = Date.now();
  const completedSessions = sessions.filter(s => s.date_end && new Date(s.date_end).getTime() < now);
  if (completedSessions.length === 0) return null;

  completedSessions.sort((a, b) => new Date(b.date_start).getTime() - new Date(a.date_start).getTime());

  const raceSession = completedSessions.find(s => 
    s.session_name.toLowerCase().includes("race") && 
    s.session_type.toLowerCase().includes("race")
  ) || completedSessions.find(s => 
    s.session_name.toLowerCase().includes("race") ||
    s.session_type.toLowerCase().includes("race")
  );

  return raceSession || completedSessions[0];
}

export default function Drivers() {
  const [drivers, setDrivers] = useState<OpenF1Driver[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDrivers() {
      setIsLoading(true);
      setError("");
      try {
        const year = new Date().getFullYear();
        const meetings = await getOpenF1Meetings(year);
        meetings.sort((a, b) => new Date(b.date_start).getTime() - new Date(a.date_start).getTime());
        
        let bestSession: OpenF1Session | null = null;
        
        for (const meeting of meetings) {
          const sessions = await getOpenF1Sessions(meeting.meeting_key);
          if (sessions.length > 0) {
            bestSession = selectBestCompletedSession(sessions);
            if (bestSession) break;
          }
        }

        if (bestSession) {
          const d = await getOpenF1Drivers(bestSession.session_key);
          // Remove duplicates based on driver_number
          const uniqueDrivers = Array.from(new Map(d.map(item => [item.driver_number, item])).values());
          setDrivers(uniqueDrivers);
        } else {
          setError("No completed session found to load drivers from.");
        }
      } catch (err) {
        setError("Failed to load driver data from OpenF1.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDrivers();
  }, []);

  return (
    <div className="space-y-10 py-10">
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-racing">Current Grid</p>
        <h1 className="mt-3 text-4xl font-black text-white sm:text-6xl">Drivers</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-400">
          The 20 drivers competing in the FIA Formula One World Championship.
        </p>
      </section>

      {isLoading && (
        <div className="p-12 text-center text-amber-400 font-bold animate-pulse">Loading driver grid...</div>
      )}

      {error && (
        <div className="p-12 text-center text-red-400 font-bold">{error}</div>
      )}

      {!isLoading && !error && drivers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {drivers.map(driver => (
            <div key={driver.driver_number} className="bg-carbon border border-white/10 overflow-hidden group">
              <div className="h-48 bg-white/5 relative flex justify-center items-end border-b border-white/10 pt-4 overflow-hidden">
                <div 
                  className="absolute top-0 left-0 w-full h-1" 
                  style={{ backgroundColor: `#${driver.team_colour}` }}
                />
                {driver.headshot_url ? (
                  <img 
                    src={driver.headshot_url} 
                    alt={driver.full_name} 
                    className="h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center opacity-20">
                    <span className="text-6xl font-black">{driver.driver_number}</span>
                  </div>
                )}
                
                <div className="absolute bottom-2 left-3 font-black text-6xl text-white/10 italic tracking-tighter select-none">
                  {driver.driver_number}
                </div>
              </div>
              
              <div className="p-5">
                <h2 className="text-xl font-black text-white uppercase tracking-wider">{driver.full_name}</h2>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-semibold text-slate-400 uppercase">{driver.team_name}</span>
                  <span className="text-xs font-bold px-2 py-1 bg-white/10 rounded">{driver.name_acronym}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
