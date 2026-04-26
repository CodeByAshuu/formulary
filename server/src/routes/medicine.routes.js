import express from "express";
import { 
  searchMedicine, 
  getMedicineDetails,
  getSubstitutes, 
  createMedicine, 
  updateMedicine, 
  deleteMedicine,
  bulkUpload,
  getMetrics,
  listAllMedicines,
  removeSubstituteLink
} from "../controllers/medicine.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public Routes
router.get("/search", searchMedicine);

// Protected Admin Routes (must be before /:id to avoid conflicts)
router.get("/admin/metrics", authMiddleware, getMetrics);
router.get("/admin/all", authMiddleware, listAllMedicines);
router.post("/bulk-upload", authMiddleware, bulkUpload);
router.post("/", authMiddleware, createMedicine);
router.put("/:id", authMiddleware, updateMedicine);
router.delete("/:id", authMiddleware, deleteMedicine);
router.delete("/:id/substitutes/:subId", authMiddleware, removeSubstituteLink);

// Public detail routes (after admin routes)
router.get("/:id", getMedicineDetails);
router.get("/:id/substitutes", getSubstitutes);

export default router;
