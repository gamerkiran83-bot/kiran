import { useEffect, useState } from "react";
import { http } from "../lib/api";
import { Buildings, MapPin, ArrowUpRight, Star } from "@phosphor-icons/react";

const HotelsCard = ({ lat, lon }) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    let alive = true; setData(null);
    http.get(`/hotels?lat=${lat}&lon=${lon}`).then((r) => { if (alive) setData(r.data); }).catch(() => { if (alive) setData({ hotels: [] }); });
    return () => { alive = false; };
  }, [lat, lon]);

  if (data === null) return <div className="glass rounded-3xl p-6 animate-pulse h-48" data-testid="hotels-loading">AI is finding nearby stays…</div>;
  const hotels = data.hotels || [];

  return (
    <div className="glass rounded-3xl p-6" data-testid="hotels-card">
      <div className="flex items-center gap-3 mb-4">
        <Buildings size={26} weight="duotone" className="text-primary float-y" />
        <div>
          <div className="label-eyebrow">Nearby stays · AI</div>
          <div className="font-serif text-2xl">Hotels around {data.context || "you"}</div>
        </div>
      </div>
      {hotels.length === 0 && <p className="text-muted-foreground text-sm">No hotels found.</p>}
      <div className="space-y-2 max-h-96 overflow-y-auto pr-1 no-scrollbar">
        {hotels.map((h) => (
          <a key={h.id} href={`https://www.google.com/search?q=${encodeURIComponent(h.name + " " + (h.area || ""))}`} target="_blank" rel="noreferrer"
            data-testid={`hotel-${h.id}`}
            className="block p-3 rounded-2xl border border-white/5 hover:border-primary/30 hover:bg-white/5 transition-colors group">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-sm flex items-center gap-1 truncate">{h.name}<ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" /></div>
                <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-xs text-muted-foreground">
                  <span className="capitalize">{h.type}</span>
                  {h.stars && <span className="flex items-center gap-0.5"><Star size={11} weight="fill" className="text-amber-400" />{h.stars}</span>}
                  {h.area && <span className="flex items-center gap-1"><MapPin size={11} />{h.area}</span>}
                  {h.distance_km !== undefined && <span>· {h.distance_km} km</span>}
                </div>
                {h.highlight && <div className="mt-1 text-xs text-primary/80 italic">{h.highlight}</div>}
              </div>
              {h.price_inr && <div className="text-right shrink-0"><div className="font-serif text-lg">₹{h.price_inr}</div><div className="text-[10px] text-muted-foreground">/night</div></div>}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default HotelsCard;
