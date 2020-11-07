import { createLogger, format, transports, add, exceptions } from "winston";

const wLogger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: "k12" },
  transports: [
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "combined.log" })
  ]
});

if (process.env.NODE_ENV !== "production") {
  wLogger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple())
    })
  );
}
export const logger = wLogger;
export function logging() {
  exceptions.handle(
    new transports.Console(),
    new transports.File({ filename: "uncaughtExceptions.log" })
  );

  process.on("unhandledRejection", ex => {
    throw ex;
  });
  add(new transports.Console());
}
