export default function StatCard({ label, value, icon: Icon, tone = "primary", helper }) {
  const toneClasses = {
    primary: "bg-primary/10 text-primary",
    gold: "bg-secondary/15 text-secondary-dark",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
  };

  return (
    <div className="group rounded-2xl border border-line bg-surface p-5 shadow-[0_10px_30px_-26px_rgba(0,0,0,0.5)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_-25px_rgba(0,0,0,0.45)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">{value}</p>
          {helper && <p className="mt-1 text-xs text-muted">{helper}</p>}
        </div>
        {Icon && <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${toneClasses[tone]}`}><Icon size={20} /></span>}
      </div>
    </div>
  );
}
