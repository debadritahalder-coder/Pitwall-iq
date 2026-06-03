import type { HistoryMoment } from "../lib/types";

export default function HistoryMomentCard({ moment }: { moment: HistoryMoment }) {
  return (
    <article className="panel relative min-h-56 overflow-hidden p-5">
      <div className="absolute -right-8 -top-8 h-28 w-28 border border-white/10" />
      <div className="absolute bottom-8 right-8 h-16 w-24 skew-x-[-18deg] border-b border-t border-racing/25" />
      <span className="inline-flex bg-racing/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-racing">
        {moment.tag}
      </span>
      <h3 className="mt-6 text-xl font-black text-white">{moment.title}</h3>
      <p className="mt-4 text-sm leading-6 text-slate-400">{moment.description}</p>
    </article>
  );
}
