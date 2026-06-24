import { Router } from "express";
import { healthCheck } from "../controllers/healthController";

const router = Router();

/**
 * GET /healthz
 * Returns the current health status of the server.
 */
router.get("/", healthCheck);

export default router;
