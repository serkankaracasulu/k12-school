import path from "path";

import { Role } from "./myTypes";

export class RouterCons {
  public static myschools = {
    base: "/myschools",
    user: {
      base: "user",
      get fullpath(): string {
        return path.join(RouterCons.myschools.base, this.base);
      },
      get fullpathAbsolute(): string {
        return path.join("/", this.fullpath);
      },
      userId(userId: string, absolute?: boolean): string {
        if (absolute) return path.join(this.fullpathAbsolute, userId);
        return path.join(this.fullpath, userId);
      },
    },
  };
  public static teacher = {
    base: "/teacher",
    role: Role.teacher,
    calender: {
      base: "calendar",
      get fullpath(): string {
        return path.join(RouterCons.teacher.base, this.base);
      },
    },
    lessons: {
      base: "lessons",
      get fullpath(): string {
        return path.join(RouterCons.teacher.base, this.base);
      },
    },
    absence: {
      base: "absence",
      get fullpath(): string {
        return path.join(RouterCons.teacher.base, this.base);
      },
    },
    study: {
      base: "study",
      get fullpath(): string {
        return path.join(RouterCons.teacher.base, this.base);
      },
    },
  };
}
