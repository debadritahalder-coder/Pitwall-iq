import { countryFlag, ordinalSuffix } from "../lib/teamColors";

interface PodiumCardProps {
  position: number;
  driverName: string;
  constructorName: string;
  points: number;
  countryCode?: string;
  headshotUrl?: string;
  teamColor: string;
  teamLogoUrl?: string;
}

export default function PodiumCard({
  position,
  driverName,
  constructorName,
  points,
  countryCode,
  headshotUrl,
  teamColor,
  teamLogoUrl,
}: PodiumCardProps) {
  const isCenter = position === 1;
  const flag = countryCode ? countryFlag(countryCode) : "🏁";
  const suffix = ordinalSuffix(position);

  // Determine text color based on background brightness
  const hex = teamColor.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const textColor = luminance > 0.55 ? "text-black" : "text-white";
  const subTextColor = luminance > 0.55 ? "text-black/70" : "text-white/80";

  // Split driver name for F1-style formatting
  const nameParts = driverName.split(" ");
  const firstName = nameParts.slice(0, -1).join(" ");
  const lastName = nameParts.slice(-1)[0];

  return (
    <div
      className={`podium-card halftone relative rounded-sm overflow-hidden cursor-pointer ${
        isCenter ? "min-h-[320px] md:min-h-[380px]" : "min-h-[280px] md:min-h-[340px]"
      }`}
      style={{ backgroundColor: teamColor }}
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
            {firstName}
            <br />
            <span className="text-2xl md:text-3xl">{lastName}</span>
          </h3>
          <p className={`text-sm font-semibold ${subTextColor} mt-1`}>
            {constructorName}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-2xl">{flag}</span>
            {teamLogoUrl && (
              <img
                src={teamLogoUrl}
                alt={constructorName}
                className="h-5 w-auto opacity-80"
                loading="eager"
              />
            )}
          </div>
        </div>

        {/* Bottom: points */}
        <div className="mt-auto pt-4">
          <span className={`text-4xl md:text-5xl font-black ${textColor}`}>
            {points}
          </span>
          <span className={`text-sm font-bold ${subTextColor} ml-1.5 uppercase tracking-wider`}>
            PTS
          </span>
        </div>
      </div>

      {/* Driver headshot — official F1.com image */}
      {headshotUrl && (
        <div className="absolute right-0 bottom-0 z-10 h-full flex items-end justify-end pointer-events-none">
          <img
            src={headshotUrl}
            alt={driverName}
            className={`object-contain object-bottom drop-shadow-2xl ${
              isCenter ? "h-[88%] max-h-[350px]" : "h-[82%] max-h-[300px]"
            }`}
            loading="eager"
            crossOrigin="anonymous"
          />
        </div>
      )}

      {/* Gradient fade for text readability */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${teamColor} 30%, ${teamColor}99 50%, transparent 70%)`,
        }}
      />
    </div>
  );
}
