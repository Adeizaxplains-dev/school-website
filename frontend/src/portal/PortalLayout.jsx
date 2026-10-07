import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Wallet, FileText, GraduationCap, LogOut, Menu, X, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from "../components/common/Logo.jsx";
import { schoolConfig } from "../config/school.config.js";

const navItems = [
  { to: "/portal", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/portal/fees", label: "Fees & invoices", icon: Wallet },
  { to: "/portal/payments", label: "Payment history", icon: FileText },
  { to: "/portal/results", label: "Results", icon: GraduationCap },
];

export default function PortalLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function handleLogout() {
    logout();
    navigate("/portal/login", { replace: true });
  }

  const Sidebar = ({ mobile = false }) => (
    <aside className={`${mobile ? "w-full" : "hidden lg:flex lg:w-[17rem]"} shrink-0 flex-col border-line bg-surface ${mobile ? "border-b" : "border-r"}`}>
      <div className="flex h-20 items-center border-b border-line px-5">
        <Logo className="min-w-0" />
        {mobile && <button onClick={() => setOpen(false)} className="ml-auto rounded-xl p-2 text-muted hover:bg-canvas" aria-label="Close menu"><X size={21} /></button>}
      </div>
      <div className="px-4 py-5">
        <div className="rounded-2xl bg-canvas p-4">
          <p className="truncate text-sm font-semibold text-ink">{user?.name}</p>
          <p className="mt-0.5 text-xs font-medium text-muted">Parent portal</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 pb-4">
        <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">My school</p>
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `group flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-medium transition ${isActive ? "bg-primary text-on-primary shadow-sm" : "text-ink/75 hover:bg-primary/7 hover:text-primary"}`}>
            <item.icon size={18} strokeWidth={1.9} />
            <span className="flex-1">{item.label}</span>
            <ChevronRight size={14} className="opacity-0 group-[.active]:opacity-70" />
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-line p-3">
        <button onClick={handleLogout} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3.5 text-sm font-medium text-ink/70 hover:bg-rose-50 hover:text-rose-700"><LogOut size={18} /> Logout</button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-canvas lg:flex">
      <div className="hidden lg:flex"><Sidebar /></div>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-surface/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button onClick={() => setOpen(true)} className="rounded-xl p-2 text-muted hover:bg-canvas lg:hidden" aria-label="Open parent portal menu"><Menu size={21} /></button>
            <div className="min-w-0"><p className="truncate text-sm font-semibold text-ink">{schoolConfig.school.shortName || schoolConfig.school.name}</p><p className="hidden text-xs text-muted sm:block">Parent portal</p></div>
          </div>
          <span className="hidden rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary sm:inline-flex">Parent account</span>
        </header>
        {open && <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setOpen(false)} />}
        {open && <div className="fixed inset-y-0 left-0 z-50 flex w-[min(21rem,88vw)] flex-col shadow-2xl lg:hidden"><Sidebar mobile /></div>}
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-9"><div className="mx-auto w-full max-w-[1200px]"><Outlet /></div></main>
      </div>
    </div>
  );
}
