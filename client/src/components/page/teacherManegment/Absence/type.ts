import {
  LessonFragment,
  CreateAbsenceMutationVariables,
} from "../../../../generated/graphql";

export type LessonAddPropsType = {
  setOpen(): void;
  lesson: LessonFragment;
  schoolId: string;
  classId: string;
  hourCode: CreateAbsenceMutationVariables["hourCode"];
  existStudentIds: String[];
};
