import path from "path";
import * as querystring from "querystring";
import url from "url";
import mailTransporter from "./mailTransporter";
import { logger } from "../startup/logging";

export default function (token: string, email: string, type: string) {
  const transporter = mailTransporter();
  const querys = querystring.stringify({
    token,
    email,
  });
  const link = url.resolve(
    "http://localhost:3000",
    path.join(type, `?${querys}`)
  );

  if (transporter) {
    transporter
      .sendMail({
        from: process.env.MAILER_EMAIL_ID,
        to: email,
        subject: "Confirm",
        html: link,
      })
      .catch((reason) => logger.error(reason));
  }
}
