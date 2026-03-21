"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import { User, Package, Heart, Settings, LogIn, LogOut, UserPlus } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthProvider";

const menuItems = [
  { icon: Package, label: "My Orders", description: "Track and manage your orders", href: "/account/orders" },
  { icon: Heart, label: "Wishlist", description: "Your saved products", href: "/wishlist" },
  { icon: Settings, label: "Settings", description: "Account preferences", href: "/account/settings" },
];

export default function AccountPage() {
  const { user, isAuthenticated, isLoading, login, register, logout, error, clearError } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    clearError();
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register({ email, password, full_name: fullName, phone: phone || undefined });
      }
    } catch {
      // error is set in the auth context
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 lg:pt-32 pb-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  // Authenticated view
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen pt-24 lg:pt-32 pb-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <motion.div
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <User className="w-8 h-8 text-gold/60" />
              </motion.div>
              <h1 className="font-[family-name:var(--font-playfair)] text-3xl lg:text-4xl mb-2">
                Welcome, <span className="text-gradient-gold">{user.full_name}</span>
              </h1>
              <p className="text-[var(--fg-muted)] text-sm">{user.email}</p>
            </div>
          </Reveal>

          {/* Quick links */}
          <div className="space-y-3 mb-8">
            {menuItems.map((item, i) => (
              <Reveal key={item.label} delay={0.1 + i * 0.08}>
                <Link href={item.href}>
                  <motion.div
                    className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-mid)] transition-all duration-300 group"
                    whileHover={{ x: 4 }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <item.icon className="w-4 h-4 text-gold/60" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-[var(--fg-faint)]">{item.description}</p>
                    </div>
                  </motion.div>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* Logout */}
          <Reveal delay={0.4}>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={logout}
              className="w-full py-3.5 bg-[var(--bg-card)] border border-[var(--border)] hover:border-rose/30 text-[var(--fg-muted)] hover:text-rose font-medium text-sm tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </motion.button>
          </Reveal>
        </div>
      </div>
    );
  }

  // Unauthenticated view — login / register form
  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-24">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-12">
            <motion.div
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/5 border border-gold/10 flex items-center justify-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <User className="w-8 h-8 text-gold/40" />
            </motion.div>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl lg:text-4xl mb-2">
              {mode === "login" ? (
                <>My <span className="text-gradient-gold">Account</span></>
              ) : (
                <>Create <span className="text-gradient-gold">Account</span></>
              )}
            </h1>
            <p className="text-[var(--fg-muted)] text-sm">
              {mode === "login"
                ? "Sign in to manage your orders and preferences"
                : "Join Grenix for a personalized beauty experience"}
            </p>
          </div>
        </Reveal>

        {/* Tab toggle */}
        <Reveal delay={0.05}>
          <div className="flex rounded-xl bg-[var(--bg-raised)] p-1 mb-8 border border-[var(--border)]">
            <button
              onClick={() => { setMode("login"); clearError(); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium tracking-wider transition-all duration-300 ${
                mode === "login"
                  ? "bg-gold/20 text-gold"
                  : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode("register"); clearError(); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium tracking-wider transition-all duration-300 ${
                mode === "register"
                  ? "bg-gold/20 text-gold"
                  : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
              }`}
            >
              Register
            </button>
          </div>
        </Reveal>

        {/* Form */}
        <Reveal delay={0.1}>
          <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
            <div className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-rose/10 border border-rose/20 text-rose text-sm">
                  {error}
                </div>
              )}

              {mode === "register" && (
                <>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full name"
                    required
                    className="w-full bg-[var(--bg-raised)] border border-[var(--border-mid)] rounded-xl px-4 py-3 text-sm text-[var(--fg)] outline-none focus:border-gold/40 transition-colors placeholder:text-[var(--fg-faint)]"
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone (optional)"
                    className="w-full bg-[var(--bg-raised)] border border-[var(--border-mid)] rounded-xl px-4 py-3 text-sm text-[var(--fg)] outline-none focus:border-gold/40 transition-colors placeholder:text-[var(--fg-faint)]"
                  />
                </>
              )}

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="w-full bg-[var(--bg-raised)] border border-[var(--border-mid)] rounded-xl px-4 py-3 text-sm text-[var(--fg)] outline-none focus:border-gold/40 transition-colors placeholder:text-[var(--fg-faint)]"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                minLength={6}
                className="w-full bg-[var(--bg-raised)] border border-[var(--border-mid)] rounded-xl px-4 py-3 text-sm text-[var(--fg)] outline-none focus:border-gold/40 transition-colors placeholder:text-[var(--fg-faint)]"
              />

              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: submitting ? 1 : 1.01 }}
                whileTap={{ scale: submitting ? 1 : 0.99 }}
                className="w-full py-3.5 bg-gradient-to-r from-gold to-gold-light text-[var(--btn-text)] font-semibold text-sm tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-gold/20 transition-shadow disabled:opacity-50"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-[var(--btn-text)]/30 border-t-[var(--btn-text)] rounded-full animate-spin" />
                ) : mode === "login" ? (
                  <>
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Create Account
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </Reveal>

        {/* Quick links */}
        <div className="space-y-3 mt-8">
          {menuItems.map((item, i) => (
            <Reveal key={item.label} delay={0.2 + i * 0.08}>
              <Link href={item.href}>
                <motion.div
                  className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-mid)] transition-all duration-300 group"
                  whileHover={{ x: 4 }}
                >
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <item.icon className="w-4 h-4 text-gold/60" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-[var(--fg-faint)]">{item.description}</p>
                  </div>
                </motion.div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
