import { Navigate, Route, Routes } from "react-router-dom";
import { featuresConfig as features } from "./config/features.config.js";
import Layout from "./components/layout/Layout.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Academics from "./pages/Academics.jsx";
import Admissions from "./pages/Admissions.jsx";
import Gallery from "./pages/Gallery.jsx";
import Contact from "./pages/Contact.jsx";
import NotFound from "./pages/NotFound.jsx";

import RequireAuth from "./components/common/RequireAuth.jsx";

import PortalLogin from "./portal/PortalLogin.jsx";
import PortalLayout from "./portal/PortalLayout.jsx";
import PortalDashboard from "./portal/PortalDashboard.jsx";
import PortalFees from "./portal/PortalFees.jsx";
import PortalInvoice from "./portal/PortalInvoice.jsx";
import PortalPaymentCallback from "./portal/PortalPaymentCallback.jsx";
import PortalPayments from "./portal/PortalPayments.jsx";
import PortalReceipt from "./portal/PortalReceipt.jsx";
import PortalResults from "./portal/PortalResults.jsx";
import PortalResultDetail from "./portal/PortalResultDetail.jsx";

import AdminLogin from "./admin/AdminLogin.jsx";
import AdminLayout from "./admin/AdminLayout.jsx";
import AdminOverview from "./admin/AdminOverview.jsx";
import AdminStudents from "./admin/AdminStudents.jsx";
import AdminParents from "./admin/AdminParents.jsx";
import AdminAcademics from "./admin/AdminAcademics.jsx";
import AdminFees from "./admin/AdminFees.jsx";
import AdminTeachers from "./admin/AdminTeachers.jsx";
import ChangePassword from "./admin/ChangePassword.jsx";
import ResultsBoard from "./results/ResultsBoard.jsx";
import ResultEditor from "./results/ResultEditor.jsx";
import StaffDashboard from "./staff/StaffDashboard.jsx";
import StaffStudents from "./staff/StaffStudents.jsx";
import AdminSettings from "./admin/AdminSettings.jsx";
import AdminAnnouncements from "./admin/AdminAnnouncements.jsx";
import AdminReceipt from "./admin/AdminReceipt.jsx";

/** A page that is switched off in features.config.js redirects home instead of rendering. */
const gated = (enabled, element) => (enabled ? element : <Navigate to="/" replace />);

export default function App() {
  return (
    <Routes>
      {/* Public marketing site */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="academics" element={gated(features.academics, <Academics />)} />
        <Route path="admissions" element={gated(features.admissions, <Admissions />)} />
        <Route path="gallery" element={gated(features.gallery, <Gallery />)} />
        <Route path="contact" element={<Contact />} />
      </Route>

      {/* Parent portal */}
      <Route path="portal/login" element={<PortalLogin />} />
      <Route path="portal/payment/callback" element={<PortalPaymentCallback />} />
      <Route
        path="portal"
        element={
          <RequireAuth roles="PARENT" loginPath="/portal/login">
            <PortalLayout />
          </RequireAuth>
        }
      >
        <Route index element={<PortalDashboard />} />
        <Route path="fees" element={<PortalFees />} />
        <Route path="fees/:id" element={<PortalInvoice />} />
        <Route path="payments" element={<PortalPayments />} />
        <Route path="receipts/:id" element={<PortalReceipt />} />
        <Route path="results" element={<PortalResults />} />
        <Route path="results/:id" element={<PortalResultDetail />} />
      </Route>

      {/* Sign in (administrators and teachers share one screen) */}
      <Route path="admin/login" element={<AdminLogin />} />
      <Route path="staff/login" element={<AdminLogin />} />
      <Route path="account/password" element={<RequireAuth loginPath="/admin/login"><ChangePassword /></RequireAuth>} />

      {/* Administrator workspace */}
      <Route path="admin" element={<RequireAuth roles="ADMIN" loginPath="/admin/login"><AdminLayout /></RequireAuth>}>
        <Route index element={<AdminOverview />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="parents" element={<AdminParents />} />
        <Route path="teachers" element={<AdminTeachers />} />
        <Route path="academics" element={<AdminAcademics />} />
        <Route path="fees" element={<AdminFees />} />
        <Route path="payments/:id/receipt" element={<AdminReceipt />} />
        <Route path="results" element={<ResultsBoard />} />
        <Route path="results/edit/:studentId/:sessionId/:termId" element={<ResultEditor />} />
        <Route path="announcements" element={<AdminAnnouncements />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Teacher workspace: only their assigned classes and students */}
      <Route path="staff" element={<RequireAuth roles="STAFF" loginPath="/staff/login"><AdminLayout /></RequireAuth>}>
        <Route index element={<StaffDashboard />} />
        <Route path="students" element={<StaffStudents />} />
        <Route path="results" element={<ResultsBoard />} />
        <Route path="results/edit/:studentId/:sessionId/:termId" element={<ResultEditor />} />
        <Route path="announcements" element={<AdminAnnouncements />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
