import { Hero } from "@/components/home/Hero";
import { BestSellersSection } from "@/components/home/BestSellersSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { NewArrivalsSection } from "@/components/home/NewArrivalsSection";
import { FeaturedProductsSection } from "@/components/home/FeaturedProductsSection";
import { CategoryTilesSection } from "@/components/home/CategoryTilesSection";
import Footer from "@/components/home/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <BestSellersSection />
      <CategoriesSection />
      <NewArrivalsSection />
      <FeaturedProductsSection />
      <CategoryTilesSection />
      <Footer />
    </>
  );
}
