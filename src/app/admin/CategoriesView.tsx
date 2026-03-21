"use client";

import { useEffect, useState, useCallback } from "react";
import {
  FolderTree,
  Plus,
  Edit3,
  Trash2,
  Loader2,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import {
  adminFetchCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  ApiCategory,
  ApiError,
} from "@/lib/api";

export default function CategoriesView() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminFetchCategories();
      setCategories(data);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const slugify = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const openCreate = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setDescription("");
    setShowForm(true);
    setMsg(null);
  };

  const openEdit = (c: ApiCategory) => {
    setEditingId(c.id);
    setName(c.name);
    setSlug(c.slug);
    setDescription(c.description || "");
    setShowForm(true);
    setMsg(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const data = {
        name,
        slug: slug || slugify(name),
        description: description || undefined,
      };
      if (editingId) {
        await adminUpdateCategory(editingId, data);
        setMsg({ type: "success", text: "Category updated!" });
      } else {
        await adminCreateCategory(data);
        setMsg({ type: "success", text: "Category created!" });
      }
      await loadCategories();
      setShowForm(false);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to save category";
      setMsg({ type: "error", text: message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? Products under it may be affected.")) return;
    try {
      await adminDeleteCategory(id);
      await loadCategories();
    } catch {
      //
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-[family-name:var(--font-playfair)] font-bold flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-gold" /> Categories
          </h1>
          <p className="text-sm text-[var(--fg-muted)] mt-1">Organize your products into categories</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gold text-[var(--btn-text)] text-xs font-semibold tracking-wider uppercase rounded-xl hover:shadow-lg hover:shadow-gold/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Categories grid */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-5 h-5 text-gold animate-spin" />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 text-[var(--fg-muted)] text-sm rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
          No categories yet. Create one to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-mid)] transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{c.name}</h3>
                  <p className="text-xs text-[var(--fg-faint)] mt-0.5">{c.slug}</p>
                  {c.description && (
                    <p className="text-xs text-[var(--fg-muted)] mt-2 line-clamp-2">{c.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(c)}
                    className="p-1.5 rounded-lg hover:bg-gold/10 text-[var(--fg-muted)] hover:text-gold transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-400/10 text-[var(--fg-muted)] hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${c.is_active ? "bg-emerald-400" : "bg-[var(--fg-faint)]"}`}
                />
                <span className="text-xs text-[var(--fg-muted)]">{c.is_active ? "Active" : "Inactive"}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create / Edit Modal ──────────────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">{editingId ? "Edit Category" : "New Category"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 rounded hover:bg-[var(--glass)] text-[var(--fg-muted)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {msg && (
              <div
                className={`flex items-center gap-2 p-3 rounded-lg text-sm mb-4 ${
                  msg.type === "success"
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                    : "bg-rose/10 border border-rose/20 text-rose"
                }`}
              >
                {msg.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {msg.text}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[var(--fg-muted)] mb-1.5 uppercase tracking-wide">Name *</label>
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingId) setSlug(slugify(e.target.value));
                  }}
                  className="w-full bg-[var(--bg-raised)] border border-[var(--border-mid)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold/40 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--fg-muted)] mb-1.5 uppercase tracking-wide">Slug</label>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-[var(--bg-raised)] border border-[var(--border-mid)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold/40 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--fg-muted)] mb-1.5 uppercase tracking-wide">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-[var(--bg-raised)] border border-[var(--border-mid)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold/40 transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--border)]">
              <button
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !name}
                className="px-6 py-2.5 bg-gold text-[var(--btn-text)] text-xs font-semibold tracking-wider uppercase rounded-xl hover:shadow-lg hover:shadow-gold/20 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
