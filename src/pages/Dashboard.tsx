import { useEffect, useMemo, useState, useRef } from "react";
import { Link } from "react-router-dom";
import EventHeader from "../components/EventHeader";
import PodiumCard from "../components/PodiumCard";
import StandingsTable from "../components/StandingsTable";
import HistoryMomentCard from "../components/HistoryMomentCard";
import HistoryVaultDetailPanel from "../components/HistoryVaultDetailPanel";
import LoadingState from "../components/LoadingState";
import { historyMoments } from "../lib/fallbackData";
import { getConstructorStandings, getCurrentRaceSchedule, getDriverStandings, getLatestRaceResults } from "../lib/f1Api";
import { getOpenF1Meetings, getOpenF1Sessions, getOpenF1Drivers } from "../lib/api/openF1Client";
import { countryFlag } from "../lib/teamColors";
import type { ApiResponse, ConstructorStanding, DriverStanding, Race } from "../lib/types";
import type { OpenF1Driver } from "../lib/api/apiTypes";

export default function Dashboard() {
  const [races, setRaces] = useState<ApiResponse<Race[]> | null>(null);
  const [drivers, setDrivers] = useState<ApiResponse<DriverStanding[]> | null>(null);
  const [constructors, setConstructors] = useState<ApiResponse<ConstructorStanding[]> | null>(null);
  const [openF1Drivers, setOpenF1Drivers] = useState<OpenF1Driver[]>([]);
  const [activeTab, setActiveTab] = useState<"drivers" | "teams">("drivers");
  
  const [selectedMomentId, setSelectedMomentId] = useState<string | null>(null);
  const detailPanelRef = useRef<HTMLElement>(null);

  const selectedMoment = useMemo(() => {
    return historyMoments.find((m) => m.id === selectedMomentId);
  }, [selectedMomentId]);

  // Fetch Jolpica standings data
  useEffect(() => {
    void Promise.all([
      getCurrentRaceSchedule(), 
      getDriverStandings(), 
      getConstructorStandings(),
      getLatestRaceResults()
    ]).then(
      ([raceData, driverData, constructorData]) => {
        setRaces(raceData);
        setDrivers(driverData);
        setConstructors(constructorData);
      },
    );
  }, []);

  // Fetch OpenF1 drivers for headshots + team colors
  useEffect(() => {
    async function loadOpenF1Drivers() {
      try {
        const year = new Date().getFullYear();
        const meetings = await getOpenF1Meetings(year);
        meetings.sort((a, b) => new Date(b.date_start).getTime() - new Date(a.date_start).getTime());
        for (const meeting of meetings) {
          const sessions = await getOpenF1Sessions(meeting.meeting_key);
          const completed = sessions.filter(s => s.date_end && new Date(s.date_end).getTime() < Date.now());
          if (completed.length > 0) {
            completed.sort((a, b) => new Date(b.date_start).getTime() - new Date(a.date_start).getTime());
            const drv = await getOpenF1Drivers(completed[0].session_key);
            const unique = Array.from(new Map(drv.map(d => [d.driver_number, d])).values());
            setOpenF1Drivers(unique);
            break;
          }
        }
      } catch (err) {
        console.error("Failed to load OpenF1 drivers for headshots:", err);
      }
    }
    loadOpenF1Drivers();
  }, []);

  const featuredRace = useMemo(() => {
    const today = new Date();
    const upcoming = races?.data.find((race) => new Date(race.date) >= today);
    return upcoming ?? races?.data[0];
  }, [races]);

  // Match Jolpica drivers to OpenF1 drivers for headshots
  const enrichedDrivers = useMemo(() => {
    if (!drivers?.data) return [];
    return drivers.data.map(d => {
      const match = openF1Drivers.find(o => {
        const jolpicaLast = d.driverName.split(" ").slice(-1)[0].toLowerCase();
        return o.last_name.toLowerCase() === jolpicaLast || 
               o.full_name.toLowerCase() === d.driverName.toLowerCase() ||
               (d.code && o.name_acronym === d.code);
      });
      return {
        ...d,
        headshotUrl: match?.headshot_url,
        teamColour: match?.team_colour,
        countryCode: match?.country_code,
      };
    });
  }, [drivers, openF1Drivers]);

  const top3 = enrichedDrivers.slice(0, 3);
  
  // Reorder for podium display: [2nd, 1st, 3rd]
  const podiumOrder = top3.length === 3 ? [top3[1], top3[0], top3[2]] : top3;

  if (!races || !drivers || !constructors) {
    return <LoadingState />;
  }

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8">
      {/* Event Header */}
      {featuredRace && (
        <EventHeader
          raceName={featuredRace.raceName}
          country={featuredRace.country}
          countryFlag={countryFlag(featuredRace.country === "UK" ? "GB" : featuredRace.country.slice(0,2).toUpperCase())}
          round={featuredRace.round}
          raceDate={featuredRace.date}
          raceTime={featuredRace.time}
          session="RACE"
        />
      )}

      <div className="px-4 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-white/10 mt-4 mb-6">
          <button
            className={`f1-tab ${activeTab === "drivers" ? "active" : ""}`}
            onClick={() => setActiveTab("drivers")}
          >
            Drivers
          </button>
          <button
            className={`f1-tab ${activeTab === "teams" ? "active" : ""}`}
            onClick={() => setActiveTab("teams")}
          >
            Teams
          </button>
        </div>

        {activeTab === "drivers" ? (
          <>
            {/* Podium Top 3 */}
            {podiumOrder.length === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                {podiumOrder.map((driver) => (
                  <PodiumCard
                    key={driver.driverId}
                    position={driver.position}
                    driverName={driver.driverName}
                    constructorName={driver.constructorName}
                    points={driver.points}
                    countryCode={driver.countryCode}
                    headshotUrl={driver.headshotUrl}
                    teamColour={driver.teamColour}
                  />
                ))}
              </div>
            )}

            {/* Full Driver Standings Table */}
            <StandingsTable
              mode="drivers"
              driverData={enrichedDrivers.map(d => ({
                position: d.position,
                driverName: d.driverName,
                constructorName: d.constructorName,
                points: d.points,
                wins: d.wins,
                code: d.code,
                countryCode: d.countryCode,
                teamColour: d.teamColour,
              }))}
            />
          </>
        ) : (
          /* Constructor Standings Table */
          <StandingsTable
            mode="teams"
            constructorData={constructors.data}
          />
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-10">
          <Link
            to="/race-explainer"
            className="bg-[#1e1e28] border border-white/8 p-6 hover:border-racing/40 transition group"
          >
            <span className="text-racing text-[11px] font-bold uppercase tracking-wider">Analysis</span>
            <h3 className="text-lg font-black text-white mt-1 group-hover:text-racing transition">Race Explainer</h3>
            <p className="text-sm text-white/40 mt-1">Understand why each pit stop happened.</p>
          </Link>
          <Link
            to="/strategy-lab"
            className="bg-[#1e1e28] border border-white/8 p-6 hover:border-racing/40 transition group"
          >
            <span className="text-racing text-[11px] font-bold uppercase tracking-wider">Sandbox</span>
            <h3 className="text-lg font-black text-white mt-1 group-hover:text-racing transition">Strategy Lab</h3>
            <p className="text-sm text-white/40 mt-1">Compare head-to-head driver pace.</p>
          </Link>
          <Link
            to="/learn"
            className="bg-[#1e1e28] border border-white/8 p-6 hover:border-racing/40 transition group"
          >
            <span className="text-racing text-[11px] font-bold uppercase tracking-wider">Education</span>
            <h3 className="text-lg font-black text-white mt-1 group-hover:text-racing transition">Learn Strategy</h3>
            <p className="text-sm text-white/40 mt-1">Master F1 terms and race rules.</p>
          </Link>
        </div>

        {/* History Vault */}
        <section className="mt-16 mb-10">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-racing">Archive</p>
              <h2 className="mt-2 text-3xl font-black text-white">F1 History Vault</h2>
              <p className="mt-2 max-w-2xl text-white/40">Iconic moments every F1 fan eventually revisits.</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {historyMoments.map((moment) => (
              <HistoryMomentCard 
                key={moment.id} 
                moment={moment} 
                isSelected={selectedMomentId === moment.id}
                onClick={() => {
                  if (selectedMomentId === moment.id) {
                    setSelectedMomentId(null);
                  } else {
                    setSelectedMomentId(moment.id);
                    setTimeout(() => {
                      detailPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 50);
                  }
                }}
              />
            ))}
          </div>
          
          {selectedMoment && (
            <HistoryVaultDetailPanel 
              ref={detailPanelRef}
              moment={selectedMoment} 
              onClose={() => setSelectedMomentId(null)} 
            />
          )}
        </section>
      </div>
    </div>
  );
}
