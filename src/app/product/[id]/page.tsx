"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Star,
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  ArrowLeft,
  Truck,
  Shield,
  RotateCcw,
  Check,
  ChevronDown,
} from "lucide-react";
import { products } from "@/data/products";
import { useCart } from "@/components/cart/CartProvider";
import ProductCard from "@/components/product/ProductCard";
import Reveal from "@/components/ui/Reveal";

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "ingredients" | "reviews">("description");
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🔍</p>
          <h1 className="text-2xl font-[family-name:var(--font-playfair)] mb-4">
            Product Not Found
          </h1>
          <Link href="/shop" className="text-gold hover:underline">
            ← Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Reveal>
          <nav className="flex items-center gap-2 text-xs text-white/30 mb-8">
            <Link href="/" className="hover:text-white/60 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-white/60 transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-white/50">{product.name}</span>
          </nav>
        </Reveal>

        {/* Back button (mobile) */}
        <Link
          href="/shop"
          className="lg:hidden inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/60 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        {/* Product section */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left - Images */}
          <Reveal direction="left">
            <div className="space-y-4">
              {/* Main image */}
              <motion.div
                className="relative aspect-square rounded-2xl overflow-hidden bg-[#111]"
                layoutId={`product-image-${product.id}`}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={product.images[activeImage]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  {product.badge && (
                    <span className="px-3 py-1 text-xs tracking-wider uppercase font-semibold bg-gold/90 text-[#0a0a0a] rounded-full">
                      {product.badge}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="px-3 py-1 text-xs font-semibold bg-rose/90 text-white rounded-full">
                      -{discount}% OFF
                    </span>
                  )}
                  {product.usedInSalon && (
                    <span className="px-3 py-1 text-xs tracking-wider bg-white/10 backdrop-blur-md text-white/70 rounded-full border border-white/10">
                      ✨ Used in Salon
                    </span>
                  )}
                </div>

                {/* Color glow */}
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 80%, ${product.color || "#c9a96e"}, transparent 60%)`,
                  }}
                />
              </motion.div>

              {/* Thumbnail gallery */}
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img, i) => (
                    <motion.button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                        activeImage === i
                          ? "border-gold/50 shadow-lg shadow-gold/10"
                          : "border-white/5 hover:border-white/20"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} view ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </Reveal>

          {/* Right - Details */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal direction="right">
              <div className="space-y-6">
                {/* Brand & name */}
                <div>
                  <p className="text-xs tracking-[0.3em] uppercase text-gold/60 mb-2">
                    {product.brand}
                  </p>
                  <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl leading-tight">
                    {product.name}
                  </h1>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? "text-gold fill-gold"
                            : "text-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-white/40">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-semibold text-gold">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-lg text-white/20 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                      <span className="px-2 py-0.5 text-xs font-semibold bg-rose/10 text-rose rounded-md">
                        Save ₹{(product.originalPrice - product.price).toLocaleString()}
                      </span>
                    </>
                  )}
                </div>

                {/* Short description */}
                <p className="text-white/50 leading-relaxed">
                  {product.shortDescription}
                </p>

                {/* Divider */}
                <div className="w-full h-[1px] bg-gradient-to-r from-white/5 via-white/10 to-white/5" />

                {/* Quantity & Add to Cart */}
                <div className="flex items-center gap-4">
                  {/* Quantity */}
                  <div className="flex items-center gap-3 p-1 rounded-xl bg-white/[0.03] border border-white/5">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <Minus className="w-4 h-4" />
                    </motion.button>
                    <span className="w-8 text-center font-medium">{quantity}</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  </div>

                  {/* Add to Cart */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    className={`flex-1 py-3.5 rounded-xl font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-300 ${
                      addedToCart
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-gradient-to-r from-gold to-gold-light text-[#0a0a0a] hover:shadow-lg hover:shadow-gold/20"
                    }`}
                  >
                    {addedToCart ? (
                      <>
                        <Check className="w-4 h-4" />
                        Added to Bag!
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        Add to Bag
                      </>
                    )}
                  </motion.button>

                  {/* Wishlist */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsLiked(!isLiked)}
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-300 ${
                      isLiked
                        ? "bg-rose/10 border-rose/30 text-rose"
                        : "border-white/10 text-white/40 hover:border-rose/20 hover:text-rose"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                  </motion.button>
                </div>

                {/* Trust badges */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Truck, text: "Free Shipping" },
                    { icon: Shield, text: "Authentic" },
                    { icon: RotateCcw, text: "30-Day Return" },
                  ].map(({ icon: Icon, text }) => (
                    <div
                      key={text}
                      className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-center"
                    >
                      <Icon className="w-3.5 h-3.5 text-gold/60 flex-shrink-0" />
                      <span className="text-[10px] text-white/30 tracking-wider">
                        {text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Tabs */}
                <div className="border-t border-white/5 pt-6 mt-2">
                  <div className="flex gap-6 mb-6">
                    {(["description", "ingredients", "reviews"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`text-sm tracking-wider capitalize pb-2 border-b-2 transition-all duration-300 ${
                          activeTab === tab
                            ? "text-gold border-gold"
                            : "text-white/30 border-transparent hover:text-white/50"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {activeTab === "description" && (
                        <p className="text-sm text-white/40 leading-relaxed">
                          {product.description}
                        </p>
                      )}
                      {activeTab === "ingredients" && (
                        <div className="space-y-2">
                          {product.ingredients ? (
                            product.ingredients.map((ing) => (
                              <div
                                key={ing}
                                className="flex items-center gap-2 text-sm text-white/40"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-gold/40" />
                                {ing}
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-white/30">
                              Ingredient list coming soon.
                            </p>
                          )}
                        </div>
                      )}
                      {activeTab === "reviews" && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                            <div className="text-center">
                              <p className="text-2xl font-[family-name:var(--font-playfair)] text-gold">
                                {product.rating}
                              </p>
                              <div className="flex gap-0.5 mt-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < Math.floor(product.rating)
                                        ? "text-gold fill-gold"
                                        : "text-white/10"
                                    }`}
                                  />
                                ))}
                              </div>
                              <p className="text-xs text-white/30 mt-1">
                                {product.reviews} reviews
                              </p>
                            </div>
                            <div className="flex-1 space-y-1.5">
                              {[5, 4, 3, 2, 1].map((star) => (
                                <div key={star} className="flex items-center gap-2">
                                  <span className="text-xs text-white/30 w-3">{star}</span>
                                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gold/60 rounded-full"
                                      style={{
                                        width: `${
                                          star === 5
                                            ? 70
                                            : star === 4
                                            ? 20
                                            : star === 3
                                            ? 7
                                            : 3
                                        }%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-white/20 text-center">
                            Detailed reviews coming soon
                          </p>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-24">
            <Reveal>
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-[family-name:var(--font-playfair)] text-2xl">
                  You May Also <span className="text-gradient-gold">Love</span>
                </h2>
                <Link
                  href="/shop"
                  className="text-sm text-white/30 hover:text-gold transition-colors"
                >
                  View All →
                </Link>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
