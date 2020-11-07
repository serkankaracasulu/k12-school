import { Request, Response, NextFunction } from "express";
import tokenVerify from "./../helper/tokenVerify";

export default function auth(req: Request, res: Response, next: NextFunction) {
  const bearerToken = req.headers["authorization"];
  if (bearerToken && bearerToken !== "null" && bearerToken !== null) {
    const token = bearerToken.split(" ");
    if (token.length !== 2) next();
    const activeUser = tokenVerify(token[1]);
    if (activeUser) req.activeUser = activeUser;
  }
  next();
}
