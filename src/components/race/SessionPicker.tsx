import type { OpenF1Meeting, OpenF1Session } from "../../lib/api/apiTypes";

interface SessionPickerProps {
  meetings: OpenF1Meeting[];
  sessions: OpenF1Session[];
  selectedMeetingKey: number | "";
  selectedSessionKey: number | "";
  onMeetingChange: (key: number) => void;
  onSessionChange: (key: number) => void;
}

export function SessionPicker({
  meetings,
  sessions,
  selectedMeetingKey,
  selectedSessionKey,
  onMeetingChange,
  onSessionChange,
}: SessionPickerProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase text-slate-400">Meeting</label>
        <select 
          value={selectedMeetingKey} 
          onChange={(e) => onMeetingChange(Number(e.target.value))}
          className="w-full bg-carbon/50 border border-white/10 p-3 text-white focus:border-racing outline-none"
        >
          {meetings.map((m) => (
            <option key={m.meeting_key} value={m.meeting_key}>{m.meeting_name} ({m.year})</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase text-slate-400">Session</label>
        <select 
          value={selectedSessionKey} 
          onChange={(e) => onSessionChange(Number(e.target.value))}
          className="w-full bg-carbon/50 border border-white/10 p-3 text-white focus:border-racing outline-none"
          disabled={!selectedMeetingKey || sessions.length === 0}
        >
          {sessions.map((s) => (
            <option key={s.session_key} value={s.session_key}>{s.session_name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
