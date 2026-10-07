import { Router } from "express";
import {
  listResults, getResult, upsertResult, submitResult, submitBatch,
  returnResultToStaff, publishResult, unpublishResult,
} from "../controllers/resultController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();
router.use(protect);

router.get("/", listResults);

// Teachers (and admin) prepare and submit
router.post("/", authorize("ADMIN", "STAFF"), upsertResult);
router.put("/submit-batch", authorize("ADMIN", "STAFF"), submitBatch); // before "/:id"

router.get("/:id", getResult);
router.put("/:id/submit", authorize("ADMIN", "STAFF"), submitResult);

// Admin review: approve (publish), send back, or pull back
router.put("/:id/return-to-staff", authorize("ADMIN"), returnResultToStaff);
router.put("/:id/publish", authorize("ADMIN"), publishResult);
router.put("/:id/unpublish", authorize("ADMIN"), unpublishResult);

export default router;
