import { api } from "./client.js";

const qs = (params = {}) =>
  new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).filter(([, v]) => v)
    )
  ).toString()
    ? `?${new URLSearchParams(
        Object.fromEntries(
          Object.entries(params).filter(([, v]) => v)
        )
      ).toString()}`
    : "";

export const adminApi = {
  overview: () => api.get("/dashboard/overview"),

  // Students
  students: (params) => api.get(`/students${qs(params)}`),
  student: (id) => api.get(`/students/${id}`),
  createStudent: (body) => api.post("/students", body),
  updateStudent: (id, body) => api.put(`/students/${id}`, body),
  deactivateStudent: (id) => api.delete(`/students/${id}`),
  uploadStudentPhoto: (id, file) => {
    const form = new FormData();
    form.append("photo", file);
    return api.put(`/students/${id}/photo`, form);
  },
  removeStudentPhoto: (id) => api.delete(`/students/${id}/photo`),

  // Teachers (admin) and the teacher's own workload
  teachers: () => api.get("/teachers"),
  createTeacher: (body) => api.post("/teachers", body),
  updateTeacher: (id, body) => api.put(`/teachers/${id}`, body),
  resetTeacherPassword: (id) => api.put(`/teachers/${id}/reset-password`),
  staffOverview: () => api.get("/dashboard/staff"),

  // Parents
  parents: () => api.get("/parents"),
  parent: (id) => api.get(`/parents/${id}`),
  createParent: (body) => api.post("/parents", body),
  updateParent: (id, body) => api.put(`/parents/${id}`, body),
  resetParentPassword: (id) =>
    api.put(`/parents/${id}/reset-password`),

  // Classes
  classes: () => api.get("/classes"),
  createClass: (body) => api.post("/classes", body),
  updateClass: (id, body) => api.put(`/classes/${id}`, body),

  // Sessions & terms
  sessions: () => api.get("/sessions"),
  createSession: (body) => api.post("/sessions", body),
  activateSession: (id) =>
    api.put(`/sessions/${id}/activate`),
  terms: (params) => api.get(`/terms${qs(params)}`),
  createTerm: (body) => api.post("/terms", body),
  activateTerm: (id) =>
    api.put(`/terms/${id}/activate`),

  // Subjects
  subjects: (params) => api.get(`/subjects${qs(params)}`),
  createSubject: (body) => api.post("/subjects", body),

  // Fees
  feeStructures: (params) =>
    api.get(`/fees/structures${qs(params)}`),
  createFeeStructure: (body) =>
    api.post("/fees/structures", body),
  updateFeeStructure: (id, body) =>
    api.put(`/fees/structures/${id}`, body),
  generateInvoices: (body) =>
    api.post("/fees/invoices/generate", body),
  invoices: (params) =>
    api.get(`/fees/invoices${qs(params)}`),
  invoice: (id) => api.get(`/fees/invoices/${id}`),
  payments: (params) =>
    api.get(`/payments${qs(params)}`),
  payment: (id) => api.get(`/payments/${id}`),

  // Results
  results: (params) =>
    api.get(`/results${qs(params)}`),
  result: (id) =>
    api.get(`/results/${id}`),
  saveResult: (body) =>
    api.post("/results", body),

  // Staff submits a draft result to admin
  submitResult: (id) =>
    api.put(`/results/${id}/submit`),

  // Admin reviews, returns, publishes and unpublishes results
  returnResultToStaff: (id, reason) =>
    api.put(`/results/${id}/return-to-staff`, { reason }),
  submitBatch: (ids) => api.put("/results/submit-batch", { ids }),
  publishResult: (id) =>
    api.put(`/results/${id}/publish`),
  unpublishResult: (id, reason) =>
    api.put(`/results/${id}/unpublish`, { reason }),

  changePassword: (body) => api.put("/auth/change-password", body),

  // Settings
  settings: () =>
    api.get("/settings"),
  updateSettings: (body) =>
    api.put("/settings", body),

  // Announcements
  announcements: () =>
    api.get("/announcements/all"),
  createAnnouncement: (body) =>
    api.post("/announcements", body),
  deleteAnnouncement: (id) =>
    api.delete(`/announcements/${id}`),
};