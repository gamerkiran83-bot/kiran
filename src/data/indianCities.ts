export interface IndianCity {
  id: string;
  name: string;
  state: string;
  lat: number;
  lon: number;
  region: "North" | "South" | "East" | "West" | "Central" | "North-East";
  aliases?: string[];
  destinationId?: string;
  popular?: boolean;
}

export const POPULAR_INDIAN_CITIES: IndianCity[] = [
  { id: "delhi", name: "Delhi", state: "Delhi", lat: 28.6139, lon: 77.2090, region: "North", aliases: ["New Delhi", "NCR"], destinationId: "dl-delhi", popular: true },
  { id: "mumbai", name: "Mumbai", state: "Maharashtra", lat: 19.0760, lon: 72.8777, region: "West", aliases: ["Bombay"], destinationId: "mh-mumbai", popular: true },
  { id: "bengaluru", name: "Bengaluru", state: "Karnataka", lat: 12.9716, lon: 77.5946, region: "South", aliases: ["Bangalore"], destinationId: "ka-bengaluru", popular: true },
  { id: "jaipur", name: "Jaipur", state: "Rajasthan", lat: 26.9124, lon: 75.7873, region: "North", aliases: ["Pink City"], destinationId: "rj-jaipur", popular: true },
  { id: "hyderabad", name: "Hyderabad", state: "Telangana", lat: 17.3850, lon: 78.4867, region: "South", aliases: ["Cyberabad", "Secunderabad"], popular: true },
  { id: "chennai", name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lon: 80.2707, region: "South", aliases: ["Madras"], popular: true },
  { id: "kolkata", name: "Kolkata", state: "West Bengal", lat: 22.5726, lon: 88.3639, region: "East", aliases: ["Calcutta"], popular: true },
  { id: "goa", name: "Panaji", state: "Goa", lat: 15.4909, lon: 73.8278, region: "West", aliases: ["Goa", "North Goa", "South Goa"], destinationId: "ga-panaji", popular: true },
  { id: "varanasi", name: "Varanasi", state: "Uttar Pradesh", lat: 25.3176, lon: 82.9739, region: "North", aliases: ["Banaras", "Kashi"], destinationId: "up-varanasi", popular: true },
  { id: "agra", name: "Agra", state: "Uttar Pradesh", lat: 27.1767, lon: 78.0081, region: "North", destinationId: "up-agra", popular: true },
  { id: "manali", name: "Manali", state: "Himachal Pradesh", lat: 32.2432, lon: 77.1892, region: "North", destinationId: "hp-manali", popular: true },
  { id: "srinagar", name: "Srinagar", state: "Jammu & Kashmir", lat: 34.0837, lon: 74.7973, region: "North", destinationId: "jk-srinagar", popular: true },
  { id: "shimla", name: "Shimla", state: "Himachal Pradesh", lat: 31.1048, lon: 77.1734, region: "North", destinationId: "hp-shimla", popular: true },
  { id: "kochi", name: "Kochi", state: "Kerala", lat: 9.9312, lon: 76.2673, region: "South", aliases: ["Cochin"], destinationId: "kl-kochi", popular: true },
  { id: "munnar", name: "Munnar", state: "Kerala", lat: 10.0889, lon: 77.0595, region: "South", destinationId: "kl-munnar", popular: true },
  { id: "amritsar", name: "Amritsar", state: "Punjab", lat: 31.6340, lon: 74.8723, region: "North", destinationId: "pb-amritsar", popular: true },
  { id: "udaipur", name: "Udaipur", state: "Rajasthan", lat: 24.5854, lon: 73.7125, region: "West", destinationId: "rj-udaipur", popular: true },
  { id: "pune", name: "Pune", state: "Maharashtra", lat: 18.5204, lon: 73.8567, region: "West", aliases: ["Poona"], popular: true },
  { id: "ahmedabad", name: "Ahmedabad", state: "Gujarat", lat: 23.0225, lon: 72.5714, region: "West", aliases: ["Amdavad"], popular: true },
  { id: "leh", name: "Leh", state: "Ladakh", lat: 34.1526, lon: 77.5771, region: "North", destinationId: "la-leh", popular: true },
  { id: "rishikesh", name: "Rishikesh", state: "Uttarakhand", lat: 30.0869, lon: 78.2676, region: "North", destinationId: "uk-rishikesh", popular: true },
  { id: "ooty", name: "Ooty", state: "Tamil Nadu", lat: 11.4102, lon: 76.6950, region: "South", aliases: ["Udhagamandalam"], destinationId: "tn-ooty", popular: true },
  { id: "darjeeling", name: "Darjeeling", state: "West Bengal", lat: 27.0410, lon: 88.2663, region: "East", destinationId: "wb-darjeeling", popular: true },
  { id: "gangtok", name: "Gangtok", state: "Sikkim", lat: 27.3389, lon: 88.6065, region: "North-East", destinationId: "sk-gangtok", popular: true },
  { id: "lucknow", name: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lon: 80.9462, region: "North", popular: true },
  { id: "chandigarh", name: "Chandigarh", state: "Chandigarh", lat: 30.7333, lon: 76.7794, region: "North", popular: true },
  { id: "shillong", name: "Shillong", state: "Meghalaya", lat: 25.5788, lon: 91.8933, region: "North-East", destinationId: "ml-shillong", popular: true },
  { id: "mysuru", name: "Mysuru", state: "Karnataka", lat: 12.2958, lon: 76.6394, region: "South", aliases: ["Mysore"], destinationId: "ka-mysuru", popular: true },
  { id: "visakhapatnam", name: "Visakhapatnam", state: "Andhra Pradesh", lat: 17.6868, lon: 83.2185, region: "South", aliases: ["Vizag"], popular: true },
  { id: "bhopal", name: "Bhopal", state: "Madhya Pradesh", lat: 23.2599, lon: 77.4126, region: "Central", popular: true },
  { id: "indore", name: "Indore", state: "Madhya Pradesh", lat: 22.7196, lon: 75.8577, region: "Central", popular: true },
  { id: "patna", name: "Patna", state: "Bihar", lat: 25.6127, lon: 85.1589, region: "East", popular: true },
  { id: "guwahati", name: "Guwahati", state: "Assam", lat: 26.1445, lon: 91.7362, region: "North-East", popular: true },
  { id: "bhubaneswar", name: "Bhubaneswar", state: "Odisha", lat: 20.2961, lon: 85.8245, region: "East", popular: true },
  { id: "jodhpur", name: "Jodhpur", state: "Rajasthan", lat: 26.2389, lon: 73.0243, region: "West", destinationId: "rj-jodhpur", popular: true },
  { id: "surat", name: "Surat", state: "Gujarat", lat: 21.1702, lon: 72.8311, region: "West", popular: false },
  { id: "coimbatore", name: "Coimbatore", state: "Tamil Nadu", lat: 11.0168, lon: 76.9558, region: "South", popular: false },
  { id: "madurai", name: "Madurai", state: "Tamil Nadu", lat: 9.9252, lon: 78.1198, region: "South", destinationId: "tn-madurai", popular: false },
  { id: "thiruvananthapuram", name: "Thiruvananthapuram", state: "Kerala", lat: 8.5241, lon: 76.9366, region: "South", aliases: ["Trivandrum"], popular: false },
  { id: "pondicherry", name: "Puducherry", state: "Puducherry", lat: 11.9416, lon: 79.8083, region: "South", aliases: ["Pondicherry"], destinationId: "py-pondicherry", popular: false },
  { id: "nainital", name: "Nainital", state: "Uttarakhand", lat: 29.3919, lon: 79.4542, region: "North", destinationId: "uk-nainital", popular: false },
  { id: "hampi", name: "Hampi", state: "Karnataka", lat: 15.3350, lon: 76.4600, region: "South", destinationId: "ka-hampi", popular: false },
  { id: "khajuraho", name: "Khajuraho", state: "Madhya Pradesh", lat: 24.8318, lon: 79.9199, region: "Central", destinationId: "mp-khajuraho", popular: false },
  { id: "jaisalmer", name: "Jaisalmer", state: "Rajasthan", lat: 26.9157, lon: 70.9083, region: "West", destinationId: "rj-jaisalmer", popular: false },
  { id: "nagpur", name: "Nagpur", state: "Maharashtra", lat: 21.1458, lon: 79.0882, region: "Central", popular: false },
  { id: "nashik", name: "Nashik", state: "Maharashtra", lat: 19.9975, lon: 73.7898, region: "West", aliases: ["Nasik"], popular: false },
  { id: "dehradun", name: "Dehradun", state: "Uttarakhand", lat: 30.3165, lon: 78.0322, region: "North", popular: false },
  { id: "haridwar", name: "Haridwar", state: "Uttarakhand", lat: 29.9457, lon: 78.1642, region: "North", popular: false },
  { id: "ranchi", name: "Ranchi", state: "Jharkhand", lat: 23.3441, lon: 85.3096, region: "East", popular: false },
  { id: "raipur", name: "Raipur", state: "Chhattisgarh", lat: 21.2514, lon: 81.6296, region: "Central", popular: false },
  { id: "vadodara", name: "Vadodara", state: "Gujarat", lat: 22.3072, lon: 73.1812, region: "West", aliases: ["Baroda"], popular: false },
  { id: "rajkot", name: "Rajkot", state: "Gujarat", lat: 22.3039, lon: 70.8022, region: "West", popular: false },
  { id: "gwalior", name: "Gwalior", state: "Madhya Pradesh", lat: 26.2183, lon: 78.1828, region: "Central", popular: false },
  { id: "jabalpur", name: "Jabalpur", state: "Madhya Pradesh", lat: 23.1815, lon: 79.9864, region: "Central", popular: false },
  { id: "vijayawada", name: "Vijayawada", state: "Andhra Pradesh", lat: 16.5062, lon: 80.6480, region: "South", popular: false },
  { id: "tirupati", name: "Tirupati", state: "Andhra Pradesh", lat: 13.6288, lon: 79.4192, region: "South", popular: false },
  { id: "mangalore", name: "Mangaluru", state: "Karnataka", lat: 12.9141, lon: 74.8560, region: "South", aliases: ["Mangalore"], popular: false },
  { id: "kodaikanal", name: "Kodaikanal", state: "Tamil Nadu", lat: 10.2381, lon: 77.4892, region: "South", popular: false },
  { id: "alleppey", name: "Alappuzha", state: "Kerala", lat: 9.4981, lon: 76.3388, region: "South", aliases: ["Alleppey"], popular: false },
  { id: "port-blair", name: "Port Blair", state: "Andaman & Nicobar Islands", lat: 11.6234, lon: 92.7265, region: "South", destinationId: "an-portblair", popular: false },
  { id: "dharamshala", name: "Dharamshala", state: "Himachal Pradesh", lat: 32.2190, lon: 76.3234, region: "North", aliases: ["Mcleodganj"], popular: false },
  { id: "puri", name: "Puri", state: "Odisha", lat: 19.8135, lon: 85.8312, region: "East", popular: false },
  { id: "aurangabad", name: "Chhatrapati Sambhajinagar", state: "Maharashtra", lat: 19.8762, lon: 75.3433, region: "West", aliases: ["Aurangabad"], popular: false },
  { id: "kanpur", name: "Kanpur", state: "Uttar Pradesh", lat: 26.4499, lon: 80.3319, region: "North", popular: false },
  { id: "prayagraj", name: "Prayagraj", state: "Uttar Pradesh", lat: 25.4358, lon: 81.8463, region: "North", aliases: ["Allahabad"], popular: false }
];

import { DESTINATIONS } from "./destinations";

// Pre-index all 1,924 places for instant universal search
export const MASTER_PLACES_SEARCHABLE: IndianCity[] = DESTINATIONS.map((d) => ({
  id: d.id,
  name: d.name,
  state: d.state,
  lat: d.lat,
  lon: d.lon,
  region: (d.region as any) || "North",
  destinationId: d.id,
  popular: false,
}));

export function findLocalIndianCity(query: string): IndianCity | undefined {
  if (!query || typeof query !== "string") return undefined;
  const q = query.trim().toLowerCase();
  
  // Exact match first in popular cities
  const exact = POPULAR_INDIAN_CITIES.find(
    (c) => c.name.toLowerCase() === q || c.aliases?.some((a) => a.toLowerCase() === q)
  );
  if (exact) return exact;

  // Exact match in all 1924 places
  const exactPlace = MASTER_PLACES_SEARCHABLE.find(
    (p) => p.name.toLowerCase() === q
  );
  if (exactPlace) return exactPlace;

  // Prefix match
  const prefix = POPULAR_INDIAN_CITIES.find(
    (c) => c.name.toLowerCase().startsWith(q) || c.aliases?.some((a) => a.toLowerCase().startsWith(q))
  );
  if (prefix) return prefix;

  const prefixPlace = MASTER_PLACES_SEARCHABLE.find(
    (p) => p.name.toLowerCase().startsWith(q)
  );
  if (prefixPlace) return prefixPlace;

  // Substring match
  const sub = POPULAR_INDIAN_CITIES.find(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.state.toLowerCase().includes(q) ||
      c.aliases?.some((a) => a.toLowerCase().includes(q))
  );
  if (sub) return sub;

  return MASTER_PLACES_SEARCHABLE.find(
    (p) => p.name.toLowerCase().includes(q) || p.state.toLowerCase().includes(q)
  );
}

export function searchIndianCitiesLocal(query: string, limit = 8): IndianCity[] {
  if (!query || !query.trim()) {
    return POPULAR_INDIAN_CITIES.filter((c) => c.popular).slice(0, limit);
  }
  const q = query.trim().toLowerCase();
  const results: IndianCity[] = [];
  const seenIds = new Set<string>();

  // 1. Search popular cities first
  for (const c of POPULAR_INDIAN_CITIES) {
    if (
      c.name.toLowerCase().includes(q) ||
      c.state.toLowerCase().includes(q) ||
      c.aliases?.some((a) => a.toLowerCase().includes(q))
    ) {
      results.push(c);
      seenIds.add(c.name.toLowerCase());
      if (results.length >= limit) return results;
    }
  }

  // 2. Search all 1924 places
  for (const p of MASTER_PLACES_SEARCHABLE) {
    if (!seenIds.has(p.name.toLowerCase())) {
      if (p.name.toLowerCase().includes(q) || p.state.toLowerCase().includes(q)) {
        results.push(p);
        seenIds.add(p.name.toLowerCase());
        if (results.length >= limit) return results;
      }
    }
  }

  return results;
}

