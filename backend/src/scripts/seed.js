import "dotenv/config";
import { connectDB } from "../config/db.js";
import mongoose from "mongoose";

import User from "../models/User.js";
import SchoolClass from "../models/SchoolClass.js";
import AcademicSession from "../models/AcademicSession.js";
import Term from "../models/Term.js";
import Subject from "../models/Subject.js";
import Student from "../models/Student.js";
import FeeStructure from "../models/FeeStructure.js";
import Invoice from "../models/Invoice.js";
import Result from "../models/Result.js";
import SchoolSettings from "../models/SchoolSettings.js";
import Announcement from "../models/Announcement.js";

/**
 * Development-only seed data, clearly marked so it is easy to find and
 * remove before a school goes live. Run with: npm run seed
 */
async function seed() {
  await connectDB();
  console.log("[seed] connected. Seeding demo data...");

  // --- Settings ---
  await SchoolSettings.getSingleton();

  // --- Admin ---
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@school.edu.ng";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({ name: "School Admin", email: adminEmail, password: adminPassword, role: "ADMIN" });
    console.log(`[seed] created admin -> ${adminEmail} / ${adminPassword}`);
  } else {
    console.log(`[seed] admin already exists -> ${adminEmail}`);
  }

  // --- Staff ---
  let staff = await User.findOne({ email: "staff@school.edu.ng" });
  if (!staff) {
    staff = await User.create({
      name: "[DEMO] Staff Teacher",
      email: "staff@school.edu.ng",
      password: "Staff123!",
      role: "STAFF",
    });
    console.log("[seed] created staff -> staff@school.edu.ng / Staff123!");
  }

  // --- Classes ---
  const classNames = ["Nursery 1", "Nursery 2", "Primary 1", "Primary 2", "JSS 1", "JSS 2", "SSS 1"];
  const classes = {};
  for (const [i, name] of classNames.entries()) {
    classes[name] = await SchoolClass.findOneAndUpdate(
      { name },
      { name, order: i },
      { upsert: true, new: true }
    );
  }

  // --- Link the demo teacher to classes (they only see these classes' students) ---
  await User.updateOne(
    { _id: staff._id },
    { $set: { staffId: "STF-001", assignedClasses: [classes["JSS 2"]._id, classes["Primary 2"]._id] } }
  );

  // --- Session & Term ---
  let session = await AcademicSession.findOne({ name: "2026/2027" });
  if (!session) session = await AcademicSession.create({ name: "2026/2027", isActive: true });

  let term = await Term.findOne({ name: "First Term", session: session._id });
  if (!term) term = await Term.create({ name: "First Term", session: session._id, isActive: true });

  // --- Subjects ---
  const subjectNames = ["Mathematics", "English Language", "Basic Science", "Social Studies"];
  const subjects = [];
  for (const name of subjectNames) {
    const subject = await Subject.findOneAndUpdate({ name }, { name }, { upsert: true, new: true });
    subjects.push(subject);
  }

  // --- Demo parent + children ---
  let parent = await User.findOne({ email: "demo.parent@example.com" });
  if (!parent) {
    parent = await User.create({
      name: "[DEMO] Mrs Adeyemi",
      email: "demo.parent@example.com",
      phone: "08010000000",
      password: "Parent123!",
      role: "PARENT",
    });
    console.log("[seed] created demo parent -> demo.parent@example.com / Parent123!");
  }

  const studentDefs = [
    { firstName: "[DEMO] Ibrahim", lastName: "Adeyemi", gender: "Male", cls: "JSS 2", adm: "DEMO-0001" },
    { firstName: "[DEMO] Aisha", lastName: "Adeyemi", gender: "Female", cls: "Primary 2", adm: "DEMO-0002" },
  ];
  const students = [];
  for (const def of studentDefs) {
    let student = await Student.findOne({ admissionNumber: def.adm });
    if (!student) {
      student = await Student.create({
        admissionNumber: def.adm,
        firstName: def.firstName,
        lastName: def.lastName,
        gender: def.gender,
        class: classes[def.cls]._id,
        parent: parent._id,
        status: "ACTIVE",
      });
    }
    students.push(student);
  }

  // --- Fee structure for JSS 2 ---
  let feeStructure = await FeeStructure.findOne({ session: session._id, term: term._id, class: classes["JSS 2"]._id });
  if (!feeStructure) {
    feeStructure = await FeeStructure.create({
      session: session._id,
      term: term._id,
      class: classes["JSS 2"]._id,
      items: [
        { name: "Tuition", amount: 80000 },
        { name: "Books", amount: 10000 },
        { name: "ICT", amount: 5000 },
        { name: "Development", amount: 5000 },
      ],
    });
  }

  // --- Invoice for Ibrahim (JSS 2) ---
  const ibrahim = students[0];
  let invoice = await Invoice.findOne({ student: ibrahim._id, session: session._id, term: term._id });
  if (!invoice) {
    invoice = await Invoice.create({
      invoiceNumber: "INV-DEMO1",
      student: ibrahim._id,
      parent: parent._id,
      session: session._id,
      term: term._id,
      feeStructure: feeStructure._id,
      items: feeStructure.items,
      totalAmount: feeStructure.totalAmount,
      amountPaid: 40000,
      balance: feeStructure.totalAmount - 40000,
      status: "PARTIALLY_PAID",
    });
  }

  // --- Published result for Ibrahim ---
  let result = await Result.findOne({ student: ibrahim._id, session: session._id, term: term._id });
  if (!result) {
    const scored = subjects.map((s, i) => ({
      subject: s._id,
      ca1: 15 + i,
      ca2: 10 + i,
      exam: 45 + i,
      total: 70 + 2 * i,
      grade: "A",
      remark: "Excellent",
    }));
    result = await Result.create({
      student: ibrahim._id,
      class: classes["JSS 2"]._id,
      session: session._id,
      term: term._id,
      subjects: scored,
      average: scored.reduce((s, x) => s + x.total, 0) / scored.length,
      teacherComment: "[DEMO] A hardworking and attentive student.",
      principalComment: "[DEMO] Keep up the good work.",
      status: "PUBLISHED",
      publishedAt: new Date(),
    });
  }

  // --- A submitted (awaiting review) result for the second child ---
  const aisha = students[1];
  if (!(await Result.findOne({ student: aisha._id, session: session._id, term: term._id }))) {
    const scored = subjects.map((s, i) => ({ subject: s._id, ca1: 12 + i, ca2: 14, exam: 40 + i, total: 66 + i, grade: "B", remark: "Very Good" }));
    await Result.create({
      student: aisha._id, class: classes["Primary 2"]._id, session: session._id, term: term._id,
      subjects: scored, average: scored.reduce((s, x) => s + x.total, 0) / scored.length,
      teacherComment: "[DEMO] Shows steady improvement.", status: "SUBMITTED", submittedAt: new Date(), preparedBy: staff._id,
      history: [{ action: "SUBMITTED", by: staff._id, byName: staff.name }],
    });
  }

  // --- Sample announcements ---
  const announcementCount = await Announcement.countDocuments();
  if (announcementCount === 0) {
    await Announcement.insertMany([
      {
        title: "[DEMO] Resumption Date for First Term",
        body: "[DEMO] School resumes for the 2026/2027 First Term on the date communicated to all parents.",
        audience: "PARENTS",
      },
      {
        title: "[DEMO] Staff Meeting Reminder",
        body: "[DEMO] All staff should attend the term-opening meeting in the staff room.",
        audience: "STAFF",
      },
    ]);
    console.log("[seed] created sample announcements");
  }

  console.log("[seed] done.");
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});
