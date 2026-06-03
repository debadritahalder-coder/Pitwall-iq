import { forwardRef } from "react";
import type { HistoryMoment } from "../lib/types";

interface HistoryVaultDetailPanelProps {
  moment: HistoryMoment;
  onClose: () => void;
}

const HistoryVaultDetailPanel = forwardRef<HTMLElement, HistoryVaultDetailPanelProps>(
  ({ moment, onClose }, ref) => {
    return (
      <section ref={ref} className="panel relative mt-8 overflow-hidden p-6 lg:p-10 scroll-mt-24 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
        {/* Background ambient glow based on selection */}
        <div className="absolute inset-0 z-0 bg-gradient-to-tr from-racing/5 via-slate-950/40 to-transparent pointer-events-none" />
        
        {/* Geometric accents */}
        <div className="absolute -left-12 top-0 z-0 h-40 w-40 border border-white/5 rounded-full blur-2xl" />
        <div className="absolute right-0 bottom-0 z-0 h-1/2 w-1/3 skew-x-[-20deg] border-l border-t border-racing/10 bg-slate-900/20" />

        <div className="relative z-10">
          <div className="flex flex-col-reverse justify-between gap-6 sm:flex-row sm:items-start">
            <div>
              <p className="inline-flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-racing">
                  {moment.tag}
                </span>
                <span className="h-1 w-1 rounded-full bg-slate-600" />
                <span className="text-xs font-bold tracking-wider text-slate-400">
                  {moment.year}
                </span>
              </p>
              <h3 className="mt-3 text-3xl font-black text-white sm:text-4xl">{moment.title}</h3>
            </div>
            
            <button 
              onClick={onClose}
              className="group flex items-center gap-2 self-end sm:self-start border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <span>Collapse Archive</span>
              <svg className="h-3 w-3 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-8">
              {/* Main Content */}
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 mb-4">Event Dossier</p>
                <div className="prose prose-invert prose-p:leading-relaxed prose-p:text-slate-300 prose-p:mb-5 max-w-none">
                  {moment.longSummary?.split('\n\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Quote / Reaction */}
              {moment.quoteOrPressReaction && (
                <div className="border-l-2 border-racing pl-6 py-2 my-8 bg-gradient-to-r from-racing/10 to-transparent">
                  <p className="text-lg italic leading-relaxed text-slate-200">"{moment.quoteOrPressReaction}"</p>
                  <p className="mt-3 text-xs font-bold uppercase tracking-widest text-racing">Historical Record / Press Reaction</p>
                </div>
              )}

              {/* Legacy / Why it mattered */}
              {moment.whyItMattered && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 mb-4">Why It Mattered</p>
                  <p className="leading-relaxed text-slate-300">{moment.whyItMattered}</p>
                </div>
              )}
            </div>

            {/* Sidebar Data */}
            <div className="space-y-8">
              {/* Hero Image (if different or reusing card image) */}
              {(moment.detailImage || moment.image) && (
                <div className="relative aspect-video overflow-hidden border border-white/10 bg-slate-900">
                  <img 
                    src={moment.detailImage || moment.image} 
                    alt={moment.title}
                    className="h-full w-full object-cover opacity-75 mix-blend-luminosity transition-all duration-700 hover:mix-blend-normal hover:opacity-100"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = moment.image || '';
                    }}
                  />
                  <div className="absolute inset-0 border border-racing/20 mix-blend-overlay pointer-events-none" />
                </div>
              )}

              {/* Key Facts */}
              {moment.keyFacts && (
                <div className="border border-white/5 bg-slate-900/50 p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 mb-5">Key Facts</p>
                  <ul className="space-y-4">
                    {Object.entries(moment.keyFacts).map(([key, value]) => {
                      if (!value) return null;
                      const formattedKey = key.replace(/([A-Z])/g, ' $1').trim();
                      return (
                        <li key={key} className="flex flex-col gap-1 border-b border-white/5 pb-3 last:border-0 last:pb-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{formattedKey}</span>
                          <span className="text-sm font-semibold text-slate-200">{value}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Sources */}
              {moment.sources && moment.sources.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 border-t border-white/10 pt-6">Sources Verified</p>
                  <ul className="space-y-2">
                    {moment.sources.map((source, i) => (
                      <li key={i}>
                        <a 
                          href={source.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-slate-400 hover:text-racing hover:underline decoration-racing/50 underline-offset-4 transition-colors inline-flex items-center gap-1.5"
                        >
                          <svg className="h-3 w-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          {source.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }
);

HistoryVaultDetailPanel.displayName = "HistoryVaultDetailPanel";

export default HistoryVaultDetailPanel;
