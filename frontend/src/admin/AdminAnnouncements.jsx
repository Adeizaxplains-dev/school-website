import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { adminApi } from "../api/admin.js";
import { useAuth } from "../context/AuthContext.jsx";
import PageHeader from "../components/dashboard/PageHeader.jsx";
import EmptyState from "../components/dashboard/EmptyState.jsx";
import LoadingState from "../components/dashboard/LoadingState.jsx";

export default function AdminAnnouncements() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState(null);
  const [form, setForm] = useState({ title: "", body: "", audience: "ALL" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function load() {
    adminApi.announcements().then((r) => setAnnouncements(r.announcements)).catch((e) => setError(e.message));
  }
  useEffect(load, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await adminApi.createAnnouncement(form);
      setForm({ title: "", body: "", audience: "ALL" });
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this announcement?")) return;
    try {
      await adminApi.deleteAnnouncement(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Communication" title="Announcements" description="Publish clear updates to parents and staff from one place." />

      <form onSubmit={handleSubmit} className="mt-6 space-y-3 rounded-lg border border-line bg-surface p-5">
        <input required placeholder="Title" className="field" value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea required placeholder="Message" rows={3} className="field" value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })} />
        <select className="field" value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}>
          <option value="ALL">Everyone</option>
          <option value="PARENTS">Parents only</option>
          <option value="STAFF">Staff only</option>
        </select>
        {error && <p className="text-sm text-error">{error}</p>}
        <button type="submit" disabled={saving} className="btn btn-primary">
          {saving ? "Posting…" : "Post Announcement"}
        </button>
      </form>

      {!announcements && !error && <div className="mt-6"><LoadingState label="Loading announcements…" /></div>}
      {announcements?.length === 0 && <div className="mt-6"><EmptyState title="No announcements yet" description="Your published updates will appear here." /></div>}
      <ul className="mt-6 space-y-3">
        {announcements?.map((a) => (
          <li key={a._id} className="flex items-start justify-between rounded-lg border border-line bg-surface p-4">
            <div>
              <p className="font-medium text-ink">{a.title}</p>
              <p className="mt-1 text-sm text-muted">{a.body}</p>
              <p className="mt-1 text-xs text-muted">Audience: {a.audience}</p>
            </div>
            {user?.role === "ADMIN" && (
              <button onClick={() => handleDelete(a._id)} className="shrink-0 rounded-lg p-2 text-muted hover:bg-rose-50 hover:text-error" aria-label={`Delete ${a.title}`}>
                <Trash2 size={18} />
              </button>
            )}
          </li>
        ))}

      </ul>
    </div>
  );
}
