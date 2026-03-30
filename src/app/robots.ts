import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/shop", "/about", "/product/"],
        disallow: ["/account", "/checkout", "/admin", "/wishlist", "/api/"],
      },
    ],
    sitemap: "https://grenix.store/sitemap.xml",
  };
}
