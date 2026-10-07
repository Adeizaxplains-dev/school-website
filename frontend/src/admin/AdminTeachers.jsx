import { useEffect, useMemo, useState } from "react";
import { Copy, KeyRound, Plus, UserCog } from "lucide-react";
import { adminApi } from "../api/admin.js";
import PageHeader from "../components/dashboard/PageHeader.jsx";
import StatusBadge from "../components/dashboard/StatusBadge.jsx";
import EmptyState from "../components/dashboard/EmptyState.jsx";
import LoadingState from "../components/dashboard/LoadingState.jsx";
import StudentAvatar from "../components/ui/StudentAvatar.jsx";
import Modal from "../components/ui/Modal.jsx";
import { ErrorNote, SuccessNote } from "../components/ui/Feedback.jsx";

const blank = { name: "", email: "", phone: "", staffId: "", assignedClasses: [], assignedStudents: [], isActive: true };

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState(null);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(null); // null = closed
  const [editingId, setEditingId] = useState(null);
  const [studentQuery, setStudentQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [credentials, setCredentials] = useState(null); // { name, login, password }

  const load = () => adminApi.teachers().then((r) => setTeachers(r.teachers)).catch((e) => setError(e.message));
  useEffect(() => {
    load();
    adminApi.classes().then((r) => setClasses(r.classes)).catch((e) => setError(e.message));
    adminApi.students({ status: "ACTIVE" }).then((r) => setStudents(r.students)).catch((e) => setError(e.message));
  }, []);

  const toggle = (key, id) => setForm((f) => ({ ...f, [key]: f[key].includes(id) ? f[key].filter((x) => x !== id) : [...f[key], id] }));

  function openEdit(t) {
    setError("");
    setEditingId(t.id);
    setForm({ name: t.name, email: t.email || "", phone: t.phone || "", staffId: t.staffId || "",
      assignedClasses: t.assignedClasses.map((c) => c._id), assignedStudents: t.assignedStudents.map((s) => s._id), isActive: t.isActive });
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true); setError(""); setMessage("");
    try {
      if (editingId) {
        await adminApi.updateTeacher(editingId, form);
        setMessage("Teacher updated.");
      } else {
        const r = await adminApi.createTeacher(form);
        setCredentials({ name: r.teacher.name, login: r.teacher.email || r.teacher.phone, password: r.temporaryPassword });
      }
      setForm(null); setEditingId(null); load();
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  }

  async function resetPassword(t) {
    if (!confirm(`Reset the password for ${t.name}? Their current password stops working.`)) return;
    try { const r = await adminApi.resetTeacherPassword(t.id); setCredentials({ name: t.name, login: t.email || t.phone, password: r.temporaryPassword }); }
    catch (err) { setError(err.message); }
  }

  const extraStudents = useMemo(() => {
    const q = studentQuery.trim().toLowerCase();
    return students.filter((s) => !q || `${s.firstName} ${s.lastName} ${s.admissionNumber}`.toLowerCase().includes(q)).slice(0, 30);
  }, [students, studentQuery]);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="People" title="Teachers"
        description="Create teacher accounts and decide which classes and students each teacher can see and prepare results for."
        action={<button className="btn btn-primary" onClick={() => { setError(""); setEditingId(null); setForm(blank); }}><Plus size={17} /> Add teacher</button>} />
      <ErrorNote>{error}</ErrorNote>
      <SuccessNote>{message}</SuccessNote>

      {!teachers ? <LoadingState label="Loading teachers…" /> : !teachers.length ? (
        <EmptyState title="No teachers yet" description="Add a teacher, then assign the classes they teach. Until a class is assigned they see no students." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-line bg-surface">
          <div className="table-scroll">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-canvas text-xs font-bold uppercase tracking-wide text-muted">
                <tr><th className="px-5 py-3">Teacher</th><th className="px-5 py-3">Classes</th><th className="px-5 py-3">Extra students</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-line">
                {teachers.map((t) => (
                  <tr key={t.id} className="hover:bg-canvas/60">
                    <td className="px-5 py-4"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary"><UserCog size={18} /></span>
                      <div><p className="font-semibold text-ink">{t.name}</p><p className="text-xs text-muted">{t.email || t.phone}{t.staffId ? ` · ${t.staffId}` : ""}</p></div></div></td>
                    <td className="px-5 py-4">{t.assignedClasses.length ? <div className="flex flex-wrap gap-1.5">{t.assignedClasses.map((c) => <span key={c._id} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">{c.name}</span>)}</div> : <span className="text-xs font-semibold text-amber-800">None assigned</span>}</td>
                    <td className="px-5 py-4 text-ink">{t.assignedStudents.length || "—"}</td>
                    <td className="px-5 py-4"><StatusBadge value={t.isActive ? "ACTIVE" : "INACTIVE"} /></td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <button onClick={() => openEdit(t)} className="mr-4 text-xs font-bold text-link hover:underline">Edit & assign</button>
                      <button onClick={() => resetPassword(t)} className="inline-flex items-center gap-1 text-xs font-bold text-link hover:underline"><KeyRound size={13} />Reset password</button></td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={!!form} wide title={editingId ? "Edit teacher" : "Add teacher"} onClose={() => setForm(null)}
        footer={<><button type="button" className="btn btn-ghost btn-sm" onClick={() => setForm(null)}>Cancel</button>
          <button form="teacher-form" disabled={saving} className="btn btn-primary btn-sm">{saving ? "Saving…" : editingId ? "Save changes" : "Create teacher"}</button></>}>
        {form && (
          <form id="teacher-form" onSubmit={save} className="space-y-5">
            <ErrorNote>{error}</ErrorNote>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-bold text-ink">Full name *<input required className="field mt-1 font-normal" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
              <label className="text-xs font-bold text-ink">Staff ID<input className="field mt-1 font-normal" value={form.staffId} onChange={(e) => setForm({ ...form, staffId: e.target.value })} /></label>
              <label className="text-xs font-bold text-ink">Email<input type="email" className="field mt-1 font-normal" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
              <label className="text-xs font-bold text-ink">Phone<input className="field mt-1 font-normal" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
            </div>
            <p className="-mt-2 text-xs text-muted">Teachers sign in with their email or phone. Provide at least one.</p>

            <fieldset>
              <legend className="text-sm font-bold text-ink">Classes this teacher prepares results for</legend>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {classes.map((c) => (
                  <label key={c._id} className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm font-semibold ${form.assignedClasses.includes(c._id) ? "border-primary bg-primary/5 text-primary" : "border-line text-ink"}`}>
                    <input type="checkbox" className="accent-[var(--c-primary)]" checked={form.assignedClasses.includes(c._id)} onChange={() => toggle("assignedClasses", c._id)} />{c.name}</label>))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-bold text-ink">Extra individual students <span className="font-normal text-muted">(optional, outside those classes)</span></legend>
              <input className="field mt-2" placeholder="Search students…" value={studentQuery} onChange={(e) => setStudentQuery(e.target.value)} aria-label="Search students" />
              <ul className="mt-2 max-h-52 divide-y divide-line overflow-y-auto rounded-lg border border-line">
                {extraStudents.map((s) => (
                  <li key={s._id}><label className="flex min-h-12 cursor-pointer items-center gap-3 px-3 hover:bg-canvas">
                    <input type="checkbox" className="accent-[var(--c-primary)]" checked={form.assignedStudents.includes(s._id)} onChange={() => toggle("assignedStudents", s._id)} />
                    <StudentAvatar student={s} size="xs" /><span className="text-sm font-semibold text-ink">{s.firstName} {s.lastName}</span><span className="ml-auto text-xs text-muted">{s.class?.name}</span></label></li>))}
              </ul>
              {form.assignedStudents.length > 0 && <p className="mt-1 text-xs font-semibold text-ink">{form.assignedStudents.length} extra student(s) linked</p>}
            </fieldset>

            {editingId && <label className="flex items-center gap-2 text-sm font-semibold text-ink"><input type="checkbox" className="accent-[var(--c-primary)]" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />Account is active (untick to block sign-in)</label>}
          </form>
        )}
      </Modal>

      <Modal open={!!credentials} title="Share these sign-in details" onClose={() => setCredentials(null)}
        footer={<button className="btn btn-primary btn-sm" onClick={() => setCredentials(null)}>Done</button>}>
        {credentials && <div className="space-y-4">
          <p className="text-sm text-ink">Give <b>{credentials.name}</b> these details. The password is shown <b>only once</b> and they must change it when they first sign in.</p>
          <dl className="space-y-2 rounded-lg bg-canvas p-4 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-muted">Sign in with</dt><dd className="font-bold text-ink">{credentials.login}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">Temporary password</dt><dd className="font-mono font-bold text-ink">{credentials.password}</dd></div>
          </dl>
          <button className="btn btn-outline btn-sm" onClick={() => navigator.clipboard?.writeText(`${credentials.login} / ${credentials.password}`)}><Copy size={15} />Copy details</button>
        </div>}
      </Modal>
    </div>
  );
}
