import { fetchWithCache } from "./cache";
import { ApiError } from "./errors";
import type {
  OpenF1Meeting,
  OpenF1Session,
  OpenF1Driver,
  OpenF1Lap,
  OpenF1PitStop,
  OpenF1Stint,
  OpenF1RaceControl,
  OpenF1Weather,
} from "./apiTypes";

const BASE_URL = (import.meta as any).env.VITE_OPENF1_BASE_URL || "https://api.openf1.org/v1";

async function fetchOpenF1<T>(endpoint: string): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  
  return fetchWithCache(url, async () => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new ApiError(`OpenF1 request failed: ${response.statusText}`, "OpenF1", response.status);
    }
    return response.json() as Promise<T>;
  });
}

function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
  const queryParts: string[] = [];
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  }
  return queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
}

export async function getOpenF1Meetings(year?: number): Promise<OpenF1Meeting[]> {
  const query = buildQuery({ year });
  return fetchOpenF1<OpenF1Meeting[]>(`/meetings${query}`);
}

export async function getOpenF1Sessions(meeting_key?: number, session_name?: string): Promise<OpenF1Session[]> {
  const query = buildQuery({ meeting_key, session_name });
  return fetchOpenF1<OpenF1Session[]>(`/sessions${query}`);
}

export async function getOpenF1Drivers(session_key: number): Promise<OpenF1Driver[]> {
  const query = buildQuery({ session_key });
  return fetchOpenF1<OpenF1Driver[]>(`/drivers${query}`);
}

export async function getOpenF1Laps(session_key: number, driver_number?: number): Promise<OpenF1Lap[]> {
  const query = buildQuery({ session_key, driver_number });
  return fetchOpenF1<OpenF1Lap[]>(`/laps${query}`);
}

export async function getOpenF1PitStops(session_key: number, driver_number?: number): Promise<OpenF1PitStop[]> {
  const query = buildQuery({ session_key, driver_number });
  return fetchOpenF1<OpenF1PitStop[]>(`/pit${query}`);
}

export async function getOpenF1Stints(session_key: number, driver_number?: number): Promise<OpenF1Stint[]> {
  const query = buildQuery({ session_key, driver_number });
  return fetchOpenF1<OpenF1Stint[]>(`/stints${query}`);
}

export async function getOpenF1RaceControl(session_key: number): Promise<OpenF1RaceControl[]> {
  const query = buildQuery({ session_key });
  return fetchOpenF1<OpenF1RaceControl[]>(`/race_control${query}`);
}

export async function getOpenF1Weather(session_key: number): Promise<OpenF1Weather[]> {
  const query = buildQuery({ session_key });
  return fetchOpenF1<OpenF1Weather[]>(`/weather${query}`);
}
