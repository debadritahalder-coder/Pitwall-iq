type StatCardProps = {
  label: string;
  value: string;
  detail?: string;
  accent?: "red" | "blue" | "gold" | "green";
};

const accentClasses = {
  red: "text-racing",
  blue: "text-electric",
  gold: "text-gold",
  green: "text-emerald-400",
};

export default function StatCard({ label, value, detail, accent = "red" }: StatCardProps) {
  return (
    <div className="panel p-5">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className={`mt-3 break-words text-2xl font-black sm:text-3xl ${accentClasses[accent]}`}>{value}</p>
      {detail ? <p className="mt-2 text-sm text-slate-400">{detail}</p> : null}
    </div>
  );
}
