import { AuthChecker } from "type-graphql";
import { Context } from "apollo-server-core";
import { CContext } from "../types";
import { Role } from "../models/person";
export const authChecker: AuthChecker<Context<CContext>> = (
  { root, args, context, info },
  roles
) => {
  const { activeUser } = context;
  if (roles.length === 0) {
    return activeUser !== undefined;
  }
  if (!activeUser) return false;
  if (!activeUser.roles) return false;
  if (activeUser.roles.includes(Role.PARENT) && roles.includes(Role.PARENT)) {
    if (!args.parentStudentId) return true;
    if (activeUser.parentStudents.length == 0) return false;
    if (args.parentStudentId && args.parentStudentId.toHexString) {
      const parentStudent = activeUser.parentStudents.find(
        (studentValue) =>
          studentValue.studentId === args.parentStudentId.toHexString()
      );
      context.requestParent = parentStudent;
      if (!parentStudent) return false;
    }
    return true;
  }
  if (
    activeUser.roles.includes(Role.DRIVER) &&
    roles.includes(Role.DRIVER) &&
    activeUser.driver
  ) {
    if (args.institutionId && args.institutionId.toHexString) {
      if (
        !activeUser.driver.some(
          (i) => i.institutionId === args.institutionId.toHexString()
        )
      )
        return false;
    }
  }
  if (activeUser.roles.some((role) => roles.includes(role))) return true;
  return false;
};
