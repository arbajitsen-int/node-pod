import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import logger from "./utils/logger";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  logger.info(`Server started`, {
    port: PORT,
    environment: process.env.NODE_ENV || "development",
  });
});

// Graceful shutdown
const shutdown = (signal: string) => {
  logger.info(`${signal} received. Shutting down gracefully...`);
  server.close(() => {
    logger.info("Server closed.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("uncaughtException", (err) => {
  logger.error("Uncaught exception", { error: err.message, stack: err.stack });
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled promise rejection", { reason });
  process.exit(1);
});
