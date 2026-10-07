import { Router } from "express";
import {
  listAnnouncements,
  listAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.get("/", protect, listAnnouncements); // scoped by audience inside controller
router.get("/all", protect, authorize("ADMIN", "STAFF"), listAllAnnouncements);
router.post("/", protect, authorize("ADMIN", "STAFF"), createAnnouncement);
router.put("/:id", protect, authorize("ADMIN", "STAFF"), updateAnnouncement);
router.delete("/:id", protect, authorize("ADMIN"), deleteAnnouncement);

export default router;
