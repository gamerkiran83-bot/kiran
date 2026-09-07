import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { http } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import {
  SuitcaseSimple,
  Plus,
  Users,
  ShareNetwork,
  Trash,
  Sparkle,
  CalendarBlank,
  Clock,
  MapPin,
  Airplane,
  Sparkle as RecapIcon,
} from "@phosphor-icons/react";
import { Button } from "../components/ui/button";
import TripCollab from "../components/TripCollab";
import { toast } from "sonner";

const Trips = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collabTrip, setCollabTrip] = useState(null);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const res = await http.get("/trips");
      setTrips(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Could not load trips");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;
    try {
      await http.delete(`/trips/${id}`);
      toast.success("Trip deleted");
      setTrips((prev) => prev.filter((t) => t.id !== id));
    } catch {
      toast.error("Could not delete trip");
    }
  };

  const handleShare = (trip) => {
    const shareUrl = `${window.location.origin}/trip/${trip.share_token || trip.id}`;
    if (navigator.share) {
      navigator.share({
        title: trip.title,
        text: `Check out our India trip itinerary for ${trip.title} on Exploro!`,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="label-eyebrow flex items-center gap-1.5">
            <SuitcaseSimple size={14} className="text-primary" /> Journeys & Expeditions
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-normal mt-1 mb-2">
            My Travel Itineraries ({trips.length})
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your planned trips, collaborate with friends in real-time, and generate memory recaps.
          </p>
        </div>

        <Link to="/planner">
          <Button className="rounded-full btn-3d bg-primary text-primary-foreground font-semibold">
            <Plus size={16} className="mr-1.5" /> Plan New Trip
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-xs text-muted-foreground">Loading your trips…</p>
        </div>
      ) : trips.length === 0 ? (
        <div className="glass-strong rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 border border-white/10">
          <div className="w-16 h-16 rounded-3xl bg-primary/15 text-primary flex items-center justify-center mx-auto">
            <SuitcaseSimple size={32} weight="duotone" />
          </div>
          <h3 className="font-serif text-2xl text-white">No Trips Planned Yet</h3>
          <p className="text-xs text-muted-foreground">
            Create your first custom India itinerary with TripPilot AI or using our interactive day-by-day planner.
          </p>
          <Link to="/planner" className="inline-block pt-2">
            <Button className="rounded-full">Start Planning</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="glass rounded-3xl p-6 border border-white/10 hover:border-primary/40 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30">
                    {trip.days || 3} Days
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleShare(trip)}
                      className="p-1.5 rounded-lg opacity-70 hover:opacity-100 hover:bg-white/10 transition-all text-slate-300"
                      title="Share trip"
                    >
                      <ShareNetwork size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(trip.id)}
                      className="p-1.5 rounded-lg opacity-70 hover:opacity-100 hover:bg-destructive/20 hover:text-destructive transition-all text-slate-400"
                      title="Delete trip"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>

                <h3 className="font-serif text-2xl text-white group-hover:text-primary transition-colors">
                  {trip.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 mb-4 flex items-center gap-1">
                  <MapPin size={12} /> {trip.destination_name || "Custom stops"} · {trip.travel_style || "Moderate"}
                </p>

                {trip.notes && (
                  <p className="text-xs text-slate-300 line-clamp-2 bg-white/5 p-3 rounded-xl border border-white/5">
                    {trip.notes}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCollabTrip(trip)}
                    className="rounded-full glass border-white/15 text-xs h-8"
                  >
                    <Users size={14} className="mr-1.5 text-secondary" /> Group Collab
                  </Button>

                  <Link to={`/trip/${trip.share_token || trip.id}/recap`}>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-full text-xs h-8 text-primary hover:text-primary hover:bg-primary/10"
                    >
                      <Sparkle size={14} weight="fill" className="mr-1" /> Trip Recap
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Group Collab Modal */}
      {collabTrip && (
        <TripCollab
          trip={collabTrip}
          onClose={() => setCollabTrip(null)}
          onChanged={loadTrips}
        />
      )}
    </div>
  );
};

export default Trips;
