import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import CartProvider from "@/components/cart/CartProvider";
import AuthProvider from "@/lib/AuthProvider";
import ThemeProvider from "@/lib/ThemeProvider";
import LayoutShell from "@/components/layout/LayoutShell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://grenix.store"),
  title: {
    default: "Unique Vibe Grenix | Premium Skincare & Fragrance",
    template: "%s | Unique Vibe Grenix",
  },
  description:
    "Shop premium skincare serums, face wash, sunscreen & luxury fragrances by Unique Vibe Grenix. Professional-grade beauty products delivered across India.",
  keywords: [
    "unique vibe grenix",
    "grenix",
    "premium skincare india",
    "vitamin c serum india",
    "tinted sunscreen spf 50",
    "luxury fragrance india",
    "bts itra",
    "face serum",
    "foaming face wash",
    "beauty products online india",
    "professional skincare",
  ],
  authors: [{ name: "Unique Vibe Grenix", url: "https://grenix.store" }],
  creator: "Unique Vibe Grenix",
  publisher: "Unique Vibe Grenix",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://grenix.store",
    siteName: "Unique Vibe Grenix",
    title: "Unique Vibe Grenix | Premium Skincare & Fragrance",
    description:
      "Shop premium skincare serums, face wash, sunscreen & luxury fragrances. Professional-grade beauty products delivered across India.",
    images: [
      {
        url: "/logo-final.png",
        width: 918,
        height: 612,
        alt: "Unique Vibe Grenix — Premium Beauty Products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Unique Vibe Grenix | Premium Skincare & Fragrance",
    description:
      "Shop premium skincare serums, face wash, sunscreen & luxury fragrances. Professional-grade beauty products delivered across India.",
    images: ["/logo-final.png"],
    creator: "@uniquevibegrenix",
  },
  alternates: {
    canonical: "https://grenix.store",
  },
  verification: {
    google: "", // Add your Google Search Console verification token here
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Unique Vibe Grenix",
              url: "https://grenix.store",
              logo: "https://grenix.store/logo-final.png",
              description:
                "Premium skincare and fragrance products by Unique Vibe Grenix. Professional-grade beauty essentials delivered across India.",
              email: "uniquevibegrenix@gmail.com",
              sameAs: ["https://www.instagram.com/uniquevibegrenix"],
              contactPoint: {
                "@type": "ContactPoint",
                email: "uniquevibegrenix@gmail.com",
                contactType: "customer service",
                availableLanguage: ["English", "Hindi"],
              },
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <LayoutShell>
                {children}
              </LayoutShell>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
