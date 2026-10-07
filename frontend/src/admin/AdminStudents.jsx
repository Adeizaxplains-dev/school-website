import { useEffect, useState } from "react";
import { Plus, X, Search } from "lucide-react";
import { adminApi } from "../api/admin.js";
import PageHeader from "../components/dashboard/PageHeader.jsx";
import StatusBadge from "../components/dashboard/StatusBadge.jsx";
import EmptyState from "../components/dashboard/EmptyState.jsx";
import LoadingState from "../components/dashboard/LoadingState.jsx";
import StudentAvatar from "../components/ui/StudentAvatar.jsx";
import { ErrorNote } from "../components/ui/Feedback.jsx";
import { Camera, Trash2 } from "lucide-react";

const emptyForm = { admissionNumber: "", firstName: "", middleName: "", lastName: "", gender: "Male", dateOfBirth: "", class: "", parent: "", phone: "", address: "" };

export default function AdminStudents() {
  const [students, setStudents] = useState(null);
  const [classes, setClasses] = useState([]);
  const [parents, setParents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);

  function pickPhoto(file) {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return setError("Passport must be a JPG, PNG or WebP image.");
    if (file.size > 1.5 * 1024 * 1024) return setError("Passport photo must be 1.5 MB or smaller.");
    setError("");
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }
  function resetPhoto() { setPhotoFile(null); setPhotoPreview(""); }

  function loadStudents() { adminApi.students().then((res) => setStudents(res.students)).catch((err) => setError(err.message)); }
  useEffect(() => { loadStudents(); adminApi.classes().then((res) => setClasses(res.classes)).catch((e) => setError(e.message)); adminApi.parents().then((res) => setParents(res.parents)).catch((e) => setError(e.message)); }, []);

  function openCreate() { resetPhoto(); setEditingStudent(null); setForm(emptyForm); setEditingId(null); setError(""); setShowForm(true); }
  function openEdit(student) { resetPhoto(); setEditingStudent(student); setForm({ admissionNumber: student.admissionNumber, firstName: student.firstName, middleName: student.middleName || "", lastName: student.lastName, gender: student.gender, dateOfBirth: student.dateOfBirth ? student.dateOfBirth.slice(0, 10) : "", class: student.class?._id || "", parent: student.parent?._id || "", phone: student.phone || "", address: student.address || "" }); setEditingId(student._id); setError(""); setShowForm(true); }

  async function handleSubmit(e) { e.preventDefault(); setError(""); setSaving(true); try {
      const saved = editingId ? await adminApi.updateStudent(editingId, form) : await adminApi.createStudent(form);
      if (photoFile) {
        try { await adminApi.uploadStudentPhoto(saved.student._id, photoFile); }
        catch (photoErr) { setError(`Student saved, but the passport upload failed: ${photoErr.message}`); loadStudents(); setSaving(false); return; }
      }
      setShowForm(false); resetPhoto(); loadStudents();
    } catch (err) { setError(err.message); } finally { setSaving(false); } }
  async function handleDeactivate(id) { if (!confirm("Deactivate this student?")) return; try { await adminApi.deactivateStudent(id); loadStudents(); } catch (err) { setError(err.message); } }

  const filtered = (students || []).filter((s) => `${s.fullName} ${s.admissionNumber} ${s.class?.name || ""} ${s.parent?.name || ""}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="People" title="Students" description="Manage enrolment records, class placement and parent links." action={<button onClick={openCreate} className="btn btn-primary"><Plus size={17} /> Add student</button>} />

      <ErrorNote>{error}</ErrorNote>

      {showForm && (
        <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Student record</p><h2 className="mt-1 text-lg font-semibold text-ink">{editingId ? "Edit student" : "Add a student"}</h2></div><button onClick={() => setShowForm(false)} aria-label="Close" className="rounded-xl p-2 text-muted hover:bg-cream"><X size={19} /></button></div>
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-4 rounded-xl border border-dashed border-line bg-canvas p-4 sm:col-span-2 lg:col-span-3">
              {photoPreview ? <img src={photoPreview} alt="New passport preview" className="h-28 w-24 rounded-md object-cover ring-1 ring-line" /> : <StudentAvatar student={editingStudent || { firstName: form.firstName, lastName: form.lastName }} size="xl" square />}
              <div className="min-w-0">
                <p className="text-sm font-bold text-ink">Passport photograph</p>
                <p className="mt-0.5 text-xs text-muted">Appears on the student's results, report sheets and parent portal. JPG, PNG or WebP, up to 1.5 MB. A plain-background head-and-shoulders photo works best.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <label className="btn btn-outline btn-sm cursor-pointer"><Camera size={16} />{photoPreview || editingStudent?.photo ? "Change photo" : "Choose photo"}
                    <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => pickPhoto(e.target.files?.[0])} /></label>
                  {editingStudent?.photo && !photoPreview && <button type="button" className="btn btn-ghost btn-sm text-rose-700" onClick={async () => { try { const r = await adminApi.removeStudentPhoto(editingId); setEditingStudent(r.student); loadStudents(); } catch (err) { setError(err.message); } }}><Trash2 size={16} />Remove</button>}
                </div>
              </div>
            </div>
            <Field label="Admission number" required><input required className="field" value={form.admissionNumber} onChange={(e) => setForm({ ...form, admissionNumber: e.target.value })} /></Field>
            <Field label="First name" required><input required className="field" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></Field>
            <Field label="Middle name"><input className="field" value={form.middleName} onChange={(e) => setForm({ ...form, middleName: e.target.value })} /></Field>
            <Field label="Last name" required><input required className="field" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></Field>
            <Field label="Gender" required><select required className="field" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}><option>Male</option><option>Female</option></select></Field>
            <Field label="Date of birth"><input type="date" className="field" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} /></Field>
            <Field label="Class" required><select required className="field" value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })}><option value="">Select class</option>{classes.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}</select></Field>
            <Field label="Parent" required><select required className="field" value={form.parent} onChange={(e) => setForm({ ...form, parent: e.target.value })}><option value="">Select parent</option>{parents.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.email || p.phone})</option>)}</select></Field>
            <Field label="Phone"><input className="field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
            <Field label="Address" wide><input className="field" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Field>
            <div className="flex flex-wrap gap-3 sm:col-span-2 lg:col-span-3"><button type="submit" disabled={saving} className="btn btn-primary">{saving ? "Saving…" : editingId ? "Save changes" : "Create student"}</button><button type="button" onClick={() => setShowForm(false)} className="btn btn-outline">Cancel</button></div>
          </form>
          {!parents.length && <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-800">Create a parent account first, then link it to the student.</p>}
        </section>
      )}

      <section className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"><div><h2 className="text-sm font-semibold text-ink">Student directory</h2><p className="mt-0.5 text-xs text-muted">{filtered.length} record{filtered.length === 1 ? "" : "s"}</p></div><label className="relative block w-full sm:max-w-xs"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input className="field pl-9" placeholder="Search students…" value={query} onChange={(e) => setQuery(e.target.value)} /></label></div>
        {!students ? <LoadingState label="Loading students…" /> : !filtered.length ? <div className="p-5"><EmptyState title="No matching students" description={query ? "Try a different name, admission number or class." : "Add your first student to begin building the directory."} /></div> : (
          <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-sm"><thead className="bg-canvas text-left text-[11px] font-bold uppercase tracking-[0.12em] text-muted"><tr><th className="px-5 py-3">Student</th><th className="px-5 py-3">Admission no.</th><th className="px-5 py-3">Class</th><th className="px-5 py-3">Parent</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr></thead><tbody>{filtered.map((s) => <tr key={s._id} className="border-t border-line transition hover:bg-canvas/60"><td className="px-5 py-4"><div className="flex items-center gap-3"><StudentAvatar student={s} /><div><p className="font-semibold text-ink">{s.fullName}</p><p className="mt-0.5 text-xs text-muted">{s.gender}{s.phone ? ` · ${s.phone}` : ""}</p></div></div></td><td className="px-5 py-4 text-muted">{s.admissionNumber}</td><td className="px-5 py-4 text-ink">{s.class?.name || "—"}</td><td className="px-5 py-4 text-ink">{s.parent?.name || "—"}</td><td className="px-5 py-4"><StatusBadge value={s.status} /></td><td className="px-5 py-4 text-right"><button onClick={() => openEdit(s)} className="mr-3 text-xs font-semibold text-link hover:underline">Edit</button>{s.status === "ACTIVE" && <button onClick={() => handleDeactivate(s._id)} className="text-xs font-semibold text-error hover:underline">Deactivate</button>}</td></tr>)}</tbody></table></div>
        )}
      </section>
    </div>
  );
}

function Field({ label, required, wide, children }) { return <label className={`block ${wide ? "sm:col-span-2 lg:col-span-3" : ""}`}><span className="mb-1.5 block text-xs font-semibold text-ink">{label}{required && <span className="ml-1 text-error">*</span>}</span>{children}</label>; }
