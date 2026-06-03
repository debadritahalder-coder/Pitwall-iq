import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ConstructorCard from "../components/ConstructorCard";
import ErrorFallback from "../components/ErrorFallback";
import HistoryMomentCard from "../components/HistoryMomentCard";
import InsightCard from "../components/InsightCard";
import LoadingState from "../components/LoadingState";
import StatCard from "../components/StatCard";
import { historyMoments } from "../lib/fallbackData";
import { getConstructorStandings, getCurrentRaceSchedule, getDriverStandings, getLatestRaceResults, generateAutoSummary } from "../lib/f1Api";
import type { ApiResponse, ConstructorStanding, DriverStanding, Race, RaceResult } from "../lib/types";

export default function Dashboard() {
  const [races, setRaces] = useState<ApiResponse<Race[]> | null>(null);
  const [drivers, setDrivers] = useState<ApiResponse<DriverStanding[]> | null>(null);
  const [constructors, setConstructors] = useState<ApiResponse<ConstructorStanding[]> | null>(null);
  const [latestResults, setLatestResults] = useState<ApiResponse<RaceResult[]> | null>(null);
  const [showLocalTime, setShowLocalTime] = useState(true);

  useEffect(() => {
    void Promise.all([
      getCurrentRaceSchedule(), 
      getDriverStandings(), 
      getConstructorStandings(),
      getLatestRaceResults()
    ]).then(
      ([raceData, driverData, constructorData, latestData]) => {
        setRaces(raceData);
        setDrivers(driverData);
        setConstructors(constructorData);
        setLatestResults(latestData);
      },
    );
  }, []);

  const featuredRace = useMemo(() => {
    const today = new Date();
    const upcoming = races?.data.find((race) => new Date(race.date) >= today);
    return upcoming ?? races?.data[0];
  }, [races]);

  const raceSummaryInfo = useMemo(() => {
    if (!featuredRace) return { title: "Race Weekend Summary", text: "", sourceLabel: "" };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = featuredRace.weekendStartDate ? new Date(featuredRace.weekendStartDate) : new Date(featuredRace.date);
    
    if (today < startDate) {
      return { 
        title: "Previous Race Summary", 
        text: generateAutoSummary(latestResults?.data || []),
        sourceLabel: latestResults?.source === 'live' ? "Live API data" : "Fallback data"
      };
    } else {
      return { 
        title: "Race Weekend Summary", 
        text: featuredRace.currentWeekendSummary || `The ${featuredRace.raceName} weekend is active. Stay tuned for track session updates.`,
        sourceLabel: races?.source === 'live' ? "Live API data" : "Fallback data"
      };
    }
  }, [featuredRace, latestResults, races]);

  const formattedDate = useMemo(() => {
    if (!featuredRace?.date) return "TBC";
    const [year, month, day] = featuredRace.date.split("-");
    return `${day}-${month}-${year}`;
  }, [featuredRace?.date]);

  const formattedTime = useMemo(() => {
    if (!featuredRace?.date || !featuredRace?.time) return "TBC";
    const dateObj = new Date(`${featuredRace.date}T${featuredRace.time}`);
    return dateObj.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit', 
      timeZone: showLocalTime ? undefined : 'UTC',
      timeZoneName: 'short' 
    });
  }, [featuredRace?.date, featuredRace?.time, showLocalTime]);

  if (!races || !drivers || !constructors || !latestResults) {
    return <LoadingState />;
  }

  const usingFallback = [races, drivers, constructors, latestResults].some((response) => response.source === "fallback");

  return (
    <div className="space-y-16">
      <section className="grid gap-8 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="mb-4 inline-flex border border-racing/35 bg-racing/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-racing">
            Race weekend intelligence
          </p>
          <h1 className="text-5xl font-black text-white sm:text-7xl">PitWall IQ</h1>
          <p className="mt-5 text-2xl font-bold text-slate-200">Race weekend intelligence for F1 fans.</p>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-400">
            Track real standings, study driver form, compare strategy risks, and understand the race before lights out.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/drivers" className="bg-racing px-5 py-3 text-sm font-black text-white shadow-glow">
              View Drivers
            </Link>
            <Link to="/strategy-lab" className="border border-white/15 bg-white/5 px-5 py-3 text-sm font-black text-white">
              Open Strategy Lab
            </Link>
          </div>
        </div>
        <div className="panel relative overflow-hidden p-6">
          <div className="absolute right-8 top-8 h-20 w-36 skew-x-[-15deg] border-y border-racing/25" />
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Next race context</p>
          <h2 className="mt-4 text-3xl font-black text-white">{featuredRace?.raceName}</h2>
          <p className="mt-2 text-slate-400">{featuredRace?.circuitName}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <StatCard label="Country" value={featuredRace?.country ?? "TBC"} detail={featuredRace?.locality} accent="blue" />
            <StatCard label="Race date" value={formattedDate} detail={`Round ${featuredRace?.round ?? "-"}`} />
            <StatCard label="Season" value={featuredRace?.season ?? "TBC"} detail="Jolpica / fallback feed" accent="gold" />
            <StatCard 
              label="Race time" 
              value={formattedTime} 
              detail={
                <button 
                  onClick={() => setShowLocalTime((prev) => !prev)}
                  className="mt-1 text-xs text-slate-400 underline hover:text-white"
                >
                  Show {showLocalTime ? "Track Time (UTC)" : "Local Time"}
                </button>
              } 
              accent="green" 
            />
          </div>
        </div>
      </section>

      {usingFallback ? <ErrorFallback message={[races.error, drivers.error, constructors.error].filter(Boolean)[0]} /> : null}

      <section className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <div className="panel p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-racing">{raceSummaryInfo.title}</p>
              <h2 className="mt-2 text-2xl font-black text-white">
                {raceSummaryInfo.title === "Previous Race Summary" && latestResults?.data[0] 
                  ? latestResults.data[0].raceName 
                  : featuredRace?.raceName}
              </h2>
            </div>
            <span className="border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">
              Round {raceSummaryInfo.title === "Previous Race Summary" && latestResults?.data[0] 
                ? latestResults.data[0].round || '-'
                : featuredRace?.round}
            </span>
          </div>
          <p className="leading-7 text-slate-300">{raceSummaryInfo.text}</p>
          <p className="mt-4 text-xs tracking-wider text-slate-500 uppercase">{raceSummaryInfo.sourceLabel}</p>
        </div>

        <div className="panel p-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-racing">Driver standings preview</p>
          <div className="mt-4 space-y-1">
            {drivers.data.slice(0, 5).map((driver) => (
              <div key={driver.driverId} className="flex items-center justify-between gap-4 border-b border-white/10 py-3 last:border-b-0">
                <div>
                  <p className="font-black text-white">P{driver.position} {driver.driverName}</p>
                  <p className="text-sm text-slate-500">{driver.constructorName}</p>
                </div>
                <p className="text-right text-sm text-slate-300">{driver.points} pts<br />{driver.wins} wins</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1fr]">
        <div className="panel p-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-racing">Constructor standings preview</p>
          <div className="mt-4">
            {constructors.data.slice(0, 5).map((constructor) => (
              <ConstructorCard key={constructor.constructorId} constructorStanding={constructor} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-racing">Three Things To Watch</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3 lg:grid-cols-1">
            <InsightCard title="Tyre degradation" description="Tyre degradation could decide the pit window." tone="gold" />
            <InsightCard title="Qualifying pressure" description="Qualifying position may shape the race if overtaking is difficult." tone="blue" />
            <InsightCard title="Safety car swings" description="Safety car timing could create surprise strategy swings." tone="orange" />
          </div>
        </div>
      </section>

      <section>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-racing">Archive</p>
        <h2 className="mt-3 text-3xl font-black text-white">F1 History Vault</h2>
        <p className="mt-2 max-w-2xl text-slate-400">Iconic moments every F1 fan eventually revisits.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {historyMoments.map((moment) => (
            <HistoryMomentCard key={moment.title} moment={moment} />
          ))}
        </div>
      </section>
    </div>
  );
}
