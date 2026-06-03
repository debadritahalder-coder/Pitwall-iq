import { useEffect, useMemo, useState } from "react";
import DriverCard from "../components/DriverCard";
import ErrorFallback from "../components/ErrorFallback";
import LoadingState from "../components/LoadingState";
import StatCard from "../components/StatCard";
import { getDriverStandings } from "../lib/f1Api";
import type { ApiResponse, DriverStanding } from "../lib/types";

type FormLabel = "Hot" | "Stable" | "Risky" | "Rebuilding";

function calculateMomentum(driver: DriverStanding, maxPoints: number) {
  const positionScore = Math.max(0, 42 - driver.position * 2.5);
  const pointsScore = maxPoints > 0 ? (driver.points / maxPoints) * 38 : 16;
  const winsScore = Math.min(driver.wins * 5, 15);
  const constructorScore = ["Red Bull", "McLaren", "Ferrari", "Mercedes"].includes(driver.constructorName) ? 5 : 0;
  // v0.2 will improve this by weighting each driver's last 5 race results instead of relying mainly on standings.
  return Math.round(Math.min(positionScore + pointsScore + winsScore + constructorScore, 100));
}

function labelForMomentum(score: number): FormLabel {
  if (score >= 78) return "Hot";
  if (score >= 58) return "Stable";
  if (score >= 38) return "Risky";
  return "Rebuilding";
}

export default function Drivers() {
  const [drivers, setDrivers] = useState<ApiResponse<DriverStanding[]> | null>(null);

  useEffect(() => {
    void getDriverStandings().then(setDrivers);
  }, []);

  const driverForms = useMemo(() => {
    const maxPoints = Math.max(...(drivers?.data.map((driver) => driver.points) ?? [0]));
    return (drivers?.data ?? []).slice(0, 10).map((driver) => {
      const momentum = calculateMomentum(driver, maxPoints);
      return { driver, momentum, label: labelForMomentum(momentum) };
    });
  }, [drivers]);

  if (!drivers) {
    return <LoadingState label="Loading driver form" />;
  }

  const best = [...driverForms].sort((a, b) => b.momentum - a.momentum)[0];
  const consistent = driverForms.find((item) => item.label === "Stable") ?? driverForms[1];
  const darkHorse = [...driverForms].filter((item) => item.driver.position > 5).sort((a, b) => b.momentum - a.momentum)[0] ?? driverForms[driverForms.length - 1];

  return (
    <div className="space-y-10 py-10">
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-racing">Driver intelligence</p>
        <h1 className="mt-3 text-4xl font-black text-white sm:text-6xl">Driver Form Tracker</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-400">Standings show points. Form shows momentum.</p>
      </section>

      {drivers.source === "fallback" ? <ErrorFallback message={drivers.error} /> : null}

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Best current momentum" value={best?.driver.driverName ?? "TBC"} detail={`${best?.momentum ?? 0}/100`} accent="green" />
        <StatCard label="Most consistent contender" value={consistent?.driver.driverName ?? "TBC"} detail={consistent?.label} accent="blue" />
        <StatCard label="Biggest dark horse" value={darkHorse?.driver.driverName ?? "TBC"} detail={`P${darkHorse?.driver.position ?? "-"}`} accent="gold" />
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {driverForms.map((item) => (
          <DriverCard key={item.driver.driverId} driver={item.driver} momentum={item.momentum} label={item.label} />
        ))}
      </section>
    </div>
  );
}
