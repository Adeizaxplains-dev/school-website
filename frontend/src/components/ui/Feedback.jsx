import { AlertCircle, CheckCircle2 } from "lucide-react";

export function ErrorNote({ children }) {
  if (!children) return null;
  return <div role="alert" className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800"><AlertCircle size={17} className="mt-0.5 shrink-0" />{children}</div>;
}
export function SuccessNote({ children }) {
  if (!children) return null;
  return <div role="status" className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900"><CheckCircle2 size={17} className="mt-0.5 shrink-0" />{children}</div>;
}
