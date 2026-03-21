"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Users,
  Loader2,
  Shield,
  ShieldOff,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import {
  adminFetchUsers,
  adminUpdateUserRole,
  AdminUser,
  ApiError,
} from "@/lib/api";
import { useAuth } from "@/lib/AuthProvider";

export default function UsersView() {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toggling, setToggling] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFetchUsers({ page, per_page: 20 });
      setUsers(res.items);
      setTotalPages(res.total_pages);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleToggleRole = async (user: AdminUser) => {
    if (user.id === currentAdmin?.id) return; // can't demote yourself
    const newRole = user.role === "admin" ? "customer" : "admin";
    if (!confirm(`Change ${user.full_name}'s role to ${newRole}?`)) return;
    setToggling(user.id);
    try {
      await adminUpdateUserRole(user.id, newRole);
      await loadUsers();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Failed to update role");
    } finally {
      setToggling(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-[family-name:var(--font-playfair)] font-bold flex items-center gap-2">
          <Users className="w-6 h-6 text-gold" /> Users
        </h1>
        <p className="text-sm text-[var(--fg-muted)] mt-1">View and manage registered users</p>
      </div>

      {/* Users table */}
      <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="w-5 h-5 text-gold animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-[var(--fg-muted)] text-sm">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[var(--fg-muted)] text-xs uppercase tracking-wider border-b border-[var(--border)]">
                  <th className="px-5 py-3 text-left font-medium">User</th>
                  <th className="px-5 py-3 text-left font-medium">Contact</th>
                  <th className="px-5 py-3 text-center font-medium">Role</th>
                  <th className="px-5 py-3 text-center font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Joined</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--glass)] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-xs font-bold text-gold">
                          {u.full_name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <p className="font-medium">{u.full_name}</p>
                          {u.id === currentAdmin?.id && (
                            <span className="text-[10px] text-gold">(You)</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs text-[var(--fg-muted)]">
                          <Mail className="w-3 h-3" />
                          {u.email}
                        </div>
                        {u.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-[var(--fg-faint)]">
                            <Phone className="w-3 h-3" />
                            {u.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          u.role === "admin"
                            ? "text-gold bg-gold/10"
                            : "text-[var(--fg-muted)] bg-[var(--glass)]"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          u.is_active ? "bg-emerald-400" : "bg-[var(--fg-faint)]"
                        }`}
                      />
                    </td>
                    <td className="px-5 py-3.5 text-right text-[var(--fg-muted)]">
                      <div className="flex items-center justify-end gap-1.5 text-xs">
                        <Calendar className="w-3 h-3" />
                        {new Date(u.created_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "2-digit",
                        })}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {u.id !== currentAdmin?.id && (
                        <button
                          onClick={() => handleToggleRole(u)}
                          disabled={toggling === u.id}
                          className={`p-1.5 rounded-lg transition-colors ${
                            u.role === "admin"
                              ? "hover:bg-rose-400/10 text-[var(--fg-muted)] hover:text-rose-400"
                              : "hover:bg-gold/10 text-[var(--fg-muted)] hover:text-gold"
                          }`}
                          title={u.role === "admin" ? "Revoke admin" : "Make admin"}
                        >
                          {toggling === u.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : u.role === "admin" ? (
                            <ShieldOff className="w-3.5 h-3.5" />
                          ) : (
                            <Shield className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-[var(--border)]">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                  page === i + 1
                    ? "bg-gold text-[var(--btn-text)]"
                    : "bg-[var(--glass)] text-[var(--fg-muted)]"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
