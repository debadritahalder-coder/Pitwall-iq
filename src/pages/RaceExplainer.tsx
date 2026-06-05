import { useEffect, useState, useMemo } from "react";
import { getOpenF1Meetings, getOpenF1Sessions, getOpenF1Laps, getOpenF1PitStops, getOpenF1Stints, getOpenF1RaceControl, getOpenF1Drivers } from "../lib/api/openF1Client";
import type { OpenF1Meeting, OpenF1Session, OpenF1Lap, OpenF1PitStop, OpenF1Stint, OpenF1RaceControl as RaceControl, OpenF1Driver } from "../lib/api/apiTypes";
import { analyzePitStops, analyzeStints } from "../lib/raceIntelligence/pitStopAnalyzer";
import { detectStrategyEvents } from "../lib/raceIntelligence/strategyEventDetector";
import { generateRaceNarrative } from "../lib/raceIntelligence/raceNarrative";
import type { PitStopAnalysis, StintAnalysis, StrategyEvent, RaceNarrative } from "../lib/raceIntelligence/types";

export default function RaceExplainer() {
  const [meetings, setMeetings] = useState<OpenF1Meeting[]>([]);
  const [sessions, setSessions] = useState<OpenF1Session[]>([]);
  
  const [selectedMeetingKey, setSelectedMeetingKey] = useState<number | "">("");
  const [selectedSessionKey, setSelectedSessionKey] = useState<number | "">("");
  
  const [isTechnical, setIsTechnical] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [pitStops, setPitStops] = useState<OpenF1PitStop[]>([]);
  const [stints, setStints] = useState<OpenF1Stint[]>([]);
  const [raceControl, setRaceControl] = useState<RaceControl[]>([]);
  const [drivers, setDrivers] = useState<OpenF1Driver[]>([]);
  
  const [pitAnalysis, setPitAnalysis] = useState<PitStopAnalysis | null>(null);
  const [stintAnalysis, setStintAnalysis] = useState<StintAnalysis | null>(null);
  const [strategyEvents, setStrategyEvents] = useState<StrategyEvent[]>([]);
  const [narrative, setNarrative] = useState<RaceNarrative | null>(null);

  useEffect(() => {
    async function loadInitialData() {
      try {
        setIsLoading(true);
        // Load recent meetings (e.g. current year)
        const year = new Date().getFullYear();
        const data = await getOpenF1Meetings(year);
        // Sort meetings descending by date
        const sorted = data.sort((a, b) => new Date(b.date_start).getTime() - new Date(a.date_start).getTime());
        setMeetings(sorted);

        // Auto-select logic
        if (sorted.length > 0) {
          // Find the most recent meeting that has sessions
          for (const meeting of sorted) {
            const meetingSessions = await getOpenF1Sessions(meeting.meeting_key);
            if (meetingSessions.length > 0) {
              setSessions(meetingSessions);
              setSelectedMeetingKey(meeting.meeting_key);
              
              // Find the most recent completed Race session, or any if no race
              const pastSessions = meetingSessions.filter(s => new Date(s.date_end).getTime() < Date.now());
              pastSessions.sort((a, b) => new Date(b.date_start).getTime() - new Date(a.date_start).getTime());
              
              const raceSession = pastSessions.find(s => s.session_name.toLowerCase().includes("race"));
              if (raceSession) {
                setSelectedSessionKey(raceSession.session_key);
              } else if (pastSessions.length > 0) {
                setSelectedSessionKey(pastSessions[0].session_key);
              }
              break; // Found our default
            }
          }
        }
      } catch (err) {
        setError("Failed to load meetings.");
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // When meeting changes manually
  useEffect(() => {
    async function loadSessions() {
      if (!selectedMeetingKey) return;
      try {
        const data = await getOpenF1Sessions(Number(selectedMeetingKey));
        data.sort((a, b) => new Date(b.date_start).getTime() - new Date(a.date_start).getTime());
        setSessions(data);
        if (data.length > 0) {
           setSelectedSessionKey(data[0].session_key);
        } else {
           setSelectedSessionKey("");
        }
      } catch (err) {
        setError("Failed to load sessions.");
      }
    }
    // Only load if triggered by user change (checked by checking if sessions mismatch)
    const currentSessionMatches = sessions.some(s => s.meeting_key === selectedMeetingKey);
    if (!currentSessionMatches && selectedMeetingKey) {
        loadSessions();
    }
  }, [selectedMeetingKey, sessions]);

  // Load race data when session changes
  useEffect(() => {
    async function loadRaceData() {
      if (!selectedSessionKey) return;
      try {
        setIsLoading(true);
        setError("");
        
        const [lapsData, pitStopsData, stintsData, raceControlData, driversData] = await Promise.all([
          getOpenF1Laps(Number(selectedSessionKey)),
          getOpenF1PitStops(Number(selectedSessionKey)),
          getOpenF1Stints(Number(selectedSessionKey)),
          getOpenF1RaceControl(Number(selectedSessionKey)),
          getOpenF1Drivers(Number(selectedSessionKey)),
        ]);

        setPitStops(pitStopsData);
        setStints(stintsData);
        setRaceControl(raceControlData);
        setDrivers(driversData);

        const pitAna = analyzePitStops(pitStopsData);
        const stintAna = analyzeStints(stintsData);
        const events = detectStrategyEvents(pitStopsData, raceControlData, lapsData);
        const narr = generateRaceNarrative(pitAna, stintAna, events);

        setPitAnalysis(pitAna);
        setStintAnalysis(stintAna);
        setStrategyEvents(events);
        setNarrative(narr);

      } catch (err) {
        setError("Failed to load race data. The session may not have data yet.");
        setPitAnalysis(null);
        setStintAnalysis(null);
        setStrategyEvents([]);
        setNarrative(null);
        setDrivers([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadRaceData();
  }, [selectedSessionKey]);

  const driverLookup = useMemo(() => {
    const lookup: Record<number, OpenF1Driver> = {};
    drivers.forEach((d) => {
      if (typeof d.driver_number === "number") {
        lookup[d.driver_number] = d;
      }
    });
    return lookup;
  }, [drivers]);

  const getDriverName = (driverNumber: number | undefined | null) => {
    if (driverNumber === undefined || driverNumber === null) return "Driver";
    const d = driverLookup[driverNumber];
    return d ? d.full_name : `Driver ${driverNumber}`;
  };

  const replaceDriverLabels = (text: string | undefined | null) => {
    if (!text) return "";
    return text.replace(/(Driver|Car)\s+(\d+)/g, (match, prefix, numStr) => {
      const num = parseInt(numStr, 10);
      const d = driverLookup[num];
      return d ? d.full_name : match;
    });
  };

  const isRaceControlInterruption = (rc: RaceControl) => {
    const category = (rc.category || "").toLowerCase();
    const message = (rc.message || "").toLowerCase();
    return (
      category.includes("safety") ||
      category.includes("flag") ||
      message.includes("safety car") ||
      message.includes("vsc") ||
      message.includes("yellow flag") ||
      message.includes("red flag") ||
      message.includes("virtual safety car")
    );
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col items-start justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end">
        <div className="space-y-2">
          <h1 className="text-4xl font-black uppercase tracking-tight text-white">Race Explainer</h1>
          <p className="text-lg text-slate-400">Understand the strategy story behind a Grand Prix.</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 px-4 py-2 border border-white/10">
          <span className="text-sm font-semibold uppercase text-slate-400">Mode</span>
          <button
            onClick={() => setIsTechnical(false)}
            className={`px-3 py-1 text-sm font-bold transition ${!isTechnical ? "bg-racing text-white" : "text-slate-400 hover:text-white"}`}
          >
            SIMPLE
          </button>
          <button
            onClick={() => setIsTechnical(true)}
            className={`px-3 py-1 text-sm font-bold transition ${isTechnical ? "bg-racing text-white" : "text-slate-400 hover:text-white"}`}
          >
            TECHNICAL
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase text-slate-400">Meeting</label>
          <select 
            value={selectedMeetingKey} 
            onChange={(e) => setSelectedMeetingKey(Number(e.target.value))}
            className="w-full bg-carbon/50 border border-white/10 p-3 text-white focus:border-racing outline-none"
          >
            {meetings.map((m) => (
              <option key={m.meeting_key} value={m.meeting_key}>{m.meeting_name} ({m.year})</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase text-slate-400">Session</label>
          <select 
            value={selectedSessionKey} 
            onChange={(e) => setSelectedSessionKey(Number(e.target.value))}
            className="w-full bg-carbon/50 border border-white/10 p-3 text-white focus:border-racing outline-none"
            disabled={!selectedMeetingKey || sessions.length === 0}
          >
            {sessions.map((s) => (
              <option key={s.session_key} value={s.session_key}>{s.session_name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between bg-carbon border border-white/10 p-4">
        <span className="text-sm font-medium text-slate-300">Data Source: OpenF1 API (Historical)</span>
        {isLoading ? (
          <span className="flex items-center gap-2 text-sm font-medium text-amber-400">
            <div className="h-2 w-2 animate-pulse bg-amber-400 rounded-full" /> Fetching Historical Data...
          </span>
        ) : error ? (
           <span className="text-sm font-medium text-red-400">{error}</span>
        ) : narrative && !narrative.dataAvailable ? (
          <span className="flex items-center gap-2 text-sm font-medium text-slate-400">
            <div className="h-2 w-2 bg-slate-400 rounded-full" /> Waiting for session data
          </span>
        ) : (
          <span className="flex items-center gap-2 text-sm font-medium text-green-400">
            <div className="h-2 w-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]" /> Historical Analysis Loaded
          </span>
        )}
      </div>

      {!isLoading && narrative && narrative.dataAvailable && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-carbon/80 to-carbon border border-white/10 p-6">
              <h2 className="mb-4 text-xl font-bold uppercase text-white">Race Summary</h2>
              <p className="text-lg leading-relaxed text-slate-300">
                {replaceDriverLabels(isTechnical ? narrative.technical : narrative.simple)}
              </p>
            </div>

            <div className="bg-carbon border border-white/10 p-6">
              <h2 className="mb-4 text-xl font-bold uppercase text-white">Strategy Events Detected</h2>
              {strategyEvents.length === 0 ? (
                <p className="text-slate-400 text-sm">No major strategy anomalies detected based on available data.</p>
              ) : (
                <div className="space-y-4">
                  {strategyEvents.map((evt, idx) => {
                    const driver = driverLookup[evt.driver_number];
                    return (
                      <div key={idx} className="flex gap-4 border-l-2 border-racing pl-4 py-2">
                        {driver?.team_colour && (
                          <div 
                            className="w-1 self-stretch" 
                            style={{ backgroundColor: `#${driver.team_colour}` }} 
                          />
                        )}
                        <div>
                          <span className="text-xs font-black uppercase text-racing tracking-wider">
                            {evt.type.replace(/_/g, " ")} 
                            {driver ? ` - ${driver.full_name} (${driver.name_acronym})` : ` - Driver ${evt.driver_number}`}
                          </span>
                          <p className="text-sm text-slate-300 mt-1">
                            {replaceDriverLabels(evt.description)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
             <div className="bg-carbon border border-white/10 p-6">
              <h2 className="mb-4 text-xl font-bold uppercase text-white">Race Control Events</h2>
              {raceControl.filter(isRaceControlInterruption).length === 0 ? (
                 <p className="text-slate-400 text-sm">No safety car or flag message events detected in this session's logs.</p>
              ) : (
                 <div className="space-y-3">
                   {raceControl.filter(isRaceControlInterruption).slice(0, 10).map((rc, idx) => (
                      <div key={idx} className="bg-white/5 p-3 flex justify-between items-center">
                        <span className="font-semibold text-white">{rc.message || rc.category}</span>
                        <span className="text-xs text-slate-400">{rc.lap_number ? `Lap ${rc.lap_number}` : "Pre-race/Unknown Lap"}</span>
                      </div>
                   ))}
                 </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-carbon border border-white/10 p-6">
              <h2 className="mb-4 text-xl font-bold uppercase text-white">Pit Stop Analyzer</h2>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-sm text-slate-400">Average Stop Lap</span>
                  <span className="font-bold text-white">{pitAnalysis?.averageStopLap ?? "N/A"}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-sm text-slate-400">Earliest Stop</span>
                  <span className="font-bold text-white">{pitAnalysis?.earliestStopLap ? `Lap ${pitAnalysis.earliestStopLap}` : "N/A"}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-sm text-slate-400">Latest Stop</span>
                  <span className="font-bold text-white">{pitAnalysis?.latestStopLap ? `Lap ${pitAnalysis.latestStopLap}` : "N/A"}</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-sm text-slate-400">Multi-Stop Drivers</span>
                  <span className="font-bold text-white">{pitAnalysis?.driversWithMultipleStops.length ?? 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-carbon border border-white/10 p-6">
              <h2 className="mb-4 text-xl font-bold uppercase text-white">Tyre Stint Timeline</h2>
              {stintAnalysis?.longestStint ? (
                <div className="space-y-4">
                  <div>
                    <span className="text-xs uppercase text-slate-400 block mb-1">Longest Stint</span>
                    <div className="bg-white/5 p-3 border border-white/10 flex items-center gap-3">
                      {driverLookup[stintAnalysis.longestStint.driver_number]?.team_colour && (
                        <div 
                          className="w-1.5 h-8 self-stretch" 
                          style={{ backgroundColor: `#${driverLookup[stintAnalysis.longestStint.driver_number].team_colour}` }} 
                        />
                      )}
                      <div>
                        <p className="text-sm font-bold text-white">
                          {getDriverName(stintAnalysis.longestStint.driver_number)}
                          {driverLookup[stintAnalysis.longestStint.driver_number]?.name_acronym && (
                            <span className="text-xs text-slate-400 ml-2">({driverLookup[stintAnalysis.longestStint.driver_number].name_acronym})</span>
                          )}
                        </p>
                        <p className="text-xs text-slate-400">
                          {driverLookup[stintAnalysis.longestStint.driver_number]?.team_name || "Unknown Team"}
                        </p>
                        <p className="text-xs text-slate-400">{stintAnalysis.longestStint.compound} ({stintAnalysis.longestStint.lap_end - stintAnalysis.longestStint.lap_start} laps)</p>
                      </div>
                    </div>
                  </div>
                  {stintAnalysis.shortestStint && (
                    <div>
                      <span className="text-xs uppercase text-slate-400 block mb-1">Shortest Stint</span>
                      <div className="bg-white/5 p-3 border border-white/10 flex items-center gap-3">
                        {driverLookup[stintAnalysis.shortestStint.driver_number]?.team_colour && (
                          <div 
                            className="w-1.5 h-8 self-stretch" 
                            style={{ backgroundColor: `#${driverLookup[stintAnalysis.shortestStint.driver_number].team_colour}` }} 
                          />
                        )}
                        <div>
                          <p className="text-sm font-bold text-white">
                            {getDriverName(stintAnalysis.shortestStint.driver_number)}
                            {driverLookup[stintAnalysis.shortestStint.driver_number]?.name_acronym && (
                              <span className="text-xs text-slate-400 ml-2">({driverLookup[stintAnalysis.shortestStint.driver_number].name_acronym})</span>
                            )}
                          </p>
                          <p className="text-xs text-slate-400">
                            {driverLookup[stintAnalysis.shortestStint.driver_number]?.team_name || "Unknown Team"}
                          </p>
                          <p className="text-xs text-slate-400">{stintAnalysis.shortestStint.compound} ({stintAnalysis.shortestStint.lap_end - stintAnalysis.shortestStint.lap_start} laps)</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-slate-400 text-sm">No stint data available.</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {!isLoading && (!narrative || !narrative.dataAvailable) && !error && (
        <div className="flex items-center justify-center p-12 bg-carbon border border-white/10">
           <p className="text-slate-400">OpenF1 data for this session is incomplete or not yet available.</p>
        </div>
      )}
    </div>
  );
}
