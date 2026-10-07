import fetch from "node-fetch";
import crypto from "crypto";
import { ApiError } from "../middleware/ApiError.js";

const BASE_URL = "https://api.paystack.co";

function secretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new ApiError(500, "Payments are not configured on this server yet.");
  return key;
}

/**
 * Starts a Paystack transaction. Amount must be passed in kobo (naira * 100).
 * Only ever called from the backend — the secret key never reaches the browser.
 */
export async function initializeTransaction({ email, amountKobo, reference, callback_url, metadata }) {
  const res = await fetch(`${BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, amount: amountKobo, reference, callback_url, metadata }),
  });
  const data = await res.json();
  if (!res.ok || !data.status) {
    throw new ApiError(502, data.message || "Could not start the payment with Paystack.");
  }
  return data.data; // { authorization_url, access_code, reference }
}

/** Verifies a transaction by reference. This is the ONLY source of truth for "did the payment succeed". */
export async function verifyTransaction(reference) {
  const res = await fetch(`${BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secretKey()}` },
  });
  const data = await res.json();
  if (!res.ok || !data.status) {
    throw new ApiError(502, data.message || "Could not verify the payment with Paystack.");
  }
  return data.data; // { status: 'success'|'failed'|..., amount, reference, channel, paid_at, ... }
}

/** Verifies the X-Paystack-Signature header on incoming webhook requests. */
export function verifyWebhookSignature(rawBody, signatureHeader) {
  const hash = crypto.createHmac("sha512", secretKey()).update(rawBody).digest("hex");
  return hash === signatureHeader;
}
