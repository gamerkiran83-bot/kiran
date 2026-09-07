import React, { useState, useEffect, useRef } from "react";
import { http } from "../lib/api";
import {
  NavigationArrow,
  Crosshair,
  Gauge,
  Compass,
  MapPin,
  Sparkle,
  WarningCircle,
  CheckCircle,
} from "@phosphor-icons/react";
import { Button } from "../components/ui/button";
import MapView from "../components/MapView";
import AskAI from "../components/AskAI";

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

const Tracking = () => {
  const [pos, setPos] = useState({
    lat: 28.6139,
    lon: 77.209,
    accuracy: 12,
    speed: 0,
    heading: 0,
    altitude: 216,
  });
  const [trackingActive, setTrackingActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const watchIdRef = useRef(null);

  useEffect(() => {
    http.get("/destinations").then((res) => {
      setDestinations(res.data || []);
    });

    // Start geolocation watch
    startTracking();

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation?.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const startTracking = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser");
      return;
    }
    setErrorMsg(null);
    setTrackingActive(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (p) => {
        setPos({
          lat: p.coords.latitude,
          lon: p.coords.longitude,
          accuracy: Math.round(p.coords.accuracy || 10),
          speed: p.coords.speed ? Math.round(p.coords.speed * 3.6) : 0,
          heading: Math.round(p.coords.heading || 0),
          altitude: Math.round(p.coords.altitude || 0),
        });
      },
      (err) => {
        console.warn("Geolocation warning:", err.message);
        // Fallback to Delhi default if denied/unavailable
        setErrorMsg("Live GPS permission unavailable. Showing reference landmark coordinates.");
        setTrackingActive(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation?.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setTrackingActive(false);
  };

  // Find nearest destinations
  const nearbyPlaces = destinations
    .map((d) => ({
      ...d,
      distanceKm: calculateDistanceKm(pos.lat, pos.lon, d.lat, d.lon),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 5);

  const markers = [
    {
      id: "my-live-pos",
      name: "Your Current Location",
      lat: pos.lat,
      lon: pos.lon,
      subtitle: `Accuracy: ±${pos.accuracy}m`,
    },
    ...nearbyPlaces.map((d, i) => ({
      id: d.id,
      name: d.name,
      lat: d.lat,
      lon: d.lon,
      index: i + 1,
      subtitle: `${d.distanceKm} km away · ${d.state}`,
    })),
  ];

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="label-eyebrow flex items-center gap-1.5">
          <NavigationArrow size={14} className="text-primary" /> Real-Time Telemetry
        </div>
        <h1 className="font-serif text-3xl md:text-5xl font-normal mt-1 mb-2">
          Live GPS Location Tracker
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Meter-level real-time satellite tracking with device speed, altitude, and proximity to India's foremost heritage monuments.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl glass border border-amber-500/30 bg-amber-500/10 text-amber-200 text-xs flex items-center gap-2">
          <WarningCircle size={16} />
          {errorMsg}
        </div>
      )}

      {/* Telemetry Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-strong rounded-3xl p-5 border border-white/10">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span>Coordinates</span>
            <Crosshair size={16} className="text-primary" />
          </div>
          <div className="font-mono text-sm text-white font-semibold">
            {pos.lat.toFixed(4)}° N, {pos.lon.toFixed(4)}° E
          </div>
          <span className="text-[11px] text-muted-foreground">Accuracy: ±{pos.accuracy} m</span>
        </div>

        <div className="glass-strong rounded-3xl p-5 border border-white/10">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span>Current Speed</span>
            <Gauge size={16} className="text-secondary" />
          </div>
          <div className="font-serif text-3xl text-white">
            {pos.speed} <span className="text-sm font-sans text-muted-foreground">km/h</span>
          </div>
          <span className="text-[11px] text-muted-foreground">Real-time GPS ground speed</span>
        </div>

        <div className="glass-strong rounded-3xl p-5 border border-white/10">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span>Elevation</span>
            <MapPin size={16} className="text-amber-400" />
          </div>
          <div className="font-serif text-3xl text-white">
            {pos.altitude} <span className="text-sm font-sans text-muted-foreground">m MSL</span>
          </div>
          <span className="text-[11px] text-muted-foreground">Height above sea level</span>
        </div>

        <div className="glass-strong rounded-3xl p-5 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span>Status</span>
            <div className={`w-2.5 h-2.5 rounded-full ${trackingActive ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
          </div>
          <Button
            size="sm"
            variant={trackingActive ? "outline" : "default"}
            onClick={trackingActive ? stopTracking : startTracking}
            className="rounded-xl mt-2 text-xs"
          >
            {trackingActive ? "Pause GPS" : "Resume GPS"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Map View */}
        <div className="lg:col-span-8">
          <div className="glass rounded-3xl p-4 border border-white/10">
            <MapView
              center={[pos.lat, pos.lon]}
              zoom={11}
              markers={markers}
              height="560px"
            />
          </div>
        </div>

        {/* Nearest Tourist Landmarks */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-strong rounded-3xl p-6 border border-white/10">
            <h3 className="font-serif text-xl mb-1">Nearest Attractions</h3>
            <p className="text-xs text-muted-foreground mb-4">Calculated from your live position</p>

            <div className="space-y-3">
              {nearbyPlaces.map((d, idx) => (
                <div
                  key={d.id}
                  className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/40 transition-all flex items-center justify-between"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <h4 className="font-medium text-sm text-white truncate">{d.name}</h4>
                    <p className="text-xs text-muted-foreground">{d.state} · {d.type}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-primary font-mono">{d.distanceKm} km</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <AskAI
                prompt={`I am currently at coordinates ${pos.lat}, ${pos.lon}. What are the best hidden gems, cafes and things to do around me right now?`}
                label="Explore Surroundings with AI"
                size="default"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tracking;
