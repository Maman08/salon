"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  User,
  Lock,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";
import { updateProfile, changePassword, ApiError } from "@/lib/api";
import Reveal from "@/components/ui/Reveal";

export default function SettingsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Profile form
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/account");
      return;
    }
    if (user) {
      setFullName(user.full_name || "");
      setPhone(user.phone || "");
    }
  }, [user, isAuthenticated, authLoading, router]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);
    try {
      await updateProfile({ full_name: fullName, phone: phone || undefined });
      setProfileMsg({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to update profile";
      setProfileMsg({ type: "error", text: message });
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword.length < 6) {
      setPasswordMsg({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "New passwords do not match." });
      return;
    }

    setPasswordSaving(true);
    try {
      await changePassword({ current_password: currentPassword, new_password: newPassword });
      setPasswordMsg({ type: "success", text: "Password changed successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to change password";
      setPasswordMsg({ type: "error", text: message });
    } finally {
      setPasswordSaving(false);
    }
  };

  if (authLoading || (!isAuthenticated && !authLoading)) {
    return (
      <div className="min-h-screen pt-24 lg:pt-32 pb-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 py-8 border-b border-[var(--border)] mb-8">
          <button
            onClick={() => router.push("/account")}
            className="p-2 rounded-full hover:bg-[var(--glass)] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-[family-name:var(--font-playfair)] text-2xl lg:text-3xl">
              Account <span className="text-gradient-gold">Settings</span>
            </h1>
            <p className="text-xs text-[var(--fg-muted)] mt-1">Manage your profile and security</p>
          </div>
        </div>

        {/* ── Profile Section ──────────────────────────────────────────────── */}
        <Reveal>
          <form onSubmit={handleProfileSave} className="mb-8">
            <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
              <div className="flex items-center gap-2 mb-5">
                <User className="w-4 h-4 text-gold" />
                <h2 className="text-sm font-semibold tracking-wider uppercase text-[var(--fg-muted)]">Profile</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-[var(--fg-muted)] mb-1.5 tracking-wide">Email</label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full bg-[var(--bg-raised)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--fg-faint)] cursor-not-allowed"
                  />
                  <p className="text-xs text-[var(--fg-faint)] mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block text-xs text-[var(--fg-muted)] mb-1.5 tracking-wide">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full bg-[var(--bg-raised)] border border-[var(--border-mid)] rounded-lg px-3 py-2.5 text-sm text-[var(--fg)] outline-none focus:border-gold/40 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--fg-muted)] mb-1.5 tracking-wide">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full bg-[var(--bg-raised)] border border-[var(--border-mid)] rounded-lg px-3 py-2.5 text-sm text-[var(--fg)] placeholder-[var(--fg-faint)] outline-none focus:border-gold/40 transition-colors"
                  />
                </div>

                {profileMsg && (
                  <div
                    className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                      profileMsg.type === "success"
                        ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                        : "bg-rose/10 border border-rose/20 text-rose"
                    }`}
                  >
                    {profileMsg.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {profileMsg.text}
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={profileSaving}
                  whileHover={{ scale: profileSaving ? 1 : 1.01 }}
                  whileTap={{ scale: profileSaving ? 1 : 0.98 }}
                  className="w-full py-3 bg-gradient-to-r from-gold to-gold/80 text-[var(--btn-text)] font-semibold text-sm tracking-wider uppercase rounded-xl hover:shadow-lg hover:shadow-gold/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {profileSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </motion.button>
              </div>
            </div>
          </form>
        </Reveal>

        {/* ── Password Section ─────────────────────────────────────────────── */}
        <Reveal delay={0.1}>
          <form onSubmit={handlePasswordChange}>
            <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
              <div className="flex items-center gap-2 mb-5">
                <Lock className="w-4 h-4 text-gold" />
                <h2 className="text-sm font-semibold tracking-wider uppercase text-[var(--fg-muted)]">Change Password</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-[var(--fg-muted)] mb-1.5 tracking-wide">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full bg-[var(--bg-raised)] border border-[var(--border-mid)] rounded-lg px-3 py-2.5 text-sm text-[var(--fg)] outline-none focus:border-gold/40 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--fg-muted)] mb-1.5 tracking-wide">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-[var(--bg-raised)] border border-[var(--border-mid)] rounded-lg px-3 py-2.5 text-sm text-[var(--fg)] outline-none focus:border-gold/40 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--fg-muted)] mb-1.5 tracking-wide">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-[var(--bg-raised)] border border-[var(--border-mid)] rounded-lg px-3 py-2.5 text-sm text-[var(--fg)] outline-none focus:border-gold/40 transition-colors"
                  />
                </div>

                {passwordMsg && (
                  <div
                    className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                      passwordMsg.type === "success"
                        ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                        : "bg-rose/10 border border-rose/20 text-rose"
                    }`}
                  >
                    {passwordMsg.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {passwordMsg.text}
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={passwordSaving || !currentPassword || !newPassword || !confirmPassword}
                  whileHover={{ scale: passwordSaving ? 1 : 1.01 }}
                  whileTap={{ scale: passwordSaving ? 1 : 0.98 }}
                  className="w-full py-3 bg-[var(--glass)] border border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)] font-medium text-sm tracking-wider uppercase rounded-xl hover:border-[var(--border-mid)] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {passwordSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Change Password
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </form>
        </Reveal>
      </div>
    </div>
  );
}
