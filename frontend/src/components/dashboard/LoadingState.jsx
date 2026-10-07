export default function LoadingState({ label = "Loading…" }) {
  return (
    <div className="flex min-h-40 items-center justify-center rounded-2xl border border-line bg-surface px-6 py-8 text-sm text-muted">
      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
      {label}
    </div>
  );
}
