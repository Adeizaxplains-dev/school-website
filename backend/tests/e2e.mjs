/**
 * End-to-end smoke test for the role / workflow rules.
 * Needs a running API (default http://localhost:5000/api) with `npm run seed` already applied.
 *   node tests/e2e.mjs
 */
const API = process.env.API_URL || "http://localhost:5000/api";
let pass = 0, fail = 0;
const ok = (cond, label) => { cond ? pass++ : fail++; console.log(`${cond ? "PASS" : "FAIL"}  ${label}`); };

async function call(method, path, { token, body, form } = {}) {
  const res = await fetch(API + path, {
    method,
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(body ? { "Content-Type": "application/json" } : {}) },
    body: form || (body ? JSON.stringify(body) : undefined),
  });
  let data = null; try { data = await res.json(); } catch { /* none */ }
  return { status: res.status, data };
}
const login = async (identifier, password) => (await call("POST", "/auth/login", { body: { identifier, password } })).data;

// 1x1 PNG
const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "base64");

const admin = (await login("admin@school.edu.ng", "ChangeMe123!")).token;
const staffLogin = await login("staff@school.edu.ng", "Staff123!");
const staff = staffLogin.token;
const parentLogin = await login("demo.parent@example.com", "Parent123!");
const parent = parentLogin.token;
ok(admin && staff && parent, "admin, teacher and parent can sign in");

const students = (await call("GET", "/students", { token: admin })).data.students;
const ibrahim = students.find((s) => s.admissionNumber === "DEMO-0001");
const aisha = students.find((s) => s.admissionNumber === "DEMO-0002");
const classes = (await call("GET", "/classes", { token: admin })).data.classes;
const sss1 = classes.find((c) => c.name === "SSS 1");
const parentUser = ibrahim.parent;

// ---- scoping ----
const extra = (await call("POST", "/students", { token: admin, body: { admissionNumber: "E2E-0001", firstName: "Outside", lastName: "Scope", gender: "Male", class: sss1._id, parent: parentUser._id } })).data.student;
let staffSees = (await call("GET", "/students", { token: staff })).data.students.map((s) => s.admissionNumber);
ok(staffSees.includes("DEMO-0001") && staffSees.includes("DEMO-0002") && !staffSees.includes("E2E-0001"), "teacher sees only students in assigned classes");
ok((await call("GET", `/students/${extra._id}`, { token: staff })).status === 403, "teacher cannot open a student outside their classes (403)");
ok((await call("GET", "/classes", { token: staff })).data.classes.every((c) => c.name !== "SSS 1"), "teacher only lists their own classes");
ok((await call("GET", "/students", { token: parent })).data.students.length >= 2, "parent sees their children");
ok((await call("POST", "/students", { token: staff, body: {} })).status === 403, "teacher cannot create students (403)");
ok((await call("GET", "/teachers", { token: staff })).status === 403, "teacher cannot list teachers (403)");

// ---- admin creates teacher, links class + an individual student ----
const email = `e2e.teacher.${Date.now()}@school.edu.ng`;
const created = (await call("POST", "/teachers", { token: admin, body: { name: "E2E Teacher", email, staffId: "E2E-1", assignedClasses: [sss1._id] } })).data;
ok(created.success && created.temporaryPassword?.length >= 8, "admin creates a teacher with a temporary password");
const t1 = await login(email, created.temporaryPassword);
ok(t1.user?.mustChangePassword === true, "new teacher must change password on first sign-in");
ok((await call("GET", "/students", { token: t1.token })).data.students.some((s) => s.admissionNumber === "E2E-0001"), "new teacher sees the student in their newly assigned class");
ok((await call("GET", `/students/${ibrahim._id}`, { token: t1.token })).status === 403, "new teacher cannot see other classes' students");
await call("PUT", `/teachers/${created.teacher.id}`, { token: admin, body: { assignedStudents: [ibrahim._id] } });
ok((await call("GET", `/students/${ibrahim._id}`, { token: t1.token })).status === 200, "individually linked student becomes visible");
ok((await call("PUT", "/auth/change-password", { token: t1.token, body: { currentPassword: created.temporaryPassword, newPassword: "short" } })).status === 400, "weak new password rejected");
ok((await call("PUT", "/auth/change-password", { token: t1.token, body: { currentPassword: created.temporaryPassword, newPassword: "BetterPass#2026" } })).data.success, "teacher changes password");
ok((await login(email, "BetterPass#2026")).user?.mustChangePassword === false, "must-change flag cleared");
await call("PUT", `/teachers/${created.teacher.id}`, { token: admin, body: { isActive: false } });
ok(!(await login(email, "BetterPass#2026")).token, "deactivated teacher cannot sign in");

// ---- passport upload ----
const f = new FormData(); f.append("photo", new Blob([PNG], { type: "image/png" }), "x.png");
const up = await call("PUT", `/students/${ibrahim._id}/photo`, { token: admin, form: f });
ok(up.data.success && up.data.student.photo.startsWith("/uploads/passports/"), "admin uploads a passport photo");
const img = await fetch(API.replace("/api", "") + up.data.student.photo);
ok(img.status === 200 && img.headers.get("content-type") === "image/png", "passport is served as an image");
const bad = new FormData(); bad.append("photo", new Blob(["not an image"], { type: "text/plain" }), "x.txt");
ok((await call("PUT", `/students/${ibrahim._id}/photo`, { token: admin, form: bad })).status === 400, "non-image upload rejected");
const big = new FormData(); big.append("photo", new Blob([Buffer.alloc(2 * 1024 * 1024)], { type: "image/png" }), "big.png");
ok((await call("PUT", `/students/${ibrahim._id}/photo`, { token: admin, form: big })).status === 400, "oversized upload rejected");
const fs2 = new FormData(); fs2.append("photo", new Blob([PNG], { type: "image/png" }), "x.png");
ok((await call("PUT", `/students/${ibrahim._id}/photo`, { token: staff, form: fs2 })).status === 403, "teacher cannot upload passports (403)");
const pr = (await call("GET", "/students", { token: parent })).data.students.find((s) => s._id === ibrahim._id);
ok(pr.photo === up.data.student.photo, "parent portal data carries the passport");

// ---- result workflow ----
const sessions = (await call("GET", "/sessions", { token: admin })).data.sessions;
const session = sessions.find((s) => s.isActive) || sessions[0];
const term = (await call("GET", `/terms?session=${session._id}`, { token: admin })).data.terms[0];
const subjects = (await call("GET", "/subjects", { token: admin })).data.subjects.slice(0, 2);
const rows = (a) => subjects.map((s, i) => ({ subject: s._id, ca1: 15 + a, ca2: 14, exam: 40 + i }));
const mk = (id, a = 0, extraBody = {}) => ({ student: id, session: session._id, term: term._id, subjects: rows(a), ...extraBody });

ok((await call("POST", "/results", { token: staff, body: mk(ibrahim._id) })).status === 400, "teacher cannot overwrite a published result");
ok((await call("POST", "/results", { token: staff, body: mk(aisha._id) })).status === 400, "teacher cannot edit a result that is with the admin");
ok((await call("POST", "/results", { token: staff, body: mk(extra._id) })).status === 403, "teacher cannot enter results for students outside their classes");
const tooHigh = mk(aisha._id); tooHigh.subjects[0].ca1 = 25;
ok((await call("POST", "/results", { token: admin, body: tooHigh })).status === 400, "CA1 above 20 rejected");

const list = (await call("GET", `/results?session=${session._id}&term=${term._id}`, { token: admin })).data.results;
const aishaResult = list.find((r) => r.student._id === aisha._id);
ok(aishaResult.status === "SUBMITTED", "seed: second child's result awaits review");
ok((await call("PUT", `/results/${aishaResult._id}/return-to-staff`, { token: staff, body: { reason: "please recheck maths" } })).status === 403, "teacher cannot send results back (403)");
ok((await call("PUT", `/results/${aishaResult._id}/return-to-staff`, { token: admin, body: { reason: "" } })).status === 400, "return requires a reason");
const ret = await call("PUT", `/results/${aishaResult._id}/return-to-staff`, { token: admin, body: { reason: "Maths exam looks too high. Please recheck." } });
ok(ret.data.result?.status === "RETURNED" && ret.data.result.returnReason.includes("Maths"), "admin sends result back with a reason");
ok((await call("GET", `/results/${aishaResult._id}`, { token: parent })).status === 403, "parent cannot open an unpublished result");

const fix = await call("POST", "/results", { token: staff, body: mk(aisha._id, 2, { teacherComment: "Rechecked." }) });
ok(fix.data.result?.status === "RETURNED", "teacher can edit a returned result");
ok((await call("PUT", `/results/${aishaResult._id}/publish`, { token: admin })).status === 400, "cannot publish a result that was not re-submitted");
const sub = await call("PUT", "/results/submit-batch", { token: staff, body: { ids: [aishaResult._id] } });
ok(sub.data.submitted === 1, "teacher re-submits (batch)");
const pubBlocked = await call("PUT", `/results/${aishaResult._id}/publish`, { token: admin });
ok(pubBlocked.status === 400 && /invoice|fees/i.test(pubBlocked.data.message), "publish blocked when fee rule is on and there is no paid invoice");
await call("PUT", "/settings", { token: admin, body: { requirePaidFeesToPublish: false } });
const pub = await call("PUT", `/results/${aishaResult._id}/publish`, { token: admin });
ok(pub.data.result?.status === "PUBLISHED", "admin approves & publishes (fee rule off)");
const parentList = (await call("GET", "/results", { token: parent })).data.results;
ok(parentList.length >= 2 && parentList.every((r) => r.status === "PUBLISHED"), "parent sees only published results");
const hist = pub.data.result.history.map((h) => h.action);
ok(["SUBMITTED", "RETURNED", "SAVED", "PUBLISHED"].every((a) => hist.includes(a)), "audit history records every step");
const un = await call("PUT", `/results/${aishaResult._id}/unpublish`, { token: admin, body: { reason: "Typo in remark" } });
ok(un.data.result?.status === "SUBMITTED", "unpublish returns the result to the review queue");
await call("PUT", "/settings", { token: admin, body: { requirePaidFeesToPublish: true } });

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
