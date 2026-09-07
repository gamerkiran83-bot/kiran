import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { http } from "../lib/api";
import {
  Sparkle,
  SuitcaseSimple,
  ForkKnife,
  MapPin,
  Trophy,
  ShareNetwork,
  ArrowLeft,
} from "@phosphor-icons/react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

const BADGES = [
  { title: "Heritage Explorer", desc: "Visited centuries-old forts & UNESCO temples", icon: "🏛️" },
  { title: "Culinary Connoisseur", desc: "Tasted iconic regional thalis & authentic street sweets", icon: "🍛" },
  { title: "Desi Nomad", desc: "Covered 500+ kilometers across Indian highway corridors", icon: "🚗" },
];

const Recap = () => {
  const { token } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http
      .get(`/trips/shared/${token}`)
      .then((res) => setTrip(res.data))
      .catch(() => {
        // Fallback default recap if no specific token match
        setTrip({
          title: "Incredible India Grand Tour",
          days: 5,
          destinations: [{ name: "Jaipur" }, { name: "Agra" }, { name: "Delhi" }],
        });
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "My Exploro India Travel Recap!",
        text: `Check out my travel memory recap for ${trip?.title || "India trip"}!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Recap link copied!");
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 md:px-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link
          to={`/trip/${token}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors glass px-4 py-2 rounded-full border border-white/10"
        >
          <ArrowLeft size={16} /> View Itinerary
        </Link>
        <Button
          onClick={handleShare}
          className="rounded-full btn-3d bg-primary text-primary-foreground font-semibold"
        >
          <ShareNetwork size={16} className="mr-1.5" /> Share Recap Card
        </Button>
      </div>

      {/* Recap Card */}
      <div className="glass-strong rounded-3xl p-8 md:p-12 border border-white/15 shadow-2xl relative overflow-hidden text-center space-y-8">
        <div className="absolute -right-24 -top-24 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-80 h-80 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30">
            <Sparkle size={14} weight="fill" /> Expedition Memory Recap
          </div>
          <h1 className="font-serif text-4xl md:text-6xl text-white font-normal">
            {trip?.title || "Incredible India Expedition"}
          </h1>
          <p className="text-sm text-slate-300 max-w-lg mx-auto">
            A celebration of culture, breathtaking landscapes, and unforgettable culinary discoveries.
          </p>
        </div>

        {/* Big Highlights Stat Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
          <div className="glass rounded-2xl p-4 border border-white/10">
            <div className="font-serif text-3xl md:text-4xl text-primary font-bold">{trip?.days || 4}</div>
            <div className="text-xs text-muted-foreground mt-1">Days Explored</div>
          </div>
          <div className="glass rounded-2xl p-4 border border-white/10">
            <div className="font-serif text-3xl md:text-4xl text-secondary font-bold">
              {trip?.destinations?.length || 3}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Destinations</div>
          </div>
          <div className="glass rounded-2xl p-4 border border-white/10">
            <div className="font-serif text-3xl md:text-4xl text-amber-400 font-bold">640</div>
            <div className="text-xs text-muted-foreground mt-1">Kilometers Traveled</div>
          </div>
          <div className="glass rounded-2xl p-4 border border-white/10">
            <div className="font-serif text-3xl md:text-4xl text-emerald-400 font-bold">12</div>
            <div className="text-xs text-muted-foreground mt-1">Dishes Tasted</div>
          </div>
        </div>

        {/* Badges Earned */}
        <div className="relative z-10 space-y-4 pt-4 border-t border-white/10">
          <h3 className="font-serif text-2xl flex items-center justify-center gap-2">
            <Trophy size={22} className="text-amber-400" /> Expedition Badges Unlocked
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {BADGES.map((b, i) => (
              <div key={i} className="glass rounded-2xl p-4 border border-white/10 space-y-1">
                <div className="text-3xl mb-1">{b.icon}</div>
                <h4 className="font-semibold text-white text-sm">{b.title}</h4>
                <p className="text-xs text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recap;
