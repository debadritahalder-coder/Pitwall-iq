import { countryFlag } from "../lib/teamColors";

interface DriverRow {
  position: number;
  driverName: string;
  constructorName: string;
  points: number;
  wins: number;
  code?: string;
  countryCode?: string;
  teamColor: string;
  headshotSmall?: string;
  teamLogoUrl?: string;
}

interface ConstructorRow {
  position: number;
  constructorName: string;
  nationality: string;
  points: number;
  wins: number;
  teamColor?: string;
  teamLogoUrl?: string;
  teamCarUrl?: string;
}

interface StandingsTableProps {
  mode: "drivers" | "teams";
  driverData?: DriverRow[];
  constructorData?: ConstructorRow[];
}

export default function StandingsTable({ mode, driverData, constructorData }: StandingsTableProps) {
  if (mode === "drivers" && driverData) {
    return (
      <div className="bg-[#1e1e28] border border-white/8 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[50px_1fr_100px_1fr_70px] md:grid-cols-[60px_1fr_120px_1fr_80px] gap-2 px-4 md:px-5 py-3 border-b border-white/10 text-[10px] md:text-[11px] font-bold text-white/40 uppercase tracking-wider">
          <span>POS.</span>
          <span>DRIVER</span>
          <span>NATIONALITY</span>
          <span>TEAM</span>
          <span className="text-right">PTS.</span>
        </div>
        {/* Rows */}
        {driverData.map((driver, idx) => {
          const flag = driver.countryCode ? countryFlag(driver.countryCode) : "";
          const nameParts = driver.driverName.split(" ");
          const firstName = nameParts.slice(0, -1).join(" ");
          const lastName = nameParts.slice(-1)[0];
          return (
            <div
              key={driver.driverName + idx}
              className="standings-row grid grid-cols-[50px_1fr_100px_1fr_70px] md:grid-cols-[60px_1fr_120px_1fr_80px] gap-2 items-center px-4 md:px-5 py-3 border-b border-white/5 last:border-b-0"
            >
              <span className="text-white font-bold text-sm">{driver.position}</span>
              <div className="flex items-center gap-2 md:gap-3">
                <div
                  className="w-1 h-8 rounded-full flex-shrink-0"
                  style={{ backgroundColor: driver.teamColor }}
                />
                {driver.headshotSmall && (
                  <img
                    src={driver.headshotSmall}
                    alt={driver.driverName}
                    className="w-8 h-8 rounded-full object-cover bg-white/10 flex-shrink-0 hidden sm:block"
                    loading="lazy"
                    crossOrigin="anonymous"
                  />
                )}
                <div className="min-w-0">
                  <span className="text-white text-sm">
                    <span className="hidden sm:inline">{firstName} </span>
                    <span className="font-black uppercase">{lastName}</span>
                  </span>
                </div>
              </div>
              <span className="text-white/60 text-sm">{flag}</span>
              <div className="flex items-center gap-2">
                {driver.teamLogoUrl && (
                  <img
                    src={driver.teamLogoUrl}
                    alt={driver.constructorName}
                    className="h-4 w-auto opacity-70 flex-shrink-0 hidden md:block"
                    loading="lazy"
                    crossOrigin="anonymous"
                  />
                )}
                <span className="text-white/60 text-sm truncate">{driver.constructorName}</span>
              </div>
              <span className="text-white font-black text-sm text-right">{driver.points}</span>
            </div>
          );
        })}
      </div>
    );
  }

  if (mode === "teams" && constructorData) {
    return (
      <div className="bg-[#1e1e28] border border-white/8 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[50px_1fr_1fr_70px] md:grid-cols-[60px_1fr_200px_1fr_80px] gap-2 px-4 md:px-5 py-3 border-b border-white/10 text-[10px] md:text-[11px] font-bold text-white/40 uppercase tracking-wider">
          <span>POS.</span>
          <span>TEAM</span>
          <span className="hidden md:block">CAR</span>
          <span>NATIONALITY</span>
          <span className="text-right">PTS.</span>
        </div>
        {/* Rows */}
        {constructorData.map((team, idx) => {
          return (
            <div
              key={team.constructorName + idx}
              className="standings-row grid grid-cols-[50px_1fr_1fr_70px] md:grid-cols-[60px_1fr_200px_1fr_80px] gap-2 items-center px-4 md:px-5 py-3.5 border-b border-white/5 last:border-b-0"
            >
              <span className="text-white font-bold text-sm">{team.position}</span>
              <div className="flex items-center gap-3">
                <div
                  className="w-1 h-8 rounded-full flex-shrink-0"
                  style={{ backgroundColor: team.teamColor || "#555" }}
                />
                {team.teamLogoUrl && (
                  <img
                    src={team.teamLogoUrl}
                    alt={team.constructorName}
                    className="h-5 w-auto opacity-80 flex-shrink-0"
                    loading="lazy"
                    crossOrigin="anonymous"
                  />
                )}
                <span className="text-white font-bold text-sm">{team.constructorName}</span>
              </div>
              {/* Car image */}
              <div className="hidden md:block">
                {team.teamCarUrl && (
                  <img
                    src={team.teamCarUrl}
                    alt={`${team.constructorName} car`}
                    className="h-8 w-auto object-contain"
                    loading="lazy"
                    crossOrigin="anonymous"
                  />
                )}
              </div>
              <span className="text-white/60 text-sm">{team.nationality}</span>
              <span className="text-white font-black text-sm text-right">{team.points}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
}
