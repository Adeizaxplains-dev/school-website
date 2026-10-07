import { Router } from "express";
import { getOverview, getStaffOverview } from "../controllers/dashboardController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.get("/overview", protect, authorize("ADMIN"), getOverview);
router.get("/staff", protect, authorize("STAFF"), getStaffOverview);

export default router;
