import {
  UserResolver,
  PersonFieldResolver,
  EducationFieldResolver,
} from "./user";
import { SchoolResolver, SchoolFieldResolver } from "./school";
import { ClassGResolver, ClassLessonFieldResolver } from "./classG";
import { DepartmentResolver } from "./department";
import { ClassFieldResolver, ClassResolver } from "./classType";
import { TeacherResolver } from "./teacher";
import { StudentResolver, StudentFieldResolver } from "./student";
import { HomeWorkResolver } from "./homeWork";
import { IlResolver } from "./il";
import { LessonResolver, LessonFieldResolver } from "./lesson";
import { LessonGResolver, LessonGFieldResolver } from "./lessonG";
import { WeeklyHourResolver } from "./weeklyHour";
import { LessonInboxResolver } from "./lessonInbox";
import { SchoolGResolver } from "./schoolG";
import { TeacherFieldResolver } from "./teacherField";
import { EducationYearResolver } from "./educationYear";
import { ExamResolver, ExamFieldResolver } from "./exam";
import { ParentResolver } from "./parent";
import {
  ApplicationFieldResolver,
  TeacherApplicationResolver,
} from "./teacherApplication";
import { UniversityResolver } from "./university";
import { AbsenceResolver } from "./absence";
import {
  StudyResolver,
  StudyFieldResolver,
  StudyStudentFieldResolver,
} from "./study";
import { InboxResolver, MessageFieldResolver } from "./inbox";
import { DriverApplicationResolver } from "./driverApplication";
import { DriverResolver, DriverFieldResolver } from "./driver";
import {
  DriverStudentApplicationResolver,
  DriverStudentApplicationFieldResolver,
} from "./driverStudentApplication";
import { VoyageFieldResolver, VoyageResolver } from "./voyage";
import { VoyageTimeResolver, StudentVoyageInfoResolver } from "./voyageTime";
import { ParentApplicationResolver } from "./parentApplication";
import { NonEmptyArray } from "type-graphql/dist/interfaces/NonEmptyArray";
export const resolvers: NonEmptyArray<Function> | NonEmptyArray<string> = [
  UserResolver,
  StudentResolver,
  TeacherResolver,
  StudentFieldResolver,
  PersonFieldResolver,
  SchoolResolver,
  ClassLessonFieldResolver,
  ClassGResolver,
  ClassFieldResolver,
  ClassResolver,
  DepartmentResolver,
  HomeWorkResolver,
  IlResolver,
  LessonResolver,
  LessonGResolver,
  LessonInboxResolver,
  SchoolGResolver,
  TeacherResolver,
  ApplicationFieldResolver,
  TeacherApplicationResolver,
  TeacherFieldResolver,
  UniversityResolver,
  EducationFieldResolver,
  LessonFieldResolver,
  SchoolFieldResolver,
  EducationYearResolver,
  ExamResolver,
  ExamFieldResolver,
  ParentResolver,
  AbsenceResolver,
  StudyResolver,
  StudyFieldResolver,
  StudyStudentFieldResolver,
  InboxResolver,
  MessageFieldResolver,
  WeeklyHourResolver,
  LessonGFieldResolver,
  DriverApplicationResolver,
  DriverResolver,
  DriverStudentApplicationResolver,
  DriverStudentApplicationFieldResolver,
  DriverFieldResolver,
  VoyageFieldResolver,
  VoyageResolver,
  VoyageTimeResolver,
  StudentVoyageInfoResolver,
  ParentApplicationResolver,
];
