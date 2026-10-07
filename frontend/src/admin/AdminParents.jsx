import { useEffect, useState } from "react";
import { Plus, X, KeyRound } from "lucide-react";
import { adminApi } from "../api/admin.js";
import PageHeader from "../components/dashboard/PageHeader.jsx";
import EmptyState from "../components/dashboard/EmptyState.jsx";
import LoadingState from "../components/dashboard/LoadingState.jsx";

export default function AdminParents() {
  const [parents, setParents] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [tempPassword, setTempPassword] = useState(null);

  function load() { adminApi.parents().then((res) => setParents(res.parents)).catch((err) => setError(err.message)); }
  useEffect(load, []);
  async function handleSubmit(e) { e.preventDefault(); setError(""); setSaving(true); try { const res = await adminApi.createParent(form); setTempPassword({ name: res.parent.name, password: res.temporaryPassword }); setForm({ name: "", email: "", phone: "" }); setShowForm(false); load(); } catch (err) { setError(err.message); } finally { setSaving(false); } }
  async function handleReset(id) { if (!confirm("Reset this parent's password?")) return; try { const res = await adminApi.resetParentPassword(id); setTempPassword({ name: parents.find((p) => p.id === id)?.name, password: res.temporaryPassword }); } catch (err) { setError(err.message); } }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="People" title="Parent accounts" description="Create secure portal accounts and give parents access to fees, receipts and results." action={<button onClick={() => setShowForm((v) => !v)} className="btn btn-primary"><Plus size={17} /> Add parent</button>} />
      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
      {tempPassword && <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold">Temporary password generated</p><p className="mt-1">{tempPassword.name}: <code className="rounded bg-white/70 px-2 py-1 font-mono">{tempPassword.password}</code></p><p className="mt-1 text-xs">Share it securely. It will not be shown again.</p></div><button onClick={() => setTempPassword(null)} aria-label="Dismiss" className="self-end rounded-lg p-2 hover:bg-amber-100 sm:self-auto"><X size={17} /></button></div>}
      {showForm && <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Portal access</p><h2 className="mt-1 text-lg font-semibold text-ink">Create parent account</h2></div><button onClick={() => setShowForm(false)} className="rounded-xl p-2 text-muted hover:bg-cream"><X size={19} /></button></div><form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2"><Field label="Full name"><input required className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field><Field label="Email"><input type="email" className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field><Field label="Phone"><input className="field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field><div className="flex items-end"><p className="text-xs leading-5 text-muted">At least one of email or phone is required. A secure temporary password is generated automatically.</p></div><button type="submit" disabled={saving} className="btn btn-primary sm:col-span-2">{saving ? "Creating…" : "Create parent account"}</button></form></section>}
      {!parents ? <LoadingState label="Loading parent accounts…" /> : parents.length === 0 ? <EmptyState title="No parent accounts" description="Create the first parent account to enable portal access." /> : <section className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm"><div className="border-b border-line p-5"><h2 className="text-sm font-semibold text-ink">Parent directory</h2><p className="mt-0.5 text-xs text-muted">{parents.length} account{parents.length === 1 ? "" : "s"}</p></div><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-sm"><thead className="bg-cream/70 text-left text-[11px] uppercase tracking-[0.12em] text-muted"><tr><th className="px-5 py-3">Parent</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Phone</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Action</th></tr></thead><tbody>{parents.map((p) => <tr key={p.id} className="border-t border-line hover:bg-cream/40"><td className="px-5 py-4"><p className="font-medium text-ink">{p.name}</p><p className="mt-0.5 text-xs text-muted">Parent portal account</p></td><td className="px-5 py-4 text-ink">{p.email || "—"}</td><td className="px-5 py-4 text-ink">{p.phone || "—"}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${p.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{p.isActive ? "ACTIVE" : "INACTIVE"}</span></td><td className="px-5 py-4 text-right"><button onClick={() => handleReset(p.id)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-link hover:underline"><KeyRound size={14} /> Reset password</button></td></tr>)}</tbody></table></div></section>}
    </div>
  );
}
function Field({ label, children }) { return <label className="block"><span className="mb-1.5 block text-xs font-semibold text-ink">{label}</span>{children}</label>; }
