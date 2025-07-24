import express from "express";
import { getResponse } from "../controller/ai.controller.js";

const router = express.Router();
router.get("/get-response", getResponse);

export default router;
