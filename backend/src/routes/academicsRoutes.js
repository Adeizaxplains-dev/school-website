import { Router } from "express";
import {
  listClasses,
  createClass,
  updateClass,
  deleteClass,
  listSessions,
  createSession,
  activateSession,
  listTerms,
  createTerm,
  activateTerm,
  listSubjects,
  createSubject,
  updateSubject,
} from "../controllers/academicsController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.use(protect);

// Classes
router.get("/classes", listClasses);
router.post("/classes", authorize("ADMIN"), createClass);
router.put("/classes/:id", authorize("ADMIN"), updateClass);
router.delete("/classes/:id", authorize("ADMIN"), deleteClass);

// Sessions
router.get("/sessions", listSessions);
router.post("/sessions", authorize("ADMIN"), createSession);
router.put("/sessions/:id/activate", authorize("ADMIN"), activateSession);

// Terms
router.get("/terms", listTerms);
router.post("/terms", authorize("ADMIN"), createTerm);
router.put("/terms/:id/activate", authorize("ADMIN"), activateTerm);

// Subjects
router.get("/subjects", listSubjects);
router.post("/subjects", authorize("ADMIN"), createSubject);
router.put("/subjects/:id", authorize("ADMIN"), updateSubject);

export default router;
