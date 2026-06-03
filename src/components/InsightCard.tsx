type InsightCardProps = {
  title: string;
  description: string;
  tone?: "gold" | "blue" | "orange";
};

const tones = {
  gold: "border-gold/35 bg-gold/10 text-gold",
  blue: "border-electric/35 bg-electric/10 text-sky-300",
  orange: "border-orange-400/35 bg-orange-400/10 text-orange-300",
};

export default function InsightCard({ title, description, tone = "gold" }: InsightCardProps) {
  return (
    <article className="panel relative overflow-hidden p-5">
      <div className={`mb-5 h-1 w-16 border ${tones[tone]}`} />
      <h3 className="text-lg font-black text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
    </article>
  );
}
