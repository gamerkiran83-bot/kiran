import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { Compass, SignIn, UserPlus, Sparkle } from "@phosphor-icons/react";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in both email and password");
      return;
    }
    setBusy(true);
    try {
      await login(email, password);
      toast.success("Welcome back to Exploro India!");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.detail || "Invalid email or password");
    } finally {
      setBusy(false);
    }
  };

  const handleDemoLogin = async () => {
    setBusy(true);
    try {
      await login("kiran@exploro.in", "exploro123");
      toast.success("Logged in as Demo Explorer (Kiran)");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error("Demo login error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-strong rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 text-primary-foreground shadow-lg shadow-primary/30">
            <Compass size={28} weight="duotone" />
          </div>
          <h1 className="font-serif text-3xl mb-2">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">Sign in to access your trips, wishlist & AI travel notes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Email address</label>
            <Input
              type="email"
              placeholder="kiran@exploro.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 bg-white/5 border-white/10 rounded-xl"
              required
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 bg-white/5 border-white/10 rounded-xl"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={busy}
            className="w-full h-11 rounded-xl btn-3d bg-primary text-primary-foreground font-semibold mt-2"
          >
            <SignIn size={18} className="mr-2" />
            {busy ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-4 pt-4 border-t border-white/10">
          <Button
            type="button"
            variant="outline"
            onClick={handleDemoLogin}
            disabled={busy}
            className="w-full h-11 rounded-xl bg-secondary/15 border-secondary/30 text-secondary hover:bg-secondary/25 font-medium"
          >
            <Sparkle size={18} weight="fill" className="mr-2" />
            Quick Demo Login (Kiran)
          </Button>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:underline font-semibold">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in name, email, and password");
      return;
    }
    setBusy(true);
    try {
      await register(name, email, password, phone);
      toast.success("Account created! Welcome to Exploro India");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Registration failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-strong rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center mx-auto mb-4 text-primary-foreground shadow-lg shadow-secondary/30">
            <UserPlus size={28} weight="duotone" />
          </div>
          <h1 className="font-serif text-3xl mb-2">Join Exploro India</h1>
          <p className="text-sm text-muted-foreground">Start your personalized Incredible India journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Full Name</label>
            <Input
              type="text"
              placeholder="Aarav Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 bg-white/5 border-white/10 rounded-xl"
              required
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Email address</label>
            <Input
              type="email"
              placeholder="aarav@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 bg-white/5 border-white/10 rounded-xl"
              required
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Phone (Optional)</label>
            <Input
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-11 bg-white/5 border-white/10 rounded-xl"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 bg-white/5 border-white/10 rounded-xl"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={busy}
            className="w-full h-11 rounded-xl btn-3d bg-primary text-primary-foreground font-semibold mt-2"
          >
            <UserPlus size={18} className="mr-2" />
            {busy ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline font-semibold">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
