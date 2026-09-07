import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { http } from "../lib/api";
import { ArrowRight, MagnifyingGlass, MapTrifold, Sparkle, Path, NavigationArrow, ThermometerSimple, UsersFour, Heart, CalendarBlank, UsersThree, Microphone, Stop, Translate, CloudSun } from "@phosphor-icons/react";
import { Button } from "../components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import { Input } from "../components/ui/input";
import WishlistButton from "../components/WishlistButton";
import WeatherCard from "../components/WeatherCard";
import { toast } from "sonner";

const features = [
  { icon: Sparkle, title: "TripPilot AI", desc: "12 agents plan & replan your trip.", to: "/ai" },
  { icon: ThermometerSimple, title: "Live weather", desc: "Real-time forecasts + alerts.", to: "/weather" },
  { icon: UsersFour, title: "AI crowd intel", desc: "Wait time estimates by Claude.", to: "/destinations" },
  { icon: MapTrifold, title: "Nearby stays", desc: "AI-picked hotels around you.", to: "/destinations" },
  { icon: Path, title: "Shortest routes", desc: "Optimize multi-city journeys.", to: "/routes" },
  { icon: NavigationArrow, title: "GPS tracking", desc: "Meter-level accurate on-device.", to: "/tracking" },
];

const Home = () => {
  const [pop, setPop] = useState([]);
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [when, setWhen] = useState("");
  const [people, setPeople] = useState(2);
  const [all, setAll] = useState([]);
  const [weatherCity, setWeatherCity] = useState("Jaipur");
  const [listening, setListening] = useState(false);
  const recogRef = useRef(null);
  const navigate = useNavigate();

  const hasMic = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => { http.get("/destinations").then((r) => { setAll(r.data); setPop(r.data.slice(0, 8)); }); }, []);

  const voiceSearch = () => {
    if (!hasMic) { toast.error("Voice input isn't supported here"); navigate("/translator"); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SR();
    r.lang = "en-IN"; r.interimResults = false; r.maxAlternatives = 1; r.continuous = false;
    r.onstart = () => setListening(true);
    r.onend = () => setListening(false);
    r.onerror = (e) => { setListening(false); if (e.error !== "aborted") toast.error(`Mic error: ${e.error}`); };
    r.onresult = (e) => {
      const spoken = Array.from(e.results).map((res) => res[0].transcript).join(" ").trim().toLowerCase();
      if (!spoken) return;
      const match = all.find((d) => spoken.includes(d.name.toLowerCase()) || spoken.includes(d.state.toLowerCase()));
      if (match) {
        setToId(match.id);
        toast.success(`Heard "${match.name}"`);
        navigate(`/destinations/${match.id}`);
      } else {
        toast.info(`Heard "${spoken}" — opening translator`);
        navigate(`/translator?q=${encodeURIComponent(spoken)}`);
      }
    };
    recogRef.current = r;
    try { r.start(); } catch { setListening(false); toast.error("Could not access mic"); }
  };
  const stopVoice = () => { try { recogRef.current?.stop(); } catch {} setListening(false); };

  const smartSearch = () => {
    if (fromId && toId) navigate(`/explore?from=${fromId}&to=${toId}`);
    else if (toId) navigate(`/destinations/${toId}`);
    else navigate("/planner");
  };

  return (
    <div className="pt-24 pb-24 md:pb-16">
      {/* Hero */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 md:pt-20">
          <div className="fade-up text-center max-w-4xl mx-auto">
            <span className="inline-block label-eyebrow px-3.5 py-1 rounded-full glass mb-6 shadow-md text-white font-semibold">Next-gen Indian trip planner</span>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl leading-[0.95] tracking-tight text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.7)]">
              Explore India.<br />
              <span className="italic text-primary drop-shadow-[0_3px_12px_rgba(0,0,0,0.6)]">Create your journey.</span>
            </h1>
            <p className="mt-6 text-lg text-white max-w-2xl mx-auto font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
              Discover amazing destinations, plan your route, find places to visit, and build your perfect trip — all in one live experience.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/ai"><Button data-testid="hero-ai-btn" size="lg" className="rounded-full h-12 px-6 btn-3d bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold shadow-xl"><Sparkle size={18} weight="fill" className="mr-2" />Ask TripPilot AI</Button></Link>
              <Link to="/planner"><Button data-testid="hero-plan-btn" size="lg" className="rounded-full h-12 px-6 btn-3d bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-xl">Plan my trip <ArrowRight size={18} className="ml-2" /></Button></Link>
              <Link to="/explore"><Button data-testid="hero-explore-btn" size="lg" variant="outline" className="rounded-full h-12 px-6 bg-black/30 border-white/25 hover:bg-black/40 text-white font-medium shadow-lg backdrop-blur-md">Explore destinations</Button></Link>
              <Button data-testid="hero-mic-btn" size="lg" onClick={listening ? stopVoice : voiceSearch}
                className={`rounded-full h-12 w-12 p-0 btn-3d shadow-xl ${listening ? "bg-red-500 hover:bg-red-500/90 text-white animate-pulse" : "bg-secondary/90 hover:bg-secondary text-secondary-foreground"}`}
                title="Voice search a destination">
                {listening ? <Stop size={22} weight="fill" /> : <Microphone size={22} weight="fill" />}
              </Button>
              <Link to="/translator"><Button data-testid="hero-translator-btn" size="lg" variant="outline" className="rounded-full h-12 px-5 bg-black/30 border-white/25 hover:bg-black/40 text-white font-medium shadow-lg backdrop-blur-md"><Translate size={16} className="mr-1" />Voice translator</Button></Link>
            </div>
          </div>

          {/* Compact smart search */}
          <div className="mt-14 fade-up" style={{ animationDelay: "180ms" }}>
            <div className="glass-strong rounded-[28px] p-4 md:p-3 max-w-5xl mx-auto bg-slate-950/85 border border-white/25 shadow-2xl backdrop-blur-xl">
              <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1.2fr_1fr_0.9fr_auto] gap-2">
                <SearchField label="From">
                  <Select value={fromId} onValueChange={setFromId}>
                    <SelectTrigger data-testid="home-from" className="h-12 bg-transparent border-0 focus:ring-0 text-white font-semibold placeholder:text-white/70"><SelectValue placeholder="Start city" /></SelectTrigger>
                    <SelectContent>{all.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                  </Select>
                </SearchField>
                <SearchField label="To">
                  <Select value={toId} onValueChange={setToId}>
                    <SelectTrigger data-testid="home-to" className="h-12 bg-transparent border-0 focus:ring-0 text-white font-semibold placeholder:text-white/70"><SelectValue placeholder="Destination" /></SelectTrigger>
                    <SelectContent>{all.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                  </Select>
                </SearchField>
                <SearchField label="Dates" icon={CalendarBlank}>
                  <Input data-testid="home-date" type="date" value={when} onChange={(e) => setWhen(e.target.value)} className="h-12 bg-transparent border-0 focus:ring-0 text-white font-semibold" />
                </SearchField>
                <SearchField label="People" icon={UsersThree}>
                  <Input data-testid="home-people" type="number" min={1} max={30} value={people} onChange={(e) => setPeople(+e.target.value)} className="h-12 bg-transparent border-0 focus:ring-0 text-white font-semibold" />
                </SearchField>
                <Button data-testid="home-search-btn" size="lg" onClick={smartSearch} className="h-12 md:h-full rounded-2xl btn-3d bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold shadow-lg shadow-primary/30">
                  <MagnifyingGlass size={18} weight="bold" className="mr-1" /> Plan trip
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {features.map((f, i) => (
            <Link
              key={i}
              to={f.to}
              className="fade-up glass rounded-2xl p-4 glass-hover block transition-all"
              style={{ animationDelay: `${i * 60}ms` }}
              data-testid={`feature-${f.title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <f.icon size={26} weight="duotone" className="text-sky-400" />
              <div className="mt-3 font-bold text-sm text-white">{f.title}</div>
              <p className="text-xs text-white/80 mt-1 leading-relaxed font-medium">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Live Indian City Weather & 5-Day Forecast Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-20" data-testid="home-weather-section">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <div className="label-eyebrow flex items-center gap-1.5 text-sky-400 font-bold">
              <CloudSun size={17} weight="duotone" />
              <span>Real-Time Meteorology</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl mt-1 text-white font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Live Indian City Weather
            </h2>
            <p className="text-sm text-white/90 mt-1 font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              Check current conditions and 5-day forecasts across India before planning daily travel.
            </p>
          </div>
          <Link
            to={`/weather?city=${encodeURIComponent(weatherCity)}`}
            data-testid="home-weather-see-more"
            className="text-sky-300 hover:text-sky-200 font-bold text-sm inline-flex items-center gap-1.5 transition-colors drop-shadow-sm"
          >
            Search all Indian cities & forecasts <ArrowRight size={14} weight="bold" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Quick city selector buttons */}
          <div className="lg:col-span-4 glass-strong rounded-3xl p-5 border border-white/20 space-y-4 shadow-2xl">
            <div className="font-bold text-sm text-white">Select or search an Indian city</div>
            <div className="flex flex-wrap gap-2">
              {["Jaipur", "Delhi", "Bengaluru", "Mumbai", "Goa", "Varanasi", "Manali", "Kochi", "Srinagar", "Hyderabad"].map((c) => (
                <button
                  key={c}
                  onClick={() => setWeatherCity(c)}
                  className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                    weatherCity.toLowerCase() === c.toLowerCase()
                      ? "bg-primary text-primary-foreground border-primary font-bold shadow-md shadow-primary/30"
                      : "bg-white/15 border-white/25 hover:bg-white/25 text-white font-medium shadow-sm hover:border-white/40"
                  }`}
                  data-testid={`home-weather-chip-${c.toLowerCase()}`}
                >
                  {c}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const q = e.target.elements.citySearch?.value?.trim();
                if (q) navigate(`/weather?city=${encodeURIComponent(q)}`);
              }}
              className="pt-3 border-t border-white/15 flex gap-2"
            >
              <Input
                name="citySearch"
                placeholder="Search any Indian city..."
                className="bg-black/50 border-white/25 text-white placeholder:text-white/60 rounded-xl text-sm h-10 focus:border-primary font-medium"
              />
              <Button type="submit" size="sm" className="rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 h-10 px-4 shadow-md">
                <MagnifyingGlass size={16} weight="bold" />
              </Button>
            </form>
          </div>

          {/* Live Weather Card Display */}
          <div className="lg:col-span-8">
            <WeatherCard city={weatherCity} />
          </div>
        </div>
      </section>

      {/* Popular destinations - horizontal 3D scroll */}
      <section className="mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-end justify-between mb-6">
          <div>
            <div className="label-eyebrow">Popular right now</div>
            <h2 className="font-serif text-4xl mt-2">Where India is heading</h2>
          </div>
          <Link to="/destinations" data-testid="see-all-btn" className="text-primary font-medium underline underline-offset-4 hidden sm:inline">See all →</Link>
        </div>
        <div className="overflow-x-auto no-scrollbar h-scroll pb-4 px-4 sm:px-6" data-testid="popular-scroll">
          <div className="flex gap-5 min-w-max">
            {pop.map((d, i) => (
              <div key={d.id} className="w-[280px] sm:w-[320px] fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                <DestCard d={d} testid={`popular-${d.id}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-24">
        <div className="glass-strong rounded-[32px] p-8 md:p-12 text-center relative overflow-hidden bg-slate-950/85 border border-white/20 shadow-2xl">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-primary/40 to-secondary/40 blur-3xl" />
          <div className="relative">
            <h3 className="font-serif text-3xl md:text-5xl text-white font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Your next journey starts here.
            </h3>
            <p className="mt-3 text-white/90 max-w-xl mx-auto font-medium drop-shadow-sm">
              Create a free account to save destinations, plan trips, and track everything from one dashboard.
            </p>
            <Link to="/register">
              <Button data-testid="cta-signup" size="lg" className="mt-6 rounded-full btn-3d bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-xl shadow-primary/30">
                Create free account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const SearchField = ({ label, icon: Icon, children }) => (
  <div className="bg-slate-900/90 rounded-2xl px-4 pt-1.5 pb-1 border border-white/20 shadow-inner">
    <div className="text-[10px] font-bold tracking-[0.18em] uppercase text-sky-300 flex items-center gap-1">
      {Icon && <Icon size={12} className="text-sky-300" />}
      {label}
    </div>
    {children}
  </div>
);

export const DestCard = ({ d, testid }) => (
  <Link to={`/destinations/${d.id}`} data-testid={testid}
    className="tilt-card block glass rounded-3xl overflow-hidden group h-full">
    <div className="relative aspect-[4/5] overflow-hidden">
      <img src={d.image} alt={d.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute top-3 right-3"><WishlistButton destinationId={d.id} className="w-10 h-10 justify-center backdrop-blur-md" /></div>
      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-semibold">★ {d.rating}</div>
      <div className="absolute bottom-4 left-4 right-4 text-white tilt-inner">
        <div className="text-[11px] tracking-[0.2em] uppercase font-semibold opacity-80">{d.state}</div>
        <div className="font-serif text-2xl md:text-3xl mt-1">{d.name}</div>
        <div className="text-xs text-white/80 mt-1">₹{d.budget}/day · {d.tag}</div>
        <div className="mt-3 inline-flex items-center gap-1 text-sm font-medium">Explore <ArrowRight size={14} /></div>
      </div>
    </div>
  </Link>
);

export default Home;
