import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.get("/", getSettings); // public: powers the public website's config
router.put("/", protect, authorize("ADMIN"), updateSettings);

export default router;
