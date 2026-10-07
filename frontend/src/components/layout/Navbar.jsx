import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "../common/Logo.jsx";
import Button from "../common/Button.jsx";
import WhatsAppButton from "../common/WhatsAppButton.jsx";
import { getNavItems } from "../../utils/navigation.js";

const linkBase =
  "relative inline-flex min-h-11 items-center px-2.5 text-[0.95rem] font-medium transition-colors xl:px-3.5";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const items = getNavItems();

  // Close the mobile menu after navigating
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e) => e.matches && setOpen(false);

    mq.addEventListener("change", onChange);

    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock page scroll and support Escape while the mobile menu is open
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-primary text-white transition-shadow duration-300 ${
        scrolled
          ? "border-secondary/30 shadow-[0_6px_20px_-12px_rgba(0,0,0,0.5)]"
          : "border-primary-light/30"
      }`}
    >
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-4">
        {/* School logo */}
        <Logo className="min-w-0 [&>span:last-child]:max-w-[13rem] sm:[&>span:last-child]:max-w-[16rem]" />

        {/* Desktop navigation */}
        <nav aria-label="Main" className="hidden items-center lg:flex">
          <ul className="flex items-center">
            {items.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `${linkBase} ${
                      isActive
                        ? "text-secondary-light"
                        : "text-white/95 hover:text-secondary-light"
                    } after:absolute after:inset-x-2.5 after:bottom-1.5 after:h-0.5 after:origin-left after:bg-secondary after:transition-transform xl:after:inset-x-3.5 ${
                      isActive
                        ? "after:scale-x-100"
                        : "after:scale-x-0 hover:after:scale-x-100"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <Button
            to="/contact"
            size="sm"
            className="ml-3 !bg-secondary !text-primary hover:!bg-secondary-light"
          >
            Enquire Now
          </Button>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          className="-mr-2 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <X size={26} aria-hidden="true" />
          ) : (
            <Menu size={26} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[4.5rem] z-40 overflow-y-auto border-t border-secondary/20 bg-primary lg:hidden"
      >
        <nav
          aria-label="Mobile"
          className="container-page pb-10 pt-3"
        >
          <ul>
            {items.map((item) => (
              <li
                key={item.to}
                className="border-b border-white/10"
              >
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `flex min-h-14 items-center justify-between font-display text-xl ${
                      isActive
                        ? "text-secondary-light"
                        : "text-white hover:text-secondary-light"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.label}

                      {isActive && (
                        <span
                          className="h-2 w-2 rounded-full bg-secondary"
                          aria-hidden="true"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-3">
            <Button
              to="/contact"
              className="w-full !bg-secondary !text-primary hover:!bg-secondary-light"
            >
              Enquire Now
            </Button>

            <WhatsAppButton
              message="general"
              label="Chat on WhatsApp"
              className="w-full"
            />
          </div>
        </nav>
      </div>
    </header>
  );
}

