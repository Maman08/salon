"use client";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FolderTree,
  Users,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";
import { useState } from "react";
import type { AdminTab } from "./page";

const items: { key: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "products", label: "Products", icon: Package },
  { key: "orders", label: "Orders", icon: ShoppingCart },
  { key: "categories", label: "Categories", icon: FolderTree },
  { key: "users", label: "Users", icon: Users },
];

export default function AdminSidebar({
  activeTab,
  onTabChange,
}: {
  activeTab: AdminTab;
  onTabChange: (t: AdminTab) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`hidden lg:flex flex-col border-r border-[var(--border)] bg-[var(--bg-card)] transition-all duration-300 ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 h-14 border-b border-[var(--border)]">
        <Shield className="w-5 h-5 text-gold shrink-0" />
        {!collapsed && (
          <span className="text-sm font-semibold tracking-wider uppercase text-gold">
            Admin
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto p-1 rounded hover:bg-[var(--glass)] text-[var(--fg-faint)]"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-3 space-y-1 px-2">
        {items.map((item) => {
          const active = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onTabChange(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-gold/10 text-gold border border-gold/20"
                  : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--glass)]"
              } ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className={`w-4 h-4 shrink-0 ${active ? "text-gold" : ""}`} />
              {!collapsed && item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
