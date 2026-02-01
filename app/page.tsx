import { Hero } from "@/components/home/Hero";
import { BestSellersSection } from "@/components/home/BestSellersSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { NewArrivalsSection } from "@/components/home/NewArrivalsSection";
import { FeaturedProductsSection } from "@/components/home/FeaturedProductsSection";
import { SpecialOffersSection } from "@/components/home/SpecialOffersSection2";
import { DifferentCategorySection } from "@/components/home/DifferentCategorySection";
import Footer from "@/components/home/Foote";

export default function Home() {

  return (
    <div className="">
      <Hero />
      <BestSellersSection />
      <CategoriesSection />
      <NewArrivalsSection />
      <FeaturedProductsSection />
    {/*   <SpecialOffersSection /> */}
      <DifferentCategorySection />
      <Footer />
    </div>
  );
}
