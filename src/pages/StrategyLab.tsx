import { useEffect, useState, useMemo } from "react";
import { getOpenF1Meetings, getOpenF1Sessions, getOpenF1Drivers, getOpenF1Laps } from "../lib/api/openF1Client";
import type { OpenF1Meeting, OpenF1Session, OpenF1Driver, OpenF1Lap } from "../lib/api/apiTypes";
import { SessionPicker } from "../components/race/SessionPicker";

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

export default function StrategyLab() {
  const [meetings, setMeetings] = useState<OpenF1Meeting[]>([]);
  const [sessions, setSessions] = useState<OpenF1Session[]>([]);
  const [selectedMeetingKey, setSelectedMeetingKey] = useState<number | "">("");
  const [selectedSessionKey, setSelectedSessionKey] = useState<number | "">("");
  
  const [drivers, setDrivers] = useState<OpenF1Driver[]>([]);
  const [driver1, setDriver1] = useState<number | "">("");
  const [driver2, setDriver2] = useState<number | "">("");
  
  const [laps1, setLaps1] = useState<OpenF1Lap[]>([]);
  const [laps2, setLaps2] = useState<OpenF1Lap[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadInitialData() {
      try {
        const year = new Date().getFullYear();
        const data = await getOpenF1Meetings(year);
        const sorted = data.sort((a, b) => new Date(b.date_start).getTime() - new Date(a.date_start).getTime());
        setMeetings(sorted);

        if (sorted.length > 0) {
          for (const meeting of sorted) {
            const meetingSessions = await getOpenF1Sessions(meeting.meeting_key);
            if (meetingSessions.length > 0) {
              setSessions(meetingSessions);
              setSelectedMeetingKey(meeting.meeting_key);
              const bestSession = selectBestCompletedSession(meetingSessions);
              if (bestSession) setSelectedSessionKey(bestSession.session_key);
              break;
            }
          }
        }
      } catch (err) {
        setError("Failed to load meetings.");
      }
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    async function loadSessions() {
      if (!selectedMeetingKey) return;
      try {
        const data = await getOpenF1Sessions(Number(selectedMeetingKey));
        data.sort((a, b) => new Date(b.date_start).getTime() - new Date(a.date_start).getTime());
        setSessions(data);
        const bestSession = selectBestCompletedSession(data);
        if (bestSession) setSelectedSessionKey(bestSession.session_key);
        else setSelectedSessionKey("");
      } catch (err) {
        setError("Failed to load sessions.");
      }
    }
    const currentSessionMatches = sessions.some(s => s.meeting_key === selectedMeetingKey);
    if (!currentSessionMatches && selectedMeetingKey) {
        loadSessions();
    }
  }, [selectedMeetingKey, sessions]);

  useEffect(() => {
    async function loadDrivers() {
      if (!selectedSessionKey) return;
      try {
        const d = await getOpenF1Drivers(Number(selectedSessionKey));
        setDrivers(d);
        if (d.length >= 2) {
          setDriver1(d[0].driver_number);
          setDriver2(d[1].driver_number);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadDrivers();
  }, [selectedSessionKey]);

  useEffect(() => {
    async function loadComparison() {
      if (!selectedSessionKey || !driver1 || !driver2) return;
      setIsLoading(true);
      setError("");
      try {
        const [l1, l2] = await Promise.all([
          getOpenF1Laps(Number(selectedSessionKey), Number(driver1)),
          getOpenF1Laps(Number(selectedSessionKey), Number(driver2))
        ]);
        setLaps1(l1.filter(l => l.lap_duration && l.lap_duration > 0));
        setLaps2(l2.filter(l => l.lap_duration && l.lap_duration > 0));
      } catch (err) {
        setError("Failed to load lap data.");
      } finally {
        setIsLoading(false);
      }
    }
    loadComparison();
  }, [selectedSessionKey, driver1, driver2]);

  const driver1Data = drivers.find(d => d.driver_number === driver1);
  const driver2Data = drivers.find(d => d.driver_number === driver2);

  const avg1 = useMemo(() => {
    if (laps1.length === 0) return null;
    return laps1.reduce((sum, l) => sum + l.lap_duration!, 0) / laps1.length;
  }, [laps1]);

  const avg2 = useMemo(() => {
    if (laps2.length === 0) return null;
    return laps2.reduce((sum, l) => sum + l.lap_duration!, 0) / laps2.length;
  }, [laps2]);

  return (
    <div className="space-y-10 py-10">
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-racing">Interactive Sandbox</p>
        <h1 className="mt-3 text-4xl font-black text-white sm:text-6xl">Strategy Lab</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-400">
          Compare head-to-head race pace and strategy between any two drivers in a given session.
        </p>
      </section>

      <section className="space-y-6">
        <SessionPicker 
          meetings={meetings}
          sessions={sessions}
          selectedMeetingKey={selectedMeetingKey}
          selectedSessionKey={selectedSessionKey}
          onMeetingChange={setSelectedMeetingKey}
          onSessionChange={setSelectedSessionKey}
        />

        {drivers.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 bg-carbon border border-white/10 p-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase text-slate-400">Driver 1</label>
              <select 
                value={driver1} 
                onChange={(e) => setDriver1(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-racing outline-none"
              >
                {drivers.map(d => (
                  <option key={d.driver_number} value={d.driver_number}>{d.full_name} ({d.name_acronym})</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase text-slate-400">Driver 2</label>
              <select 
                value={driver2} 
                onChange={(e) => setDriver2(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-racing outline-none"
              >
                {drivers.map(d => (
                  <option key={d.driver_number} value={d.driver_number}>{d.full_name} ({d.name_acronym})</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </section>

      {isLoading ? (
        <div className="p-12 text-center text-amber-400 font-bold animate-pulse">Loading telemetery data...</div>
      ) : error ? (
        <div className="p-12 text-center text-red-400 font-bold">{error}</div>
      ) : driver1Data && driver2Data && avg1 && avg2 ? (
        <section className="space-y-6 animate-in fade-in">
          <div className="bg-gradient-to-br from-carbon/80 to-carbon border border-white/10 p-8 text-center">
            <h2 className="text-2xl font-black uppercase text-white mb-2">Head-to-Head Pace</h2>
            <p className="text-lg text-slate-300">
              On average, <span className="font-bold text-racing">
                {avg1 < avg2 ? driver1Data.full_name : driver2Data.full_name}
              </span> was faster by <span className="font-bold text-white">{Math.abs(avg1 - avg2).toFixed(3)}s</span> per lap.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-carbon border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8" style={{ backgroundColor: `#${driver1Data.team_colour}` }} />
                <div>
                  <h3 className="text-xl font-bold text-white uppercase">{driver1Data.full_name}</h3>
                  <p className="text-sm text-slate-400">{driver1Data.team_name}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-slate-400 uppercase block mb-1">Average Pace</span>
                  <span className="font-mono text-2xl text-white">{avg1.toFixed(3)}s</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase block mb-1">Laps Completed</span>
                  <span className="font-mono text-lg text-white">{laps1.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-carbon border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8" style={{ backgroundColor: `#${driver2Data.team_colour}` }} />
                <div>
                  <h3 className="text-xl font-bold text-white uppercase">{driver2Data.full_name}</h3>
                  <p className="text-sm text-slate-400">{driver2Data.team_name}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-slate-400 uppercase block mb-1">Average Pace</span>
                  <span className="font-mono text-2xl text-white">{avg2.toFixed(3)}s</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase block mb-1">Laps Completed</span>
                  <span className="font-mono text-lg text-white">{laps2.length}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="p-12 text-center text-slate-400">Select two drivers to compare their pace.</div>
      )}
    </div>
  );
}
