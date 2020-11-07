import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { logger } from "../startup/logging";
import { createReadStream, existsSync } from "fs";
import { StudentBuilPath } from "./../helper/StudentBuildPath";
import tokenVerify from "./../helper/tokenVerify";
export const profile = (req: Request, res: Response) => {
  const { i, t, instId } = req.query;
  try {
    if (!i) return res.status(400).send();
    if (typeof process.env.SECRET_KEY !== "string") {
      return res.status(401).send();
    }
    let institutionId = "";
    const activeUser = typeof t === "string" && tokenVerify(t);
    if (activeUser && typeof i === "string") {
      if (activeUser.teacher) institutionId = activeUser.teacher.institutionId;
      else if (typeof instId === "string" && activeUser.driver) {
        if (activeUser.driver.some((i) => i.institutionId === instId))
          institutionId = instId;
      } else return res.status(401).send();
      const studentBuildPath = new StudentBuilPath(institutionId);
      const filePath = studentBuildPath.getProfilePath(i);
      if (!existsSync(filePath)) {
        return res.status(204).send();
      }
      const readStream = createReadStream(filePath);
      readStream.on("open", function () {
        readStream.pipe(res);
      });
      readStream.on("error", function (err) {
        res.end(err);
      });
    } else return res.status(401).send();
  } catch (error) {
    logger.error({ studentProfileError: error });
    res.end(error);
  }
};
