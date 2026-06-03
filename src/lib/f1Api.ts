import {
  fallbackConstructorStandings,
  fallbackDriverStandings,
  fallbackLatestRaceResults,
  fallbackRaceSchedule,
} from "./fallbackData";
import type { ApiResponse, ConstructorStanding, DriverStanding, Race, RaceResult } from "./types";

const BASE_URL = "https://api.jolpi.ca/ergast/f1";

type JolpicaRace = {
  season: string;
  round: string;
  raceName: string;
  date: string;
  time?: string;
  Circuit: {
    circuitName: string;
    Location: {
      locality: string;
      country: string;
    };
  };
};

const raceFactorByRound = (round: string) => {
  const factors = [
    "Tyre degradation could define the first stop window.",
    "Qualifying position may matter if overtaking lanes are limited.",
    "Safety car timing could turn a conservative one-stop into a gamble.",
    "Heavy braking zones may reward drivers who protect rear tyres.",
  ];
  return factors[(Number(round) || 0) % factors.length];
};

async function fetchJson<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Jolpica request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

function fallback<T>(data: T, error: unknown): ApiResponse<T> {
  return {
    data,
    source: "fallback",
    error: error instanceof Error ? error.message : "Live data unavailable.",
  };
}

export async function getCurrentRaceSchedule(): Promise<ApiResponse<Race[]>> {
  try {
    const json = await fetchJson<{ MRData: { RaceTable: { Races: JolpicaRace[] } } }>("/current.json");
    const races = json.MRData.RaceTable.Races.map((race) => ({
      season: race.season,
      round: race.round,
      raceName: race.raceName,
      circuitName: race.Circuit.circuitName,
      country: race.Circuit.Location.country,
      locality: race.Circuit.Location.locality,
      date: race.date,
      time: race.time,
      keyRaceFactor: raceFactorByRound(race.round),
    }));
    return { data: races.length ? races : fallbackRaceSchedule, source: races.length ? "live" : "fallback" };
  } catch (error) {
    return fallback(fallbackRaceSchedule, error);
  }
}

export async function getDriverStandings(): Promise<ApiResponse<DriverStanding[]>> {
  try {
    const json = await fetchJson<{
      MRData: {
        StandingsTable: {
          StandingsLists: Array<{
            DriverStandings: Array<{
              position: string;
              points: string;
              wins: string;
              Driver: { driverId: string; givenName: string; familyName: string; code?: string };
              Constructors: Array<{ name: string }>;
            }>;
          }>;
        };
      };
    }>("/current/driverstandings.json");
    const standings = json.MRData.StandingsTable.StandingsLists[0]?.DriverStandings.map((standing) => ({
      position: Number(standing.position),
      driverId: standing.Driver.driverId,
      driverName: `${standing.Driver.givenName} ${standing.Driver.familyName}`,
      code: standing.Driver.code,
      constructorName: standing.Constructors[0]?.name ?? "Unknown",
      points: Number(standing.points),
      wins: Number(standing.wins),
    })) ?? [];
    return { data: standings.length ? standings : fallbackDriverStandings, source: standings.length ? "live" : "fallback" };
  } catch (error) {
    return fallback(fallbackDriverStandings, error);
  }
}

export async function getConstructorStandings(): Promise<ApiResponse<ConstructorStanding[]>> {
  try {
    const json = await fetchJson<{
      MRData: {
        StandingsTable: {
          StandingsLists: Array<{
            ConstructorStandings: Array<{
              position: string;
              points: string;
              wins: string;
              Constructor: { constructorId: string; name: string; nationality: string };
            }>;
          }>;
        };
      };
    }>("/current/constructorstandings.json");
    const standings = json.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings.map((standing) => ({
      position: Number(standing.position),
      constructorId: standing.Constructor.constructorId,
      constructorName: standing.Constructor.name,
      nationality: standing.Constructor.nationality,
      points: Number(standing.points),
      wins: Number(standing.wins),
    })) ?? [];
    return { data: standings.length ? standings : fallbackConstructorStandings, source: standings.length ? "live" : "fallback" };
  } catch (error) {
    return fallback(fallbackConstructorStandings, error);
  }
}

export async function getLatestRaceResults(): Promise<ApiResponse<RaceResult[]>> {
  try {
    const json = await fetchJson<{
      MRData: {
        RaceTable: {
          Races: Array<{
            raceName: string;
            Results: Array<{
              position: string;
              grid: string;
              laps: string;
              status: string;
              Driver: { givenName: string; familyName: string };
              Constructor: { name: string };
            }>;
          }>;
        };
      };
    }>("/current/last/results.json");
    const race = json.MRData.RaceTable.Races[0];
    const results = race?.Results.map((result) => ({
      position: Number(result.position),
      driverName: `${result.Driver.givenName} ${result.Driver.familyName}`,
      constructorName: result.Constructor.name,
      grid: result.grid,
      laps: result.laps,
      status: result.status,
      raceName: race.raceName,
    })) ?? [];
    return { data: results.length ? results : fallbackLatestRaceResults, source: results.length ? "live" : "fallback" };
  } catch (error) {
    return fallback(fallbackLatestRaceResults, error);
  }
}
