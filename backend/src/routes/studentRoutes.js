import { Router } from "express";
import {
  listStudents, getStudent, createStudent, updateStudent, deleteStudent, uploadPhoto, removePhoto,
} from "../controllers/studentController.js";
import { protect, authorize } from "../middleware/auth.js";
import { passportUpload } from "../middleware/upload.js";

const router = Router();
router.use(protect);

router.get("/", listStudents);
router.get("/:id", getStudent);
router.post("/", authorize("ADMIN"), createStudent);
router.put("/:id", authorize("ADMIN"), updateStudent);
router.put("/:id/photo", authorize("ADMIN"), passportUpload, uploadPhoto);
router.delete("/:id/photo", authorize("ADMIN"), removePhoto);
router.delete("/:id", authorize("ADMIN"), deleteStudent);

export default router;
