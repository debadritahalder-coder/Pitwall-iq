export default function LoadingState({ label = "Loading race intelligence" }: { label?: string }) {
  return (
    <div className="panel flex items-center gap-3 p-5 text-slate-300">
      <span className="status-dot" />
      <span className="text-sm font-semibold">{label}</span>
    </div>
  );
}
