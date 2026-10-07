# Review of v3 and what changed in v4

Reviewed as a senior full-stack developer, UI/UX designer and architect. The brief: a single-school
(not multi-tenant, not SaaS) site with public pages, a parent portal, and admin/teacher roles where
teachers prepare results, the admin approves or sends back, and admin manages students (with passports),
parents, fees and teachers.

## Gaps found against the brief

| # | Finding | Severity | Fix in v4 |
|---|---|---|---|
| 1 | **No image files shipped.** `public/images/` was absent, so every configured path (`/images/logo 3.png`, `gs.png`, `rt 5.jpeg`…) 404'd. Filenames also contained spaces. Gallery and testimonial slots were empty. | High | Full image set in `public/images`, clean filenames, favicon, OG image, every page wired |
| 2 | **Theme tokens broken.** CSS and 100+ utility classes used `--c-cream`, `--c-dark`, `--c-on-dark`, `--c-accent-on-dark`, but `theme.js` never defined them, so page background, footer and dark sections had no colour and light text sat on transparent. Focus ring colour was white. Gold used as text on cream was 2.1:1 contrast. | High | Complete token set, contrast-checked (all text 4.5:1+, body 15:1) |
| 3 | **No passport photos.** `Student.photo` existed but there was no upload, storage or display anywhere. | High | Upload endpoint (type/size checked), avatar component used on student list, results, teacher views, parent portal |
| 4 | **Teachers were not linked to anything.** Any STAFF account could read every student, class and result. | High | Teachers have assigned classes + optional individual students; enforced in the API (403), not just hidden in the UI |
| 5 | **No teacher management.** Staff accounts could only come from the seed script. | High | Admin Teachers page: create, assign classes/students, deactivate, reset password |
| 6 | **Send-back had no reason.** The teacher got a result back with no explanation. Admin could create drafts but had no way to submit them. | Medium | Required written reason, shown to the teacher; history trail; admin can submit drafts |
| 7 | **Teachers had no workspace.** Staff used the admin shell filtered by role. | Medium | Separate `/staff` area: dashboard with "sent back" list, my students, results roster with bulk submit |
| 8 | **Mass assignment.** `updateStudent` and `updateSettings` wrote `req.body` straight into the document. | Medium | Field whitelists |
| 9 | **Weak credentials flow.** 6-character minimum; admin-issued passwords never had to be changed. | Medium | 8 characters; temporary passwords force a change on first sign-in |
| 10 | **Fee rule hard-coded.** Publishing silently depended on a paid invoice. | Low | Same default, now a visible setting with a clear error message |

## Architecture notes

* The shape (Express + Mongoose, config-driven React, JWT roles) is right for a one-school product. No multi-tenancy code was added.
* **Authorisation lives in one place** (`middleware/scope.js`) so every controller asks the same question: "may this user touch this student?".
* **Result state machine** is explicit and enforced server-side; the UI only reflects it.
* Dashboards use a neutral canvas background; the cream/gold look stays on the public site. Headings are weight 700, labels 700, body 400.

## Known limits (not changed)

* JWT is kept in `localStorage` (simple, but exposed to XSS). Moving to an httpOnly cookie is the next hardening step.
* One Result document per student per term means one teacher (the class teacher) enters all subjects. Per-subject teachers would need subject-level assignment.
* Passport files live on local disk; use a persistent volume or move to object storage before scaling out.
* The bundled images are illustrations, not photographs of your school.
