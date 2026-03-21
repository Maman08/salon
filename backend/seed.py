"""
Seed script for Grenix e-commerce backend.
Uploads product images to MinIO and populates the database with
categories, products, and an admin user.

Usage (from inside the backend container):
    python seed.py
"""

import asyncio
import os
import uuid
from pathlib import Path

import boto3
from botocore.client import Config as BotoConfig
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

# ── Config ────────────────────────────────────────────────────────────────────

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://grenix:grenix@db:5432/grenix")
S3_ENDPOINT_URL = os.getenv("S3_ENDPOINT_URL", "http://minio:9000")
S3_ACCESS_KEY = os.getenv("S3_ACCESS_KEY", "minioadmin")
S3_SECRET_KEY = os.getenv("S3_SECRET_KEY", "minioadmin")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME", "grenix-media")

# Public URL for images (from browser perspective, not docker internal)
# In dev: MinIO is exposed at host port 9002
# In prod: S3 bucket URL
S3_PUBLIC_URL = os.getenv(
    "S3_PUBLIC_URL",
    f"https://{S3_BUCKET_NAME}.s3.ap-south-1.amazonaws.com"
    if "amazonaws.com" in os.getenv("S3_ENDPOINT_URL", "")
    else "http://localhost:9002"
)

SEED_IMAGES_DIR = Path(__file__).parent / "seed_images"

ADMIN_EMAIL = "admin@grenix.com"
ADMIN_PASSWORD = "Admin@1234"
ADMIN_NAME = "Grenix Admin"


# ── S3 Client ─────────────────────────────────────────────────────────────────

def get_s3_client():
    return boto3.client(
        "s3",
        endpoint_url=S3_ENDPOINT_URL,
        aws_access_key_id=S3_ACCESS_KEY,
        aws_secret_access_key=S3_SECRET_KEY,
        config=BotoConfig(signature_version="s3v4"),
        region_name="ap-south-1",
    )


def upload_image(s3, filepath: Path, key: str) -> str:
    """Upload image to MinIO and return the public URL."""
    content_type = "image/jpeg" if filepath.suffix == ".jpg" else "image/png"
    s3.upload_file(
        str(filepath),
        S3_BUCKET_NAME,
        key,
        ExtraArgs={"ContentType": content_type},
    )
    return f"{S3_PUBLIC_URL}/{S3_BUCKET_NAME}/{key}"


# ── Product Data ──────────────────────────────────────────────────────────────

CATEGORIES = [
    {
        "name": "Skincare",
        "slug": "skincare",
        "description": "Premium skincare essentials crafted with powerful natural ingredients for radiant, healthy skin.",
    },
    {
        "name": "Fragrances",
        "slug": "fragrances",
        "description": "Exquisite attar-based fragrances — pure, long-lasting, and crafted for every mood.",
    },
]

PRODUCTS = [
    # ── Skincare ──────────────────────────────────────────────────────────
    {
        "name": "Vitamin C Face Serum",
        "slug": "vitamin-c-face-serum",
        "category_slug": "skincare",
        "price": 549,
        "compare_at_price": 799,
        "sku": "GRX-SERUM-001",
        "stock_quantity": 150,
        "is_featured": True,
        "short_description": "Brightening face serum with Kakadu Plum & Niacinamide for radiant, even-toned skin",
        "description": (
            "A powerful brightening serum formulated with Ascorbic Acid and Kakadu Plum Extract — "
            "one of the world's richest natural sources of Vitamin C. Enhanced with Niacinamide and "
            "Ferulic Acid for superior antioxidant protection, while Sodium Hyaluronate delivers deep "
            "hydration. Licorice and Mulberry Extracts work synergistically to fade dark spots and "
            "pigmentation, revealing a luminous, even complexion.\n\n"
            "BENEFITS:\n"
            "• Brightens Skin Tone\n"
            "• Deep Hydration\n"
            "• Reduces Dark Spots & Pigmentation\n"
            "• Powerful Antioxidant Protection\n"
            "• Improves Skin Texture\n"
            "• Soothes & Calms Skin\n\n"
            "INGREDIENTS:\n"
            "Ascorbic Acid, Kakadu Plum Extract, Niacinamide, Ferulic Acid, Sodium Hyaluronate, "
            "Licorice Extract, Mulberry Extract, Grape Seed Extract, Scutellaria Baicalensis Root Extract, "
            "Suffruticosa Root Extract, Glycerin, Citric Acid, Sodium Citrate, Sodium PCA, Saccharide"
        ),
        "image_file": "vitamin-c-face-serum.jpg",
        "badge": "Bestseller",
    },
    {
        "name": "Tinted Sunscreen SPF 50",
        "slug": "tinted-sunscreen-spf-50",
        "category_slug": "skincare",
        "price": 599,
        "compare_at_price": 899,
        "sku": "GRX-SUN-001",
        "stock_quantity": 120,
        "is_featured": True,
        "short_description": "Broad spectrum tinted sunscreen with Green Tea & Fermented Rice Water for natural coverage",
        "description": (
            "A lightweight, tinted sunscreen with SPF 50 that provides broad spectrum UV protection "
            "while giving your skin a smooth, natural-looking finish. Infused with Green Tea Extract "
            "and Shea Butter for powerful antioxidant defense, and Fermented Rice Water for skin "
            "brightening. Niacinamide helps even out skin tone while Jojoba Oil and Coffee Extract "
            "keep skin nourished and energized throughout the day.\n\n"
            "BENEFITS:\n"
            "• Broad Spectrum UV Protection\n"
            "• Brightens & Evens Skin Tone\n"
            "• Strong Antioxidant Defense\n"
            "• Soothes & Repairs Skin\n"
            "• Smooth & Even Finish\n"
            "• Natural Skin Tone Coverage\n\n"
            "INGREDIENTS:\n"
            "Butyloctyl Salicylate, Sulfonic Acid, Green Tea Extract, Shea Butter, "
            "Fermented Rice Water, Jojoba Oil, Coffea Arabica (Coffee), Niacinamide"
        ),
        "image_file": "tinted-sunscreen-spf-50.jpg",
        "badge": "SPF 50",
    },
    {
        "name": "Night Cream",
        "slug": "night-cream",
        "category_slug": "skincare",
        "price": 649,
        "compare_at_price": 999,
        "sku": "GRX-CREAM-001",
        "stock_quantity": 100,
        "is_featured": True,
        "short_description": "Nourishing night cream with Niacinamide, Turmeric & Hyaluronic Acid for overnight repair",
        "description": (
            "A rich, nourishing night cream that works while you sleep to brighten, hydrate, and "
            "repair your skin. Powered by Niacinamide for skin tone correction, Grape Seed Extract "
            "and Turmeric Extract for antioxidant protection, and Fermented Rice Water for a natural "
            "glow. Sunflower Seed Oil strengthens the skin barrier while Hyaluronic Acid provides "
            "intense overnight hydration. Wake up to visibly smoother, firmer, and more radiant skin.\n\n"
            "BENEFITS:\n"
            "• Brightens & Evens Skin Tone\n"
            "• Reduces Fine Lines & Wrinkles\n"
            "• Deep Hydration\n"
            "• Antioxidant Protection\n"
            "• Strengthens Skin Barrier\n"
            "• Improves Skin Texture\n\n"
            "INGREDIENTS:\n"
            "Niacinamide, Glycerin, Grape Seed Extract, Turmeric Extract, "
            "Fermented Rice Water, Sunflower Seed Oil, Hyaluronic Acid"
        ),
        "image_file": "night-cream.jpg",
        "badge": "Night Ritual",
    },
    {
        "name": "Under Eye Roll On Serum",
        "slug": "under-eye-roll-on-serum",
        "category_slug": "skincare",
        "price": 449,
        "compare_at_price": 699,
        "sku": "GRX-EYE-001",
        "stock_quantity": 130,
        "is_featured": True,
        "short_description": "Cooling roll-on serum with Niacinamide, Turmeric & Hyaluronic Acid for dark circles",
        "description": (
            "A targeted under-eye treatment with a cooling roller applicator that instantly soothes "
            "and depuffs tired eyes. Niacinamide and Turmeric Root Extract brighten stubborn dark "
            "circles, while Grape Seed Extract and Hyaluronic Acid deliver deep hydration to the "
            "delicate under-eye area. Sunflower Seed Oil, Borage Seed Oil, and Olive Oil provide "
            "nourishment to smooth fine lines and revitalize the eye contour.\n\n"
            "BENEFITS:\n"
            "• Reduces Dark Circles\n"
            "• Smooths Fine Lines\n"
            "• Deep Hydration\n"
            "• Soothes & Revitalizes Eyes\n"
            "• Cooling Roller Effect\n"
            "• Reduces Red Eye Puffiness\n\n"
            "INGREDIENTS:\n"
            "Niacinamide, Glycerin, Grape Seed Extract, Turmeric Root Extract, "
            "Sunflower Seed Oil, Borage Seed Oil, Hyaluronic Acid, Olive Oil"
        ),
        "image_file": "under-eye-roll-on-serum.jpg",
        "badge": None,
    },
    {
        "name": "Anti-Acne Face Wash",
        "slug": "anti-acne-face-wash",
        "category_slug": "skincare",
        "price": 399,
        "compare_at_price": 599,
        "sku": "GRX-WASH-001",
        "stock_quantity": 200,
        "is_featured": True,
        "short_description": "Deep cleansing face wash with Salicylic Acid, Green Tea & Fermented Rice Water",
        "description": (
            "A gentle yet effective anti-acne face wash that deeply cleanses without stripping "
            "your skin's natural moisture. Salicylic Acid and Glycolic Acid provide mild exfoliation "
            "to unclog pores, while Green Tea and Fermented Rice Water Extract soothe inflammation. "
            "Vitamin E and Mulberry Extract protect and brighten, and Orange Fruit Extract provides "
            "a refreshing cleansing experience. Perfect for acne-prone and oily skin types.\n\n"
            "BENEFITS:\n"
            "• Deep Cleansing\n"
            "• Helps Reduce Acne & Breakouts\n"
            "• Mild Exfoliation\n"
            "• Soothes & Calms Skin\n"
            "• Maintains Skin Hydration\n"
            "• Brightens Skin Tone\n"
            "• Antioxidant Protection\n\n"
            "INGREDIENTS:\n"
            "Vitamin E, Green Tea Extract, Fermented Rice Water Extract, Mulberry Extract, "
            "Glycerin, Lactic Acid, Glycolic Acid, Orange Fruit Extract, Malic Acid, Salicylic Acid"
        ),
        "image_file": "anti-acne-face-wash.jpg",
        "badge": "Top Rated",
    },
    {
        "name": "Face Cleanser",
        "slug": "face-cleanser",
        "category_slug": "skincare",
        "price": 349,
        "compare_at_price": 549,
        "sku": "GRX-CLEAN-001",
        "stock_quantity": 180,
        "is_featured": True,
        "short_description": "Gentle daily cleanser with Coconut Water, White Lotus & Fermented Rice Water",
        "description": (
            "A mild, hydrating daily cleanser suitable for all skin types. Coconut Water and "
            "Sodium Hyaluronate deliver instant hydration, while Green Tea Extract and White Lotus "
            "Extract provide powerful antioxidant protection. Fermented Rice Water brightens and "
            "evens skin tone, Shea Butter maintains the moisture barrier, and Lactic Acid offers "
            "gentle exfoliation for a fresh, clean canvas.\n\n"
            "BENEFITS:\n"
            "• Deep Cleansing\n"
            "• Helps Reduce Acne & Breakouts\n"
            "• Mild Exfoliation\n"
            "• Soothes & Calms Skin\n"
            "• Maintains Skin Hydration\n"
            "• Brightens Skin Tone\n"
            "• Antioxidant Protection\n\n"
            "INGREDIENTS:\n"
            "Glycerin, Coconut Water, Green Tea Extract, White Lotus Extract, "
            "Fermented Rice Water, Sodium Hyaluronate, Shea Butter, Hydrolyzed Rice Protein, Lactic Acid"
        ),
        "image_file": "face-cleanser.jpg",
        "badge": None,
    },
    # ── Fragrances ────────────────────────────────────────────────────────
    {
        "name": "Attar Fool",
        "slug": "attar-fool",
        "category_slug": "fragrances",
        "price": 499,
        "compare_at_price": 799,
        "sku": "GRX-FRAG-001",
        "stock_quantity": 80,
        "is_featured": True,
        "short_description": "Sweet floral attar perfect for daytime wear — loved by both men and women",
        "description": (
            "Attar Fool is a timeless floral fragrance distilled from the finest rose petals "
            "using traditional methods. Its sweet, delicate aroma is uplifting and refreshing, "
            "making it the perfect daytime companion. This pure attar is alcohol-free and skin-safe, "
            "designed to be applied directly on pulse points for a subtle, long-lasting scent.\n\n"
            "FRAGRANCE PROFILE:\n"
            "• Top Notes: Fresh Rose, Dewy Petals\n"
            "• Heart Notes: Sweet Jasmine, Soft Musk\n"
            "• Base Notes: Warm Sandalwood, Light Amber\n\n"
            "DETAILS:\n"
            "• Type: Pure Attar (Alcohol-Free)\n"
            "• Ideal For: Men & Women\n"
            "• Best For: Daytime Wear\n"
            "• Application: Apply on pulse points — wrists, neck, behind ears\n"
            "• Longevity: 6–8 hours"
        ),
        "image_file": "attar-fool.png",
        "badge": "Unisex",
    },
    {
        "name": "Shubhash",
        "slug": "shubhash",
        "category_slug": "fragrances",
        "price": 599,
        "compare_at_price": 999,
        "sku": "GRX-FRAG-002",
        "stock_quantity": 60,
        "is_featured": True,
        "short_description": "Bold, intense attar with a strong aroma — ideal for nighttime allure",
        "description": (
            "Shubhash is a rich, powerful fragrance with deep oud and woody undertones that "
            "command attention. Crafted for those who love a strong, lingering scent, this attar "
            "is perfect for evening occasions and nighttime wear. Its complex composition unfolds "
            "beautifully over hours, revealing layers of warmth, spice, and sophistication.\n\n"
            "FRAGRANCE PROFILE:\n"
            "• Top Notes: Spicy Saffron, Black Pepper\n"
            "• Heart Notes: Deep Oud, Rich Amber\n"
            "• Base Notes: Dark Musk, Vetiver, Leather\n\n"
            "DETAILS:\n"
            "• Type: Pure Attar (Alcohol-Free)\n"
            "• Ideal For: Men & Women\n"
            "• Best For: Nighttime Wear\n"
            "• Application: Apply on skin — wrists, neck, chest\n"
            "• Longevity: 8–12 hours"
        ),
        "image_file": "shubhash.png",
        "badge": "Intense",
    },
    {
        "name": "BTS",
        "slug": "bts",
        "category_slug": "fragrances",
        "price": 549,
        "compare_at_price": 899,
        "sku": "GRX-FRAG-003",
        "stock_quantity": 70,
        "is_featured": True,
        "short_description": "Strong, masculine attar with bold woody notes — perfect for men",
        "description": (
            "BTS is a bold, unapologetically masculine fragrance built on deep woody and smoky "
            "foundations. Its powerful projection and exceptional longevity make it a signature "
            "scent that leaves a lasting impression. While crafted with men in mind, its sophisticated "
            "profile is equally appreciated by women who love strong, confident fragrances.\n\n"
            "FRAGRANCE PROFILE:\n"
            "• Top Notes: Bergamot, Fresh Spice\n"
            "• Heart Notes: Cedarwood, Oud, Tobacco\n"
            "• Base Notes: Smoky Musk, Leather, Patchouli\n\n"
            "DETAILS:\n"
            "• Type: Pure Attar (Alcohol-Free)\n"
            "• Ideal For: Primarily Men (Unisex)\n"
            "• Best For: All Day Wear\n"
            "• Application: Apply on skin only — wrists, neck, behind ears\n"
            "• Longevity: 10–14 hours"
        ),
        "image_file": "bts.png",
        "badge": "Bestseller",
    },
    {
        "name": "Lady Queen",
        "slug": "lady-queen",
        "category_slug": "fragrances",
        "price": 549,
        "compare_at_price": 899,
        "sku": "GRX-FRAG-004",
        "stock_quantity": 90,
        "is_featured": True,
        "short_description": "Elegant, sweet fragrance crafted exclusively for women — soft & captivating",
        "description": (
            "Lady Queen is a graceful, feminine fragrance that embodies elegance and charm. "
            "With its sweet floral heart and soft powdery finish, it's designed to make every woman "
            "feel like royalty. The delicate balance of fruity top notes and warm vanilla base "
            "creates an irresistible, sophisticated aura that lasts throughout the day.\n\n"
            "FRAGRANCE PROFILE:\n"
            "• Top Notes: Sweet Peach, Pink Berry\n"
            "• Heart Notes: White Jasmine, Lily of the Valley, Rose\n"
            "• Base Notes: Soft Vanilla, Warm Musk, Cashmere Wood\n\n"
            "DETAILS:\n"
            "• Type: Pure Attar (Alcohol-Free)\n"
            "• Ideal For: Women\n"
            "• Best For: Daytime & Evening\n"
            "• Application: Apply on pulse points — wrists, neck, behind ears\n"
            "• Longevity: 8–10 hours"
        ),
        "image_file": "lady-queen.png",
        "badge": "For Her",
    },
]


# ── Seed Logic ────────────────────────────────────────────────────────────────

async def seed():
    print("🌱 Starting Grenix database seed...\n")

    # ── Upload images to MinIO ────────────────────────────────────────────
    print("📸 Uploading product images to MinIO...")
    s3 = get_s3_client()
    image_urls: dict[str, str] = {}

    for product in PRODUCTS:
        filename = product["image_file"]
        filepath = SEED_IMAGES_DIR / filename
        if not filepath.exists():
            print(f"   ⚠️  Image not found: {filepath}")
            continue
        key = f"products/{filename}"
        url = upload_image(s3, filepath, key)
        image_urls[filename] = url
        print(f"   ✅ {filename} → {key}")

    print(f"\n   Uploaded {len(image_urls)}/{len(PRODUCTS)} images.\n")

    # ── Database ──────────────────────────────────────────────────────────
    engine = create_async_engine(DATABASE_URL, echo=False)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as db:
        # ── Check if already seeded ───────────────────────────────────────
        result = await db.execute(text("SELECT COUNT(*) FROM products"))
        count = result.scalar()
        if count and count > 0:
            print(f"⚠️  Database already has {count} products. Skipping seed.")
            print("   To re-seed, truncate the tables first:")
            print("   TRUNCATE products, product_images, categories, users CASCADE;")
            await engine.dispose()
            return

        # ── Create admin user ─────────────────────────────────────────────
        print("👤 Creating admin user...")
        import bcrypt
        hashed_pw = bcrypt.hashpw(ADMIN_PASSWORD.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        admin_id = uuid.uuid4()

        existing = await db.execute(
            text("SELECT id FROM users WHERE email = :email"),
            {"email": ADMIN_EMAIL},
        )
        if existing.fetchone():
            print(f"   ⏭️  Admin user already exists, skipping.\n")
        else:
            await db.execute(
                text("""
                    INSERT INTO users (id, email, hashed_password, full_name, role, is_active, created_at, updated_at)
                    VALUES (:id, :email, :pw, :name, 'ADMIN', true, NOW(), NOW())
                """),
                {"id": str(admin_id), "email": ADMIN_EMAIL, "pw": hashed_pw, "name": ADMIN_NAME},
            )
            print(f"   ✅ Admin: {ADMIN_EMAIL} / {ADMIN_PASSWORD}\n")

        # ── Create categories ─────────────────────────────────────────────
        print("📁 Creating categories...")
        category_ids: dict[str, str] = {}

        for cat in CATEGORIES:
            cat_id = uuid.uuid4()
            category_ids[cat["slug"]] = str(cat_id)
            await db.execute(
                text("""
                    INSERT INTO categories (id, name, slug, description, is_active, created_at, updated_at)
                    VALUES (:id, :name, :slug, :desc, true, NOW(), NOW())
                """),
                {"id": str(cat_id), "name": cat["name"], "slug": cat["slug"], "desc": cat["description"]},
            )
            print(f"   ✅ {cat['name']}")

        print()

        # ── Create products ───────────────────────────────────────────────
        print("🛍️  Creating products...")
        for product in PRODUCTS:
            product_id = uuid.uuid4()
            cat_id = category_ids[product["category_slug"]]

            await db.execute(
                text("""
                    INSERT INTO products
                        (id, name, slug, description, short_description, price, compare_at_price,
                         sku, stock_quantity, category_id, is_active, is_featured, created_at, updated_at)
                    VALUES
                        (:id, :name, :slug, :desc, :short_desc, :price, :compare_price,
                         :sku, :stock, :cat_id, true, :featured, NOW(), NOW())
                """),
                {
                    "id": str(product_id),
                    "name": product["name"],
                    "slug": product["slug"],
                    "desc": product["description"],
                    "short_desc": product["short_description"],
                    "price": product["price"],
                    "compare_price": product.get("compare_at_price"),
                    "sku": product["sku"],
                    "stock": product["stock_quantity"],
                    "cat_id": cat_id,
                    "featured": product["is_featured"],
                },
            )

            # ── Product image ─────────────────────────────────────────────
            image_file = product["image_file"]
            if image_file in image_urls:
                image_id = uuid.uuid4()
                await db.execute(
                    text("""
                        INSERT INTO product_images (id, product_id, url, alt_text, is_primary, sort_order)
                        VALUES (:id, :pid, :url, :alt, true, 0)
                    """),
                    {
                        "id": str(image_id),
                        "pid": str(product_id),
                        "url": image_urls[image_file],
                        "alt": product["name"],
                    },
                )

            print(f"   ✅ {product['name']} — ₹{product['price']}")

        await db.commit()
        print(f"\n🎉 Seed complete! Created {len(PRODUCTS)} products.\n")

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed())
