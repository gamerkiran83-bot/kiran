import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { http } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import {
  Heart,
  Trash,
  NavigationArrow,
  MapPin,
  Star,
  Sparkle,
  ArrowRight,
} from "@phosphor-icons/react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, refreshWishlist } = useAuth();
  const navigate = useNavigate();

  const loadWishlist = async () => {
    setLoading(true);
    try {
      const res = await http.get("/wishlist");
      setItems(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Could not load wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemove = async (destId) => {
    try {
      await http.delete(`/wishlist/${destId}`);
      toast.info("Removed from wishlist");
      setItems((prev) => prev.filter((i) => i.destination_id !== destId));
      refreshWishlist();
    } catch {
      toast.error("Could not remove item");
    }
  };

  const handlePlanRoute = () => {
    if (items.length < 2) {
      toast.warning("Save at least 2 destinations to optimize a route");
      return;
    }
    const params = items.map((i) => `dest=${encodeURIComponent(i.destination_id)}`).join("&");
    navigate(`/multi?${params}`);
  };

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="label-eyebrow flex items-center gap-1.5">
            <Heart size={14} weight="fill" className="text-rose-400" /> Saved Collections
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-normal mt-1 mb-2">
            My Wishlist ({items.length})
          </h1>
          <p className="text-sm text-muted-foreground">
            All your dream Indian monuments, hill retreats, and cultural sanctuaries in one place.
          </p>
        </div>

        {items.length >= 2 && (
          <Button
            onClick={handlePlanRoute}
            className="rounded-full btn-3d bg-primary text-primary-foreground font-semibold"
          >
            <NavigationArrow size={16} className="mr-1.5" /> Plan Route with Saved Places
          </Button>
        )}
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-xs text-muted-foreground">Loading saved destinations…</p>
        </div>
      ) : items.length === 0 ? (
        <div className="glass-strong rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 border border-white/10">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
            <Heart size={32} weight="fill" />
          </div>
          <h3 className="font-serif text-2xl text-white">Your Wishlist is Empty</h3>
          <p className="text-xs text-muted-foreground">
            Explore our curated catalog of incredible destinations across India and tap the heart icon to save your favorites.
          </p>
          <Link to="/destinations" className="inline-block pt-2">
            <Button className="rounded-full">Explore Destinations</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.destination_id}
              className="group glass rounded-3xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all shadow-xl block"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.destination_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <button
                  onClick={() => handleRemove(item.destination_id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/70 text-rose-400 hover:bg-rose-500 hover:text-white transition-all shadow"
                  title="Remove from wishlist"
                >
                  <Trash size={16} />
                </button>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-serif text-2xl text-white">{item.destination_name}</h3>
                  <span className="text-xs text-muted-foreground">{item.state}</span>
                </div>
                <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/10">
                  <Link
                    to={`/destinations/${item.destination_id}`}
                    className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                  >
                    View Details <ArrowRight size={12} />
                  </Link>
                  <Link
                    to={`/planner?to=${encodeURIComponent(item.destination_id)}`}
                    className="text-xs text-muted-foreground hover:text-white transition-colors"
                  >
                    Plan Itinerary
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
