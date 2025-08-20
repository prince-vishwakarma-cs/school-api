import express from "express";
import { addSchool, listSchools } from "./../controllers/school.js";

const router = express.Router();

router.post("/addSchool", addSchool);

router.get("/listSchools", listSchools);

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "School Management API is running",
    timestamp: new Date().toISOString(),
  });
});

export default router