import mongoose from "mongoose";

const subjectResultSchema = new mongoose.Schema(
  {
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    // Continuous Assessment 1 — maximum 20
    ca1: {
      type: Number,
      default: 0,
      min: 0,
      max: 20,
    },

    // Continuous Assessment 2 — maximum 20
    ca2: {
      type: Number,
      default: 0,
      min: 0,
      max: 20,
    },

    // Examination — maximum 60
    exam: {
      type: Number,
      default: 0,
      min: 0,
      max: 60,
    },

    // CA1 + CA2 + Exam = 100
    total: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    grade: {
      type: String,
      default: "",
    },

    remark: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SchoolClass",
      required: true,
    },

    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicSession",
      required: true,
    },

    term: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Term",
      required: true,
    },

    subjects: {
      type: [subjectResultSchema],
      default: [],
    },

    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    teacherComment: {
      type: String,
      default: "",
    },

    principalComment: {
      type: String,
      default: "",
    },

    /*
     * Result workflow:
     *
     * DRAFT ──submit──▶ SUBMITTED ──publish──▶ PUBLISHED
     *   ▲                   │
     *   └──── RETURNED ◀────┘  (admin sends back with a reason)
     *
     * STAFF edits DRAFT / RETURNED results for their own classes and submits.
     * ADMIN reviews SUBMITTED results: approve (publish) or return with a reason.
     * PARENTS only ever see PUBLISHED results.
     */
    status: {
      type: String,
      enum: ["DRAFT", "SUBMITTED", "RETURNED", "PUBLISHED"],
      default: "DRAFT",
    },

    submittedAt: {
      type: Date,
    },

    // Why the admin sent it back (shown to the teacher until resubmitted).
    returnReason: {
      type: String,
      default: "",
    },

    // Teacher who prepared / submitted it.
    preparedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // Append-only audit trail of every workflow step.
    history: [
      {
        _id: false,
        action: { type: String, required: true },
        by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        byName: { type: String },
        note: { type: String, default: "" },
        at: { type: Date, default: Date.now },
      },
    ],

    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

/*
 * One result per student for each session and term.
 */
resultSchema.index(
  {
    student: 1,
    session: 1,
    term: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model("Result", resultSchema);