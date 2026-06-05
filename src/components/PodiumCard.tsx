import { getTeamColor, countryFlag, ordinalSuffix } from "../lib/teamColors";

interface PodiumCardProps {
  position: number;
  driverName: string;
  constructorName: string;
  points: number;
  countryCode?: string;
  headshotUrl?: string;
  teamColour?: string;
}

export default function PodiumCard({
  position,
  driverName,
  constructorName,
  points,
  countryCode,
  headshotUrl,
  teamColour,
}: PodiumCardProps) {
  const bgColor = getTeamColor(constructorName, teamColour);
  const isCenter = position === 1;
  const flag = countryCode ? countryFlag(countryCode) : "🏁";
  const suffix = ordinalSuffix(position);

  // Determine text color based on background brightness
  const r = parseInt(bgColor.slice(1, 3), 16);
  const g = parseInt(bgColor.slice(3, 5), 16);
  const b = parseInt(bgColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const textColor = luminance > 0.6 ? "text-black" : "text-white";
  const subTextColor = luminance > 0.6 ? "text-black/70" : "text-white/80";

  return (
    <div
      className={`podium-card halftone relative rounded-sm overflow-hidden cursor-pointer ${
        isCenter ? "min-h-[320px] md:min-h-[360px]" : "min-h-[280px] md:min-h-[320px]"
      }`}
      style={{ backgroundColor: bgColor }}
    >
      {/* Content layer above halftone */}
      <div className="relative z-10 flex flex-col justify-between h-full p-5 md:p-6">
        {/* Top: position + driver info */}
        <div>
          <div className={`${textColor} mb-1`}>
            <span className="text-3xl md:text-4xl font-black leading-none">
              {position}
            </span>
            <span className="ordinal-sup">{suffix}</span>
          </div>
          <h3 className={`text-xl md:text-2xl font-black ${textColor} leading-tight mt-2`}>
            {driverName}
          </h3>
          <p className={`text-sm font-semibold ${subTextColor} mt-0.5`}>
            {constructorName}
          </p>
          <div className="mt-3">
            <span className="text-2xl">{flag}</span>
          </div>
        </div>

        {/* Bottom: points */}
        <div className="mt-auto pt-4">
          <span className={`text-3xl md:text-4xl font-black ${textColor}`}>
            {points}
          </span>
          <span className={`text-sm font-bold ${subTextColor} ml-1 uppercase tracking-wider`}>
            PTS
          </span>
        </div>
      </div>

      {/* Driver headshot */}
      {headshotUrl && (
        <div className="absolute right-0 bottom-0 z-10 h-full flex items-end justify-end pointer-events-none">
          <img
            src={headshotUrl}
            alt={driverName}
            className={`object-contain drop-shadow-2xl ${
              isCenter ? "h-[85%] max-h-[320px]" : "h-[80%] max-h-[280px]"
            }`}
            loading="eager"
          />
        </div>
      )}

      {/* Gradient fade on top of headshot for text readability */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${bgColor} 25%, transparent 65%)`,
        }}
      />
    </div>
  );
}
