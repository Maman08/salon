"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import {
  ChevronLeft,
  ShoppingBag,
  CheckCircle2,
  Loader2,
  MapPin,
  CreditCard,
  Phone,
  AlertCircle,
  Banknote,
  Shield,
} from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { useAuth } from "@/lib/AuthProvider";
import {
  createAddress,
  createOrder,
  createPayment,
  verifyPayment,
  ApiError,
  ApiOrder,
} from "@/lib/api";
import Reveal from "@/components/ui/Reveal";

// ─── Indian States ───────────────────────────────────────────────────────────
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

// ─── Types ───────────────────────────────────────────────────────────────────
type Step = "details" | "payment" | "confirmed";
type PaymentMethod = "cod" | "online";

// ─── Razorpay type declarations ──────────────────────────────────────────────
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  modal?: { ondismiss?: () => void };
}
interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: () => void) => void;
}
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

// ─── Validation helpers ──────────────────────────────────────────────────────
const isValidPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  return /^[6-9]\d{9}$/.test(digits);
};

const isValidPincode = (pin: string) => /^\d{6}$/.test(pin.trim());

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const formatPhone = (val: string) => {
  return val.replace(/\D/g, "").slice(0, 10);
};

// ─── Component ───────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart, loading: cartLoading } = useCart();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<Step>("details");
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<ApiOrder | null>(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");

  const [form, setForm] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    notes: "",
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const shippingCost = totalPrice >= 1999 ? 0 : 99;
  const grandTotal = totalPrice + shippingCost;

  // Sync user data when available
  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        full_name: f.full_name || user.full_name || "",
        email: f.email || user.email || "",
      }));
    }
  }, [user]);

  const handleField = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      setForm((f) => ({ ...f, phone: formatPhone(value) }));
    } else if (name === "pincode") {
      setForm((f) => ({ ...f, pincode: value.replace(/\D/g, "").slice(0, 6) }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }

    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateDetails = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.full_name.trim()) newErrors.full_name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!isValidEmail(form.email)) newErrors.email = "Enter a valid email";

    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    else if (!isValidPhone(form.phone)) newErrors.phone = "Enter a valid 10-digit Indian mobile number";

    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.state) newErrors.state = "Select a state";

    if (!form.pincode.trim()) newErrors.pincode = "PIN code is required";
    else if (!isValidPincode(form.pincode)) newErrors.pincode = "Enter a valid 6-digit PIN code";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = () => {
    setOrderError(null);
    if (validateDetails()) {
      setStep("payment");
    }
  };

  // ── Razorpay payment flow ──────────────────────────────────────────────────
  const openRazorpayCheckout = useCallback(
    async (order: ApiOrder) => {
      try {
        const rzpData = await createPayment(order.id);

        const options: RazorpayOptions = {
          key: rzpData.key_id,
          amount: rzpData.amount,
          currency: rzpData.currency,
          name: "Grenix",
          description: `Order #${order.order_number}`,
          order_id: rzpData.razorpay_order_id,
          handler: async (response: RazorpayResponse) => {
            try {
              await verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              clearCart();
              setConfirmedOrder(order);
              setStep("confirmed");
            } catch {
              setOrderError("Payment verification failed. If money was deducted, it will be refunded within 5-7 days.");
            } finally {
              setPlacing(false);
            }
          },
          prefill: {
            name: form.full_name,
            email: form.email,
            contact: form.phone,
          },
          theme: {
            color: "#c9a96e",
          },
          modal: {
            ondismiss: () => {
              setPlacing(false);
              setOrderError("Payment was cancelled. Your order has been saved — you can retry payment from your orders page.");
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", () => {
          setPlacing(false);
          setOrderError("Payment failed. Please try again or choose Cash on Delivery.");
        });
        rzp.open();
      } catch (err) {
        setPlacing(false);
        const message = err instanceof ApiError ? err.message : "Could not initiate payment. Please try again.";
        setOrderError(message);
      }
    },
    [form, clearCart]
  );

  // ── Place order handler ────────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      router.push("/account");
      return;
    }

    if (paymentMethod === "online" && !razorpayLoaded) {
      setOrderError("Payment gateway is still loading. Please wait a moment and try again.");
      return;
    }

    setPlacing(true);
    setOrderError(null);

    try {
      const address = await createAddress({
        full_name: form.full_name,
        phone: form.phone,
        address_line1: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        is_default: false,
      });

      const order = await createOrder({
        address_id: address.id,
        notes: form.notes || undefined,
      });

      if (paymentMethod === "cod") {
        clearCart();
        setConfirmedOrder(order);
        setStep("confirmed");
      } else {
        await openRazorpayCheckout(order);
      }
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      setOrderError(message);
    } finally {
      if (paymentMethod === "cod") {
        setPlacing(false);
      }
    }
  };

  // ── Redirect if not authenticated ──────────────────────────────────────────
  if (!isAuthenticated && step !== "confirmed") {
    return (
      <div className="min-h-screen pt-24 lg:pt-32 pb-24 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gold/40 mx-auto mb-4" />
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl mb-2">Sign in required</h2>
          <p className="text-[var(--fg-muted)] text-sm mb-6">Please sign in to continue with checkout.</p>
          <Link href="/account">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 bg-gold/90 hover:bg-gold text-[var(--btn-text)] text-sm font-semibold tracking-wider uppercase rounded-xl transition-colors"
            >
              Sign In
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  // ── Loading cart from backend ────────────────────────────────────────────
  if (cartLoading && step !== "confirmed") {
    return (
      <div className="min-h-screen pt-24 lg:pt-32 pb-24 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-gold/40 mx-auto mb-4 animate-spin" />
          <p className="text-[var(--fg-muted)] text-sm">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // ── Empty cart ─────────────────────────────────────────────────────────────
  if (items.length === 0 && step !== "confirmed") {
    return (
      <div className="min-h-screen pt-24 lg:pt-32 pb-24 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-12 h-12 text-[var(--fg-faint)] mx-auto mb-4" />
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl mb-2">Your bag is empty</h2>
          <p className="text-[var(--fg-muted)] text-sm mb-6">Add some products before checking out.</p>
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 bg-gold/90 hover:bg-gold text-[var(--btn-text)] text-sm font-semibold tracking-wider uppercase rounded-xl transition-colors"
            >
              Shop Now
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  // ── Order Confirmed ────────────────────────────────────────────────────────
  if (step === "confirmed") {
    return (
      <div className="min-h-screen pt-24 lg:pt-32 pb-24 flex items-center justify-center">
        <Reveal>
          <div className="text-center max-w-md mx-auto px-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-10 h-10 text-gold" />
            </motion.div>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl lg:text-4xl mb-3">
              Order <span className="text-gradient-gold">Confirmed!</span>
            </h1>
            {confirmedOrder && (
              <p className="text-gold text-sm font-medium mb-2">
                Order #{confirmedOrder.order_number}
              </p>
            )}
            <p className="text-[var(--fg-muted)] mb-2">
              Thank you, <span className="text-[var(--fg)]">{form.full_name || "valued customer"}</span>!
            </p>
            {confirmedOrder && (
              <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] mb-4 text-left">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[var(--fg-muted)]">Total</span>
                  <span className="text-gold font-semibold">₹{confirmedOrder.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[var(--fg-muted)]">Items</span>
                  <span>{confirmedOrder.items.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--fg-muted)]">Payment</span>
                  <span className="capitalize">
                    {paymentMethod === "cod" ? "Cash on Delivery" : "Paid Online"}
                  </span>
                </div>
              </div>
            )}
            <p className="text-[var(--fg-muted)] text-sm mb-8">
              {paymentMethod === "cod"
                ? "You will pay when your order arrives. We'll send you updates via email."
                : "Payment received successfully! We'll send you updates via email."}
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/account/orders">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gold/90 hover:bg-gold text-[var(--btn-text)] text-sm font-semibold tracking-wider uppercase rounded-xl transition-colors"
                >
                  View Orders
                </motion.button>
              </Link>
              <Link href="/shop">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-[var(--glass)] border border-[var(--border)] text-[var(--fg-muted)] text-sm font-medium tracking-wider uppercase rounded-xl hover:border-[var(--border-mid)] transition-all"
                >
                  Continue Shopping
                </motion.button>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-24">
      {/* Load Razorpay Checkout Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
        strategy="lazyOnload"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 py-8 border-b border-[var(--border)] mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-[var(--glass)] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="font-[family-name:var(--font-playfair)] text-2xl lg:text-3xl">
            Checkout
          </h1>
          <div className="ml-auto flex items-center gap-2 text-xs text-[var(--fg-muted)]">
            <span className={step === "details" ? "text-gold font-semibold" : ""}>Details</span>
            <span className="opacity-30">→</span>
            <span className={step === "payment" ? "text-gold font-semibold" : ""}>Payment</span>
          </div>
        </div>

        {/* Error banner */}
        {orderError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-rose/10 border border-rose/20 text-rose text-sm"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{orderError}</span>
            <button onClick={() => setOrderError(null)} className="ml-auto text-rose/60 hover:text-rose">✕</button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* ── Left: Form ──────────────────────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-6 order-2 lg:order-1">
            <AnimatePresence mode="wait">
              {step === "details" && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Contact */}
                  <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
                    <div className="flex items-center gap-2 mb-5">
                      <Phone className="w-4 h-4 text-gold" />
                      <h2 className="text-sm font-semibold tracking-wider uppercase text-[var(--fg-muted)]">Contact</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Full Name" name="full_name" value={form.full_name} onChange={handleField} placeholder="Your full name" error={errors.full_name} />
                      <Field label="Email" name="email" type="email" value={form.email} onChange={handleField} placeholder="your@email.com" error={errors.email} />
                      <Field
                        label="Phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleField}
                        placeholder="9876543210"
                        className="sm:col-span-2"
                        error={errors.phone}
                        prefix="+91"
                      />
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
                    <div className="flex items-center gap-2 mb-5">
                      <MapPin className="w-4 h-4 text-gold" />
                      <h2 className="text-sm font-semibold tracking-wider uppercase text-[var(--fg-muted)]">Delivery Address</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Address" name="address" value={form.address} onChange={handleField} placeholder="House no., street, area" className="sm:col-span-2" error={errors.address} />
                      <Field label="City" name="city" value={form.city} onChange={handleField} placeholder="Mumbai" error={errors.city} />

                      {/* State dropdown */}
                      <div>
                        <label className="block text-xs text-[var(--fg-muted)] mb-1.5 tracking-wide">State</label>
                        <select
                          name="state"
                          value={form.state}
                          onChange={handleField}
                          className={`w-full bg-[var(--bg-raised)] border rounded-lg px-3 py-2.5 text-sm text-[var(--fg)] outline-none focus:border-gold/40 transition-colors appearance-none ${
                            errors.state ? "border-rose/50" : "border-[var(--border-mid)]"
                          }`}
                        >
                          <option value="">Select State</option>
                          {INDIAN_STATES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        {errors.state && <p className="text-xs text-rose mt-1">{errors.state}</p>}
                      </div>

                      <Field label="PIN Code" name="pincode" value={form.pincode} onChange={handleField} placeholder="400001" error={errors.pincode} />
                    </div>
                  </div>

                  {/* Order notes */}
                  <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
                    <label className="block text-xs text-[var(--fg-muted)] mb-1.5 tracking-wide">Order Notes (optional)</label>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleField}
                      placeholder="Any special instructions for your order..."
                      rows={3}
                      className="w-full bg-[var(--bg-raised)] border border-[var(--border-mid)] rounded-lg px-3 py-2.5 text-sm text-[var(--fg)] placeholder-[var(--fg-faint)] outline-none focus:border-gold/40 transition-colors resize-none"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleContinueToPayment}
                    className="w-full py-4 bg-gradient-to-r from-gold to-gold/80 text-[var(--btn-text)] font-semibold text-sm tracking-wider uppercase rounded-xl hover:shadow-lg hover:shadow-gold/20 transition-all"
                  >
                    Continue to Payment
                  </motion.button>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {step === "payment" && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
                    <div className="flex items-center gap-2 mb-5">
                      <CreditCard className="w-4 h-4 text-gold" />
                      <h2 className="text-sm font-semibold tracking-wider uppercase text-[var(--fg-muted)]">Payment Method</h2>
                    </div>

                    <div className="space-y-3">
                      <label
                        className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                          paymentMethod === "cod"
                            ? "border-gold/50 bg-gold/5"
                            : "border-[var(--border)] hover:border-gold/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={paymentMethod === "cod"}
                          onChange={() => setPaymentMethod("cod")}
                          className="accent-[#c9a96e]"
                        />
                        <Banknote className={`w-5 h-5 ${paymentMethod === "cod" ? "text-gold" : "text-[var(--fg-muted)]"}`} />
                        <div>
                          <p className="text-sm font-medium text-[var(--fg)]">Cash on Delivery</p>
                          <p className="text-xs text-[var(--fg-muted)]">Pay when your order arrives</p>
                        </div>
                      </label>

                      <label
                        className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                          paymentMethod === "online"
                            ? "border-gold/50 bg-gold/5"
                            : "border-[var(--border)] hover:border-gold/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value="online"
                          checked={paymentMethod === "online"}
                          onChange={() => setPaymentMethod("online")}
                          className="accent-[#c9a96e]"
                        />
                        <CreditCard className={`w-5 h-5 ${paymentMethod === "online" ? "text-gold" : "text-[var(--fg-muted)]"}`} />
                        <div>
                          <p className="text-sm font-medium text-[var(--fg)]">Pay Online</p>
                          <p className="text-xs text-[var(--fg-muted)]">UPI, Credit/Debit Card, Wallets, NetBanking</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Payment info cards */}
                  <AnimatePresence mode="wait">
                    {paymentMethod === "cod" && (
                      <motion.div
                        key="cod-info"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 rounded-2xl bg-gold/5 border border-gold/10">
                          <div className="flex items-start gap-3">
                            <Banknote className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-gold mb-1">Cash on Delivery</p>
                              <p className="text-xs text-[var(--fg-muted)] leading-relaxed">
                                Pay <span className="text-[var(--fg)] font-medium">₹{grandTotal.toLocaleString()}</span> in cash
                                when your order is delivered. Please keep exact change ready.
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {paymentMethod === "online" && (
                      <motion.div
                        key="online-info"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 rounded-2xl bg-gold/5 border border-gold/10">
                          <div className="flex items-start gap-3">
                            <Shield className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-gold mb-1">Secure Online Payment</p>
                              <p className="text-xs text-[var(--fg-muted)] leading-relaxed mb-2">
                                You&apos;ll be redirected to a secure payment page powered by <span className="text-[var(--fg)] font-medium">Razorpay</span> where you can pay using:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {["GPay", "PhonePe", "Paytm", "UPI", "Cards", "NetBanking", "Wallets"].map((m) => (
                                  <span key={m} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-raised)] border border-[var(--border)] text-[var(--fg-muted)]">
                                    {m}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep("details")}
                      className="flex-1 py-4 bg-[var(--glass)] border border-[var(--border)] text-[var(--fg-muted)] font-medium text-sm tracking-wider uppercase rounded-xl hover:border-[var(--border-mid)] transition-all"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePlaceOrder}
                      disabled={placing}
                      className="flex-[2] py-4 bg-gradient-to-r from-gold to-gold/80 text-[var(--btn-text)] font-semibold text-sm tracking-wider uppercase rounded-xl hover:shadow-lg hover:shadow-gold/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {placing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {paymentMethod === "online" ? "Processing..." : "Placing Order..."}
                        </>
                      ) : paymentMethod === "online" ? (
                        `Pay ₹${grandTotal.toLocaleString()}`
                      ) : (
                        `Place Order · ₹${grandTotal.toLocaleString()}`
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* ── Right: Order Summary ─────────────────────────────────────── */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="sticky top-24 p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
              <h2 className="text-sm font-semibold tracking-wider uppercase text-[var(--fg-muted)] mb-5">
                Order Summary ({totalItems} {totalItems === 1 ? "item" : "items"})
              </h2>

              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[var(--bg-raised)] flex-shrink-0">
                      <Image src={item.product.image} alt={item.product.name} fill unoptimized className="object-cover" sizes="56px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-[var(--fg-muted)]">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm text-gold font-medium flex-shrink-0">
                      ₹{(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-[var(--border)] pt-4 space-y-2">
                <div className="flex justify-between text-sm text-[var(--fg-muted)]">
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-[var(--fg-muted)]">
                  <span>Shipping</span>
                  <span className={shippingCost === 0 ? "text-gold" : ""}>
                    {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-semibold pt-2 border-t border-[var(--border)]">
                  <span>Total</span>
                  <span className="text-gold">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[var(--border)]">
                <p className="text-xs text-[var(--fg-faint)] leading-relaxed text-center">
                  🔒 Secure checkout · Free returns within 7 days
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Input field component ────────────────────────────────────────────────────
function Field({
  label, name, value, onChange, placeholder, type = "text", className = "", error, prefix,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  error?: string;
  prefix?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs text-[var(--fg-muted)] mb-1.5 tracking-wide">{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--fg-muted)] select-none">
            {prefix}
          </span>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-[var(--bg-raised)] border rounded-lg px-3 py-2.5 text-sm text-[var(--fg)] placeholder-[var(--fg-faint)] outline-none focus:border-gold/40 transition-colors ${
            prefix ? "pl-12" : ""
          } ${error ? "border-rose/50" : "border-[var(--border-mid)]"}`}
        />
      </div>
      {error && <p className="text-xs text-rose mt-1">{error}</p>}
    </div>
  );
}
