import Footer from "@/components/shared/Footer";
import { Outlet, useLocation } from "react-router-dom";
import GlobalSidebar from "@/components/shared/GlobalSidebar";
import ScrollToTop from "@/components/ScrollToTop"; 
import HeaderSection from "@/components/HeaderComponents/HeaderSection";
import { CategorySidebarProvider } from "@/context/CategorySidebarContext";
import { BuyNowProvider } from '@/context/BuyNowContext';
import BuyNowDrawer from '@/components/shared/BuyNowDrawer';

export default function MainLayout() {
  const location = useLocation();

  // to hide footer 
  const hideFooter = location.pathname === '/cart' || location.pathname === '/checkout';

  return (
    <BuyNowProvider>
      <CategorySidebarProvider>
        <ScrollToTop />
        <main>
          <HeaderSection /> 
          <GlobalSidebar />
          <section>
            <Outlet />
            {/* <FloatingWhatsApp /> */}
          </section>
          {!hideFooter && <Footer />}
        </main>
      </CategorySidebarProvider>
      <BuyNowDrawer />
    </BuyNowProvider>
  );
}