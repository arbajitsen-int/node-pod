export interface HealthStatus {
  status: "ok" | "degraded";
  uptime: number;
  timestamp: string;
  environment: string;
}

export function getHealthStatus(): HealthStatus {
  return {
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  };
}
