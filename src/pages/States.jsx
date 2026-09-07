import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { http } from "../lib/api";
import { MapTrifold, MagnifyingGlass, ArrowRight, Sparkle } from "@phosphor-icons/react";
import { Input } from "../components/ui/input";

const REGIONS = [
  { id: "all", label: "All Regions" },
  { id: "north", label: "North & Himalayas" },
  { id: "south", label: "South & Backwaters" },
  { id: "west", label: "West & Deserts" },
  { id: "east", label: "East & Delta" },
  { id: "northeast", label: "North-East" },
  { id: "central", label: "Central Heartland" },
];

const STATE_DATA = [
  { name: "Rajasthan", region: "west", capital: "Jaipur", highlights: "Palaces, Thar Desert, Royal Forts", count: 8, image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&auto=format&fit=crop&q=80" },
  { name: "Kerala", region: "south", capital: "Thiruvananthapuram", highlights: "Backwaters, Ayurveda, Spice hills", count: 7, image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80" },
  { name: "Himachal Pradesh", region: "north", capital: "Shimla", highlights: "Himalayan peaks, Apple orchards, Valleys", count: 6, image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80" },
  { name: "Goa", region: "west", capital: "Panaji", highlights: "Sun-kissed beaches, Portuguese villas", count: 6, image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80" },
  { name: "Uttar Pradesh", region: "north", capital: "Lucknow", highlights: "Taj Mahal, Varanasi Ghats, Awadhi cuisine", count: 7, image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80" },
  { name: "Uttarakhand", region: "north", capital: "Dehradun", highlights: "Yoga capital, Char Dham, Treks", count: 5, image: "https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?w=800&auto=format&fit=crop&q=80" },
  { name: "Tamil Nadu", region: "south", capital: "Chennai", highlights: "Dravidian architecture, Shore temples", count: 5, image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80" },
  { name: "Karnataka", region: "south", capital: "Bengaluru", highlights: "Hampi ruins, Coorg coffee, Mysore palace", count: 6, image: "https://images.unsplash.com/photo-1600100397608-f010f443b77a?w=800&auto=format&fit=crop&q=80" },
  { name: "Maharashtra", region: "west", capital: "Mumbai", highlights: "Ajanta Ellora caves, Western Ghats, Sahyadri", count: 6, image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=80" },
  { name: "Madhya Pradesh", region: "central", capital: "Bhopal", highlights: "Khajuraho, Tiger reserves, Gwalior Fort", count: 5, image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80" },
  { name: "West Bengal", region: "east", capital: "Kolkata", highlights: "Darjeeling tea, Sundarbans, Cultural art", count: 4, image: "https://images.unsplash.com/photo-1558431382-27e303142255?w=800&auto=format&fit=crop&q=80" },
  { name: "Sikkim", region: "northeast", capital: "Gangtok", highlights: "Kanchenjunga vistas, Buddhist monasteries", count: 4, image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80" },
  { name: "Ladakh", region: "north", capital: "Leh", highlights: "High-altitude passes, Pangong Tso, Monasteries", count: 4, image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800&auto=format&fit=crop&q=80" },
  { name: "Meghalaya", region: "northeast", capital: "Shillong", highlights: "Living root bridges, Waterfalls, Caves", count: 3, image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80" },
];

const States = () => {
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = STATE_DATA.filter((s) => {
    const matchesRegion = selectedRegion === "all" || s.region === selectedRegion;
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.highlights.toLowerCase().includes(search.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="label-eyebrow flex items-center gap-1.5">
          <MapTrifold size={14} className="text-primary" /> Regional Atlas
        </div>
        <h1 className="font-serif text-3xl md:text-5xl font-normal mt-1 mb-2">
          States & Territories of India
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Dive into the distinct culture, languages, cuisine, and geography of India's 36 diverse states and union territories.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass rounded-3xl p-4 md:p-6 border border-white/10 mb-8 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {REGIONS.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRegion(r.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedRegion === r.id
                    ? "bg-primary text-primary-foreground font-semibold shadow"
                    : "glass border border-white/10 text-slate-300 hover:bg-white/10"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search state or region…"
              className="pl-9 h-10 bg-white/5 border-white/10 rounded-full text-xs"
            />
          </div>
        </div>
      </div>

      {/* States Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((state) => (
          <Link
            key={state.name}
            to={`/destinations?state=${encodeURIComponent(state.name)}`}
            className="group glass rounded-3xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all shadow-xl hover:-translate-y-1 block"
          >
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={state.image}
                alt={state.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-950/60 backdrop-blur-md border border-white/10 text-slate-200">
                {state.count} Destinations
              </div>
            </div>

            <div className="p-5">
              <h3 className="font-serif text-2xl text-white group-hover:text-primary transition-colors flex items-center justify-between">
                <span>{state.name}</span>
                <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-primary" />
              </h3>
              <p className="text-xs text-muted-foreground mt-1 mb-3">Capital: {state.capital}</p>
              <p className="text-xs text-slate-300 line-clamp-2">{state.highlights}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default States;
