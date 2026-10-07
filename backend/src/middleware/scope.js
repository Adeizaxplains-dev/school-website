import { ApiError } from "./ApiError.js";

/**
 * Which students may this user work with?
 *  - ADMIN  : everyone
 *  - STAFF  : students in their assigned classes + students linked to them individually
 *  - PARENT : their own children
 * Returns a Mongo filter for the Student collection.
 */
export function studentFilterFor(user) {
  if (user.role === "ADMIN") return {};
  if (user.role === "PARENT") return { parent: user._id };
  return {
    $or: [
      { class: { $in: user.assignedClasses || [] } },
      { _id: { $in: user.assignedStudents || [] } },
    ],
  };
}

/** True if `student` (a populated or raw Student doc) is inside the user's scope. */
export function canAccessStudent(user, student) {
  if (user.role === "ADMIN") return true;
  if (user.role === "PARENT") {
    return String(student.parent?._id || student.parent) === String(user._id);
  }
  const classId = String(student.class?._id || student.class);
  return (
    (user.assignedClasses || []).some((c) => String(c) === classId) ||
    (user.assignedStudents || []).some((s) => String(s) === String(student._id))
  );
}

export function assertCanAccessStudent(user, student) {
  if (!canAccessStudent(user, student)) {
    throw new ApiError(403, "That student is not assigned to you.");
  }
}
