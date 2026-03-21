// ─── Product Mapping Layer ────────────────────────────────────────────────────
// Maps backend API responses to the frontend Product type.
// Extra presentation fields (rating, reviews, badge, brand, color, tags,
// ingredients, benefits) live here until the backend schema supports them.

import { ApiProduct, ApiProductListItem } from "./api";

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  description: string;
  shortDescription: string;
  category: string;
  tags: string[];
  rating: number;
  reviews: number;
  image: string;
  images: string[];
  badge?: string;
  ingredients?: string[];
  benefits?: string[];
  color?: string;
}

// ─── Static enrichment data (keyed by slug) ──────────────────────────────────
// These fields are not yet in the backend DB. They are merged client-side.

interface Enrichment {
  brand: string;
  rating: number;
  reviews: number;
  tags: string[];
  badge?: string;
  ingredients?: string[];
  benefits?: string[];
  color?: string;
  category: string;
}

const enrichments: Record<string, Enrichment> = {
  "vitamin-c-face-serum": {
    brand: "Unique Vibe Grenix",
    rating: 4.8,
    reviews: 234,
    tags: ["brightening", "hydrating", "vitamin-c", "bestseller"],
    badge: "Bestseller",
    ingredients: [
      "Ascorbic Acid", "Kakadu Plum Extract", "Niacinamide", "Ferulic Acid",
      "Sodium Hyaluronate", "Licorice Extract", "Mulberry Extract",
      "Grape Seed Extract", "Scutellaria Baicalensis Root Extract",
      "Suffruticosa Root Extract", "Glycerin", "Citric Acid",
      "Sodium Citrate", "Sodium PCA", "Saccharide",
    ],
    benefits: [
      "Brightens Skin Tone", "Deep Hydration",
      "Reduces Dark Spots & Pigmentation", "Powerful Antioxidant Protection",
      "Improves Skin Texture", "Soothes & Calms Skin",
    ],
    color: "#f0c75e",
    category: "skincare",
  },
  "tinted-sunscreen-spf-50": {
    brand: "Unique Vibe Grenix",
    rating: 4.7,
    reviews: 156,
    tags: ["sunscreen", "spf-50", "tinted", "uv-protection"],
    badge: "SPF 50",
    ingredients: [
      "Butyloctyl Salicylate", "Sulfonic Acid", "Green Tea Extract",
      "Shea Butter", "Fermented Rice Water", "Jojoba Oil",
      "Coffea Arabica (Coffee)", "Niacinamide",
    ],
    benefits: [
      "Broad Spectrum UV Protection", "Brightens & Evens Skin Tone",
      "Strong Antioxidant Defense", "Soothes & Repairs Skin",
      "Smooth & Even Finish", "Natural Skin Tone Coverage",
    ],
    color: "#e8c47a",
    category: "skincare",
  },
  "night-cream": {
    brand: "Unique Vibe Grenix",
    rating: 4.7,
    reviews: 176,
    tags: ["night-care", "anti-aging", "hydrating", "repair"],
    badge: "Night Ritual",
    ingredients: [
      "Niacinamide", "Glycerin", "Grape Seed Extract", "Turmeric Extract",
      "Fermented Rice Water", "Sunflower Seed Oil", "Hyaluronic Acid",
    ],
    benefits: [
      "Brightens & Evens Skin Tone", "Reduces Fine Lines & Wrinkles",
      "Deep Hydration", "Antioxidant Protection",
      "Strengthens Skin Barrier", "Improves Skin Texture",
    ],
    color: "#4a3f6b",
    category: "skincare",
  },
  "under-eye-roll-on-serum": {
    brand: "Unique Vibe Grenix",
    rating: 4.6,
    reviews: 98,
    tags: ["eye-care", "dark-circles", "depuffing", "roll-on"],
    ingredients: [
      "Niacinamide", "Glycerin", "Grape Seed Extract",
      "Turmeric Root Extract", "Sunflower Seed Oil", "Borage Seed Oil",
      "Hyaluronic Acid", "Olive Oil",
    ],
    benefits: [
      "Reduces Dark Circles", "Smooths Fine Lines", "Deep Hydration",
      "Soothes & Revitalizes Eyes", "Cooling Roller Effect",
      "Reduces Red Eye Puffiness",
    ],
    color: "#89b5c9",
    category: "skincare",
  },
  "anti-acne-face-wash": {
    brand: "Unique Vibe Grenix",
    rating: 4.5,
    reviews: 421,
    tags: ["acne", "cleansing", "exfoliation", "oil-control"],
    badge: "Top Rated",
    ingredients: [
      "Vitamin E", "Green Tea Extract", "Fermented Rice Water Extract",
      "Mulberry Extract", "Glycerin", "Lactic Acid", "Glycolic Acid",
      "Orange Fruit Extract", "Malic Acid", "Salicylic Acid",
    ],
    benefits: [
      "Deep Cleansing", "Helps Reduce Acne & Breakouts", "Mild Exfoliation",
      "Soothes & Calms Skin", "Maintains Skin Hydration",
      "Brightens Skin Tone", "Antioxidant Protection",
    ],
    color: "#6db56d",
    category: "skincare",
  },
  "face-cleanser": {
    brand: "Unique Vibe Grenix",
    rating: 4.6,
    reviews: 203,
    tags: ["cleansing", "hydrating", "gentle", "daily-use"],
    ingredients: [
      "Glycerin", "Coconut Water", "Green Tea Extract",
      "White Lotus Extract", "Fermented Rice Water",
      "Sodium Hyaluronate", "Shea Butter", "Hydrolyzed Rice Protein",
      "Lactic Acid",
    ],
    benefits: [
      "Deep Cleansing", "Helps Reduce Acne & Breakouts", "Mild Exfoliation",
      "Soothes & Calms Skin", "Maintains Skin Hydration",
      "Brightens Skin Tone", "Antioxidant Protection",
    ],
    color: "#c9dbc9",
    category: "skincare",
  },

  // ── Fragrances ──────────────────────────────────────────────────────────
  "attar-fool": {
    brand: "Unique Vibe Grenix",
    rating: 4.7,
    reviews: 189,
    tags: ["fragrance", "attar", "floral", "unisex"],
    badge: "Unisex",
    ingredients: [
      "Rose Damascena Extract", "Jasmine Sambac Oil", "Sandalwood Oil",
      "Musk", "Amber", "Vetiver",
    ],
    benefits: [
      "Sweet Floral Aroma", "Long-Lasting Fragrance",
      "Perfect for Daytime", "Alcohol-Free", "Skin-Friendly",
      "Unisex Appeal",
    ],
    color: "#e8a0b8",
    category: "fragrances",
  },
  "shubhash": {
    brand: "Unique Vibe Grenix",
    rating: 4.8,
    reviews: 215,
    tags: ["fragrance", "attar", "woody", "intense"],
    badge: "Intense",
    ingredients: [
      "Oudh Oil", "Sandalwood", "Cedarwood", "Musk",
      "Bergamot", "Patchouli",
    ],
    benefits: [
      "Bold & Captivating Scent", "Premium Oudh Base",
      "Long-Lasting 12+ Hours", "Perfect for Evenings",
      "Alcohol-Free", "Luxurious Aura",
    ],
    color: "#8b6f47",
    category: "fragrances",
  },
  "bts": {
    brand: "Unique Vibe Grenix",
    rating: 4.6,
    reviews: 167,
    tags: ["fragrance", "attar", "fresh", "bestseller"],
    badge: "Bestseller",
    ingredients: [
      "Citrus Oils", "White Musk", "Marine Accord",
      "Lavender", "Green Tea Extract", "Cedarwood",
    ],
    benefits: [
      "Fresh & Energetic Scent", "All-Day Freshness",
      "Perfect for Daily Wear", "Youthful & Modern",
      "Alcohol-Free", "Universally Loved",
    ],
    color: "#7eb8d4",
    category: "fragrances",
  },
  "lady-queen": {
    brand: "Unique Vibe Grenix",
    rating: 4.9,
    reviews: 243,
    tags: ["fragrance", "attar", "feminine", "premium"],
    badge: "For Her",
    ingredients: [
      "Bulgarian Rose Oil", "Peony Extract", "Vanilla Absolute",
      "White Jasmine", "Soft Musk", "Pink Pepper",
    ],
    benefits: [
      "Elegant Feminine Fragrance", "Rich Rose & Vanilla Notes",
      "Long-Lasting Allure", "Perfect for Special Occasions",
      "Alcohol-Free", "Premium Packaging",
    ],
    color: "#d4789c",
    category: "fragrances",
  },
};

const defaultEnrichment: Enrichment = {
  brand: "Unique Vibe Grenix",
  rating: 4.5,
  reviews: 0,
  tags: [],
  category: "",
};

// ─── Mappers ─────────────────────────────────────────────────────────────────

/** Optional map from category UUID → slug, built from API categories */
export type CategoryMap = Record<string, string>;

/** Map a full ApiProduct (detail endpoint) → frontend Product */
export function mapApiProductToProduct(p: ApiProduct, categoryMap?: CategoryMap): Product {
  const enrichment = enrichments[p.slug] || defaultEnrichment;
  const primaryImage =
    p.images.find((img) => img.is_primary)?.url ||
    p.images[0]?.url ||
    "/placeholder.jpg";

  // Prefer enrichment category, fall back to categoryMap lookup
  const category =
    enrichment.category || (categoryMap && p.category_id ? categoryMap[p.category_id] : "") || "skincare";

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: enrichment.brand,
    price: p.price,
    originalPrice: p.compare_at_price ?? undefined,
    description: p.description || "",
    shortDescription: p.short_description || "",
    category,
    tags: enrichment.tags,
    rating: enrichment.rating,
    reviews: enrichment.reviews,
    image: primaryImage,
    images: p.images.length > 0 ? p.images.map((img) => img.url) : [primaryImage],
    badge: enrichment.badge,
    ingredients: enrichment.ingredients,
    benefits: enrichment.benefits,
    color: enrichment.color,
  };
}

/** Map a lightweight ApiProductListItem → frontend Product */
export function mapListItemToProduct(p: ApiProductListItem, categoryMap?: CategoryMap): Product {
  const enrichment = enrichments[p.slug] || defaultEnrichment;
  const image = p.primary_image || "/placeholder.jpg";

  // Prefer enrichment category, fall back to categoryMap lookup
  const category =
    enrichment.category || (categoryMap && p.category_id ? categoryMap[p.category_id] : "") || "skincare";

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: enrichment.brand,
    price: p.price,
    originalPrice: p.compare_at_price ?? undefined,
    description: "",
    shortDescription: p.short_description || "",
    category,
    tags: enrichment.tags,
    rating: enrichment.rating,
    reviews: enrichment.reviews,
    image,
    images: [image],
    badge: enrichment.badge,
    ingredients: enrichment.ingredients,
    benefits: enrichment.benefits,
    color: enrichment.color,
  };
}
