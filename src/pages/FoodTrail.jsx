import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { http } from "../lib/api";
import {
  ForkKnife,
  MapPin,
  Clock,
  CurrencyInr,
  NavigationArrow,
  ArrowLeft,
  Sparkle,
  Footprints,
} from "@phosphor-icons/react";
import { Button } from "../components/ui/button";
import MapView from "../components/MapView";
import AskAI from "../components/AskAI";
import { toast } from "sonner";

const FoodTrail = () => {
  const { destId } = useParams();
  const [trail, setTrail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    http
      .get(`/food-trail/${destId}`)
      .then((res) => setTrail(res.data))
      .catch((err) => {
        console.error(err);
        toast.error("Could not load food trail");
      })
      .finally(() => setLoading(false));
  }, [destId]);

  if (loading) {
    return (
      <div className="min-h-screen py-24 text-center">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-xs text-muted-foreground">Curating culinary trail stops…</p>
      </div>
    );
  }

  if (!trail) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <h2 className="font-serif text-3xl mb-4">Trail Not Available</h2>
        <p className="text-muted-foreground mb-6">No curated food trail found for this destination.</p>
        <Link to={`/destinations/${destId}`}>
          <Button className="rounded-full">Back to Destination</Button>
        </Link>
      </div>
    );
  }

  const markers = (trail.stops || []).map((s, idx) => ({
    id: `food-stop-${idx}`,
    name: s.dish,
    lat: s.lat,
    lon: s.lon,
    index: idx + 1,
    subtitle: `${s.restaurant} (${s.area})`,
  }));

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link
          to={`/destinations/${destId}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors glass px-4 py-2 rounded-full border border-white/10"
        >
          <ArrowLeft size={16} /> {trail.destination_name || "Destination"}
        </Link>
        <AskAI
          prompt={`What are the must-eat breakfast, snack, and dessert spots on a street food trail in ${trail.destination_name}? Mention dietary options (veg, jain).`}
          label="Ask Foodie AI"
          size="sm"
        />
      </div>

      <div className="mb-8">
        <div className="label-eyebrow flex items-center gap-1.5 text-secondary">
          <ForkKnife size={14} /> Gastronomic Walking Trail
        </div>
        <h1 className="font-serif text-3xl md:text-5xl font-normal mt-1 mb-2">
          {trail.destination_name} Culinary Trail
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          An authentic food crawl mapping the oldest sweetshops, smoking tandoors, and generational chai stalls.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Stops Timeline */}
        <div className="lg:col-span-6 space-y-4">
          {(trail.stops || []).map((stop, idx) => (
            <div
              key={idx}
              className="glass rounded-3xl p-6 border border-white/10 hover:border-secondary/40 transition-all relative overflow-hidden"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-secondary to-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0 shadow-lg shadow-secondary/20">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-serif text-2xl text-white truncate">{stop.dish}</h3>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shrink-0">
                      ₹{stop.price_inr}
                    </span>
                  </div>

                  <p className="text-sm text-secondary font-medium">{stop.restaurant}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 mb-3">
                    <MapPin size={12} /> {stop.area}
                  </p>

                  <p className="text-xs text-slate-300 leading-relaxed bg-white/5 p-3 rounded-2xl border border-white/5">
                    {stop.why}
                  </p>

                  <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> Time: {stop.eat_minutes} mins
                    </span>
                    {stop.walk_min_to_next && (
                      <span className="flex items-center gap-1 text-slate-300">
                        <Footprints size={12} className="text-primary" /> {stop.walk_min_to_next} min walk to next stop
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Map of Walking Trail */}
        <div className="lg:col-span-6">
          <div className="sticky top-24 glass rounded-3xl p-4 border border-white/10 space-y-4">
            <MapView markers={markers} height="520px" />
            <div className="p-4 rounded-2xl bg-white/5 text-xs text-muted-foreground flex items-center gap-2">
              <Footprints size={18} className="text-secondary shrink-0" />
              <span>Recommended walking sequence curated for the best digestive pace and authentic morning-to-evening meal flow.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodTrail;
