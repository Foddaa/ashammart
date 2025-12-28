import Warning from "@/components/HeaderComponents/Warning";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import { Outlet, useLocation } from "react-router-dom";
import Bio from "@/components/HeaderComponents/Bio";
import ScrollToTop from "@/components/ScrollToTop"; 
import LabelBottomNavigation from "@/components/LabelBottomNavigation";
import FloatingWhatsApp from "@/components/shared/FloatingWhatsApp";

export default function MainLayout() {
  const location = useLocation();

  // to hide footer 
  const hideFooter = location.pathname === '/cart' || location.pathname === '/checkout';

  return (
    <>
      <ScrollToTop />
      <main>
        <div className="sticky top-0 z-50">
          <Header />
        </div>
        <section>
          <Outlet />
          <FloatingWhatsApp />
        </section>
        <div className="fixed bottom-0 left-0 w-full bg-white z-50 shadow-md">
          <LabelBottomNavigation />
        </div>
        {!hideFooter && <Footer />}
      </main>
    </>
  );
}
