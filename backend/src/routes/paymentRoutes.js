import { Router } from "express";
import {
  initializePayment,
  verifyPayment,
  paystackWebhook,
  listPayments,
  getPayment,
} from "../controllers/paymentController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

// Webhook: no auth middleware — Paystack's server calls this directly and is
// authenticated only by the signature check inside the controller.
router.post("/webhook", paystackWebhook);

router.use(protect);
router.post("/initialize", authorize("PARENT"), initializePayment);
router.get("/verify/:reference", authorize("PARENT"), verifyPayment);
router.get("/", authorize("ADMIN", "PARENT"), listPayments);
router.get("/:id", authorize("ADMIN", "PARENT"), getPayment);

export default router;
