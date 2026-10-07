import { Router } from "express";
import {
  listParents,
  getParent,
  createParent,
  updateParent,
  resetParentPassword,
  getParentPayments,
} from "../controllers/parentController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.use(protect, authorize("ADMIN"));

router.get("/", listParents);
router.get("/:id", getParent);
router.post("/", createParent);
router.put("/:id", updateParent);
router.put("/:id/reset-password", resetParentPassword);
router.get("/:id/payments", getParentPayments);

export default router;
