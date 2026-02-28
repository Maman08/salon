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
  usedInSalon?: boolean;
  color?: string;
}

export const categories = [
  { id: "all", name: "All Products", icon: "✨" },
  { id: "skincare", name: "Skincare", icon: "🧴" },
  { id: "haircare", name: "Haircare", icon: "💇" },
  { id: "makeup", name: "Makeup", icon: "💄" },
  { id: "fragrance", name: "Fragrance", icon: "🌸" },
  { id: "bodycare", name: "Body Care", icon: "🛁" },
  { id: "tools", name: "Tools", icon: "🪮" },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Luminous Rose Serum",
    brand: "Grenix Luxe",
    price: 2499,
    originalPrice: 3499,
    description:
      "A luxurious rose-infused serum that deeply hydrates and revitalizes your skin. Formulated with pure Bulgarian rose extract, hyaluronic acid, and vitamin C for a radiant, youthful glow. This salon-grade formula penetrates deep into the skin layers, providing 72-hour hydration while reducing fine lines and uneven skin tone.",
    shortDescription: "Rose-infused hydrating serum for radiant, youthful skin",
    category: "skincare",
    tags: ["hydrating", "anti-aging", "rose", "bestseller"],
    rating: 4.8,
    reviews: 234,
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1570194065650-d99fb4d8a609?w=600&h=600&fit=crop",
    ],
    badge: "Bestseller",
    ingredients: [
      "Bulgarian Rose Extract",
      "Hyaluronic Acid",
      "Vitamin C",
      "Niacinamide",
      "Jojoba Oil",
    ],
    usedInSalon: true,
    color: "#d4a0a0",
  },
  {
    id: "2",
    name: "Golden Elixir Hair Oil",
    brand: "Grenix Luxe",
    price: 1899,
    originalPrice: 2499,
    description:
      "Transform your hair with our signature golden elixir. A blend of argan, moroccan, and castor oils enriched with 24K gold particles that add incredible shine and strength. Used daily in our salon for premium treatments.",
    shortDescription: "24K gold-enriched hair oil for incredible shine",
    category: "haircare",
    tags: ["nourishing", "shine", "gold", "professional"],
    rating: 4.9,
    reviews: 189,
    image:
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&h=600&fit=crop",
    ],
    badge: "Salon Favorite",
    ingredients: [
      "Argan Oil",
      "Moroccan Oil",
      "Castor Oil",
      "24K Gold Particles",
      "Vitamin E",
    ],
    usedInSalon: true,
    color: "#c9a96e",
  },
  {
    id: "3",
    name: "Velvet Matte Lipstick",
    brand: "Grenix Beauty",
    price: 999,
    originalPrice: 1499,
    description:
      "Ultra-pigmented velvet matte finish lipstick that lasts up to 16 hours. Enriched with shea butter and vitamin E to keep lips moisturized while delivering intense color payoff. Available in 12 stunning shades inspired by precious gems.",
    shortDescription: "16-hour velvet matte lipstick in gem-inspired shades",
    category: "makeup",
    tags: ["long-lasting", "matte", "pigmented", "new"],
    rating: 4.7,
    reviews: 312,
    image:
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop",
    ],
    badge: "New Arrival",
    ingredients: [
      "Shea Butter",
      "Vitamin E",
      "Beeswax",
      "Iron Oxides",
      "Coconut Oil",
    ],
    usedInSalon: false,
    color: "#c94c4c",
  },
  {
    id: "4",
    name: "Midnight Oud Perfume",
    brand: "Grenix Noir",
    price: 4999,
    originalPrice: 6499,
    description:
      "An intoxicating blend of Arabian oud, Damascus rose, and warm amber. This unisex fragrance opens with sparkling bergamot and saffron, settling into a deep, mysterious base of sandalwood and musk. The signature scent of Unique Vibe Grenix.",
    shortDescription: "Luxurious unisex oud fragrance with rose & amber",
    category: "fragrance",
    tags: ["luxury", "oud", "unisex", "signature"],
    rating: 4.9,
    reviews: 156,
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&h=600&fit=crop",
    ],
    badge: "Signature",
    ingredients: [
      "Arabian Oud",
      "Damascus Rose",
      "Bergamot",
      "Saffron",
      "Sandalwood",
      "Musk",
    ],
    usedInSalon: true,
    color: "#2a1a3e",
  },
  {
    id: "5",
    name: "Keratin Silk Shampoo",
    brand: "Grenix Luxe",
    price: 1299,
    description:
      "Professional-grade keratin shampoo that repairs and strengthens damaged hair from root to tip. Sulfate-free formula gently cleanses while infusing keratin proteins deep into the hair shaft. The same formula we use for our premium salon treatments.",
    shortDescription: "Sulfate-free keratin repair shampoo",
    category: "haircare",
    tags: ["keratin", "repair", "sulfate-free", "professional"],
    rating: 4.6,
    reviews: 278,
    image:
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&h=600&fit=crop",
    ],
    ingredients: [
      "Keratin Protein",
      "Argan Oil",
      "Biotin",
      "Coconut Extract",
      "Aloe Vera",
    ],
    usedInSalon: true,
    color: "#7eb8c9",
  },
  {
    id: "6",
    name: "Diamond Glow Foundation",
    brand: "Grenix Beauty",
    price: 1799,
    originalPrice: 2299,
    description:
      "Buildable coverage foundation with light-reflecting diamond particles for a natural, luminous finish. Infused with SPF 30 and hyaluronic acid, this foundation blurs imperfections while keeping skin hydrated all day. Available in 24 inclusive shades.",
    shortDescription: "Diamond-infused foundation with SPF 30",
    category: "makeup",
    tags: ["foundation", "spf", "luminous", "inclusive"],
    rating: 4.5,
    reviews: 198,
    image:
      "https://images.unsplash.com/photo-1631214540553-ff044a3ff1d4?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1631214540553-ff044a3ff1d4?w=600&h=600&fit=crop",
    ],
    badge: "24 Shades",
    ingredients: [
      "Diamond Powder",
      "Hyaluronic Acid",
      "SPF 30",
      "Vitamin E",
      "Silica",
    ],
    usedInSalon: true,
    color: "#e8c99b",
  },
  {
    id: "7",
    name: "Moroccan Body Butter",
    brand: "Grenix Luxe",
    price: 1599,
    description:
      "Rich, whipped body butter infused with Moroccan argan oil, shea butter, and exotic coconut milk. Melts into skin on contact, providing deep nourishment and a subtle golden shimmer. Leaves skin silky soft for 48 hours.",
    shortDescription: "Whipped argan & shea body butter with golden shimmer",
    category: "bodycare",
    tags: ["moisturizing", "shimmer", "argan", "luxury"],
    rating: 4.7,
    reviews: 145,
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=600&fit=crop",
    ],
    ingredients: [
      "Argan Oil",
      "Shea Butter",
      "Coconut Milk",
      "Gold Mica",
      "Vitamin E",
    ],
    usedInSalon: false,
    color: "#d4b896",
  },
  {
    id: "8",
    name: "Professional Styling Brush Set",
    brand: "Grenix Pro",
    price: 3499,
    originalPrice: 4999,
    description:
      "A curated set of 12 premium styling brushes with ergonomic rose-gold handles and ultra-soft synthetic bristles. Each brush is designed for a specific technique — from seamless foundation blending to precise eye detailing. The same set used by our salon professionals.",
    shortDescription: "12-piece rose gold professional brush set",
    category: "tools",
    tags: ["brushes", "professional", "rose-gold", "set"],
    rating: 4.8,
    reviews: 167,
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop",
    ],
    badge: "Pro Kit",
    usedInSalon: true,
    color: "#c9a96e",
  },
  {
    id: "9",
    name: "Vitamin C Brightening Cream",
    brand: "Grenix Luxe",
    price: 1999,
    originalPrice: 2799,
    description:
      "Powerful brightening cream with 20% stabilized Vitamin C, alpha arbutin, and licorice extract. Visibly reduces dark spots and hyperpigmentation in just 4 weeks. Lightweight, non-greasy formula suitable for all skin types.",
    shortDescription: "20% Vitamin C cream for brighter, even-toned skin",
    category: "skincare",
    tags: ["brightening", "vitamin-c", "anti-pigmentation", "bestseller"],
    rating: 4.6,
    reviews: 421,
    image:
      "https://images.unsplash.com/photo-1570194065650-d99fb4d8a609?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1570194065650-d99fb4d8a609?w=600&h=600&fit=crop",
    ],
    badge: "Top Rated",
    ingredients: [
      "Vitamin C (20%)",
      "Alpha Arbutin",
      "Licorice Extract",
      "Niacinamide",
      "Squalane",
    ],
    usedInSalon: true,
    color: "#f0c75e",
  },
  {
    id: "10",
    name: "Orchid Bloom Eau de Parfum",
    brand: "Grenix Noir",
    price: 3299,
    description:
      "A feminine, floral masterpiece with rare orchid, white peony, and warm vanilla. Fresh top notes of pink pepper and pear dissolve into a heart of orchid and jasmine, resting on a base of creamy sandalwood and musk. Elegant and unforgettable.",
    shortDescription: "Floral orchid perfume with vanilla warmth",
    category: "fragrance",
    tags: ["floral", "feminine", "elegant", "orchid"],
    rating: 4.8,
    reviews: 98,
    image:
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&h=600&fit=crop",
    ],
    ingredients: [
      "Orchid Extract",
      "White Peony",
      "Vanilla",
      "Pink Pepper",
      "Sandalwood",
    ],
    usedInSalon: false,
    color: "#c987c9",
  },
  {
    id: "11",
    name: "Retinol Night Repair Mask",
    brand: "Grenix Luxe",
    price: 2199,
    originalPrice: 2999,
    description:
      "Overnight repair mask with encapsulated retinol, peptides, and squalane. Works while you sleep to stimulate cell renewal, boost collagen production, and repair daily damage. Wake up to visibly firmer, smoother, younger-looking skin.",
    shortDescription: "Overnight retinol mask for cell renewal & repair",
    category: "skincare",
    tags: ["retinol", "anti-aging", "night-care", "repair"],
    rating: 4.7,
    reviews: 176,
    image:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop",
    ],
    badge: "Night Ritual",
    ingredients: [
      "Retinol",
      "Peptides",
      "Squalane",
      "Ceramides",
      "Bakuchiol",
    ],
    usedInSalon: true,
    color: "#4a3f6b",
  },
  {
    id: "12",
    name: "Collagen Boost Eye Cream",
    brand: "Grenix Luxe",
    price: 1699,
    description:
      "Targeted eye cream with marine collagen, caffeine, and peptide complex. Reduces dark circles, puffiness, and crow's feet. The cooling ceramic applicator provides a spa-like experience with every use.",
    shortDescription: "Marine collagen eye cream with cooling applicator",
    category: "skincare",
    tags: ["eye-cream", "collagen", "depuffing", "dark-circles"],
    rating: 4.5,
    reviews: 203,
    image:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop",
    ],
    ingredients: [
      "Marine Collagen",
      "Caffeine",
      "Peptides",
      "Vitamin K",
      "Cucumber Extract",
    ],
    usedInSalon: true,
    color: "#89b5c9",
  },
];

export const featuredProducts = products.filter((p) =>
  ["1", "2", "4", "6", "9"].includes(p.id)
);

export const salonFavorites = products.filter((p) => p.usedInSalon);
