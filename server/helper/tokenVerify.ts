import jwt from "jsonwebtoken";
import { IActiveUser } from "../types";
export default function tokenVerify(token: string) {
  if (typeof process.env.SECRET_KEY !== "string") throw new Error("sc");
  try {
    const activeUser = jwt.verify(token, process.env.SECRET_KEY);
    if (typeof activeUser === "object") return activeUser as IActiveUser;
  } catch (error) {}
}
