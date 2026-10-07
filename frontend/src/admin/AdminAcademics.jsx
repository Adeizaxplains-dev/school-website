import { useEffect, useState } from "react";
import { Plus, CheckCircle2 } from "lucide-react";
import { adminApi } from "../api/admin.js";
import PageHeader from "../components/dashboard/PageHeader.jsx";
import StatusBadge from "../components/dashboard/StatusBadge.jsx";
import EmptyState from "../components/dashboard/EmptyState.jsx";

export default function AdminAcademics() {
  const [classes, setClasses] = useState([]); const [sessions, setSessions] = useState([]); const [terms, setTerms] = useState([]); const [subjects, setSubjects] = useState([]);
  const [newClass, setNewClass] = useState(""); const [newSession, setNewSession] = useState(""); const [newSubject, setNewSubject] = useState(""); const [termForm, setTermForm] = useState({ name: "First Term", session: "" }); const [error, setError] = useState(""); const [message, setMessage] = useState("");
  function loadAll() { setError(""); Promise.all([adminApi.classes(), adminApi.sessions(), adminApi.terms(), adminApi.subjects()]).then(([c,s,t,sub]) => { setClasses(c.classes); setSessions(s.sessions); setTerms(t.terms); setSubjects(sub.subjects); }).catch((e) => setError(e.message)); }
  useEffect(loadAll, []);
  async function addClass(e) { e.preventDefault(); if (!newClass.trim()) return; try { await adminApi.createClass({ name: newClass.trim(), order: classes.length }); setNewClass(""); setMessage("Class added."); loadAll(); } catch(e) { setError(e.message); } }
  async function addSession(e) { e.preventDefault(); if (!newSession.trim()) return; try { await adminApi.createSession({ name: newSession.trim() }); setNewSession(""); setMessage("Session added."); loadAll(); } catch(e) { setError(e.message); } }
  async function addTerm(e) { e.preventDefault(); if (!termForm.session) return; try { await adminApi.createTerm(termForm); setMessage("Term added."); loadAll(); } catch(e) { setError(e.message); } }
  async function addSubject(e) { e.preventDefault(); if (!newSubject.trim()) return; try { await adminApi.createSubject({ name: newSubject.trim() }); setNewSubject(""); setMessage("Subject added."); loadAll(); } catch(e) { setError(e.message); } }
  async function activateSession(id) { try { await adminApi.activateSession(id); loadAll(); } catch(e) { setError(e.message); } }
  async function activateTerm(id) { try { await adminApi.activateTerm(id); loadAll(); } catch(e) { setError(e.message); } }

  return <div className="space-y-6">
    <PageHeader eyebrow="Academic setup" title="Academics" description="Keep classes, sessions, terms and subjects aligned before fees and results are entered." />
    {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
    {message && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}
    <div className="grid gap-5 xl:grid-cols-2">
      <SetupCard title="Classes" description="Your school's class structure."><form onSubmit={addClass} className="flex gap-2"><input className="field" placeholder="e.g. JSS 3" value={newClass} onChange={e=>setNewClass(e.target.value)} /><button className="btn btn-primary shrink-0"><Plus size={16}/> Add</button></form><div className="mt-4 grid gap-2 sm:grid-cols-2">{classes.map(c=><div key={c._id} className="flex items-center justify-between rounded-xl bg-cream/70 px-3 py-2.5"><span className="text-sm font-medium text-ink">{c.name}</span><StatusBadge value={c.isActive?"ACTIVE":"INACTIVE"}/></div>)}</div></SetupCard>
      <SetupCard title="Academic sessions" description="Create sessions and mark one as active."><form onSubmit={addSession} className="flex gap-2"><input className="field" placeholder="e.g. 2027/2028" value={newSession} onChange={e=>setNewSession(e.target.value)} /><button className="btn btn-primary shrink-0"><Plus size={16}/> Add</button></form><div className="mt-4 space-y-2">{sessions.map(s=><div key={s._id} className="flex items-center justify-between gap-3 rounded-xl bg-cream/70 px-3 py-2.5"><span className="text-sm font-medium text-ink">{s.name}</span>{s.isActive?<StatusBadge value="ACTIVE"/>:<button onClick={()=>activateSession(s._id)} className="inline-flex items-center gap-1 text-xs font-semibold text-link hover:underline"><CheckCircle2 size={14}/> Activate</button>}</div>)}</div></SetupCard>
      <SetupCard title="Terms" description="Terms belong to a specific academic session."><form onSubmit={addTerm} className="grid gap-2 sm:grid-cols-[1fr_1.2fr_auto]"><select className="field" value={termForm.session} onChange={e=>setTermForm({...termForm,session:e.target.value})}><option value="">Session</option>{sessions.map(s=><option key={s._id} value={s._id}>{s.name}</option>)}</select><select className="field" value={termForm.name} onChange={e=>setTermForm({...termForm,name:e.target.value})}><option>First Term</option><option>Second Term</option><option>Third Term</option></select><button className="btn btn-primary"><Plus size={16}/> Add</button></form><div className="mt-4 space-y-2">{terms.map(t=><div key={t._id} className="flex items-center justify-between rounded-xl bg-cream/70 px-3 py-2.5"><span className="text-sm text-ink">{t.name} · {t.session?.name}</span>{t.isActive?<StatusBadge value="ACTIVE"/>:<button onClick={()=>activateTerm(t._id)} className="text-xs font-semibold text-link hover:underline">Activate</button>}</div>)}</div></SetupCard>
      <SetupCard title="Subjects" description="Subjects available to the result entry system."><form onSubmit={addSubject} className="flex gap-2"><input className="field" placeholder="e.g. Further Mathematics" value={newSubject} onChange={e=>setNewSubject(e.target.value)} /><button className="btn btn-primary shrink-0"><Plus size={16}/> Add</button></form><div className="mt-4 flex flex-wrap gap-2">{subjects.map(s=><span key={s._id} className="rounded-full bg-primary/8 px-3 py-1.5 text-xs font-semibold text-primary">{s.name}</span>)}</div>{subjects.length===0&&<EmptyState title="No subjects" description="Add the subjects teachers will enter results for."/>}</SetupCard>
    </div>
  </div>;
}
function SetupCard({title,description,children}){return <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6"><h2 className="text-base font-semibold text-ink">{title}</h2><p className="mt-1 text-xs leading-5 text-muted">{description}</p>{children}</section>}
