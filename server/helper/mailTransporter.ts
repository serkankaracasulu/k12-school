import nodemailer from "nodemailer";
import { logger } from "../startup/logging";
export default () => {
  try {
    if (process.env.NODE_ENV === "test") {
      return nodemailer.createTransport({
        host: process.env.MAILER_SERVICE_PROVIDER,
        port: 1025,
        ignoreTLS: true
      });
    } //80
    return nodemailer.createTransport({
      host: process.env.MAILER_SERVICE_PROVIDER,
      port: 80,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAILER_EMAIL_ID, // generated ethereal user
        pass: process.env.MAILER_PASSWORD // generated ethereal password
      }
    });
  } catch (error) {
    logger.log(error);
  }
};
