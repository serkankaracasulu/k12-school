import jwt from "jwt-decode";
import { UserToken } from "../components/myTypes";

export default function () {
  const token = localStorage.getItem("token");
  const decodedToken = token && jwt<UserToken>(token);
  if (!decodedToken) return null;
  if (decodedToken.exp * 1000 < Date.now()) {
    console.log("token süresi geçti");
    localStorage.setItem("token", "");
    window.location.href = "/";
  }
  return decodedToken;
}
