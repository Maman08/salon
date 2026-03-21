"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Package,
  Plus,
  Search,
  Edit3,
  Trash2,
  Loader2,
  X,
  Image as ImageIcon,
  Upload,
  Check,
  AlertCircle,
} from "lucide-react";
import {
  adminFetchProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminUploadProductImage,
  adminFetchCategories,
  AdminProduct,
  ApiCategory,
  ApiError,
} from "@/lib/api";

interface ProductForm {
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: string;
  compare_at_price: string;
  sku: string;
  stock_quantity: string;
  category_id: string;
  is_active: boolean;
  is_featured: boolean;
}

const emptyForm: ProductForm = {
  name: "",
  slug: "",
  description: "",
  short_description: "",
  price: "",
  compare_at_price: "",
  sku: "",
  stock_quantity: "0",
  category_id: "",
  is_active: true,
  is_featured: false,
};

export default function ProductsView() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFetchProducts({ page, per_page: 15, search: search || undefined });
      setProducts(res.items);
      setTotalPages(res.total_pages);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    (async () => {
      try {
        const cats = await adminFetchCategories();
        setCategories(cats);
      } catch {
        //
      }
    })();
  }, []);

  const handleField = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setForm((f) => ({ ...f, [target.name]: target.checked }));
    } else {
      setForm((f) => ({ ...f, [target.name]: target.value }));
    }
  };

  const slugify = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, category_id: categories[0]?.id || "" });
    setShowForm(true);
    setMsg(null);
  };

  const openEdit = (p: AdminProduct) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      slug: p.slug,
      description: p.description || "",
      short_description: p.short_description || "",
      price: String(p.price),
      compare_at_price: p.compare_at_price ? String(p.compare_at_price) : "",
      sku: p.sku || "",
      stock_quantity: String(p.stock_quantity),
      category_id: p.category_id,
      is_active: p.is_active,
      is_featured: p.is_featured,
    });
    setShowForm(true);
    setMsg(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const payload = {
        name: form.name,
        slug: form.slug || slugify(form.name),
        description: form.description || undefined,
        short_description: form.short_description || undefined,
        price: parseFloat(form.price),
        compare_at_price: form.compare_at_price ? parseFloat(form.compare_at_price) : undefined,
        sku: form.sku || undefined,
        stock_quantity: parseInt(form.stock_quantity) || 0,
        category_id: form.category_id,
        is_active: form.is_active,
        is_featured: form.is_featured,
      };
      if (editingId) {
        await adminUpdateProduct(editingId, payload);
        setMsg({ type: "success", text: "Product updated!" });
      } else {
        const created = await adminCreateProduct(payload);
        setEditingId(created.id);
        setMsg({ type: "success", text: "Product created!" });
      }
      await loadProducts();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to save product";
      setMsg({ type: "error", text: message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deactivate this product?")) return;
    try {
      await adminDeleteProduct(id);
      await loadProducts();
    } catch {
      //
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile || !editingId) return;
    setUploading(true);
    try {
      await adminUploadProductImage(editingId, imageFile, true);
      setImageFile(null);
      setMsg({ type: "success", text: "Image uploaded!" });
      await loadProducts();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to upload image";
      setMsg({ type: "error", text: message });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-[family-name:var(--font-playfair)] font-bold flex items-center gap-2">
            <Package className="w-6 h-6 text-gold" /> Products
          </h1>
          <p className="text-sm text-[var(--fg-muted)] mt-1">Manage your product catalog</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gold text-[var(--btn-text)] text-xs font-semibold tracking-wider uppercase rounded-xl hover:shadow-lg hover:shadow-gold/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--fg-faint)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-raised)] border border-[var(--border)] rounded-xl text-sm outline-none focus:border-gold/40 transition-colors"
        />
      </div>

      {/* Products table */}
      <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="w-5 h-5 text-gold animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-[var(--fg-muted)] text-sm">No products found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[var(--fg-muted)] text-xs uppercase tracking-wider border-b border-[var(--border)]">
                  <th className="px-5 py-3 text-left font-medium">Product</th>
                  <th className="px-5 py-3 text-left font-medium">Price</th>
                  <th className="px-5 py-3 text-center font-medium">Stock</th>
                  <th className="px-5 py-3 text-center font-medium">Status</th>
                  <th className="px-5 py-3 text-center font-medium">Featured</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const img = p.images?.find((i) => i.is_primary)?.url || p.images?.[0]?.url;
                  return (
                    <tr key={p.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--glass)] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {img ? (
                            <img src={img} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-[var(--bg-raised)]" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-[var(--bg-raised)] flex items-center justify-center">
                              <ImageIcon className="w-4 h-4 text-[var(--fg-faint)]" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium truncate max-w-[200px]">{p.name}</p>
                            <p className="text-xs text-[var(--fg-faint)]">{p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium">₹{p.price}</p>
                        {p.compare_at_price && (
                          <p className="text-xs text-[var(--fg-faint)] line-through">₹{p.compare_at_price}</p>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            p.stock_quantity < 10
                              ? "text-rose-400 bg-rose-400/10"
                              : "text-emerald-400 bg-emerald-400/10"
                          }`}
                        >
                          {p.stock_quantity}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${
                            p.is_active ? "bg-emerald-400" : "bg-[var(--fg-faint)]"
                          }`}
                        />
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        {p.is_featured && <span className="text-xs text-gold">★</span>}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(p)}
                            className="p-1.5 rounded-lg hover:bg-gold/10 text-[var(--fg-muted)] hover:text-gold transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-1.5 rounded-lg hover:bg-rose-400/10 text-[var(--fg-muted)] hover:text-rose-400 transition-colors"
                            title="Deactivate"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-[var(--border)]">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                  page === i + 1
                    ? "bg-gold text-[var(--btn-text)]"
                    : "bg-[var(--glass)] text-[var(--fg-muted)] hover:border-gold/30"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Create / Edit Modal ──────────────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-auto rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">{editingId ? "Edit Product" : "New Product"}</h2>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs text-[var(--fg-muted)] mb-1.5 uppercase tracking-wide">Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={(e) => {
                    handleField(e);
                    if (!editingId) setForm((f) => ({ ...f, slug: slugify(e.target.value) }));
                  }}
                  className="w-full bg-[var(--bg-raised)] border border-[var(--border-mid)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold/40 transition-colors"
                />
              </div>

              {/* Slug */}
              <div className="sm:col-span-2">
                <label className="block text-xs text-[var(--fg-muted)] mb-1.5 uppercase tracking-wide">Slug</label>
                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleField}
                  className="w-full bg-[var(--bg-raised)] border border-[var(--border-mid)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold/40 transition-colors"
                />
              </div>

              {/* Short description */}
              <div className="sm:col-span-2">
                <label className="block text-xs text-[var(--fg-muted)] mb-1.5 uppercase tracking-wide">Short Description</label>
                <input
                  name="short_description"
                  value={form.short_description}
                  onChange={handleField}
                  className="w-full bg-[var(--bg-raised)] border border-[var(--border-mid)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold/40 transition-colors"
                />
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="block text-xs text-[var(--fg-muted)] mb-1.5 uppercase tracking-wide">Full Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleField}
                  rows={3}
                  className="w-full bg-[var(--bg-raised)] border border-[var(--border-mid)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold/40 transition-colors resize-none"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs text-[var(--fg-muted)] mb-1.5 uppercase tracking-wide">Price (₹) *</label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={handleField}
                  className="w-full bg-[var(--bg-raised)] border border-[var(--border-mid)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold/40 transition-colors"
                />
              </div>

              {/* Compare at price */}
              <div>
                <label className="block text-xs text-[var(--fg-muted)] mb-1.5 uppercase tracking-wide">Compare at Price (₹)</label>
                <input
                  name="compare_at_price"
                  type="number"
                  step="0.01"
                  value={form.compare_at_price}
                  onChange={handleField}
                  className="w-full bg-[var(--bg-raised)] border border-[var(--border-mid)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold/40 transition-colors"
                />
              </div>

              {/* SKU */}
              <div>
                <label className="block text-xs text-[var(--fg-muted)] mb-1.5 uppercase tracking-wide">SKU</label>
                <input
                  name="sku"
                  value={form.sku}
                  onChange={handleField}
                  className="w-full bg-[var(--bg-raised)] border border-[var(--border-mid)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold/40 transition-colors"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-xs text-[var(--fg-muted)] mb-1.5 uppercase tracking-wide">Stock Quantity *</label>
                <input
                  name="stock_quantity"
                  type="number"
                  value={form.stock_quantity}
                  onChange={handleField}
                  className="w-full bg-[var(--bg-raised)] border border-[var(--border-mid)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold/40 transition-colors"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs text-[var(--fg-muted)] mb-1.5 uppercase tracking-wide">Category *</label>
                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleField}
                  className="w-full bg-[var(--bg-raised)] border border-[var(--border-mid)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold/40 transition-colors"
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={form.is_active}
                    onChange={handleField}
                    className="w-4 h-4 rounded border-[var(--border)] accent-gold"
                  />
                  Active
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={form.is_featured}
                    onChange={handleField}
                    className="w-4 h-4 rounded border-[var(--border)] accent-gold"
                  />
                  Featured
                </label>
              </div>
            </div>

            {/* Image upload (only for existing products) */}
            {editingId && (
              <div className="mt-6 pt-6 border-t border-[var(--border)]">
                <label className="block text-xs text-[var(--fg-muted)] mb-2 uppercase tracking-wide">
                  Upload Primary Image
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-[var(--bg-raised)] border border-dashed border-[var(--border-mid)] rounded-xl cursor-pointer hover:border-gold/40 transition-colors text-sm text-[var(--fg-muted)]">
                    <Upload className="w-4 h-4" />
                    {imageFile ? imageFile.name : "Choose file..."}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    />
                  </label>
                  {imageFile && (
                    <button
                      onClick={handleImageUpload}
                      disabled={uploading}
                      className="px-4 py-2.5 bg-gold text-[var(--btn-text)] text-xs font-semibold tracking-wider uppercase rounded-xl disabled:opacity-50"
                    >
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Upload"}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Save button */}
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-[var(--border)]">
              <button
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name || !form.price || !form.category_id}
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
