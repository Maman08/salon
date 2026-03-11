import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/ui/CustomCursor";
import SmoothScroll from "@/components/ui/SmoothScroll";
import CartProvider from "@/components/cart/CartProvider";
import ThemeProvider from "@/components/ui/ThemeProvider";

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
  title: "Unique Vibe Grenix | Premium Beauty Products",
  description:
    "Discover luxury beauty products crafted for the modern woman and man. Premium skincare, haircare, and beauty essentials — experience the vibe.",
  keywords: ["beauty", "skincare", "haircare", "premium", "luxury", "cosmetics"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        <ThemeProvider>
          <CartProvider>
            <SmoothScroll>
              <CustomCursor />
              <Navbar />
              <main>{children}</main>
              <Footer />
            </SmoothScroll>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
