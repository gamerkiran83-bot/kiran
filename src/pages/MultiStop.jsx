import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { http } from "../lib/api";
import {
  NavigationArrow,
  Plus,
  Trash,
  ArrowsDownUp,
  MapPin,
  Clock,
  Sparkle,
  Check,
} from "@phosphor-icons/react";
import { Button } from "../components/ui/button";
import MapView from "../components/MapView";
import AskAI from "../components/AskAI";
import { toast } from "sonner";

const MultiStop = () => {
  const [searchParams] = useSearchParams();
  const [allDestinations, setAllDestinations] = useState([]);
  const [selectedIds, setSelectedIds] = useState(["delhi", "agra", "jaipur"]);
  const [selectedCity, setSelectedCity] = useState("");
  const [optimizedRoute, setOptimizedRoute] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    http.get("/destinations").then((res) => {
      setAllDestinations(res.data || []);
      const destParam = searchParams.get("dest");
      if (destParam && !selectedIds.includes(destParam)) {
        setSelectedIds((prev) => [...prev, destParam]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calculateShortest = async (ids = selectedIds) => {
    if (ids.length < 2) {
      toast.warning("Please pick at least 2 destinations to optimize a route");
      return;
    }
    setLoading(true);
    try {
      const res = await http.post("/route/shortest", { destination_ids: ids });
      setOptimizedRoute(res.data);
      toast.success("Route optimized successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Could not calculate route");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (allDestinations.length > 0 && selectedIds.length >= 2) {
      calculateShortest(selectedIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDestinations]);

  const addDestination = (id) => {
    if (!id || selectedIds.includes(id)) return;
    const next = [...selectedIds, id];
    setSelectedIds(next);
    setSelectedCity("");
    calculateShortest(next);
  };

  const removeDestination = (id) => {
    if (selectedIds.length <= 2) {
      toast.warning("Keep at least 2 stops");
      return;
    }
    const next = selectedIds.filter((x) => x !== id);
    setSelectedIds(next);
    calculateShortest(next);
  };

  const currentStops = optimizedRoute?.stops || [];
  const mapMarkers = currentStops.map((s, idx) => ({
    id: s.id || `stop-${idx}`,
    name: s.name,
    lat: s.lat,
    lon: s.lon,
    index: idx + 1,
    subtitle: s.state,
  }));

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="label-eyebrow flex items-center gap-1.5">
          <NavigationArrow size={14} className="text-primary" /> Route Optimization
        </div>
        <h1 className="font-serif text-3xl md:text-5xl font-normal mt-1 mb-2">
          Multi-Stop Route Optimizer
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Plan complex multi-city journeys across India. Our traveling salesperson algorithm computes the minimum travel mileage order.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Destinations selector & Ordered List */}
        <div className="lg:col-span-5 space-y-6">
          {/* Add Stop Panel */}
          <div className="glass-strong rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
            <h3 className="font-serif text-xl">Selected Destinations ({selectedIds.length})</h3>

            <div className="flex gap-2">
              <select
                value={selectedCity}
                onChange={(e) => addDestination(e.target.value)}
                className="flex-1 h-11 bg-white/5 border border-white/10 rounded-xl px-3 text-sm text-slate-100 outline-none"
              >
                <option value="" className="bg-slate-900 text-slate-400">
                  + Add destination to route…
                </option>
                {allDestinations
                  .filter((d) => !selectedIds.includes(d.id))
                  .map((d) => (
                    <option key={d.id} value={d.id} className="bg-slate-900 text-slate-100">
                      {d.name} ({d.state})
                    </option>
                  ))}
              </select>
            </div>

            {/* Optimized Route Sequence */}
            <div className="space-y-2 pt-2">
              {currentStops.map((stop, idx) => (
                <div
                  key={stop.id || idx}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 group hover:border-primary/40 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground flex items-center justify-center font-bold text-xs shrink-0">
                      {idx + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate">{stop.name}</div>
                      <div className="text-xs text-muted-foreground">{stop.state}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {idx < currentStops.length - 1 && stop.next_leg_km && (
                      <span className="text-[11px] text-muted-foreground font-mono">
                        → {stop.next_leg_km} km
                      </span>
                    )}
                    <button
                      onClick={() => removeDestination(stop.id)}
                      className="p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:bg-destructive/20 hover:text-destructive transition-all"
                      title="Remove stop"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={() => calculateShortest()}
              disabled={loading}
              className="w-full h-11 rounded-xl btn-3d bg-primary text-primary-foreground font-semibold"
            >
              <ArrowsDownUp size={16} className="mr-2" />
              {loading ? "Recomputing…" : "Re-Optimize Shortest Path"}
            </Button>
          </div>

          {/* Metric Summary */}
          {optimizedRoute && (
            <div className="glass rounded-3xl p-6 border border-white/10 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-xs text-muted-foreground">Total Distance</div>
                  <div className="font-serif text-2xl text-primary mt-1">
                    {optimizedRoute.total_distance_km || 0} km
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-xs text-muted-foreground">Suggested Days</div>
                  <div className="font-serif text-2xl text-secondary mt-1">
                    {optimizedRoute.recommended_days || 5} Days
                  </div>
                </div>
              </div>

              <AskAI
                prompt={`Help me plan transport, accommodation, and day-by-day stops for this circuit: ${currentStops.map((s) => s.name).join(" -> ")}.`}
                label="Plan Circuit with TripPilot AI"
                size="default"
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* Right Column: Interactive Map */}
        <div className="lg:col-span-7">
          <div className="sticky top-24 glass rounded-3xl p-4 border border-white/10">
            <MapView
              markers={mapMarkers}
              route={optimizedRoute ? { stops: currentStops } : null}
              height="600px"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiStop;
