interface RaceSummaryCardProps {
  summaryText: string;
}

export function RaceSummaryCard({ summaryText }: RaceSummaryCardProps) {
  return (
    <div className="bg-gradient-to-br from-carbon/80 to-carbon border border-white/10 p-6">
      <h2 className="mb-4 text-xl font-bold uppercase text-white">Race Summary</h2>
      <p className="text-lg leading-relaxed text-slate-300">
        {summaryText}
      </p>
    </div>
  );
}
