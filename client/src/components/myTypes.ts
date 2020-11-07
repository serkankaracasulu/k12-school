import * as React from "react";
import { ParentType } from "./page/dashboard/Student/type";
import {
  CreateStudyMutationVariables,
  DriverStudentApplication,
  HourFragment,
  LessonFragment,
  Person,
  User,
  WeeklyScheduleFragment,
} from "../generated/graphql";
import { DateTime } from "luxon";
export type KeysMatching<T> = {
  [K in keyof Partial<T>]: string;
};
export type SnackBarProp = {
  variant: Variant;
  message: string | React.ReactNode;
  open: boolean;
};
export type SetSnackBarProp = {
  (prop: SnackBarProp): void;
};

export enum UserType {
  Student = "Student",
  User = "User",
}

//#region Study
export enum StudyState {
  Read = "Read",
  Seen = "Seen",
  Unread = "Unread",
}
export enum StudyStudentStatus {
  TeacherInvatationRequest = "Teacher",
  StudentInvatationRequest = "Student",
  InvatationAccept = "Accept",
  StudentNotJoined = "NotJoined",
}
export type StudyStudent = {
  _id: Student["_id"];
  studentId: Student["_id"];
  status: StudyStudentStatus;
  student?: Student;
  state: StudyState;
};
export type Study = {
  _id: string;
  teacherId: Teacher["_id"];
  lessonId?: LessonG["_id"];
  students: StudyStudent[];
  dateTimeSpan: string;
  date: string;
  duration: number;
  subject: string;
  detail?: string;
  public: boolean;
  capacity?: number;
  permissionSchools?: School["_id"][];
  permissionClasses?: ClassType["_id"][];
  readonly lessonName?: LessonG["name"];
};

//Silme
export class CreateStudyVariables implements CreateStudyMutationVariables {
  constructor() {
    const date = DateTime.local().toISO({
      includeOffset: false,
      suppressMilliseconds: true,
      suppressSeconds: true,
    });
    const [time] = date.split(".");
    this.date = time.substr(0, time.length - 3);
  }
  lessonId?: string;
  date: string;
  duration: number = 40;
  subject: string = "";
  detail?: string;
  public: boolean = false;
  capacity?: number;
  permissionClasses?: string[];
}
export interface CreateStudy {
  createStudy: Study;
}
export interface Studies {
  studies: Study[];
}
export interface StudiesTvariables {
  week?: number;
  query?: StudyQuery;
  teacherId?: User["_id"];
}
export interface DeleteStudy {
  deleteStudy: RemoveResult;
}
export type DeleteStudyTvariables = {
  studyId: Study["_id"];
};
export interface StudyQuery {
  lessonId?: LessonG["_id"];
  date?: Study["date"];
  endDate?: Study["date"];
}
export interface JoinStudy {
  joinStudy: Study;
}
export type JoinStudyTvariables = {
  studyId: Study["_id"];
  r?: boolean;
  status?: StudyStudentStatus;
};
export interface AcceptJoinStudy {
  acceptJoinStudy: Study;
}
export interface AcceptJoinStudyTvariables extends JoinStudyTvariables {
  studentId: string;
}
export interface UpdateStudyState {
  updateStudyState: Study;
}
export type UpdateStudyStateTvariables = {
  studyId: Study["_id"];
  studyStudentId: Student["_id"];
};

//#endregion

//#region Parent
export interface AddParent {
  addParent: User;
}
export type AddParentTvariables = {
  applicationId: Application["_id"];
};
export interface ParentQuery {
  parent: User;
}
export type ParentQueryTvariables = {
  citizenshipId: User["citizenshipId"];
};
export interface StudentParents {
  studentParents: User[];
}
export interface RemoveParent {
  removeParent: RemoveResult;
}
export type RemoveParentTvariables = {
  studentId: Student["_id"];
  parentId: User["_id"];
};
export interface ParentConfirmEmail {
  parentConfirmEmail: { token: string; _id: string };
}
export type ParentConfirmEmailTvariables = {
  token: string;
  unVerifiedEmail: string;
};
export type StudentParentsTvariables = {
  studentId: Student["_id"];
};
export interface ParentResetPassword {
  parentResetPassword: { success: boolean };
}
export interface ParentLogin {
  paretnSignIn: { token: string };
}
export class ParentLoginTvariables {
  email: string = "";
  password: string = "";
}
export interface GetActiveParent {
  getActiveParent: Person;
}
export type MyChildren = {
  myChildren: Person[];
};

//#endregion

//#region  Student

export type Student = Person & {
  school: School["_id"];
  citizenshipId: string;
  class: ClassType["_id"];
  schoolNo: string;
  username: string;
  foreignLanguage: string;
  schoolName: string;
  className: string;
};
export class AddStudentTvariables implements Partial<Student> {
  constructor(schoolId?: string, classId?: string) {
    this.school = schoolId;
    this.class = classId;
  }
  firstName: string = "";
  lastName: string = "";
  citizenshipId: string = "";
  school?: School["_id"];
  class?: ClassType["_id"];
  foreignLanguage?: string;
  schoolNo?: string;
  profilePhotoBase64?: string;
}
export interface AddStudent {
  addStudent: Student;
}
export interface ActiveStudent {
  activeStudent: Person;
}

export interface Students {
  students: Student[];
}
export interface StudentCount {
  studentCount: { studentCount: number };
}
export type StudentCountTvariables = {
  schoolId?: School["_id"];
  classId?: ClassType["_id"];
};
export interface StudentQuery {
  student: Student;
}
export class StudentQueryTvariables implements Partial<Student> {
  studentId?: Student["_id"];
  citizenshipId?: string;
}
export type StudentsTvariables = {
  schoolId?: School["_id"];
  classId?: ClassType["_id"];
  notClass?: boolean;
  studentIds?: Student["_id"][];
  search?: string;
  page?: number;
};
export type TransferStudentsTvariables = {
  schoolId: School["_id"];
  classId?: ClassType["_id"];
  students: string[];
};
export interface TransferStudents {
  transferStudents: {
    code: string;
    success: boolean;
  };
}
export type DismissStudentTvariables = {
  studentId: Student["_id"];
  level: number;
};
export interface DismissStudent {
  dismissStudent: RemoveResult;
}
export type FindUser = {
  findUser: User[];
};
export type FindStudentTvariables = {
  search: string;
};

export interface EditStudentCitizenshipId {
  editStudentCitizenshipId: { success: boolean };
}
export class EditStudentCitizenshipIdTvariables implements Partial<Student> {
  constructor(studentId: string, citizenshipId: string) {
    this.studentId = studentId;
    this.citizenshipId = citizenshipId;
  }
  citizenshipId: string;
  studentId: Student["_id"];
}

//#endregion

//#region MyHour

export interface MyHour {
  myHour: Hour[];
}
export interface MyHourTvariables {
  parentStudentId?: string;
}

//#endregion

//#region Calender
export type CalenderEvent = {
  startHour: string;
  endHour: string;
  title?: string;
  event: React.ReactElement;
  type?: number;
  _id: string;
};

export type EventItemDetail = Omit<LessonFragment, "__typename"> &
  Omit<WeeklyScheduleFragment, "__typename"> &
  Omit<HourFragment, "__typename"> & {
    schoolName: string;
    className: string;
  };
export type CalenderEventRender = CalenderEvent & {
  durationMinute: number;
  startDate: DateTime;
  endDate: DateTime;
  top: number;
  height: number;
  left: React.CSSProperties["left"];
  width: React.CSSProperties["width"];
  zIndex?: React.CSSProperties["zIndex"];
};
export type CalenderDayMap = Map<number, CalenderEvent[]>;
export type CalenderDayMapRender = Map<number, CalenderEventRender[]>;
//#endregion
export interface StudentNotificationUpdated {
  studentNotificationUpdated: StudentNotification;
}
export interface StudentMyLessons {
  studentMyLessons: Lesson[];
}
export interface StudentMyLessonsTvariables {
  parentStudentId?: string;
}
export interface StudentSignInTvariables {
  username: string;
  password: string;
}
export interface StudentNotificationsStatusUpdate {
  studentNotificationsStatusUpdate: UpdateResults;
}
export interface StudentNotificationsStatusUpdateTvariables {
  state: NotificationState;
  ids: StudentNotification["_id"][];
}
//#region MutationResult

export type UpdateResults = {
  code: string;
  success: boolean;
  _ids: string[];
};
export type UpdateResult = {
  code: string;
  success: boolean;
  _id: string;
};

//#endregion

//#region Absence

export interface Absence {
  _id: string;
  lessonId: Lesson["_id"];
  date: Date;
  day: LessonWeeklySchedule["day"];
  hourCode: LessonWeeklySchedule["hourCode"];
  studentId: Student["_id"];
}
export interface Absences {
  absences: Absence[];
}
export class AbsencesTvariables {
  t?: boolean;
  parentStudentId?: ActiveUserParent["id"];
}
export interface DeleteAbsence {
  deleteAbsence: RemoveResult;
}
export interface DeleteAbsenceTvariables {
  absenceId: string;
}
export interface CreateAbsence {
  createAbsence: Absence[];
}
export class CreateAbsenceTvariables implements Partial<Absence> {
  constructor(studentIds: string[], lessonId: string, hourCode: number) {
    this.studentIds = studentIds;
    this.lessonId = lessonId;
    this.hourCode = hourCode;
  }
  studentIds: string[];
  lessonId: string;
  hourCode: number;
}
//#endregion

//#region Exam

export interface Exam {
  _id: string;
  institutionId: string;
  lessonId: Lesson["_id"];
  date: Date;
  termId: Term["_id"];
  readonly termName: Term["name"];
  lessonHourCode: LessonWeeklySchedule["hourCode"][];
  grades: Grade[];
}
export interface Exams {
  exams: Exam[];
}
export interface SetExam {
  setExam: Exam;
}
export type ExamsTvariables = {
  lessonId: string;
};

export type SetExamTvaiables = {
  _id?: Exam["_id"];
  lessonId: Lesson["_id"];
  date: Date;
  lessonHourCode: LessonWeeklySchedule["hourCode"][];
};

export interface MyExams {
  myExams: Exam[];
}
export type MyExamsTvariables = {
  lessonId: string;
};
export interface DeleteExam {
  deleteExam: RemoveResult;
}
export type DeleteExamTvariables = {
  lessonId: Lesson["_id"];
  examId: Exam["_id"];
};

//#region Grade

export type Grade = {
  _id: string;
  studentId: Student["_id"];
  grade: number;
  readonly __typename?: "Grade";
};
export type SetExamGrade = {
  studentId: Student["_id"];
  examId: Exam["_id"];
  grade: Grade["grade"];
  lessonId: Lesson["_id"];
};

//#endregion

//#endregion

//#region Inbox

export type Inbox = {
  _id: string;
  users: Person[];
  userIds: string[];
  createdAt: string;
  updatedAt: string;
  lastMessage: string;
  unReadCount?: number;
};
export type Inboxs = {
  inboxs: Inbox[];
};
export type InboxTvariables = {
  inboxId?: Inbox["_id"];
  to?: string[];
};
export type InboxsTvariables = {
  skip: number;
};
//#endregion

//#region Message

export type Message = {
  readonly __typename?: "Message";
  _id: string;
  inboxId: Inbox["_id"];
  usertype: UserType;
  readonly owner?: Person;
  idOfUnReaders: string[];
  ownerId: string;
  message: string;
  sent: string;
};

export interface UnReadMessageCount {
  unReadMessageCount: number;
}
export type SendMessage = {
  sendMessage: Message;
};
export type SendMessageTvariables = {
  to: string[];
  message: Message["message"];
};
export type Messages = {
  messages: Message[];
};
export type MessagesTvariables = {
  to?: string;
  inboxId?: Inbox["_id"];
  skip: number;
};
export interface MessageRead {
  messageRead: Result;
}
export type MessageReadTvariables = {
  messageId: Message["_id"];
};

//#endregion

export type InboxNotification = {
  inboxNotification: Message;
};
// School

//#region EducationYear

export type EducationYear = {
  _id: string;
  name: string;
  terms: Term[];
};
export type DeleteEducationYearTvariables = {
  schoolId: School["_id"];
  id: EducationYear["_id"];
};

export interface EditEducationYear {
  editEducationYear: EducationYear;
}
export interface EditEducationYearTvariables {
  name: EducationYear["name"];
  terms: TermTvariables[];
  schoolId: School["_id"];
}

//#endregion

//#region Term

export type Term = {
  _id: string;
  name: string;
  start: Date;
  finish: Date;
  readonly createdAt?: Date;
  readonly __typename?: "Term";
};
export interface TermTvariables {
  name: Term["name"];
  start: Term["start"];
  finish: Term["finish"];
}

//#endregion

//#region WeeklyHour

export type Hour = {
  _id: string;
  code: number;
  start: string;
  finish: string;
  readonly createdAt?: Date;
  readonly __typename?: "Hour";
};
export interface HourInput {
  code: Hour["code"];
  start: Hour["start"];
  finish: Hour["finish"];
}
export interface CreateHourTvariables {
  _id?: WeeklyHour["_id"];
  schoolId: School["_id"];
  name: WeeklyHour["name"];
  hour: HourInput[];
}

export type WeeklyHour = {
  _id: string;
  hour: Hour[];
  name: string;
  readonly createdAt?: Date;
  updatedAt?: Date;
  readonly __typename: "WeeklyHour";
};

//#endregion

//#region Class

export type ClassType = {
  _id: string;
  name: string;
  level: number;
  code: string;
  code1: string;
  readonly studentCount: number;
  readonly lessonCount: number;
  lessons?: Lesson[];
  readonly createdAt: Date;
  readonly fullName: string;
  classroomTeacher?: User;
  classroomTeacherId?: User["_id"];
  readonly __typename?: "Class";
};

export interface ClassQuery {
  class: ClassType;
}
export type ClassQueryTvariables = {
  schoolId: School["_id"];
  classId: ClassType["_id"];
};
export interface CreateClass {
  createClass: ClassType;
}
export interface DeleteClass {
  deleteClass: RemoveResult;
}
export interface Result {
  success: boolean;
}
export type DeleteClassTvariables = {
  schoolId: School["_id"];
  classId: ClassType["_id"];
};
export interface CreateClassTvariables {
  _id?: ClassType["_id"];
  schoolId: School["_id"];
  name?: ClassType["name"];
  level?: ClassType["level"];
  code?: ClassType["code"];
  code1?: ClassType["code1"];
}

//#endregion

//#region School

export interface Schools {
  schools: School[];
}
export type SchoolsTvariables = {
  institutionId: string;
};
export interface DeleteSchool {
  deleteSchool: RemoveResult;
}
export type DeleteSchoolTvariables = {
  schoolId: School["_id"];
};
//#endregion

//#region Teacher

export type Teacher = {
  _id: string;
  institutionId: string;
  allSchool: boolean;
  schoolIds: string[];
  addedById: string;
};

export interface DismissTeacher {
  dismissTeacher: RemoveResult;
}
export type DismissTeacherTvariables = {
  teacherId: Teacher["_id"];
};
export interface InvitationTeachers {
  invitationTeachers: TeacherApplication[];
}
export type InvitationTeachersTvariables = {
  emails: string[];
};
export interface Teachers {
  teachers: User[];
}

//#endregion

export interface SendLessonMessage {
  sendLessonMessage: LessonMessage;
}
export type StudentNotification = {
  _id: string;
  lessonId: Lesson["_id"];
  state: NotificationState;
  notificationType: NotificationType;
  action: NotificationAction;
  createdAt: Date;
  targetId: string;
  lessonName: string;
  message: string;
};
export enum NotificationType {
  announcement = "announcement",
  homework = "homework",
  exam = "exam",
  absence = "absence",
}
export enum NotificationState {
  Read = "Read",
  Seen = "Seen",
  Unread = "Unread",
}
export enum NotificationAction {
  Insert = "Insert",
  Update = "Update",
  Delete = "Delete",
}
export interface StudentNotifications {
  studentNotifications: StudentNotification[];
}
export interface StudentNotificationsTvariables {
  skip?: number;
  parentStudentId?: ActiveUserParent["id"];
}
export interface GetLesson {
  getLesson: Lesson;
}
export interface GetLessonTvariables {
  lessonId: Lesson["_id"];
  i?: Student["_id"];
}
export class SendLessonMessageTvariables {
  constructor(
    lessonId: string,
    messageType: LessonMessageType,
    title: string,
    message: string
  ) {
    this.lessonId = lessonId;
    this.messageType = messageType;
    this.title = title;
    this.message = message;
  }
  lessonId: Lesson["_id"];
  messageType: LessonMessageType;
  message: LessonMessage["message"] = "";
  title: LessonMessage["title"] = "";
}

//#region LessonMessage

export type LessonMessage = {
  _id: string;
  message: string;
  lessonId: Lesson["_id"];
  sent: string;
  title: string;
  teacherId: User["_id"];
  messageType: LessonMessageType;
};
export enum LessonMessageType {
  announcement = "announcement",
  homework = "homework",
}

export type LessonMessagesTvariables = {
  lessonId: Lesson["_id"];
  skip?: number;
  parentStudentId?: ActiveUserParent["id"];
};
export interface LessonMessages {
  lessonMessages: LessonMessage[];
}

//#endregion

//#region HomeWork

export type HomeWork = {
  _id: string;
  message: string;
  lessonId: Lesson["_id"];
  sent: string;
  title: string;
  file?: string;
};
export interface SendHomeWork {
  sendHomeWork: HomeWork;
}
export interface SendHomeWorkTvariables {
  lessonId: Lesson["lessonId"];
  message: HomeWork["message"];
  title: HomeWork["title"];
  homeWorkFile?: File;
}
export interface HomeWorks {
  homeWorks: HomeWork[];
}
export interface HomeWorksTvariables {
  lessonId: Lesson["_id"];
  skip?: number;
  i?: Student["_id"];
}

//#endregion

export type Application = {
  _id: string;
  email?: string;
  userId: User["_id"];
  institutionId: string;
  institutionName: string;
  userFullName: string;
  status: number;
  readonly createdAt: string;
};
export type TeacherApplication = Application & {};
export type DriverApplication = Application & {};

export interface DismissDriver {
  dissmissDriver: RemoveResult;
}
export type DismissDriverTvariables = {
  driverId: Driver["_id"];
};
export interface AcceptDriverServiceInvitation {
  acceptDriverServiceInvitation: Result;
}
export type AcceptDriverServiceInvitationTvariables = {
  invitationId: DriverStudentApplication["_id"];
};

export type CancelServiceRequestDriverTvariables = {
  requestId: DriverStudentApplication["_id"];
};
export interface TeacherApplications {
  teacherApplications: TeacherApplication[];
}
export interface InvitationDrivers {
  invitationDrivers: DriverApplication[];
}
export interface DriverApplications {
  driverApplications: DriverApplication[];
}
export interface DriverServiceRequests {
  driverServiceRequests: DriverStudentApplication[];
}
export interface SendInvitationDriver {
  sendInvitationDriver: DriverStudentApplication;
}
export type SendInvitationDriverTvariables = {
  parentStudentId: string;
  driverId: string;
};
export type Driver = {
  _id: string;
  requestApp?: DriverStudentApplication | null;
  institutions: DriverInstitution[];
};
export interface Drivers {
  drivers: User[];
}
export type DriversTvariables = {
  parentStudentId?: string;
};

export interface DriversOfStudent {
  driversOfStudent: User[];
}
export type DriverOfStudentTvariables = {
  parentStudentId: string;
};

export interface CancelServiceRequestDriver {
  cancelServiceRequestDriver: Result;
}
export type CancelServiceRequestTvariables = {
  requestId: string;
};
export type CancelServiceRequestUserTvariables = {
  parentStudentId: string;
} & CancelServiceRequestTvariables;
export interface CancelServiceRequestUser {
  cancelServiceRequestUser: Result;
}

//#region Voyage

export type Voyage = {
  _id: string;
  driverId: Driver["_id"];
  title: string;
  readonly institutionName?: string;
  schoolId: string;
  school?: School;
  studentIds: Student["_id"][];
  voyageTimes: VoyageTime[];
  institutionId: string;
};
export interface Voyages {
  voyages: Voyage[];
}
export interface SetVoyageOrderLast {
  setVoyageOrderLast: Result;
}
export type SetVoyageOrderLastTvariables = {
  voyageId: Voyage["_id"];
  studentId: Student["_id"];
};

export interface AddStudentVoyage {
  addStudentVoyage: Result;
}
export type AddStudentVoyageTvariables = {
  voyageId: Voyage["_id"];
  studentId: Student["_id"];
};
export type RemoveStudentVoyageTvariables = {
  voyageId: Voyage["_id"];
  studentId: Student["_id"];
};

export type CreateVoyageTvariables = {
  title: Voyage["title"];
  institutionId: string;
  schoolId: School["_id"];
  times: VoyageTimeInput[];
};
export interface CreateVoyage {
  createVoyage: Voyage;
}
export interface VoyageTimeQuery {
  voyageTime: VoyageTime;
}
export type VoyageTimeQueryTvariables = {
  voyageId: Voyage["_id"];
  voyageTimeId: VoyageTime["_id"];
};
export interface VoyageQuery {
  voyage: Voyage;
}
export type VoyageQueryTvariables = {
  voyageId: Voyage["_id"];
};

export interface RemoveStudentVoyage {
  removeStudentVoyage: Result;
}

//#region StudentVoyage

export enum StudentVoyegeEnum {
  notHere = "NOT_HERE",
  here = "HERE",
  gotOff = "GOT_OFF",
}
export type StudentVoyegeInfo = {
  _id: string;
  studentId: Student["_id"];
  student?: Student;
  status: StudentVoyegeEnum;
  order: number;
  disabled?: boolean;
};

//#endregion

export type VoyageTime = {
  _id: string;
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  hour: string;
  studentInfos: StudentVoyegeInfo[];
  isStart?: boolean;
  isTakeSchool: boolean;
};

//#region VoyageTime

export type VoyageTimeInput = {
  day: VoyageTime["day"];
  hour: VoyageTime["hour"];
  isTakeSchool: VoyageTime["isTakeSchool"];
};
export interface RemoveVoyageTime {
  removeVoyageTime: RemoveResult;
}
export type RemoveVoyageTimeTvariables = {
  voyageId: Voyage["_id"];
  timeId: VoyageTime["_id"];
};
export interface AddVoyageTime {
  addVoyageTime: VoyageTime;
}
export type AddVoyageTimeTvariables = VoyageTimeInput & {
  voyageId: Voyage["_id"];
};

//#endregion

//#endregion
export interface StudentsDriver {
  studentsDriver: Student[];
}
export type StudentsDriverTvariables = {
  search: string;
  institutionId: string;
  studentIds?: Student["_id"][];
};

export type DriverInstitution = {
  _id: string;
  institutionId: string;
  studentIds: string[];
  readonly institutionName?: string;
};
export interface DriverInstitutions {
  driverInsitutions: DriverInstitution[];
}
export interface AddTeacher {
  addTeacher: Teacher;
}
export type AddTeacherTvariables = {
  applicationId: TeacherApplication["_id"];
};
export interface ReSendInvitation {
  reSendInvitation: Result;
}
export interface ReSendInvitationTvariables {
  applicationId: TeacherApplication["_id"];
}

//#region Lesson

export type Lesson = {
  _id: string;
  name?: string;
  lessonName: string;
  lesson: LessonG;
  lessonId?: LessonG["_id"];
  weeklyHour: number;
  readonly educationYearId: string;
  readonly createdAt: Date;
  teacherId?: User["_id"];
  teacher?: Person;
  lessonWeeklySchedules: LessonWeeklySchedule[];
};
export interface Lessons {
  lessons: Lesson[];
}
export interface LessonsTvariables {
  schoolId: School["_id"];
  classId: ClassType["_id"];
  educationYearId: EducationYear["_id"];
}
export interface AddLesson {
  addLesson: Lesson;
}
export interface RemoveLesson {
  removeLesson: RemoveResult;
}
export type RemoveLessonTvariables = {
  lessonId: string;
};
export class AddLessonTvariables {
  constructor(schoolId: string, classId: string) {
    this.schoolId = schoolId;
    this.classId = classId;
  }
  _id?: Lesson["_id"];
  schoolId: School["_id"];
  classId: ClassType["_id"];
  lessonId?: LessonG["_id"];
  name?: Lesson["name"];
  weeklyHour: Lesson["weeklyHour"] = 1;
  teacherId?: User["_id"];
}

//#endregion
export interface SetLessonSchedule {
  setLessonSchedule: LessonWeeklySchedule;
}
export class SetLessonScheduleTvariables {
  lessonId: Lesson["_id"] = "";
  day: LessonWeeklySchedule["day"] = -1;
  hourCode: LessonWeeklySchedule["hourCode"] = -1;
}
export type RemoveScheduleToLessonTvariables = {
  lessonId: Lesson["_id"];
  scheduleId: LessonWeeklySchedule["_id"];
};
export type LessonWeeklySchedule = {
  _id: string;
  day: number;
  hourCode: number;
};
//#region ActiveUser

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
export type UserToken = {
  _id: string;
  roles: string[];
  email?: User["email"];
  driver?: ActiveUserDriver[];
  teacher?: ActiveUserTeacher;
  parentStudents: ActiveUserParent[];
  student?: ActiveUserStudent;
  fullName: string;
  iat: number;
  exp: number;
};

//#endregion

export type AddressLocation = {
  coordinates: [number, number];
};

export interface AddAddressToSchool {
  addAddressToSchool: AddressLocation;
}
export type AddAddressToSchoolTvariables = {
  schoolId: string;
  lat: number;
  lng: number;
};

//#region School

export type School = {
  _id: string;
  eOkulCode: string;
  name: string;
  headMaster?: Teacher | null;
  weeklyHour?: WeeklyHour;
  educationYears: EducationYear[];
  readonly studentCount: number;
  readonly createdAt: Date;
  schoolKindName?: string;
  classes: ClassType[];
  address?: AddressLocation;
  schoolKindId?: SchoolG["_id"];
  readonly __typename: "School";
};
export interface SchoolQuery {
  school: School;
}
export type ClassTvariables = {
  schoolId: School["_id"];
  classId: ClassType["_id"];
};
export type SchoolQueryTvariables = {
  id: School["_id"];
};
export interface SchoolCreateInput {
  _id?: School["_id"];
  name: School["name"];
  eOkulCode?: School["eOkulCode"];
  schoolKindId?: SchoolG["_id"];
}

//#endregion
//#region ParentApplication
export type ParentApplication = {
  studentId: Student["_id"];
  studentFullName?: Student["fullName"];
} & Application;
export interface ParentApplications {
  parentApplications: ParentApplication[];
}
export type ParentApplicationsTvariables = {
  studentId: Student["_id"];
};
export interface MyParentApplications {
  myParentApplications: ParentApplication[];
}
//#endregion

// Teacher
export interface MyLessonsTvariables {
  week?: number;
  classes?: string[];
  notMine?: boolean;
  teacherId?: string;
}
// User
export enum Role {
  teacher = "TEACHER",
  admin = "ADMIN",
  superadmin = "SUPERADMIN",
  user = "USER",
  owner = "OWNER",
  student = "STUDENT",
  parent = "PARENT",
  driver = "DRIVER",
}

export type Address = {
  _id: string;
  title: string;
  description: string;
  personId: string;
  location: AddressLocation;
  __typename: "Address";
};

export type ParentStudent = {
  _id: string;
  studentId: Student["_id"];
  institutionId: string;
  parentType: ParentType;
};

export interface UserQuery {
  user: User;
}
export type UserTvariables = {
  userId: User["_id"];
};
export interface ResetPassword {
  resetPassword: { success: boolean };
}
export interface JobRequests {
  jobRequests: TeacherApplication[];
}
export interface DriverJobRequests {
  driverJobRequests: DriverApplication[];
}
export interface GetActiveUser {
  activeUser: Person;
}
export interface AddDriver {
  addDriver: Driver;
}
export type AddDriverTvariables = {
  applicationId: string;
};
export interface ApplicatonUpdated {
  applicationUpdated: TeacherApplication;
}
export class ResetPasswordTvariables {
  constructor(token: string, _id: string) {
    this.token = token;
    this._id = _id;
  }
  token: string;
  _id: string;
  password?: string;
}
export interface AcceptInvitation {
  acceptInvitation: TeacherApplication;
}
export interface PersonQuery {
  person: Person;
}
export type PersonQueryTvariables = {
  personId: string;
};
export interface AcceptDriverInvitation {
  acceptDriverInvitation: DriverApplication;
}
export type AcceptInvitationTvariables = {
  invitationId: TeacherApplication["_id"];
  r?: boolean;
  d?: boolean;
};
export interface CreateUser {
  createUser: User;
}
export interface CreateUserTVariables {
  firstName: User["firstName"];
  lastName: User["lastName"];
  email: User["email"];
  password: string;
  phone?: User["phone"];
  institutionName?: string;
  token?: string;
}

export type AddressTvariables = {
  title: Address["title"];
  description: Address["description"];
  lat: number;
  lng: number;
};
export type UpdateStudentAddressTvariables = {
  i: string;
} & AddressTvariables;
export interface UpdateStudentAddress {
  updateStudentAddress: Address;
}
export interface UserEdit {
  firstName?: User["firstName"];
  lastName?: User["lastName"];
  email?: User["email"];
  phone?: User["phone"];
  birthDate?: User["birthDate"];
  addressData?: AddressTvariables;
}
export interface UserSignUpI {
  firstName: User["firstName"];
  lastName: User["lastName"];
  password: string;
  email: User["email"];
  phone: User["phone"];
  institutionName: string;
}
export type SignInTvariables = {
  email: User["email"];
  password: string;
};
// Department
export type Department = {
  _id: string;
  name: string;
};
export interface Departments {
  departments: Department[];
}
export interface EditDepartment {
  editDepartment: Department;
}
export type EditDepartmentTvariables = {
  name: string;
};
export interface RemoveDepartment {
  removeDepartment: RemoveResult;
}
export type RemoveDepartmentTvariables = {
  _id: string;
};
export interface RemoveResult {
  success: boolean;
  code: string;
  _id: string;
}
export type mutationResult = {
  success: boolean;
  code: string;
};

// Education
export type Education = {
  _id: string;
  educationLevelName: string;
  educationLevel: number;
  educationType: number;
  educationTypeName: string;
  educationlanguage: number;
  educationlanguageName: string;
  university?: University;
  universityId: University["_id"];
  universityName: string;
  department?: Department;
  departmentId: Department["_id"];
  startDate: Date;
  finishDate: Date;
};
export interface EditEducationTvariables {
  educationLevel: Education["educationLevel"];
  educationLevelName: Education["educationLevelName"];
  universityId: University["_id"];
  universityName: University["name"];
  educationType: Education["educationType"];
  educationTypeName: Education["educationTypeName"];
  educationlanguage: Education["educationlanguage"];
  educationlanguageName: Education["educationlanguageName"];
  departmentId: Department["_id"];
  startDate: Education["startDate"];
  finishDate?: Education["finishDate"];
}
export interface EditEducation {
  editEducation: Education;
}
export interface Educations {
  educations: Education[];
}

// LessonG
export type LessonG = {
  _id: string;
  name: string;
  teacherFields: TeacherField[];
  readonly __typename: "LessonG";
};
export interface LessonsG {
  lessonsG: LessonG[];
}
export interface EditLessonG {
  editLessonG: LessonG;
}
export interface CreateLessonG {
  createLessonG: LessonG;
}
export interface RemoveLessonG {
  removeLessonG: RemoveResult;
}
export interface CreateLessonGtVariables {
  name: LessonG["name"];
  teacherFieldIds: TeacherField["_id"][];
}
export type RemoveLessonGtVariables = {
  _id: LessonG["_id"];
};
export interface EditLessonGtVariables {
  name: LessonG["name"];
  _id: LessonG["_id"];
  teacherFieldIds: TeacherField["_id"][];
}
// SchoolG
export interface AddLessonToClass {
  addLessonToClass: ClassLesson;
}

// ClassG
export type ClassG = {
  _id: string;
  level: number;
  lessons: ClassLesson[];
  readonly __typename: "ClassG";
};
export type SchoolG = {
  _id: string;
  name: string;
  classes: ClassG[];
  readonly __typename?: "SchoolsG";
};
export interface SchoolsG {
  schoolsG: SchoolG[];
}
//

export type Variant = "error" | "info" | "success" | "warning";
export type ClassLesson = {
  _id: string;
  lessonId: string;
  lesson?: LessonG;
  count: number;
  required: boolean;
  readonly __typename: "ClassLesson";
};
export interface CreateSchoolG {
  createSchoolG: SchoolG;
}
export interface CreateSchoolGtVariables {
  name: SchoolG["name"];
  classes: { level: ClassG["level"] }[];
}
export interface ClassGget {
  classG: ClassG;
}

export type ClassGgetTvariables = {
  schoolId: SchoolG["_id"];
  classId: ClassG["_id"];
};
export interface AddLessonToClassTvariables {
  schoolId: SchoolG["_id"];
  classId: ClassG["_id"];
  lessonId: LessonG["_id"];
  count: ClassLesson["count"];
  required: ClassLesson["required"];
}
export interface RemoveLessonToClass {
  removeLessonToClass: ClassG;
}
export interface RemoveLessonToClassTvariables {
  schoolId: SchoolG["_id"];
  classId: ClassG["_id"];
  _id: ClassLesson["_id"];
}

// University
export type University = {
  _id: string;
  name: string;
  universityLogoUrl: string;
  readonly __typename: "University";
};
export interface EditUniversityTvariables {
  _id?: University["_id"];
  name: University["name"];
  universityLogoFile?: File;
}
export interface EditUniversity {
  editUniversity: University;
}
export interface Universities {
  universities: University[];
}

// TeacherField
export type TeacherField = {
  _id: string;
  name: string;
  departments: Department[];
};
export type TeacherFieldsTvariables = {};
export interface TeacherFields {
  teacherFields: TeacherField[];
}
export interface EditTeacherField {
  editTeacherField: TeacherField;
}
export interface EditTeacherFieldTvariables {
  name: TeacherField["name"];
}
export interface RemoveTeacherField {
  removeTeacherField: RemoveResult;
}
export type RemoveTeacherFieldTvariables = {
  _id: TeacherField["_id"];
};
export interface RemoveDepartmentsToTeacherField {
  removeDepartmentsToTeacherField: TeacherField;
}
export type RemoveDepartmentsToTeacherFieldTvariables = {
  id: Department["_id"];
  _id: TeacherField["_id"];
};

export type IlReturn = {
  _id: number;
  il: string;
  ilceleri: string[];
};
