import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import models from "../models";
import { logger } from "../startup/logging";
import { createReadStream, existsSync } from "fs";
import { homeWorkFileLink } from "../models/homeWork";
import pather from "path";
const { model } = models;

export default async function (req: Request, res: Response) {
  const { lessonId, homeWorkId, fileName, t } = req.query;
  try {
    if (typeof process.env.SECRET_KEY !== "string") {
      logger.error("Doesn't exist secret key");
      return res.status(401).send();
    }
    const { error } = homeWorkFileLink(req.query);
    if (error) res.status(400).send();
    const activeUser: any =
      typeof t === "string" && jwt.verify(t, process.env.SECRET_KEY);
    let homeWork = null;
    if (!activeUser || !activeUser.teacher?.institutionId)
      return res.status(400).send();
    /*
    if (activeUser) {
      if (!activeUser.school || !activeUser.class) {
        homeWork = await model.HomeWork.findById(homeWorkId);
        if (!homeWork || !homeWork.classId || !homeWork.schoolId)
          return res.status(204).send();
      }
      const filePath = pather.join(
        __dirname,
        "..",
        "private",
        "files",
        activeUser.teacher.institutionId,
        activeUser.school || (homeWork && homeWork.schoolId.toString()),
        activeUser.class || (homeWork && homeWork.classId.toString()),
        lessonId,
        "homework",
        homeWorkId,
        fileName
      );
      if (!existsSync(filePath)) {
        return res.status(204).send();
      }
      const readStream = createReadStream(filePath);
      readStream.on("open", function() {
        readStream.pipe(res);
      });
      readStream.on("error", function(err) {
        res.end(err);
      });
    }
    */
  } catch (error) {
    logger.error({ homeWorkError: error });
  }
}
