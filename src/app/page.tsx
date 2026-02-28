import HeroSection from "@/components/home/HeroSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import SalonStory from "@/components/home/SalonStory";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import TrustBanner from "@/components/home/TrustBanner";
import CTASection from "@/components/home/CTASection";
import WelcomeIntro from "@/components/ui/WelcomeIntro";

export default function Home() {
  return (
    <WelcomeIntro>
      <div className="noise">
        <HeroSection />
        <CategoryShowcase />
        <FeaturedProducts />
        <SalonStory />
        <TestimonialsSection />
        <TrustBanner />
        <CTASection />
      </div>
    </WelcomeIntro>
  );
}
