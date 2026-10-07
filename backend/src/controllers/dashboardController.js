import Student from "../models/Student.js";
import User from "../models/User.js";
import SchoolClass from "../models/SchoolClass.js";
import Invoice from "../models/Invoice.js";
import Payment from "../models/Payment.js";
import Result from "../models/Result.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { studentFilterFor } from "../middleware/scope.js";

/** GET /api/dashboard/overview — ADMIN summary. */
export const getOverview = asyncHandler(async (req, res) => {
  const [totalStudents, totalParents, totalTeachers, totalClasses, invoiceAgg, resultCounts, recentPayments, recentStudents, awaitingReview] =
    await Promise.all([
      Student.countDocuments({ status: "ACTIVE" }),
      User.countDocuments({ role: "PARENT" }),
      User.countDocuments({ role: "STAFF", isActive: true }),
      SchoolClass.countDocuments({ isActive: true }),
      Invoice.aggregate([{ $group: { _id: null, totalBilled: { $sum: "$totalAmount" }, totalPaid: { $sum: "$amountPaid" } } }]),
      Result.aggregate([{ $group: { _id: "$status", n: { $sum: 1 } } }]),
      Payment.find({ status: "SUCCESS" }).populate("student", "firstName lastName photo").sort({ createdAt: -1 }).limit(5),
      Student.find().sort({ createdAt: -1 }).limit(5).populate("class", "name"),
      Result.find({ status: "SUBMITTED" })
        .populate("student", "firstName lastName photo")
        .populate("class", "name")
        .populate("preparedBy", "name")
        .sort({ submittedAt: 1 })
        .limit(6),
    ]);

  const totals = invoiceAgg[0] || { totalBilled: 0, totalPaid: 0 };
  const byStatus = Object.fromEntries(resultCounts.map((r) => [r._id, r.n]));

  res.json({
    success: true,
    overview: {
      totalStudents, totalParents, totalTeachers, totalClasses,
      totalFeesBilled: totals.totalBilled,
      totalAmountPaid: totals.totalPaid,
      outstandingBalance: totals.totalBilled - totals.totalPaid,
      resultsByStatus: byStatus,
      recentPayments, recentStudents, awaitingReview,
    },
  });
});

/** GET /api/dashboard/staff — a teacher's own workload. */
export const getStaffOverview = asyncHandler(async (req, res) => {
  const students = await Student.find({ ...studentFilterFor(req.user), status: "ACTIVE" }).select("_id class");
  const ids = students.map((s) => s._id);
  const [classes, resultCounts, returned] = await Promise.all([
    SchoolClass.find({ _id: { $in: req.user.assignedClasses || [] } }).sort({ order: 1 }),
    Result.aggregate([{ $match: { student: { $in: ids } } }, { $group: { _id: "$status", n: { $sum: 1 } } }]),
    Result.find({ student: { $in: ids }, status: "RETURNED" })
      .populate("student", "firstName lastName photo")
      .populate("class", "name")
      .populate("term", "name")
      .sort({ updatedAt: -1 })
      .limit(10),
  ]);

  res.json({
    success: true,
    overview: {
      totalStudents: students.length,
      classes,
      resultsByStatus: Object.fromEntries(resultCounts.map((r) => [r._id, r.n])),
      returned,
    },
  });
});
