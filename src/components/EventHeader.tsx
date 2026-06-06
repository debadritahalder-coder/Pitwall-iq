import { useEffect, useState, useRef } from "react";

interface EventHeaderProps {
  raceName: string;
  country: string;
  countryFlag?: string;
  round: string;
  raceDate: string;
  raceTime?: string;
  session?: string;
}

export default function EventHeader({ raceName, country, countryFlag: flag, round, raceDate, raceTime, session }: EventHeaderProps) {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    const targetTime = raceTime ? `${raceDate}T${raceTime}` : `${raceDate}T14:00:00Z`;
    const target = new Date(targetTime).getTime();

    function tick() {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / (1000 * 60)) % 60),
        secs: Math.floor((diff / 1000) % 60),
      });
    }
    tick();
    intervalRef.current = setInterval(tick, 1000);
    return () => clearInterval(intervalRef.current);
  }, [raceDate, raceTime]);

  const pad = (n: number) => String(n).padStart(2, "0");
  const isLive = countdown.days === 0 && countdown.hours === 0 && countdown.mins === 0 && countdown.secs === 0;

  const localTime = new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false });
  const trackTime = raceTime
    ? new Date(`${raceDate}T${raceTime}`).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" })
    : "--:--";

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 sm:px-6 bg-[#1e1e28] border-b border-white/8">
      {/* Left: Race info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {flag && <span className="text-lg">{flag}</span>}
          <span className="text-white font-bold text-sm">{country || raceName}</span>
          <svg className="w-3 h-3 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </div>
        <div className="flex items-center gap-2">
          {session && (
            <span className="bg-white/10 text-white text-[11px] font-extrabold px-2.5 py-1 tracking-wider uppercase">
              {session}
            </span>
          )}
          {!isLive ? (
            <span className="text-white/70 text-xs font-bold tracking-wider font-mono">
              {countdown.days > 0 && <>{countdown.days}<span className="text-white/40 text-[10px]">D </span></>}
              {pad(countdown.hours)}<span className="text-white/40 text-[10px] countdown-separator">H </span>
              {pad(countdown.mins)}<span className="text-white/40 text-[10px] countdown-separator">M </span>
              {pad(countdown.secs)}<span className="text-white/40 text-[10px]">S</span>
            </span>
          ) : (
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="status-dot" /> LIVE
            </span>
          )}
        </div>
      </div>

      {/* Right: Times */}
      <div className="flex items-center gap-5 text-[11px] font-bold text-white/60 uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <span className="text-white/40">●</span>
          <span>MY TIME</span>
          <span className="text-white font-mono text-xs">{localTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/40">TRACK TIME</span>
          <span className="text-white font-mono text-xs">{trackTime}</span>
        </div>
      </div>
    </div>
  );
}
