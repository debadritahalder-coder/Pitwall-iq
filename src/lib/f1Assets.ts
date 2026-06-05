// Official Formula1.com 2026 media assets
// These are the exact same images used on formula1.com

const F1_MEDIA_BASE = "https://media.formula1.com/image/upload";
const F1_YEAR = "2026";
const CLOUDINARY_VERSION = "v1740000001";

// Driver headshot URL builder
function driverHeadshot(team: string, driverCode: string, width = 440): string {
  return `${F1_MEDIA_BASE}/c_lfill,w_${width}/q_auto/d_common:f1:${F1_YEAR}:fallback:driver:${F1_YEAR}fallbackdriverright.webp/${CLOUDINARY_VERSION}/common/f1/${F1_YEAR}/${team}/${driverCode}/${F1_YEAR}${team}${driverCode}right.webp`;
}

// Team logo URL builder (white logos)
function teamLogo(team: string, width = 96): string {
  return `${F1_MEDIA_BASE}/c_lfill,w_${width}/q_auto/${CLOUDINARY_VERSION}/common/f1/${F1_YEAR}/${team}/${F1_YEAR}${team}logowhite.webp`;
}

// Team car image URL builder
function teamCar(team: string, width = 512): string {
  return `${F1_MEDIA_BASE}/c_lfill,w_${width}/q_auto/d_common:f1:${F1_YEAR}:fallback:car:${F1_YEAR}fallbackcarright.webp/${CLOUDINARY_VERSION}/common/f1/${F1_YEAR}/${team}/${F1_YEAR}${team}carright.webp`;
}

// Complete driver data with F1.com image codes
export interface F1DriverAsset {
  driverId: string; // Jolpica/Ergast driverId
  firstName: string;
  lastName: string;
  code: string;       // 3-letter driver code (VER, HAM, etc.)
  number: number;
  nationality: string;
  countryCode: string; // ISO 2-letter
  team: string;        // Display team name
  teamSlug: string;    // F1.com internal team slug
  driverSlug: string;  // F1.com internal driver code
  teamColor: string;   // Hex color
  headshot: string;
  headshotSmall: string;
  teamLogo: string;
  teamCar: string;
}

// Official 2026 F1 driver roster with F1.com media slugs
export const F1_DRIVER_ASSETS: F1DriverAsset[] = [
  // Mercedes
  {
    driverId: "russell", firstName: "George", lastName: "Russell", code: "RUS", number: 63,
    nationality: "British", countryCode: "GB",
    team: "Mercedes", teamSlug: "mercedes", driverSlug: "georus01",
    teamColor: "#27F4D2",
    headshot: driverHeadshot("mercedes", "georus01"),
    headshotSmall: driverHeadshot("mercedes", "georus01", 64),
    teamLogo: teamLogo("mercedes"),
    teamCar: teamCar("mercedes"),
  },
  {
    driverId: "antonelli", firstName: "Kimi", lastName: "Antonelli", code: "ANT", number: 12,
    nationality: "Italian", countryCode: "IT",
    team: "Mercedes", teamSlug: "mercedes", driverSlug: "andant01",
    teamColor: "#27F4D2",
    headshot: driverHeadshot("mercedes", "andant01"),
    headshotSmall: driverHeadshot("mercedes", "andant01", 64),
    teamLogo: teamLogo("mercedes"),
    teamCar: teamCar("mercedes"),
  },
  // Ferrari
  {
    driverId: "leclerc", firstName: "Charles", lastName: "Leclerc", code: "LEC", number: 16,
    nationality: "Monégasque", countryCode: "MC",
    team: "Ferrari", teamSlug: "ferrari", driverSlug: "chalec01",
    teamColor: "#E8002D",
    headshot: driverHeadshot("ferrari", "chalec01"),
    headshotSmall: driverHeadshot("ferrari", "chalec01", 64),
    teamLogo: teamLogo("ferrari"),
    teamCar: teamCar("ferrari"),
  },
  {
    driverId: "hamilton", firstName: "Lewis", lastName: "Hamilton", code: "HAM", number: 44,
    nationality: "British", countryCode: "GB",
    team: "Ferrari", teamSlug: "ferrari", driverSlug: "lewham01",
    teamColor: "#E8002D",
    headshot: driverHeadshot("ferrari", "lewham01"),
    headshotSmall: driverHeadshot("ferrari", "lewham01", 64),
    teamLogo: teamLogo("ferrari"),
    teamCar: teamCar("ferrari"),
  },
  // McLaren
  {
    driverId: "norris", firstName: "Lando", lastName: "Norris", code: "NOR", number: 4,
    nationality: "British", countryCode: "GB",
    team: "McLaren", teamSlug: "mclaren", driverSlug: "lannor01",
    teamColor: "#FF8000",
    headshot: driverHeadshot("mclaren", "lannor01"),
    headshotSmall: driverHeadshot("mclaren", "lannor01", 64),
    teamLogo: teamLogo("mclaren"),
    teamCar: teamCar("mclaren"),
  },
  {
    driverId: "piastri", firstName: "Oscar", lastName: "Piastri", code: "PIA", number: 81,
    nationality: "Australian", countryCode: "AU",
    team: "McLaren", teamSlug: "mclaren", driverSlug: "oscpia01",
    teamColor: "#FF8000",
    headshot: driverHeadshot("mclaren", "oscpia01"),
    headshotSmall: driverHeadshot("mclaren", "oscpia01", 64),
    teamLogo: teamLogo("mclaren"),
    teamCar: teamCar("mclaren"),
  },
  // Red Bull Racing
  {
    driverId: "max_verstappen", firstName: "Max", lastName: "Verstappen", code: "VER", number: 1,
    nationality: "Dutch", countryCode: "NL",
    team: "Red Bull Racing", teamSlug: "redbullracing", driverSlug: "maxver01",
    teamColor: "#3671C6",
    headshot: driverHeadshot("redbullracing", "maxver01"),
    headshotSmall: driverHeadshot("redbullracing", "maxver01", 64),
    teamLogo: teamLogo("redbullracing"),
    teamCar: teamCar("redbullracing"),
  },
  {
    driverId: "hadjar", firstName: "Isack", lastName: "Hadjar", code: "HAD", number: 6,
    nationality: "French", countryCode: "FR",
    team: "Red Bull Racing", teamSlug: "redbullracing", driverSlug: "isahad01",
    teamColor: "#3671C6",
    headshot: driverHeadshot("redbullracing", "isahad01"),
    headshotSmall: driverHeadshot("redbullracing", "isahad01", 64),
    teamLogo: teamLogo("redbullracing"),
    teamCar: teamCar("redbullracing"),
  },
  // Alpine
  {
    driverId: "gasly", firstName: "Pierre", lastName: "Gasly", code: "GAS", number: 10,
    nationality: "French", countryCode: "FR",
    team: "Alpine", teamSlug: "alpine", driverSlug: "piegas01",
    teamColor: "#FF87BC",
    headshot: driverHeadshot("alpine", "piegas01"),
    headshotSmall: driverHeadshot("alpine", "piegas01", 64),
    teamLogo: teamLogo("alpine"),
    teamCar: teamCar("alpine"),
  },
  {
    driverId: "colapinto", firstName: "Franco", lastName: "Colapinto", code: "COL", number: 43,
    nationality: "Argentine", countryCode: "AR",
    team: "Alpine", teamSlug: "alpine", driverSlug: "fracol01",
    teamColor: "#FF87BC",
    headshot: driverHeadshot("alpine", "fracol01"),
    headshotSmall: driverHeadshot("alpine", "fracol01", 64),
    teamLogo: teamLogo("alpine"),
    teamCar: teamCar("alpine"),
  },
  // Racing Bulls
  {
    driverId: "lawson", firstName: "Liam", lastName: "Lawson", code: "LAW", number: 30,
    nationality: "New Zealander", countryCode: "NZ",
    team: "Racing Bulls", teamSlug: "racingbulls", driverSlug: "lialaw01",
    teamColor: "#6692FF",
    headshot: driverHeadshot("racingbulls", "lialaw01"),
    headshotSmall: driverHeadshot("racingbulls", "lialaw01", 64),
    teamLogo: teamLogo("racingbulls"),
    teamCar: teamCar("racingbulls"),
  },
  {
    driverId: "lindblad", firstName: "Arvid", lastName: "Lindblad", code: "LIN", number: 27,
    nationality: "British", countryCode: "GB",
    team: "Racing Bulls", teamSlug: "racingbulls", driverSlug: "arvlin01",
    teamColor: "#6692FF",
    headshot: driverHeadshot("racingbulls", "arvlin01"),
    headshotSmall: driverHeadshot("racingbulls", "arvlin01", 64),
    teamLogo: teamLogo("racingbulls"),
    teamCar: teamCar("racingbulls"),
  },
  // Haas
  {
    driverId: "ocon", firstName: "Esteban", lastName: "Ocon", code: "OCO", number: 31,
    nationality: "French", countryCode: "FR",
    team: "Haas", teamSlug: "haasf1team", driverSlug: "estoco01",
    teamColor: "#B6BABD",
    headshot: driverHeadshot("haasf1team", "estoco01"),
    headshotSmall: driverHeadshot("haasf1team", "estoco01", 64),
    teamLogo: teamLogo("haasf1team"),
    teamCar: teamCar("haasf1team"),
  },
  {
    driverId: "bearman", firstName: "Oliver", lastName: "Bearman", code: "BEA", number: 87,
    nationality: "British", countryCode: "GB",
    team: "Haas", teamSlug: "haasf1team", driverSlug: "olibea01",
    teamColor: "#B6BABD",
    headshot: driverHeadshot("haasf1team", "olibea01"),
    headshotSmall: driverHeadshot("haasf1team", "olibea01", 64),
    teamLogo: teamLogo("haasf1team"),
    teamCar: teamCar("haasf1team"),
  },
  // Williams
  {
    driverId: "sainz", firstName: "Carlos", lastName: "Sainz", code: "SAI", number: 55,
    nationality: "Spanish", countryCode: "ES",
    team: "Williams", teamSlug: "williams", driverSlug: "carsai01",
    teamColor: "#64C4FF",
    headshot: driverHeadshot("williams", "carsai01"),
    headshotSmall: driverHeadshot("williams", "carsai01", 64),
    teamLogo: teamLogo("williams"),
    teamCar: teamCar("williams"),
  },
  {
    driverId: "albon", firstName: "Alexander", lastName: "Albon", code: "ALB", number: 23,
    nationality: "Thai", countryCode: "TH",
    team: "Williams", teamSlug: "williams", driverSlug: "alealb01",
    teamColor: "#64C4FF",
    headshot: driverHeadshot("williams", "alealb01"),
    headshotSmall: driverHeadshot("williams", "alealb01", 64),
    teamLogo: teamLogo("williams"),
    teamCar: teamCar("williams"),
  },
  // Audi
  {
    driverId: "hulkenberg", firstName: "Nico", lastName: "Hülkenberg", code: "HUL", number: 27,
    nationality: "German", countryCode: "DE",
    team: "Audi", teamSlug: "audi", driverSlug: "nichul01",
    teamColor: "#FF0000",
    headshot: driverHeadshot("audi", "nichul01"),
    headshotSmall: driverHeadshot("audi", "nichul01", 64),
    teamLogo: teamLogo("audi"),
    teamCar: teamCar("audi"),
  },
  {
    driverId: "bortoleto", firstName: "Gabriel", lastName: "Bortoleto", code: "BOR", number: 5,
    nationality: "Brazilian", countryCode: "BR",
    team: "Audi", teamSlug: "audi", driverSlug: "gabbor01",
    teamColor: "#FF0000",
    headshot: driverHeadshot("audi", "gabbor01"),
    headshotSmall: driverHeadshot("audi", "gabbor01", 64),
    teamLogo: teamLogo("audi"),
    teamCar: teamCar("audi"),
  },
  // Cadillac
  {
    driverId: "bottas", firstName: "Valtteri", lastName: "Bottas", code: "BOT", number: 77,
    nationality: "Finnish", countryCode: "FI",
    team: "Cadillac", teamSlug: "cadillac", driverSlug: "valbot01",
    teamColor: "#1d6641",
    headshot: driverHeadshot("cadillac", "valbot01"),
    headshotSmall: driverHeadshot("cadillac", "valbot01", 64),
    teamLogo: teamLogo("cadillac"),
    teamCar: teamCar("cadillac"),
  },
  {
    driverId: "perez", firstName: "Sergio", lastName: "Perez", code: "PER", number: 11,
    nationality: "Mexican", countryCode: "MX",
    team: "Cadillac", teamSlug: "cadillac", driverSlug: "serper01",
    teamColor: "#1d6641",
    headshot: driverHeadshot("cadillac", "serper01"),
    headshotSmall: driverHeadshot("cadillac", "serper01", 64),
    teamLogo: teamLogo("cadillac"),
    teamCar: teamCar("cadillac"),
  },
  // Aston Martin
  {
    driverId: "alonso", firstName: "Fernando", lastName: "Alonso", code: "ALO", number: 14,
    nationality: "Spanish", countryCode: "ES",
    team: "Aston Martin", teamSlug: "astonmartin", driverSlug: "feralo01",
    teamColor: "#229971",
    headshot: driverHeadshot("astonmartin", "feralo01"),
    headshotSmall: driverHeadshot("astonmartin", "feralo01", 64),
    teamLogo: teamLogo("astonmartin"),
    teamCar: teamCar("astonmartin"),
  },
  {
    driverId: "stroll", firstName: "Lance", lastName: "Stroll", code: "STR", number: 18,
    nationality: "Canadian", countryCode: "CA",
    team: "Aston Martin", teamSlug: "astonmartin", driverSlug: "lanstr01",
    teamColor: "#229971",
    headshot: driverHeadshot("astonmartin", "lanstr01"),
    headshotSmall: driverHeadshot("astonmartin", "lanstr01", 64),
    teamLogo: teamLogo("astonmartin"),
    teamCar: teamCar("astonmartin"),
  },
];

// Team asset lookup
export interface F1TeamAsset {
  name: string;
  slug: string;
  color: string;
  logo: string;
  car: string;
}

export const F1_TEAM_ASSETS: F1TeamAsset[] = [
  { name: "Mercedes", slug: "mercedes", color: "#27F4D2", logo: teamLogo("mercedes"), car: teamCar("mercedes") },
  { name: "Ferrari", slug: "ferrari", color: "#E8002D", logo: teamLogo("ferrari"), car: teamCar("ferrari") },
  { name: "McLaren", slug: "mclaren", color: "#FF8000", logo: teamLogo("mclaren"), car: teamCar("mclaren") },
  { name: "Red Bull Racing", slug: "redbullracing", color: "#3671C6", logo: teamLogo("redbullracing"), car: teamCar("redbullracing") },
  { name: "Alpine", slug: "alpine", color: "#FF87BC", logo: teamLogo("alpine"), car: teamCar("alpine") },
  { name: "Racing Bulls", slug: "racingbulls", color: "#6692FF", logo: teamLogo("racingbulls"), car: teamCar("racingbulls") },
  { name: "Haas", slug: "haasf1team", color: "#B6BABD", logo: teamLogo("haasf1team"), car: teamCar("haasf1team") },
  { name: "Williams", slug: "williams", color: "#64C4FF", logo: teamLogo("williams"), car: teamCar("williams") },
  { name: "Audi", slug: "audi", color: "#FF0000", logo: teamLogo("audi"), car: teamCar("audi") },
  { name: "Cadillac", slug: "cadillac", color: "#1d6641", logo: teamLogo("cadillac"), car: teamCar("cadillac") },
  { name: "Aston Martin", slug: "astonmartin", color: "#229971", logo: teamLogo("astonmartin"), car: teamCar("astonmartin") },
];

// Lookup helpers
export function findDriverAsset(driverName: string, code?: string): F1DriverAsset | undefined {
  const nameLower = driverName.toLowerCase();
  return F1_DRIVER_ASSETS.find(d => {
    if (code && d.code === code) return true;
    const fullName = `${d.firstName} ${d.lastName}`.toLowerCase();
    if (fullName === nameLower) return true;
    if (nameLower.includes(d.lastName.toLowerCase())) return true;
    return false;
  });
}

export function findTeamAsset(teamName: string): F1TeamAsset | undefined {
  let lower = teamName.toLowerCase();
  
  // Handle specific aliases
  if (lower.includes("rb f1 team") || lower === "rb" || lower === "vcarb") {
    lower = "racing bulls";
  }
  
  return F1_TEAM_ASSETS.find(t => {
    if (t.name.toLowerCase() === lower) return true;
    if (lower.includes(t.name.toLowerCase()) || t.name.toLowerCase().includes(lower)) return true;
    return false;
  });
}
