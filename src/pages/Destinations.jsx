import { useEffect, useMemo, useState } from "react";
import { http } from "../lib/api";
import { DestCard } from "./Home";
import { placesService } from "../services/placesService";
import { MagnifyingGlass, Funnel, Sparkle } from "@phosphor-icons/react";
import { Input } from "../components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";

const CATEGORY_PILLS = [
  { id: "all", label: "All Categories" },
  { id: "spiritual", label: "Spiritual & Temples" },
  { id: "historical", label: "Forts & Heritage" },
  { id: "scenic", label: "Hill Stations & Scenic" },
  { id: "nature", label: "Beaches & Coastal" },
  { id: "wildlife", label: "Wildlife & Safaris" },
  { id: "adventure", label: "Adventure & Treks" },
];

const Destinations = () => {
  // Initialize with authoritative placesService immediately for zero-lag initial load
  const [all, setAll] = useState(() => placesService.getAllPlaces());
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [state, setState] = useState("all");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("rating");
  const [visibleCount, setVisibleCount] = useState(36);

  // Debounce search query to prevent lag on fast keystrokes
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQ(q);
    }, 200);
    return () => clearTimeout(handler);
  }, [q]);

  // Hydrate from API in background if needed
  useEffect(() => {
    http.get("/destinations")
      .then((r) => {
        if (Array.isArray(r.data) && r.data.length > 0) {
          setAll(r.data);
        }
      })
      .catch(() => {
        // placesService fallback is already loaded
      });
  }, []);

  const states = useMemo(() => Array.from(new Set(all.map((d) => d.state))).sort(), [all]);
  const types = useMemo(() => Array.from(new Set(all.map((d) => d.type))).sort(), [all]);

  useEffect(() => {
    setVisibleCount(36);
  }, [debouncedQ, state, type, sort]);

  const filtered = useMemo(() => {
    const searchLower = debouncedQ.trim().toLowerCase();

    let list = all.filter((d) => {
      const okQ =
        !searchLower ||
        d.name.toLowerCase().includes(searchLower) ||
        d.state.toLowerCase().includes(searchLower) ||
        (d.category && d.category.toLowerCase().includes(searchLower)) ||
        (d.tags && d.tags.some((t) => t.toLowerCase().includes(searchLower))) ||
        (d.tag && d.tag.toLowerCase().includes(searchLower));

      const okS = state === "all" || d.state.toLowerCase() === state.toLowerCase();
      const okT = type === "all" || d.type === type;
      return okQ && okS && okT;
    });

    list.sort((a, b) => {
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "budget_low") return a.budget - b.budget;
      if (sort === "budget_high") return b.budget - a.budget;
      return a.name.localeCompare(b.name);
    });

    return list;
  }, [all, debouncedQ, state, type, sort]);

  const displayed = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);

  return (
    <div className="pt-28 pb-24 md:pb-16 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <div className="label-eyebrow flex items-center gap-1.5">
            <Sparkle size={14} className="text-primary" /> Authoritative Directory · 36 States & UTs
          </div>
          <h1 className="font-serif text-5xl mt-2">Discover India</h1>
        </div>
        <div className="text-sm text-muted-foreground font-medium" data-testid="dest-count">
          Showing {displayed.length} of {filtered.length} places
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
        {CATEGORY_PILLS.map((pill) => {
          const isActive = type === pill.id;
          return (
            <button
              key={pill.id}
              onClick={() => setType(pill.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                  : "bg-white/5 border-white/10 text-muted-foreground hover:text-white hover:bg-white/10"
              }`}
            >
              {pill.label}
            </button>
          );
        })}
      </div>

      {/* Search & Select Filters */}
      <div className="grid md:grid-cols-4 gap-3 mb-8 p-4 glass-strong rounded-3xl">
        <div className="relative">
          <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            data-testid="search-input"
            className="pl-9 h-11 bg-white/5 border-white/10"
            placeholder="Search 1,942 places or state..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <Select value={state} onValueChange={setState}>
          <SelectTrigger data-testid="state-filter" className="h-11 bg-white/5 border-white/10">
            <SelectValue placeholder="State" />
          </SelectTrigger>
          <SelectContent className="max-h-80">
            <SelectItem value="all">All 36 States & UTs</SelectItem>
            {states.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger data-testid="type-filter" className="h-11 bg-white/5 border-white/10">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {types.map((t) => (
              <SelectItem key={t} value={t} className="capitalize">
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger data-testid="sort-filter" className="h-11 bg-white/5 border-white/10">
            <Funnel size={16} className="mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Highest rated</SelectItem>
            <SelectItem value="budget_low">Budget: low → high</SelectItem>
            <SelectItem value="budget_high">Budget: high → low</SelectItem>
            <SelectItem value="name">A → Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid of Places */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {displayed.map((d, i) => (
          <div key={d.id} className="fade-up" style={{ animationDelay: `${Math.min(i, 16) * 30}ms` }}>
            <DestCard d={d} testid={`dest-${d.id}`} />
          </div>
        ))}
      </div>

      {/* Pagination Loaders */}
      {visibleCount < filtered.length && (
        <div className="mt-12 text-center flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setVisibleCount((prev) => Math.min(prev + 48, filtered.length))}
            className="px-8 py-3.5 rounded-full btn-3d bg-primary text-primary-foreground font-semibold shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all"
          >
            Load more places ({filtered.length - visibleCount} remaining)
          </button>
          <button
            onClick={() => setVisibleCount(filtered.length)}
            className="px-6 py-3.5 rounded-full bg-white/10 border border-white/20 text-white font-medium hover:bg-white/15 transition-all"
          >
            Show all {filtered.length} places
          </button>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          No destinations match your filters. Try searching by state or broader keyword.
        </div>
      )}
    </div>
  );
};

export default Destinations;
