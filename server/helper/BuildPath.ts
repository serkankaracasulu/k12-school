import path from "path";
type UserPathType = "users" | "students";
export class BuildPath {
  protected profileRootPath: string;
  /**
   *
   */
  constructor(type: UserPathType) {
    this.profileRootPath = path.join("private", "images", type, "profile");
  }
  /**
   *Main directory of users profile photos
   */
  public get profilesPath(): string {
    return path.join(this.profileRootPath);
  }
  /**
   *Path of the user profile photo
   */
  getProfilePath(userId: string) {
    return path.join(this.profilesPath, `${userId}.png`);
  }
}
