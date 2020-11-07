import { DateTime } from "luxon";
import {
  ClassTypeFragment,
  HourFragment,
  MyLessonsQuery,
} from "../../../../generated/graphql";

export type ScheduleItemType = {
  _id: string;
  lessonName: string;
  schoolName: string;
  schoolClass: MyLessonsQuery["schools"][0]["classes"][0];
  hour: HourFragment;
  top: number;
  height: number;
  courseId: string;
  day: number;
  startDate: DateTime;
  endDate: DateTime;
};
