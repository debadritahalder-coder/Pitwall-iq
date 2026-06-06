// Official F1 2024/2025/2026 team colors
// Used to color podium card backgrounds when OpenF1 team_colour is unavailable

export const TEAM_COLORS: Record<string, string> = {
  // Primary names
  "Mercedes": "#27F4D2",
  "Red Bull": "#3671C6",
  "Ferrari": "#E8002D",
  "McLaren": "#FF8000",
  "Aston Martin": "#229971",
  "Alpine": "#FF87BC",
  "Williams": "#64C4FF",
  "RB": "#6692FF",
  "Kick Sauber": "#52E252",
  "Haas F1 Team": "#B6BABD",
  // Alternate names from APIs
  "Red Bull Racing": "#3671C6",
  "Scuderia Ferrari": "#E8002D",
  "Mercedes-AMG Petronas": "#27F4D2",
  "Haas": "#B6BABD",
  "AlphaTauri": "#6692FF",
  "Alfa Romeo": "#C92D4B",
  "Sauber": "#52E252",
  "Racing Point": "#F596C8",
  "Renault": "#FFD800",
  "Toro Rosso": "#4E7EC7",
};

export function getTeamColor(constructorName: string, openF1Color?: string): string {
  if (openF1Color && openF1Color !== "000000") {
    return `#${openF1Color}`;
  }
  // Try exact match first
  if (TEAM_COLORS[constructorName]) return TEAM_COLORS[constructorName];
  // Try partial match
  const lower = constructorName.toLowerCase();
  for (const [key, value] of Object.entries(TEAM_COLORS)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return value;
    }
  }
  return "#3a3a4a"; // fallback gray
}

// Country code to flag emoji
export function countryFlag(code: string): string {
  if (!code || code.length < 2) return "🏁";
  const cc = code.toUpperCase().slice(0, 2);
  const offset = 127397;
  return String.fromCodePoint(...[...cc].map(c => c.charCodeAt(0) + offset));
}

// Position ordinal suffix
export function ordinalSuffix(pos: number): string {
  if (pos === 1) return "ST";
  if (pos === 2) return "ND";
  if (pos === 3) return "RD";
  return "TH";
}
