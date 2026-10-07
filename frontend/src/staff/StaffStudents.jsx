import { useEffect, useMemo, useState } from "react";
import { adminApi } from "../api/admin.js";
import PageHeader from "../components/dashboard/PageHeader.jsx";
import LoadingState from "../components/dashboard/LoadingState.jsx";
import EmptyState from "../components/dashboard/EmptyState.jsx";
import StudentAvatar from "../components/ui/StudentAvatar.jsx";
import { ErrorNote } from "../components/ui/Feedback.jsx";

export default function StaffStudents() {
  const [students, setStudents] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { adminApi.students({ status: "ACTIVE" }).then((r) => setStudents(r.students)).catch((e) => setError(e.message)); }, []);

  const groups = useMemo(() => {
    const map = new Map();
    (students || []).forEach((s) => { const k = s.class?.name || "No class"; map.set(k, [...(map.get(k) || []), s]); });
    return [...map.entries()];
  }, [students]);

  if (error) return <ErrorNote>{error}</ErrorNote>;
  if (!students) return <LoadingState />;

  return (
    <div className="space-y-7">
      <PageHeader eyebrow="Teacher workspace" title="My students" description="Learners in the classes assigned to you." />
      {!students.length ? <EmptyState title="No students yet" description="You will see students here once the administrator assigns you a class." /> :
        groups.map(([name, list]) => (
          <section key={name}>
            <h2 className="mb-3 font-display text-lg font-bold text-ink">{name} <span className="text-sm font-semibold text-muted">· {list.length}</span></h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((s) => (
                <li key={s._id} className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3">
                  <StudentAvatar student={s} size="md" /><div className="min-w-0"><p className="truncate font-semibold text-ink">{s.firstName} {s.lastName}</p><p className="text-xs text-muted">{s.admissionNumber} · {s.gender}</p></div>
                </li>))}
            </ul>
          </section>))}
    </div>
  );
}
