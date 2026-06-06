import { useEffect, useState, useMemo } from "react";
import { getOpenF1Meetings, getOpenF1Sessions, getOpenF1Laps, getOpenF1PitStops, getOpenF1Stints, getOpenF1RaceControl, getOpenF1Drivers, getOpenF1Weather, getOpenF1Position } from "../lib/api/openF1Client";
import type { OpenF1Meeting, OpenF1Session, OpenF1Lap, OpenF1PitStop, OpenF1Stint, OpenF1RaceControl as RaceControl, OpenF1Driver } from "../lib/api/apiTypes";
import { analyzePitStops, analyzeStints } from "../lib/raceIntelligence/pitStopAnalyzer";
import { detectStrategyEvents } from "../lib/raceIntelligence/strategyEventDetector";
import { generateRaceNarrative } from "../lib/raceIntelligence/raceNarrative";
import type { PitStopAnalysis, StintAnalysis, StrategyEvent, RaceNarrative } from "../lib/raceIntelligence/types";
import { SessionPicker } from "../components/race/SessionPicker";
import { DataStatusBadge } from "../components/race/DataStatusBadge";
import { RaceSummaryCard } from "../components/race/RaceSummaryCard";
import { StrategyEventCard } from "../components/race/StrategyEventCard";
import { RaceControlPanel } from "../components/race/RaceControlPanel";
import { PitStopTable } from "../components/race/PitStopTable";
import { StintTimeline } from "../components/race/StintTimeline";
import { WeatherPanel } from "../components/race/WeatherPanel";

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
  const [weather, setWeather] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [lapsCount, setLapsCount] = useState(0);
  
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
              const bestSession = selectBestCompletedSession(meetingSessions);
              if (bestSession) {
                setSelectedSessionKey(bestSession.session_key);
              } else {
                setSelectedSessionKey("");
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
        const bestSession = selectBestCompletedSession(data);
        if (bestSession) {
           setSelectedSessionKey(bestSession.session_key);
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
        
        const [lapsData, pitStopsData, stintsData, raceControlData, driversData, weatherData, positionData] = await Promise.all([
          getOpenF1Laps(Number(selectedSessionKey)),
          getOpenF1PitStops(Number(selectedSessionKey)),
          getOpenF1Stints(Number(selectedSessionKey)),
          getOpenF1RaceControl(Number(selectedSessionKey)),
          getOpenF1Drivers(Number(selectedSessionKey)),
          getOpenF1Weather(Number(selectedSessionKey)),
          getOpenF1Position(Number(selectedSessionKey)),
        ]);

        setPitStops(pitStopsData);
        setStints(stintsData);
        setRaceControl(raceControlData);
        setDrivers(driversData);
        setWeather(weatherData);
        setPositions(positionData);
        setLapsCount(lapsData.length);

        const pitAna = analyzePitStops(pitStopsData);
        const stintAna = analyzeStints(stintsData);
        const events = detectStrategyEvents(pitStopsData, raceControlData, lapsData, positionData);
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
        setWeather([]);
        setLapsCount(0);
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

      <SessionPicker 
        meetings={meetings} 
        sessions={sessions} 
        selectedMeetingKey={selectedMeetingKey} 
        selectedSessionKey={selectedSessionKey} 
        onMeetingChange={setSelectedMeetingKey} 
        onSessionChange={setSelectedSessionKey} 
      />

      <DataStatusBadge 
        isLoading={isLoading} 
        error={error} 
        selectedSessionKey={selectedSessionKey} 
        narrative={narrative} 
        counts={{
          drivers: drivers.length,
          laps: lapsCount,
          pitStops: pitStops.length,
          stints: stints.length,
          raceControl: raceControl.length,
          weather: weather.length
        }}
      />

      {!isLoading && narrative && narrative.dataAvailable && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <RaceSummaryCard summaryText={replaceDriverLabels(isTechnical ? narrative.technical : narrative.simple)} />
            <StrategyEventCard events={strategyEvents} driverLookup={driverLookup} replaceDriverLabels={replaceDriverLabels} />
            <RaceControlPanel raceControl={raceControl} filterFn={isRaceControlInterruption} />
            <WeatherPanel weather={weather} />
          </div>

          <div className="space-y-6">
            <PitStopTable pitStops={pitStops} pitAnalysis={pitAnalysis} driverLookup={driverLookup} raceControl={raceControl} strategyEvents={strategyEvents} />
            <StintTimeline stints={stints} stintAnalysis={stintAnalysis} driverLookup={driverLookup} />
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
