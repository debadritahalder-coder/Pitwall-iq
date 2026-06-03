import { useState } from "react";
import { 
  strategyTerms, 
  regulationTopics2026, 
  eraComparisonRows, 
  raceDayImpactCards,
  basicF1Rules
} from "../lib/learnData";

function GlossaryItem({ term }: { term: typeof strategyTerms[0] }) {
  const [expanded, setExpanded] = useState(false);

  const isTyre = term.id.includes("tyre");
  let accentColor = "bg-racing/20 text-racing border-racing/30";
  let leftBorder = "border-l-racing/50";
  
  if (term.id === "soft-tyre") { accentColor = "bg-racing/20 text-racing border-racing/30"; leftBorder = "border-l-racing"; }
  else if (term.id === "medium-tyre") { accentColor = "bg-gold/20 text-gold border-gold/30"; leftBorder = "border-l-gold"; }
  else if (term.id === "hard-tyre") { accentColor = "bg-slate-300/20 text-slate-300 border-slate-300/30"; leftBorder = "border-l-slate-300"; }
  else if (term.id === "intermediate-tyre") { accentColor = "bg-emerald-500/20 text-emerald-500 border-emerald-500/30"; leftBorder = "border-l-emerald-500"; }
  else if (term.id === "wet-tyre") { accentColor = "bg-blue-500/20 text-blue-500 border-blue-500/30"; leftBorder = "border-l-blue-500"; }

  const activeStyle = expanded ? `border-white/20 bg-slate-800 shadow-[0_0_15px_rgba(220,38,38,0.05)] ${leftBorder}` : `border-white/5 bg-slate-900/50 border-l-transparent`;

  return (
    <div className={`panel p-6 transition-all duration-300 hover:scale-[1.015] hover:bg-slate-800 hover:shadow-[0_0_20px_rgba(220,38,38,0.08)] hover:border-white/10 hover:${leftBorder} border-l-2 ${activeStyle}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {isTyre ? (
               <span className={`inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border rounded-sm ${accentColor}`}>Tyre</span>
            ) : (
               <span className="inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border rounded-sm bg-slate-800 text-slate-400 border-slate-700">Strategy</span>
            )}
          </div>
          <h3 className="text-xl font-black text-white">{term.term}</h3>
          <p className="mt-2 text-sm text-slate-300">{term.shortDefinition}</p>
        </div>
        <button 
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-300 hover:bg-racing hover:text-white transition-colors"
        >
          <svg className={`h-4 w-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {expanded && (
        <div className="mt-6 space-y-4 border-t border-white/10 pt-6 animate-in fade-in slide-in-from-top-2">
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">Beginner Explanation</span>
            <p className="mt-1 text-sm text-slate-300">{term.beginnerExplanation}</p>
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">Pitwall Meaning</span>
            <p className="mt-1 text-sm text-white">{term.pitwallMeaning}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-emerald-500">Works best when</span>
              <p className="mt-1 text-sm text-slate-300">{term.whenItMatters}</p>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-racing">Strategy Risk</span>
              <p className="mt-1 text-sm text-slate-300">{term.risk}</p>
            </div>
          </div>
          {term.relatedTerms && term.relatedTerms.length > 0 && (
            <div className="pt-2">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Related Terms</span>
              <div className="flex flex-wrap gap-2">
                {term.relatedTerms.map(rt => (
                  <span key={rt} className="rounded border border-white/10 bg-slate-800 px-2 py-1 text-[10px] font-bold uppercase text-slate-300">
                    {rt}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RuleItem({ rule }: { rule: typeof basicF1Rules[0] }) {
  const [expanded, setExpanded] = useState(false);

  const activeStyle = expanded ? "border-white/20 bg-slate-800 shadow-[0_0_15px_rgba(56,189,248,0.05)] border-t-electric" : "border-white/5 bg-slate-900/50 border-t-transparent";

  return (
    <div className={`panel p-6 transition-all duration-300 hover:scale-[1.015] hover:bg-slate-800 hover:shadow-[0_0_20px_rgba(56,189,248,0.05)] hover:border-white/10 hover:border-t-electric border-t-2 ${activeStyle}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border rounded-sm bg-electric/10 text-electric border-electric/20">Rule</span>
          </div>
          <h3 className="text-xl font-black text-white">{rule.term}</h3>
          <p className="mt-2 text-sm text-slate-300">{rule.simpleMeaning}</p>
        </div>
        <button 
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-300 hover:bg-electric hover:text-black transition-colors"
        >
          <svg className={`h-4 w-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {expanded && (
        <div className="mt-6 space-y-4 border-t border-white/10 pt-6 animate-in fade-in slide-in-from-top-2">
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-widest text-emerald-500">Why It Matters In Strategy</span>
            <p className="mt-1 text-sm text-slate-300">{rule.whyItMatters}</p>
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-widest text-racing">Beginner Pitwall Note</span>
            <p className="mt-1 text-sm text-slate-300">{rule.pitwallNote}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Learn() {
  return (
    <div className="space-y-16 py-10">
      {/* SECTION 1: HERO */}
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-racing">Educational Hub</p>
        <h1 className="mt-3 text-4xl font-black text-white sm:text-6xl">Learn F1 Strategy</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-400">
          New to F1? Start with the strategy terms, race-day decisions, and rule changes that shape every Grand Prix.
        </p>
      </section>

      {/* SECTION 2: CORE STRATEGY TERMS */}
      <section className="panel p-6 sm:p-10 border border-white/5 bg-gradient-to-br from-slate-900 to-black relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-racing/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-racing">Strategy Vocabulary</p>
          <h2 className="mt-2 text-3xl font-black text-white uppercase tracking-wider">Core Strategy Terms</h2>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl">Master the vocabulary of the pit wall.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 relative z-10">
          {strategyTerms.map((term) => (
            <GlossaryItem key={term.id} term={term} />
          ))}
        </div>
      </section>

      {/* NEW SECTION: BASIC F1 RULES */}
      <section className="panel p-6 sm:p-10 border border-white/5 bg-gradient-to-tr from-slate-900 to-[#0A1128] relative overflow-hidden">
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-electric/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-electric">Race Control Basics</p>
          <h2 className="mt-2 text-3xl font-black text-white uppercase tracking-wider">Basic F1 Rules</h2>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl">The race-day rules every new fan should understand before reading strategy calls.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 relative z-10">
          {basicF1Rules.map((rule) => (
            <RuleItem key={rule.id} rule={rule} />
          ))}
        </div>
      </section>

      {/* SECTION 3: 2026 REGULATIONS DECODER */}
      <section>
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">The Future of F1</p>
          <h2 className="mt-2 text-3xl font-black text-white uppercase tracking-wider">2026 Regulations Decoder</h2>
          <p className="text-sm text-slate-400 mt-2 max-w-3xl">
            A major overhaul of the rules is coming. Discover how active aero, massive electrical power, and sustainable fuels will change the sport forever.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {regulationTopics2026.map((topic) => (
            <div key={topic.id} className="panel border border-gold/20 bg-slate-900/40 p-6 sm:p-8">
              <div className="mb-6 border-b border-white/10 pb-4">
                <h3 className="text-2xl font-black text-white">{topic.title}</h3>
                <p className="mt-2 text-gold font-bold">{topic.shortSummary}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 border-l-2 border-slate-500 pl-2 mb-2">What Changes</span>
                  <p className="text-sm text-slate-300 leading-relaxed">{topic.whatChanges}</p>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-emerald-500 border-l-2 border-emerald-500 pl-2 mb-2">What It Unlocks</span>
                  <p className="text-sm text-slate-300 leading-relaxed">{topic.whatItUnlocks}</p>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-racing border-l-2 border-racing pl-2 mb-2">What Teams Worry About</span>
                  <p className="text-sm text-slate-300 leading-relaxed">{topic.whatTeamsWorryAbout}</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-sm border border-white/5">
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-white mb-2">Pitwall Impact</span>
                  <p className="text-sm text-slate-200">{topic.pitwallImpact}</p>
                </div>
                <div className="pt-2 text-[10px] text-slate-500 italic">
                  {topic.quoteOrReaction}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: OLD ERA VS 2026 ERA */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-black text-white uppercase tracking-wider">Old Era vs 2026 Era</h2>
          <p className="text-sm text-slate-400 mt-1">A side-by-side comparison of the core engineering philosophies.</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b-2 border-white/10 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <th className="pb-3 pl-4">Area</th>
                <th className="pb-3">Current / Previous Era</th>
                <th className="pb-3 text-gold">2026 Era</th>
                <th className="pb-3 pr-4">Why It Matters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {eraComparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 pl-4 font-bold text-white text-sm">{row.area}</td>
                  <td className="py-4 text-sm text-slate-400 pr-4">{row.currentEra}</td>
                  <td className="py-4 text-sm text-gold pr-4">{row.newEra}</td>
                  <td className="py-4 text-sm text-slate-300 pr-4">{row.whyItMatters}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 5: WHAT CHANGES ON THE PIT WALL */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-black text-white uppercase tracking-wider">What Changes on Race Day</h2>
          <p className="text-sm text-slate-400 mt-1">How the 2026 rules might alter live strategic decision-making.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {raceDayImpactCards.map((card, idx) => (
            <div key={idx} className="panel border-t-2 border-t-racing bg-slate-900/50 p-6">
              <span className="mb-3 inline-block rounded bg-racing/20 px-2 py-1 text-[10px] font-bold uppercase text-racing tracking-widest">Strategy</span>
              <h4 className="mb-2 text-lg font-bold text-white">{card.title}</h4>
              <p className="text-sm text-slate-400 leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: PITWALL TAKEAWAY */}
      <section className="panel relative overflow-hidden p-8 sm:p-12 border border-white/10 bg-gradient-to-br from-slate-900 to-black">
        <div className="absolute right-10 top-0 h-full w-40 skew-x-[-16deg] bg-white/[0.02]" />
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-racing">The Bottom Line</p>
        <h2 className="mt-3 text-3xl font-black text-white">Pitwall Takeaway</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-lg text-slate-300 border-l-4 border-racing pl-6">
          2026 is not just a car redesign. It changes how drivers attack, defend, save energy, and make strategy calls. For beginners, the key idea is simple: F1 strategy will not only be about tyres and pit stops — it will also be about when to spend energy, when to recharge, and when to attack.
        </p>
      </section>
    </div>
  );
}
