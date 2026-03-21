// ─── API Client ───────────────────────────────────────────────────────────────
// Centralized API client for communicating with the FastAPI backend.
// All API calls go through this module.

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1";

// ─── Types matching backend schemas ──────────────────────────────────────────

export interface ApiProductImage {
  id: string;
  url: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
}

/** Full product detail (GET /products/{slug}) */
export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  compare_at_price: number | null;
  sku: string | null;
  stock_quantity: number;
  category_id: string;
  is_active: boolean;
  is_featured: boolean;
  images: ApiProductImage[];
  created_at: string;
}

/** Lightweight product list item (GET /products/) */
export interface ApiProductListItem {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  price: number;
  compare_at_price: number | null;
  stock_quantity: number;
  is_featured: boolean;
  primary_image: string | null;
  category_id: string;
}

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface PaginatedResponse<T> {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  items: T[];
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface ApiUser {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
    ...(options.headers as Record<string, string> | undefined),
  };

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new ApiError(body.detail || res.statusText, res.status);
  }

  return res.json();
}

// ─── Product Endpoints ───────────────────────────────────────────────────────

export async function fetchProducts(params?: {
  page?: number;
  per_page?: number;
  search?: string;
}): Promise<PaginatedResponse<ApiProductListItem>> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.per_page) query.set("per_page", String(params.per_page));
  if (params?.search) query.set("search", params.search);
  const qs = query.toString();
  return request(`/products/${qs ? `?${qs}` : ""}`);
}

export async function fetchFeaturedProducts(
  limit = 10
): Promise<ApiProduct[]> {
  return request(`/products/featured?limit=${limit}`);
}

export async function fetchProductBySlug(
  slug: string
): Promise<ApiProduct> {
  return request(`/products/${slug}`);
}

export async function fetchProductsByCategory(
  categorySlug: string,
  params?: { page?: number; per_page?: number }
): Promise<PaginatedResponse<ApiProductListItem>> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.per_page) query.set("per_page", String(params.per_page));
  const qs = query.toString();
  return request(`/products/category/${categorySlug}${qs ? `?${qs}` : ""}`);
}

// ─── Category Endpoints ──────────────────────────────────────────────────────

export async function fetchCategories(): Promise<ApiCategory[]> {
  return request("/categories/");
}

// ─── Auth Endpoints ──────────────────────────────────────────────────────────

export async function login(
  email: string,
  password: string
): Promise<TokenResponse> {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(data: {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
}): Promise<TokenResponse> {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function refreshToken(
  refresh_token: string
): Promise<TokenResponse> {
  return request("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refresh_token }),
  });
}

// ─── User Endpoints ──────────────────────────────────────────────────────────

export async function fetchCurrentUser(): Promise<ApiUser> {
  return request("/users/me");
}

// ─── Cart Endpoints (requires auth) ─────────────────────────────────────────

export interface ApiCartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: ApiProductListItem | null;
  created_at: string;
}

export interface ApiCartResponse {
  items: ApiCartItem[];
  total_items: number;
  subtotal: number;
}

export async function fetchCart(): Promise<ApiCartResponse> {
  return request("/cart/");
}

export async function addToCart(
  product_id: string,
  quantity = 1
): Promise<ApiCartItem> {
  return request("/cart/items", {
    method: "POST",
    body: JSON.stringify({ product_id, quantity }),
  });
}

export async function updateCartItem(
  itemId: string,
  quantity: number
): Promise<ApiCartItem> {
  return request(`/cart/items/${itemId}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });
}

export async function removeCartItem(itemId: string): Promise<void> {
  await request(`/cart/items/${itemId}`, { method: "DELETE" });
}

export async function clearCart(): Promise<void> {
  await request("/cart/", { method: "DELETE" });
}

// ─── Wishlist Endpoints (requires auth) ──────────────────────────────────────

export async function fetchWishlist() {
  return request<{ items: { product_id: string; product: ApiProductListItem | null }[] }>("/wishlist/");
}

export async function addToWishlist(productId: string): Promise<void> {
  await request(`/wishlist/${productId}`, { method: "POST" });
}

export async function removeFromWishlist(productId: string): Promise<void> {
  await request(`/wishlist/${productId}`, { method: "DELETE" });
}

// ─── Address Endpoints (requires auth) ──────────────────────────────────────

export interface ApiAddress {
  id: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
  created_at: string;
}

export async function fetchAddresses(): Promise<ApiAddress[]> {
  return request("/addresses/");
}

export async function createAddress(data: {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  is_default?: boolean;
}): Promise<ApiAddress> {
  return request("/addresses/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ─── Order Endpoints (requires auth) ────────────────────────────────────────

export interface ApiOrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface ApiOrder {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  subtotal: number;
  shipping_fee: number;
  total: number;
  shipping_address: {
    full_name: string;
    phone: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  razorpay_order_id: string | null;
  notes: string | null;
  items: ApiOrderItem[];
  created_at: string;
}

export interface ApiOrderListItem {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  total: number;
  items_count: number;
  created_at: string;
}

export async function createOrder(data: {
  address_id: string;
  notes?: string;
}): Promise<ApiOrder> {
  return request("/orders/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function fetchOrders(params?: {
  page?: number;
  per_page?: number;
}): Promise<PaginatedResponse<ApiOrderListItem>> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.per_page) query.set("per_page", String(params.per_page));
  const qs = query.toString();
  return request(`/orders/${qs ? `?${qs}` : ""}`);
}

export async function fetchOrder(orderId: string): Promise<ApiOrder> {
  return request(`/orders/${orderId}`);
}

export async function cancelOrder(orderId: string): Promise<ApiOrder> {
  return request(`/orders/${orderId}/cancel`, { method: "PUT" });
}

// ─── Payment Endpoints (Razorpay) ───────────────────────────────────────────

export interface RazorpayOrderResponse {
  razorpay_order_id: string;
  amount: number;
  currency: string;
  key_id: string;
}

export async function createPayment(orderId: string): Promise<RazorpayOrderResponse> {
  return request("/payments/create", {
    method: "POST",
    body: JSON.stringify({ order_id: orderId }),
  });
}

export async function verifyPayment(data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<{ status: string; order_number: string }> {
  return request("/payments/verify", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ─── User Profile Endpoints (requires auth) ─────────────────────────────────

export async function updateProfile(data: {
  full_name?: string;
  phone?: string;
}): Promise<ApiUser> {
  return request("/users/me", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function changePassword(data: {
  current_password: string;
  new_password: string;
}): Promise<{ message: string }> {
  return request("/users/me/password", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// ─── Admin Endpoints (requires admin role) ──────────────────────────────────

export interface AdminDashboardStats {
  total_products: number;
  total_orders: number;
  total_users: number;
  total_revenue: number;
  pending_orders: number;
  low_stock_products: number;
}

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  compare_at_price: number | null;
  sku: string | null;
  stock_quantity: number;
  category_id: string;
  is_active: boolean;
  is_featured: boolean;
  images: ApiProductImage[];
  created_at: string;
}

export interface AdminOrder {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  subtotal: number;
  shipping_fee: number;
  total: number;
  shipping_address: Record<string, string>;
  razorpay_order_id: string | null;
  notes: string | null;
  items: ApiOrderItem[];
  created_at: string;
  user?: { id: string; email: string; full_name: string };
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Admin dashboard
export async function adminFetchDashboardStats(): Promise<{
  total_products: number;
  total_orders: number;
  total_users: number;
  total_revenue: number;
  pending_orders: number;
  low_stock_products: number;
  recent_orders: { id: string; order_number: string; status: string; payment_status: string; total: number; created_at: string }[];
}> {
  return request("/admin/dashboard/stats");
}

// Admin products
export async function adminFetchProducts(params?: {
  page?: number;
  per_page?: number;
  search?: string;
}): Promise<PaginatedResponse<AdminProduct>> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.per_page) query.set("per_page", String(params.per_page));
  if (params?.search) query.set("search", params.search);
  const qs = query.toString();
  return request(`/admin/products/${qs ? `?${qs}` : ""}`);
}

export async function adminCreateProduct(data: {
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  price: number;
  compare_at_price?: number;
  sku?: string;
  stock_quantity: number;
  category_id: string;
  is_active?: boolean;
  is_featured?: boolean;
}): Promise<AdminProduct> {
  return request("/admin/products/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function adminUpdateProduct(
  productId: string,
  data: Record<string, unknown>
): Promise<AdminProduct> {
  return request(`/admin/products/${productId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function adminDeleteProduct(productId: string): Promise<{ message: string }> {
  return request(`/admin/products/${productId}`, { method: "DELETE" });
}

export async function adminUploadProductImage(
  productId: string,
  file: File,
  isPrimary = false
): Promise<{ id: string; url: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const url = `${API_BASE}/admin/products/${productId}/images?is_primary=${isPrimary}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { ...getAuthHeaders() },
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new ApiError(body.detail || res.statusText, res.status);
  }
  return res.json();
}

export async function adminDeleteProductImage(imageId: string): Promise<{ message: string }> {
  return request(`/admin/products/images/${imageId}`, { method: "DELETE" });
}

// Admin orders
export async function adminFetchOrders(params?: {
  page?: number;
  per_page?: number;
}): Promise<PaginatedResponse<AdminOrder>> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.per_page) query.set("per_page", String(params.per_page));
  const qs = query.toString();
  return request(`/admin/orders/${qs ? `?${qs}` : ""}`);
}

export async function adminUpdateOrderStatus(
  orderId: string,
  data: { status?: string; payment_status?: string }
): Promise<AdminOrder> {
  return request(`/admin/orders/${orderId}/status`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// Admin categories
export async function adminFetchCategories(): Promise<ApiCategory[]> {
  return request("/admin/categories/");
}

export async function adminCreateCategory(data: {
  name: string;
  slug: string;
  description?: string;
}): Promise<ApiCategory> {
  return request("/admin/categories/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function adminUpdateCategory(
  categoryId: string,
  data: Record<string, unknown>
): Promise<ApiCategory> {
  return request(`/admin/categories/${categoryId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function adminDeleteCategory(categoryId: string): Promise<{ message: string }> {
  return request(`/admin/categories/${categoryId}`, { method: "DELETE" });
}

// Admin users
export async function adminFetchUsers(params?: {
  page?: number;
  per_page?: number;
}): Promise<PaginatedResponse<AdminUser>> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.per_page) query.set("per_page", String(params.per_page));
  const qs = query.toString();
  return request(`/admin/users/${qs ? `?${qs}` : ""}`);
}

export async function adminUpdateUserRole(
  userId: string,
  role: string
): Promise<AdminUser> {
  return request(`/admin/users/${userId}/role`, {
    method: "PUT",
    body: JSON.stringify({ role }),
  });
}

export { ApiError };
