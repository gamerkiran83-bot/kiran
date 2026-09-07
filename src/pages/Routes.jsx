import React, { useState, useEffect } from "react";
import { http } from "../lib/api";
import { POPULAR_INDIAN_CITIES } from "../data/indianCities";
import {
  Airplane,
  Train,
  Bus,
  Car,
  Clock,
  CurrencyInr,
  Leaf,
  Sparkle,
  ArrowRight,
  ShieldCheck,
  WarningCircle,
} from "@phosphor-icons/react";
import { Button } from "../components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import AskAI from "../components/AskAI";
import { toast } from "sonner";

const iconMap = {
  flight: Airplane,
  train: Train,
  bus: Bus,
  car: Car,
  drive: Car,
};

const Routes = () => {
  const [fromCity, setFromCity] = useState("Delhi");
  const [toCity, setToCity] = useState("Mumbai");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const fetchComparison = async (f = fromCity, t = toCity) => {
    if (!f || !t || f === t) {
      toast.warning("Please pick two different cities");
      return;
    }
    setLoading(true);
    try {
      const res = await http.post("/transport", { from: f, to: t });
      setData(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Could not fetch transport comparison");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSwap = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
    fetchComparison(toCity, temp);
  };

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 md:px-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="label-eyebrow flex items-center gap-1.5">
          <Airplane size={14} className="text-primary" /> Intercity Connectivity
        </div>
        <h1 className="font-serif text-3xl md:text-5xl font-normal mt-1 mb-2">
          Compare Transport Modes
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Evaluate flight schedules, Vande Bharat & Rajdhani express trains, Volvo sleeper buses, and highway driving times with live price bands and carbon footprint.
        </p>
      </div>

      {/* Origin Destination Picker */}
      <div className="glass-strong rounded-3xl p-6 border border-white/10 shadow-xl mb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5">
            <label className="text-xs text-muted-foreground mb-1 block">From City</label>
            <Select value={fromCity} onValueChange={setFromCity}>
              <SelectTrigger className="h-11 bg-white/5 border-white/10 rounded-xl">
                <SelectValue placeholder="From" />
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

          <div className="md:col-span-2 flex justify-center pb-1">
            <Button
              type="button"
              variant="outline"
              onClick={handleSwap}
              className="rounded-full w-10 h-10 p-0 glass border-white/10"
              title="Swap cities"
            >
              ⇄
            </Button>
          </div>

          <div className="md:col-span-5">
            <label className="text-xs text-muted-foreground mb-1 block">To City</label>
            <Select value={toCity} onValueChange={setToCity}>
              <SelectTrigger className="h-11 bg-white/5 border-white/10 rounded-xl">
                <SelectValue placeholder="To" />
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
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            onClick={() => fetchComparison()}
            disabled={loading}
            className="rounded-xl btn-3d bg-primary text-primary-foreground font-semibold px-6"
          >
            {loading ? "Comparing…" : "Compare All Modes"}
          </Button>
        </div>
      </div>

      {/* Results Section */}
      {data && (
        <div className="space-y-6 fade-up">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 glass rounded-2xl p-4 border border-white/10">
            <div>
              <span className="text-xs text-muted-foreground">Route Corridor</span>
              <div className="font-serif text-2xl text-white">
                {fromCity} <ArrowRight className="inline mx-1 text-primary" size={18} /> {toCity}
              </div>
            </div>
            <AskAI
              prompt={`What is the best way to travel between ${fromCity} and ${toCity} considering comfort and cost? Any scenic train recommendations?`}
              label="Ask AI Recommendation"
              size="sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(data.modes || []).map((mode, idx) => {
              const Icon = iconMap[mode.type?.toLowerCase()] || Train;
              return (
                <div
                  key={idx}
                  className="glass rounded-3xl p-6 border border-white/10 hover:border-primary/40 transition-all space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center">
                        <Icon size={26} weight="duotone" />
                      </div>
                      <div>
                        <h3 className="font-serif text-2xl capitalize text-white">{mode.type}</h3>
                        <p className="text-xs text-muted-foreground">{mode.name || mode.operator}</p>
                      </div>
                    </div>
                    {mode.recommended && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Recommended
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center py-2 border-y border-white/10">
                    <div>
                      <span className="text-[11px] text-muted-foreground flex items-center justify-center gap-1">
                        <Clock size={12} /> Duration
                      </span>
                      <div className="font-semibold text-sm text-slate-100 mt-1">{mode.duration}</div>
                    </div>
                    <div>
                      <span className="text-[11px] text-muted-foreground flex items-center justify-center gap-1">
                        <CurrencyInr size={12} /> Fare Range
                      </span>
                      <div className="font-semibold text-sm text-primary mt-1">₹{mode.price_range || mode.price_inr}</div>
                    </div>
                    <div>
                      <span className="text-[11px] text-muted-foreground flex items-center justify-center gap-1">
                        <Leaf size={12} /> Carbon
                      </span>
                      <div className="font-semibold text-sm text-slate-200 mt-1">{mode.carbon_kg || 45} kg CO₂</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{mode.description || mode.summary}</p>

                  {mode.tips && (
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-muted-foreground">
                      <strong className="text-slate-200">Tip:</strong> {mode.tips}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Routes;
