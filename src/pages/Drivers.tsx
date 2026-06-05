import { useMemo } from "react";
import { F1_DRIVER_ASSETS, F1DriverAsset } from "../lib/f1Assets";
import { countryFlag } from "../lib/teamColors";

export default function Drivers() {
  // Group drivers by team
  const teamGroups = useMemo(() => {
    const groups = new Map<string, F1DriverAsset[]>();
    for (const driver of F1_DRIVER_ASSETS) {
      const team = driver.team;
      if (!groups.has(team)) groups.set(team, []);
      groups.get(team)!.push(driver);
    }
    return Array.from(groups.entries());
  }, []);

  return (
    <div className="space-y-10 py-10">
      <section>
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-racing">2026 Season</p>
        <h1 className="mt-3 text-4xl font-black text-white sm:text-6xl">F1 Drivers</h1>
        <p className="mt-4 max-w-2xl text-lg text-white/50">
          The full grid competing in the FIA Formula One World Championship.
        </p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {F1_DRIVER_ASSETS.map(driver => (
          <div
            key={driver.driverSlug}
            className="halftone relative overflow-hidden group cursor-pointer rounded-sm"
            style={{ backgroundColor: driver.teamColor }}
          >
            {/* Team colored card with halftone */}
            <div className="relative z-10 flex flex-col h-[300px]">
              {/* Top content */}
              <div className="p-5 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-4xl font-black text-white/20">
                    {driver.number}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white leading-tight">
                  {driver.firstName}
                </h2>
                <h2 className="text-2xl font-black text-white uppercase leading-tight">
                  {driver.lastName}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-lg">{countryFlag(driver.countryCode)}</span>
                  <img
                    src={driver.teamLogo}
                    alt={driver.team}
                    className="h-4 w-auto opacity-80"
                    loading="lazy"
                    crossOrigin="anonymous"
                  />
                </div>
                <p className="text-sm text-white/70 font-semibold mt-1">{driver.team}</p>
              </div>

              {/* Driver headshot */}
              <div className="absolute right-0 bottom-0 h-full flex items-end justify-end pointer-events-none">
                <img
                  src={driver.headshot}
                  alt={driver.firstName + " " + driver.lastName}
                  className="h-[85%] object-contain object-bottom drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  crossOrigin="anonymous"
                />
              </div>
            </div>

            {/* Gradient overlay */}
            <div
              className="absolute inset-0 z-[5] pointer-events-none"
              style={{
                background: `linear-gradient(135deg, ${driver.teamColor} 25%, ${driver.teamColor}88 50%, transparent 70%)`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Teams Section */}
      <section className="mt-12">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-racing mb-2">Teams</p>
        <h2 className="text-3xl font-black text-white mb-8">Constructors</h2>

        <div className="space-y-4">
          {teamGroups.map(([teamName, teamDrivers]) => {
            const asset = teamDrivers[0];
            return (
              <div
                key={teamName}
                className="bg-[#1e1e28] border border-white/8 overflow-hidden flex flex-col md:flex-row items-stretch"
              >
                {/* Team info */}
                <div
                  className="flex items-center gap-4 p-5 md:w-[280px] border-b md:border-b-0 md:border-r border-white/8"
                  style={{ borderLeftColor: asset.teamColor, borderLeftWidth: 4 }}
                >
                  <img
                    src={asset.teamLogo}
                    alt={teamName}
                    className="h-7 w-auto"
                    loading="lazy"
                    crossOrigin="anonymous"
                  />
                  <span className="text-white font-black text-lg">{teamName}</span>
                </div>

                {/* Car image */}
                <div className="hidden md:flex items-center justify-center px-6 md:w-[220px]">
                  <img
                    src={asset.teamCar}
                    alt={`${teamName} car`}
                    className="h-12 w-auto object-contain"
                    loading="lazy"
                    crossOrigin="anonymous"
                  />
                </div>

                {/* Drivers */}
                <div className="flex-1 flex divide-x divide-white/8">
                  {teamDrivers.map(d => (
                    <div key={d.driverSlug} className="flex-1 flex items-center gap-3 p-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-white/10">
                        <img
                          src={d.headshotSmall}
                          alt={d.firstName + " " + d.lastName}
                          className="w-full h-full object-cover object-top scale-125 origin-top"
                          loading="lazy"
                          crossOrigin="anonymous"
                        />
                      </div>
                      <div>
                        <p className="text-white text-sm font-bold">
                          {d.firstName} <span className="font-black uppercase">{d.lastName}</span>
                        </p>
                        <p className="text-white/40 text-xs">{d.code} · #{d.number}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
