import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserCog, GraduationCap, Megaphone, Users, UserRound, School, Wallet, ArrowUpRight } from "lucide-react";
import { adminApi } from "../api/admin.js";
import { formatNaira, formatDate } from "../utils/format.js";
import PageHeader from "../components/dashboard/PageHeader.jsx";
import StatCard from "../components/dashboard/StatCard.jsx";
import EmptyState from "../components/dashboard/EmptyState.jsx";
import LoadingState from "../components/dashboard/LoadingState.jsx";
import StudentAvatar from "../components/ui/StudentAvatar.jsx";

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi.overview().then((res) => setData(res.overview)).catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">{error}</div>;
  if (!data) return <LoadingState label="Loading school overview…" />;

  const cards = [
    ["Students", data.totalStudents, Users, "primary"],
    ["Parents", data.totalParents, UserRound, "gold"],
    ["Teachers", data.totalTeachers, UserCog, "primary"],
    ["Active classes", data.totalClasses, School, "primary"],
    ["Fees billed", formatNaira(data.totalFeesBilled), Wallet, "warning"],
    ["Collected", formatNaira(data.totalAmountPaid), Wallet, "success"],
    ["Outstanding", formatNaira(data.outstandingBalance), Wallet, "warning"],
  ];

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Administrator" title="School overview" description="A clear snapshot of students, collections and recent activity." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(([label, value, icon, tone]) => <StatCard key={label} label={label} value={value} icon={icon} tone={tone} />)}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ActivityCard title="Recent payments" action={{ to: "/admin/fees", label: "View fees" }}>
          {data.recentPayments.length ? <ul className="divide-y divide-line">{data.recentPayments.map((p) => <li key={p._id} className="flex items-center justify-between gap-4 py-4"><div className="min-w-0"><p className="truncate text-sm font-medium text-ink">{p.student?.firstName} {p.student?.lastName}</p><p className="mt-0.5 text-xs text-muted">{formatDate(p.createdAt)}</p></div><span className="shrink-0 text-sm font-semibold text-ink">{formatNaira(p.amount)}</span></li>)}</ul> : <EmptyState title="No payments yet" description="Successful online payments will appear here." />}
        </ActivityCard>
        <ActivityCard title="Recent students" action={{ to: "/admin/students", label: "View students" }}>
          {data.recentStudents.length ? <ul className="divide-y divide-line">{data.recentStudents.map((s) => <li key={s._id} className="flex items-center justify-between gap-4 py-4"><div className="min-w-0"><p className="truncate text-sm font-medium text-ink">{s.firstName} {s.lastName}</p><p className="mt-0.5 text-xs text-muted">{s.class?.name || "Class not assigned"}</p></div><span className="text-xs text-muted">{formatDate(s.createdAt)}</span></li>)}</ul> : <EmptyState title="No students yet" description="Newly enrolled students will appear here." />}
        </ActivityCard>
      </div>

      <ActivityCard title={`Results awaiting your review${data.awaitingReview.length ? ` (${data.resultsByStatus?.SUBMITTED || data.awaitingReview.length})` : ""}`} action={{ to: "/admin/results", label: "Open review queue" }}>
        {data.awaitingReview.length ? (
          <ul className="divide-y divide-line">
            {data.awaitingReview.map((r) => (
              <li key={r._id} className="flex items-center gap-3 py-3">
                <StudentAvatar student={r.student} />
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-ink">{r.student?.firstName} {r.student?.lastName} <span className="font-normal text-muted">· {r.class?.name}</span></p>
                  <p className="text-xs text-muted">Submitted by {r.preparedBy?.name || "a teacher"} · {formatDate(r.submittedAt)}</p></div>
                <Link to={`/admin/results/edit/${r.student?._id}/${r.session}/${r.term}`} className="btn btn-primary btn-sm">Review</Link>
              </li>))}
          </ul>
        ) : <EmptyState title="Nothing waiting" description="Results submitted by teachers appear here for approval." />}
      </ActivityCard>
    </div>
  );
}

function ActivityCard({ title, action, children }) {
  return <section className="rounded-2xl border border-line bg-surface p-5 shadow-[0_10px_30px_-26px_rgba(0,0,0,.5)] sm:p-6"><div className="flex items-center justify-between gap-4"><h2 className="text-sm font-bold text-ink">{title}</h2><Link to={action.to} className="text-xs font-semibold text-link hover:underline">{action.label}</Link></div><div className="mt-2">{children}</div></section>;
}

export default function AdminOverview() {
  return <AdminDashboard />;
}
