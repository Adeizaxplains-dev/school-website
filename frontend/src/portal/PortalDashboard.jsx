import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Wallet } from "lucide-react";
import { portalApi } from "../api/portal.js";
import { formatNaira } from "../utils/format.js";
import PageHeader from "../components/dashboard/PageHeader.jsx";
import StatCard from "../components/dashboard/StatCard.jsx";
import EmptyState from "../components/dashboard/EmptyState.jsx";
import LoadingState from "../components/dashboard/LoadingState.jsx";
import StudentAvatar from "../components/ui/StudentAvatar.jsx";

export default function PortalDashboard(){
 const [children,setChildren]=useState(null),[invoices,setInvoices]=useState([]),[error,setError]=useState("");
 useEffect(()=>{Promise.all([portalApi.children(),portalApi.invoices()]).then(([c,i])=>{setChildren(c.students);setInvoices(i.invoices)}).catch(e=>setError(e.message))},[]);
 function balanceFor(id){return invoices.filter(i=>i.student?._id===id).reduce((sum,i)=>sum+i.balance,0)}
 const totalOutstanding=invoices.reduce((sum,i)=>sum+i.balance,0);
 return <div className="space-y-7"><PageHeader eyebrow="Parent portal" title="Your school overview" description="Keep track of your children, outstanding fees and published results."/>{error&&<div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}{!children&&!error?<LoadingState label="Loading your school overview…"/>:<><div className="grid gap-4 sm:grid-cols-2"><StatCard label="Linked children" value={children.length} icon={GraduationCap}/><StatCard label="Outstanding fees" value={formatNaira(totalOutstanding)} icon={Wallet} tone={totalOutstanding?"warning":"success"}/></div>{children.length===0?<EmptyState title="No children linked yet" description="Contact the school office to link your child to this parent account."/>:<section><div className="mb-3 flex items-end justify-between"><div><h2 className="text-base font-semibold text-ink">My children</h2><p className="mt-1 text-xs text-muted">Choose a child to view their fees or results.</p></div></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{children.map(child=>{const balance=balanceFor(child._id);return <article key={child._id} className="rounded-2xl border border-line bg-surface p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><StudentAvatar student={child} size="lg" square /><div className="min-w-0 flex-1"><h3 className="font-display text-xl font-bold text-ink">{child.fullName}</h3><p className="mt-1 text-xs text-muted">{child.class?.name||"Class not assigned"} · {child.admissionNumber}</p></div><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${balance>0?"bg-amber-50 text-amber-700":"bg-emerald-50 text-emerald-700"}`}>{balance>0?"BALANCE DUE":"PAID"}</span></div><div className="mt-5 rounded-xl bg-cream p-4"><p className="text-xs text-muted">Outstanding balance</p><p className="mt-1 text-xl font-semibold text-ink">{formatNaira(balance)}</p></div><div className="mt-4 grid grid-cols-2 gap-2"><Link to={`/portal/fees?student=${child._id}`} className="btn btn-outline btn-sm"><Wallet size={15}/> Fees</Link><Link to={`/portal/results?student=${child._id}`} className="btn btn-outline btn-sm"><GraduationCap size={15}/> Results</Link></div></article>})}</div></section>}</>}</div>;
}
