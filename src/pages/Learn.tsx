import GlossaryCard from "../components/GlossaryCard";
import { glossaryTerms } from "../lib/fallbackData";

export default function Learn() {
  return (
    <div className="space-y-10 py-10">
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-racing">Beginner strategy guide</p>
        <h1 className="mt-3 text-4xl font-black text-white sm:text-6xl">Learn F1 Strategy</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-400">New to F1? Start with the strategy terms that shape every race.</p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {glossaryTerms.map((item) => (
          <GlossaryCard key={item.term} item={item} />
        ))}
      </section>

      <section className="panel relative overflow-hidden p-8">
        <div className="absolute right-10 top-8 h-24 w-40 skew-x-[-16deg] border-y border-electric/25" />
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-electric">Future version</p>
        <h2 className="mt-3 text-3xl font-black text-white">Coming later: Ask PitWall IQ</h2>
        <p className="mt-4 max-w-2xl leading-7 text-slate-400">
          A future AI assistant will explain race strategy, driver form, and F1 terms using the context of the current race weekend.
        </p>
      </section>
    </div>
  );
}
