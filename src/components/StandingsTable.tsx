import { getTeamColor, countryFlag } from "../lib/teamColors";

interface DriverRow {
  position: number;
  driverName: string;
  constructorName: string;
  points: number;
  wins: number;
  code?: string;
  countryCode?: string;
  teamColour?: string;
}

interface ConstructorRow {
  position: number;
  constructorName: string;
  nationality: string;
  points: number;
  wins: number;
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
        <div className="grid grid-cols-[60px_1fr_120px_1fr_80px] gap-2 px-5 py-3 border-b border-white/10 text-[11px] font-bold text-white/40 uppercase tracking-wider">
          <span>POS.</span>
          <span>DRIVER</span>
          <span>NATIONALITY</span>
          <span>TEAM</span>
          <span className="text-right">PTS.</span>
        </div>
        {/* Rows */}
        {driverData.map((driver, idx) => {
          const teamColor = getTeamColor(driver.constructorName, driver.teamColour);
          const flag = driver.countryCode ? countryFlag(driver.countryCode) : "";
          return (
            <div
              key={driver.driverName + idx}
              className="standings-row grid grid-cols-[60px_1fr_120px_1fr_80px] gap-2 items-center px-5 py-3.5 border-b border-white/5 last:border-b-0"
            >
              <span className="text-white font-bold text-sm">{driver.position}</span>
              <div className="flex items-center gap-3">
                <div
                  className="w-1 h-8 rounded-full"
                  style={{ backgroundColor: teamColor }}
                />
                <div>
                  <span className="text-white font-bold text-sm">
                    {driver.driverName.split(" ").slice(0, -1).join(" ")}{" "}
                    <span className="font-black uppercase">
                      {driver.driverName.split(" ").slice(-1)}
                    </span>
                  </span>
                </div>
              </div>
              <span className="text-white/60 text-sm">{flag} {driver.countryCode || ""}</span>
              <span className="text-white/60 text-sm">{driver.constructorName}</span>
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
        <div className="grid grid-cols-[60px_1fr_120px_100px_80px] gap-2 px-5 py-3 border-b border-white/10 text-[11px] font-bold text-white/40 uppercase tracking-wider">
          <span>POS.</span>
          <span>TEAM</span>
          <span>NATIONALITY</span>
          <span>WINS</span>
          <span className="text-right">PTS.</span>
        </div>
        {/* Rows */}
        {constructorData.map((team, idx) => {
          const teamColor = getTeamColor(team.constructorName);
          return (
            <div
              key={team.constructorName + idx}
              className="standings-row grid grid-cols-[60px_1fr_120px_100px_80px] gap-2 items-center px-5 py-3.5 border-b border-white/5 last:border-b-0"
            >
              <span className="text-white font-bold text-sm">{team.position}</span>
              <div className="flex items-center gap-3">
                <div
                  className="w-1 h-8 rounded-full"
                  style={{ backgroundColor: teamColor }}
                />
                <span className="text-white font-bold text-sm">{team.constructorName}</span>
              </div>
              <span className="text-white/60 text-sm">{team.nationality}</span>
              <span className="text-white/60 text-sm">{team.wins}</span>
              <span className="text-white font-black text-sm text-right">{team.points}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
}
