import { Request, Response, NextFunction } from "express";
import { logger } from "../startup/logging";
import { createReadStream, existsSync } from "fs";
import { UserBuilPath } from "./../helper/UserBuildPath";
import tokenVerify from "./../helper/tokenVerify";
export const profile = (req: Request, res: Response) => {
  const { i, t } = req.query;
  try {
    if (!i) return res.status(400).send();
    const activeUser = typeof t === "string" && tokenVerify(t);
    if (activeUser && typeof i === "string") {
      const userBuildPath = new UserBuilPath();
      const filePath = userBuildPath.getProfilePath(i);
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
    logger.error({ userProfileError: error });
    res.end(error);
  }
};
