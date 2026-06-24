import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";

const { combine, timestamp, json, colorize, printf, errors } = winston.format;

// Human-readable format for console in dev
const devConsoleFormat = combine(
  colorize({ all: true }),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }),
  printf(({ timestamp, level, message, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
    return `[${timestamp}] ${level}: ${stack || message}${metaStr}`;
  })
);

// JSON format for files and production console
const jsonFormat = combine(timestamp(), errors({ stack: true }), json());

const transports: winston.transport[] = [];

// Console transport
transports.push(
  new winston.transports.Console({
    format: process.env.NODE_ENV === "production" ? jsonFormat : devConsoleFormat,
  })
);

// File transports (always JSON)
transports.push(
  new DailyRotateFile({
    filename: path.join("logs", "error-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    level: "error",
    format: jsonFormat,
    maxSize: "20m",
    maxFiles: "14d",
    zippedArchive: true,
  })
);

transports.push(
  new DailyRotateFile({
    filename: path.join("logs", "combined-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    format: jsonFormat,
    maxSize: "20m",
    maxFiles: "14d",
    zippedArchive: true,
  })
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  defaultMeta: { service: process.env.npm_package_name || "app" },
  transports,
  exitOnError: false,
});

export default logger;
