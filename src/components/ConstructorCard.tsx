import { useState } from "react";
import type { ConstructorStanding } from "../lib/types";

const getTeamBranding = (constructorId: string) => {
  const id = constructorId.toLowerCase();
  
  const brandings: Record<string, { color: string, logo: string }> = {
    ferrari: { color: "#ef4444", logo: "ferrari.png" }, // muted red
    mercedes: { color: "#6ee7b7", logo: "mercedes.png" }, // muted cyan
    mclaren: { color: "#f97316", logo: "mclaren.png" }, // papaya
    red_bull: { color: "#60a5fa", logo: "red-bull.png" }, // muted blue
    alpine: { color: "#38bdf8", logo: "alpine.png" }, // muted blue/pink
    aston_martin: { color: "#10b981", logo: "aston-martin.png" }, // green
    williams: { color: "#3b82f6", logo: "williams.png" },
    haas: { color: "#e2e8f0", logo: "haas.png" },
    sauber: { color: "#4ade80", logo: "sauber.png" },
    rb: { color: "#818cf8", logo: "rb.png" },
  };

  const match = brandings[id] || brandings[id.replace(" ", "_")];
  if (match) return match;
  
  return { color: "#f8fafc", logo: `${id.replace(/[^a-z0-9]/g, "-")}.png` };
};

export default function ConstructorCard({ constructorStanding }: { constructorStanding: ConstructorStanding }) {
  const branding = getTeamBranding(constructorStanding.constructorId);
  const [imgError, setImgError] = useState(false);

  const getInitials = (name: string) => {
    const words = name.replace(/F1 Team|Team/i, '').trim().split(" ");
    if (words.length > 1 && words[1].length > 0) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 3).toUpperCase();
  };

  return (
    <article className="group flex items-center justify-between gap-4 border-b border-white/10 py-4 px-3 -mx-3 transition-all duration-300 hover:bg-slate-900/40 hover:shadow-[0_0_15px_rgba(225,6,0,0.05)] rounded-md last:border-b-0">
      <div className="flex items-center gap-4">
        {/* Rank Badge */}
        <span className="grid h-10 w-10 shrink-0 place-items-center bg-white/5 text-sm font-black text-racing transition-colors group-hover:bg-racing/10">
          P{constructorStanding.position}
        </span>
        
        {/* Logo Container */}
        <div className="flex h-10 w-10 shrink-0 place-items-center justify-center rounded-md bg-slate-950/60 border border-white/5 p-1.5 shadow-inner">
          {!imgError ? (
            <img 
              src={`/teams/${branding.logo}`} 
              alt={`${constructorStanding.constructorName} logo`}
              className="h-full w-full object-contain opacity-70 transition-opacity duration-300 group-hover:opacity-100"
              onError={() => setImgError(true)}
            />
          ) : (
            <span 
              className="text-xs font-black tracking-widest opacity-80 transition-opacity duration-300 group-hover:opacity-100" 
              style={{ color: branding.color }}
            >
              {getInitials(constructorStanding.constructorName)}
            </span>
          )}
        </div>

        {/* Team Details */}
        <div>
          <h3 className="font-black transition-opacity" style={{ color: branding.color, opacity: 0.9 }}>
            {constructorStanding.constructorName}
          </h3>
          <p className="text-sm text-slate-500 transition-colors group-hover:text-slate-400">
            {constructorStanding.nationality}
          </p>
        </div>
      </div>
      
      <div className="text-right">
        <p className="font-black text-white">{constructorStanding.points} pts</p>
        <p className="text-xs text-slate-500">{constructorStanding.wins} wins</p>
      </div>
    </article>
  );
}
