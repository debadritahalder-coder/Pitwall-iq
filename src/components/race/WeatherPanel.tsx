import type { OpenF1Weather } from "../../lib/api/apiTypes";

interface WeatherPanelProps {
  weather: OpenF1Weather[];
}

export function WeatherPanel({ weather }: WeatherPanelProps) {
  if (!weather || weather.length === 0) return null;

  const validTemp = weather.filter(w => w.track_temperature !== null && w.track_temperature !== undefined);
  const avgTemp = validTemp.length > 0 
    ? validTemp.reduce((sum, w) => sum + w.track_temperature, 0) / validTemp.length 
    : 0;
    
  const minTemp = validTemp.length > 0 ? Math.min(...validTemp.map(w => w.track_temperature)) : 0;
  const maxTemp = validTemp.length > 0 ? Math.max(...validTemp.map(w => w.track_temperature)) : 0;
  
  const hasRain = weather.some(w => w.rainfall === 1);

  return (
    <div className="bg-carbon border border-white/10 p-6">
      <h2 className="mb-4 text-xl font-bold uppercase text-white">Weather Conditions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/5 p-4 border border-white/10">
        <div>
          <span className="text-xs text-slate-400 uppercase block mb-1">Avg Track Temp</span>
          <span className="font-bold text-white">{avgTemp ? `${avgTemp.toFixed(1)}°C` : "N/A"}</span>
        </div>
        <div>
          <span className="text-xs text-slate-400 uppercase block mb-1">Temp Range</span>
          <span className="font-bold text-white">{minTemp && maxTemp ? `${minTemp.toFixed(1)}°C - ${maxTemp.toFixed(1)}°C` : "N/A"}</span>
        </div>
        <div>
          <span className="text-xs text-slate-400 uppercase block mb-1">Rainfall</span>
          <span className={`font-bold ${hasRain ? "text-blue-400" : "text-slate-300"}`}>{hasRain ? "Detected" : "None"}</span>
        </div>
        <div>
          <span className="text-xs text-slate-400 uppercase block mb-1">Note</span>
          <span className="font-bold text-white text-sm">
            {hasRain ? "Wet/Mixed conditions likely affected strategy." : "Dry race."}
          </span>
        </div>
      </div>
    </div>
  );
}
