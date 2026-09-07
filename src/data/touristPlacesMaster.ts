// Auto-generated master dataset of 1,924 Indian Tourist Places across 36 States & UTs
import masterData from './indiaTouristPlacesMaster.json';

export interface TouristPlace {
  id: string;
  name: string;
  state: string;
  region: "South" | "North" | "East" | "West" | "Central" | "North-East";
  category: string;
  lat: number;
  lon: number;
  rating: number;
  image: string;
  bestSeason: string;
  description: string;
  tags: string[];
}

export interface StateSummary {
  state: string;
  region: string;
  count: number;
  centerLat: number;
  centerLon: number;
  bestSeason: string;
  sampleImage: string;
}

export const TOURIST_PLACES_MASTER: TouristPlace[] = masterData.places as TouristPlace[];
export const STATES_MASTER: StateSummary[] = masterData.states as StateSummary[];
export const TOTAL_TOURIST_PLACES = masterData.totalPlaces;
export const TOTAL_STATES_COUNT = masterData.totalStates;

export const PLACES_BY_ID = new Map<string, TouristPlace>(
  TOURIST_PLACES_MASTER.map((p) => [p.id, p])
);

export const PLACES_BY_STATE = new Map<string, TouristPlace[]>();
for (const p of TOURIST_PLACES_MASTER) {
  if (!PLACES_BY_STATE.has(p.state)) PLACES_BY_STATE.set(p.state, []);
  PLACES_BY_STATE.get(p.state)!.push(p);
}
