import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { http } from "../lib/api";
import {
  SuitcaseSimple,
  CalendarBlank,
  MapPin,
  Users,
  Sparkle,
  ArrowLeft,
  ShareNetwork,
} from "@phosphor-icons/react";
import { Button } from "../components/ui/button";
import MapView from "../components/MapView";
import { ItineraryWeatherStrip } from "../components/ItineraryWeatherCard";
import { toast } from "sonner";

const SharedTrip = () => {
  const { token } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http
      .get(`/trips/shared/${token}`)
      .then((res) => setTrip(res.data))
      .catch((err) => {
        console.error(err);
        toast.error("Shared trip not found or expired");
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen py-24 text-center">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-xs text-muted-foreground">Loading shared trip…</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <h2 className="font-serif text-3xl mb-4">Trip Not Found</h2>
        <p className="text-muted-foreground mb-6">The shared trip link is invalid or has been removed.</p>
        <Link to="/">
          <Button className="rounded-full">Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 md:px-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors glass px-4 py-2 rounded-full border border-white/10"
        >
          <ArrowLeft size={16} /> Exploro India Home
        </Link>
        <Link to={`/trip/${token}/recap`}>
          <Button size="sm" className="rounded-full btn-3d bg-primary text-primary-foreground">
            <Sparkle size={14} weight="fill" className="mr-1.5" /> View Trip Recap
          </Button>
        </Link>
      </div>

      <div className="glass-strong rounded-3xl p-8 border border-white/10 shadow-2xl mb-8 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30">
            Shared Journey
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-slate-200 border border-white/15">
            {trip.days || 3} Days
          </span>
        </div>

        <h1 className="font-serif text-3xl md:text-5xl text-white font-normal">{trip.title}</h1>
        <p className="text-sm text-slate-300 max-w-2xl">{trip.notes || "An incredible journey across India."}</p>

        <div className="flex items-center gap-6 pt-4 border-t border-white/10 text-xs text-muted-foreground">
          <span>Host: <strong className="text-slate-200">{trip.owner_name || "Exploro Host"}</strong></span>
          <span>Travelers: <strong className="text-slate-200">{trip.traveler_count || 2}</strong></span>
          <span>Style: <strong className="text-slate-200 capitalize">{trip.travel_style || "Moderate"}</strong></span>
        </div>
      </div>

      {/* Itinerary Live Weather Strip */}
      {trip.destinations && trip.destinations.length > 0 && (
        <div className="glass-strong rounded-3xl p-6 border border-white/10 mb-8 shadow-xl">
          <ItineraryWeatherStrip
            cities={trip.destinations.map((d) => d.name || d)}
          />
        </div>
      )}

      {/* Destinations & Map */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass rounded-3xl p-6 border border-white/10 space-y-4">
          <h3 className="font-serif text-2xl">Planned Itinerary Stops</h3>
          <div className="space-y-3">
            {(trip.destinations || []).map((d, i) => (
              <div key={d.id || i} className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                  {i + 1}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{d.name}</div>
                  <div className="text-xs text-muted-foreground">{d.state}</div>
                </div>
              </div>
            ))}
            {(!trip.destinations || trip.destinations.length === 0) && (
              <div className="text-xs text-muted-foreground p-4">Custom road route and experiences.</div>
            )}
          </div>
        </div>

        <div className="glass rounded-3xl p-4 border border-white/10">
          <MapView
            markers={(trip.destinations || []).map((d, i) => ({
              id: d.id,
              name: d.name,
              lat: d.lat,
              lon: d.lon,
              index: i + 1,
            }))}
            height="380px"
          />
        </div>
      </div>
    </div>
  );
};

export default SharedTrip;
