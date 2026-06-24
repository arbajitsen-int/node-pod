import { Request, Response } from "express";
import { getHealthStatus } from "../services/healthService";
import logger from "../utils/logger";

export function healthCheck(_req: Request, res: Response): void {
  const health = getHealthStatus();
  logger.debug("Health check requested", { health });
  res.status(200).json({ success: true, data: health });
}
