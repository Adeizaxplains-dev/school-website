import { Router } from "express";
import { listTeachers, createTeacher, updateTeacher, resetTeacherPassword } from "../controllers/teacherController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();
router.use(protect, authorize("ADMIN"));

router.get("/", listTeachers);
router.post("/", createTeacher);
router.put("/:id", updateTeacher);
router.put("/:id/reset-password", resetTeacherPassword);

export default router;
