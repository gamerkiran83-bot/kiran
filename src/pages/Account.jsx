import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  User,
  Envelope,
  Phone,
  SignOut,
  Sparkle,
  Suitcase,
  CheckCircle,
} from "@phosphor-icons/react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";

const Account = () => {
  const { user, logout, updateUser, login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "Kiran Sharma");
  const [phone, setPhone] = useState(user?.phone || "+91 98765 43210");
  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    updateUser({ name, phone });
    setTimeout(() => {
      setSaving(false);
      toast.success("Profile details updated");
    }, 400);
  };

  const handleLogout = () => {
    logout();
    toast.info("Logged out successfully");
    navigate("/");
  };

  const handleSwitchDemo = async (email) => {
    try {
      await login(email, "exploro123");
      setName(email.split("@")[0]);
      toast.success(`Switched account to ${email}`);
    } catch {
      toast.error("Could not switch account");
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 md:px-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="label-eyebrow flex items-center gap-1.5">
          <User size={14} className="text-primary" /> Explorer Profile
        </div>
        <h1 className="font-serif text-3xl md:text-5xl font-normal mt-1 mb-2">
          My Account
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your travel profile, communication preferences, and security.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Side: Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass-strong rounded-3xl p-6 border border-white/10 text-center space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl font-bold text-primary-foreground mx-auto shadow-xl shadow-primary/20">
              {user?.name ? user.name[0].toUpperCase() : "E"}
            </div>
            <div>
              <h3 className="font-serif text-2xl text-white">{user?.name || "Explorer"}</h3>
              <p className="text-xs text-muted-foreground">{user?.email || "explorer@exploro.in"}</p>
            </div>
            <div className="pt-2 border-t border-white/10">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full rounded-full glass border-destructive/30 text-destructive hover:bg-destructive/10 text-xs"
              >
                <SignOut size={16} className="mr-1.5" /> Sign Out
              </Button>
            </div>
          </div>

          {/* Quick Demo Switcher */}
          <div className="glass rounded-3xl p-5 border border-white/10 space-y-3">
            <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Sparkle size={14} className="text-secondary" /> Switch Demo Account
            </div>
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSwitchDemo("kiran@exploro.in")}
                className="w-full justify-start text-xs rounded-xl hover:bg-white/10 text-slate-200"
              >
                Kiran Sharma (Trip Host)
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSwitchDemo("maya@exploro.in")}
                className="w-full justify-start text-xs rounded-xl hover:bg-white/10 text-slate-200"
              >
                Maya Roy (Travel Companion)
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side: Editable Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-strong rounded-3xl p-6 md:p-8 border border-white/10">
            <h3 className="font-serif text-2xl mb-6">Personal Details</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Full Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 bg-white/5 border-white/10 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Email (Cannot change)</label>
                <Input
                  value={user?.email || "kiran@exploro.in"}
                  disabled
                  className="h-11 bg-white/5 border-white/10 rounded-xl opacity-60 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Mobile Number</label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-11 bg-white/5 border-white/10 rounded-xl"
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl btn-3d bg-primary text-primary-foreground font-semibold px-6"
                >
                  {saving ? "Saving…" : "Update Profile"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
