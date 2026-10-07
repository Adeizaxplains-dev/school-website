import { Router } from "express";
import {
  listFeeStructures,
  createFeeStructure,
  updateFeeStructure,
  generateInvoices,
  listInvoices,
  getInvoice,
  getPaymentPolicy,
} from "../controllers/feeController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.get("/structures", authorize("ADMIN"), listFeeStructures);
router.post("/structures", authorize("ADMIN"), createFeeStructure);
router.put("/structures/:id", authorize("ADMIN"), updateFeeStructure);

router.post("/invoices/generate", authorize("ADMIN"), generateInvoices);
router.get("/invoices", (req, res, next) => { if (req.user.role === "PARENT") return listInvoices(req, res, next); return authorize("ADMIN")(req, res, next); }, listInvoices); // parents are scoped; admins may review all
router.get("/invoices/:id", (req, res, next) => { if (req.user.role === "PARENT") return getInvoice(req, res, next); return authorize("ADMIN")(req, res, next); }, getInvoice);

router.get("/policy", (req, res, next) => authorize("ADMIN", "PARENT")(req, res, next), getPaymentPolicy);

export default router;
