import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { http } from "../lib/api";
import {
  SuitcaseSimple,
  Heart,
  Bell,
  Sparkle,
  Plus,
  ArrowRight,
  Airplane,
  NavigationArrow,
  MapPin,
  CalendarBlank,
} from "@phosphor-icons/react";
import { Button } from "../components/ui/button";

const Dashboard = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      http.get("/trips").catch(() => ({ data: [] })),
      http.get("/wishlist").catch(() => ({ data: [] })),
      http.get("/fare-alerts").catch(() => ({ data: [] })),
    ])
      .then(([t, w, a]) => {
        setTrips(t.data || []);
        setWishlist(w.data || []);
        setAlerts(a.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="glass-strong rounded-3xl p-8 border border-white/10 shadow-2xl mb-8 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
            Explorer Portal
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-normal mt-3 mb-2 text-white">
            Namaste, {user?.name || "Explorer"}!
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            Your travel command center for curated itineraries, shared group trips, saved heritage destinations, and real-time transit alerts.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/planner">
              <Button className="rounded-full btn-3d bg-primary text-primary-foreground font-semibold">
                <Plus size={16} className="mr-1.5" /> Plan New Itinerary
              </Button>
            </Link>
            <Link to="/ai">
              <Button variant="outline" className="rounded-full glass border-white/20 hover:bg-white/10">
                <Sparkle size={16} weight="fill" className="mr-1.5 text-secondary" /> Launch TripPilot AI
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link to="/trips" className="glass rounded-3xl p-5 border border-white/10 hover:border-primary/40 transition-all block">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-2">
            <span>My Trips</span>
            <SuitcaseSimple size={18} className="text-primary" />
          </div>
          <div className="font-serif text-3xl text-white font-bold">{trips.length}</div>
          <span className="text-[11px] text-muted-foreground">Itineraries & Collaborations</span>
        </Link>

        <Link to="/wishlist" className="glass rounded-3xl p-5 border border-white/10 hover:border-primary/40 transition-all block">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-2">
            <span>Saved Places</span>
            <Heart size={18} weight="fill" className="text-rose-400" />
          </div>
          <div className="font-serif text-3xl text-white font-bold">{wishlist.length}</div>
          <span className="text-[11px] text-muted-foreground">Wishlist destinations</span>
        </Link>

        <Link to="/alerts" className="glass rounded-3xl p-5 border border-white/10 hover:border-primary/40 transition-all block">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-2">
            <span>Fare Alerts</span>
            <Bell size={18} className="text-amber-400" />
          </div>
          <div className="font-serif text-3xl text-white font-bold">{alerts.length}</div>
          <span className="text-[11px] text-muted-foreground">Monitored transit routes</span>
        </Link>

        <Link to="/multi" className="glass rounded-3xl p-5 border border-white/10 hover:border-primary/40 transition-all block">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-2">
            <span>Multi-Stop</span>
            <NavigationArrow size={18} className="text-secondary" />
          </div>
          <div className="font-serif text-3xl text-white font-bold">Fast</div>
          <span className="text-[11px] text-muted-foreground">Path optimization</span>
        </Link>
      </div>

      {/* Trips & Wishlist preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Trips */}
        <div className="glass rounded-3xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl flex items-center gap-2">
              <SuitcaseSimple size={22} className="text-primary" /> Active Trips
            </h3>
            <Link to="/trips" className="text-xs text-primary hover:underline font-semibold flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>

          <div className="space-y-3">
            {trips.slice(0, 3).map((t) => (
              <Link
                key={t.id}
                to="/trips"
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/40 transition-all block"
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-white">{t.title}</h4>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                    {t.days || 3} Days
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {t.destination_name || "Multiple stops"} · {t.travel_style || "Standard"}
                </p>
              </Link>
            ))}

            {trips.length === 0 && (
              <div className="p-8 text-center text-muted-foreground text-xs">
                No trips planned yet. Click "Plan New Itinerary" to get started!
              </div>
            )}
          </div>
        </div>

        {/* Wishlist Preview */}
        <div className="glass rounded-3xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl flex items-center gap-2">
              <Heart size={22} weight="fill" className="text-rose-400" /> Saved Destinations
            </h3>
            <Link to="/wishlist" className="text-xs text-primary hover:underline font-semibold flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>

          <div className="space-y-3">
            {wishlist.slice(0, 3).map((w) => (
              <Link
                key={w.id || w.destination_id}
                to={`/destinations/${w.destination_id}`}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/40 transition-all flex items-center gap-3 block"
              >
                {w.image && (
                  <img src={w.image} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-sm text-white truncate">{w.destination_name}</h4>
                  <p className="text-xs text-muted-foreground">{w.state}</p>
                </div>
              </Link>
            ))}

            {wishlist.length === 0 && (
              <div className="p-8 text-center text-muted-foreground text-xs">
                Your wishlist is empty. Tap the heart icon on any destination to save it!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
