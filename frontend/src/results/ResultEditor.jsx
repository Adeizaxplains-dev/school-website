import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, RotateCcw, Save, Send, Undo2 } from "lucide-react";
import { adminApi } from "../api/admin.js";
import { useAuth } from "../context/AuthContext.jsx";
import PageHeader from "../components/dashboard/PageHeader.jsx";
import StatusBadge from "../components/dashboard/StatusBadge.jsx";
import LoadingState from "../components/dashboard/LoadingState.jsx";
import StudentAvatar from "../components/ui/StudentAvatar.jsx";
import Modal from "../components/ui/Modal.jsx";
import { ErrorNote, SuccessNote } from "../components/ui/Feedback.jsx";

const LIMITS = { ca1: 20, ca2: 20, exam: 60 };
const ACTION_LABEL = { CREATED: "Created", SAVED: "Saved", EDITED_BY_ADMIN: "Edited by admin", SUBMITTED: "Submitted for review", RETURNED: "Sent back", PUBLISHED: "Approved & published", UNPUBLISHED: "Unpublished" };

const gradeFor = (total, scale) => scale.find((b) => total >= b.min && total <= b.max) || { grade: "–", remark: "" };

export default function ResultEditor() {
  const { studentId, sessionId, termId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user.role === "ADMIN";
  const back = `${isAdmin ? "/admin" : "/staff"}/results`;

  const [student, setStudent] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [scale, setScale] = useState([]);
  const [result, setResult] = useState(null);
  const [scores, setScores] = useState({});
  const [comments, setComments] = useState({ teacherComment: "", principalComment: "" });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [returning, setReturning] = useState(false);
  const [reason, setReason] = useState("");

  function hydrate(r) {
    setResult(r);
    const map = {};
    (r?.subjects || []).forEach((s) => { map[s.subject?._id || s.subject] = { ca1: s.ca1, ca2: s.ca2, exam: s.exam }; });
    setScores(map);
    setComments({ teacherComment: r?.teacherComment || "", principalComment: r?.principalComment || "" });
  }

  useEffect(() => {
    setLoading(true);
    adminApi.student(studentId).then(async ({ student: st }) => {
      setStudent(st);
      const [subs, res, settings] = await Promise.all([
        adminApi.subjects({ class: st.class?._id }),
        adminApi.results({ student: studentId, session: sessionId, term: termId }),
        adminApi.settings(),
      ]);
      setSubjects(subs.subjects);
      setScale(settings.settings?.gradingScale || []);
      hydrate(res.results[0] || null);
    }).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [studentId, sessionId, termId]);

  // Subjects stored on the result stay visible even if the class's subject list changed later.
  const rowsToShow = useMemo(() => {
    const fromResult = (result?.subjects || []).map((s) => ({ _id: s.subject?._id || s.subject, name: s.subject?.name || "Subject" }));
    const ids = new Set(fromResult.map((s) => String(s._id)));
    return [...fromResult, ...subjects.filter((s) => !ids.has(String(s._id)))];
  }, [subjects, result]);

  const status = result?.status || "NOT_STARTED";
  const editable = isAdmin ? status !== "PUBLISHED" : ["NOT_STARTED", "DRAFT", "RETURNED"].includes(status);

  const set = (id, field, value) => setScores((p) => ({ ...p, [id]: { ...p[id], [field]: value } }));
  const total = (id) => ["ca1", "ca2", "exam"].reduce((sum, f) => sum + (Number(scores[id]?.[f]) || 0), 0);
  const invalid = (id, f) => { const v = Number(scores[id]?.[f]); return scores[id]?.[f] !== undefined && scores[id]?.[f] !== "" && (v < 0 || v > LIMITS[f] || Number.isNaN(v)); };
  const anyInvalid = rowsToShow.some((s) => Object.keys(LIMITS).some((f) => invalid(s._id, f)));
  const average = rowsToShow.length ? Math.round((rowsToShow.reduce((a, s) => a + total(s._id), 0) / rowsToShow.length) * 100) / 100 : 0;

  async function run(label, fn, okMsg) {
    setBusy(label); setError(""); setMessage("");
    try { const r = await fn(); if (r?.result) hydrate(r.result); setMessage(okMsg || r?.message || "Done."); return r; }
    catch (e) { setError(e.message); return null; } finally { setBusy(""); }
  }

  const payload = () => ({
    student: studentId, session: sessionId, term: termId,
    subjects: rowsToShow.map((s) => ({ subject: s._id, ca1: Number(scores[s._id]?.ca1) || 0, ca2: Number(scores[s._id]?.ca2) || 0, exam: Number(scores[s._id]?.exam) || 0 })),
    teacherComment: comments.teacherComment,
    ...(isAdmin ? { principalComment: comments.principalComment } : {}),
  });

  const save = () => run("save", () => adminApi.saveResult(payload()), "Saved.");
  async function saveAndSubmit() {
    const saved = await run("submit", () => adminApi.saveResult(payload()), "");
    if (!saved) return;
    await run("submit", () => adminApi.submitResult(saved.result._id), "Submitted to the administrator for review.");
  }
  async function sendBack() {
    const r = await run("return", () => adminApi.returnResultToStaff(result._id, reason));
    if (r) { setReturning(false); setReason(""); }
  }

  if (loading) return <LoadingState />;
  if (!student) return <ErrorNote>{error || "Student not found."}</ErrorNote>;
  const hist = [...(result?.history || [])].reverse();

  return (
    <div className="space-y-6">
      <Link to={back} className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-link hover:underline"><ArrowLeft size={16} /> Back to results</Link>

      <div className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-5 sm:flex-row sm:items-center">
        <StudentAvatar student={student} size="xl" square />
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-2xl font-bold text-ink">{student.firstName} {student.middleName} {student.lastName}</h1>
          <p className="mt-1 text-sm text-muted">{student.admissionNumber} · {student.class?.name} · Parent: {student.parent?.name}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3"><StatusBadge value={status} />{result && <span className="text-sm font-semibold text-ink">Average {average}</span>}</div>
        </div>
      </div>

      {status === "RETURNED" && result?.returnReason && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4">
          <p className="text-sm font-bold text-rose-900">Sent back by the administrator</p>
          <p className="mt-1 text-sm text-rose-900">{result.returnReason}</p>
        </div>
      )}
      {!editable && !isAdmin && <SuccessNote>{status === "SUBMITTED" ? "This result is with the administrator for review. You'll see it here again if it is sent back." : "This result has been approved and published to the parent."}</SuccessNote>}

      <ErrorNote>{error}</ErrorNote>
      <SuccessNote>{message}</SuccessNote>

      {!rowsToShow.length ? (
        <ErrorNote>No subjects are set up for {student.class?.name}. Ask the administrator to add subjects to this class.</ErrorNote>
      ) : (
        <div className="overflow-hidden rounded-xl border border-line bg-surface">
          <div className="table-scroll">
            <table className="w-full min-w-[620px] text-sm">
              <thead className="bg-canvas text-xs font-bold uppercase tracking-wide text-muted">
                <tr><th className="px-4 py-3 text-left">Subject</th><th className="px-3 py-3">CA 1 <span className="font-medium normal-case">/20</span></th><th className="px-3 py-3">CA 2 <span className="font-medium normal-case">/20</span></th>
                  <th className="px-3 py-3">Exam <span className="font-medium normal-case">/60</span></th><th className="px-3 py-3">Total</th><th className="px-3 py-3">Grade</th></tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rowsToShow.map((s) => { const t = total(s._id); const g = gradeFor(t, scale); return (
                  <tr key={s._id}>
                    <th scope="row" className="px-4 py-2 text-left font-semibold text-ink">{s.name}</th>
                    {Object.keys(LIMITS).map((f) => (
                      <td key={f} className="px-3 py-2 text-center">
                        <input type="number" inputMode="decimal" min="0" max={LIMITS[f]} disabled={!editable || !!busy}
                          aria-label={`${s.name} ${f}`} aria-invalid={invalid(s._id, f) || undefined}
                          className={`field w-20 text-center tabular-nums ${invalid(s._id, f) ? "!border-rose-600" : ""}`}
                          value={scores[s._id]?.[f] ?? ""} onChange={(e) => set(s._id, f, e.target.value)} />
                      </td>))}
                    <td className="px-3 py-2 text-center text-base font-bold tabular-nums text-ink">{t}</td>
                    <td className="px-3 py-2 text-center"><span className="font-bold text-ink">{g.grade}</span><span className="ml-1 hidden text-xs text-muted sm:inline">{g.remark}</span></td>
                  </tr>); })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-bold text-ink">Class teacher's comment
          <textarea className="field mt-1 min-h-24 font-normal" disabled={!editable} value={comments.teacherComment} onChange={(e) => setComments((c) => ({ ...c, teacherComment: e.target.value }))} /></label>
        {(isAdmin || comments.principalComment) && (
          <label className="text-sm font-bold text-ink">Principal's comment
            <textarea className="field mt-1 min-h-24 font-normal" disabled={!isAdmin || status === "PUBLISHED"} value={comments.principalComment} onChange={(e) => setComments((c) => ({ ...c, principalComment: e.target.value }))} /></label>)}
      </div>

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:rounded-xl lg:border lg:px-4">
        {anyInvalid && <p className="text-sm font-semibold text-rose-700">Fix the highlighted scores first.</p>}
        <div className="ml-auto flex flex-wrap gap-2">
          {editable && <button className="btn btn-outline btn-sm" disabled={!!busy || anyInvalid || !rowsToShow.length} onClick={save}><Save size={16} />{busy === "save" ? "Saving…" : "Save draft"}</button>}
          {editable && !isAdmin && <button className="btn btn-primary btn-sm" disabled={!!busy || anyInvalid || !rowsToShow.length} onClick={saveAndSubmit}><Send size={16} />{busy === "submit" ? "Submitting…" : "Save & submit to admin"}</button>}
          {isAdmin && result && ["DRAFT", "RETURNED"].includes(status) && <button className="btn btn-outline btn-sm" disabled={!!busy} onClick={() => run("submit", () => adminApi.submitResult(result._id))}><Send size={16} />Mark as submitted</button>}
          {isAdmin && status === "SUBMITTED" && <>
            <button className="btn btn-outline btn-sm" disabled={!!busy} onClick={() => setReturning(true)}><Undo2 size={16} />Send back to teacher</button>
            <button className="btn btn-primary btn-sm" disabled={!!busy || anyInvalid} onClick={() => run("publish", () => adminApi.publishResult(result._id))}><CheckCircle2 size={16} />{busy === "publish" ? "Publishing…" : "Approve & publish"}</button></>}
          {isAdmin && status === "PUBLISHED" && <button className="btn btn-outline btn-sm" disabled={!!busy} onClick={() => run("unpublish", () => adminApi.unpublishResult(result._id))}><RotateCcw size={16} />Unpublish</button>}
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(back)}>Close</button>
        </div>
      </div>

      {hist.length > 0 && (
        <section aria-labelledby="hist" className="rounded-xl border border-line bg-surface p-5">
          <h2 id="hist" className="font-display text-lg font-bold text-ink">History</h2>
          <ol className="mt-3 space-y-3">
            {hist.map((h, i) => (
              <li key={i} className="flex gap-3 text-sm"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <div><p className="font-semibold text-ink">{ACTION_LABEL[h.action] || h.action} <span className="font-normal text-muted">· {h.byName} · {new Date(h.at).toLocaleString()}</span></p>
                  {h.note && <p className="text-muted">“{h.note}”</p>}</div></li>))}
          </ol>
        </section>)}

      <Modal open={returning} title="Send back to teacher" onClose={() => setReturning(false)}
        footer={<><button className="btn btn-ghost btn-sm" onClick={() => setReturning(false)}>Cancel</button>
          <button className="btn btn-primary btn-sm" disabled={reason.trim().length < 5 || !!busy} onClick={sendBack}>{busy === "return" ? "Sending…" : "Send back"}</button></>}>
        <label className="text-sm font-bold text-ink">What needs correcting?
          <textarea autoFocus className="field mt-2 min-h-28 font-normal" placeholder="e.g. Mathematics exam score looks too high for this student. Please confirm against the script." value={reason} onChange={(e) => setReason(e.target.value)} /></label>
        <p className="mt-2 text-xs text-muted">The teacher sees this note and can edit and resubmit.</p>
      </Modal>
    </div>
  );
}
