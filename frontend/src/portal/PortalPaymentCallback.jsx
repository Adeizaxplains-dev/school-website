import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { portalApi } from "../api/portal.js";
import { formatNaira } from "../utils/format.js";

export default function PortalPaymentCallback() {
  const [params] = useSearchParams();
  const reference = params.get("reference") || params.get("trxref");
  const [state, setState] = useState("checking"); // checking | success | failed | error
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!reference) {
      setState("error");
      setError("No payment reference was returned. If money left your account, contact the school office.");
      return;
    }
    // The frontend never decides "payment succeeded" on its own — this call
    // re-verifies with Paystack on the backend and only then updates the invoice.
    portalApi
      .verifyPayment(reference)
      .then((res) => {
        setPayment(res.payment);
        setState(res.status === "SUCCESS" ? "success" : "failed");
      })
      .catch((err) => {
        setState("error");
        setError(err.message);
      });
  }, [reference]);

  return (
    <div className="mx-auto max-w-md text-center">
      {state === "checking" && (
        <div className="rounded-lg border border-line bg-surface p-8">
          <Loader2 className="mx-auto animate-spin text-primary" size={40} />
          <p className="mt-4 text-ink">Confirming your payment with Paystack…</p>
        </div>
      )}

      {state === "success" && (
        <div className="rounded-lg border border-line bg-surface p-8">
          <CheckCircle2 className="mx-auto text-green-600" size={44} />
          <h1 className="mt-4 font-display text-xl text-ink">Payment successful</h1>
          {payment && <p className="mt-2 text-sm text-muted">{formatNaira(payment.amount)} received. Reference {payment.reference}.</p>}
          <div className="mt-6 flex flex-col gap-2">
            {payment && (
              <Link to={`/portal/receipts/${payment._id}`} className="btn btn-primary w-full">
                View Receipt
              </Link>
            )}
            <Link to="/portal/fees" className="btn btn-outline w-full">
              Back to Fees
            </Link>
          </div>
        </div>
      )}

      {state === "failed" && (
        <div className="rounded-lg border border-line bg-surface p-8">
          <XCircle className="mx-auto text-error" size={44} />
          <h1 className="mt-4 font-display text-xl text-ink">Payment was not successful</h1>
          <p className="mt-2 text-sm text-muted">No charge was recorded against your invoice. You can try again.</p>
          <Link to="/portal/fees" className="btn btn-outline mt-6 w-full">
            Back to Fees
          </Link>
        </div>
      )}

      {state === "error" && (
        <div className="rounded-lg border border-line bg-surface p-8">
          <XCircle className="mx-auto text-error" size={44} />
          <h1 className="mt-4 font-display text-xl text-ink">Couldn't confirm this payment</h1>
          <p className="mt-2 text-sm text-muted">{error}</p>
          <Link to="/portal/payments" className="btn btn-outline mt-6 w-full">
            View Payment History
          </Link>
        </div>
      )}
    </div>
  );
}
