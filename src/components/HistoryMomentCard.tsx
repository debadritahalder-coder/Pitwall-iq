import type { HistoryMoment } from "../lib/types";

export default function HistoryMomentCard({ moment }: { moment: HistoryMoment }) {
  return (
    <article className="group panel relative min-h-56 overflow-hidden p-5 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] cursor-pointer">
      {/* Background Image Layer */}
      {moment.image && (
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url('${moment.image}')`, opacity: 0.8 }}
        />
      )}
      
      {/* Dark navy/black overlay for readability and cinematic low-contrast feel */}
      <div className="absolute inset-0 z-0 bg-slate-950/85 transition-opacity duration-300 group-hover:bg-slate-950/70" />
      
      {/* Subtle red gradient accent */}
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-racing/15 to-transparent opacity-50 transition-opacity duration-300 group-hover:opacity-70" />

      {/* Existing geometric elements */}
      <div className="absolute -right-8 -top-8 z-0 h-28 w-28 border border-white/10" />
      <div className="absolute bottom-8 right-8 z-0 h-16 w-24 skew-x-[-18deg] border-b border-t border-racing/25" />

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
