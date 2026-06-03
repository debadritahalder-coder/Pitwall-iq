import type { DriverStanding } from "../lib/types";

type DriverCardProps = {
  driver: DriverStanding;
  momentum: number;
  label: "Hot" | "Stable" | "Risky" | "Rebuilding";
};

const labelClass = {
  Hot: "bg-emerald-400/15 text-emerald-300",
  Stable: "bg-electric/15 text-sky-300",
  Risky: "bg-orange-400/15 text-orange-300",
  Rebuilding: "bg-slate-400/15 text-slate-300",
};

export default function DriverCard({ driver, momentum, label }: DriverCardProps) {
  return (
    <article className="panel p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-racing">P{driver.position}</p>
          <h3 className="mt-2 text-xl font-black text-white">{driver.driverName}</h3>
          <p className="mt-1 text-sm text-slate-400">{driver.constructorName}</p>
        </div>
        <span className={`px-3 py-1 text-xs font-bold ${labelClass[label]}`}>{label}</span>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-slate-500">Points</p>
          <p className="text-lg font-black text-white">{driver.points}</p>
        </div>
        <div>
          <p className="text-slate-500">Wins</p>
          <p className="text-lg font-black text-white">{driver.wins}</p>
        </div>
        <div>
          <p className="text-slate-500">Momentum</p>
          <p className="text-lg font-black text-gold">{momentum}</p>
        </div>
      </div>
      <div className="mt-5 h-2 bg-white/10">
        <div className="h-full bg-racing" style={{ width: `${momentum}%` }} />
      </div>
    </article>
  );
}
