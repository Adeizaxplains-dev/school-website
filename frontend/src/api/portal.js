import { api } from "./client.js";

export const portalApi = {
  children: () => api.get("/students"), // auto-scoped to the logged-in parent
  child: (id) => api.get(`/students/${id}`),

  invoices: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/fees/invoices${qs ? `?${qs}` : ""}`);
  },
  invoice: (id) => api.get(`/fees/invoices/${id}`),
  paymentPolicy: () => api.get("/fees/policy"),

  initializePayment: (invoiceId, amount) => api.post("/payments/initialize", { invoiceId, amount }),
  verifyPayment: (reference) => api.get(`/payments/verify/${reference}`),
  payments: () => api.get("/payments"),
  payment: (id) => api.get(`/payments/${id}`),

  results: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/results${qs ? `?${qs}` : ""}`);
  },
  result: (id) => api.get(`/results/${id}`),
};
