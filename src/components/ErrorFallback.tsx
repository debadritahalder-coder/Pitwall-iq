export default function ErrorFallback({ message }: { message?: string }) {
  return (
    <div className="border border-orange-400/25 bg-orange-400/10 p-4 text-sm text-orange-200">
      Live Jolpica data is unavailable, so PitWall IQ is using local fallback data.
      {message ? <span className="block pt-1 text-orange-200/75">{message}</span> : null}
    </div>
  );
}
