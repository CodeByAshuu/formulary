import express from "express";
import { 
  searchMedicine, 
  getMedicineDetails,
  getSubstitutes, 
  createMedicine, 
  updateMedicine, 
  deleteMedicine 
} from "../controllers/medicine.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public Routes
router.get("/search", searchMedicine);
router.get("/:id", getMedicineDetails);
router.get("/:id/substitutes", getSubstitutes);

// Protected Admin Routes
router.post("/", authMiddleware, createMedicine);
router.put("/:id", authMiddleware, updateMedicine);
router.delete("/:id", authMiddleware, deleteMedicine);

export default router;
