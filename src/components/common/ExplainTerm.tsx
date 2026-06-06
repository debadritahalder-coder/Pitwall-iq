import React from "react";
import { useNewFanMode } from "../../contexts/NewFanContext";

interface ExplainTermProps {
  term: string;
  explanation: string;
}

export function ExplainTerm({ term, explanation }: ExplainTermProps) {
  const { isNewFanMode } = useNewFanMode();

  if (!isNewFanMode) {
    return <span>{term}</span>;
  }

  return (
    <span className="inline-flex items-center gap-1.5 group relative cursor-help">
      <span className="underline decoration-electric/50 decoration-dashed underline-offset-4">{term}</span>
      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-electric/20 text-[10px] font-bold text-electric group-hover:bg-electric group-hover:text-black transition-colors">
        ?
      </span>
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
        <div className="bg-slate-900 border border-electric/30 text-slate-200 text-xs p-3 rounded shadow-xl shadow-electric/10 leading-relaxed">
          <strong className="text-electric block mb-1 uppercase tracking-wider text-[10px]">{term}</strong>
          {explanation}
        </div>
      </div>
    </span>
  );
}
