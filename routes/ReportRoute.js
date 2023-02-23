import express from "express";
const router = express.Router();

import {
  allReports,
  createReport,
  editReport,
  generateReport,
  sendEmail,
  uploadImages,
} from "../controllers/ReportController.js";
import { authorizeUser } from "../middleware/auth.js";

router.route("/create").post(createReport);
router.route("/uploadImage").post(uploadImages);
router
  .route("/allReports")
  .get(authorizeUser("Admin", "Back Office"), allReports);
router
  .route("/sendEmail")
  .post(authorizeUser("Admin", "Back Office"), sendEmail);
router
  .route("/editReport/:id")
  .patch(authorizeUser("Admin", "Back Office"), editReport);
router.route("/generate/:id").get(generateReport)

export default router;
