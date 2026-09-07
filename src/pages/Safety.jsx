import React, { useState } from "react";
import {
  ShieldCheck,
  PhoneCall,
  FirstAid,
  WarningCircle,
  Sparkle,
  LockKey,
  Users,
  Drop,
} from "@phosphor-icons/react";
import { Button } from "../components/ui/button";
import AskAI from "../components/AskAI";

const HOTLINES = [
  { name: "National Emergency Number", number: "112", desc: "All-in-one unified police, fire & medical support across India" },
  { name: "Ministry of Tourism Tourist Helpline", number: "1363", desc: "24x7 toll-free multilingual support (Hindi, English, French, Spanish, German, Japanese, Chinese)" },
  { name: "Police Emergency", number: "100", desc: "Direct rapid response police assistance" },
  { name: "Medical & Ambulance", number: "108", desc: "Emergency ambulance & paramedics service" },
  { name: "Women Safety Helpline", number: "1091", desc: "24x7 dedicated emergency helpline for women" },
  { name: "Railway Passenger Helpline", number: "139", desc: "Real-time security, medical & coach assistance on Indian Railways" },
];

const Safety = () => {
  return (
    <div className="min-h-screen pb-24 pt-6 px-4 md:px-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="label-eyebrow flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-emerald-400" /> Travel Intelligence & Advisory
        </div>
        <h1 className="font-serif text-3xl md:text-5xl font-normal mt-1 mb-2">
          India Travel Safety Guide
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Verified emergency hotlines, female traveler security advisories, health precautions, and scam awareness for smooth travels.
        </p>
      </div>

      {/* Emergency Hotlines */}
      <div className="mb-10">
        <h2 className="font-serif text-2xl mb-4 flex items-center gap-2">
          <PhoneCall size={20} className="text-emerald-400" /> 24x7 Emergency Numbers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {HOTLINES.map((h) => (
            <div
              key={h.number}
              className="glass rounded-3xl p-5 border border-white/10 hover:border-emerald-500/40 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-semibold uppercase">{h.name}</span>
                <span className="px-3 py-1 rounded-full text-base font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {h.number}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Advisory Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="glass rounded-3xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/20 text-primary flex items-center justify-center">
              <Users size={22} weight="duotone" />
            </div>
            <div>
              <h3 className="font-serif text-xl">Solo & Female Travelers</h3>
              <p className="text-xs text-muted-foreground">Practical tips for comfortable journeys</p>
            </div>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300 list-disc list-inside">
            <li>Book verified ride-hailing services (Uber, Ola, BluSmart) or prepaid airport/railway taxi booths.</li>
            <li>In metros (Delhi, Mumbai, Bengaluru), utilize designated women's coaches during peak hours.</li>
            <li>Dress conservatively when entering spiritual places of worship (cover knees & shoulders).</li>
            <li>Keep hotel emergency contact cards with full vernacular address in your phone and purse.</li>
          </ul>
        </div>

        <div className="glass rounded-3xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-secondary/20 text-secondary flex items-center justify-center">
              <Drop size={22} weight="duotone" />
            </div>
            <div>
              <h3 className="font-serif text-xl">Water & Food Hygiene</h3>
              <p className="text-xs text-muted-foreground">Eat safely and relish Indian flavors</p>
            </div>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300 list-disc list-inside">
            <li>Always drink packaged sealed mineral water (Bisleri, Kinley, Aquafina) or verified RO-filtered water.</li>
            <li>Enjoy street food from bustling stalls with high turnover where food is prepared piping hot in front of you.</li>
            <li>Carry basic oral rehydration salts (ORS), activated charcoal, and electrolyte sachets in your day bag.</li>
            <li>Acclimatize for 24-48 hours when arriving in high-altitude zones like Ladakh or Spiti Valley.</li>
          </ul>
        </div>
      </div>

      {/* Ask Safety AI */}
      <div className="glass-strong rounded-3xl p-8 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <div className="label-eyebrow text-primary">Live Advisory Bot</div>
          <h3 className="font-serif text-2xl md:text-3xl">Have specific safety questions for your itinerary?</h3>
          <p className="text-xs text-muted-foreground">
            Our AI can review specific neighborhood safety, nocturnal travel options, train coach etiquette, and local scam prevention.
          </p>
        </div>
        <AskAI
          prompt="Provide detailed safety advice for traveling in India, including safe night transport apps, dress etiquette for temples, and medical precautions."
          label="Ask TripPilot Safety Agent"
          size="default"
        />
      </div>
    </div>
  );
};

export default Safety;
