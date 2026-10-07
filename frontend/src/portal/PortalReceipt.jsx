import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Printer, CheckCircle2, XCircle } from "lucide-react";
import { portalApi } from "../api/portal.js";
import { formatNaira, formatDate } from "../utils/format.js";
import { schoolConfig } from "../config/school.config.js";

export default function PortalReceipt() {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    portalApi
      .payment(id)
      .then((res) => setPayment(res.payment))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p className="text-sm text-error">{error}</p>;
  if (!payment) return <p className="text-sm text-muted">Loading…</p>;

  const isSuccess = payment.status === "SUCCESS";

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-4 flex items-center justify-between print:hidden">
        <Link to="/portal/payments" className="text-sm text-link hover:underline">
          &larr; Back to payment history
        </Link>
        {isSuccess && (
          <button onClick={() => window.print()} className="btn btn-outline btn-sm">
            <Printer size={16} /> Print Receipt
          </button>
        )}
      </div>

      <div className="rounded-lg border border-line bg-surface p-8 print:border-0 print:p-0">
        <div className="text-center">
          {schoolConfig.school.logo && (
            <img src={schoolConfig.school.logo} alt="" className="mx-auto mb-3 h-14 w-14 object-contain" />
          )}
          <h1 className="font-display text-xl text-ink">{schoolConfig.school.name}</h1>
          <p className="text-sm text-muted">
            {[schoolConfig.school.address?.area, schoolConfig.school.address?.lga, schoolConfig.school.address?.state]
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {isSuccess ? (
            <span className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-sm font-medium text-green-800">
              <CheckCircle2 size={16} /> Payment Successful
            </span>
          ) : (
            <span className="flex items-center gap-2 rounded-full bg-red-100 px-4 py-1.5 text-sm font-medium text-red-800">
              <XCircle size={16} /> Payment Failed
            </span>
          )}
        </div>

        <dl className="mt-6 space-y-3 border-t border-line pt-6 text-sm">
          <Row label="Parent" value={payment.parent?.name} />
          <Row label="Student" value={`${payment.student?.firstName} ${payment.student?.lastName}`} />
          <Row label="Admission No." value={payment.student?.admissionNumber} />
          <Row label="Invoice" value={payment.invoice?.invoiceNumber} />
          <Row label="Payment Reference" value={payment.reference} mono />
          <Row label="Amount Paid" value={formatNaira(payment.amount)} bold />
          <Row label="Payment Date" value={formatDate(payment.paidAt || payment.createdAt)} />
          <Row label="Payment Method" value={payment.channel || "—"} />
          <Row label="Status" value={payment.status} />
        </dl>

        <p className="mt-8 text-center text-xs text-muted">
          This receipt was generated automatically and is valid without a signature.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value, mono, bold }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted">{label}</dt>
      <dd className={`text-right text-ink ${mono ? "font-mono text-xs" : ""} ${bold ? "text-base font-semibold" : ""}`}>
        {value || "—"}
      </dd>
    </div>
  );
}
