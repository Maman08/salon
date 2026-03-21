"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/AuthProvider";
import { Shield, LogOut, ExternalLink } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import DashboardView from "./DashboardView";
import ProductsView from "./ProductsView";
import OrdersView from "./OrdersView";
import CategoriesView from "./CategoriesView";
import UsersView from "./UsersView";

export type AdminTab = "dashboard" | "products" | "orders" | "categories" | "users";

export default function AdminPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<AdminTab>("dashboard");

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
      router.replace("/account");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Admin top bar */}
      <header className="h-14 border-b border-[var(--border)] bg-[var(--bg-card)] flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-gold" />
          <span className="font-[family-name:var(--font-playfair)] text-lg font-bold">
            Grenix <span className="text-gold">Admin</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View Store
          </Link>
          <span className="hidden sm:block text-xs text-[var(--fg-faint)]">|</span>
          <span className="text-xs text-[var(--fg-muted)]">{user.full_name}</span>
          <button
            onClick={() => { logout(); router.push("/"); }}
            className="p-1.5 rounded-lg hover:bg-rose-400/10 text-[var(--fg-muted)] hover:text-rose-400 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-56px)]">
        <AdminSidebar activeTab={tab} onTabChange={setTab} />
        <main className="flex-1 overflow-auto">
          {/* Mobile tab bar */}
          <div className="lg:hidden flex overflow-x-auto border-b border-[var(--border)] bg-[var(--bg-card)] px-2 gap-1 scrollbar-hide">
            {(["dashboard", "products", "orders", "categories", "users"] as AdminTab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-3 text-xs font-medium tracking-wider uppercase whitespace-nowrap transition-colors ${
                  tab === t
                    ? "text-gold border-b-2 border-gold"
                    : "text-[var(--fg-muted)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="p-4 sm:p-6 lg:p-8">
            {tab === "dashboard" && <DashboardView />}
            {tab === "products" && <ProductsView />}
            {tab === "orders" && <OrdersView />}
            {tab === "categories" && <CategoriesView />}
            {tab === "users" && <UsersView />}
          </div>
        </main>
      </div>
    </div>
  );
}
