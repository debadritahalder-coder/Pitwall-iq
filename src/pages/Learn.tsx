import { useState } from "react";
import { Link } from "react-router-dom";
import {
  learningPaths,
  strategyConcepts,
  watchGuideSteps,
  emotionalHooks,
  miniQuiz,
} from "../lib/learning/learningContent";
import type { ConceptDefinition, QuizQuestion } from "../lib/learning/learningTypes";

function ConceptCard({ concept }: { concept: ConceptDefinition }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`panel p-6 transition-all duration-300 hover:bg-slate-800 border-l-2 ${expanded ? 'border-l-racing bg-slate-800' : 'border-l-transparent bg-slate-900/50'}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-white">{concept.term}</h3>
          <p className="mt-2 text-sm text-slate-300">{concept.simpleExplanation}</p>
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
            <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">Technical Details</span>
            <p className="mt-1 text-sm text-slate-300">{concept.technicalExplanation}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-emerald-500">Why Fans Care</span>
              <p className="mt-1 text-sm text-white">{concept.whyFansCare}</p>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-racing">Example</span>
              <p className="mt-1 text-sm text-slate-300 italic">"{concept.exampleSentence}"</p>
            </div>
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-widest text-gold">Common Misconception</span>
            <p className="mt-1 text-sm text-slate-300">{concept.commonMisconception}</p>
          </div>
          {concept.raceExplainerFeature && (
            <div className="pt-4">
              <Link to="/race-explainer" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-electric hover:text-white transition-colors">
                See this in {concept.raceExplainerFeature} &rarr;
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function QuizSection() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const q = miniQuiz[currentQ];

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === q.correctAnswerIndex) {
      setScore((s) => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQ < miniQuiz.length - 1) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
    } else {
      setShowResult(true);
    }
  };

  const reset = () => {
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className="bg-carbon border border-white/10 p-8 text-center rounded">
        <h3 className="text-2xl font-black text-white mb-2">Quiz Complete!</h3>
        <p className="text-lg text-slate-300 mb-6">You scored {score} out of {miniQuiz.length}.</p>
        <button onClick={reset} className="px-6 py-2 bg-racing text-white font-bold uppercase tracking-widest text-sm rounded hover:bg-red-700 transition-colors">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-carbon border border-white/10 p-6 rounded">
      <div className="mb-4 flex justify-between items-center text-xs font-bold uppercase text-slate-500">
        <span>Question {currentQ + 1} of {miniQuiz.length}</span>
        <span>Score: {score}</span>
      </div>
      <h3 className="text-lg font-bold text-white mb-4">{q.question}</h3>
      <div className="space-y-2">
        {q.options.map((opt, idx) => {
          let btnClass = "border-white/10 bg-white/5 hover:bg-white/10 text-slate-300";
          if (selected !== null) {
            if (idx === q.correctAnswerIndex) {
              btnClass = "border-emerald-500/50 bg-emerald-500/10 text-emerald-500";
            } else if (idx === selected) {
              btnClass = "border-racing/50 bg-racing/10 text-racing";
            } else {
              btnClass = "border-white/5 bg-transparent text-slate-500 opacity-50";
            }
          }
          return (
            <button
              key={idx}
              disabled={selected !== null}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left p-4 rounded border transition-colors ${btnClass}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div className="mt-6 p-4 bg-slate-900 border border-white/10 rounded animate-in fade-in">
          <p className="text-sm text-slate-300"><strong className="text-white">Explanation:</strong> {q.explanation}</p>
          <button onClick={nextQuestion} className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-widest text-sm rounded transition-colors w-full sm:w-auto">
            {currentQ < miniQuiz.length - 1 ? "Next Question" : "See Results"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function Learn() {
  return (
    <div className="space-y-16 py-10">
      {/* 1. HERO */}
      <section className="text-center sm:text-left">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-electric">Beginner Onboarding</p>
        <h1 className="mt-3 text-4xl font-black text-white sm:text-6xl uppercase">Learn F1 Without the Jargon</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-400 mx-auto sm:mx-0">
          Understand the race, the strategy, and the decisions that change a Grand Prix.
        </p>
        <div className="mt-8 flex flex-wrap gap-4 justify-center sm:justify-start">
          <a href="#start-here" className="px-6 py-3 bg-electric text-black font-black uppercase tracking-widest text-sm rounded hover:bg-white transition-colors">
            Start with F1 in 5 minutes
          </a>
          <a href="#strategy-101" className="px-6 py-3 bg-white/10 text-white font-bold uppercase tracking-widest text-sm rounded hover:bg-white/20 transition-colors">
            Learn Race Strategy
          </a>
        </div>
      </section>

      {/* 2. START HERE PATH */}
      <section id="start-here" className="scroll-mt-24">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-white uppercase tracking-wider">Start Here</h2>
          <p className="text-sm text-slate-400 mt-1">Short paths to get you up to speed quickly.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {learningPaths.map((path) => (
            <div key={path.id} className="panel p-6 border border-white/5 bg-slate-900/50 hover:border-electric/50 transition-colors group cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded ${path.difficulty === 'Beginner' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-gold/20 text-gold'}`}>
                  {path.difficulty}
                </span>
                <span className="text-[10px] font-bold text-slate-500">{path.estimatedMinutes} min</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-electric transition-colors">{path.title}</h3>
              <p className="text-sm text-slate-400">{path.shortValue}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. RACE WEEKEND MAP */}
      <section className="panel p-6 sm:p-10 border border-white/5 bg-gradient-to-tr from-slate-900 to-[#0A1128] relative overflow-hidden">
        <div className="relative z-10 mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-electric">The Format</p>
          <h2 className="mt-2 text-3xl font-black text-white uppercase tracking-wider">Race Weekend Map</h2>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl">How a Grand Prix weekend is structured.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 relative z-10">
          <div className="bg-black/50 p-6 border border-white/5 rounded">
            <h4 className="text-white font-bold uppercase mb-2">1. Practice</h4>
            <p className="text-sm text-slate-400">Teams test the cars, learn the track, and understand how quickly the tyres wear out. The lap times here don't count for the race.</p>
          </div>
          <div className="bg-black/50 p-6 border border-white/5 rounded">
            <h4 className="text-white font-bold uppercase mb-2">2. Qualifying</h4>
            <p className="text-sm text-slate-400">A high-pressure session where drivers set their fastest single lap. The fastest driver starts the race from 1st place (Pole Position).</p>
          </div>
          <div className="bg-black/50 p-6 border border-white/5 rounded">
            <h4 className="text-white font-bold uppercase mb-2">3. Sprint (Optional)</h4>
            <p className="text-sm text-slate-400">On certain weekends, a shorter 100km race is held on Saturday to award extra championship points.</p>
          </div>
          <div className="bg-black/50 p-6 border border-white/5 rounded">
            <h4 className="text-white font-bold uppercase mb-2">4. Grand Prix</h4>
            <p className="text-sm text-slate-400">The main event on Sunday. A 300km race where strategy, tyre management, and raw pace decide the winner.</p>
          </div>
        </div>
        <div className="mt-6 bg-electric/10 border border-electric/20 p-4 rounded relative z-10">
          <strong className="text-electric uppercase text-xs tracking-widest block mb-1">Parc Fermé Rule</strong>
          <p className="text-sm text-slate-300">After Qualifying begins, teams are forbidden from making major setup changes to the car. If a car is set up purely for a fast qualifying lap, it might struggle with tyre wear during the long Sunday race.</p>
        </div>
      </section>

      {/* 4. STRATEGY 101 */}
      <section id="strategy-101" className="scroll-mt-24">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-white uppercase tracking-wider">Strategy 101</h2>
          <p className="text-sm text-slate-400 mt-1">The fundamental concepts you need to understand the pit wall.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {strategyConcepts.map((concept) => (
            <ConceptCard key={concept.id} concept={concept} />
          ))}
        </div>
      </section>

      {/* 5. WATCH YOUR FIRST RACE GUIDE */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-black text-white uppercase tracking-wider">Watch Your First Race Guide</h2>
          <p className="text-sm text-slate-400 mt-1">Don't know what to look for on Sunday? Follow this timeline.</p>
        </div>
        <div className="space-y-4">
          {watchGuideSteps.map((step, idx) => (
            <div key={step.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-white/5 border border-white/5 rounded">
              <div className="w-10 h-10 shrink-0 bg-racing text-white font-black flex items-center justify-center rounded-full text-lg">
                {idx + 1}
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold uppercase tracking-widest text-racing">{step.phase}</span>
                <h4 className="text-lg font-bold text-white leading-tight">{step.instruction}</h4>
              </div>
              <div className="sm:w-1/2 text-sm text-slate-400">
                {step.whatToWatch}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link to="/race-explainer" className="inline-block px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-sm rounded hover:bg-slate-200 transition-colors">
            Open Race Explainer
          </Link>
        </div>
      </section>

      {/* 6. WHY SHOULD I CARE? */}
      <section>
        <div className="mb-8 text-center max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-racing">The Drama</p>
          <h2 className="mt-2 text-3xl font-black text-white uppercase tracking-wider">Why Should I Care?</h2>
          <p className="text-sm text-slate-400 mt-2">F1 is more than just cars driving in circles. It's a high-stakes engineering war.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {emotionalHooks.map((hook) => (
            <div key={hook.id} className="p-6 bg-gradient-to-b from-slate-800 to-slate-900 border border-white/5 rounded">
              <h4 className="text-white font-bold mb-2">{hook.title}</h4>
              <p className="text-sm text-slate-400 leading-relaxed">{hook.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. MINI QUIZ */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-black text-white uppercase tracking-wider">Test Your Knowledge</h2>
          <p className="text-sm text-slate-400 mt-1">A quick, simple quiz to see if you're ready for the pit wall.</p>
        </div>
        <div className="max-w-2xl mx-auto">
          <QuizSection />
        </div>
      </section>
    </div>
  );
}
