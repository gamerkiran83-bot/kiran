import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { Compass, House, MapTrifold, Airplane, Heart, UserCircle, SignIn, SignOut, Gear, List, X, Bell, Sparkle, CaretDown, Path, Buildings, Translate, ShieldCheck, NavigationArrow, Suitcase, SquaresFour, CloudSun } from "@phosphor-icons/react";
import { Button } from "./ui/button";
import NotificationsBell from "./NotificationsBell";
import ModeToggle from "./ModeToggle";

const exploreLinks = [
  { to: "/destinations", label: "Destinations", icon: MapTrifold, desc: "26 hand-picked places" },
  { to: "/weather", label: "Weather forecast", icon: CloudSun, desc: "Live weather & 5-day forecasts" },
  { to: "/states", label: "By state", icon: Buildings, desc: "Browse region by region" },
  { to: "/explore", label: "Along the route", icon: Path, desc: "Stops between two cities" },
  { to: "/routes", label: "Compare transport", icon: Airplane, desc: "Train · bus · flight · drive" },
  { to: "/multi", label: "Multi-stop map", icon: NavigationArrow, desc: "Shortest visiting order" },
];
const moreLinks = [
  { to: "/translator", label: "Voice translator", icon: Translate },
  { to: "/safety", label: "Safety info", icon: ShieldCheck },
  { to: "/alerts", label: "Fare alerts", icon: Bell },
  { to: "/wishlist", label: "Wishlist", icon: Heart },
  { to: "/tracking", label: "Live tracking", icon: NavigationArrow },
  { to: "/dashboard", label: "Dashboard", icon: SquaresFour },
];
const explorePaths = exploreLinks.map((l) => l.to);
const morePaths = moreLinks.map((l) => l.to);
const bottomLinks = [
  { to: "/", label: "Home", icon: House },
  { to: "/destinations", label: "Destinations", icon: MapTrifold },
  { to: "/weather", label: "Weather", icon: CloudSun },
  { to: "/ai", label: "TripPilot AI", icon: Sparkle },
  { to: "/planner", label: "Plan", icon: Airplane },
];

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menu, setMenu] = useState(false);
  const [open, setOpen] = useState(null); // "explore" | "more"
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef();
  const navRef = useRef();

  useEffect(() => {
    const h = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenu(false);
      if (navRef.current && !navRef.current.contains(e.target)) setOpen(null);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  useEffect(() => { setMobileOpen(false); setOpen(null); }, [location.pathname]);

  const pill = (active) =>
    `px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 inline-flex items-center gap-1.5 ${
      active
        ? "text-primary-foreground bg-primary shadow-lg shadow-primary/40 font-bold"
        : "text-white/95 hover:text-white hover:bg-white/20 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
    }`;
  const isExplore = explorePaths.some((p) => location.pathname.startsWith(p));
  const isMore = morePaths.some((p) => location.pathname.startsWith(p));

  return (
    <>
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(96%,1200px)]">
        <div className="glass-strong bg-slate-950/90 backdrop-blur-2xl border border-white/25 rounded-full px-4 md:px-6 h-14 flex items-center justify-between gap-4 shadow-2xl">
          <Link to="/" data-testid="brand-link" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/40">
              <Compass size={20} weight="bold" />
            </div>
            <div className="font-serif text-xl leading-none tracking-tight text-white font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] hidden sm:block">
              Exploro <span className="italic text-primary">India</span>
            </div>
          </Link>

          <nav ref={navRef} className="hidden md:flex items-center gap-1 relative" aria-label="Primary">
            <NavLink to="/" end data-testid="nav-home" className={({ isActive }) => pill(isActive)}>Home</NavLink>
            <NavLink to="/destinations" data-testid="nav-destinations" className={({ isActive }) => pill(isActive)}>Destinations</NavLink>
            <NavLink to="/weather" data-testid="nav-weather" className={({ isActive }) => pill(isActive)}>
              <CloudSun size={16} weight="bold" className="text-sky-400" /> Weather & Alerts
            </NavLink>
            <NavLink to="/ai" data-testid="nav-ai" className={({ isActive }) => `${pill(isActive)} ${isActive ? "" : "!text-purple-300 hover:!text-white"}`}>
              <Sparkle size={16} weight="fill" className="text-purple-300" /> AI TripPilot
            </NavLink>
            <NavLink to="/planner" data-testid="nav-planner" className={({ isActive }) => pill(isActive)}>Plan Trip</NavLink>
            <button data-testid="nav-more" aria-haspopup="menu" aria-expanded={open === "more"} onClick={() => setOpen(open === "more" ? null : "more")} className={pill(isMore || open === "more")}>
              More <CaretDown size={12} className={`transition-transform ${open === "more" ? "rotate-180" : ""}`} />
            </button>

            {open === "explore" && (
              <div role="menu" data-testid="explore-menu" className="absolute left-16 top-12 w-[420px] glass-strong rounded-3xl p-3 grid grid-cols-2 gap-1 fade-up">
                {exploreLinks.map((l) => (
                  <Link key={l.to} to={l.to} role="menuitem" data-testid={`explore-${l.to.slice(1)}`} onClick={() => setOpen(null)} className="flex items-start gap-3 p-3 rounded-2xl hover:bg-white/5 transition-colors">
                    <l.icon size={20} weight="duotone" className="text-primary mt-0.5 shrink-0" />
                    <div><div className="text-sm font-semibold">{l.label}</div><div className="text-xs text-muted-foreground">{l.desc}</div></div>
                  </Link>
                ))}
              </div>
            )}
            {open === "more" && (
              <div role="menu" data-testid="more-menu" className="absolute right-0 top-12 w-60 glass-strong rounded-3xl p-2 fade-up">
                {moreLinks.map((l) => (
                  <Link key={l.to} to={l.to} role="menuitem" data-testid={`more-${l.to.slice(1)}`} onClick={() => setOpen(null)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm hover:bg-white/5 transition-colors">
                    <l.icon size={16} className="text-primary" /> {l.label}
                  </Link>
                ))}
                <div className="px-3 pt-3 pb-1 border-t border-white/10 mt-1 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Mode</span>
                  <ModeToggle compact />
                </div>
              </div>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden lg:block"><ModeToggle compact /></div>
            {user && <NotificationsBell />}
            {user ? (
              <div className="relative" ref={menuRef}>
                <button data-testid="profile-btn" onClick={() => setMenu((m) => !m)}
                  className="flex items-center gap-2 pl-1 pr-3 h-10 rounded-full glass-hover glass border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                    {user.name.slice(0, 1).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium" data-testid="user-name">{user.name.split(" ")[0]}</span>
                </button>
                {menu && (
                  <div className="absolute right-0 top-12 w-64 glass-strong rounded-2xl p-2 fade-up">
                    <div className="p-3 border-b border-white/10">
                      <div className="font-semibold text-sm">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                    <MenuItem to="/dashboard" icon={House} label="Dashboard" onClick={() => setMenu(false)} testid="menu-dashboard" />
                    <MenuItem to="/account" icon={UserCircle} label="My Account" onClick={() => setMenu(false)} testid="menu-account" />
                    <MenuItem to="/trips" icon={Airplane} label="My Trips" onClick={() => setMenu(false)} testid="menu-trips" />
                    <MenuItem to="/ai" icon={Sparkle} label="AI Travel" onClick={() => setMenu(false)} testid="menu-ai" />
                    <MenuItem to="/wishlist" icon={Heart} label="Wishlist" onClick={() => setMenu(false)} testid="menu-wishlist" />
                    <MenuItem to="/alerts" icon={Bell} label="Fare Alerts" onClick={() => setMenu(false)} testid="menu-alerts" />
                    <MenuItem to="/translator" icon={Translate} label="Translator" onClick={() => setMenu(false)} testid="menu-translator" />
                    <MenuItem to="/safety" icon={Gear} label="Safety Info" onClick={() => setMenu(false)} testid="menu-safety" />
                    <button data-testid="logout-btn" onClick={() => { logout(); setMenu(false); navigate("/"); }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-colors mt-1">
                      <SignOut size={16} /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button
                  data-testid="header-login-btn"
                  variant="ghost"
                  size="sm"
                  className="hidden sm:inline-flex text-white hover:text-white hover:bg-white/20 font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                  onClick={() => navigate("/login")}
                >
                  <SignIn size={16} className="mr-1" /> Log in
                </Button>
                <Button
                  data-testid="header-signup-btn"
                  size="sm"
                  className="rounded-full btn-3d bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-lg shadow-primary/30"
                  onClick={() => navigate("/register")}
                >
                  Get started
                </Button>
              </>
            )}
            <button
              className="md:hidden ml-1 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/20"
              onClick={() => setMobileOpen(true)}
              data-testid="mobile-menu-btn"
              aria-label="Open menu"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-md" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-3 top-3 bottom-3 w-[min(84vw,320px)] glass-strong rounded-3xl p-4 fade-up overflow-y-auto" data-testid="mobile-drawer">
            <div className="flex justify-between items-center"><ModeToggle compact /><button onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={22} /></button></div>
            <div className="space-y-1 mt-3">
              <DrawerLink to="/" label="Home" />
              <DrawerLink to="/planner" label="Plan Trip" />
              <DrawerLink to="/trips" label="My Trips" />
              <DrawerLink to="/ai" label="AI Travel" accent />
            </div>
            <DrawerGroup title="Explore" links={exploreLinks} />
            <DrawerGroup title="More" links={moreLinks} />
          </div>
        </div>
      )}

      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden pb-safe pt-2 px-3">
        <div className="glass-strong rounded-3xl px-2 py-2 flex items-center justify-around">
          {bottomLinks.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === "/"} data-testid={`bnav-${n.label.toLowerCase()}`}
              className={({ isActive }) => `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}>
              <n.icon size={20} weight={n.to === "/ai" ? "fill" : "regular"} />
              <span className="text-[10px] font-medium">{n.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

const DrawerLink = ({ to, label, accent }) => (
  <NavLink to={to} end={to === "/"} className={({ isActive }) => `block px-4 py-3 rounded-xl text-sm font-medium ${isActive ? "bg-primary text-primary-foreground" : accent ? "text-secondary hover:bg-white/5" : "text-foreground/80 hover:bg-white/5"}`}>{label}</NavLink>
);

const DrawerGroup = ({ title, links }) => (
  <div className="mt-4">
    <div className="label-eyebrow px-4 mb-1">{title}</div>
    {links.map((l) => (
      <NavLink key={l.to} to={l.to} className={({ isActive }) => `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm ${isActive ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-white/5"}`}>
        <l.icon size={16} /> {l.label}
      </NavLink>
    ))}
  </div>
);

const MenuItem = ({ to, icon: Icon, label, onClick, testid }) => (
  <Link to={to} onClick={onClick} data-testid={testid}
    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-white/5 transition-colors">
    <Icon size={16} /> {label}
  </Link>
);

export default Header;
