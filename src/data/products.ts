export interface Product {
  id: string;
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

export const categories = [
  { id: "all", name: "All Products", icon: "✨" },
  { id: "skincare", name: "Skincare", icon: "🧴" },
  { id: "fragrances", name: "Fragrances", icon: "🌸" },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Vitamin C Face Serum",
    brand: "Unique Vibe Grenix",
    price: 549,
    originalPrice: 799,
    description:
      "A powerful brightening serum formulated with Ascorbic Acid and Kakadu Plum Extract — one of the world's richest natural sources of Vitamin C. Enhanced with Niacinamide and Ferulic Acid for superior antioxidant protection, while Sodium Hyaluronate delivers deep hydration. Licorice and Mulberry Extracts work synergistically to fade dark spots and pigmentation, revealing a luminous, even complexion.",
    shortDescription:
      "Brightening face serum with Kakadu Plum & Niacinamide for radiant, even-toned skin",
    category: "skincare",
    tags: ["brightening", "hydrating", "vitamin-c", "bestseller"],
    rating: 4.8,
    reviews: 234,
    image:
      "http://localhost:9002/grenix-media/products/vitamin-c-face-serum.jpg",
    images: [
      "http://localhost:9002/grenix-media/products/vitamin-c-face-serum.jpg",
    ],
    badge: "Bestseller",
    ingredients: [
      "Ascorbic Acid",
      "Kakadu Plum Extract",
      "Niacinamide",
      "Ferulic Acid",
      "Sodium Hyaluronate",
      "Licorice Extract",
      "Mulberry Extract",
      "Grape Seed Extract",
      "Scutellaria Baicalensis Root Extract",
      "Suffruticosa Root Extract",
      "Glycerin",
      "Citric Acid",
      "Sodium Citrate",
      "Sodium PCA",
      "Saccharide",
    ],
    benefits: [
      "Brightens Skin Tone",
      "Deep Hydration",
      "Reduces Dark Spots & Pigmentation",
      "Powerful Antioxidant Protection",
      "Improves Skin Texture",
      "Soothes & Calms Skin",
    ],
    color: "#f0c75e",
  },
  {
    id: "2",
    name: "Tinted Sunscreen SPF 50",
    brand: "Unique Vibe Grenix",
    price: 599,
    originalPrice: 899,
    description:
      "A lightweight, tinted sunscreen with SPF 50 that provides broad spectrum UV protection while giving your skin a smooth, natural-looking finish. Infused with Green Tea Extract and Shea Butter for powerful antioxidant defense, and Fermented Rice Water for skin brightening. Niacinamide helps even out skin tone while Jojoba Oil and Coffee Extract keep skin nourished and energized throughout the day.",
    shortDescription:
      "Broad spectrum tinted sunscreen with Green Tea & Fermented Rice Water for natural coverage",
    category: "skincare",
    tags: ["sunscreen", "spf-50", "tinted", "uv-protection"],
    rating: 4.7,
    reviews: 156,
    image:
      "http://localhost:9002/grenix-media/products/tinted-sunscreen-spf-50.jpg",
    images: [
      "http://localhost:9002/grenix-media/products/tinted-sunscreen-spf-50.jpg",
    ],
    badge: "SPF 50",
    ingredients: [
      "Butyloctyl Salicylate",
      "Sulfonic Acid",
      "Green Tea Extract",
      "Shea Butter",
      "Fermented Rice Water",
      "Jojoba Oil",
      "Coffea Arabica (Coffee)",
      "Niacinamide",
    ],
    benefits: [
      "Broad Spectrum UV Protection",
      "Brightens & Evens Skin Tone",
      "Strong Antioxidant Defense",
      "Soothes & Repairs Skin",
      "Smooth & Even Finish",
      "Natural Skin Tone Coverage",
    ],
    color: "#e8c47a",
  },
  {
    id: "3",
    name: "Night Cream",
    brand: "Unique Vibe Grenix",
    price: 649,
    originalPrice: 999,
    description:
      "A rich, nourishing night cream that works while you sleep to brighten, hydrate, and repair your skin. Powered by Niacinamide for skin tone correction, Grape Seed Extract and Turmeric Extract for antioxidant protection, and Fermented Rice Water for a natural glow. Sunflower Seed Oil strengthens the skin barrier while Hyaluronic Acid provides intense overnight hydration. Wake up to visibly smoother, firmer, and more radiant skin.",
    shortDescription:
      "Nourishing night cream with Niacinamide, Turmeric & Hyaluronic Acid for overnight repair",
    category: "skincare",
    tags: ["night-care", "anti-aging", "hydrating", "repair"],
    rating: 4.7,
    reviews: 176,
    image: "http://localhost:9002/grenix-media/products/night-cream.jpg",
    images: [
      "http://localhost:9002/grenix-media/products/night-cream.jpg",
    ],
    badge: "Night Ritual",
    ingredients: [
      "Niacinamide",
      "Glycerin",
      "Grape Seed Extract",
      "Turmeric Extract",
      "Fermented Rice Water",
      "Sunflower Seed Oil",
      "Hyaluronic Acid",
    ],
    benefits: [
      "Brightens & Evens Skin Tone",
      "Reduces Fine Lines & Wrinkles",
      "Deep Hydration",
      "Antioxidant Protection",
      "Strengthens Skin Barrier",
      "Improves Skin Texture",
    ],
    color: "#4a3f6b",
  },
  {
    id: "4",
    name: "Under Eye Roll On Serum",
    brand: "Unique Vibe Grenix",
    price: 449,
    originalPrice: 699,
    description:
      "A targeted under-eye treatment with a cooling roller applicator that instantly soothes and depuffs tired eyes. Niacinamide and Turmeric Root Extract brighten stubborn dark circles, while Grape Seed Extract and Hyaluronic Acid deliver deep hydration to the delicate under-eye area. Sunflower Seed Oil, Borage Seed Oil, and Olive Oil provide nourishment to smooth fine lines and revitalize the eye contour.",
    shortDescription:
      "Cooling roll-on serum with Niacinamide, Turmeric & Hyaluronic Acid for dark circles",
    category: "skincare",
    tags: ["eye-care", "dark-circles", "depuffing", "roll-on"],
    rating: 4.6,
    reviews: 98,
    image:
      "http://localhost:9002/grenix-media/products/under-eye-roll-on-serum.jpg",
    images: [
      "http://localhost:9002/grenix-media/products/under-eye-roll-on-serum.jpg",
    ],
    ingredients: [
      "Niacinamide",
      "Glycerin",
      "Grape Seed Extract",
      "Turmeric Root Extract",
      "Sunflower Seed Oil",
      "Borage Seed Oil",
      "Hyaluronic Acid",
      "Olive Oil",
    ],
    benefits: [
      "Reduces Dark Circles",
      "Smooths Fine Lines",
      "Deep Hydration",
      "Soothes & Revitalizes Eyes",
      "Cooling Roller Effect",
      "Reduces Red Eye Puffiness",
    ],
    color: "#89b5c9",
  },
  {
    id: "5",
    name: "Anti-Acne Face Wash",
    brand: "Unique Vibe Grenix",
    price: 399,
    originalPrice: 599,
    description:
      "A gentle yet effective anti-acne face wash that deeply cleanses without stripping your skin's natural moisture. Salicylic Acid and Glycolic Acid provide mild exfoliation to unclog pores, while Green Tea and Fermented Rice Water Extract soothe inflammation. Vitamin E and Mulberry Extract protect and brighten, and Orange Fruit Extract provides a refreshing cleansing experience. Perfect for acne-prone and oily skin types.",
    shortDescription:
      "Deep cleansing face wash with Salicylic Acid, Green Tea & Fermented Rice Water",
    category: "skincare",
    tags: ["acne", "cleansing", "exfoliation", "oil-control"],
    rating: 4.5,
    reviews: 421,
    image:
      "http://localhost:9002/grenix-media/products/anti-acne-face-wash.jpg",
    images: [
      "http://localhost:9002/grenix-media/products/anti-acne-face-wash.jpg",
    ],
    badge: "Top Rated",
    ingredients: [
      "Vitamin E",
      "Green Tea Extract",
      "Fermented Rice Water Extract",
      "Mulberry Extract",
      "Glycerin",
      "Lactic Acid",
      "Glycolic Acid",
      "Orange Fruit Extract",
      "Malic Acid",
      "Salicylic Acid",
    ],
    benefits: [
      "Deep Cleansing",
      "Helps Reduce Acne & Breakouts",
      "Mild Exfoliation",
      "Soothes & Calms Skin",
      "Maintains Skin Hydration",
      "Brightens Skin Tone",
      "Antioxidant Protection",
    ],
    color: "#6db56d",
  },
  {
    id: "6",
    name: "Face Cleanser",
    brand: "Unique Vibe Grenix",
    price: 349,
    originalPrice: 549,
    description:
      "A mild, hydrating daily cleanser suitable for all skin types. Coconut Water and Sodium Hyaluronate deliver instant hydration, while Green Tea Extract and White Lotus Extract provide powerful antioxidant protection. Fermented Rice Water brightens and evens skin tone, Shea Butter maintains the moisture barrier, and Lactic Acid offers gentle exfoliation for a fresh, clean canvas.",
    shortDescription:
      "Gentle daily cleanser with Coconut Water, White Lotus & Fermented Rice Water",
    category: "skincare",
    tags: ["cleansing", "hydrating", "gentle", "daily-use"],
    rating: 4.6,
    reviews: 203,
    image: "http://localhost:9002/grenix-media/products/face-cleanser.jpg",
    images: [
      "http://localhost:9002/grenix-media/products/face-cleanser.jpg",
    ],
    ingredients: [
      "Glycerin",
      "Coconut Water",
      "Green Tea Extract",
      "White Lotus Extract",
      "Fermented Rice Water",
      "Sodium Hyaluronate",
      "Shea Butter",
      "Hydrolyzed Rice Protein",
      "Lactic Acid",
    ],
    benefits: [
      "Deep Cleansing",
      "Helps Reduce Acne & Breakouts",
      "Mild Exfoliation",
      "Soothes & Calms Skin",
      "Maintains Skin Hydration",
      "Brightens Skin Tone",
      "Antioxidant Protection",
    ],
    color: "#c9dbc9",
  },
  // ── Fragrances ──────────────────────────────────────────────────────────
  {
    id: "7",
    name: "Attar Fool",
    brand: "Unique Vibe Grenix",
    price: 499,
    originalPrice: 799,
    description:
      "Attar Fool is a timeless floral fragrance distilled from the finest rose petals using traditional methods. Its sweet, delicate aroma is uplifting and refreshing, making it the perfect daytime companion. This pure attar is alcohol-free and skin-safe, designed to be applied directly on pulse points for a subtle, long-lasting scent.\n\nFRAGRANCE PROFILE:\n• Top Notes: Fresh Rose, Dewy Petals\n• Heart Notes: Sweet Jasmine, Soft Musk\n• Base Notes: Warm Sandalwood, Light Amber\n\nDETAILS:\n• Type: Pure Attar (Alcohol-Free)\n• Ideal For: Men & Women\n• Best For: Daytime Wear\n• Application: Apply on pulse points — wrists, neck, behind ears\n• Longevity: 6–8 hours",
    shortDescription:
      "Sweet floral attar perfect for daytime wear — loved by both men and women",
    category: "fragrances",
    tags: ["floral", "unisex", "daytime", "attar"],
    rating: 4.7,
    reviews: 112,
    image:
      "http://localhost:9002/grenix-media/products/attar-fool.png",
    images: [
      "http://localhost:9002/grenix-media/products/attar-fool.png",
    ],
    badge: "Unisex",
    ingredients: [
      "Rose Petal Extract",
      "Jasmine Essential Oil",
      "Sandalwood Oil",
      "Musk",
      "Light Amber",
    ],
    benefits: [
      "Sweet Floral Aroma",
      "Long-Lasting (6–8 hrs)",
      "Alcohol-Free & Skin-Safe",
      "Perfect for Daytime",
      "Suitable for Men & Women",
    ],
    color: "#f5d0d0",
  },
  {
    id: "8",
    name: "Shubhash",
    brand: "Unique Vibe Grenix",
    price: 599,
    originalPrice: 999,
    description:
      "Shubhash is a rich, powerful fragrance with deep oud and woody undertones that command attention. Crafted for those who love a strong, lingering scent, this attar is perfect for evening occasions and nighttime wear. Its complex composition unfolds beautifully over hours, revealing layers of warmth, spice, and sophistication.\n\nFRAGRANCE PROFILE:\n• Top Notes: Spicy Saffron, Black Pepper\n• Heart Notes: Deep Oud, Rich Amber\n• Base Notes: Dark Musk, Vetiver, Leather\n\nDETAILS:\n• Type: Pure Attar (Alcohol-Free)\n• Ideal For: Men & Women\n• Best For: Nighttime Wear\n• Application: Apply on skin — wrists, neck, chest\n• Longevity: 8–12 hours",
    shortDescription:
      "Bold, intense attar with a strong aroma — ideal for nighttime allure",
    category: "fragrances",
    tags: ["intense", "nighttime", "oud", "attar"],
    rating: 4.8,
    reviews: 87,
    image:
      "http://localhost:9002/grenix-media/products/shubhash.png",
    images: [
      "http://localhost:9002/grenix-media/products/shubhash.png",
    ],
    badge: "Intense",
    ingredients: [
      "Saffron Extract",
      "Black Pepper Oil",
      "Oud Wood Oil",
      "Rich Amber",
      "Dark Musk",
      "Vetiver",
      "Leather Accord",
    ],
    benefits: [
      "Strong & Commanding Scent",
      "Long-Lasting (8–12 hrs)",
      "Alcohol-Free & Skin-Safe",
      "Perfect for Nighttime",
      "Suitable for Men & Women",
    ],
    color: "#3a2a1a",
  },
  {
    id: "9",
    name: "BTS",
    brand: "Unique Vibe Grenix",
    price: 549,
    originalPrice: 899,
    description:
      "BTS is a bold, unapologetically masculine fragrance built on deep woody and smoky foundations. Its powerful projection and exceptional longevity make it a signature scent that leaves a lasting impression. While crafted with men in mind, its sophisticated profile is equally appreciated by women who love strong, confident fragrances.\n\nFRAGRANCE PROFILE:\n• Top Notes: Bergamot, Fresh Spice\n• Heart Notes: Cedarwood, Oud, Tobacco\n• Base Notes: Smoky Musk, Leather, Patchouli\n\nDETAILS:\n• Type: Pure Attar (Alcohol-Free)\n• Ideal For: Primarily Men (Unisex)\n• Best For: All Day Wear\n• Application: Apply on skin only — wrists, neck, behind ears\n• Longevity: 10–14 hours",
    shortDescription:
      "Strong, masculine attar with bold woody notes — best for men",
    category: "fragrances",
    tags: ["masculine", "woody", "strong", "attar", "bestseller"],
    rating: 4.9,
    reviews: 198,
    image:
      "http://localhost:9002/grenix-media/products/bts.png",
    images: [
      "http://localhost:9002/grenix-media/products/bts.png",
    ],
    badge: "Bestseller",
    ingredients: [
      "Bergamot Oil",
      "Cedarwood Oil",
      "Oud Wood Oil",
      "Tobacco Accord",
      "Smoky Musk",
      "Leather Accord",
      "Patchouli Oil",
    ],
    benefits: [
      "Bold & Masculine Scent",
      "Exceptional Longevity (10–14 hrs)",
      "Alcohol-Free & Skin-Safe",
      "Perfect for All Day Wear",
      "Best for Men, Women Can Use Too",
    ],
    color: "#2a3a2a",
  },
  {
    id: "10",
    name: "Lady Queen",
    brand: "Unique Vibe Grenix",
    price: 549,
    originalPrice: 899,
    description:
      "Lady Queen is a graceful, feminine fragrance that embodies elegance and charm. With its sweet floral heart and soft powdery finish, it's designed to make every woman feel like royalty. The delicate balance of fruity top notes and warm vanilla base creates an irresistible, sophisticated aura that lasts throughout the day.\n\nFRAGRANCE PROFILE:\n• Top Notes: Sweet Peach, Pink Berry\n• Heart Notes: White Jasmine, Lily of the Valley, Rose\n• Base Notes: Soft Vanilla, Warm Musk, Cashmere Wood\n\nDETAILS:\n• Type: Pure Attar (Alcohol-Free)\n• Ideal For: Women\n• Best For: Daytime & Evening\n• Application: Apply on pulse points — wrists, neck, behind ears\n• Longevity: 8–10 hours",
    shortDescription:
      "Elegant, sweet fragrance crafted exclusively for women — soft & captivating",
    category: "fragrances",
    tags: ["feminine", "sweet", "floral", "attar"],
    rating: 4.8,
    reviews: 156,
    image:
      "http://localhost:9002/grenix-media/products/lady-queen.png",
    images: [
      "http://localhost:9002/grenix-media/products/lady-queen.png",
    ],
    badge: "For Her",
    ingredients: [
      "Peach Extract",
      "Pink Berry Oil",
      "White Jasmine",
      "Lily of the Valley",
      "Rose Oil",
      "Soft Vanilla",
      "Warm Musk",
      "Cashmere Wood",
    ],
    benefits: [
      "Elegant & Feminine Scent",
      "Long-Lasting (8–10 hrs)",
      "Alcohol-Free & Skin-Safe",
      "Perfect for Daytime & Evening",
      "Exclusively Crafted for Women",
    ],
    color: "#f0c8d8",
  },
];

export const featuredProducts = products.filter((p) =>
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].includes(p.id)
);

export const bestSellers = products.filter(
  (p) => p.tags.includes("bestseller") || p.rating >= 4.7
);
