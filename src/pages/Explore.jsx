import React, { useState, useEffect } from "react";
import { http } from "../lib/api";
import { POPULAR_INDIAN_CITIES } from "../data/indianCities";
import {
  Path,
  MagnifyingGlass,
  MapPin,
  Clock,
  NavigationArrow,
  Sparkle,
  ForkKnife,
  Buildings,
} from "@phosphor-icons/react";
import { Button } from "../components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import MapView from "../components/MapView";
import AskAI from "../components/AskAI";
import { toast } from "sonner";

const Explore = () => {
  const [from, setFrom] = useState("Delhi");
  const [to, setTo] = useState("Jaipur");
  const [detourKm, setDetourKm] = useState(35);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const fetchExplore = async (origin = from, dest = to) => {
    if (!origin || !dest) return;
    setLoading(true);
    try {
      const res = await http.post("/route/explore", {
        from: origin,
        to: dest,
        maxDetourKm: detourKm,
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Could not find route stops");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExplore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
    fetchExplore(to, temp);
  };

  const mapMarkers = (result?.stops || []).map((s, idx) => ({
    id: `stop-${idx}`,
    name: s.name,
    lat: s.lat,
    lon: s.lon,
    index: idx + 1,
    subtitle: s.highlight || s.category,
  }));

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="label-eyebrow flex items-center gap-1.5">
          <Path size={14} className="text-primary" /> Route Discovery
        </div>
        <h1 className="font-serif text-3xl md:text-5xl font-normal mt-1 mb-2">
          Stops Along The Route
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Discover hidden forts, roadside dhabas, artisan villages, and scenic viewpoints between any two Indian cities.
        </p>
      </div>

      {/* Control Bar */}
      <div className="glass-strong rounded-3xl p-6 border border-white/10 shadow-xl mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Starting City</label>
            <Select value={from} onValueChange={setFrom}>
              <SelectTrigger className="h-11 bg-white/5 border-white/10 rounded-xl">
                <SelectValue placeholder="Origin" />
              </SelectTrigger>
              <SelectContent>
                {POPULAR_INDIAN_CITIES.map((c) => (
                  <SelectItem key={c.name} value={c.name}>
                    {c.name} ({c.state})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Destination City</label>
            <Select value={to} onValueChange={setTo}>
              <SelectTrigger className="h-11 bg-white/5 border-white/10 rounded-xl">
                <SelectValue placeholder="Destination" />
              </SelectTrigger>
              <SelectContent>
                {POPULAR_INDIAN_CITIES.map((c) => (
                  <SelectItem key={c.name} value={c.name}>
                    {c.name} ({c.state})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Max Detour</span>
              <span className="text-primary font-semibold">{detourKm} km</span>
            </div>
            <input
              type="range"
              min={10}
              max={80}
              step={5}
              value={detourKm}
              onChange={(e) => setDetourKm(Number(e.target.value))}
              className="w-full accent-primary h-2 bg-white/10 rounded-lg cursor-pointer mt-2"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => fetchExplore()}
              disabled={loading}
              className="flex-1 h-11 rounded-xl btn-3d bg-primary text-primary-foreground font-semibold"
            >
              <MagnifyingGlass size={16} className="mr-2" />
              {loading ? "Searching…" : "Explore Route"}
            </Button>
            <Button
              variant="outline"
              onClick={handleSwap}
              className="h-11 px-3 rounded-xl glass border-white/10"
              title="Swap cities"
            >
              ⇄
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Stops List */}
        <div className="lg:col-span-5 space-y-4">
          {result && (
            <div className="glass rounded-2xl p-4 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground">Estimated Journey</span>
                <div className="font-serif text-xl text-white">
                  {result.total_distance_km || 260} km · ~{result.driving_hours || 4.5} hrs
                </div>
              </div>
              <AskAI
                prompt={`Recommend the top highway dhabas and stopover points along the drive from ${from} to ${to}.`}
                label="Ask TripPilot"
                size="sm"
              />
            </div>
          )}

          <div className="space-y-3">
            {(result?.stops || []).map((stop, idx) => (
              <div
                key={idx}
                className="glass rounded-2xl p-4 border border-white/10 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground flex items-center justify-center font-bold text-xs shrink-0 shadow">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-semibold text-base text-white truncate">{stop.name}</h4>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
                        {stop.detour_km ? `+${stop.detour_km} km` : "On route"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {stop.description || stop.highlight || "Historic landmark and scenic spot."}
                    </p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-slate-300">
                      {stop.recommended_stay_mins && (
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-secondary" /> {stop.recommended_stay_mins} mins
                        </span>
                      )}
                      {stop.category && (
                        <span className="capitalize px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 text-[11px]">
                          {stop.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {(!result?.stops || result.stops.length === 0) && !loading && (
              <div className="glass rounded-2xl p-8 text-center text-muted-foreground text-sm">
                No stops found along this highway corridor. Try increasing the detour distance.
              </div>
            )}
          </div>
        </div>

        {/* Map View */}
        <div className="lg:col-span-7">
          <div className="sticky top-24 glass rounded-3xl p-4 border border-white/10">
            <MapView
              markers={mapMarkers}
              route={result ? { stops: result.stops } : null}
              height="540px"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
