import path from "path";
import { BuildPath } from "./BuildPath";

export class StudentBuilPath extends BuildPath {
  /**
   *
   */
  constructor(private readonly institutionId: string) {
    super("students");
  }
  /**
   *Main directory of students profile photos
   */
  public get profilesPath(): string {
    return path.join(this.profileRootPath, this.institutionId);
  }
}
