const styles = {
  ACTIVE: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
  INACTIVE: "bg-slate-100 text-slate-600 ring-slate-500/10",
  GRADUATED: "bg-blue-50 text-blue-700 ring-blue-600/10",
  PAID: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
  PARTIALLY_PAID: "bg-amber-50 text-amber-700 ring-amber-600/10",
  UNPAID: "bg-rose-50 text-rose-700 ring-rose-600/10",
  DRAFT: "bg-slate-100 text-slate-700 ring-slate-500/10",
  SUBMITTED: "bg-amber-50 text-amber-800 ring-amber-600/20",
  RETURNED: "bg-rose-50 text-rose-800 ring-rose-600/20",
  NOT_STARTED: "bg-slate-50 text-slate-600 ring-slate-400/20",
  PUBLISHED: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
  SUCCESS: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
  FAILED: "bg-rose-50 text-rose-700 ring-rose-600/10",
};

export default function StatusBadge({ value }) {
  const label = String(value || "—").replaceAll("_", " ");
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ring-1 ${styles[value] || "bg-slate-100 text-slate-700 ring-slate-500/10"}`}>{label}</span>;
}
