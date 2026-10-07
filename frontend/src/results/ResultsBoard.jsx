import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardCheck, Send, Search } from "lucide-react";
import { adminApi } from "../api/admin.js";
import { useAuth } from "../context/AuthContext.jsx";
import PageHeader from "../components/dashboard/PageHeader.jsx";
import StatusBadge from "../components/dashboard/StatusBadge.jsx";
import LoadingState from "../components/dashboard/LoadingState.jsx";
import EmptyState from "../components/dashboard/EmptyState.jsx";
import StudentAvatar from "../components/ui/StudentAvatar.jsx";
import { ErrorNote, SuccessNote } from "../components/ui/Feedback.jsx";

const TABS = [
  { key: "", label: "All" },
  { key: "SUBMITTED", label: "Awaiting review" },
  { key: "RETURNED", label: "Returned" },
  { key: "DRAFT", label: "Drafts" },
  { key: "PUBLISHED", label: "Published" },
  { key: "NOT_STARTED", label: "Not started" },
];

/**
 * One roster for both roles: every student in scope for the chosen session and term,
 * with the status of their result. Teachers enter and submit; the admin reviews.
 */
export default function ResultsBoard() {
  const { user } = useAuth();
  const isAdmin = user.role === "ADMIN";
  const base = isAdmin ? "/admin" : "/staff";

  const [sessions, setSessions] = useState([]);
  const [terms, setTerms] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [session, setSession] = useState("");
  const [term, setTerm] = useState("");
  const [classId, setClassId] = useState("");
  const [tab, setTab] = useState(isAdmin ? "SUBMITTED" : "");
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([adminApi.sessions(), adminApi.classes(), adminApi.students({ status: "ACTIVE" })])
      .then(([s, c, st]) => {
        setSessions(s.sessions); setClasses(c.classes); setStudents(st.students);
        const active = s.sessions.find((x) => x.isActive) || s.sessions[0];
        if (active) setSession(active._id);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!session) return;
    adminApi.terms({ session }).then((r) => {
      setTerms(r.terms);
      setTerm((cur) => (r.terms.some((t) => t._id === cur) ? cur : (r.terms.find((t) => t.isActive) || r.terms[0])?._id || ""));
    }).catch((e) => setError(e.message));
  }, [session]);

  async function loadResults() {
    if (!session || !term) return setResults([]);
    try { setResults((await adminApi.results({ session, term })).results); } catch (e) { setError(e.message); }
  }
  useEffect(() => { setPicked(new Set()); loadResults(); }, [session, term]); // eslint-disable-line react-hooks/exhaustive-deps

  const rows = useMemo(() => {
    const byStudent = new Map(results.map((r) => [r.student?._id, r]));
    return students
      .filter((s) => !classId || s.class?._id === classId)
      .map((s) => ({ student: s, result: byStudent.get(s._id) || null }))
      .map((r) => ({ ...r, status: r.result?.status || "NOT_STARTED" }));
  }, [students, results, classId]);

  const counts = useMemo(() => rows.reduce((acc, r) => ({ ...acc, [r.status]: (acc[r.status] || 0) + 1 }), {}), [rows]);
  const visible = rows.filter((r) => {
    if (tab && r.status !== tab) return false;
    const q = query.trim().toLowerCase();
    return !q || `${r.student.firstName} ${r.student.lastName} ${r.student.admissionNumber}`.toLowerCase().includes(q);
  });

  const submittable = visible.filter((r) => ["DRAFT", "RETURNED"].includes(r.status) && r.result);
  const toggle = (id) => setPicked((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  async function submitPicked() {
    setBusy(true); setError(""); setMessage("");
    try {
      const r = await adminApi.submitBatch([...picked]);
      setMessage(r.message + (r.skipped.length ? ` ${r.skipped.length} skipped.` : ""));
      setPicked(new Set());
      await loadResults();
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }

  const editorPath = (s) => `${base}/results/edit/${s._id}/${session}/${term}`;
  const actionLabel = (r) => (isAdmin ? (r.status === "SUBMITTED" ? "Review" : r.status === "NOT_STARTED" ? "Enter" : "Open")
    : (["NOT_STARTED"].includes(r.status) ? "Enter scores" : ["DRAFT", "RETURNED"].includes(r.status) ? "Continue" : "View"));

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow={isAdmin ? "Review" : "My classes"} title="Results"
        description={isAdmin ? "Review results submitted by teachers. Approve to publish to parents, or send back with a note." : "Enter scores for your students, then submit them to the administrator for approval."} />

      <div className="grid gap-3 rounded-xl border border-line bg-surface p-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-xs font-bold text-ink">Session
          <select className="field mt-1 font-normal" value={session} onChange={(e) => setSession(e.target.value)}>{sessions.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}</select></label>
        <label className="text-xs font-bold text-ink">Term
          <select className="field mt-1 font-normal" value={term} onChange={(e) => setTerm(e.target.value)}>{terms.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}</select></label>
        <label className="text-xs font-bold text-ink">Class
          <select className="field mt-1 font-normal" value={classId} onChange={(e) => setClassId(e.target.value)}><option value="">All {isAdmin ? "classes" : "my classes"}</option>{classes.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}</select></label>
        <label className="text-xs font-bold text-ink">Find student
          <span className="relative mt-1 block"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input className="field pl-9 font-normal" placeholder="Name or admission no." value={query} onChange={(e) => setQuery(e.target.value)} /></span></label>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Filter by status">
        {TABS.map((t) => (
          <button key={t.key} role="tab" aria-selected={tab === t.key} onClick={() => setTab(t.key)}
            className={`min-h-10 shrink-0 rounded-full border px-4 text-sm font-semibold transition ${tab === t.key ? "border-primary bg-primary text-on-primary" : "border-line bg-surface text-ink hover:border-primary"}`}>
            {t.label}<span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${tab === t.key ? "bg-white/20" : "bg-canvas text-muted"}`}>{t.key ? counts[t.key] || 0 : rows.length}</span>
          </button>
        ))}
      </div>

      <ErrorNote>{error}</ErrorNote>
      <SuccessNote>{message}</SuccessNote>

      {!isAdmin && submittable.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
          <p className="text-sm font-semibold text-ink">{picked.size} selected</p>
          <button className="btn btn-ghost btn-sm underline" onClick={() => setPicked(new Set(submittable.map((r) => r.result._id)))}>Select all ready to submit ({submittable.length})</button>
          <button disabled={!picked.size || busy} onClick={submitPicked} className="btn btn-primary btn-sm ml-auto"><Send size={16} />{busy ? "Submitting…" : "Submit selected"}</button>
        </div>
      )}

      {!visible.length ? (
        <EmptyState title="No students match" description={isAdmin ? "Nothing in this view yet. Try another status or term." : "You have no students for this filter. Ask the administrator to assign you a class."} />
      ) : (
        <div className="overflow-hidden rounded-xl border border-line bg-surface">
          <div className="table-scroll">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-canvas text-xs font-bold uppercase tracking-wide text-muted">
                <tr>{!isAdmin && <th className="w-10 px-4 py-3"><span className="sr-only">Select</span></th>}
                  <th className="px-4 py-3">Student</th><th className="px-4 py-3">Class</th><th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Average</th><th className="px-4 py-3"><span className="sr-only">Action</span></th></tr>
              </thead>
              <tbody className="divide-y divide-line">
                {visible.map((r) => (
                  <tr key={r.student._id} className="hover:bg-canvas/60">
                    {!isAdmin && <td className="px-4 py-3">
                      {["DRAFT", "RETURNED"].includes(r.status) && r.result && (
                        <input type="checkbox" className="h-4 w-4 accent-[var(--c-primary)]" checked={picked.has(r.result._id)} onChange={() => toggle(r.result._id)} aria-label={`Select ${r.student.firstName}`} />)}
                    </td>}
                    <td className="px-4 py-3"><div className="flex items-center gap-3"><StudentAvatar student={r.student} />
                      <div><p className="font-semibold text-ink">{r.student.firstName} {r.student.lastName}</p><p className="text-xs text-muted">{r.student.admissionNumber}</p></div></div></td>
                    <td className="px-4 py-3 text-ink">{r.student.class?.name}</td>
                    <td className="px-4 py-3"><StatusBadge value={r.status} />
                      {r.status === "RETURNED" && r.result?.returnReason && <p className="mt-1 max-w-[16rem] truncate text-xs font-medium text-rose-700" title={r.result.returnReason}>“{r.result.returnReason}”</p>}</td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums text-ink">{r.result ? r.result.average : "—"}</td>
                    <td className="px-4 py-3 text-right"><Link to={editorPath(r.student)} className={`btn btn-sm ${r.status === "SUBMITTED" && isAdmin ? "btn-primary" : "btn-outline"}`}>
                      {r.status === "SUBMITTED" && isAdmin && <ClipboardCheck size={16} />}{actionLabel(r)}</Link></td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
