import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { adminApi } from "../api/admin.js";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from "../components/common/Logo.jsx";
import { ErrorNote } from "../components/ui/Feedback.jsx";

/** Shown to anyone whose password was set by the school (new teachers, resets) before they continue. */
export default function ChangePassword() {
  const { user, refresh } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (form.newPassword.length < 8) return setError("Use at least 8 characters.");
    if (form.newPassword !== form.confirm) return setError("The two new passwords do not match.");
    setBusy(true);
    try {
      await adminApi.changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      await refresh();
      navigate(user.role === "ADMIN" ? "/admin" : user.role === "STAFF" ? "/staff" : "/portal", { replace: true });
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-line bg-surface p-6 shadow-sm sm:p-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><KeyRound size={22} /></span>
          <div><h1 className="font-display text-2xl font-bold text-ink">Set your own password</h1>
            <p className="mt-1 text-sm text-muted">{user?.mustChangePassword ? "The school gave you a temporary password. Choose a new one to continue." : "Choose a new password for your account."}</p></div>
          <ErrorNote>{error}</ErrorNote>
          <label className="block text-xs font-bold text-ink">Current (temporary) password<input type="password" autoComplete="current-password" required className="field mt-1 font-normal" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} /></label>
          <label className="block text-xs font-bold text-ink">New password<input type="password" autoComplete="new-password" required minLength={8} className="field mt-1 font-normal" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} /></label>
          <label className="block text-xs font-bold text-ink">Confirm new password<input type="password" autoComplete="new-password" required className="field mt-1 font-normal" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} /></label>
          <button disabled={busy} className="btn btn-primary w-full">{busy ? "Saving…" : "Save password"}</button>
        </form>
      </div>
    </main>
  );
}
