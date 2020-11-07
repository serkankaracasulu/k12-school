import { IUser, User } from "./models/user";
import { Student, IStudent } from "./models/student";
import DataLoader from "dataloader";
import { ILessonG, LessonG } from "./models/lessonGModel";
import { Lesson, ILesson } from "./models/lessonSchema";
import { IPerson, Role } from "./models/person";
import { QuerySelector } from "mongodb";
import { Types } from "mongoose";
import { IInstitution } from "./models/Institution";
export interface StudentInfo {
  _id: string;
  schoolId?: string;
  classId?: string;
}

type ActiveUserDriver = {
  institutionId: string;
  studentIds: string[];
};
type ActiveUserTeacher = {
  institutionId: string;
  schoolIds: string[];
  allSchool: boolean;
};
type ActiveUserParent = {
  id: string;
  studentId: string;
  institutionId: string;
};
type ActiveUserStudent = {
  institutionId: string;
  schoolId?: string;
  classId?: string;
};

export interface IActiveUser {
  _id: string;
  roles: Role[];
  email?: User["email"];
  fullName: string;
  driver?: ActiveUserDriver[];
  teacher?: ActiveUserTeacher;
  parentStudents: ActiveUserParent[];
  student?: ActiveUserStudent;
}

declare module "express-serve-static-core" {
  interface Request {
    activeUser?: IActiveUser;
  }
}
export type QueryType<T> = {
  [K in keyof Partial<T>]:
    | T[K]
    | QuerySelector<T[K] extends Array<infer U> | undefined ? U | T[K] : T[K]>;
} & {
  $text?: {
    $search: string;
    $language?: string;
    $caseSensitive?: boolean;
    $diacraticSensitive?: boolean;
  };
};

export interface LessonPipeLineResult {
  lesson: Lesson;
  schoolId: string;
  classId: string;
  lessonG: [LessonG | undefined];
}

export interface IDataLoader {
  lessonGLoader: DataLoader<Types.ObjectId, ILessonG | undefined, string>;
  userLoader: DataLoader<Types.ObjectId, IUser | undefined, string>;
  studentLoader: DataLoader<
    QueryType<
      Student & {
        $text: {
          $search: string;
          $language?: string;
          $caseSensitive?: boolean;
          $diacraticSensitive?: boolean;
        };
      }
    >,
    IStudent[] | undefined,
    string
  >;
  lessonLoader: DataLoader<Types.ObjectId, ILesson | undefined, string>;
  studentLoaderById: DataLoader<Types.ObjectId, IStudent | undefined, string>;
  personLoader: DataLoader<
    Types.ObjectId,
    IPerson | IUser | IStudent | undefined,
    string
  >;
  institutionLoaderById: DataLoader<
    Types.ObjectId,
    IInstitution | undefined,
    Types.ObjectId
  >;
}
export class CContext {
  activeUser?: IActiveUser | null;
  dataloaders: IDataLoader;
  requestParent?: ActiveUserParent;
}
export enum Topic {
  studentNotificaion = "STUDENT_NOTIFICATON_UPDATED",
  applicaitonUpdated = "APPLICATION_UPDATED",
  messageUpdated = "MESSAGE_UPDATED",
  positionNotification = "POSITION_NOTIFICATION",
}
export type LessonAndInstId = {
  objId: string;
  lessonId: string;
};

type ExtractIdType<T> = Omit<T, "_id" | "createdAt" | "kind">;
type ExtractArrayTypeKey<T> = {
  [K in keyof T]: T[K] extends Array<any> ? never : K;
}[keyof T];
type MakeOptionalId<T> = {
  [K in keyof T]: K extends "createdAt" | "_id" ? K : never;
}[keyof T];

type MakeOptionalArrayTypeKey<T> = {
  [K in keyof T]: T[K] extends Array<any> ? K : never;
}[keyof T];

export type CreateType<T> = ExtractIdType<Pick<T, ExtractArrayTypeKey<T>>> &
  Partial<Pick<T, MakeOptionalId<T>>> &
  Partial<Pick<T, MakeOptionalArrayTypeKey<T>>>;
