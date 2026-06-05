// OpenF1 Specific API Types

export interface OpenF1Meeting {
  meeting_key: number;
  meeting_name: string;
  meeting_official_name: string;
  location: string;
  country_key: number;
  country_code: string;
  country_name: string;
  circuit_key: number;
  circuit_short_name: string;
  date_start: string;
  year: number;
}

export interface OpenF1Session {
  session_key: number;
  session_name: string;
  date_start: string;
  date_end: string;
  gmt_offset: string;
  session_type: string;
  meeting_key: number;
  location: string;
  country_key: number;
  country_code: string;
  country_name: string;
  circuit_key: number;
  circuit_short_name: string;
  year: number;
}

export interface OpenF1Driver {
  session_key: number;
  meeting_key: number;
  broadcast_name: string;
  country_code: string;
  first_name: string;
  full_name: string;
  headshot_url: string;
  last_name: string;
  driver_number: number;
  team_colour: string;
  team_name: string;
  name_acronym: string;
}

export interface OpenF1Lap {
  meeting_key: number;
  session_key: number;
  driver_number: number;
  i1_speed: number;
  i2_speed: number;
  st_speed: number;
  date: string;
  lap_duration: number;
  is_pit_out_lap: boolean;
  duration_sector_1: number;
  duration_sector_2: number;
  duration_sector_3: number;
  segments_sector_1: number[];
  segments_sector_2: number[];
  segments_sector_3: number[];
  lap_number: number;
}

export interface OpenF1PitStop {
  meeting_key: number;
  session_key: number;
  driver_number: number;
  pit_duration: number;
  date: string;
  lap_number: number;
}

export interface OpenF1Stint {
  meeting_key: number;
  session_key: number;
  driver_number: number;
  stint_number: number;
  tyre_age_at_start: number;
  compound: string;
  lap_start: number;
  lap_end: number;
}

export interface OpenF1RaceControl {
  meeting_key: number;
  session_key: number;
  date: string;
  category: string;
  message: string;
  flag: string;
  scope: string;
  sector: number;
  lap_number: number;
}

export interface OpenF1Weather {
  meeting_key: number;
  session_key: number;
  date: string;
  air_temperature: number;
  humidity: number;
  pressure: number;
  rainfall: number;
  track_temperature: number;
  wind_direction: number;
  wind_speed: number;
}
