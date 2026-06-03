import type { GlossaryTerm } from "../lib/types";

export default function GlossaryCard({ item }: { item: GlossaryTerm }) {
  return (
    <article className="panel p-5">
      <h3 className="text-lg font-black text-white">{item.term}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-400">{item.definition}</p>
    </article>
  );
}
