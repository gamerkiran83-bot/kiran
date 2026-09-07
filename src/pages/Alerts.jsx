import React, { useState, useEffect } from "react";
import { http } from "../lib/api";
import { POPULAR_INDIAN_CITIES } from "../data/indianCities";
import {
  Bell,
  Plus,
  Trash,
  Airplane,
  Train,
  Bus,
  CurrencyInr,
  Sparkle,
  ArrowRight,
  CheckCircle,
} from "@phosphor-icons/react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import { toast } from "sonner";

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromCity, setFromCity] = useState("Delhi");
  const [toCity, setToCity] = useState("Goa");
  const [mode, setMode] = useState("flight");
  const [targetPrice, setTargetPrice] = useState(3500);
  const [submitting, setSubmitting] = useState(false);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const res = await http.get("/fare-alerts");
      setAlerts(res.data || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!fromCity || !toCity || fromCity === toCity) {
      toast.warning("Please select two different cities");
      return;
    }
    setSubmitting(true);
    try {
      await http.post("/fare-alerts", {
        from: fromCity,
        to: toCity,
        mode,
        target_price_inr: Number(targetPrice),
      });
      toast.success("Fare alert activated! We'll monitor price fluctuations.");
      loadAlerts();
    } catch (err) {
      toast.error("Could not create alert");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await http.delete(`/fare-alerts/${id}`);
      toast.info("Alert removed");
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch {
      toast.error("Could not delete alert");
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 md:px-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="label-eyebrow flex items-center gap-1.5">
          <Bell size={14} className="text-amber-400" /> Fare Intelligence
        </div>
        <h1 className="font-serif text-3xl md:text-5xl font-normal mt-1 mb-2">
          Route Fare Alerts
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Track real-time flight, Vande Bharat train, and sleeper bus pricing drops between key Indian city corridors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Create Alert Form */}
        <div className="lg:col-span-5">
          <div className="glass-strong rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
            <h3 className="font-serif text-xl flex items-center gap-2">
              <Plus size={18} className="text-primary" /> Create New Fare Alert
            </h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Origin City</label>
                <Select value={fromCity} onValueChange={setFromCity}>
                  <SelectTrigger className="h-11 bg-white/5 border-white/10 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {POPULAR_INDIAN_CITIES.map((c) => (
                      <SelectItem key={c.name} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Destination City</label>
                <Select value={toCity} onValueChange={setToCity}>
                  <SelectTrigger className="h-11 bg-white/5 border-white/10 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {POPULAR_INDIAN_CITIES.map((c) => (
                      <SelectItem key={c.name} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Transport Mode</label>
                <Select value={mode} onValueChange={setMode}>
                  <SelectTrigger className="h-11 bg-white/5 border-white/10 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flight">Flight (Domestic)</SelectItem>
                    <SelectItem value="train">Train (IRCTC Express)</SelectItem>
                    <SelectItem value="bus">Bus (Volvo AC)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Notify when fare drops below (₹)</label>
                <Input
                  type="number"
                  min={500}
                  step={100}
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  className="h-11 bg-white/5 border-white/10 rounded-xl"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-11 rounded-xl btn-3d bg-primary text-primary-foreground font-semibold"
              >
                {submitting ? "Setting Alert…" : "Activate Alert"}
              </Button>
            </form>
          </div>
        </div>

        {/* Monitored Alerts List */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-serif text-2xl flex items-center gap-2">
            <Bell size={22} className="text-primary" /> Active Monitored Corridors ({alerts.length})
          </h3>

          {loading ? (
            <div className="p-8 text-center text-xs text-muted-foreground">Loading alerts…</div>
          ) : alerts.length === 0 ? (
            <div className="glass rounded-3xl p-10 text-center text-muted-foreground text-sm border border-white/10">
              No active alerts. Choose a route and price threshold to get alerted on drops!
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((a) => (
                <div
                  key={a.id}
                  className="glass rounded-2xl p-5 border border-white/10 hover:border-primary/40 transition-all flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-semibold text-white">
                      <span>{a.from}</span>
                      <ArrowRight size={14} className="text-primary" />
                      <span>{a.to}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="capitalize px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                        {a.mode}
                      </span>
                      <span>Target: <strong className="text-slate-200">₹{a.target_price_inr}</strong></span>
                      {a.current_price && (
                        <span>Current: <strong className="text-emerald-400">₹{a.current_price}</strong></span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(a.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-destructive hover:bg-destructive/10 transition-all"
                    title="Delete alert"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alerts;
