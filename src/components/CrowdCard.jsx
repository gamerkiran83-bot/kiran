import { useEffect, useState } from "react";
import { http } from "../lib/api";
import { UsersFour, Clock, Lightbulb } from "@phosphor-icons/react";

const levelStyle = {
  low: { bar: "from-emerald-500 to-emerald-400", text: "text-emerald-300", chip: "bg-emerald-500/10 border-emerald-500/30", label: "Low crowd", width: "22%" },
  moderate: { bar: "from-amber-500 to-amber-400", text: "text-amber-300", chip: "bg-amber-500/10 border-amber-500/30", label: "Moderate", width: "55%" },
  high: { bar: "from-orange-500 to-orange-400", text: "text-orange-300", chip: "bg-orange-500/10 border-orange-500/30", label: "High crowd", width: "82%" },
  very_high: { bar: "from-red-500 to-rose-500", text: "text-red-300", chip: "bg-red-500/10 border-red-500/30", label: "Very high", width: "97%" },
};

const CrowdCard = ({ destId }) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    let alive = true; setData(null);
    http.get(`/crowd/${destId}`).then((r) => { if (alive) setData(r.data); }).catch(() => { if (alive) setData({ error: true }); });
    return () => { alive = false; };
  }, [destId]);

  if (!data) return <div className="glass rounded-3xl p-6 animate-pulse h-48" data-testid="crowd-loading">AI is checking live crowd…</div>;
  if (data.error) return <div className="glass rounded-3xl p-6" data-testid="crowd-error">Crowd data unavailable</div>;
  const s = levelStyle[data.level] || levelStyle.moderate;

  return (
    <div className="glass rounded-3xl p-6" data-testid="crowd-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="label-eyebrow">Live crowd · AI</div>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${s.chip} ${s.text}`}>{s.label}</div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground"><Clock size={14} /> ~{data.wait_minutes} min</div>
          </div>
        </div>
        <UsersFour size={36} weight="duotone" className="text-primary/70 float-y" />
      </div>
      <div className="mt-4 h-2 rounded-full bg-white/5 overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${s.bar} rounded-full transition-all duration-700`} style={{ width: s.width }} />
      </div>
      <p className="mt-4 text-sm">{data.summary}</p>
      <div className="mt-3 flex items-start gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
        <Lightbulb size={18} weight="duotone" className="text-secondary shrink-0 mt-0.5" />
        <div className="text-sm">{data.tip}</div>
      </div>
      {data.factors && (
        <div className="mt-3 flex flex-wrap gap-2">
          {data.factors.map((f, i) => <span key={i} className="text-xs px-2 py-1 rounded-full bg-white/5 text-foreground/70 border border-white/10">{f}</span>)}
        </div>
      )}
    </div>
  );
};

export default CrowdCard;
