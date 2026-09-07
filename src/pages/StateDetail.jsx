import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { http } from "../lib/api";
import { ArrowLeft, MapPin, Star, Sparkle, CalendarBlank, ForkKnife } from "@phosphor-icons/react";
import { Button } from "../components/ui/button";
import AskAI from "../components/AskAI";

const StateDetail = () => {
  const { name } = useParams();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http
      .get("/destinations")
      .then((res) => {
        const filtered = (res.data || []).filter(
          (d) => d.state?.toLowerCase() === name?.toLowerCase()
        );
        setDestinations(filtered);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [name]);

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/states"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors glass px-4 py-2 rounded-full border border-white/10"
        >
          <ArrowLeft size={16} /> All States
        </Link>
        <AskAI
          prompt={`Give me a complete travel guide for ${name}, India: top attractions, best season, hidden gems, and safety tips.`}
          label={`Explore ${name} with AI`}
          size="sm"
        />
      </div>

      <div className="mb-8">
        <div className="label-eyebrow">State Profile</div>
        <h1 className="font-serif text-4xl md:text-6xl font-normal mt-1 mb-2 capitalize text-white">
          {name}
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Discover all curated heritage destinations, hill stations, wildlife sanctuaries, and cultural centers in {name}.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-xs text-muted-foreground">Loading destinations…</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((d) => (
            <Link
              key={d.id}
              to={`/destinations/${d.id}`}
              className="glass rounded-3xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all shadow-xl group block"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={d.image}
                  alt={d.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/30 backdrop-blur-md border border-primary/40 text-primary">
                  {d.type}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-serif text-2xl text-white group-hover:text-primary transition-colors">{d.name}</h3>
                  <span className="flex items-center gap-1 text-xs text-amber-300 font-bold">
                    <Star size={12} weight="fill" /> {d.rating || 4.8}
                  </span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2 mt-2">{d.description}</p>
              </div>
            </Link>
          ))}
          {destinations.length === 0 && (
            <div className="col-span-full py-16 text-center text-muted-foreground glass rounded-3xl p-8">
              No destinations currently indexed for {name}. Use TripPilot AI to discover bespoke spots!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StateDetail;
