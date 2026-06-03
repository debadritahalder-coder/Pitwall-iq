import type { ConstructorStanding } from "../lib/types";

export default function ConstructorCard({ constructorStanding }: { constructorStanding: ConstructorStanding }) {
  return (
    <article className="flex items-center justify-between gap-4 border-b border-white/10 py-4 last:border-b-0">
      <div className="flex items-center gap-4">
        <span className="grid h-10 w-10 place-items-center bg-white/5 text-sm font-black text-racing">P{constructorStanding.position}</span>
        <div>
          <h3 className="font-black text-white">{constructorStanding.constructorName}</h3>
          <p className="text-sm text-slate-500">{constructorStanding.nationality}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-black text-white">{constructorStanding.points} pts</p>
        <p className="text-xs text-slate-500">{constructorStanding.wins} wins</p>
      </div>
    </article>
  );
}
