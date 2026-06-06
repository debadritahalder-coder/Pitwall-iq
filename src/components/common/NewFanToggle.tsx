import { useNewFanMode } from "../../contexts/NewFanContext";

export function NewFanToggle() {
  const { isNewFanMode, toggleNewFanMode } = useNewFanMode();

  return (
    <button
      onClick={toggleNewFanMode}
      className={`flex items-center gap-1.5 px-2 py-1.5 lg:px-3 rounded border text-[10px] lg:text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ml-2 ${
        isNewFanMode
          ? "bg-electric/20 text-electric border-electric/30 shadow-[0_0_10px_rgba(56,189,248,0.2)]"
          : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
      }`}
      title="Toggle New Fan Mode for beginner-friendly explanations"
    >
      <div className={`w-2 h-2 rounded-full ${isNewFanMode ? "bg-electric shadow-[0_0_5px_#38bdf8]" : "bg-slate-600"}`} />
      <span className="hidden sm:inline">New Fan Mode</span>
      <span className="sm:hidden">Mode</span>
    </button>
  );
}
