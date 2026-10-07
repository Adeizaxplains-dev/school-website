import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ClipboardList, Send, Users, Undo2 } from "lucide-react";
import { adminApi } from "../api/admin.js";
import { useAuth } from "../context/AuthContext.jsx";
import PageHeader from "../components/dashboard/PageHeader.jsx";
import StatCard from "../components/dashboard/StatCard.jsx";
import EmptyState from "../components/dashboard/EmptyState.jsx";
import LoadingState from "../components/dashboard/LoadingState.jsx";
import StudentAvatar from "../components/ui/StudentAvatar.jsx";
import { ErrorNote } from "../components/ui/Feedback.jsx";

export default function StaffDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { adminApi.staffOverview().then((r) => setData(r.overview)).catch((e) => setError(e.message)); }, []);

  if (error) return <ErrorNote>{error}</ErrorNote>;
  if (!data) return <LoadingState />;
  const by = data.resultsByStatus || {};

  return (
    <div className="space-y-7">
      <PageHeader eyebrow="Teacher workspace" title={`Welcome, ${user.name.split(" ")[0]}`} description="Your classes, results waiting for you, and what the administrator has sent back." />

      {!data.classes.length && <EmptyState title="No class assigned yet" description="Ask the administrator to assign you to a class. Once they do, your students appear here." />}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="My students" value={data.totalStudents} icon={Users} />
        <StatCard label="Drafts" value={by.DRAFT || 0} icon={ClipboardList} tone="gold" helper="Saved, not submitted" />
        <StatCard label="With admin" value={by.SUBMITTED || 0} icon={Send} tone="warning" helper="Awaiting review" />
        <StatCard label="Sent back" value={by.RETURNED || 0} icon={Undo2} tone={by.RETURNED ? "warning" : "success"} helper="Needs your correction" />
      </div>

      {data.returned.length > 0 && (
        <section className="rounded-xl border border-rose-200 bg-rose-50 p-5">
          <h2 className="font-display text-lg font-bold text-rose-900">Sent back for correction</h2>
          <ul className="mt-3 divide-y divide-rose-200">
            {data.returned.map((r) => (
              <li key={r._id} className="flex items-center gap-3 py-3">
                <StudentAvatar student={r.student} />
                <div className="min-w-0 flex-1"><p className="font-semibold text-rose-950">{r.student?.firstName} {r.student?.lastName} <span className="font-normal text-rose-800">· {r.class?.name} · {r.term?.name}</span></p>
                  <p className="truncate text-sm text-rose-900">“{r.returnReason}”</p></div>
                <Link className="btn btn-primary btn-sm" to={`/staff/results/edit/${r.student?._id}/${r.session}/${r.term?._id}`}>Fix <ArrowRight size={15} /></Link>
              </li>))}
          </ul>
        </section>)}

      <div className="flex flex-wrap gap-3">
        <Link to="/staff/results" className="btn btn-primary"><ClipboardList size={17} /> Enter results</Link>
        <Link to="/staff/students" className="btn btn-outline"><Users size={17} /> My students</Link>
      </div>
    </div>
  );
}
