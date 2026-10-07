import { Link } from "react-router-dom";

export default function PageHeader({ title, description, action, eyebrow }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-primary">{eyebrow}</p>}
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">{description}</p>}
      </div>
      {action && (
        <div className="shrink-0">
          {action.to ? <Link to={action.to} className={action.className || "btn btn-primary"}>{action.icon}{action.label}</Link> : action}
        </div>
      )}
    </div>
  );
}
