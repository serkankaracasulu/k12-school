import {
  LessonFragment,
  WeeklySchedule,
} from "../../../../../../../generated/graphql";

export type Edit = {
  lesson: LessonFragment;
  schedule: WeeklySchedule;
  schoolId: string;
  classId: string;
};
