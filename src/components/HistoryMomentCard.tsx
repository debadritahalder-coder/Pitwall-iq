import type { HistoryMoment } from "../lib/types";

interface HistoryMomentCardProps {
  moment: HistoryMoment;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function HistoryMomentCard({ moment, isSelected, onClick }: HistoryMomentCardProps) {
  return (
    <article 
      className={`group panel relative min-h-56 overflow-hidden p-5 transition-all duration-300 ease-in-out hover:scale-[1.02] cursor-pointer ${
        isSelected 
          ? "scale-[1.02] shadow-[0_0_30px_rgba(220,38,38,0.25)] border-racing/60" 
          : "hover:shadow-[0_0_30px_rgba(220,38,38,0.15)]"
      }`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-expanded={isSelected}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* Background Image Layer */}
      {moment.image && (
        <div 
          className={`absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 ${
            isSelected ? "scale-105" : "group-hover:scale-105"
          }`}
          style={{ backgroundImage: `url('${moment.image}')`, opacity: 0.8 }}
        />
      )}
      
      {/* Dark navy/black overlay for readability and cinematic low-contrast feel */}
      <div className={`absolute inset-0 z-0 transition-opacity duration-300 ${
        isSelected ? "bg-slate-950/60" : "bg-slate-950/85 group-hover:bg-slate-950/70"
      }`} />
      
      {/* Subtle red gradient accent */}
      <div className={`absolute inset-0 z-0 bg-gradient-to-tr from-racing/15 to-transparent transition-opacity duration-300 ${
        isSelected ? "opacity-90" : "opacity-50 group-hover:opacity-70"
      }`} />

      {/* Existing geometric elements */}
      <div className={`absolute -right-8 -top-8 z-0 h-28 w-28 border transition-colors duration-300 ${
        isSelected ? "border-racing/40" : "border-white/10"
      }`} />
      <div className={`absolute bottom-8 right-8 z-0 h-16 w-24 skew-x-[-18deg] border-b border-t transition-colors duration-300 ${
        isSelected ? "border-racing/50" : "border-racing/25"
      }`} />

      {/* Card Content */}
      <div className="relative z-10 flex h-full flex-col">
        <div>
          <span className="inline-flex bg-racing/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-racing">
            {moment.tag}
          </span>
        </div>
        <h3 className="mt-6 text-xl font-black text-white">{moment.title}</h3>
        <p className="mt-4 text-sm leading-6 text-slate-400">{moment.description}</p>
      </div>
    </article>
  );
}
