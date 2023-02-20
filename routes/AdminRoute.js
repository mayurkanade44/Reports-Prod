import express from "express";
import { addValues, getValues } from "../controllers/AdminController.js";

const router = express.Router();

router.route("/values").post(addValues).get(getValues);

export default router;
