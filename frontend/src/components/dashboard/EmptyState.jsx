import { Inbox } from "lucide-react";

export default function EmptyState({ title = "Nothing here yet", description = "There is no data to display." }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-surface px-6 py-8 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cream text-muted"><Inbox size={20} /></span>
      <p className="mt-3 text-sm font-semibold text-ink">{title}</p>
      <p className="mt-1 max-w-sm text-xs leading-5 text-muted">{description}</p>
    </div>
  );
}
