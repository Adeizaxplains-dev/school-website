import { Outlet } from "react-router-dom";
import DemoBanner from "../common/DemoBanner.jsx";
import WhatsAppButton from "../common/WhatsAppButton.jsx";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import ScrollToTop from "./ScrollToTop.jsx";

export default function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-3 focus:text-on-primary"
      >
        Skip to main content
      </a>
      <ScrollToTop />
      <DemoBanner />
      <Navbar />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton variant="floating" message="floating" label="Chat with us" />
    </div>
  );
}
