import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: string;
  /** Mongo object id scalar type */
  ObjectId: string;
  /** HH:mm */
  Time: string;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
  /** Decimal128 for bson */
  Decimal128: any;
};

export type Query = {
  __typename?: 'Query';
  activeUser: Person;
  person: Person;
  user: User;
  educations: Array<Education>;
  findUser: Array<User>;
  schools: Array<School>;
  school: School;
  classG: ClassG;
  schoolKindClass: ClassG;
  departments: Array<Department>;
  classes: Array<ClassType>;
  class: ClassType;
  teachers: Array<User>;
  students: Array<Student>;
  studentsDriver: Array<Student>;
  studentCount: StudentCount;
  myHour: Array<Hour>;
  student: Student;
  activeStudent: Person;
  studentMyLessons: Array<Lesson>;
  studentNotifications: Array<Notification>;
  homeWorks: Array<HomeWork>;
  ils: Array<Il>;
  ilces: Array<Scalars['String']>;
  lessons: Array<Lesson>;
  getLesson: Lesson;
  lessonsG: Array<LessonG>;
  hours: WeeklyHour;
  lessonMessages: Array<LessonInbox>;
  schoolsG: Array<SchoolG>;
  schoolG: SchoolG;
  teacherFields: Array<TeacherField>;
  exams: Array<Exam>;
  myExams: Array<Exam>;
  parent: User;
  studentParents: Array<User>;
  myChildren: Array<Person>;
  jobRequests: Array<TeacherApplication>;
  teacherApplications: Array<TeacherApplication>;
  universities: Array<University>;
  absences: Array<Absence>;
  studies: Array<Study>;
  inboxs: Array<Inbox>;
  inbox: Inbox;
  messages: Array<Message>;
  unReadMessageCount: Scalars['Int'];
  driverApplications: Array<DriverApplication>;
  driverJobRequests: Array<DriverApplication>;
  drivers: Array<User>;
  driversOfStudent: Array<User>;
  driverInsitutions: Array<DriverInstitution>;
  studentServiceRequests: Array<DriverStudentApplication>;
  driverServiceRequests: Array<DriverStudentApplication>;
  voyages: Array<Voyage>;
  studentVoyages: Array<Voyage>;
  voyage: Voyage;
  voyageTime: VoyageTime;
  parentApplications: Array<ParentApplication>;
  myParentApplications: Array<ParentApplication>;
};


export type QueryPersonArgs = {
  personId: Scalars['ObjectId'];
};


export type QueryUserArgs = {
  userId: Scalars['ObjectId'];
};


export type QueryFindUserArgs = {
  search: Scalars['String'];
};


export type QuerySchoolsArgs = {
  institutionId?: Maybe<Scalars['ObjectId']>;
};


export type QuerySchoolArgs = {
  eOkul?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ObjectId']>;
};


export type QueryClassGArgs = {
  classId: Scalars['ObjectId'];
  schoolId: Scalars['ObjectId'];
};


export type QuerySchoolKindClassArgs = {
  level: Scalars['Int'];
  schoolGId: Scalars['ObjectId'];
};


export type QueryClassesArgs = {
  id: Scalars['ObjectId'];
};


export type QueryClassArgs = {
  classId: Scalars['ObjectId'];
  schoolId: Scalars['ObjectId'];
};


export type QueryStudentsArgs = {
  query: StudentsInput;
};


export type QueryStudentsDriverArgs = {
  query: StudentDriverInput;
};


export type QueryStudentCountArgs = {
  query: StudentCountInput;
};


export type QueryMyHourArgs = {
  parentStudentId?: Maybe<Scalars['ObjectId']>;
};


export type QueryStudentArgs = {
  citizenshipId?: Maybe<Scalars['String']>;
  studentId?: Maybe<Scalars['ObjectId']>;
};


export type QueryStudentMyLessonsArgs = {
  parentStudentId?: Maybe<Scalars['ObjectId']>;
};


export type QueryStudentNotificationsArgs = {
  skip?: Maybe<Scalars['Int']>;
  parentStudentId?: Maybe<Scalars['ObjectId']>;
};


export type QueryHomeWorksArgs = {
  i?: Maybe<Scalars['ID']>;
  skip?: Maybe<Scalars['Int']>;
  lessonId: Scalars['ID'];
};


export type QueryIlsArgs = {
  query: Scalars['String'];
};


export type QueryIlcesArgs = {
  plaka: Scalars['Int'];
};


export type QueryLessonsArgs = {
  data: LessonsInput;
};


export type QueryGetLessonArgs = {
  lessonId: Scalars['ObjectId'];
};


export type QueryHoursArgs = {
  schoolId: Scalars['ObjectId'];
  id: Scalars['ObjectId'];
};


export type QueryLessonMessagesArgs = {
  parentStudentId?: Maybe<Scalars['ObjectId']>;
  skip?: Maybe<Scalars['Int']>;
  lessonId: Scalars['ObjectId'];
};


export type QuerySchoolGArgs = {
  id: Scalars['ObjectId'];
};


export type QueryExamsArgs = {
  lessonId: Scalars['ObjectId'];
};


export type QueryMyExamsArgs = {
  parentStudentId?: Maybe<Scalars['ObjectId']>;
  lessonId: Scalars['ObjectId'];
};


export type QueryParentArgs = {
  citizenshipId: Scalars['String'];
};


export type QueryStudentParentsArgs = {
  studentId: Scalars['ObjectId'];
};


export type QueryAbsencesArgs = {
  parentStudentId?: Maybe<Scalars['ObjectId']>;
  query: AbsencesInput;
};


export type QueryStudiesArgs = {
  teacherId?: Maybe<Scalars['ObjectId']>;
  week?: Maybe<Scalars['Int']>;
  query?: Maybe<StudyQuery>;
};


export type QueryInboxsArgs = {
  skip: Scalars['Int'];
};


export type QueryInboxArgs = {
  to?: Maybe<Array<Scalars['ObjectId']>>;
  inboxId?: Maybe<Scalars['ObjectId']>;
};


export type QueryMessagesArgs = {
  inboxId: Scalars['ObjectId'];
  skip: Scalars['Int'];
};


export type QueryDriversOfStudentArgs = {
  parentStudentId: Scalars['ObjectId'];
};


export type QueryStudentServiceRequestsArgs = {
  parentStudentId: Scalars['ObjectId'];
};


export type QueryStudentVoyagesArgs = {
  parentStudentId: Scalars['ObjectId'];
};


export type QueryVoyageArgs = {
  voyageId: Scalars['ObjectId'];
};


export type QueryVoyageTimeArgs = {
  voyageTimeId: Scalars['ObjectId'];
  voyageId: Scalars['ObjectId'];
};


export type QueryParentApplicationsArgs = {
  studentId: Scalars['ObjectId'];
};

export type Person = {
  __typename?: 'Person';
  _id: Scalars['ID'];
  firstName: Scalars['String'];
  fullName: Scalars['String'];
  lastName: Scalars['String'];
  email?: Maybe<Scalars['String']>;
  birthDate?: Maybe<Scalars['DateTime']>;
  phone?: Maybe<Scalars['String']>;
  citizenshipId?: Maybe<Scalars['String']>;
  unVerifiedEmail?: Maybe<Scalars['String']>;
  profilePhoto?: Maybe<Scalars['Boolean']>;
  createdAt: Scalars['DateTime'];
  roles: Array<Role>;
  address?: Maybe<Address>;
  kind: PersonKind;
};


export enum Role {
  User = 'USER',
  Owner = 'OWNER',
  Teacher = 'TEACHER',
  Parent = 'PARENT',
  Admin = 'ADMIN',
  ClassroomTeacher = 'CLASSROOM_TEACHER',
  SuperAdmin = 'SUPER_ADMIN',
  Student = 'STUDENT',
  Driver = 'DRIVER'
}

export type Address = {
  __typename?: 'Address';
  _id: Scalars['ID'];
  title: Scalars['String'];
  description: Scalars['String'];
  location: AddressLocation;
};

export type AddressLocation = {
  __typename?: 'AddressLocation';
  coordinates: Array<Scalars['Float']>;
};

export enum PersonKind {
  User = 'user',
  Student = 'student',
  Person = 'person'
}


export type User = {
  __typename?: 'User';
  _id: Scalars['ID'];
  firstName: Scalars['String'];
  fullName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  birthDate?: Maybe<Scalars['DateTime']>;
  phone?: Maybe<Scalars['String']>;
  citizenshipId?: Maybe<Scalars['String']>;
  unVerifiedEmail?: Maybe<Scalars['String']>;
  profilePhoto?: Maybe<Scalars['Boolean']>;
  createdAt: Scalars['DateTime'];
  roles: Array<Role>;
  address?: Maybe<Address>;
  kind: PersonKind;
  educations: Array<Education>;
  notifications: Array<UserNotification>;
  teacher?: Maybe<Teacher>;
  parentStudents: Array<ParentStudent>;
  driver?: Maybe<Driver>;
};

export type Education = {
  __typename?: 'Education';
  _id: Scalars['ID'];
  educationLevelName: Scalars['String'];
  educationLevel: Scalars['Int'];
  educationType: Scalars['Int'];
  educationTypeName: Scalars['String'];
  educationlanguage: Scalars['Int'];
  educationlanguageName: Scalars['String'];
  university: University;
  universityId: Scalars['ID'];
  universityName?: Maybe<Scalars['String']>;
  roles: Array<Scalars['String']>;
  departmentId: Scalars['ID'];
  department?: Maybe<Department>;
  startDate: Scalars['DateTime'];
  finishDate?: Maybe<Scalars['DateTime']>;
};

export type University = {
  __typename?: 'University';
  _id: Scalars['ID'];
  name: Scalars['String'];
  universityLogoUrl?: Maybe<Scalars['String']>;
};

export type Department = {
  __typename?: 'Department';
  _id: Scalars['ID'];
  name: Scalars['String'];
};

export type UserNotification = {
  __typename?: 'UserNotification';
  _id: Scalars['ID'];
  title: Scalars['String'];
  link?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  notificationType?: Maybe<Scalars['String']>;
};

export type Teacher = {
  __typename?: 'Teacher';
  _id: Scalars['ID'];
  institutionId: Scalars['ID'];
  allSchool: Scalars['Boolean'];
  schoolIds: Scalars['ID'];
  addedById?: Maybe<Scalars['ID']>;
};

export type ParentStudent = {
  __typename?: 'ParentStudent';
  _id: Scalars['ID'];
  studentId: Scalars['ID'];
  institutionId: Scalars['ID'];
  parentType?: Maybe<ParentType>;
};

export enum ParentType {
  Mother = 'Mother',
  Father = 'Father'
}

export type Driver = {
  __typename?: 'Driver';
  _id: Scalars['ID'];
  requestApp?: Maybe<DriverStudentApplication>;
  institutions: Array<DriverInstitution>;
};


export type DriverRequestAppArgs = {
  parentStudentId: Scalars['ObjectId'];
};

export type DriverStudentApplication = {
  __typename?: 'DriverStudentApplication';
  _id: Scalars['ID'];
  email: Scalars['String'];
  userId?: Maybe<Scalars['ID']>;
  status: Scalars['Int'];
  institutionId: Scalars['ID'];
  studentId?: Maybe<Scalars['ID']>;
  studentFullName?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  institutionName?: Maybe<Scalars['String']>;
  userFullName: Scalars['String'];
  address?: Maybe<Address>;
  parentId: Scalars['ID'];
};

export type DriverInstitution = {
  __typename?: 'DriverInstitution';
  _id: Scalars['ID'];
  institutionId: Scalars['ID'];
  institutionName?: Maybe<Scalars['String']>;
};

export type School = {
  __typename?: 'School';
  _id: Scalars['ID'];
  eOkulCode?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  schoolKindId?: Maybe<Scalars['ID']>;
  schoolKindName?: Maybe<Scalars['String']>;
  headMasterId?: Maybe<Scalars['ID']>;
  headMaster?: Maybe<User>;
  weeklyHour?: Maybe<WeeklyHour>;
  educationYears: Array<EducationYear>;
  classes: Array<ClassType>;
  studentCount: Scalars['Int'];
  address?: Maybe<AddressLocation>;
};

export type WeeklyHour = {
  __typename?: 'WeeklyHour';
  _id: Scalars['ID'];
  name: Scalars['String'];
  hour: Array<Hour>;
};

export type Hour = {
  __typename?: 'Hour';
  _id: Scalars['ID'];
  code: Scalars['Int'];
  start: Scalars['Time'];
  finish: Scalars['Time'];
};


export type EducationYear = {
  __typename?: 'EducationYear';
  _id: Scalars['ID'];
  name: Scalars['String'];
  terms: Array<Term>;
};

export type Term = {
  __typename?: 'Term';
  _id: Scalars['ID'];
  name: Scalars['String'];
  start: Scalars['DateTime'];
  finish: Scalars['DateTime'];
};

export type ClassType = {
  __typename?: 'ClassType';
  _id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  level: Scalars['Int'];
  code?: Maybe<Scalars['String']>;
  code1?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  fullName: Scalars['String'];
  classroomTeacherId?: Maybe<Scalars['ID']>;
  classroomTeacher?: Maybe<User>;
  studentCount: Scalars['Int'];
  lessonCount: Scalars['Int'];
  lessons: Array<Lesson>;
};


export type ClassTypeLessonsArgs = {
  query: TeacherLessonInput;
};

export type Lesson = {
  __typename?: 'Lesson';
  _id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  weeklyHour: Scalars['Int'];
  teacherId?: Maybe<Scalars['ID']>;
  institutionId: Scalars['ID'];
  schoolId: Scalars['ID'];
  teacher?: Maybe<Person>;
  educationYearId: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  lessonWeeklySchedules: Array<WeeklySchedule>;
  lessonId?: Maybe<Scalars['ID']>;
  lessonName?: Maybe<Scalars['String']>;
  classId: Scalars['ID'];
};

export type WeeklySchedule = {
  __typename?: 'WeeklySchedule';
  _id: Scalars['ID'];
  day: Scalars['Int'];
  hourCode: Scalars['Int'];
};

export type TeacherLessonInput = {
  classes?: Maybe<Array<Scalars['ObjectId']>>;
  week?: Maybe<Scalars['Int']>;
  notMine?: Maybe<Scalars['Boolean']>;
  teacherId?: Maybe<Scalars['ObjectId']>;
};

export type ClassG = {
  __typename?: 'ClassG';
  _id: Scalars['ID'];
  level: Scalars['Int'];
  lessons: Array<ClassLesson>;
};

export type ClassLesson = {
  __typename?: 'ClassLesson';
  _id: Scalars['ID'];
  lessonId: Scalars['String'];
  lesson?: Maybe<LessonG>;
  count: Scalars['Int'];
  required: Scalars['Boolean'];
};

export type LessonG = {
  __typename?: 'LessonG';
  _id: Scalars['ID'];
  name: Scalars['String'];
  teacherFields: Array<TeacherField>;
  teacherFieldIds: Array<Scalars['String']>;
};

export type TeacherField = {
  __typename?: 'TeacherField';
  _id: Scalars['ID'];
  name: Scalars['String'];
  departments: Array<Department>;
};

export type Student = {
  __typename?: 'Student';
  _id: Scalars['ID'];
  firstName: Scalars['String'];
  fullName: Scalars['String'];
  lastName: Scalars['String'];
  email?: Maybe<Scalars['String']>;
  birthDate?: Maybe<Scalars['DateTime']>;
  phone?: Maybe<Scalars['String']>;
  citizenshipId: Scalars['String'];
  unVerifiedEmail?: Maybe<Scalars['String']>;
  profilePhoto?: Maybe<Scalars['Boolean']>;
  createdAt: Scalars['DateTime'];
  roles: Array<Role>;
  address: Address;
  kind: PersonKind;
  notifications: Array<Notification>;
  username: Scalars['String'];
  school?: Maybe<Scalars['ID']>;
  foreignLanguage?: Maybe<Scalars['String']>;
  schoolNo?: Maybe<Scalars['String']>;
  class?: Maybe<Scalars['ID']>;
  schoolName?: Maybe<Scalars['String']>;
  className?: Maybe<Scalars['String']>;
};

export type Notification = {
  __typename?: 'Notification';
  _id: Scalars['ID'];
  state: StudentNotificationState;
  lessonId?: Maybe<Scalars['ID']>;
  notificationType: StudentNotificationType;
  lessonName?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  action: StudentNotificationAction;
  createdAt: Scalars['DateTime'];
  targetId?: Maybe<Scalars['ID']>;
};

export enum StudentNotificationState {
  Read = 'Read',
  Seen = 'Seen',
  Unread = 'Unread'
}

export enum StudentNotificationType {
  Announcement = 'announcement',
  Homework = 'homework',
  Exam = 'exam',
  Absence = 'absence'
}

export enum StudentNotificationAction {
  Insert = 'Insert',
  Delete = 'Delete',
  Update = 'Update'
}

export type StudentsInput = {
  schoolId?: Maybe<Scalars['ObjectId']>;
  classId?: Maybe<Scalars['ObjectId']>;
  notClass?: Maybe<Scalars['Boolean']>;
  studentIds?: Maybe<Array<Scalars['ObjectId']>>;
  search?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['Int']>;
};

export type StudentDriverInput = {
  search: Scalars['String'];
  institutionId: Scalars['ObjectId'];
  studentIds?: Maybe<Array<Scalars['ObjectId']>>;
};

export type StudentCount = {
  __typename?: 'StudentCount';
  studentCount: Scalars['Int'];
};

export type StudentCountInput = {
  schoolId?: Maybe<Scalars['ObjectId']>;
  classId?: Maybe<Scalars['ObjectId']>;
};

export type HomeWork = {
  __typename?: 'HomeWork';
  _id: Scalars['ID'];
  institutionId: Scalars['ID'];
  lessonId: Scalars['ID'];
  message: Scalars['String'];
  title: Scalars['String'];
  sent: Scalars['DateTime'];
  file?: Maybe<Scalars['String']>;
};

export type Il = {
  __typename?: 'Il';
  _id: Scalars['ID'];
  il: Scalars['String'];
  ilceleri: Array<Scalars['String']>;
};

export type LessonsInput = {
  schoolId: Scalars['ObjectId'];
  classId: Scalars['ObjectId'];
  educationYearId: Scalars['ObjectId'];
};

export type LessonInbox = {
  __typename?: 'LessonInbox';
  _id: Scalars['ID'];
  institutionId: Scalars['ID'];
  lessonId: Scalars['ID'];
  message: Scalars['String'];
  title: Scalars['String'];
  teacherId: Scalars['ID'];
  sent: Scalars['DateTime'];
  messageType: LessonMessageType;
};

export enum LessonMessageType {
  Announcement = 'announcement',
  Homework = 'homework'
}

export type SchoolG = {
  __typename?: 'SchoolG';
  _id: Scalars['ID'];
  name: Scalars['String'];
  classes: Array<ClassG>;
};

export type Exam = {
  __typename?: 'Exam';
  _id: Scalars['ID'];
  institutionId: Scalars['ID'];
  lessonId: Scalars['ID'];
  date: Scalars['DateTime'];
  termId: Scalars['ID'];
  educationYearId: Scalars['ID'];
  lessonHourCode: Array<Scalars['Int']>;
  termName: Scalars['String'];
  grades: Array<Grade>;
};

export type Grade = {
  __typename?: 'Grade';
  _id: Scalars['ID'];
  studentId: Scalars['ID'];
  grade: Scalars['Int'];
};

export type TeacherApplication = {
  __typename?: 'TeacherApplication';
  _id: Scalars['ID'];
  email: Scalars['String'];
  userId?: Maybe<Scalars['ID']>;
  status: Scalars['Int'];
  institutionId: Scalars['ID'];
  studentId?: Maybe<Scalars['ID']>;
  studentFullName?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  institutionName?: Maybe<Scalars['String']>;
  userFullName?: Maybe<Scalars['String']>;
};

export type Absence = {
  __typename?: 'Absence';
  _id: Scalars['ID'];
  lessonId: Scalars['ID'];
  date: Scalars['DateTime'];
  day: Scalars['Int'];
  hourCode: Scalars['Int'];
  studentId: Scalars['ID'];
  teacherId: Scalars['ID'];
};

export type AbsencesInput = {
  /** active term */
  t?: Maybe<Scalars['Boolean']>;
};

export type Study = {
  __typename?: 'Study';
  _id: Scalars['ID'];
  teacherId: Scalars['ID'];
  lessonId?: Maybe<Scalars['ID']>;
  students: Array<StudyStudent>;
  date: Scalars['DateTime'];
  duration: Scalars['Int'];
  subject: Scalars['String'];
  detail?: Maybe<Scalars['String']>;
  institutionId: Scalars['ID'];
  public: Scalars['Boolean'];
  capacity?: Maybe<Scalars['Int']>;
  dateTimeSpan: Scalars['Time'];
  permissionClasses?: Maybe<Array<Scalars['ID']>>;
  lessonName: Scalars['String'];
};

export type StudyStudent = {
  __typename?: 'StudyStudent';
  _id: Scalars['ID'];
  studentId: Scalars['ID'];
  status: StudyStudentStatus;
  state: StudyState;
  student?: Maybe<Person>;
};

export enum StudyStudentStatus {
  Teacher = 'Teacher',
  Student = 'Student',
  Accept = 'Accept',
  NotJoined = 'NotJoined'
}

export enum StudyState {
  Read = 'Read',
  Seen = 'Seen',
  Unread = 'Unread'
}

export type StudyQuery = {
  lessonId?: Maybe<Scalars['ObjectId']>;
  date?: Maybe<Scalars['DateTime']>;
  endDate?: Maybe<Scalars['DateTime']>;
};

export type Inbox = {
  __typename?: 'Inbox';
  _id: Scalars['ID'];
  lastMessage: Scalars['String'];
  userIds: Array<Scalars['ID']>;
  unReadCount?: Maybe<Scalars['Int']>;
  users: Array<Person>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type Message = {
  __typename?: 'Message';
  _id: Scalars['ID'];
  inboxId: Scalars['ID'];
  ownerId: Scalars['ID'];
  owner?: Maybe<Person>;
  message: Scalars['String'];
  sent: Scalars['DateTime'];
  idOfUnReaders: Array<Scalars['ID']>;
};

export type DriverApplication = {
  __typename?: 'DriverApplication';
  _id: Scalars['ID'];
  email: Scalars['String'];
  userId?: Maybe<Scalars['ID']>;
  status: Scalars['Int'];
  institutionId: Scalars['ID'];
  studentId?: Maybe<Scalars['ID']>;
  studentFullName?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  institutionName?: Maybe<Scalars['String']>;
  userFullName?: Maybe<Scalars['String']>;
};

export type Voyage = {
  __typename?: 'Voyage';
  _id: Scalars['ID'];
  driverId: Scalars['ID'];
  voyageTimes: Array<VoyageTime>;
  title: Scalars['String'];
  schoolId: Scalars['ID'];
  school?: Maybe<School>;
  institutionName?: Maybe<Scalars['String']>;
  studentIds: Array<Scalars['ID']>;
  institutionId: Scalars['ID'];
};

export type VoyageTime = {
  __typename?: 'VoyageTime';
  _id: Scalars['ID'];
  day: Scalars['Int'];
  hour: Scalars['Time'];
  studentInfos: Array<StudentVoyegeInfo>;
  isStart?: Maybe<Scalars['Boolean']>;
  sessionId?: Maybe<Scalars['ID']>;
  isTakeSchool: Scalars['Boolean'];
};

export type StudentVoyegeInfo = {
  __typename?: 'StudentVoyegeInfo';
  _id: Scalars['ID'];
  studentId: Scalars['ID'];
  student?: Maybe<Student>;
  status: StudentVoyegeEnum;
  order: Scalars['Int'];
  disabled?: Maybe<Scalars['Boolean']>;
};

export enum StudentVoyegeEnum {
  NotHere = 'notHere',
  Here = 'here',
  GotOff = 'gotOff'
}

export type ParentApplication = {
  __typename?: 'ParentApplication';
  _id: Scalars['ID'];
  email: Scalars['String'];
  userId?: Maybe<Scalars['ID']>;
  status: Scalars['Int'];
  institutionId: Scalars['ID'];
  studentId: Scalars['ID'];
  studentFullName?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  institutionName?: Maybe<Scalars['String']>;
  userFullName?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  changeUserPhoto: Result;
  signIn: LoginToken;
  createUser: Person;
  createInst: User;
  forgotPassword: Result;
  resetPassword: Result;
  confirmEmail: Result;
  reSendConfirmEmail: Result;
  editUser: User;
  editEducation: Education;
  createSchool: School;
  deleteSchool: RemoveResult;
  addAddressToSchool: AddressLocation;
  removeLessonToClass: ClassG;
  addLessonToClass: ClassG;
  editDepartment: Department;
  removeDepartment: RemoveResult;
  createClass: ClassType;
  setClassroomTeacher: UpdateResult;
  deleteClass: RemoveResult;
  addTeacher: User;
  dismissTeacher: RemoveResult;
  addStudent: Student;
  transferStudents: UpdateResult;
  resetStudentPassword: StudentPassword;
  changePassword: Result;
  editStudentCitizenshipId: RemoveResult;
  dismissStudent: RemoveResult;
  studentSignIn: LoginToken;
  studentNotificationsStatusUpdate: UpdateResults;
  updateStudentAddress: Address;
  sendHomeWork: HomeWork;
  addLesson: Lesson;
  removeLesson: RemoveResult;
  setLessonSchedule: Lesson;
  removeScheduleToLesson: Lesson;
  createLessonG: LessonG;
  editLessonG: LessonG;
  removeLessonG: RemoveResult;
  addTeacherFieldsToLesson: LessonG;
  createHour: WeeklyHour;
  sendLessonMessage: LessonInbox;
  createSchoolG: SchoolG;
  addDepartmentsToTeacherField: TeacherField;
  removeDepartmentsToTeacherField: TeacherField;
  editTeacherField: TeacherField;
  removeTeacherField: RemoveResult;
  editEducationYear: EducationYear;
  deleteEducationYear: RemoveResult;
  setExamGrade: Grade;
  setExam: Exam;
  deleteExam: RemoveResult;
  addParent: User;
  removeParent: RemoveResult;
  parentConfirmEmail: ParentEmailConfirm;
  parentResetPassword: Result;
  parentForgotPassword: Result;
  parentResendConfirmEmail: Result;
  deleteInvitation: TeacherApplication;
  reSendInvitation: Result;
  invitationTeachers: Array<TeacherApplication>;
  acceptInvitation: Application;
  editUniversity: University;
  deleteAbsence: RemoveResult;
  createAbsence: Array<Absence>;
  joinStudy: Study;
  acceptJoinStudy: Study;
  createStudy: Study;
  deleteStudy: RemoveResult;
  updateStudyState: Study;
  sendMessage: Message;
  messageRead: Result;
  invitationDrivers: Array<DriverApplication>;
  acceptDriverInvitation: DriverApplication;
  addDriver: User;
  dismissDriver: RemoveResult;
  sendInvitationDriver: DriverStudentApplication;
  acceptDriverServiceInvitation: Result;
  cancelServiceRequestDriver: RemoveResult;
  cancelServiceRequestUser: RemoveResult;
  startPosition: VoyageTime;
  updatePosition: PositionType;
  stopPosition: VoyageTime;
  createVoyage: Voyage;
  addStudentVoyage: Result;
  removeStudentVoyage: Result;
  removeVoyageTime: RemoveResult;
  addVoyageTime: VoyageTime;
  setVoyageOrderLast: Result;
  activeVoyageTime: VoyageTime;
  invitationParent: ParentApplication;
};


export type MutationChangeUserPhotoArgs = {
  profilePhotoBase64: Scalars['String'];
};


export type MutationSignInArgs = {
  data: UserLoginInput;
};


export type MutationCreateUserArgs = {
  inputData: CreateUserInput;
};


export type MutationCreateInstArgs = {
  inputData: CreateInstInput;
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  data: ResetPasswordInput;
};


export type MutationConfirmEmailArgs = {
  data: ConfirmEmailInput;
};


export type MutationReSendConfirmEmailArgs = {
  data: ReSendConfirmEmailInput;
};


export type MutationEditUserArgs = {
  data: UserEditInput;
};


export type MutationEditEducationArgs = {
  education: EducationInput;
};


export type MutationCreateSchoolArgs = {
  data: CreateSchoolInput;
};


export type MutationDeleteSchoolArgs = {
  schoolId: Scalars['ObjectId'];
};


export type MutationAddAddressToSchoolArgs = {
  data: AddAddressSchoolInput;
};


export type MutationRemoveLessonToClassArgs = {
  classId: Scalars['ObjectId'];
  schoolId: Scalars['ObjectId'];
  _id: Scalars['ObjectId'];
};


export type MutationAddLessonToClassArgs = {
  data: LessonToClassInput;
};


export type MutationEditDepartmentArgs = {
  department: DepartmentInput;
};


export type MutationRemoveDepartmentArgs = {
  _id: Scalars['ObjectId'];
};


export type MutationCreateClassArgs = {
  data: CreateClassInput;
};


export type MutationSetClassroomTeacherArgs = {
  userId?: Maybe<Scalars['ObjectId']>;
  classId: Scalars['ObjectId'];
  schoolId: Scalars['ObjectId'];
};


export type MutationDeleteClassArgs = {
  classId: Scalars['ObjectId'];
  schoolId: Scalars['ObjectId'];
};


export type MutationAddTeacherArgs = {
  applicationId: Scalars['ObjectId'];
};


export type MutationDismissTeacherArgs = {
  teacherId: Scalars['ObjectId'];
};


export type MutationAddStudentArgs = {
  student: StudentInput;
};


export type MutationTransferStudentsArgs = {
  data: TransferInput;
};


export type MutationResetStudentPasswordArgs = {
  studentId: Scalars['ObjectId'];
};


export type MutationChangePasswordArgs = {
  data: ChangePasswordInput;
};


export type MutationEditStudentCitizenshipIdArgs = {
  data: StudentCitizenshipInput;
};


export type MutationDismissStudentArgs = {
  level: Scalars['Int'];
  studentId: Scalars['ObjectId'];
};


export type MutationStudentSignInArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationStudentNotificationsStatusUpdateArgs = {
  state: StudentNotificationState;
  ids: Array<Scalars['ObjectId']>;
};


export type MutationUpdateStudentAddressArgs = {
  data: AddressInput;
  i: Scalars['ObjectId'];
};


export type MutationSendHomeWorkArgs = {
  homeWorkFile?: Maybe<Scalars['Upload']>;
  data: HomeWorkInput;
};


export type MutationAddLessonArgs = {
  lesson: LessonInput;
};


export type MutationRemoveLessonArgs = {
  lessonId: Scalars['ObjectId'];
};


export type MutationSetLessonScheduleArgs = {
  schedule: LessonScheduleInput;
};


export type MutationRemoveScheduleToLessonArgs = {
  scheduleId: Scalars['ObjectId'];
  lessonId: Scalars['ObjectId'];
};


export type MutationCreateLessonGArgs = {
  lesson: LessonCreateInput;
};


export type MutationEditLessonGArgs = {
  lesson: LessonGInput;
};


export type MutationRemoveLessonGArgs = {
  _id: Scalars['ObjectId'];
};


export type MutationAddTeacherFieldsToLessonArgs = {
  _id: Scalars['ObjectId'];
  ids: Array<Scalars['ObjectId']>;
};


export type MutationCreateHourArgs = {
  data: CreateHourInput;
};


export type MutationSendLessonMessageArgs = {
  file?: Maybe<Scalars['Upload']>;
  data: LessonMessageInput;
};


export type MutationCreateSchoolGArgs = {
  data: SchoolGInput;
};


export type MutationAddDepartmentsToTeacherFieldArgs = {
  _id: Scalars['ObjectId'];
  ids: Array<Scalars['ObjectId']>;
};


export type MutationRemoveDepartmentsToTeacherFieldArgs = {
  _id: Scalars['ObjectId'];
  id: Scalars['ObjectId'];
};


export type MutationEditTeacherFieldArgs = {
  data: TeacherFieldInput;
};


export type MutationRemoveTeacherFieldArgs = {
  _id: Scalars['ObjectId'];
};


export type MutationEditEducationYearArgs = {
  educationYear: EducationYearInput;
};


export type MutationDeleteEducationYearArgs = {
  id: Scalars['ObjectId'];
  schoolId: Scalars['ObjectId'];
};


export type MutationSetExamGradeArgs = {
  studentId: Scalars['ObjectId'];
  grade: Scalars['Int'];
  lessonId: Scalars['ObjectId'];
  examId: Scalars['ObjectId'];
};


export type MutationSetExamArgs = {
  data: ExamInput;
};


export type MutationDeleteExamArgs = {
  examId: Scalars['ObjectId'];
  lessonId: Scalars['ObjectId'];
};


export type MutationAddParentArgs = {
  applicationId: Scalars['ObjectId'];
};


export type MutationRemoveParentArgs = {
  studentId: Scalars['ObjectId'];
  parentId: Scalars['ObjectId'];
};


export type MutationParentConfirmEmailArgs = {
  data: ParentConfirmEmailInput;
};


export type MutationParentResetPasswordArgs = {
  data: ParentResetPasswordInput;
};


export type MutationParentForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationParentResendConfirmEmailArgs = {
  data: ResendConfirmEmailInput;
};


export type MutationDeleteInvitationArgs = {
  applicationId: Scalars['ObjectId'];
};


export type MutationReSendInvitationArgs = {
  applicationId: Scalars['ObjectId'];
};


export type MutationInvitationTeachersArgs = {
  emails: Array<Scalars['String']>;
};


export type MutationAcceptInvitationArgs = {
  r?: Maybe<Scalars['Boolean']>;
  d?: Maybe<Scalars['Boolean']>;
  invitationId: Scalars['ObjectId'];
};


export type MutationEditUniversityArgs = {
  universityLogoFile?: Maybe<Scalars['Upload']>;
  _id?: Maybe<Scalars['ObjectId']>;
  name: Scalars['String'];
};


export type MutationDeleteAbsenceArgs = {
  absenceId: Scalars['ObjectId'];
};


export type MutationCreateAbsenceArgs = {
  data: AbsenceInput;
};


export type MutationJoinStudyArgs = {
  r?: Maybe<Scalars['Boolean']>;
  studyId: Scalars['ObjectId'];
};


export type MutationAcceptJoinStudyArgs = {
  status?: Maybe<StudyStudentStatus>;
  r?: Maybe<Scalars['Boolean']>;
  studentId: Scalars['ObjectId'];
  studyId: Scalars['ObjectId'];
};


export type MutationCreateStudyArgs = {
  data: StudyInput;
};


export type MutationDeleteStudyArgs = {
  studyId: Scalars['ObjectId'];
};


export type MutationUpdateStudyStateArgs = {
  studyStudentId: Scalars['ObjectId'];
  studyId: Scalars['ObjectId'];
};


export type MutationSendMessageArgs = {
  message: MessageInput;
};


export type MutationMessageReadArgs = {
  messageId: Scalars['ObjectId'];
};


export type MutationInvitationDriversArgs = {
  input: InvitationDriversInput;
};


export type MutationAcceptDriverInvitationArgs = {
  r?: Maybe<Scalars['Boolean']>;
  d?: Maybe<Scalars['Boolean']>;
  invitationId: Scalars['ObjectId'];
};


export type MutationAddDriverArgs = {
  applicationId: Scalars['ObjectId'];
};


export type MutationDismissDriverArgs = {
  driverId: Scalars['ObjectId'];
};


export type MutationSendInvitationDriverArgs = {
  parentStudentId: Scalars['ObjectId'];
  driverId: Scalars['ObjectId'];
};


export type MutationAcceptDriverServiceInvitationArgs = {
  invitationId: Scalars['ObjectId'];
};


export type MutationCancelServiceRequestDriverArgs = {
  requestId: Scalars['ObjectId'];
};


export type MutationCancelServiceRequestUserArgs = {
  parentStudentId: Scalars['ObjectId'];
  requestId: Scalars['ObjectId'];
};


export type MutationStartPositionArgs = {
  data: StartPositionInput;
};


export type MutationUpdatePositionArgs = {
  data: UpdatePositionInput;
};


export type MutationStopPositionArgs = {
  data: StopPositionInput;
};


export type MutationCreateVoyageArgs = {
  data: CreateVoyageInput;
};


export type MutationAddStudentVoyageArgs = {
  studentId: Scalars['ObjectId'];
  voyageId: Scalars['ObjectId'];
};


export type MutationRemoveStudentVoyageArgs = {
  studentId: Scalars['ObjectId'];
  voyageId: Scalars['ObjectId'];
};


export type MutationRemoveVoyageTimeArgs = {
  timeId: Scalars['ObjectId'];
  voyageId: Scalars['ObjectId'];
};


export type MutationAddVoyageTimeArgs = {
  data: VoyageTimeInput;
  voyageId: Scalars['ObjectId'];
};


export type MutationSetVoyageOrderLastArgs = {
  studentId: Scalars['ObjectId'];
  voyageId: Scalars['ObjectId'];
};


export type MutationActiveVoyageTimeArgs = {
  parentStudentId: Scalars['ObjectId'];
};


export type MutationInvitationParentArgs = {
  studentId: Scalars['ObjectId'];
  email: Scalars['String'];
};

export type Result = {
  __typename?: 'Result';
  success: Scalars['Boolean'];
};

export type LoginToken = {
  __typename?: 'LoginToken';
  token: Scalars['String'];
};

export type UserLoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type CreateUserInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  token?: Maybe<Scalars['String']>;
};

export type CreateInstInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  token?: Maybe<Scalars['String']>;
  phone: Scalars['String'];
  institutionName: Scalars['String'];
};

export type ResetPasswordInput = {
  token: Scalars['String'];
  _id: Scalars['ObjectId'];
  password?: Maybe<Scalars['String']>;
};

export type ConfirmEmailInput = {
  token: Scalars['String'];
  email: Scalars['String'];
};

export type ReSendConfirmEmailInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type UserEditInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  phone?: Maybe<Scalars['String']>;
  addressData?: Maybe<AddressInput>;
  birthDate?: Maybe<Scalars['DateTime']>;
};

export type AddressInput = {
  title: Scalars['String'];
  description: Scalars['String'];
  lat: Scalars['Float'];
  lng: Scalars['Float'];
};

export type EducationInput = {
  educationLevel: Scalars['Int'];
  educationLevelName: Scalars['String'];
  universityId: Scalars['ObjectId'];
  universityName: Scalars['String'];
  educationType: Scalars['Int'];
  educationTypeName: Scalars['String'];
  educationlanguage: Scalars['Int'];
  educationlanguageName: Scalars['String'];
  departmentId: Scalars['ObjectId'];
  startDate: Scalars['DateTime'];
  finishDate?: Maybe<Scalars['DateTime']>;
};

export type CreateSchoolInput = {
  _id?: Maybe<Scalars['ObjectId']>;
  name: Scalars['String'];
  eOkulCode?: Maybe<Scalars['String']>;
  schoolKindId?: Maybe<Scalars['ObjectId']>;
};

export type RemoveResult = {
  __typename?: 'RemoveResult';
  code: Scalars['String'];
  success: Scalars['Boolean'];
  _id: Scalars['ID'];
};

export type AddAddressSchoolInput = {
  schoolId: Scalars['ObjectId'];
  lat: Scalars['Float'];
  lng: Scalars['Float'];
};

export type LessonToClassInput = {
  schoolId: Scalars['ObjectId'];
  classId: Scalars['ObjectId'];
  lessonId: Scalars['ObjectId'];
  count: Scalars['Int'];
  required?: Maybe<Scalars['Boolean']>;
};

export type DepartmentInput = {
  name: Scalars['String'];
};

export type CreateClassInput = {
  _id?: Maybe<Scalars['ObjectId']>;
  schoolId: Scalars['ObjectId'];
  name?: Maybe<Scalars['String']>;
  level: Scalars['Int'];
  code?: Maybe<Scalars['String']>;
  code1?: Maybe<Scalars['String']>;
};

export type UpdateResult = {
  __typename?: 'UpdateResult';
  code: Scalars['String'];
  success: Scalars['Boolean'];
  _id?: Maybe<Scalars['ID']>;
};

export type StudentInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  citizenshipId: Scalars['String'];
  foreignLanguage?: Maybe<Scalars['String']>;
  school?: Maybe<Scalars['ObjectId']>;
  class?: Maybe<Scalars['ObjectId']>;
  eOkulCode?: Maybe<Scalars['String']>;
  profilePhotoBase64?: Maybe<Scalars['String']>;
  schoolNo?: Maybe<Scalars['String']>;
};

export type TransferInput = {
  schoolId: Scalars['ObjectId'];
  classId?: Maybe<Scalars['ObjectId']>;
  students?: Maybe<Array<Scalars['ObjectId']>>;
};

export type StudentPassword = {
  __typename?: 'StudentPassword';
  password: Scalars['String'];
};

export type ChangePasswordInput = {
  password: Scalars['String'];
  rePassword: Scalars['String'];
};

export type StudentCitizenshipInput = {
  citizenshipId: Scalars['String'];
  studentId: Scalars['ObjectId'];
};

export type UpdateResults = {
  __typename?: 'UpdateResults';
  code: Scalars['String'];
  success: Scalars['Boolean'];
  _ids: Array<Scalars['ID']>;
};


export type HomeWorkInput = {
  lessonId: Scalars['ObjectId'];
  title: Scalars['String'];
  message: Scalars['String'];
};

export type LessonInput = {
  _id?: Maybe<Scalars['ObjectId']>;
  schoolId: Scalars['ObjectId'];
  classId: Scalars['ObjectId'];
  lessonId?: Maybe<Scalars['ObjectId']>;
  name?: Maybe<Scalars['String']>;
  weeklyHour: Scalars['Int'];
  teacherId?: Maybe<Scalars['ObjectId']>;
};

export type LessonScheduleInput = {
  lessonId: Scalars['ObjectId'];
  day: Scalars['Int'];
  hourCode: Scalars['Int'];
};

export type LessonCreateInput = {
  name: Scalars['String'];
  teacherFieldIds: Array<Scalars['ObjectId']>;
};

export type LessonGInput = {
  _id: Scalars['ObjectId'];
  name?: Maybe<Scalars['String']>;
  teacherFieldIds: Array<Scalars['ObjectId']>;
};

export type CreateHourInput = {
  _id?: Maybe<Scalars['ObjectId']>;
  schoolId: Scalars['ObjectId'];
  name: Scalars['String'];
  hour: Array<HourInput>;
};

export type HourInput = {
  _id?: Maybe<Scalars['ObjectId']>;
  code: Scalars['Int'];
  start: Scalars['Time'];
  finish: Scalars['Time'];
};

export type LessonMessageInput = {
  lessonId: Scalars['ObjectId'];
  title: Scalars['String'];
  message: Scalars['String'];
  messageType: LessonMessageType;
};

export type SchoolGInput = {
  name: Scalars['String'];
  classes: Array<ClassesGInput>;
};

export type ClassesGInput = {
  level: Scalars['Int'];
};

export type TeacherFieldInput = {
  name: Scalars['String'];
};

export type EducationYearInput = {
  schoolId: Scalars['ObjectId'];
  name: Scalars['String'];
  terms: Array<TermInput>;
};

export type TermInput = {
  name: Scalars['String'];
  start: Scalars['DateTime'];
  finish: Scalars['DateTime'];
};

export type ExamInput = {
  _id?: Maybe<Scalars['ObjectId']>;
  lessonId: Scalars['ObjectId'];
  date: Scalars['DateTime'];
  lessonHourCode: Array<Scalars['Int']>;
};

export type ParentEmailConfirm = {
  __typename?: 'ParentEmailConfirm';
  token: Scalars['ObjectId'];
  _id: Scalars['ObjectId'];
};

export type ParentConfirmEmailInput = {
  token: Scalars['String'];
  unVerifiedEmail: Scalars['String'];
};

export type ParentResetPasswordInput = {
  token: Scalars['String'];
  _id: Scalars['ObjectId'];
  password?: Maybe<Scalars['String']>;
};

export type ResendConfirmEmailInput = {
  unVerifiedEmail: Scalars['String'];
  citizenshipId: Scalars['String'];
};

export type Application = {
  __typename?: 'Application';
  _id: Scalars['ID'];
  email: Scalars['String'];
  userId?: Maybe<Scalars['ID']>;
  status: Scalars['Int'];
  institutionId: Scalars['ID'];
  studentId?: Maybe<Scalars['ID']>;
  studentFullName?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  institutionName?: Maybe<Scalars['String']>;
  userFullName?: Maybe<Scalars['String']>;
};

export type AbsenceInput = {
  studentIds: Array<Scalars['ObjectId']>;
  lessonId: Scalars['ObjectId'];
  hourCode: Scalars['Int'];
};

export type StudyInput = {
  lessonId?: Maybe<Scalars['ObjectId']>;
  date: Scalars['DateTime'];
  duration: Scalars['Int'];
  subject: Scalars['String'];
  detail?: Maybe<Scalars['String']>;
  public?: Maybe<Scalars['Boolean']>;
  capacity?: Maybe<Scalars['Int']>;
  permissionClasses?: Maybe<Array<Scalars['ObjectId']>>;
};

export type MessageInput = {
  to: Array<Scalars['ObjectId']>;
  message: Scalars['String'];
};

export type InvitationDriversInput = {
  emails: Array<Scalars['String']>;
};

export type StartPositionInput = {
  position: PositionInput;
  voyageId: Scalars['ObjectId'];
  timeId: Scalars['ObjectId'];
};

export type PositionInput = {
  coords: CoordinatesInput;
  timestamp: Scalars['Float'];
};

export type CoordinatesInput = {
  accuracy: Scalars['Int'];
  altitude?: Maybe<Scalars['Int']>;
  altitudeAccuracy?: Maybe<Scalars['Int']>;
  heading?: Maybe<Scalars['Int']>;
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  speed?: Maybe<Scalars['Int']>;
};

export type PositionType = {
  __typename?: 'PositionType';
  coords: CoordinatesType;
  timestamp: Scalars['DateTime'];
};

export type CoordinatesType = {
  __typename?: 'CoordinatesType';
  accuracy: Scalars['Float'];
  altitude?: Maybe<Scalars['Int']>;
  altitudeAccuracy?: Maybe<Scalars['Int']>;
  heading?: Maybe<Scalars['Int']>;
  point: Point;
  speed?: Maybe<Scalars['Int']>;
};

export type Point = {
  __typename?: 'Point';
  coordinates: Array<Scalars['Decimal128']>;
};


export type UpdatePositionInput = {
  position: PositionInput;
  voyageId: Scalars['ObjectId'];
  timeId: Scalars['ObjectId'];
  sessionId: Scalars['ObjectId'];
};

export type StopPositionInput = {
  voyageId: Scalars['ObjectId'];
  timeId: Scalars['ObjectId'];
};

export type CreateVoyageInput = {
  title: Scalars['String'];
  institutionId: Scalars['ObjectId'];
  schoolId: Scalars['ObjectId'];
  times: Array<VoyageTimeInput>;
};

export type VoyageTimeInput = {
  day: Scalars['Int'];
  hour: Scalars['Time'];
  isTakeSchool: Scalars['Boolean'];
};

export type Subscription = {
  __typename?: 'Subscription';
  studentNotificationUpdated: Notification;
  applicationUpdated: Application;
  inboxNotification: Message;
  positionNotification: PositionType;
};

export type AbsenceFragment = (
  { __typename?: 'Absence' }
  & Pick<Absence, '_id' | 'lessonId' | 'date' | 'hourCode' | 'studentId' | 'day'>
);

export type AbsencesQueryVariables = Exact<{
  t?: Maybe<Scalars['Boolean']>;
  parentStudentId?: Maybe<Scalars['ObjectId']>;
}>;


export type AbsencesQuery = (
  { __typename?: 'Query' }
  & { absences: Array<(
    { __typename?: 'Absence' }
    & AbsenceFragment
  )> }
);

export type DeleteAbsenceMutationVariables = Exact<{
  absenceId: Scalars['ObjectId'];
}>;


export type DeleteAbsenceMutation = (
  { __typename?: 'Mutation' }
  & { deleteAbsence: (
    { __typename?: 'RemoveResult' }
    & RemoveResultFragment
  ) }
);

export type CreateAbsenceMutationVariables = Exact<{
  studentIds: Array<Scalars['ObjectId']>;
  lessonId: Scalars['ObjectId'];
  hourCode: Scalars['Int'];
}>;


export type CreateAbsenceMutation = (
  { __typename?: 'Mutation' }
  & { createAbsence: Array<(
    { __typename?: 'Absence' }
    & AbsenceFragment
  )> }
);

export type AddressFragment = (
  { __typename?: 'Address' }
  & Pick<Address, '_id' | 'title' | 'description'>
  & { location: (
    { __typename?: 'AddressLocation' }
    & Pick<AddressLocation, 'coordinates'>
  ) }
);

export type UpdateStudentAddressMutationVariables = Exact<{
  title: Scalars['String'];
  description: Scalars['String'];
  lat: Scalars['Float'];
  lng: Scalars['Float'];
  i: Scalars['ObjectId'];
}>;


export type UpdateStudentAddressMutation = (
  { __typename?: 'Mutation' }
  & { updateStudentAddress: (
    { __typename?: 'Address' }
    & AddressFragment
  ) }
);

export type AddAddressToSchoolMutationVariables = Exact<{
  schoolId: Scalars['ObjectId'];
  lat: Scalars['Float'];
  lng: Scalars['Float'];
}>;


export type AddAddressToSchoolMutation = (
  { __typename?: 'Mutation' }
  & { addAddressToSchool: (
    { __typename?: 'AddressLocation' }
    & Pick<AddressLocation, 'coordinates'>
  ) }
);

export type ApplicationFragment = (
  { __typename?: 'Application' }
  & Pick<Application, '_id' | 'status' | 'institutionId' | 'institutionName' | 'userId' | 'userFullName' | 'createdAt' | 'email'>
);

export type AcceptInvitationMutationVariables = Exact<{
  invitationId: Scalars['ObjectId'];
  r?: Maybe<Scalars['Boolean']>;
  d?: Maybe<Scalars['Boolean']>;
}>;


export type AcceptInvitationMutation = (
  { __typename?: 'Mutation' }
  & { acceptInvitation: (
    { __typename?: 'Application' }
    & ApplicationFragment
  ) }
);

export type ApplicatonUpdatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type ApplicatonUpdatedSubscription = (
  { __typename?: 'Subscription' }
  & { applicationUpdated: (
    { __typename?: 'Application' }
    & ApplicationFragment
  ) }
);

export type ClassGFragment = (
  { __typename?: 'ClassG' }
  & Pick<ClassG, '_id' | 'level'>
  & { lessons: Array<(
    { __typename?: 'ClassLesson' }
    & ClassLessonFragment
  )> }
);

export type SchoolKindClassQueryVariables = Exact<{
  schoolGId: Scalars['ObjectId'];
  level: Scalars['Int'];
}>;


export type SchoolKindClassQuery = (
  { __typename?: 'Query' }
  & { schoolKindClass: (
    { __typename?: 'ClassG' }
    & ClassGFragment
  ) }
);

export type ClassGQueryVariables = Exact<{
  schoolId: Scalars['ObjectId'];
  classId: Scalars['ObjectId'];
}>;


export type ClassGQuery = (
  { __typename?: 'Query' }
  & { classG: (
    { __typename?: 'ClassG' }
    & ClassGFragment
  ) }
);

export type AddLessonToClassMutationVariables = Exact<{
  schoolId: Scalars['ObjectId'];
  classId: Scalars['ObjectId'];
  lessonId: Scalars['ObjectId'];
  count: Scalars['Int'];
  required?: Maybe<Scalars['Boolean']>;
}>;


export type AddLessonToClassMutation = (
  { __typename?: 'Mutation' }
  & { addLessonToClass: (
    { __typename?: 'ClassG' }
    & ClassGFragment
  ) }
);

export type RemoveLessonToClassMutationVariables = Exact<{
  schoolId: Scalars['ObjectId'];
  classId: Scalars['ObjectId'];
  _id: Scalars['ObjectId'];
}>;


export type RemoveLessonToClassMutation = (
  { __typename?: 'Mutation' }
  & { removeLessonToClass: (
    { __typename?: 'ClassG' }
    & ClassGFragment
  ) }
);

export type ClassLessonFragment = (
  { __typename?: 'ClassLesson' }
  & Pick<ClassLesson, '_id' | 'lessonId' | 'count' | 'required'>
  & { lesson?: Maybe<(
    { __typename?: 'LessonG' }
    & LessonGFragment
  )> }
);

export type ClassTypeFragment = (
  { __typename?: 'ClassType' }
  & Pick<ClassType, '_id' | 'name' | 'level' | 'code' | 'code1' | 'createdAt' | 'studentCount' | 'fullName' | 'lessonCount' | 'classroomTeacherId'>
  & { classroomTeacher?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, '_id' | 'firstName' | 'lastName' | 'fullName'>
  )> }
);

export type ClassesQueryVariables = Exact<{
  id: Scalars['ObjectId'];
}>;


export type ClassesQuery = (
  { __typename?: 'Query' }
  & { classes: Array<(
    { __typename?: 'ClassType' }
    & ClassTypeFragment
  )> }
);

export type ClassQueryVariables = Exact<{
  schoolId: Scalars['ObjectId'];
  classId: Scalars['ObjectId'];
}>;


export type ClassQuery = (
  { __typename?: 'Query' }
  & { class: (
    { __typename?: 'ClassType' }
    & ClassTypeFragment
  ) }
);

export type SetClassroomTeacherMutationVariables = Exact<{
  schoolId: Scalars['ObjectId'];
  classId: Scalars['ObjectId'];
  userId?: Maybe<Scalars['ObjectId']>;
}>;


export type SetClassroomTeacherMutation = (
  { __typename?: 'Mutation' }
  & { setClassroomTeacher: (
    { __typename?: 'UpdateResult' }
    & Pick<UpdateResult, 'code' | 'success'>
  ) }
);

export type CreateClassMutationVariables = Exact<{
  _id?: Maybe<Scalars['ObjectId']>;
  schoolId: Scalars['ObjectId'];
  name?: Maybe<Scalars['String']>;
  level: Scalars['Int'];
  code?: Maybe<Scalars['String']>;
  code1?: Maybe<Scalars['String']>;
}>;


export type CreateClassMutation = (
  { __typename?: 'Mutation' }
  & { createClass: (
    { __typename?: 'ClassType' }
    & ClassTypeFragment
  ) }
);

export type DeleteClassTypeMutationVariables = Exact<{
  schoolId: Scalars['ObjectId'];
  classId: Scalars['ObjectId'];
}>;


export type DeleteClassTypeMutation = (
  { __typename?: 'Mutation' }
  & { deleteClass: (
    { __typename?: 'RemoveResult' }
    & RemoveResultFragment
  ) }
);

export type DeapartmentFragment = (
  { __typename?: 'Department' }
  & Pick<Department, '_id' | 'name'>
);

export type DepartmentsQueryVariables = Exact<{ [key: string]: never; }>;


export type DepartmentsQuery = (
  { __typename?: 'Query' }
  & { departments: Array<(
    { __typename?: 'Department' }
    & DeapartmentFragment
  )> }
);

export type RemoveDepartmentMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type RemoveDepartmentMutation = (
  { __typename?: 'Mutation' }
  & { removeDepartment: (
    { __typename?: 'RemoveResult' }
    & RemoveResultFragment
  ) }
);

export type EditDepartmentMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type EditDepartmentMutation = (
  { __typename?: 'Mutation' }
  & { editDepartment: (
    { __typename?: 'Department' }
    & DeapartmentFragment
  ) }
);

export type AddDepartmentsToTeacherFieldMutationVariables = Exact<{
  ids: Array<Scalars['ObjectId']>;
  _id: Scalars['ObjectId'];
}>;


export type AddDepartmentsToTeacherFieldMutation = (
  { __typename?: 'Mutation' }
  & { addDepartmentsToTeacherField: (
    { __typename?: 'TeacherField' }
    & TeacherFieldFragment
  ) }
);

export type RemoveDepartmentsToTeacherFieldMutationVariables = Exact<{
  id: Scalars['ObjectId'];
  _id: Scalars['ObjectId'];
}>;


export type RemoveDepartmentsToTeacherFieldMutation = (
  { __typename?: 'Mutation' }
  & { removeDepartmentsToTeacherField: (
    { __typename?: 'TeacherField' }
    & TeacherFieldFragment
  ) }
);

export type DriverPartFragment = (
  { __typename?: 'User' }
  & Pick<User, '_id' | 'firstName' | 'lastName' | 'fullName' | 'createdAt' | 'citizenshipId'>
  & { driver?: Maybe<(
    { __typename?: 'Driver' }
    & Pick<Driver, '_id'>
    & { institutions: Array<(
      { __typename?: 'DriverInstitution' }
      & DriverInstitutionFragment
    )> }
  )> }
);

export type DriverFragment = (
  { __typename?: 'Driver' }
  & Pick<Driver, '_id'>
  & { institutions: Array<(
    { __typename?: 'DriverInstitution' }
    & DriverInstitutionFragment
  )> }
);

export type StudentsDriverQueryVariables = Exact<{
  search: Scalars['String'];
  institutionId: Scalars['ObjectId'];
  studentIds?: Maybe<Array<Scalars['ObjectId']>>;
}>;


export type StudentsDriverQuery = (
  { __typename?: 'Query' }
  & { studentsDriver: Array<(
    { __typename?: 'Student' }
    & StudentFragment
  )> }
);

export type DriverInsitutionsQueryVariables = Exact<{ [key: string]: never; }>;


export type DriverInsitutionsQuery = (
  { __typename?: 'Query' }
  & { driverInsitutions: Array<(
    { __typename?: 'DriverInstitution' }
    & Pick<DriverInstitution, 'institutionId' | 'institutionName'>
  )> }
);

export type DriversQueryVariables = Exact<{ [key: string]: never; }>;


export type DriversQuery = (
  { __typename?: 'Query' }
  & { drivers: Array<(
    { __typename?: 'User' }
    & DriverPartFragment
  )> }
);

export type DriversOfStudentQueryVariables = Exact<{
  parentStudentId: Scalars['ObjectId'];
}>;


export type DriversOfStudentQuery = (
  { __typename?: 'Query' }
  & { driversOfStudent: Array<(
    { __typename?: 'User' }
    & DriverPartFragment
  )> }
);

export type DriversWithAppQueryVariables = Exact<{
  parentStudentId: Scalars['ObjectId'];
}>;


export type DriversWithAppQuery = (
  { __typename?: 'Query' }
  & { drivers: Array<(
    { __typename?: 'User' }
    & Pick<User, '_id' | 'firstName' | 'lastName' | 'fullName' | 'createdAt' | 'citizenshipId'>
    & { address?: Maybe<(
      { __typename?: 'Address' }
      & AddressFragment
    )>, driver?: Maybe<(
      { __typename?: 'Driver' }
      & Pick<Driver, '_id'>
      & { institutions: Array<(
        { __typename?: 'DriverInstitution' }
        & DriverInstitutionFragment
      )>, requestApp?: Maybe<(
        { __typename?: 'DriverStudentApplication' }
        & DriverStudentApplicationFragment
      )> }
    )> }
  )> }
);

export type DismissDriverMutationVariables = Exact<{
  driverId: Scalars['ObjectId'];
}>;


export type DismissDriverMutation = (
  { __typename?: 'Mutation' }
  & { dismissDriver: (
    { __typename?: 'RemoveResult' }
    & RemoveResultFragment
  ) }
);

export type DriverApplicationFragment = (
  { __typename?: 'DriverApplication' }
  & Pick<DriverApplication, '_id' | 'email' | 'userFullName' | 'status' | 'createdAt' | 'institutionName' | 'userId'>
);

export type DriverJobRequestsQueryVariables = Exact<{ [key: string]: never; }>;


export type DriverJobRequestsQuery = (
  { __typename?: 'Query' }
  & { driverJobRequests: Array<(
    { __typename?: 'DriverApplication' }
    & DriverApplicationFragment
  )> }
);

export type AcceptDriverInvitationMutationVariables = Exact<{
  invitationId: Scalars['ObjectId'];
  r?: Maybe<Scalars['Boolean']>;
  d?: Maybe<Scalars['Boolean']>;
}>;


export type AcceptDriverInvitationMutation = (
  { __typename?: 'Mutation' }
  & { acceptDriverInvitation: (
    { __typename?: 'DriverApplication' }
    & DriverApplicationFragment
  ) }
);

export type AddDriverMutationVariables = Exact<{
  applicationId: Scalars['ObjectId'];
}>;


export type AddDriverMutation = (
  { __typename?: 'Mutation' }
  & { addDriver: (
    { __typename?: 'User' }
    & UserFragment
  ) }
);

export type InvitationDriversMutationVariables = Exact<{
  emails: Array<Scalars['String']>;
}>;


export type InvitationDriversMutation = (
  { __typename?: 'Mutation' }
  & { invitationDrivers: Array<(
    { __typename?: 'DriverApplication' }
    & DriverApplicationFragment
  )> }
);

export type DriverApplicationsQueryVariables = Exact<{ [key: string]: never; }>;


export type DriverApplicationsQuery = (
  { __typename?: 'Query' }
  & { driverApplications: Array<(
    { __typename?: 'DriverApplication' }
    & DriverApplicationFragment
  )> }
);

export type DriverInstitutionFragment = (
  { __typename?: 'DriverInstitution' }
  & Pick<DriverInstitution, '_id' | 'institutionId' | 'institutionName'>
);

export type DriverStudentApplicationFragment = (
  { __typename?: 'DriverStudentApplication' }
  & Pick<DriverStudentApplication, '_id' | 'createdAt' | 'parentId' | 'status' | 'institutionId' | 'email' | 'userFullName' | 'userId' | 'institutionName' | 'studentFullName' | 'studentId'>
  & { address?: Maybe<(
    { __typename?: 'Address' }
    & AddressFragment
  )> }
);

export type DriverServiceRequestsQueryVariables = Exact<{ [key: string]: never; }>;


export type DriverServiceRequestsQuery = (
  { __typename?: 'Query' }
  & { driverServiceRequests: Array<(
    { __typename?: 'DriverStudentApplication' }
    & DriverStudentApplicationFragment
  )> }
);

export type CancelServiceRequestDriverMutationVariables = Exact<{
  requestId: Scalars['ObjectId'];
}>;


export type CancelServiceRequestDriverMutation = (
  { __typename?: 'Mutation' }
  & { cancelServiceRequestDriver: (
    { __typename?: 'RemoveResult' }
    & RemoveResultFragment
  ) }
);

export type AcceptDriverServiceInvitationMutationVariables = Exact<{
  invitationId: Scalars['ObjectId'];
}>;


export type AcceptDriverServiceInvitationMutation = (
  { __typename?: 'Mutation' }
  & { acceptDriverServiceInvitation: (
    { __typename?: 'Result' }
    & Pick<Result, 'success'>
  ) }
);

export type CancelServiceRequestUserMutationVariables = Exact<{
  requestId: Scalars['ObjectId'];
  parentStudentId: Scalars['ObjectId'];
}>;


export type CancelServiceRequestUserMutation = (
  { __typename?: 'Mutation' }
  & { cancelServiceRequestUser: (
    { __typename?: 'RemoveResult' }
    & RemoveResultFragment
  ) }
);

export type SendInvitationDriverMutationVariables = Exact<{
  parentStudentId: Scalars['ObjectId'];
  driverId: Scalars['ObjectId'];
}>;


export type SendInvitationDriverMutation = (
  { __typename?: 'Mutation' }
  & { sendInvitationDriver: (
    { __typename?: 'DriverStudentApplication' }
    & DriverStudentApplicationFragment
  ) }
);

export type EducationFragment = (
  { __typename?: 'Education' }
  & Pick<Education, '_id' | 'educationLevelName' | 'educationLevel' | 'educationType' | 'educationTypeName' | 'educationlanguage' | 'universityName' | 'startDate' | 'finishDate'>
  & { department?: Maybe<(
    { __typename?: 'Department' }
    & Pick<Department, '_id' | 'name'>
  )> }
);

export type EducationsQueryVariables = Exact<{ [key: string]: never; }>;


export type EducationsQuery = (
  { __typename?: 'Query' }
  & { educations: Array<(
    { __typename?: 'Education' }
    & EducationFragment
  )> }
);

export type EditEducationMutationVariables = Exact<{
  educationLevel: Scalars['Int'];
  educationLevelName: Scalars['String'];
  universityId: Scalars['ObjectId'];
  universityName: Scalars['String'];
  educationType: Scalars['Int'];
  educationTypeName: Scalars['String'];
  educationlanguage: Scalars['Int'];
  educationlanguageName: Scalars['String'];
  departmentId: Scalars['ObjectId'];
  startDate: Scalars['DateTime'];
  finishDate?: Maybe<Scalars['DateTime']>;
}>;


export type EditEducationMutation = (
  { __typename?: 'Mutation' }
  & { editEducation: (
    { __typename?: 'Education' }
    & EducationFragment
  ) }
);

export type EducationYearFragment = (
  { __typename?: 'EducationYear' }
  & Pick<EducationYear, '_id' | 'name'>
  & { terms: Array<(
    { __typename?: 'Term' }
    & TermFragment
  )> }
);

export type EditEducationYearMutationVariables = Exact<{
  schoolId: Scalars['ObjectId'];
  name: Scalars['String'];
  terms: Array<TermInput>;
}>;


export type EditEducationYearMutation = (
  { __typename?: 'Mutation' }
  & { editEducationYear: (
    { __typename?: 'EducationYear' }
    & EducationYearFragment
  ) }
);

export type DeleteEducationYearMutationVariables = Exact<{
  schoolId: Scalars['ObjectId'];
  id: Scalars['ObjectId'];
}>;


export type DeleteEducationYearMutation = (
  { __typename?: 'Mutation' }
  & { deleteEducationYear: (
    { __typename?: 'RemoveResult' }
    & RemoveResultFragment
  ) }
);

export type ExamFragment = (
  { __typename?: 'Exam' }
  & Pick<Exam, '_id' | 'lessonHourCode' | 'lessonId' | 'date' | 'educationYearId' | 'termId'>
  & { grades: Array<(
    { __typename?: 'Grade' }
    & GradeFragment
  )> }
);

export type ExamsQueryVariables = Exact<{
  lessonId: Scalars['ObjectId'];
}>;


export type ExamsQuery = (
  { __typename?: 'Query' }
  & { exams: Array<(
    { __typename?: 'Exam' }
    & ExamFragment
  )> }
);

export type MyExamsQueryVariables = Exact<{
  lessonId: Scalars['ObjectId'];
}>;


export type MyExamsQuery = (
  { __typename?: 'Query' }
  & { myExams: Array<(
    { __typename?: 'Exam' }
    & Pick<Exam, 'termName'>
    & ExamFragment
  )> }
);

export type SetExamMutationVariables = Exact<{
  lessonId: Scalars['ObjectId'];
  lessonHourCode: Array<Scalars['Int']>;
  date: Scalars['DateTime'];
  _id?: Maybe<Scalars['ObjectId']>;
}>;


export type SetExamMutation = (
  { __typename?: 'Mutation' }
  & { setExam: (
    { __typename?: 'Exam' }
    & ExamFragment
  ) }
);

export type DeleteExamMutationVariables = Exact<{
  lessonId: Scalars['ObjectId'];
  examId: Scalars['ObjectId'];
}>;


export type DeleteExamMutation = (
  { __typename?: 'Mutation' }
  & { deleteExam: (
    { __typename?: 'RemoveResult' }
    & RemoveResultFragment
  ) }
);

export type GradeFragment = (
  { __typename?: 'Grade' }
  & Pick<Grade, '_id' | 'studentId' | 'grade'>
);

export type SetExamGradeMutationVariables = Exact<{
  lessonId: Scalars['ObjectId'];
  examId: Scalars['ObjectId'];
  studentId: Scalars['ObjectId'];
  grade: Scalars['Int'];
}>;


export type SetExamGradeMutation = (
  { __typename?: 'Mutation' }
  & { setExamGrade: (
    { __typename?: 'Grade' }
    & GradeFragment
  ) }
);

export type HomeWorkFragment = (
  { __typename?: 'HomeWork' }
  & Pick<HomeWork, '_id' | 'message' | 'lessonId' | 'title' | 'sent' | 'file'>
);

export type HomeWorksQueryVariables = Exact<{
  lessonId: Scalars['ID'];
  skip?: Maybe<Scalars['Int']>;
  i?: Maybe<Scalars['ID']>;
}>;


export type HomeWorksQuery = (
  { __typename?: 'Query' }
  & { homeWorks: Array<(
    { __typename?: 'HomeWork' }
    & HomeWorkFragment
  )> }
);

export type HomeWorksStudentQueryVariables = Exact<{
  lessonId: Scalars['ID'];
  skip?: Maybe<Scalars['Int']>;
}>;


export type HomeWorksStudentQuery = (
  { __typename?: 'Query' }
  & { homeWorks: Array<(
    { __typename?: 'HomeWork' }
    & HomeWorkFragment
  )> }
);

export type SendHomeWorkMutationVariables = Exact<{
  lessonId: Scalars['ObjectId'];
  message: Scalars['String'];
  title: Scalars['String'];
  homeWorkFile?: Maybe<Scalars['Upload']>;
}>;


export type SendHomeWorkMutation = (
  { __typename?: 'Mutation' }
  & { sendHomeWork: (
    { __typename?: 'HomeWork' }
    & HomeWorkFragment
  ) }
);

export type HourFragment = (
  { __typename?: 'Hour' }
  & Pick<Hour, '_id' | 'code' | 'start' | 'finish'>
);

export type MyHourQueryVariables = Exact<{
  parentStudentId?: Maybe<Scalars['ObjectId']>;
}>;


export type MyHourQuery = (
  { __typename?: 'Query' }
  & { myHour: Array<(
    { __typename?: 'Hour' }
    & HourFragment
  )> }
);

export type IlsQueryVariables = Exact<{
  query: Scalars['String'];
}>;


export type IlsQuery = (
  { __typename?: 'Query' }
  & { ils: Array<(
    { __typename?: 'Il' }
    & Pick<Il, '_id' | 'il' | 'ilceleri'>
  )> }
);

export type InboxFragment = (
  { __typename?: 'Inbox' }
  & Pick<Inbox, '_id' | 'lastMessage' | 'createdAt' | 'updatedAt' | 'unReadCount'>
  & { users: Array<(
    { __typename?: 'Person' }
    & Pick<Person, '_id' | 'firstName' | 'lastName' | 'fullName' | 'kind'>
  )> }
);

export type InboxsQueryVariables = Exact<{
  skip: Scalars['Int'];
}>;


export type InboxsQuery = (
  { __typename?: 'Query' }
  & { inboxs: Array<(
    { __typename?: 'Inbox' }
    & InboxFragment
  )> }
);

export type InboxQueryVariables = Exact<{
  inboxId?: Maybe<Scalars['ObjectId']>;
  to?: Maybe<Array<Scalars['ObjectId']>>;
}>;


export type InboxQuery = (
  { __typename?: 'Query' }
  & { inbox: (
    { __typename?: 'Inbox' }
    & InboxFragment
  ) }
);

export type UnReadMessageCountQueryVariables = Exact<{ [key: string]: never; }>;


export type UnReadMessageCountQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'unReadMessageCount'>
);

export type LessonFragment = (
  { __typename?: 'Lesson' }
  & Pick<Lesson, '_id' | 'lessonId' | 'educationYearId' | 'name' | 'lessonName' | 'weeklyHour' | 'createdAt' | 'teacherId'>
  & { lessonWeeklySchedules: Array<(
    { __typename?: 'WeeklySchedule' }
    & WeeklyScheduleFragment
  )>, teacher?: Maybe<(
    { __typename?: 'Person' }
    & Pick<Person, '_id' | 'firstName' | 'lastName' | 'fullName'>
  )> }
);

export type WeeklyScheduleFragment = (
  { __typename?: 'WeeklySchedule' }
  & Pick<WeeklySchedule, '_id' | 'day' | 'hourCode'>
);

export type LessonsQueryVariables = Exact<{
  schoolId: Scalars['ObjectId'];
  classId: Scalars['ObjectId'];
  educationYearId: Scalars['ObjectId'];
}>;


export type LessonsQuery = (
  { __typename?: 'Query' }
  & { lessons: Array<(
    { __typename?: 'Lesson' }
    & LessonFragment
  )> }
);

export type MyLessonsStudentQueryVariables = Exact<{
  parentStudentId?: Maybe<Scalars['ObjectId']>;
}>;


export type MyLessonsStudentQuery = (
  { __typename?: 'Query' }
  & { studentMyLessons: Array<(
    { __typename?: 'Lesson' }
    & LessonFragment
  )> }
);

export type GetLessonQueryVariables = Exact<{
  lessonId: Scalars['ObjectId'];
}>;


export type GetLessonQuery = (
  { __typename?: 'Query' }
  & { getLesson: (
    { __typename?: 'Lesson' }
    & Pick<Lesson, '_id'>
    & LessonFragment
  ) }
);

export type AddLessonMutationVariables = Exact<{
  _id?: Maybe<Scalars['ObjectId']>;
  lessonId?: Maybe<Scalars['ObjectId']>;
  schoolId: Scalars['ObjectId'];
  classId: Scalars['ObjectId'];
  name?: Maybe<Scalars['String']>;
  weeklyHour: Scalars['Int'];
  teacherId?: Maybe<Scalars['ObjectId']>;
}>;


export type AddLessonMutation = (
  { __typename?: 'Mutation' }
  & { addLesson: (
    { __typename?: 'Lesson' }
    & LessonFragment
  ) }
);

export type RemoveLessonMutationVariables = Exact<{
  lessonId: Scalars['ObjectId'];
}>;


export type RemoveLessonMutation = (
  { __typename?: 'Mutation' }
  & { removeLesson: (
    { __typename?: 'RemoveResult' }
    & RemoveResultFragment
  ) }
);

export type SetLessonScheduleMutationVariables = Exact<{
  lessonId: Scalars['ObjectId'];
  day: Scalars['Int'];
  hourCode: Scalars['Int'];
}>;


export type SetLessonScheduleMutation = (
  { __typename?: 'Mutation' }
  & { setLessonSchedule: (
    { __typename?: 'Lesson' }
    & LessonFragment
  ) }
);

export type RemoveScheduleToLessonMutationVariables = Exact<{
  lessonId: Scalars['ObjectId'];
  scheduleId: Scalars['ObjectId'];
}>;


export type RemoveScheduleToLessonMutation = (
  { __typename?: 'Mutation' }
  & { removeScheduleToLesson: (
    { __typename?: 'Lesson' }
    & LessonFragment
  ) }
);

export type LessonGFragment = (
  { __typename?: 'LessonG' }
  & Pick<LessonG, '_id' | 'name'>
  & { teacherFields: Array<(
    { __typename?: 'TeacherField' }
    & TeacherFieldFragment
  )> }
);

export type LessonsGQueryVariables = Exact<{ [key: string]: never; }>;


export type LessonsGQuery = (
  { __typename?: 'Query' }
  & { lessonsG: Array<(
    { __typename?: 'LessonG' }
    & LessonGFragment
  )> }
);

export type CreateLessonGMutationVariables = Exact<{
  name: Scalars['String'];
  teacherFieldIds: Array<Scalars['ObjectId']>;
}>;


export type CreateLessonGMutation = (
  { __typename?: 'Mutation' }
  & { createLessonG: (
    { __typename?: 'LessonG' }
    & LessonGFragment
  ) }
);

export type EditLessonGMutationVariables = Exact<{
  name?: Maybe<Scalars['String']>;
  _id: Scalars['ObjectId'];
  teacherFieldIds: Array<Scalars['ObjectId']>;
}>;


export type EditLessonGMutation = (
  { __typename?: 'Mutation' }
  & { editLessonG: (
    { __typename?: 'LessonG' }
    & LessonGFragment
  ) }
);

export type RemoveLessonGMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type RemoveLessonGMutation = (
  { __typename?: 'Mutation' }
  & { removeLessonG: (
    { __typename?: 'RemoveResult' }
    & RemoveResultFragment
  ) }
);

export type AddTeacherFieldsToLessonMutationVariables = Exact<{
  ids: Array<Scalars['ObjectId']>;
  _id: Scalars['ObjectId'];
}>;


export type AddTeacherFieldsToLessonMutation = (
  { __typename?: 'Mutation' }
  & { addTeacherFieldsToLesson: (
    { __typename?: 'LessonG' }
    & LessonGFragment
  ) }
);

export type LessonInboxFragment = (
  { __typename?: 'LessonInbox' }
  & Pick<LessonInbox, '_id' | 'message' | 'title' | 'lessonId' | 'sent' | 'teacherId' | 'messageType'>
);

export type LessonMesagesQueryVariables = Exact<{
  lessonId: Scalars['ObjectId'];
  skip?: Maybe<Scalars['Int']>;
  parentStudentId?: Maybe<Scalars['ObjectId']>;
}>;


export type LessonMesagesQuery = (
  { __typename?: 'Query' }
  & { lessonMessages: Array<(
    { __typename?: 'LessonInbox' }
    & LessonInboxFragment
  )> }
);

export type SendLessonMessageMutationVariables = Exact<{
  lessonId: Scalars['ObjectId'];
  message: Scalars['String'];
  title: Scalars['String'];
  messageType: LessonMessageType;
}>;


export type SendLessonMessageMutation = (
  { __typename?: 'Mutation' }
  & { sendLessonMessage: (
    { __typename?: 'LessonInbox' }
    & LessonInboxFragment
  ) }
);

export type MessageFragment = (
  { __typename?: 'Message' }
  & Pick<Message, '_id' | 'message' | 'inboxId' | 'ownerId' | 'idOfUnReaders' | 'sent'>
  & { owner?: Maybe<(
    { __typename?: 'Person' }
    & Pick<Person, '_id' | 'firstName' | 'lastName' | 'fullName' | 'kind'>
  )> }
);

export type MessagesQueryVariables = Exact<{
  inboxId: Scalars['ObjectId'];
  skip: Scalars['Int'];
}>;


export type MessagesQuery = (
  { __typename?: 'Query' }
  & { messages: Array<(
    { __typename?: 'Message' }
    & MessageFragment
  )> }
);

export type SendMessageMutationVariables = Exact<{
  message: Scalars['String'];
  to: Array<Scalars['ObjectId']>;
}>;


export type SendMessageMutation = (
  { __typename?: 'Mutation' }
  & { sendMessage: (
    { __typename?: 'Message' }
    & MessageFragment
  ) }
);

export type MessageReadMutationVariables = Exact<{
  messageId: Scalars['ObjectId'];
}>;


export type MessageReadMutation = (
  { __typename?: 'Mutation' }
  & { messageRead: (
    { __typename?: 'Result' }
    & Pick<Result, 'success'>
  ) }
);

export type InboxNotificationSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type InboxNotificationSubscription = (
  { __typename?: 'Subscription' }
  & { inboxNotification: (
    { __typename?: 'Message' }
    & MessageFragment
  ) }
);

export type NotificationFragment = (
  { __typename?: 'Notification' }
  & Pick<Notification, '_id' | 'lessonId' | 'state' | 'notificationType' | 'action' | 'createdAt' | 'targetId' | 'message' | 'lessonName'>
);

export type StudentNotificationsQueryVariables = Exact<{
  skip?: Maybe<Scalars['Int']>;
  parentStudentId?: Maybe<Scalars['ObjectId']>;
}>;


export type StudentNotificationsQuery = (
  { __typename?: 'Query' }
  & { studentNotifications: Array<(
    { __typename?: 'Notification' }
    & NotificationFragment
  )> }
);

export type StudentNotificationsStatusUpdateMutationVariables = Exact<{
  state: StudentNotificationState;
  ids: Array<Scalars['ObjectId']>;
}>;


export type StudentNotificationsStatusUpdateMutation = (
  { __typename?: 'Mutation' }
  & { studentNotificationsStatusUpdate: (
    { __typename?: 'UpdateResults' }
    & UpdateResultsFragment
  ) }
);

export type StudentNotificationUpdatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type StudentNotificationUpdatedSubscription = (
  { __typename?: 'Subscription' }
  & { studentNotificationUpdated: (
    { __typename?: 'Notification' }
    & NotificationFragment
  ) }
);

export type ParentStudentFragment = (
  { __typename?: 'ParentStudent' }
  & Pick<ParentStudent, '_id' | 'studentId' | 'institutionId' | 'parentType'>
);

export type MyChildrenQueryVariables = Exact<{ [key: string]: never; }>;


export type MyChildrenQuery = (
  { __typename?: 'Query' }
  & { myChildren: Array<(
    { __typename?: 'Person' }
    & PersonFragment
  )> }
);

export type ParentsQueryVariables = Exact<{
  studentId: Scalars['ObjectId'];
}>;


export type ParentsQuery = (
  { __typename?: 'Query' }
  & { studentParents: Array<(
    { __typename?: 'User' }
    & UserFragment
  )> }
);

export type RemoveParentMutationVariables = Exact<{
  studentId: Scalars['ObjectId'];
  parentId: Scalars['ObjectId'];
}>;


export type RemoveParentMutation = (
  { __typename?: 'Mutation' }
  & { removeParent: (
    { __typename?: 'RemoveResult' }
    & RemoveResultFragment
  ) }
);

export type ParentApplicationFragment = (
  { __typename?: 'ParentApplication' }
  & Pick<ParentApplication, '_id' | 'studentId' | 'userFullName' | 'userId' | 'email' | 'status' | 'studentFullName' | 'institutionName'>
);

export type MyParentApplicationsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyParentApplicationsQuery = (
  { __typename?: 'Query' }
  & { myParentApplications: Array<(
    { __typename?: 'ParentApplication' }
    & ParentApplicationFragment
  )> }
);

export type ParentApplicationsQueryVariables = Exact<{
  studentId: Scalars['ObjectId'];
}>;


export type ParentApplicationsQuery = (
  { __typename?: 'Query' }
  & { parentApplications: Array<(
    { __typename?: 'ParentApplication' }
    & ParentApplicationFragment
  )> }
);

export type InvitationParentMutationVariables = Exact<{
  studentId: Scalars['ObjectId'];
  email: Scalars['String'];
}>;


export type InvitationParentMutation = (
  { __typename?: 'Mutation' }
  & { invitationParent: (
    { __typename?: 'ParentApplication' }
    & ParentApplicationFragment
  ) }
);

export type PointFragment = (
  { __typename?: 'Point' }
  & Pick<Point, 'coordinates'>
);

export type CoordinatesTypeFragment = (
  { __typename?: 'CoordinatesType' }
  & Pick<CoordinatesType, 'accuracy' | 'altitude' | 'altitudeAccuracy' | 'heading' | 'speed'>
  & { point: (
    { __typename?: 'Point' }
    & PointFragment
  ) }
);

export type PositionTypeFragment = (
  { __typename?: 'PositionType' }
  & Pick<PositionType, 'timestamp'>
  & { coords: (
    { __typename?: 'CoordinatesType' }
    & CoordinatesTypeFragment
  ) }
);

export type PositionNotificationSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type PositionNotificationSubscription = (
  { __typename?: 'Subscription' }
  & { positionNotification: (
    { __typename?: 'PositionType' }
    & PositionTypeFragment
  ) }
);

export type RemoveResultFragment = (
  { __typename?: 'RemoveResult' }
  & Pick<RemoveResult, 'code' | 'success' | '_id'>
);

export type SchoolFragment = (
  { __typename?: 'School' }
  & Pick<School, '_id' | 'eOkulCode' | 'name' | 'schoolKindId' | 'schoolKindName' | 'studentCount'>
  & { headMaster?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, '_id'>
  )>, weeklyHour?: Maybe<(
    { __typename?: 'WeeklyHour' }
    & WeeklyHourFragment
  )>, educationYears: Array<(
    { __typename?: 'EducationYear' }
    & EducationYearFragment
  )>, classes: Array<(
    { __typename?: 'ClassType' }
    & ClassTypeFragment
  )>, address?: Maybe<(
    { __typename?: 'AddressLocation' }
    & Pick<AddressLocation, 'coordinates'>
  )> }
);

export type SchoolsQueryVariables = Exact<{
  institutionId?: Maybe<Scalars['ObjectId']>;
}>;


export type SchoolsQuery = (
  { __typename?: 'Query' }
  & { schools: Array<(
    { __typename?: 'School' }
    & SchoolFragment
  )> }
);

export type CreateSchoolMutationVariables = Exact<{
  _id?: Maybe<Scalars['ObjectId']>;
  name: Scalars['String'];
  eOkulCode?: Maybe<Scalars['String']>;
  schoolKindId?: Maybe<Scalars['ObjectId']>;
}>;


export type CreateSchoolMutation = (
  { __typename?: 'Mutation' }
  & { createSchool: (
    { __typename?: 'School' }
    & SchoolFragment
  ) }
);

export type SchoolQueryVariables = Exact<{
  id: Scalars['ObjectId'];
}>;


export type SchoolQuery = (
  { __typename?: 'Query' }
  & { school: (
    { __typename?: 'School' }
    & SchoolFragment
  ) }
);

export type SchoolsClassesNameQueryVariables = Exact<{
  institutionId?: Maybe<Scalars['ObjectId']>;
}>;


export type SchoolsClassesNameQuery = (
  { __typename?: 'Query' }
  & { schools: Array<(
    { __typename?: 'School' }
    & Pick<School, '_id' | 'name'>
    & { classes: Array<(
      { __typename?: 'ClassType' }
      & Pick<ClassType, '_id' | 'level' | 'code' | 'code1' | 'name'>
    )> }
  )> }
);

export type SchoolsTeachersQueryVariables = Exact<{ [key: string]: never; }>;


export type SchoolsTeachersQuery = (
  { __typename?: 'Query' }
  & { schools: Array<(
    { __typename?: 'School' }
    & Pick<School, '_id'>
    & { classes: Array<(
      { __typename?: 'ClassType' }
      & Pick<ClassType, '_id'>
      & { classroomTeacher?: Maybe<(
        { __typename?: 'User' }
        & Pick<User, '_id' | 'firstName' | 'lastName' | 'fullName'>
      )> }
    )> }
  )> }
);

export type SchoolsClassesSchoolKindQueryVariables = Exact<{ [key: string]: never; }>;


export type SchoolsClassesSchoolKindQuery = (
  { __typename?: 'Query' }
  & { schools: Array<(
    { __typename?: 'School' }
    & Pick<School, '_id' | 'name' | 'schoolKindId' | 'schoolKindName'>
    & { classes: Array<(
      { __typename?: 'ClassType' }
      & Pick<ClassType, '_id' | 'name' | 'level' | 'code' | 'code1'>
    )> }
  )> }
);

export type MyLessonsQueryVariables = Exact<{
  week?: Maybe<Scalars['Int']>;
  classes?: Maybe<Array<Scalars['ObjectId']>>;
  notMine?: Maybe<Scalars['Boolean']>;
  teacherId?: Maybe<Scalars['ObjectId']>;
}>;


export type MyLessonsQuery = (
  { __typename?: 'Query' }
  & { schools: Array<(
    { __typename?: 'School' }
    & Pick<School, '_id' | 'name'>
    & { educationYears: Array<(
      { __typename?: 'EducationYear' }
      & EducationYearFragment
    )>, weeklyHour?: Maybe<(
      { __typename?: 'WeeklyHour' }
      & WeeklyHourFragment
    )>, classes: Array<(
      { __typename?: 'ClassType' }
      & Pick<ClassType, '_id' | 'code' | 'name' | 'level' | 'code1' | 'fullName'>
      & { lessons: Array<(
        { __typename?: 'Lesson' }
        & LessonFragment
      )> }
    )> }
  )> }
);

export type SchoolGFragment = (
  { __typename?: 'SchoolG' }
  & Pick<SchoolG, '_id' | 'name'>
  & { classes: Array<(
    { __typename?: 'ClassG' }
    & ClassGFragment
  )> }
);

export type SchoolGQueryVariables = Exact<{
  id: Scalars['ObjectId'];
}>;


export type SchoolGQuery = (
  { __typename?: 'Query' }
  & { schoolG: (
    { __typename?: 'SchoolG' }
    & SchoolGFragment
  ) }
);

export type SchoolsGQueryVariables = Exact<{ [key: string]: never; }>;


export type SchoolsGQuery = (
  { __typename?: 'Query' }
  & { schoolsG: Array<(
    { __typename?: 'SchoolG' }
    & SchoolGFragment
  )> }
);

export type SchoolGClassesQueryVariables = Exact<{
  id: Scalars['ObjectId'];
}>;


export type SchoolGClassesQuery = (
  { __typename?: 'Query' }
  & { schoolG: (
    { __typename?: 'SchoolG' }
    & SchoolGFragment
  ) }
);

export type CreateSchoolGMutationVariables = Exact<{
  name: Scalars['String'];
  classes: Array<ClassesGInput>;
}>;


export type CreateSchoolGMutation = (
  { __typename?: 'Mutation' }
  & { createSchoolG: (
    { __typename?: 'SchoolG' }
    & SchoolGFragment
  ) }
);

export type StudentFragment = (
  { __typename?: 'Student' }
  & Pick<Student, '_id' | 'firstName' | 'lastName' | 'school' | 'class' | 'fullName' | 'username' | 'schoolNo' | 'profilePhoto' | 'citizenshipId' | 'schoolName' | 'className' | 'foreignLanguage'>
);

export type ActiveStudentQueryVariables = Exact<{ [key: string]: never; }>;


export type ActiveStudentQuery = (
  { __typename?: 'Query' }
  & { activeStudent: (
    { __typename?: 'Person' }
    & PersonFragment
  ) }
);

export type StudentQueryVariables = Exact<{
  studentId?: Maybe<Scalars['ObjectId']>;
  citizenshipId?: Maybe<Scalars['String']>;
}>;


export type StudentQuery = (
  { __typename?: 'Query' }
  & { student: (
    { __typename?: 'Student' }
    & StudentFragment
  ) }
);

export type StudentsQueryVariables = Exact<{
  schoolId?: Maybe<Scalars['ObjectId']>;
  classId?: Maybe<Scalars['ObjectId']>;
  notClass?: Maybe<Scalars['Boolean']>;
  studentIds?: Maybe<Array<Scalars['ObjectId']>>;
  search?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['Int']>;
}>;


export type StudentsQuery = (
  { __typename?: 'Query' }
  & { students: Array<(
    { __typename?: 'Student' }
    & StudentFragment
  )> }
);

export type StudentCountQueryVariables = Exact<{
  schoolId?: Maybe<Scalars['ObjectId']>;
  classId?: Maybe<Scalars['ObjectId']>;
}>;


export type StudentCountQuery = (
  { __typename?: 'Query' }
  & { studentCount: (
    { __typename?: 'StudentCount' }
    & Pick<StudentCount, 'studentCount'>
  ) }
);

export type TransferStudentsMutationVariables = Exact<{
  schoolId: Scalars['ObjectId'];
  classId?: Maybe<Scalars['ObjectId']>;
  students: Array<Scalars['ObjectId']>;
}>;


export type TransferStudentsMutation = (
  { __typename?: 'Mutation' }
  & { transferStudents: (
    { __typename?: 'UpdateResult' }
    & Pick<UpdateResult, 'code' | 'success'>
  ) }
);

export type EditStudentCitizenshipIdMutationVariables = Exact<{
  studentId: Scalars['ObjectId'];
  citizenshipId: Scalars['String'];
}>;


export type EditStudentCitizenshipIdMutation = (
  { __typename?: 'Mutation' }
  & { editStudentCitizenshipId: (
    { __typename?: 'RemoveResult' }
    & Pick<RemoveResult, 'success'>
  ) }
);

export type AddStudentMutationVariables = Exact<{
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  citizenshipId: Scalars['String'];
  school?: Maybe<Scalars['ObjectId']>;
  class?: Maybe<Scalars['ObjectId']>;
  profilePhotoBase64?: Maybe<Scalars['String']>;
  schoolNo?: Maybe<Scalars['String']>;
}>;


export type AddStudentMutation = (
  { __typename?: 'Mutation' }
  & { addStudent: (
    { __typename?: 'Student' }
    & StudentFragment
  ) }
);

export type DismissStudentMutationVariables = Exact<{
  studentId: Scalars['ObjectId'];
  level: Scalars['Int'];
}>;


export type DismissStudentMutation = (
  { __typename?: 'Mutation' }
  & { dismissStudent: (
    { __typename?: 'RemoveResult' }
    & RemoveResultFragment
  ) }
);

export type DeleteSchoolMutationVariables = Exact<{
  schoolId: Scalars['ObjectId'];
}>;


export type DeleteSchoolMutation = (
  { __typename?: 'Mutation' }
  & { deleteSchool: (
    { __typename?: 'RemoveResult' }
    & RemoveResultFragment
  ) }
);

export type StudentResetPasswordMutationVariables = Exact<{
  studentId: Scalars['ObjectId'];
}>;


export type StudentResetPasswordMutation = (
  { __typename?: 'Mutation' }
  & { resetStudentPassword: (
    { __typename?: 'StudentPassword' }
    & Pick<StudentPassword, 'password'>
  ) }
);

export type StudentSignInMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type StudentSignInMutation = (
  { __typename?: 'Mutation' }
  & { studentSignIn: (
    { __typename?: 'LoginToken' }
    & Pick<LoginToken, 'token'>
  ) }
);

export type StudentVoyegeInfoFragment = (
  { __typename?: 'StudentVoyegeInfo' }
  & Pick<StudentVoyegeInfo, '_id' | 'studentId' | 'status' | 'order' | 'disabled'>
  & { student?: Maybe<(
    { __typename?: 'Student' }
    & { address: (
      { __typename?: 'Address' }
      & AddressFragment
    ) }
    & StudentFragment
  )> }
);

export type StudyFragment = (
  { __typename?: 'Study' }
  & Pick<Study, '_id' | 'date' | 'subject' | 'detail' | 'dateTimeSpan' | 'public' | 'capacity' | 'permissionClasses' | 'duration' | 'lessonName'>
  & { students: Array<(
    { __typename?: 'StudyStudent' }
    & Pick<StudyStudent, '_id' | 'status' | 'studentId' | 'state'>
    & { student?: Maybe<(
      { __typename?: 'Person' }
      & Pick<Person, '_id' | 'firstName' | 'lastName' | 'fullName' | 'profilePhoto'>
    )> }
  )> }
);

export type StudiesQueryVariables = Exact<{
  week?: Maybe<Scalars['Int']>;
  query?: Maybe<StudyQuery>;
  teacherId?: Maybe<Scalars['ObjectId']>;
}>;


export type StudiesQuery = (
  { __typename?: 'Query' }
  & { studies: Array<(
    { __typename?: 'Study' }
    & StudyFragment
  )> }
);

export type CreateStudyMutationVariables = Exact<{
  lessonId?: Maybe<Scalars['ObjectId']>;
  date: Scalars['DateTime'];
  duration: Scalars['Int'];
  subject: Scalars['String'];
  detail?: Maybe<Scalars['String']>;
  public?: Maybe<Scalars['Boolean']>;
  capacity?: Maybe<Scalars['Int']>;
  permissionClasses?: Maybe<Array<Scalars['ObjectId']>>;
}>;


export type CreateStudyMutation = (
  { __typename?: 'Mutation' }
  & { createStudy: (
    { __typename?: 'Study' }
    & StudyFragment
  ) }
);

export type DeleteStudyMutationVariables = Exact<{
  studyId: Scalars['ObjectId'];
}>;


export type DeleteStudyMutation = (
  { __typename?: 'Mutation' }
  & { deleteStudy: (
    { __typename?: 'RemoveResult' }
    & RemoveResultFragment
  ) }
);

export type JoinStudyMutationVariables = Exact<{
  studyId: Scalars['ObjectId'];
  r?: Maybe<Scalars['Boolean']>;
}>;


export type JoinStudyMutation = (
  { __typename?: 'Mutation' }
  & { joinStudy: (
    { __typename?: 'Study' }
    & StudyFragment
  ) }
);

export type AcceptJoinStudyMutationVariables = Exact<{
  studentId: Scalars['ObjectId'];
  studyId: Scalars['ObjectId'];
  r?: Maybe<Scalars['Boolean']>;
  status?: Maybe<StudyStudentStatus>;
}>;


export type AcceptJoinStudyMutation = (
  { __typename?: 'Mutation' }
  & { acceptJoinStudy: (
    { __typename?: 'Study' }
    & StudyFragment
  ) }
);

export type UpdateStudyMutationVariables = Exact<{
  studyId: Scalars['ObjectId'];
  studyStudentId: Scalars['ObjectId'];
}>;


export type UpdateStudyMutation = (
  { __typename?: 'Mutation' }
  & { updateStudyState: (
    { __typename?: 'Study' }
    & StudyFragment
  ) }
);

export type TeacherFragment = (
  { __typename?: 'Teacher' }
  & Pick<Teacher, '_id' | 'institutionId' | 'schoolIds' | 'allSchool' | 'addedById'>
);

export type TeachersFullnameQueryVariables = Exact<{ [key: string]: never; }>;


export type TeachersFullnameQuery = (
  { __typename?: 'Query' }
  & { teachers: Array<(
    { __typename?: 'User' }
    & Pick<User, '_id' | 'firstName' | 'lastName' | 'fullName'>
  )> }
);

export type DismissTeacherMutationVariables = Exact<{
  teacherId: Scalars['ObjectId'];
}>;


export type DismissTeacherMutation = (
  { __typename?: 'Mutation' }
  & { dismissTeacher: (
    { __typename?: 'RemoveResult' }
    & RemoveResultFragment
  ) }
);

export type TeacherApplicationFragment = (
  { __typename?: 'TeacherApplication' }
  & Pick<TeacherApplication, '_id' | 'email' | 'institutionId' | 'institutionName' | 'userId' | 'userFullName' | 'status' | 'createdAt'>
);

export type JobRequestQueryVariables = Exact<{ [key: string]: never; }>;


export type JobRequestQuery = (
  { __typename?: 'Query' }
  & { jobRequests: Array<(
    { __typename?: 'TeacherApplication' }
    & TeacherApplicationFragment
  )> }
);

export type TeacherApplicationsQueryVariables = Exact<{ [key: string]: never; }>;


export type TeacherApplicationsQuery = (
  { __typename?: 'Query' }
  & { teacherApplications: Array<(
    { __typename?: 'TeacherApplication' }
    & TeacherApplicationFragment
  )> }
);

export type InvitationTeachersMutationVariables = Exact<{
  emails: Array<Scalars['String']>;
}>;


export type InvitationTeachersMutation = (
  { __typename?: 'Mutation' }
  & { invitationTeachers: Array<(
    { __typename?: 'TeacherApplication' }
    & TeacherApplicationFragment
  )> }
);

export type DeleteInvitationMutationVariables = Exact<{
  applicationId: Scalars['ObjectId'];
}>;


export type DeleteInvitationMutation = (
  { __typename?: 'Mutation' }
  & { deleteInvitation: (
    { __typename?: 'TeacherApplication' }
    & Pick<TeacherApplication, '_id'>
  ) }
);

export type ReSendInvitationMutationVariables = Exact<{
  applicationId: Scalars['ObjectId'];
}>;


export type ReSendInvitationMutation = (
  { __typename?: 'Mutation' }
  & { reSendInvitation: (
    { __typename?: 'Result' }
    & Pick<Result, 'success'>
  ) }
);

export type TeacherFieldFragment = (
  { __typename?: 'TeacherField' }
  & Pick<TeacherField, '_id' | 'name'>
  & { departments: Array<(
    { __typename?: 'Department' }
    & DeapartmentFragment
  )> }
);

export type TeacherFieldsQueryVariables = Exact<{ [key: string]: never; }>;


export type TeacherFieldsQuery = (
  { __typename?: 'Query' }
  & { teacherFields: Array<(
    { __typename?: 'TeacherField' }
    & TeacherFieldFragment
  )> }
);

export type RemoveTeacherFieldMutationVariables = Exact<{
  _id: Scalars['ObjectId'];
}>;


export type RemoveTeacherFieldMutation = (
  { __typename?: 'Mutation' }
  & { removeTeacherField: (
    { __typename?: 'RemoveResult' }
    & RemoveResultFragment
  ) }
);

export type EditTeacherFieldMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type EditTeacherFieldMutation = (
  { __typename?: 'Mutation' }
  & { editTeacherField: (
    { __typename?: 'TeacherField' }
    & TeacherFieldFragment
  ) }
);

export type TermFragment = (
  { __typename?: 'Term' }
  & Pick<Term, '_id' | 'name' | 'start' | 'finish'>
);

export type UniversityFragment = (
  { __typename?: 'University' }
  & Pick<University, '_id' | 'name' | 'universityLogoUrl'>
);

export type UniversitiesQueryVariables = Exact<{ [key: string]: never; }>;


export type UniversitiesQuery = (
  { __typename?: 'Query' }
  & { universities: Array<(
    { __typename?: 'University' }
    & UniversityFragment
  )> }
);

export type EditUniversityMutationVariables = Exact<{
  _id?: Maybe<Scalars['ObjectId']>;
  name: Scalars['String'];
  universityLogoFile?: Maybe<Scalars['Upload']>;
}>;


export type EditUniversityMutation = (
  { __typename?: 'Mutation' }
  & { editUniversity: (
    { __typename?: 'University' }
    & UniversityFragment
  ) }
);

export type UpdateResultsFragment = (
  { __typename?: 'UpdateResults' }
  & Pick<UpdateResults, 'code' | 'success' | '_ids'>
);

export type PersonNamePartFragment = (
  { __typename?: 'Person' }
  & Pick<Person, '_id' | 'firstName' | 'lastName' | 'fullName'>
);

export type PersonFragment = (
  { __typename?: 'Person' }
  & Pick<Person, 'email' | 'unVerifiedEmail' | 'createdAt' | 'fullName' | 'kind' | 'profilePhoto' | 'roles' | 'phone' | 'birthDate'>
  & { address?: Maybe<(
    { __typename?: 'Address' }
    & AddressFragment
  )> }
  & PersonNamePartFragment
);

export type UserNamePartFragment = (
  { __typename?: 'User' }
  & Pick<User, '_id' | 'firstName' | 'lastName' | 'fullName' | 'email'>
);

export type UserFragment = (
  { __typename?: 'User' }
  & Pick<User, '_id' | 'phone' | 'citizenshipId' | 'createdAt' | 'birthDate' | 'kind'>
  & { driver?: Maybe<(
    { __typename?: 'Driver' }
    & DriverFragment
  )>, parentStudents: Array<(
    { __typename?: 'ParentStudent' }
    & ParentStudentFragment
  )>, teacher?: Maybe<(
    { __typename?: 'Teacher' }
    & TeacherFragment
  )>, address?: Maybe<(
    { __typename?: 'Address' }
    & AddressFragment
  )> }
  & UserNamePartFragment
);

export type PersonQueryVariables = Exact<{
  personId: Scalars['ObjectId'];
}>;


export type PersonQuery = (
  { __typename?: 'Query' }
  & { person: (
    { __typename?: 'Person' }
    & PersonFragment
  ) }
);

export type ActiveUserQueryVariables = Exact<{ [key: string]: never; }>;


export type ActiveUserQuery = (
  { __typename?: 'Query' }
  & { activeUser: (
    { __typename?: 'Person' }
    & PersonFragment
  ) }
);

export type SiginUserMutationVariables = Exact<{
  password: Scalars['String'];
  email: Scalars['String'];
}>;


export type SiginUserMutation = (
  { __typename?: 'Mutation' }
  & { signIn: (
    { __typename?: 'LoginToken' }
    & Pick<LoginToken, 'token'>
  ) }
);

export type UserQueryVariables = Exact<{
  userId: Scalars['ObjectId'];
}>;


export type UserQuery = (
  { __typename?: 'Query' }
  & { user: (
    { __typename?: 'User' }
    & UserFragment
  ) }
);

export type FindUserQueryVariables = Exact<{
  search: Scalars['String'];
}>;


export type FindUserQuery = (
  { __typename?: 'Query' }
  & { findUser: Array<(
    { __typename?: 'User' }
    & UserFragment
  )> }
);

export type TeachersQueryVariables = Exact<{ [key: string]: never; }>;


export type TeachersQuery = (
  { __typename?: 'Query' }
  & { teachers: Array<(
    { __typename?: 'User' }
    & Pick<User, '_id' | 'firstName' | 'lastName' | 'fullName'>
    & { educations: Array<(
      { __typename?: 'Education' }
      & Pick<Education, 'departmentId'>
      & { department?: Maybe<(
        { __typename?: 'Department' }
        & Pick<Department, '_id' | 'name'>
      )> }
    )> }
  )> }
);

export type AddTeacherMutationVariables = Exact<{
  applicationId: Scalars['ObjectId'];
}>;


export type AddTeacherMutation = (
  { __typename?: 'Mutation' }
  & { addTeacher: (
    { __typename?: 'User' }
    & UserFragment
  ) }
);

export type EditUserMutationVariables = Exact<{
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  phone?: Maybe<Scalars['String']>;
  address?: Maybe<AddressInput>;
  birthDate?: Maybe<Scalars['DateTime']>;
}>;


export type EditUserMutation = (
  { __typename?: 'Mutation' }
  & { editUser: (
    { __typename?: 'User' }
    & UserFragment
  ) }
);

export type AddParentMutationVariables = Exact<{
  applicationId: Scalars['ObjectId'];
}>;


export type AddParentMutation = (
  { __typename?: 'Mutation' }
  & { addParent: (
    { __typename?: 'User' }
    & UserFragment
  ) }
);

export type UserChangePhotoMutationVariables = Exact<{
  profilePhotoBase64: Scalars['String'];
}>;


export type UserChangePhotoMutation = (
  { __typename?: 'Mutation' }
  & { changeUserPhoto: (
    { __typename?: 'Result' }
    & Pick<Result, 'success'>
  ) }
);

export type ResetPasswordMutationVariables = Exact<{
  token: Scalars['String'];
  _id: Scalars['ObjectId'];
  password?: Maybe<Scalars['String']>;
}>;


export type ResetPasswordMutation = (
  { __typename?: 'Mutation' }
  & { resetPassword: (
    { __typename?: 'Result' }
    & Pick<Result, 'success'>
  ) }
);

export type ReSendConfirmEmailMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type ReSendConfirmEmailMutation = (
  { __typename?: 'Mutation' }
  & { reSendConfirmEmail: (
    { __typename?: 'Result' }
    & Pick<Result, 'success'>
  ) }
);

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & { forgotPassword: (
    { __typename?: 'Result' }
    & Pick<Result, 'success'>
  ) }
);

export type ChangePasswordMutationVariables = Exact<{
  password: Scalars['String'];
  rePassword: Scalars['String'];
}>;


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & { changePassword: (
    { __typename?: 'Result' }
    & Pick<Result, 'success'>
  ) }
);

export type ConfirmEmailMutationVariables = Exact<{
  token: Scalars['String'];
  email: Scalars['String'];
}>;


export type ConfirmEmailMutation = (
  { __typename?: 'Mutation' }
  & { confirmEmail: (
    { __typename?: 'Result' }
    & Pick<Result, 'success'>
  ) }
);

export type CreateUserMutationVariables = Exact<{
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
  token?: Maybe<Scalars['String']>;
}>;


export type CreateUserMutation = (
  { __typename?: 'Mutation' }
  & { createUser: (
    { __typename?: 'Person' }
    & Pick<Person, '_id' | 'firstName' | 'lastName' | 'email' | 'createdAt'>
  ) }
);

export type CreateInstUserMutationVariables = Exact<{
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
  token?: Maybe<Scalars['String']>;
  institutionName: Scalars['String'];
  phone: Scalars['String'];
}>;


export type CreateInstUserMutation = (
  { __typename?: 'Mutation' }
  & { createInst: (
    { __typename?: 'User' }
    & Pick<User, '_id' | 'firstName' | 'lastName' | 'email' | 'createdAt'>
  ) }
);

export type ConfirmParentEmailMutationVariables = Exact<{
  token: Scalars['String'];
  unVerifiedEmail: Scalars['String'];
}>;


export type ConfirmParentEmailMutation = (
  { __typename?: 'Mutation' }
  & { parentConfirmEmail: (
    { __typename?: 'ParentEmailConfirm' }
    & Pick<ParentEmailConfirm, 'token' | '_id'>
  ) }
);

export type ParentForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ParentForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & { parentForgotPassword: (
    { __typename?: 'Result' }
    & Pick<Result, 'success'>
  ) }
);

export type ParentResendConfimEmailMutationVariables = Exact<{
  unVerifiedEmail: Scalars['String'];
  citizenshipId: Scalars['String'];
}>;


export type ParentResendConfimEmailMutation = (
  { __typename?: 'Mutation' }
  & { parentResendConfirmEmail: (
    { __typename?: 'Result' }
    & Pick<Result, 'success'>
  ) }
);

export type VoyageFragment = (
  { __typename?: 'Voyage' }
  & Pick<Voyage, '_id' | 'institutionId' | 'institutionName' | 'driverId' | 'title' | 'studentIds' | 'schoolId'>
  & { school?: Maybe<(
    { __typename?: 'School' }
    & Pick<School, '_id' | 'name'>
    & { address?: Maybe<(
      { __typename?: 'AddressLocation' }
      & Pick<AddressLocation, 'coordinates'>
    )> }
  )>, voyageTimes: Array<(
    { __typename?: 'VoyageTime' }
    & VoyageTimeFragment
  )> }
);

export type VoyageQueryVariables = Exact<{
  voyageId: Scalars['ObjectId'];
}>;


export type VoyageQuery = (
  { __typename?: 'Query' }
  & { voyage: (
    { __typename?: 'Voyage' }
    & VoyageFragment
  ) }
);

export type VoyagesQueryVariables = Exact<{ [key: string]: never; }>;


export type VoyagesQuery = (
  { __typename?: 'Query' }
  & { voyages: Array<(
    { __typename?: 'Voyage' }
    & VoyageFragment
  )> }
);

export type StudentVoyagesQueryVariables = Exact<{
  parentStudentId: Scalars['ObjectId'];
}>;


export type StudentVoyagesQuery = (
  { __typename?: 'Query' }
  & { studentVoyages: Array<(
    { __typename?: 'Voyage' }
    & VoyageFragment
  )> }
);

export type CreateVoyageMutationVariables = Exact<{
  title: Scalars['String'];
  times: Array<VoyageTimeInput>;
  institutionId: Scalars['ObjectId'];
  schoolId: Scalars['ObjectId'];
}>;


export type CreateVoyageMutation = (
  { __typename?: 'Mutation' }
  & { createVoyage: (
    { __typename?: 'Voyage' }
    & VoyageFragment
  ) }
);

export type RemoveStudentVoyageMutationVariables = Exact<{
  studentId: Scalars['ObjectId'];
  voyageId: Scalars['ObjectId'];
}>;


export type RemoveStudentVoyageMutation = (
  { __typename?: 'Mutation' }
  & { removeStudentVoyage: (
    { __typename?: 'Result' }
    & Pick<Result, 'success'>
  ) }
);

export type SetVoyageOrderLastMutationVariables = Exact<{
  voyageId: Scalars['ObjectId'];
  studentId: Scalars['ObjectId'];
}>;


export type SetVoyageOrderLastMutation = (
  { __typename?: 'Mutation' }
  & { setVoyageOrderLast: (
    { __typename?: 'Result' }
    & Pick<Result, 'success'>
  ) }
);

export type AddStudentVoyageMutationVariables = Exact<{
  voyageId: Scalars['ObjectId'];
  studentId: Scalars['ObjectId'];
}>;


export type AddStudentVoyageMutation = (
  { __typename?: 'Mutation' }
  & { addStudentVoyage: (
    { __typename?: 'Result' }
    & Pick<Result, 'success'>
  ) }
);

export type VoyageTimeFragment = (
  { __typename?: 'VoyageTime' }
  & Pick<VoyageTime, '_id' | 'day' | 'hour' | 'isStart' | 'sessionId' | 'isTakeSchool'>
  & { studentInfos: Array<(
    { __typename?: 'StudentVoyegeInfo' }
    & StudentVoyegeInfoFragment
  )> }
);

export type VoyageTimeQueryVariables = Exact<{
  voyageTimeId: Scalars['ObjectId'];
  voyageId: Scalars['ObjectId'];
}>;


export type VoyageTimeQuery = (
  { __typename?: 'Query' }
  & { voyageTime: (
    { __typename?: 'VoyageTime' }
    & VoyageTimeFragment
  ) }
);

export type UpdatePositionMutationVariables = Exact<{
  position: PositionInput;
  voyageId: Scalars['ObjectId'];
  timeId: Scalars['ObjectId'];
  sessionId: Scalars['ObjectId'];
}>;


export type UpdatePositionMutation = (
  { __typename?: 'Mutation' }
  & { updatePosition: (
    { __typename?: 'PositionType' }
    & PositionTypeFragment
  ) }
);

export type StartPositionMutationVariables = Exact<{
  position: PositionInput;
  voyageId: Scalars['ObjectId'];
  timeId: Scalars['ObjectId'];
}>;


export type StartPositionMutation = (
  { __typename?: 'Mutation' }
  & { startPosition: (
    { __typename?: 'VoyageTime' }
    & VoyageTimeFragment
  ) }
);

export type StopPositionMutationVariables = Exact<{
  voyageId: Scalars['ObjectId'];
  timeId: Scalars['ObjectId'];
}>;


export type StopPositionMutation = (
  { __typename?: 'Mutation' }
  & { stopPosition: (
    { __typename?: 'VoyageTime' }
    & VoyageTimeFragment
  ) }
);

export type AddVoyageTimeMutationVariables = Exact<{
  voyageId: Scalars['ObjectId'];
  day: Scalars['Int'];
  hour: Scalars['Time'];
  isTakeSchool: Scalars['Boolean'];
}>;


export type AddVoyageTimeMutation = (
  { __typename?: 'Mutation' }
  & { addVoyageTime: (
    { __typename?: 'VoyageTime' }
    & VoyageTimeFragment
  ) }
);

export type RemoveVoyageTimeMutationVariables = Exact<{
  voyageId: Scalars['ObjectId'];
  timeId: Scalars['ObjectId'];
}>;


export type RemoveVoyageTimeMutation = (
  { __typename?: 'Mutation' }
  & { removeVoyageTime: (
    { __typename?: 'RemoveResult' }
    & RemoveResultFragment
  ) }
);

export type WeeklyHourFragment = (
  { __typename?: 'WeeklyHour' }
  & Pick<WeeklyHour, '_id' | 'name'>
  & { hour: Array<(
    { __typename?: 'Hour' }
    & HourFragment
  )> }
);

export type CreateHoursMutationVariables = Exact<{
  _id?: Maybe<Scalars['ObjectId']>;
  schoolId: Scalars['ObjectId'];
  name: Scalars['String'];
  hour: Array<HourInput>;
}>;


export type CreateHoursMutation = (
  { __typename?: 'Mutation' }
  & { createHour: (
    { __typename?: 'WeeklyHour' }
    & WeeklyHourFragment
  ) }
);

export const AbsenceFragmentDoc = gql`
    fragment absence on Absence {
  _id
  lessonId
  date
  hourCode
  studentId
  day
}
    `;
export const ApplicationFragmentDoc = gql`
    fragment application on Application {
  _id
  status
  institutionId
  institutionName
  userId
  userFullName
  createdAt
  email
}
    `;
export const DriverInstitutionFragmentDoc = gql`
    fragment driverInstitution on DriverInstitution {
  _id
  institutionId
  institutionName
}
    `;
export const DriverPartFragmentDoc = gql`
    fragment driverPart on User {
  _id
  firstName
  lastName
  fullName
  createdAt
  citizenshipId
  driver {
    _id
    institutions {
      ...driverInstitution
    }
  }
}
    ${DriverInstitutionFragmentDoc}`;
export const DriverApplicationFragmentDoc = gql`
    fragment driverApplication on DriverApplication {
  _id
  email
  userFullName
  status
  createdAt
  institutionName
  userId
}
    `;
export const AddressFragmentDoc = gql`
    fragment address on Address {
  _id
  title
  description
  location {
    coordinates
  }
}
    `;
export const DriverStudentApplicationFragmentDoc = gql`
    fragment driverStudentApplication on DriverStudentApplication {
  _id
  createdAt
  parentId
  status
  institutionId
  email
  userFullName
  userId
  institutionName
  studentFullName
  studentId
  address {
    ...address
  }
}
    ${AddressFragmentDoc}`;
export const EducationFragmentDoc = gql`
    fragment education on Education {
  _id
  educationLevelName
  educationLevel
  educationType
  educationTypeName
  educationlanguage
  universityName
  department {
    _id
    name
  }
  startDate
  finishDate
}
    `;
export const GradeFragmentDoc = gql`
    fragment grade on Grade {
  _id
  studentId
  grade
}
    `;
export const ExamFragmentDoc = gql`
    fragment exam on Exam {
  _id
  lessonHourCode
  lessonId
  date
  grades {
    ...grade
  }
  educationYearId
  termId
}
    ${GradeFragmentDoc}`;
export const HomeWorkFragmentDoc = gql`
    fragment homeWork on HomeWork {
  _id
  message
  lessonId
  title
  sent
  file
}
    `;
export const InboxFragmentDoc = gql`
    fragment inbox on Inbox {
  _id
  lastMessage
  users {
    _id
    firstName
    lastName
    fullName
    kind
  }
  createdAt
  updatedAt
  unReadCount
}
    `;
export const WeeklyScheduleFragmentDoc = gql`
    fragment weeklySchedule on WeeklySchedule {
  _id
  day
  hourCode
}
    `;
export const LessonFragmentDoc = gql`
    fragment lesson on Lesson {
  _id
  lessonId
  educationYearId
  name
  lessonName
  weeklyHour
  createdAt
  lessonWeeklySchedules {
    ...weeklySchedule
  }
  teacherId
  teacher {
    _id
    firstName
    lastName
    fullName
  }
}
    ${WeeklyScheduleFragmentDoc}`;
export const LessonInboxFragmentDoc = gql`
    fragment lessonInbox on LessonInbox {
  _id
  message
  title
  lessonId
  sent
  teacherId
  messageType
}
    `;
export const MessageFragmentDoc = gql`
    fragment message on Message {
  _id
  message
  inboxId
  ownerId
  idOfUnReaders
  sent
  owner {
    _id
    firstName
    lastName
    fullName
    kind
  }
}
    `;
export const NotificationFragmentDoc = gql`
    fragment notification on Notification {
  _id
  lessonId
  state
  notificationType
  action
  createdAt
  targetId
  message
  lessonName
}
    `;
export const ParentApplicationFragmentDoc = gql`
    fragment parentApplication on ParentApplication {
  _id
  studentId
  userFullName
  userId
  email
  status
  studentFullName
  institutionName
}
    `;
export const PointFragmentDoc = gql`
    fragment point on Point {
  coordinates
}
    `;
export const CoordinatesTypeFragmentDoc = gql`
    fragment coordinatesType on CoordinatesType {
  accuracy
  altitude
  altitudeAccuracy
  heading
  speed
  point {
    ...point
  }
}
    ${PointFragmentDoc}`;
export const PositionTypeFragmentDoc = gql`
    fragment positionType on PositionType {
  timestamp
  coords {
    ...coordinatesType
  }
}
    ${CoordinatesTypeFragmentDoc}`;
export const RemoveResultFragmentDoc = gql`
    fragment removeResult on RemoveResult {
  code
  success
  _id
}
    `;
export const HourFragmentDoc = gql`
    fragment hour on Hour {
  _id
  code
  start
  finish
}
    `;
export const WeeklyHourFragmentDoc = gql`
    fragment weeklyHour on WeeklyHour {
  _id
  name
  hour {
    ...hour
  }
}
    ${HourFragmentDoc}`;
export const TermFragmentDoc = gql`
    fragment term on Term {
  _id
  name
  start
  finish
}
    `;
export const EducationYearFragmentDoc = gql`
    fragment educationYear on EducationYear {
  _id
  name
  terms {
    ...term
  }
}
    ${TermFragmentDoc}`;
export const ClassTypeFragmentDoc = gql`
    fragment classType on ClassType {
  _id
  name
  level
  code
  code1
  createdAt
  studentCount
  fullName
  lessonCount
  classroomTeacherId
  classroomTeacher {
    _id
    firstName
    lastName
    fullName
  }
}
    `;
export const SchoolFragmentDoc = gql`
    fragment school on School {
  _id
  eOkulCode
  name
  schoolKindId
  schoolKindName
  headMaster {
    _id
  }
  weeklyHour {
    ...weeklyHour
  }
  educationYears {
    ...educationYear
  }
  classes {
    ...classType
  }
  schoolKindId
  schoolKindName
  studentCount
  address {
    coordinates
  }
}
    ${WeeklyHourFragmentDoc}
${EducationYearFragmentDoc}
${ClassTypeFragmentDoc}`;
export const DeapartmentFragmentDoc = gql`
    fragment deapartment on Department {
  _id
  name
}
    `;
export const TeacherFieldFragmentDoc = gql`
    fragment teacherField on TeacherField {
  _id
  name
  departments {
    ...deapartment
  }
}
    ${DeapartmentFragmentDoc}`;
export const LessonGFragmentDoc = gql`
    fragment lessonG on LessonG {
  _id
  name
  teacherFields {
    ...teacherField
  }
}
    ${TeacherFieldFragmentDoc}`;
export const ClassLessonFragmentDoc = gql`
    fragment classLesson on ClassLesson {
  _id
  lessonId
  lesson {
    ...lessonG
  }
  count
  required
}
    ${LessonGFragmentDoc}`;
export const ClassGFragmentDoc = gql`
    fragment classG on ClassG {
  _id
  level
  lessons {
    ...classLesson
  }
}
    ${ClassLessonFragmentDoc}`;
export const SchoolGFragmentDoc = gql`
    fragment schoolG on SchoolG {
  _id
  name
  classes {
    ...classG
  }
}
    ${ClassGFragmentDoc}`;
export const StudyFragmentDoc = gql`
    fragment study on Study {
  _id
  date
  subject
  detail
  dateTimeSpan
  public
  capacity
  permissionClasses
  duration
  lessonName
  students {
    _id
    status
    studentId
    state
    student {
      _id
      firstName
      lastName
      fullName
      profilePhoto
    }
  }
}
    `;
export const TeacherApplicationFragmentDoc = gql`
    fragment teacherApplication on TeacherApplication {
  _id
  email
  institutionId
  institutionName
  userId
  userFullName
  status
  createdAt
}
    `;
export const UniversityFragmentDoc = gql`
    fragment university on University {
  _id
  name
  universityLogoUrl
}
    `;
export const UpdateResultsFragmentDoc = gql`
    fragment updateResults on UpdateResults {
  code
  success
  _ids
}
    `;
export const PersonNamePartFragmentDoc = gql`
    fragment personNamePart on Person {
  _id
  firstName
  lastName
  fullName
}
    `;
export const PersonFragmentDoc = gql`
    fragment person on Person {
  ...personNamePart
  email
  unVerifiedEmail
  createdAt
  fullName
  kind
  profilePhoto
  roles
  phone
  birthDate
  address {
    ...address
  }
}
    ${PersonNamePartFragmentDoc}
${AddressFragmentDoc}`;
export const UserNamePartFragmentDoc = gql`
    fragment userNamePart on User {
  _id
  firstName
  lastName
  fullName
  email
}
    `;
export const DriverFragmentDoc = gql`
    fragment driver on Driver {
  _id
  institutions {
    ...driverInstitution
  }
}
    ${DriverInstitutionFragmentDoc}`;
export const ParentStudentFragmentDoc = gql`
    fragment parentStudent on ParentStudent {
  _id
  studentId
  institutionId
  parentType
}
    `;
export const TeacherFragmentDoc = gql`
    fragment teacher on Teacher {
  _id
  institutionId
  schoolIds
  allSchool
  addedById
}
    `;
export const UserFragmentDoc = gql`
    fragment user on User {
  _id
  ...userNamePart
  phone
  citizenshipId
  createdAt
  birthDate
  kind
  driver {
    ...driver
  }
  parentStudents {
    ...parentStudent
  }
  teacher {
    ...teacher
  }
  address {
    ...address
  }
}
    ${UserNamePartFragmentDoc}
${DriverFragmentDoc}
${ParentStudentFragmentDoc}
${TeacherFragmentDoc}
${AddressFragmentDoc}`;
export const StudentFragmentDoc = gql`
    fragment student on Student {
  _id
  firstName
  lastName
  school
  class
  fullName
  username
  schoolNo
  profilePhoto
  citizenshipId
  schoolName
  className
  foreignLanguage
}
    `;
export const StudentVoyegeInfoFragmentDoc = gql`
    fragment studentVoyegeInfo on StudentVoyegeInfo {
  _id
  student {
    ...student
    address {
      ...address
    }
  }
  studentId
  status
  order
  disabled
}
    ${StudentFragmentDoc}
${AddressFragmentDoc}`;
export const VoyageTimeFragmentDoc = gql`
    fragment voyageTime on VoyageTime {
  _id
  day
  hour
  isStart
  sessionId
  isTakeSchool
  studentInfos {
    ...studentVoyegeInfo
  }
}
    ${StudentVoyegeInfoFragmentDoc}`;
export const VoyageFragmentDoc = gql`
    fragment voyage on Voyage {
  _id
  institutionId
  institutionName
  driverId
  title
  studentIds
  schoolId
  school {
    _id
    name
    address {
      coordinates
    }
  }
  voyageTimes {
    ...voyageTime
  }
}
    ${VoyageTimeFragmentDoc}`;
export const AbsencesDocument = gql`
    query Absences($t: Boolean, $parentStudentId: ObjectId) {
  absences(query: {t: $t}, parentStudentId: $parentStudentId) {
    ...absence
  }
}
    ${AbsenceFragmentDoc}`;

/**
 * __useAbsencesQuery__
 *
 * To run a query within a React component, call `useAbsencesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAbsencesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAbsencesQuery({
 *   variables: {
 *      t: // value for 't'
 *      parentStudentId: // value for 'parentStudentId'
 *   },
 * });
 */
export function useAbsencesQuery(baseOptions?: Apollo.QueryHookOptions<AbsencesQuery, AbsencesQueryVariables>) {
        return Apollo.useQuery<AbsencesQuery, AbsencesQueryVariables>(AbsencesDocument, baseOptions);
      }
export function useAbsencesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AbsencesQuery, AbsencesQueryVariables>) {
          return Apollo.useLazyQuery<AbsencesQuery, AbsencesQueryVariables>(AbsencesDocument, baseOptions);
        }
export type AbsencesQueryHookResult = ReturnType<typeof useAbsencesQuery>;
export type AbsencesLazyQueryHookResult = ReturnType<typeof useAbsencesLazyQuery>;
export type AbsencesQueryResult = Apollo.QueryResult<AbsencesQuery, AbsencesQueryVariables>;
export const DeleteAbsenceDocument = gql`
    mutation DeleteAbsence($absenceId: ObjectId!) {
  deleteAbsence(absenceId: $absenceId) {
    ...removeResult
  }
}
    ${RemoveResultFragmentDoc}`;
export type DeleteAbsenceMutationFn = Apollo.MutationFunction<DeleteAbsenceMutation, DeleteAbsenceMutationVariables>;

/**
 * __useDeleteAbsenceMutation__
 *
 * To run a mutation, you first call `useDeleteAbsenceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAbsenceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAbsenceMutation, { data, loading, error }] = useDeleteAbsenceMutation({
 *   variables: {
 *      absenceId: // value for 'absenceId'
 *   },
 * });
 */
export function useDeleteAbsenceMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAbsenceMutation, DeleteAbsenceMutationVariables>) {
        return Apollo.useMutation<DeleteAbsenceMutation, DeleteAbsenceMutationVariables>(DeleteAbsenceDocument, baseOptions);
      }
export type DeleteAbsenceMutationHookResult = ReturnType<typeof useDeleteAbsenceMutation>;
export type DeleteAbsenceMutationResult = Apollo.MutationResult<DeleteAbsenceMutation>;
export type DeleteAbsenceMutationOptions = Apollo.BaseMutationOptions<DeleteAbsenceMutation, DeleteAbsenceMutationVariables>;
export const CreateAbsenceDocument = gql`
    mutation CreateAbsence($studentIds: [ObjectId!]!, $lessonId: ObjectId!, $hourCode: Int!) {
  createAbsence(data: {studentIds: $studentIds, lessonId: $lessonId, hourCode: $hourCode}) {
    ...absence
  }
}
    ${AbsenceFragmentDoc}`;
export type CreateAbsenceMutationFn = Apollo.MutationFunction<CreateAbsenceMutation, CreateAbsenceMutationVariables>;

/**
 * __useCreateAbsenceMutation__
 *
 * To run a mutation, you first call `useCreateAbsenceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAbsenceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAbsenceMutation, { data, loading, error }] = useCreateAbsenceMutation({
 *   variables: {
 *      studentIds: // value for 'studentIds'
 *      lessonId: // value for 'lessonId'
 *      hourCode: // value for 'hourCode'
 *   },
 * });
 */
export function useCreateAbsenceMutation(baseOptions?: Apollo.MutationHookOptions<CreateAbsenceMutation, CreateAbsenceMutationVariables>) {
        return Apollo.useMutation<CreateAbsenceMutation, CreateAbsenceMutationVariables>(CreateAbsenceDocument, baseOptions);
      }
export type CreateAbsenceMutationHookResult = ReturnType<typeof useCreateAbsenceMutation>;
export type CreateAbsenceMutationResult = Apollo.MutationResult<CreateAbsenceMutation>;
export type CreateAbsenceMutationOptions = Apollo.BaseMutationOptions<CreateAbsenceMutation, CreateAbsenceMutationVariables>;
export const UpdateStudentAddressDocument = gql`
    mutation UpdateStudentAddress($title: String!, $description: String!, $lat: Float!, $lng: Float!, $i: ObjectId!) {
  updateStudentAddress(data: {title: $title, description: $description, lat: $lat, lng: $lng}, i: $i) {
    ...address
  }
}
    ${AddressFragmentDoc}`;
export type UpdateStudentAddressMutationFn = Apollo.MutationFunction<UpdateStudentAddressMutation, UpdateStudentAddressMutationVariables>;

/**
 * __useUpdateStudentAddressMutation__
 *
 * To run a mutation, you first call `useUpdateStudentAddressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateStudentAddressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateStudentAddressMutation, { data, loading, error }] = useUpdateStudentAddressMutation({
 *   variables: {
 *      title: // value for 'title'
 *      description: // value for 'description'
 *      lat: // value for 'lat'
 *      lng: // value for 'lng'
 *      i: // value for 'i'
 *   },
 * });
 */
export function useUpdateStudentAddressMutation(baseOptions?: Apollo.MutationHookOptions<UpdateStudentAddressMutation, UpdateStudentAddressMutationVariables>) {
        return Apollo.useMutation<UpdateStudentAddressMutation, UpdateStudentAddressMutationVariables>(UpdateStudentAddressDocument, baseOptions);
      }
export type UpdateStudentAddressMutationHookResult = ReturnType<typeof useUpdateStudentAddressMutation>;
export type UpdateStudentAddressMutationResult = Apollo.MutationResult<UpdateStudentAddressMutation>;
export type UpdateStudentAddressMutationOptions = Apollo.BaseMutationOptions<UpdateStudentAddressMutation, UpdateStudentAddressMutationVariables>;
export const AddAddressToSchoolDocument = gql`
    mutation addAddressToSchool($schoolId: ObjectId!, $lat: Float!, $lng: Float!) {
  addAddressToSchool(data: {schoolId: $schoolId, lat: $lat, lng: $lng}) {
    coordinates
  }
}
    `;
export type AddAddressToSchoolMutationFn = Apollo.MutationFunction<AddAddressToSchoolMutation, AddAddressToSchoolMutationVariables>;

/**
 * __useAddAddressToSchoolMutation__
 *
 * To run a mutation, you first call `useAddAddressToSchoolMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddAddressToSchoolMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addAddressToSchoolMutation, { data, loading, error }] = useAddAddressToSchoolMutation({
 *   variables: {
 *      schoolId: // value for 'schoolId'
 *      lat: // value for 'lat'
 *      lng: // value for 'lng'
 *   },
 * });
 */
export function useAddAddressToSchoolMutation(baseOptions?: Apollo.MutationHookOptions<AddAddressToSchoolMutation, AddAddressToSchoolMutationVariables>) {
        return Apollo.useMutation<AddAddressToSchoolMutation, AddAddressToSchoolMutationVariables>(AddAddressToSchoolDocument, baseOptions);
      }
export type AddAddressToSchoolMutationHookResult = ReturnType<typeof useAddAddressToSchoolMutation>;
export type AddAddressToSchoolMutationResult = Apollo.MutationResult<AddAddressToSchoolMutation>;
export type AddAddressToSchoolMutationOptions = Apollo.BaseMutationOptions<AddAddressToSchoolMutation, AddAddressToSchoolMutationVariables>;
export const AcceptInvitationDocument = gql`
    mutation AcceptInvitation($invitationId: ObjectId!, $r: Boolean, $d: Boolean) {
  acceptInvitation(invitationId: $invitationId, r: $r, d: $d) {
    ...application
  }
}
    ${ApplicationFragmentDoc}`;
export type AcceptInvitationMutationFn = Apollo.MutationFunction<AcceptInvitationMutation, AcceptInvitationMutationVariables>;

/**
 * __useAcceptInvitationMutation__
 *
 * To run a mutation, you first call `useAcceptInvitationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptInvitationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptInvitationMutation, { data, loading, error }] = useAcceptInvitationMutation({
 *   variables: {
 *      invitationId: // value for 'invitationId'
 *      r: // value for 'r'
 *      d: // value for 'd'
 *   },
 * });
 */
export function useAcceptInvitationMutation(baseOptions?: Apollo.MutationHookOptions<AcceptInvitationMutation, AcceptInvitationMutationVariables>) {
        return Apollo.useMutation<AcceptInvitationMutation, AcceptInvitationMutationVariables>(AcceptInvitationDocument, baseOptions);
      }
export type AcceptInvitationMutationHookResult = ReturnType<typeof useAcceptInvitationMutation>;
export type AcceptInvitationMutationResult = Apollo.MutationResult<AcceptInvitationMutation>;
export type AcceptInvitationMutationOptions = Apollo.BaseMutationOptions<AcceptInvitationMutation, AcceptInvitationMutationVariables>;
export const ApplicatonUpdatedDocument = gql`
    subscription ApplicatonUpdated {
  applicationUpdated {
    ...application
  }
}
    ${ApplicationFragmentDoc}`;

/**
 * __useApplicatonUpdatedSubscription__
 *
 * To run a query within a React component, call `useApplicatonUpdatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useApplicatonUpdatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useApplicatonUpdatedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useApplicatonUpdatedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<ApplicatonUpdatedSubscription, ApplicatonUpdatedSubscriptionVariables>) {
        return Apollo.useSubscription<ApplicatonUpdatedSubscription, ApplicatonUpdatedSubscriptionVariables>(ApplicatonUpdatedDocument, baseOptions);
      }
export type ApplicatonUpdatedSubscriptionHookResult = ReturnType<typeof useApplicatonUpdatedSubscription>;
export type ApplicatonUpdatedSubscriptionResult = Apollo.SubscriptionResult<ApplicatonUpdatedSubscription>;
export const SchoolKindClassDocument = gql`
    query SchoolKindClass($schoolGId: ObjectId!, $level: Int!) {
  schoolKindClass(schoolGId: $schoolGId, level: $level) {
    ...classG
  }
}
    ${ClassGFragmentDoc}`;

/**
 * __useSchoolKindClassQuery__
 *
 * To run a query within a React component, call `useSchoolKindClassQuery` and pass it any options that fit your needs.
 * When your component renders, `useSchoolKindClassQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSchoolKindClassQuery({
 *   variables: {
 *      schoolGId: // value for 'schoolGId'
 *      level: // value for 'level'
 *   },
 * });
 */
export function useSchoolKindClassQuery(baseOptions?: Apollo.QueryHookOptions<SchoolKindClassQuery, SchoolKindClassQueryVariables>) {
        return Apollo.useQuery<SchoolKindClassQuery, SchoolKindClassQueryVariables>(SchoolKindClassDocument, baseOptions);
      }
export function useSchoolKindClassLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SchoolKindClassQuery, SchoolKindClassQueryVariables>) {
          return Apollo.useLazyQuery<SchoolKindClassQuery, SchoolKindClassQueryVariables>(SchoolKindClassDocument, baseOptions);
        }
export type SchoolKindClassQueryHookResult = ReturnType<typeof useSchoolKindClassQuery>;
export type SchoolKindClassLazyQueryHookResult = ReturnType<typeof useSchoolKindClassLazyQuery>;
export type SchoolKindClassQueryResult = Apollo.QueryResult<SchoolKindClassQuery, SchoolKindClassQueryVariables>;
export const ClassGDocument = gql`
    query ClassG($schoolId: ObjectId!, $classId: ObjectId!) {
  classG(schoolId: $schoolId, classId: $classId) {
    ...classG
  }
}
    ${ClassGFragmentDoc}`;

/**
 * __useClassGQuery__
 *
 * To run a query within a React component, call `useClassGQuery` and pass it any options that fit your needs.
 * When your component renders, `useClassGQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClassGQuery({
 *   variables: {
 *      schoolId: // value for 'schoolId'
 *      classId: // value for 'classId'
 *   },
 * });
 */
export function useClassGQuery(baseOptions?: Apollo.QueryHookOptions<ClassGQuery, ClassGQueryVariables>) {
        return Apollo.useQuery<ClassGQuery, ClassGQueryVariables>(ClassGDocument, baseOptions);
      }
export function useClassGLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ClassGQuery, ClassGQueryVariables>) {
          return Apollo.useLazyQuery<ClassGQuery, ClassGQueryVariables>(ClassGDocument, baseOptions);
        }
export type ClassGQueryHookResult = ReturnType<typeof useClassGQuery>;
export type ClassGLazyQueryHookResult = ReturnType<typeof useClassGLazyQuery>;
export type ClassGQueryResult = Apollo.QueryResult<ClassGQuery, ClassGQueryVariables>;
export const AddLessonToClassDocument = gql`
    mutation AddLessonToClass($schoolId: ObjectId!, $classId: ObjectId!, $lessonId: ObjectId!, $count: Int!, $required: Boolean) {
  addLessonToClass(data: {schoolId: $schoolId, classId: $classId, lessonId: $lessonId, count: $count, required: $required}) {
    ...classG
  }
}
    ${ClassGFragmentDoc}`;
export type AddLessonToClassMutationFn = Apollo.MutationFunction<AddLessonToClassMutation, AddLessonToClassMutationVariables>;

/**
 * __useAddLessonToClassMutation__
 *
 * To run a mutation, you first call `useAddLessonToClassMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddLessonToClassMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addLessonToClassMutation, { data, loading, error }] = useAddLessonToClassMutation({
 *   variables: {
 *      schoolId: // value for 'schoolId'
 *      classId: // value for 'classId'
 *      lessonId: // value for 'lessonId'
 *      count: // value for 'count'
 *      required: // value for 'required'
 *   },
 * });
 */
export function useAddLessonToClassMutation(baseOptions?: Apollo.MutationHookOptions<AddLessonToClassMutation, AddLessonToClassMutationVariables>) {
        return Apollo.useMutation<AddLessonToClassMutation, AddLessonToClassMutationVariables>(AddLessonToClassDocument, baseOptions);
      }
export type AddLessonToClassMutationHookResult = ReturnType<typeof useAddLessonToClassMutation>;
export type AddLessonToClassMutationResult = Apollo.MutationResult<AddLessonToClassMutation>;
export type AddLessonToClassMutationOptions = Apollo.BaseMutationOptions<AddLessonToClassMutation, AddLessonToClassMutationVariables>;
export const RemoveLessonToClassDocument = gql`
    mutation RemoveLessonToClass($schoolId: ObjectId!, $classId: ObjectId!, $_id: ObjectId!) {
  removeLessonToClass(schoolId: $schoolId, classId: $classId, _id: $_id) {
    ...classG
  }
}
    ${ClassGFragmentDoc}`;
export type RemoveLessonToClassMutationFn = Apollo.MutationFunction<RemoveLessonToClassMutation, RemoveLessonToClassMutationVariables>;

/**
 * __useRemoveLessonToClassMutation__
 *
 * To run a mutation, you first call `useRemoveLessonToClassMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveLessonToClassMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeLessonToClassMutation, { data, loading, error }] = useRemoveLessonToClassMutation({
 *   variables: {
 *      schoolId: // value for 'schoolId'
 *      classId: // value for 'classId'
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useRemoveLessonToClassMutation(baseOptions?: Apollo.MutationHookOptions<RemoveLessonToClassMutation, RemoveLessonToClassMutationVariables>) {
        return Apollo.useMutation<RemoveLessonToClassMutation, RemoveLessonToClassMutationVariables>(RemoveLessonToClassDocument, baseOptions);
      }
export type RemoveLessonToClassMutationHookResult = ReturnType<typeof useRemoveLessonToClassMutation>;
export type RemoveLessonToClassMutationResult = Apollo.MutationResult<RemoveLessonToClassMutation>;
export type RemoveLessonToClassMutationOptions = Apollo.BaseMutationOptions<RemoveLessonToClassMutation, RemoveLessonToClassMutationVariables>;
export const ClassesDocument = gql`
    query Classes($id: ObjectId!) {
  classes(id: $id) {
    ...classType
  }
}
    ${ClassTypeFragmentDoc}`;

/**
 * __useClassesQuery__
 *
 * To run a query within a React component, call `useClassesQuery` and pass it any options that fit your needs.
 * When your component renders, `useClassesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClassesQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useClassesQuery(baseOptions?: Apollo.QueryHookOptions<ClassesQuery, ClassesQueryVariables>) {
        return Apollo.useQuery<ClassesQuery, ClassesQueryVariables>(ClassesDocument, baseOptions);
      }
export function useClassesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ClassesQuery, ClassesQueryVariables>) {
          return Apollo.useLazyQuery<ClassesQuery, ClassesQueryVariables>(ClassesDocument, baseOptions);
        }
export type ClassesQueryHookResult = ReturnType<typeof useClassesQuery>;
export type ClassesLazyQueryHookResult = ReturnType<typeof useClassesLazyQuery>;
export type ClassesQueryResult = Apollo.QueryResult<ClassesQuery, ClassesQueryVariables>;
export const ClassDocument = gql`
    query Class($schoolId: ObjectId!, $classId: ObjectId!) {
  class(schoolId: $schoolId, classId: $classId) {
    ...classType
  }
}
    ${ClassTypeFragmentDoc}`;

/**
 * __useClassQuery__
 *
 * To run a query within a React component, call `useClassQuery` and pass it any options that fit your needs.
 * When your component renders, `useClassQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClassQuery({
 *   variables: {
 *      schoolId: // value for 'schoolId'
 *      classId: // value for 'classId'
 *   },
 * });
 */
export function useClassQuery(baseOptions?: Apollo.QueryHookOptions<ClassQuery, ClassQueryVariables>) {
        return Apollo.useQuery<ClassQuery, ClassQueryVariables>(ClassDocument, baseOptions);
      }
export function useClassLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ClassQuery, ClassQueryVariables>) {
          return Apollo.useLazyQuery<ClassQuery, ClassQueryVariables>(ClassDocument, baseOptions);
        }
export type ClassQueryHookResult = ReturnType<typeof useClassQuery>;
export type ClassLazyQueryHookResult = ReturnType<typeof useClassLazyQuery>;
export type ClassQueryResult = Apollo.QueryResult<ClassQuery, ClassQueryVariables>;
export const SetClassroomTeacherDocument = gql`
    mutation SetClassroomTeacher($schoolId: ObjectId!, $classId: ObjectId!, $userId: ObjectId) {
  setClassroomTeacher(schoolId: $schoolId, classId: $classId, userId: $userId) {
    code
    success
  }
}
    `;
export type SetClassroomTeacherMutationFn = Apollo.MutationFunction<SetClassroomTeacherMutation, SetClassroomTeacherMutationVariables>;

/**
 * __useSetClassroomTeacherMutation__
 *
 * To run a mutation, you first call `useSetClassroomTeacherMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetClassroomTeacherMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setClassroomTeacherMutation, { data, loading, error }] = useSetClassroomTeacherMutation({
 *   variables: {
 *      schoolId: // value for 'schoolId'
 *      classId: // value for 'classId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useSetClassroomTeacherMutation(baseOptions?: Apollo.MutationHookOptions<SetClassroomTeacherMutation, SetClassroomTeacherMutationVariables>) {
        return Apollo.useMutation<SetClassroomTeacherMutation, SetClassroomTeacherMutationVariables>(SetClassroomTeacherDocument, baseOptions);
      }
export type SetClassroomTeacherMutationHookResult = ReturnType<typeof useSetClassroomTeacherMutation>;
export type SetClassroomTeacherMutationResult = Apollo.MutationResult<SetClassroomTeacherMutation>;
export type SetClassroomTeacherMutationOptions = Apollo.BaseMutationOptions<SetClassroomTeacherMutation, SetClassroomTeacherMutationVariables>;
export const CreateClassDocument = gql`
    mutation CreateClass($_id: ObjectId, $schoolId: ObjectId!, $name: String, $level: Int!, $code: String, $code1: String) {
  createClass(data: {_id: $_id, schoolId: $schoolId, name: $name, level: $level, code: $code, code1: $code1}) {
    ...classType
  }
}
    ${ClassTypeFragmentDoc}`;
export type CreateClassMutationFn = Apollo.MutationFunction<CreateClassMutation, CreateClassMutationVariables>;

/**
 * __useCreateClassMutation__
 *
 * To run a mutation, you first call `useCreateClassMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateClassMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createClassMutation, { data, loading, error }] = useCreateClassMutation({
 *   variables: {
 *      _id: // value for '_id'
 *      schoolId: // value for 'schoolId'
 *      name: // value for 'name'
 *      level: // value for 'level'
 *      code: // value for 'code'
 *      code1: // value for 'code1'
 *   },
 * });
 */
export function useCreateClassMutation(baseOptions?: Apollo.MutationHookOptions<CreateClassMutation, CreateClassMutationVariables>) {
        return Apollo.useMutation<CreateClassMutation, CreateClassMutationVariables>(CreateClassDocument, baseOptions);
      }
export type CreateClassMutationHookResult = ReturnType<typeof useCreateClassMutation>;
export type CreateClassMutationResult = Apollo.MutationResult<CreateClassMutation>;
export type CreateClassMutationOptions = Apollo.BaseMutationOptions<CreateClassMutation, CreateClassMutationVariables>;
export const DeleteClassTypeDocument = gql`
    mutation DeleteClassType($schoolId: ObjectId!, $classId: ObjectId!) {
  deleteClass(schoolId: $schoolId, classId: $classId) {
    ...removeResult
  }
}
    ${RemoveResultFragmentDoc}`;
export type DeleteClassTypeMutationFn = Apollo.MutationFunction<DeleteClassTypeMutation, DeleteClassTypeMutationVariables>;

/**
 * __useDeleteClassTypeMutation__
 *
 * To run a mutation, you first call `useDeleteClassTypeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteClassTypeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteClassTypeMutation, { data, loading, error }] = useDeleteClassTypeMutation({
 *   variables: {
 *      schoolId: // value for 'schoolId'
 *      classId: // value for 'classId'
 *   },
 * });
 */
export function useDeleteClassTypeMutation(baseOptions?: Apollo.MutationHookOptions<DeleteClassTypeMutation, DeleteClassTypeMutationVariables>) {
        return Apollo.useMutation<DeleteClassTypeMutation, DeleteClassTypeMutationVariables>(DeleteClassTypeDocument, baseOptions);
      }
export type DeleteClassTypeMutationHookResult = ReturnType<typeof useDeleteClassTypeMutation>;
export type DeleteClassTypeMutationResult = Apollo.MutationResult<DeleteClassTypeMutation>;
export type DeleteClassTypeMutationOptions = Apollo.BaseMutationOptions<DeleteClassTypeMutation, DeleteClassTypeMutationVariables>;
export const DepartmentsDocument = gql`
    query Departments {
  departments {
    ...deapartment
  }
}
    ${DeapartmentFragmentDoc}`;

/**
 * __useDepartmentsQuery__
 *
 * To run a query within a React component, call `useDepartmentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDepartmentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDepartmentsQuery({
 *   variables: {
 *   },
 * });
 */
export function useDepartmentsQuery(baseOptions?: Apollo.QueryHookOptions<DepartmentsQuery, DepartmentsQueryVariables>) {
        return Apollo.useQuery<DepartmentsQuery, DepartmentsQueryVariables>(DepartmentsDocument, baseOptions);
      }
export function useDepartmentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DepartmentsQuery, DepartmentsQueryVariables>) {
          return Apollo.useLazyQuery<DepartmentsQuery, DepartmentsQueryVariables>(DepartmentsDocument, baseOptions);
        }
export type DepartmentsQueryHookResult = ReturnType<typeof useDepartmentsQuery>;
export type DepartmentsLazyQueryHookResult = ReturnType<typeof useDepartmentsLazyQuery>;
export type DepartmentsQueryResult = Apollo.QueryResult<DepartmentsQuery, DepartmentsQueryVariables>;
export const RemoveDepartmentDocument = gql`
    mutation RemoveDepartment($_id: ObjectId!) {
  removeDepartment(_id: $_id) {
    ...removeResult
  }
}
    ${RemoveResultFragmentDoc}`;
export type RemoveDepartmentMutationFn = Apollo.MutationFunction<RemoveDepartmentMutation, RemoveDepartmentMutationVariables>;

/**
 * __useRemoveDepartmentMutation__
 *
 * To run a mutation, you first call `useRemoveDepartmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveDepartmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeDepartmentMutation, { data, loading, error }] = useRemoveDepartmentMutation({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useRemoveDepartmentMutation(baseOptions?: Apollo.MutationHookOptions<RemoveDepartmentMutation, RemoveDepartmentMutationVariables>) {
        return Apollo.useMutation<RemoveDepartmentMutation, RemoveDepartmentMutationVariables>(RemoveDepartmentDocument, baseOptions);
      }
export type RemoveDepartmentMutationHookResult = ReturnType<typeof useRemoveDepartmentMutation>;
export type RemoveDepartmentMutationResult = Apollo.MutationResult<RemoveDepartmentMutation>;
export type RemoveDepartmentMutationOptions = Apollo.BaseMutationOptions<RemoveDepartmentMutation, RemoveDepartmentMutationVariables>;
export const EditDepartmentDocument = gql`
    mutation EditDepartment($name: String!) {
  editDepartment(department: {name: $name}) {
    ...deapartment
  }
}
    ${DeapartmentFragmentDoc}`;
export type EditDepartmentMutationFn = Apollo.MutationFunction<EditDepartmentMutation, EditDepartmentMutationVariables>;

/**
 * __useEditDepartmentMutation__
 *
 * To run a mutation, you first call `useEditDepartmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditDepartmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editDepartmentMutation, { data, loading, error }] = useEditDepartmentMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useEditDepartmentMutation(baseOptions?: Apollo.MutationHookOptions<EditDepartmentMutation, EditDepartmentMutationVariables>) {
        return Apollo.useMutation<EditDepartmentMutation, EditDepartmentMutationVariables>(EditDepartmentDocument, baseOptions);
      }
export type EditDepartmentMutationHookResult = ReturnType<typeof useEditDepartmentMutation>;
export type EditDepartmentMutationResult = Apollo.MutationResult<EditDepartmentMutation>;
export type EditDepartmentMutationOptions = Apollo.BaseMutationOptions<EditDepartmentMutation, EditDepartmentMutationVariables>;
export const AddDepartmentsToTeacherFieldDocument = gql`
    mutation AddDepartmentsToTeacherField($ids: [ObjectId!]!, $_id: ObjectId!) {
  addDepartmentsToTeacherField(ids: $ids, _id: $_id) {
    ...teacherField
  }
}
    ${TeacherFieldFragmentDoc}`;
export type AddDepartmentsToTeacherFieldMutationFn = Apollo.MutationFunction<AddDepartmentsToTeacherFieldMutation, AddDepartmentsToTeacherFieldMutationVariables>;

/**
 * __useAddDepartmentsToTeacherFieldMutation__
 *
 * To run a mutation, you first call `useAddDepartmentsToTeacherFieldMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddDepartmentsToTeacherFieldMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addDepartmentsToTeacherFieldMutation, { data, loading, error }] = useAddDepartmentsToTeacherFieldMutation({
 *   variables: {
 *      ids: // value for 'ids'
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useAddDepartmentsToTeacherFieldMutation(baseOptions?: Apollo.MutationHookOptions<AddDepartmentsToTeacherFieldMutation, AddDepartmentsToTeacherFieldMutationVariables>) {
        return Apollo.useMutation<AddDepartmentsToTeacherFieldMutation, AddDepartmentsToTeacherFieldMutationVariables>(AddDepartmentsToTeacherFieldDocument, baseOptions);
      }
export type AddDepartmentsToTeacherFieldMutationHookResult = ReturnType<typeof useAddDepartmentsToTeacherFieldMutation>;
export type AddDepartmentsToTeacherFieldMutationResult = Apollo.MutationResult<AddDepartmentsToTeacherFieldMutation>;
export type AddDepartmentsToTeacherFieldMutationOptions = Apollo.BaseMutationOptions<AddDepartmentsToTeacherFieldMutation, AddDepartmentsToTeacherFieldMutationVariables>;
export const RemoveDepartmentsToTeacherFieldDocument = gql`
    mutation RemoveDepartmentsToTeacherField($id: ObjectId!, $_id: ObjectId!) {
  removeDepartmentsToTeacherField(id: $id, _id: $_id) {
    ...teacherField
  }
}
    ${TeacherFieldFragmentDoc}`;
export type RemoveDepartmentsToTeacherFieldMutationFn = Apollo.MutationFunction<RemoveDepartmentsToTeacherFieldMutation, RemoveDepartmentsToTeacherFieldMutationVariables>;

/**
 * __useRemoveDepartmentsToTeacherFieldMutation__
 *
 * To run a mutation, you first call `useRemoveDepartmentsToTeacherFieldMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveDepartmentsToTeacherFieldMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeDepartmentsToTeacherFieldMutation, { data, loading, error }] = useRemoveDepartmentsToTeacherFieldMutation({
 *   variables: {
 *      id: // value for 'id'
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useRemoveDepartmentsToTeacherFieldMutation(baseOptions?: Apollo.MutationHookOptions<RemoveDepartmentsToTeacherFieldMutation, RemoveDepartmentsToTeacherFieldMutationVariables>) {
        return Apollo.useMutation<RemoveDepartmentsToTeacherFieldMutation, RemoveDepartmentsToTeacherFieldMutationVariables>(RemoveDepartmentsToTeacherFieldDocument, baseOptions);
      }
export type RemoveDepartmentsToTeacherFieldMutationHookResult = ReturnType<typeof useRemoveDepartmentsToTeacherFieldMutation>;
export type RemoveDepartmentsToTeacherFieldMutationResult = Apollo.MutationResult<RemoveDepartmentsToTeacherFieldMutation>;
export type RemoveDepartmentsToTeacherFieldMutationOptions = Apollo.BaseMutationOptions<RemoveDepartmentsToTeacherFieldMutation, RemoveDepartmentsToTeacherFieldMutationVariables>;
export const StudentsDriverDocument = gql`
    query StudentsDriver($search: String!, $institutionId: ObjectId!, $studentIds: [ObjectId!]) {
  studentsDriver(query: {search: $search, institutionId: $institutionId, studentIds: $studentIds}) {
    ...student
  }
}
    ${StudentFragmentDoc}`;

/**
 * __useStudentsDriverQuery__
 *
 * To run a query within a React component, call `useStudentsDriverQuery` and pass it any options that fit your needs.
 * When your component renders, `useStudentsDriverQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStudentsDriverQuery({
 *   variables: {
 *      search: // value for 'search'
 *      institutionId: // value for 'institutionId'
 *      studentIds: // value for 'studentIds'
 *   },
 * });
 */
export function useStudentsDriverQuery(baseOptions?: Apollo.QueryHookOptions<StudentsDriverQuery, StudentsDriverQueryVariables>) {
        return Apollo.useQuery<StudentsDriverQuery, StudentsDriverQueryVariables>(StudentsDriverDocument, baseOptions);
      }
export function useStudentsDriverLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StudentsDriverQuery, StudentsDriverQueryVariables>) {
          return Apollo.useLazyQuery<StudentsDriverQuery, StudentsDriverQueryVariables>(StudentsDriverDocument, baseOptions);
        }
export type StudentsDriverQueryHookResult = ReturnType<typeof useStudentsDriverQuery>;
export type StudentsDriverLazyQueryHookResult = ReturnType<typeof useStudentsDriverLazyQuery>;
export type StudentsDriverQueryResult = Apollo.QueryResult<StudentsDriverQuery, StudentsDriverQueryVariables>;
export const DriverInsitutionsDocument = gql`
    query driverInsitutions {
  driverInsitutions {
    institutionId
    institutionName
  }
}
    `;

/**
 * __useDriverInsitutionsQuery__
 *
 * To run a query within a React component, call `useDriverInsitutionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDriverInsitutionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDriverInsitutionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useDriverInsitutionsQuery(baseOptions?: Apollo.QueryHookOptions<DriverInsitutionsQuery, DriverInsitutionsQueryVariables>) {
        return Apollo.useQuery<DriverInsitutionsQuery, DriverInsitutionsQueryVariables>(DriverInsitutionsDocument, baseOptions);
      }
export function useDriverInsitutionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DriverInsitutionsQuery, DriverInsitutionsQueryVariables>) {
          return Apollo.useLazyQuery<DriverInsitutionsQuery, DriverInsitutionsQueryVariables>(DriverInsitutionsDocument, baseOptions);
        }
export type DriverInsitutionsQueryHookResult = ReturnType<typeof useDriverInsitutionsQuery>;
export type DriverInsitutionsLazyQueryHookResult = ReturnType<typeof useDriverInsitutionsLazyQuery>;
export type DriverInsitutionsQueryResult = Apollo.QueryResult<DriverInsitutionsQuery, DriverInsitutionsQueryVariables>;
export const DriversDocument = gql`
    query Drivers {
  drivers {
    ...driverPart
  }
}
    ${DriverPartFragmentDoc}`;

/**
 * __useDriversQuery__
 *
 * To run a query within a React component, call `useDriversQuery` and pass it any options that fit your needs.
 * When your component renders, `useDriversQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDriversQuery({
 *   variables: {
 *   },
 * });
 */
export function useDriversQuery(baseOptions?: Apollo.QueryHookOptions<DriversQuery, DriversQueryVariables>) {
        return Apollo.useQuery<DriversQuery, DriversQueryVariables>(DriversDocument, baseOptions);
      }
export function useDriversLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DriversQuery, DriversQueryVariables>) {
          return Apollo.useLazyQuery<DriversQuery, DriversQueryVariables>(DriversDocument, baseOptions);
        }
export type DriversQueryHookResult = ReturnType<typeof useDriversQuery>;
export type DriversLazyQueryHookResult = ReturnType<typeof useDriversLazyQuery>;
export type DriversQueryResult = Apollo.QueryResult<DriversQuery, DriversQueryVariables>;
export const DriversOfStudentDocument = gql`
    query DriversOfStudent($parentStudentId: ObjectId!) {
  driversOfStudent(parentStudentId: $parentStudentId) {
    ...driverPart
  }
}
    ${DriverPartFragmentDoc}`;

/**
 * __useDriversOfStudentQuery__
 *
 * To run a query within a React component, call `useDriversOfStudentQuery` and pass it any options that fit your needs.
 * When your component renders, `useDriversOfStudentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDriversOfStudentQuery({
 *   variables: {
 *      parentStudentId: // value for 'parentStudentId'
 *   },
 * });
 */
export function useDriversOfStudentQuery(baseOptions?: Apollo.QueryHookOptions<DriversOfStudentQuery, DriversOfStudentQueryVariables>) {
        return Apollo.useQuery<DriversOfStudentQuery, DriversOfStudentQueryVariables>(DriversOfStudentDocument, baseOptions);
      }
export function useDriversOfStudentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DriversOfStudentQuery, DriversOfStudentQueryVariables>) {
          return Apollo.useLazyQuery<DriversOfStudentQuery, DriversOfStudentQueryVariables>(DriversOfStudentDocument, baseOptions);
        }
export type DriversOfStudentQueryHookResult = ReturnType<typeof useDriversOfStudentQuery>;
export type DriversOfStudentLazyQueryHookResult = ReturnType<typeof useDriversOfStudentLazyQuery>;
export type DriversOfStudentQueryResult = Apollo.QueryResult<DriversOfStudentQuery, DriversOfStudentQueryVariables>;
export const DriversWithAppDocument = gql`
    query DriversWithApp($parentStudentId: ObjectId!) {
  drivers {
    _id
    firstName
    lastName
    fullName
    createdAt
    citizenshipId
    address {
      ...address
    }
    driver {
      _id
      institutions {
        ...driverInstitution
      }
      requestApp(parentStudentId: $parentStudentId) {
        ...driverStudentApplication
      }
    }
  }
}
    ${AddressFragmentDoc}
${DriverInstitutionFragmentDoc}
${DriverStudentApplicationFragmentDoc}`;

/**
 * __useDriversWithAppQuery__
 *
 * To run a query within a React component, call `useDriversWithAppQuery` and pass it any options that fit your needs.
 * When your component renders, `useDriversWithAppQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDriversWithAppQuery({
 *   variables: {
 *      parentStudentId: // value for 'parentStudentId'
 *   },
 * });
 */
export function useDriversWithAppQuery(baseOptions?: Apollo.QueryHookOptions<DriversWithAppQuery, DriversWithAppQueryVariables>) {
        return Apollo.useQuery<DriversWithAppQuery, DriversWithAppQueryVariables>(DriversWithAppDocument, baseOptions);
      }
export function useDriversWithAppLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DriversWithAppQuery, DriversWithAppQueryVariables>) {
          return Apollo.useLazyQuery<DriversWithAppQuery, DriversWithAppQueryVariables>(DriversWithAppDocument, baseOptions);
        }
export type DriversWithAppQueryHookResult = ReturnType<typeof useDriversWithAppQuery>;
export type DriversWithAppLazyQueryHookResult = ReturnType<typeof useDriversWithAppLazyQuery>;
export type DriversWithAppQueryResult = Apollo.QueryResult<DriversWithAppQuery, DriversWithAppQueryVariables>;
export const DismissDriverDocument = gql`
    mutation DismissDriver($driverId: ObjectId!) {
  dismissDriver(driverId: $driverId) {
    ...removeResult
  }
}
    ${RemoveResultFragmentDoc}`;
export type DismissDriverMutationFn = Apollo.MutationFunction<DismissDriverMutation, DismissDriverMutationVariables>;

/**
 * __useDismissDriverMutation__
 *
 * To run a mutation, you first call `useDismissDriverMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDismissDriverMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [dismissDriverMutation, { data, loading, error }] = useDismissDriverMutation({
 *   variables: {
 *      driverId: // value for 'driverId'
 *   },
 * });
 */
export function useDismissDriverMutation(baseOptions?: Apollo.MutationHookOptions<DismissDriverMutation, DismissDriverMutationVariables>) {
        return Apollo.useMutation<DismissDriverMutation, DismissDriverMutationVariables>(DismissDriverDocument, baseOptions);
      }
export type DismissDriverMutationHookResult = ReturnType<typeof useDismissDriverMutation>;
export type DismissDriverMutationResult = Apollo.MutationResult<DismissDriverMutation>;
export type DismissDriverMutationOptions = Apollo.BaseMutationOptions<DismissDriverMutation, DismissDriverMutationVariables>;
export const DriverJobRequestsDocument = gql`
    query DriverJobRequests {
  driverJobRequests {
    ...driverApplication
  }
}
    ${DriverApplicationFragmentDoc}`;

/**
 * __useDriverJobRequestsQuery__
 *
 * To run a query within a React component, call `useDriverJobRequestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDriverJobRequestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDriverJobRequestsQuery({
 *   variables: {
 *   },
 * });
 */
export function useDriverJobRequestsQuery(baseOptions?: Apollo.QueryHookOptions<DriverJobRequestsQuery, DriverJobRequestsQueryVariables>) {
        return Apollo.useQuery<DriverJobRequestsQuery, DriverJobRequestsQueryVariables>(DriverJobRequestsDocument, baseOptions);
      }
export function useDriverJobRequestsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DriverJobRequestsQuery, DriverJobRequestsQueryVariables>) {
          return Apollo.useLazyQuery<DriverJobRequestsQuery, DriverJobRequestsQueryVariables>(DriverJobRequestsDocument, baseOptions);
        }
export type DriverJobRequestsQueryHookResult = ReturnType<typeof useDriverJobRequestsQuery>;
export type DriverJobRequestsLazyQueryHookResult = ReturnType<typeof useDriverJobRequestsLazyQuery>;
export type DriverJobRequestsQueryResult = Apollo.QueryResult<DriverJobRequestsQuery, DriverJobRequestsQueryVariables>;
export const AcceptDriverInvitationDocument = gql`
    mutation AcceptDriverInvitation($invitationId: ObjectId!, $r: Boolean, $d: Boolean) {
  acceptDriverInvitation(invitationId: $invitationId, r: $r, d: $d) {
    ...driverApplication
  }
}
    ${DriverApplicationFragmentDoc}`;
export type AcceptDriverInvitationMutationFn = Apollo.MutationFunction<AcceptDriverInvitationMutation, AcceptDriverInvitationMutationVariables>;

/**
 * __useAcceptDriverInvitationMutation__
 *
 * To run a mutation, you first call `useAcceptDriverInvitationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptDriverInvitationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptDriverInvitationMutation, { data, loading, error }] = useAcceptDriverInvitationMutation({
 *   variables: {
 *      invitationId: // value for 'invitationId'
 *      r: // value for 'r'
 *      d: // value for 'd'
 *   },
 * });
 */
export function useAcceptDriverInvitationMutation(baseOptions?: Apollo.MutationHookOptions<AcceptDriverInvitationMutation, AcceptDriverInvitationMutationVariables>) {
        return Apollo.useMutation<AcceptDriverInvitationMutation, AcceptDriverInvitationMutationVariables>(AcceptDriverInvitationDocument, baseOptions);
      }
export type AcceptDriverInvitationMutationHookResult = ReturnType<typeof useAcceptDriverInvitationMutation>;
export type AcceptDriverInvitationMutationResult = Apollo.MutationResult<AcceptDriverInvitationMutation>;
export type AcceptDriverInvitationMutationOptions = Apollo.BaseMutationOptions<AcceptDriverInvitationMutation, AcceptDriverInvitationMutationVariables>;
export const AddDriverDocument = gql`
    mutation AddDriver($applicationId: ObjectId!) {
  addDriver(applicationId: $applicationId) {
    ...user
  }
}
    ${UserFragmentDoc}`;
export type AddDriverMutationFn = Apollo.MutationFunction<AddDriverMutation, AddDriverMutationVariables>;

/**
 * __useAddDriverMutation__
 *
 * To run a mutation, you first call `useAddDriverMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddDriverMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addDriverMutation, { data, loading, error }] = useAddDriverMutation({
 *   variables: {
 *      applicationId: // value for 'applicationId'
 *   },
 * });
 */
export function useAddDriverMutation(baseOptions?: Apollo.MutationHookOptions<AddDriverMutation, AddDriverMutationVariables>) {
        return Apollo.useMutation<AddDriverMutation, AddDriverMutationVariables>(AddDriverDocument, baseOptions);
      }
export type AddDriverMutationHookResult = ReturnType<typeof useAddDriverMutation>;
export type AddDriverMutationResult = Apollo.MutationResult<AddDriverMutation>;
export type AddDriverMutationOptions = Apollo.BaseMutationOptions<AddDriverMutation, AddDriverMutationVariables>;
export const InvitationDriversDocument = gql`
    mutation InvitationDrivers($emails: [String!]!) {
  invitationDrivers(input: {emails: $emails}) {
    ...driverApplication
  }
}
    ${DriverApplicationFragmentDoc}`;
export type InvitationDriversMutationFn = Apollo.MutationFunction<InvitationDriversMutation, InvitationDriversMutationVariables>;

/**
 * __useInvitationDriversMutation__
 *
 * To run a mutation, you first call `useInvitationDriversMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInvitationDriversMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [invitationDriversMutation, { data, loading, error }] = useInvitationDriversMutation({
 *   variables: {
 *      emails: // value for 'emails'
 *   },
 * });
 */
export function useInvitationDriversMutation(baseOptions?: Apollo.MutationHookOptions<InvitationDriversMutation, InvitationDriversMutationVariables>) {
        return Apollo.useMutation<InvitationDriversMutation, InvitationDriversMutationVariables>(InvitationDriversDocument, baseOptions);
      }
export type InvitationDriversMutationHookResult = ReturnType<typeof useInvitationDriversMutation>;
export type InvitationDriversMutationResult = Apollo.MutationResult<InvitationDriversMutation>;
export type InvitationDriversMutationOptions = Apollo.BaseMutationOptions<InvitationDriversMutation, InvitationDriversMutationVariables>;
export const DriverApplicationsDocument = gql`
    query DriverApplications {
  driverApplications {
    ...driverApplication
  }
}
    ${DriverApplicationFragmentDoc}`;

/**
 * __useDriverApplicationsQuery__
 *
 * To run a query within a React component, call `useDriverApplicationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDriverApplicationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDriverApplicationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useDriverApplicationsQuery(baseOptions?: Apollo.QueryHookOptions<DriverApplicationsQuery, DriverApplicationsQueryVariables>) {
        return Apollo.useQuery<DriverApplicationsQuery, DriverApplicationsQueryVariables>(DriverApplicationsDocument, baseOptions);
      }
export function useDriverApplicationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DriverApplicationsQuery, DriverApplicationsQueryVariables>) {
          return Apollo.useLazyQuery<DriverApplicationsQuery, DriverApplicationsQueryVariables>(DriverApplicationsDocument, baseOptions);
        }
export type DriverApplicationsQueryHookResult = ReturnType<typeof useDriverApplicationsQuery>;
export type DriverApplicationsLazyQueryHookResult = ReturnType<typeof useDriverApplicationsLazyQuery>;
export type DriverApplicationsQueryResult = Apollo.QueryResult<DriverApplicationsQuery, DriverApplicationsQueryVariables>;
export const DriverServiceRequestsDocument = gql`
    query driverServiceRequests {
  driverServiceRequests {
    ...driverStudentApplication
  }
}
    ${DriverStudentApplicationFragmentDoc}`;

/**
 * __useDriverServiceRequestsQuery__
 *
 * To run a query within a React component, call `useDriverServiceRequestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDriverServiceRequestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDriverServiceRequestsQuery({
 *   variables: {
 *   },
 * });
 */
export function useDriverServiceRequestsQuery(baseOptions?: Apollo.QueryHookOptions<DriverServiceRequestsQuery, DriverServiceRequestsQueryVariables>) {
        return Apollo.useQuery<DriverServiceRequestsQuery, DriverServiceRequestsQueryVariables>(DriverServiceRequestsDocument, baseOptions);
      }
export function useDriverServiceRequestsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DriverServiceRequestsQuery, DriverServiceRequestsQueryVariables>) {
          return Apollo.useLazyQuery<DriverServiceRequestsQuery, DriverServiceRequestsQueryVariables>(DriverServiceRequestsDocument, baseOptions);
        }
export type DriverServiceRequestsQueryHookResult = ReturnType<typeof useDriverServiceRequestsQuery>;
export type DriverServiceRequestsLazyQueryHookResult = ReturnType<typeof useDriverServiceRequestsLazyQuery>;
export type DriverServiceRequestsQueryResult = Apollo.QueryResult<DriverServiceRequestsQuery, DriverServiceRequestsQueryVariables>;
export const CancelServiceRequestDriverDocument = gql`
    mutation CancelServiceRequestDriver($requestId: ObjectId!) {
  cancelServiceRequestDriver(requestId: $requestId) {
    ...removeResult
  }
}
    ${RemoveResultFragmentDoc}`;
export type CancelServiceRequestDriverMutationFn = Apollo.MutationFunction<CancelServiceRequestDriverMutation, CancelServiceRequestDriverMutationVariables>;

/**
 * __useCancelServiceRequestDriverMutation__
 *
 * To run a mutation, you first call `useCancelServiceRequestDriverMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelServiceRequestDriverMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelServiceRequestDriverMutation, { data, loading, error }] = useCancelServiceRequestDriverMutation({
 *   variables: {
 *      requestId: // value for 'requestId'
 *   },
 * });
 */
export function useCancelServiceRequestDriverMutation(baseOptions?: Apollo.MutationHookOptions<CancelServiceRequestDriverMutation, CancelServiceRequestDriverMutationVariables>) {
        return Apollo.useMutation<CancelServiceRequestDriverMutation, CancelServiceRequestDriverMutationVariables>(CancelServiceRequestDriverDocument, baseOptions);
      }
export type CancelServiceRequestDriverMutationHookResult = ReturnType<typeof useCancelServiceRequestDriverMutation>;
export type CancelServiceRequestDriverMutationResult = Apollo.MutationResult<CancelServiceRequestDriverMutation>;
export type CancelServiceRequestDriverMutationOptions = Apollo.BaseMutationOptions<CancelServiceRequestDriverMutation, CancelServiceRequestDriverMutationVariables>;
export const AcceptDriverServiceInvitationDocument = gql`
    mutation AcceptDriverServiceInvitation($invitationId: ObjectId!) {
  acceptDriverServiceInvitation(invitationId: $invitationId) {
    success
  }
}
    `;
export type AcceptDriverServiceInvitationMutationFn = Apollo.MutationFunction<AcceptDriverServiceInvitationMutation, AcceptDriverServiceInvitationMutationVariables>;

/**
 * __useAcceptDriverServiceInvitationMutation__
 *
 * To run a mutation, you first call `useAcceptDriverServiceInvitationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptDriverServiceInvitationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptDriverServiceInvitationMutation, { data, loading, error }] = useAcceptDriverServiceInvitationMutation({
 *   variables: {
 *      invitationId: // value for 'invitationId'
 *   },
 * });
 */
export function useAcceptDriverServiceInvitationMutation(baseOptions?: Apollo.MutationHookOptions<AcceptDriverServiceInvitationMutation, AcceptDriverServiceInvitationMutationVariables>) {
        return Apollo.useMutation<AcceptDriverServiceInvitationMutation, AcceptDriverServiceInvitationMutationVariables>(AcceptDriverServiceInvitationDocument, baseOptions);
      }
export type AcceptDriverServiceInvitationMutationHookResult = ReturnType<typeof useAcceptDriverServiceInvitationMutation>;
export type AcceptDriverServiceInvitationMutationResult = Apollo.MutationResult<AcceptDriverServiceInvitationMutation>;
export type AcceptDriverServiceInvitationMutationOptions = Apollo.BaseMutationOptions<AcceptDriverServiceInvitationMutation, AcceptDriverServiceInvitationMutationVariables>;
export const CancelServiceRequestUserDocument = gql`
    mutation CancelServiceRequestUser($requestId: ObjectId!, $parentStudentId: ObjectId!) {
  cancelServiceRequestUser(requestId: $requestId, parentStudentId: $parentStudentId) {
    ...removeResult
  }
}
    ${RemoveResultFragmentDoc}`;
export type CancelServiceRequestUserMutationFn = Apollo.MutationFunction<CancelServiceRequestUserMutation, CancelServiceRequestUserMutationVariables>;

/**
 * __useCancelServiceRequestUserMutation__
 *
 * To run a mutation, you first call `useCancelServiceRequestUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelServiceRequestUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelServiceRequestUserMutation, { data, loading, error }] = useCancelServiceRequestUserMutation({
 *   variables: {
 *      requestId: // value for 'requestId'
 *      parentStudentId: // value for 'parentStudentId'
 *   },
 * });
 */
export function useCancelServiceRequestUserMutation(baseOptions?: Apollo.MutationHookOptions<CancelServiceRequestUserMutation, CancelServiceRequestUserMutationVariables>) {
        return Apollo.useMutation<CancelServiceRequestUserMutation, CancelServiceRequestUserMutationVariables>(CancelServiceRequestUserDocument, baseOptions);
      }
export type CancelServiceRequestUserMutationHookResult = ReturnType<typeof useCancelServiceRequestUserMutation>;
export type CancelServiceRequestUserMutationResult = Apollo.MutationResult<CancelServiceRequestUserMutation>;
export type CancelServiceRequestUserMutationOptions = Apollo.BaseMutationOptions<CancelServiceRequestUserMutation, CancelServiceRequestUserMutationVariables>;
export const SendInvitationDriverDocument = gql`
    mutation SendInvitationDriver($parentStudentId: ObjectId!, $driverId: ObjectId!) {
  sendInvitationDriver(parentStudentId: $parentStudentId, driverId: $driverId) {
    ...driverStudentApplication
  }
}
    ${DriverStudentApplicationFragmentDoc}`;
export type SendInvitationDriverMutationFn = Apollo.MutationFunction<SendInvitationDriverMutation, SendInvitationDriverMutationVariables>;

/**
 * __useSendInvitationDriverMutation__
 *
 * To run a mutation, you first call `useSendInvitationDriverMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendInvitationDriverMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendInvitationDriverMutation, { data, loading, error }] = useSendInvitationDriverMutation({
 *   variables: {
 *      parentStudentId: // value for 'parentStudentId'
 *      driverId: // value for 'driverId'
 *   },
 * });
 */
export function useSendInvitationDriverMutation(baseOptions?: Apollo.MutationHookOptions<SendInvitationDriverMutation, SendInvitationDriverMutationVariables>) {
        return Apollo.useMutation<SendInvitationDriverMutation, SendInvitationDriverMutationVariables>(SendInvitationDriverDocument, baseOptions);
      }
export type SendInvitationDriverMutationHookResult = ReturnType<typeof useSendInvitationDriverMutation>;
export type SendInvitationDriverMutationResult = Apollo.MutationResult<SendInvitationDriverMutation>;
export type SendInvitationDriverMutationOptions = Apollo.BaseMutationOptions<SendInvitationDriverMutation, SendInvitationDriverMutationVariables>;
export const EducationsDocument = gql`
    query Educations {
  educations {
    ...education
  }
}
    ${EducationFragmentDoc}`;

/**
 * __useEducationsQuery__
 *
 * To run a query within a React component, call `useEducationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useEducationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEducationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useEducationsQuery(baseOptions?: Apollo.QueryHookOptions<EducationsQuery, EducationsQueryVariables>) {
        return Apollo.useQuery<EducationsQuery, EducationsQueryVariables>(EducationsDocument, baseOptions);
      }
export function useEducationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EducationsQuery, EducationsQueryVariables>) {
          return Apollo.useLazyQuery<EducationsQuery, EducationsQueryVariables>(EducationsDocument, baseOptions);
        }
export type EducationsQueryHookResult = ReturnType<typeof useEducationsQuery>;
export type EducationsLazyQueryHookResult = ReturnType<typeof useEducationsLazyQuery>;
export type EducationsQueryResult = Apollo.QueryResult<EducationsQuery, EducationsQueryVariables>;
export const EditEducationDocument = gql`
    mutation EditEducation($educationLevel: Int!, $educationLevelName: String!, $universityId: ObjectId!, $universityName: String!, $educationType: Int!, $educationTypeName: String!, $educationlanguage: Int!, $educationlanguageName: String!, $departmentId: ObjectId!, $startDate: DateTime!, $finishDate: DateTime) {
  editEducation(education: {educationLevel: $educationLevel, universityId: $universityId, universityName: $universityName, educationLevelName: $educationLevelName, educationTypeName: $educationTypeName, educationType: $educationType, educationlanguage: $educationlanguage, educationlanguageName: $educationlanguageName, departmentId: $departmentId, startDate: $startDate, finishDate: $finishDate}) {
    ...education
  }
}
    ${EducationFragmentDoc}`;
export type EditEducationMutationFn = Apollo.MutationFunction<EditEducationMutation, EditEducationMutationVariables>;

/**
 * __useEditEducationMutation__
 *
 * To run a mutation, you first call `useEditEducationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditEducationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editEducationMutation, { data, loading, error }] = useEditEducationMutation({
 *   variables: {
 *      educationLevel: // value for 'educationLevel'
 *      educationLevelName: // value for 'educationLevelName'
 *      universityId: // value for 'universityId'
 *      universityName: // value for 'universityName'
 *      educationType: // value for 'educationType'
 *      educationTypeName: // value for 'educationTypeName'
 *      educationlanguage: // value for 'educationlanguage'
 *      educationlanguageName: // value for 'educationlanguageName'
 *      departmentId: // value for 'departmentId'
 *      startDate: // value for 'startDate'
 *      finishDate: // value for 'finishDate'
 *   },
 * });
 */
export function useEditEducationMutation(baseOptions?: Apollo.MutationHookOptions<EditEducationMutation, EditEducationMutationVariables>) {
        return Apollo.useMutation<EditEducationMutation, EditEducationMutationVariables>(EditEducationDocument, baseOptions);
      }
export type EditEducationMutationHookResult = ReturnType<typeof useEditEducationMutation>;
export type EditEducationMutationResult = Apollo.MutationResult<EditEducationMutation>;
export type EditEducationMutationOptions = Apollo.BaseMutationOptions<EditEducationMutation, EditEducationMutationVariables>;
export const EditEducationYearDocument = gql`
    mutation EditEducationYear($schoolId: ObjectId!, $name: String!, $terms: [TermInput!]!) {
  editEducationYear(educationYear: {schoolId: $schoolId, name: $name, terms: $terms}) {
    ...educationYear
  }
}
    ${EducationYearFragmentDoc}`;
export type EditEducationYearMutationFn = Apollo.MutationFunction<EditEducationYearMutation, EditEducationYearMutationVariables>;

/**
 * __useEditEducationYearMutation__
 *
 * To run a mutation, you first call `useEditEducationYearMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditEducationYearMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editEducationYearMutation, { data, loading, error }] = useEditEducationYearMutation({
 *   variables: {
 *      schoolId: // value for 'schoolId'
 *      name: // value for 'name'
 *      terms: // value for 'terms'
 *   },
 * });
 */
export function useEditEducationYearMutation(baseOptions?: Apollo.MutationHookOptions<EditEducationYearMutation, EditEducationYearMutationVariables>) {
        return Apollo.useMutation<EditEducationYearMutation, EditEducationYearMutationVariables>(EditEducationYearDocument, baseOptions);
      }
export type EditEducationYearMutationHookResult = ReturnType<typeof useEditEducationYearMutation>;
export type EditEducationYearMutationResult = Apollo.MutationResult<EditEducationYearMutation>;
export type EditEducationYearMutationOptions = Apollo.BaseMutationOptions<EditEducationYearMutation, EditEducationYearMutationVariables>;
export const DeleteEducationYearDocument = gql`
    mutation DeleteEducationYear($schoolId: ObjectId!, $id: ObjectId!) {
  deleteEducationYear(schoolId: $schoolId, id: $id) {
    ...removeResult
  }
}
    ${RemoveResultFragmentDoc}`;
export type DeleteEducationYearMutationFn = Apollo.MutationFunction<DeleteEducationYearMutation, DeleteEducationYearMutationVariables>;

/**
 * __useDeleteEducationYearMutation__
 *
 * To run a mutation, you first call `useDeleteEducationYearMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteEducationYearMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteEducationYearMutation, { data, loading, error }] = useDeleteEducationYearMutation({
 *   variables: {
 *      schoolId: // value for 'schoolId'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteEducationYearMutation(baseOptions?: Apollo.MutationHookOptions<DeleteEducationYearMutation, DeleteEducationYearMutationVariables>) {
        return Apollo.useMutation<DeleteEducationYearMutation, DeleteEducationYearMutationVariables>(DeleteEducationYearDocument, baseOptions);
      }
export type DeleteEducationYearMutationHookResult = ReturnType<typeof useDeleteEducationYearMutation>;
export type DeleteEducationYearMutationResult = Apollo.MutationResult<DeleteEducationYearMutation>;
export type DeleteEducationYearMutationOptions = Apollo.BaseMutationOptions<DeleteEducationYearMutation, DeleteEducationYearMutationVariables>;
export const ExamsDocument = gql`
    query Exams($lessonId: ObjectId!) {
  exams(lessonId: $lessonId) {
    ...exam
  }
}
    ${ExamFragmentDoc}`;

/**
 * __useExamsQuery__
 *
 * To run a query within a React component, call `useExamsQuery` and pass it any options that fit your needs.
 * When your component renders, `useExamsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useExamsQuery({
 *   variables: {
 *      lessonId: // value for 'lessonId'
 *   },
 * });
 */
export function useExamsQuery(baseOptions?: Apollo.QueryHookOptions<ExamsQuery, ExamsQueryVariables>) {
        return Apollo.useQuery<ExamsQuery, ExamsQueryVariables>(ExamsDocument, baseOptions);
      }
export function useExamsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ExamsQuery, ExamsQueryVariables>) {
          return Apollo.useLazyQuery<ExamsQuery, ExamsQueryVariables>(ExamsDocument, baseOptions);
        }
export type ExamsQueryHookResult = ReturnType<typeof useExamsQuery>;
export type ExamsLazyQueryHookResult = ReturnType<typeof useExamsLazyQuery>;
export type ExamsQueryResult = Apollo.QueryResult<ExamsQuery, ExamsQueryVariables>;
export const MyExamsDocument = gql`
    query MyExams($lessonId: ObjectId!) {
  myExams(lessonId: $lessonId) {
    ...exam
    termName
  }
}
    ${ExamFragmentDoc}`;

/**
 * __useMyExamsQuery__
 *
 * To run a query within a React component, call `useMyExamsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyExamsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyExamsQuery({
 *   variables: {
 *      lessonId: // value for 'lessonId'
 *   },
 * });
 */
export function useMyExamsQuery(baseOptions?: Apollo.QueryHookOptions<MyExamsQuery, MyExamsQueryVariables>) {
        return Apollo.useQuery<MyExamsQuery, MyExamsQueryVariables>(MyExamsDocument, baseOptions);
      }
export function useMyExamsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyExamsQuery, MyExamsQueryVariables>) {
          return Apollo.useLazyQuery<MyExamsQuery, MyExamsQueryVariables>(MyExamsDocument, baseOptions);
        }
export type MyExamsQueryHookResult = ReturnType<typeof useMyExamsQuery>;
export type MyExamsLazyQueryHookResult = ReturnType<typeof useMyExamsLazyQuery>;
export type MyExamsQueryResult = Apollo.QueryResult<MyExamsQuery, MyExamsQueryVariables>;
export const SetExamDocument = gql`
    mutation SetExam($lessonId: ObjectId!, $lessonHourCode: [Int!]!, $date: DateTime!, $_id: ObjectId) {
  setExam(data: {lessonId: $lessonId, lessonHourCode: $lessonHourCode, date: $date, _id: $_id}) {
    ...exam
  }
}
    ${ExamFragmentDoc}`;
export type SetExamMutationFn = Apollo.MutationFunction<SetExamMutation, SetExamMutationVariables>;

/**
 * __useSetExamMutation__
 *
 * To run a mutation, you first call `useSetExamMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetExamMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setExamMutation, { data, loading, error }] = useSetExamMutation({
 *   variables: {
 *      lessonId: // value for 'lessonId'
 *      lessonHourCode: // value for 'lessonHourCode'
 *      date: // value for 'date'
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useSetExamMutation(baseOptions?: Apollo.MutationHookOptions<SetExamMutation, SetExamMutationVariables>) {
        return Apollo.useMutation<SetExamMutation, SetExamMutationVariables>(SetExamDocument, baseOptions);
      }
export type SetExamMutationHookResult = ReturnType<typeof useSetExamMutation>;
export type SetExamMutationResult = Apollo.MutationResult<SetExamMutation>;
export type SetExamMutationOptions = Apollo.BaseMutationOptions<SetExamMutation, SetExamMutationVariables>;
export const DeleteExamDocument = gql`
    mutation DeleteExam($lessonId: ObjectId!, $examId: ObjectId!) {
  deleteExam(lessonId: $lessonId, examId: $examId) {
    ...removeResult
  }
}
    ${RemoveResultFragmentDoc}`;
export type DeleteExamMutationFn = Apollo.MutationFunction<DeleteExamMutation, DeleteExamMutationVariables>;

/**
 * __useDeleteExamMutation__
 *
 * To run a mutation, you first call `useDeleteExamMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteExamMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteExamMutation, { data, loading, error }] = useDeleteExamMutation({
 *   variables: {
 *      lessonId: // value for 'lessonId'
 *      examId: // value for 'examId'
 *   },
 * });
 */
export function useDeleteExamMutation(baseOptions?: Apollo.MutationHookOptions<DeleteExamMutation, DeleteExamMutationVariables>) {
        return Apollo.useMutation<DeleteExamMutation, DeleteExamMutationVariables>(DeleteExamDocument, baseOptions);
      }
export type DeleteExamMutationHookResult = ReturnType<typeof useDeleteExamMutation>;
export type DeleteExamMutationResult = Apollo.MutationResult<DeleteExamMutation>;
export type DeleteExamMutationOptions = Apollo.BaseMutationOptions<DeleteExamMutation, DeleteExamMutationVariables>;
export const SetExamGradeDocument = gql`
    mutation SetExamGrade($lessonId: ObjectId!, $examId: ObjectId!, $studentId: ObjectId!, $grade: Int!) {
  setExamGrade(lessonId: $lessonId, examId: $examId, studentId: $studentId, grade: $grade) {
    ...grade
  }
}
    ${GradeFragmentDoc}`;
export type SetExamGradeMutationFn = Apollo.MutationFunction<SetExamGradeMutation, SetExamGradeMutationVariables>;

/**
 * __useSetExamGradeMutation__
 *
 * To run a mutation, you first call `useSetExamGradeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetExamGradeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setExamGradeMutation, { data, loading, error }] = useSetExamGradeMutation({
 *   variables: {
 *      lessonId: // value for 'lessonId'
 *      examId: // value for 'examId'
 *      studentId: // value for 'studentId'
 *      grade: // value for 'grade'
 *   },
 * });
 */
export function useSetExamGradeMutation(baseOptions?: Apollo.MutationHookOptions<SetExamGradeMutation, SetExamGradeMutationVariables>) {
        return Apollo.useMutation<SetExamGradeMutation, SetExamGradeMutationVariables>(SetExamGradeDocument, baseOptions);
      }
export type SetExamGradeMutationHookResult = ReturnType<typeof useSetExamGradeMutation>;
export type SetExamGradeMutationResult = Apollo.MutationResult<SetExamGradeMutation>;
export type SetExamGradeMutationOptions = Apollo.BaseMutationOptions<SetExamGradeMutation, SetExamGradeMutationVariables>;
export const HomeWorksDocument = gql`
    query HomeWorks($lessonId: ID!, $skip: Int, $i: ID) {
  homeWorks(lessonId: $lessonId, skip: $skip, i: $i) {
    ...homeWork
  }
}
    ${HomeWorkFragmentDoc}`;

/**
 * __useHomeWorksQuery__
 *
 * To run a query within a React component, call `useHomeWorksQuery` and pass it any options that fit your needs.
 * When your component renders, `useHomeWorksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHomeWorksQuery({
 *   variables: {
 *      lessonId: // value for 'lessonId'
 *      skip: // value for 'skip'
 *      i: // value for 'i'
 *   },
 * });
 */
export function useHomeWorksQuery(baseOptions?: Apollo.QueryHookOptions<HomeWorksQuery, HomeWorksQueryVariables>) {
        return Apollo.useQuery<HomeWorksQuery, HomeWorksQueryVariables>(HomeWorksDocument, baseOptions);
      }
export function useHomeWorksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HomeWorksQuery, HomeWorksQueryVariables>) {
          return Apollo.useLazyQuery<HomeWorksQuery, HomeWorksQueryVariables>(HomeWorksDocument, baseOptions);
        }
export type HomeWorksQueryHookResult = ReturnType<typeof useHomeWorksQuery>;
export type HomeWorksLazyQueryHookResult = ReturnType<typeof useHomeWorksLazyQuery>;
export type HomeWorksQueryResult = Apollo.QueryResult<HomeWorksQuery, HomeWorksQueryVariables>;
export const HomeWorksStudentDocument = gql`
    query HomeWorksStudent($lessonId: ID!, $skip: Int) {
  homeWorks(lessonId: $lessonId, skip: $skip) {
    ...homeWork
  }
}
    ${HomeWorkFragmentDoc}`;

/**
 * __useHomeWorksStudentQuery__
 *
 * To run a query within a React component, call `useHomeWorksStudentQuery` and pass it any options that fit your needs.
 * When your component renders, `useHomeWorksStudentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHomeWorksStudentQuery({
 *   variables: {
 *      lessonId: // value for 'lessonId'
 *      skip: // value for 'skip'
 *   },
 * });
 */
export function useHomeWorksStudentQuery(baseOptions?: Apollo.QueryHookOptions<HomeWorksStudentQuery, HomeWorksStudentQueryVariables>) {
        return Apollo.useQuery<HomeWorksStudentQuery, HomeWorksStudentQueryVariables>(HomeWorksStudentDocument, baseOptions);
      }
export function useHomeWorksStudentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HomeWorksStudentQuery, HomeWorksStudentQueryVariables>) {
          return Apollo.useLazyQuery<HomeWorksStudentQuery, HomeWorksStudentQueryVariables>(HomeWorksStudentDocument, baseOptions);
        }
export type HomeWorksStudentQueryHookResult = ReturnType<typeof useHomeWorksStudentQuery>;
export type HomeWorksStudentLazyQueryHookResult = ReturnType<typeof useHomeWorksStudentLazyQuery>;
export type HomeWorksStudentQueryResult = Apollo.QueryResult<HomeWorksStudentQuery, HomeWorksStudentQueryVariables>;
export const SendHomeWorkDocument = gql`
    mutation SendHomeWork($lessonId: ObjectId!, $message: String!, $title: String!, $homeWorkFile: Upload) {
  sendHomeWork(data: {lessonId: $lessonId, message: $message, title: $title}, homeWorkFile: $homeWorkFile) {
    ...homeWork
  }
}
    ${HomeWorkFragmentDoc}`;
export type SendHomeWorkMutationFn = Apollo.MutationFunction<SendHomeWorkMutation, SendHomeWorkMutationVariables>;

/**
 * __useSendHomeWorkMutation__
 *
 * To run a mutation, you first call `useSendHomeWorkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendHomeWorkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendHomeWorkMutation, { data, loading, error }] = useSendHomeWorkMutation({
 *   variables: {
 *      lessonId: // value for 'lessonId'
 *      message: // value for 'message'
 *      title: // value for 'title'
 *      homeWorkFile: // value for 'homeWorkFile'
 *   },
 * });
 */
export function useSendHomeWorkMutation(baseOptions?: Apollo.MutationHookOptions<SendHomeWorkMutation, SendHomeWorkMutationVariables>) {
        return Apollo.useMutation<SendHomeWorkMutation, SendHomeWorkMutationVariables>(SendHomeWorkDocument, baseOptions);
      }
export type SendHomeWorkMutationHookResult = ReturnType<typeof useSendHomeWorkMutation>;
export type SendHomeWorkMutationResult = Apollo.MutationResult<SendHomeWorkMutation>;
export type SendHomeWorkMutationOptions = Apollo.BaseMutationOptions<SendHomeWorkMutation, SendHomeWorkMutationVariables>;
export const MyHourDocument = gql`
    query MyHour($parentStudentId: ObjectId) {
  myHour(parentStudentId: $parentStudentId) {
    ...hour
  }
}
    ${HourFragmentDoc}`;

/**
 * __useMyHourQuery__
 *
 * To run a query within a React component, call `useMyHourQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyHourQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyHourQuery({
 *   variables: {
 *      parentStudentId: // value for 'parentStudentId'
 *   },
 * });
 */
export function useMyHourQuery(baseOptions?: Apollo.QueryHookOptions<MyHourQuery, MyHourQueryVariables>) {
        return Apollo.useQuery<MyHourQuery, MyHourQueryVariables>(MyHourDocument, baseOptions);
      }
export function useMyHourLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyHourQuery, MyHourQueryVariables>) {
          return Apollo.useLazyQuery<MyHourQuery, MyHourQueryVariables>(MyHourDocument, baseOptions);
        }
export type MyHourQueryHookResult = ReturnType<typeof useMyHourQuery>;
export type MyHourLazyQueryHookResult = ReturnType<typeof useMyHourLazyQuery>;
export type MyHourQueryResult = Apollo.QueryResult<MyHourQuery, MyHourQueryVariables>;
export const IlsDocument = gql`
    query Ils($query: String!) {
  ils(query: $query) {
    _id
    il
    ilceleri
  }
}
    `;

/**
 * __useIlsQuery__
 *
 * To run a query within a React component, call `useIlsQuery` and pass it any options that fit your needs.
 * When your component renders, `useIlsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIlsQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useIlsQuery(baseOptions?: Apollo.QueryHookOptions<IlsQuery, IlsQueryVariables>) {
        return Apollo.useQuery<IlsQuery, IlsQueryVariables>(IlsDocument, baseOptions);
      }
export function useIlsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IlsQuery, IlsQueryVariables>) {
          return Apollo.useLazyQuery<IlsQuery, IlsQueryVariables>(IlsDocument, baseOptions);
        }
export type IlsQueryHookResult = ReturnType<typeof useIlsQuery>;
export type IlsLazyQueryHookResult = ReturnType<typeof useIlsLazyQuery>;
export type IlsQueryResult = Apollo.QueryResult<IlsQuery, IlsQueryVariables>;
export const InboxsDocument = gql`
    query Inboxs($skip: Int!) {
  inboxs(skip: $skip) {
    ...inbox
  }
}
    ${InboxFragmentDoc}`;

/**
 * __useInboxsQuery__
 *
 * To run a query within a React component, call `useInboxsQuery` and pass it any options that fit your needs.
 * When your component renders, `useInboxsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInboxsQuery({
 *   variables: {
 *      skip: // value for 'skip'
 *   },
 * });
 */
export function useInboxsQuery(baseOptions?: Apollo.QueryHookOptions<InboxsQuery, InboxsQueryVariables>) {
        return Apollo.useQuery<InboxsQuery, InboxsQueryVariables>(InboxsDocument, baseOptions);
      }
export function useInboxsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InboxsQuery, InboxsQueryVariables>) {
          return Apollo.useLazyQuery<InboxsQuery, InboxsQueryVariables>(InboxsDocument, baseOptions);
        }
export type InboxsQueryHookResult = ReturnType<typeof useInboxsQuery>;
export type InboxsLazyQueryHookResult = ReturnType<typeof useInboxsLazyQuery>;
export type InboxsQueryResult = Apollo.QueryResult<InboxsQuery, InboxsQueryVariables>;
export const InboxDocument = gql`
    query Inbox($inboxId: ObjectId, $to: [ObjectId!]) {
  inbox(inboxId: $inboxId, to: $to) {
    ...inbox
  }
}
    ${InboxFragmentDoc}`;

/**
 * __useInboxQuery__
 *
 * To run a query within a React component, call `useInboxQuery` and pass it any options that fit your needs.
 * When your component renders, `useInboxQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInboxQuery({
 *   variables: {
 *      inboxId: // value for 'inboxId'
 *      to: // value for 'to'
 *   },
 * });
 */
export function useInboxQuery(baseOptions?: Apollo.QueryHookOptions<InboxQuery, InboxQueryVariables>) {
        return Apollo.useQuery<InboxQuery, InboxQueryVariables>(InboxDocument, baseOptions);
      }
export function useInboxLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InboxQuery, InboxQueryVariables>) {
          return Apollo.useLazyQuery<InboxQuery, InboxQueryVariables>(InboxDocument, baseOptions);
        }
export type InboxQueryHookResult = ReturnType<typeof useInboxQuery>;
export type InboxLazyQueryHookResult = ReturnType<typeof useInboxLazyQuery>;
export type InboxQueryResult = Apollo.QueryResult<InboxQuery, InboxQueryVariables>;
export const UnReadMessageCountDocument = gql`
    query UnReadMessageCount {
  unReadMessageCount
}
    `;

/**
 * __useUnReadMessageCountQuery__
 *
 * To run a query within a React component, call `useUnReadMessageCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useUnReadMessageCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUnReadMessageCountQuery({
 *   variables: {
 *   },
 * });
 */
export function useUnReadMessageCountQuery(baseOptions?: Apollo.QueryHookOptions<UnReadMessageCountQuery, UnReadMessageCountQueryVariables>) {
        return Apollo.useQuery<UnReadMessageCountQuery, UnReadMessageCountQueryVariables>(UnReadMessageCountDocument, baseOptions);
      }
export function useUnReadMessageCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UnReadMessageCountQuery, UnReadMessageCountQueryVariables>) {
          return Apollo.useLazyQuery<UnReadMessageCountQuery, UnReadMessageCountQueryVariables>(UnReadMessageCountDocument, baseOptions);
        }
export type UnReadMessageCountQueryHookResult = ReturnType<typeof useUnReadMessageCountQuery>;
export type UnReadMessageCountLazyQueryHookResult = ReturnType<typeof useUnReadMessageCountLazyQuery>;
export type UnReadMessageCountQueryResult = Apollo.QueryResult<UnReadMessageCountQuery, UnReadMessageCountQueryVariables>;
export const LessonsDocument = gql`
    query Lessons($schoolId: ObjectId!, $classId: ObjectId!, $educationYearId: ObjectId!) {
  lessons(data: {schoolId: $schoolId, classId: $classId, educationYearId: $educationYearId}) {
    ...lesson
  }
}
    ${LessonFragmentDoc}`;

/**
 * __useLessonsQuery__
 *
 * To run a query within a React component, call `useLessonsQuery` and pass it any options that fit your needs.
 * When your component renders, `useLessonsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLessonsQuery({
 *   variables: {
 *      schoolId: // value for 'schoolId'
 *      classId: // value for 'classId'
 *      educationYearId: // value for 'educationYearId'
 *   },
 * });
 */
export function useLessonsQuery(baseOptions?: Apollo.QueryHookOptions<LessonsQuery, LessonsQueryVariables>) {
        return Apollo.useQuery<LessonsQuery, LessonsQueryVariables>(LessonsDocument, baseOptions);
      }
export function useLessonsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LessonsQuery, LessonsQueryVariables>) {
          return Apollo.useLazyQuery<LessonsQuery, LessonsQueryVariables>(LessonsDocument, baseOptions);
        }
export type LessonsQueryHookResult = ReturnType<typeof useLessonsQuery>;
export type LessonsLazyQueryHookResult = ReturnType<typeof useLessonsLazyQuery>;
export type LessonsQueryResult = Apollo.QueryResult<LessonsQuery, LessonsQueryVariables>;
export const MyLessonsStudentDocument = gql`
    query MyLessonsStudent($parentStudentId: ObjectId) {
  studentMyLessons(parentStudentId: $parentStudentId) {
    ...lesson
  }
}
    ${LessonFragmentDoc}`;

/**
 * __useMyLessonsStudentQuery__
 *
 * To run a query within a React component, call `useMyLessonsStudentQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyLessonsStudentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyLessonsStudentQuery({
 *   variables: {
 *      parentStudentId: // value for 'parentStudentId'
 *   },
 * });
 */
export function useMyLessonsStudentQuery(baseOptions?: Apollo.QueryHookOptions<MyLessonsStudentQuery, MyLessonsStudentQueryVariables>) {
        return Apollo.useQuery<MyLessonsStudentQuery, MyLessonsStudentQueryVariables>(MyLessonsStudentDocument, baseOptions);
      }
export function useMyLessonsStudentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyLessonsStudentQuery, MyLessonsStudentQueryVariables>) {
          return Apollo.useLazyQuery<MyLessonsStudentQuery, MyLessonsStudentQueryVariables>(MyLessonsStudentDocument, baseOptions);
        }
export type MyLessonsStudentQueryHookResult = ReturnType<typeof useMyLessonsStudentQuery>;
export type MyLessonsStudentLazyQueryHookResult = ReturnType<typeof useMyLessonsStudentLazyQuery>;
export type MyLessonsStudentQueryResult = Apollo.QueryResult<MyLessonsStudentQuery, MyLessonsStudentQueryVariables>;
export const GetLessonDocument = gql`
    query GetLesson($lessonId: ObjectId!) {
  getLesson(lessonId: $lessonId) {
    _id
    ...lesson
  }
}
    ${LessonFragmentDoc}`;

/**
 * __useGetLessonQuery__
 *
 * To run a query within a React component, call `useGetLessonQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLessonQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLessonQuery({
 *   variables: {
 *      lessonId: // value for 'lessonId'
 *   },
 * });
 */
export function useGetLessonQuery(baseOptions?: Apollo.QueryHookOptions<GetLessonQuery, GetLessonQueryVariables>) {
        return Apollo.useQuery<GetLessonQuery, GetLessonQueryVariables>(GetLessonDocument, baseOptions);
      }
export function useGetLessonLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLessonQuery, GetLessonQueryVariables>) {
          return Apollo.useLazyQuery<GetLessonQuery, GetLessonQueryVariables>(GetLessonDocument, baseOptions);
        }
export type GetLessonQueryHookResult = ReturnType<typeof useGetLessonQuery>;
export type GetLessonLazyQueryHookResult = ReturnType<typeof useGetLessonLazyQuery>;
export type GetLessonQueryResult = Apollo.QueryResult<GetLessonQuery, GetLessonQueryVariables>;
export const AddLessonDocument = gql`
    mutation AddLesson($_id: ObjectId, $lessonId: ObjectId, $schoolId: ObjectId!, $classId: ObjectId!, $name: String, $weeklyHour: Int!, $teacherId: ObjectId) {
  addLesson(lesson: {_id: $_id, lessonId: $lessonId, schoolId: $schoolId, classId: $classId, name: $name, weeklyHour: $weeklyHour, teacherId: $teacherId}) {
    ...lesson
  }
}
    ${LessonFragmentDoc}`;
export type AddLessonMutationFn = Apollo.MutationFunction<AddLessonMutation, AddLessonMutationVariables>;

/**
 * __useAddLessonMutation__
 *
 * To run a mutation, you first call `useAddLessonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddLessonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addLessonMutation, { data, loading, error }] = useAddLessonMutation({
 *   variables: {
 *      _id: // value for '_id'
 *      lessonId: // value for 'lessonId'
 *      schoolId: // value for 'schoolId'
 *      classId: // value for 'classId'
 *      name: // value for 'name'
 *      weeklyHour: // value for 'weeklyHour'
 *      teacherId: // value for 'teacherId'
 *   },
 * });
 */
export function useAddLessonMutation(baseOptions?: Apollo.MutationHookOptions<AddLessonMutation, AddLessonMutationVariables>) {
        return Apollo.useMutation<AddLessonMutation, AddLessonMutationVariables>(AddLessonDocument, baseOptions);
      }
export type AddLessonMutationHookResult = ReturnType<typeof useAddLessonMutation>;
export type AddLessonMutationResult = Apollo.MutationResult<AddLessonMutation>;
export type AddLessonMutationOptions = Apollo.BaseMutationOptions<AddLessonMutation, AddLessonMutationVariables>;
export const RemoveLessonDocument = gql`
    mutation RemoveLesson($lessonId: ObjectId!) {
  removeLesson(lessonId: $lessonId) {
    ...removeResult
  }
}
    ${RemoveResultFragmentDoc}`;
export type RemoveLessonMutationFn = Apollo.MutationFunction<RemoveLessonMutation, RemoveLessonMutationVariables>;

/**
 * __useRemoveLessonMutation__
 *
 * To run a mutation, you first call `useRemoveLessonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveLessonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeLessonMutation, { data, loading, error }] = useRemoveLessonMutation({
 *   variables: {
 *      lessonId: // value for 'lessonId'
 *   },
 * });
 */
export function useRemoveLessonMutation(baseOptions?: Apollo.MutationHookOptions<RemoveLessonMutation, RemoveLessonMutationVariables>) {
        return Apollo.useMutation<RemoveLessonMutation, RemoveLessonMutationVariables>(RemoveLessonDocument, baseOptions);
      }
export type RemoveLessonMutationHookResult = ReturnType<typeof useRemoveLessonMutation>;
export type RemoveLessonMutationResult = Apollo.MutationResult<RemoveLessonMutation>;
export type RemoveLessonMutationOptions = Apollo.BaseMutationOptions<RemoveLessonMutation, RemoveLessonMutationVariables>;
export const SetLessonScheduleDocument = gql`
    mutation SetLessonSchedule($lessonId: ObjectId!, $day: Int!, $hourCode: Int!) {
  setLessonSchedule(schedule: {lessonId: $lessonId, day: $day, hourCode: $hourCode}) {
    ...lesson
  }
}
    ${LessonFragmentDoc}`;
export type SetLessonScheduleMutationFn = Apollo.MutationFunction<SetLessonScheduleMutation, SetLessonScheduleMutationVariables>;

/**
 * __useSetLessonScheduleMutation__
 *
 * To run a mutation, you first call `useSetLessonScheduleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetLessonScheduleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setLessonScheduleMutation, { data, loading, error }] = useSetLessonScheduleMutation({
 *   variables: {
 *      lessonId: // value for 'lessonId'
 *      day: // value for 'day'
 *      hourCode: // value for 'hourCode'
 *   },
 * });
 */
export function useSetLessonScheduleMutation(baseOptions?: Apollo.MutationHookOptions<SetLessonScheduleMutation, SetLessonScheduleMutationVariables>) {
        return Apollo.useMutation<SetLessonScheduleMutation, SetLessonScheduleMutationVariables>(SetLessonScheduleDocument, baseOptions);
      }
export type SetLessonScheduleMutationHookResult = ReturnType<typeof useSetLessonScheduleMutation>;
export type SetLessonScheduleMutationResult = Apollo.MutationResult<SetLessonScheduleMutation>;
export type SetLessonScheduleMutationOptions = Apollo.BaseMutationOptions<SetLessonScheduleMutation, SetLessonScheduleMutationVariables>;
export const RemoveScheduleToLessonDocument = gql`
    mutation RemoveScheduleToLesson($lessonId: ObjectId!, $scheduleId: ObjectId!) {
  removeScheduleToLesson(lessonId: $lessonId, scheduleId: $scheduleId) {
    ...lesson
  }
}
    ${LessonFragmentDoc}`;
export type RemoveScheduleToLessonMutationFn = Apollo.MutationFunction<RemoveScheduleToLessonMutation, RemoveScheduleToLessonMutationVariables>;

/**
 * __useRemoveScheduleToLessonMutation__
 *
 * To run a mutation, you first call `useRemoveScheduleToLessonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveScheduleToLessonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeScheduleToLessonMutation, { data, loading, error }] = useRemoveScheduleToLessonMutation({
 *   variables: {
 *      lessonId: // value for 'lessonId'
 *      scheduleId: // value for 'scheduleId'
 *   },
 * });
 */
export function useRemoveScheduleToLessonMutation(baseOptions?: Apollo.MutationHookOptions<RemoveScheduleToLessonMutation, RemoveScheduleToLessonMutationVariables>) {
        return Apollo.useMutation<RemoveScheduleToLessonMutation, RemoveScheduleToLessonMutationVariables>(RemoveScheduleToLessonDocument, baseOptions);
      }
export type RemoveScheduleToLessonMutationHookResult = ReturnType<typeof useRemoveScheduleToLessonMutation>;
export type RemoveScheduleToLessonMutationResult = Apollo.MutationResult<RemoveScheduleToLessonMutation>;
export type RemoveScheduleToLessonMutationOptions = Apollo.BaseMutationOptions<RemoveScheduleToLessonMutation, RemoveScheduleToLessonMutationVariables>;
export const LessonsGDocument = gql`
    query LessonsG {
  lessonsG {
    ...lessonG
  }
}
    ${LessonGFragmentDoc}`;

/**
 * __useLessonsGQuery__
 *
 * To run a query within a React component, call `useLessonsGQuery` and pass it any options that fit your needs.
 * When your component renders, `useLessonsGQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLessonsGQuery({
 *   variables: {
 *   },
 * });
 */
export function useLessonsGQuery(baseOptions?: Apollo.QueryHookOptions<LessonsGQuery, LessonsGQueryVariables>) {
        return Apollo.useQuery<LessonsGQuery, LessonsGQueryVariables>(LessonsGDocument, baseOptions);
      }
export function useLessonsGLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LessonsGQuery, LessonsGQueryVariables>) {
          return Apollo.useLazyQuery<LessonsGQuery, LessonsGQueryVariables>(LessonsGDocument, baseOptions);
        }
export type LessonsGQueryHookResult = ReturnType<typeof useLessonsGQuery>;
export type LessonsGLazyQueryHookResult = ReturnType<typeof useLessonsGLazyQuery>;
export type LessonsGQueryResult = Apollo.QueryResult<LessonsGQuery, LessonsGQueryVariables>;
export const CreateLessonGDocument = gql`
    mutation CreateLessonG($name: String!, $teacherFieldIds: [ObjectId!]!) {
  createLessonG(lesson: {name: $name, teacherFieldIds: $teacherFieldIds}) {
    ...lessonG
  }
}
    ${LessonGFragmentDoc}`;
export type CreateLessonGMutationFn = Apollo.MutationFunction<CreateLessonGMutation, CreateLessonGMutationVariables>;

/**
 * __useCreateLessonGMutation__
 *
 * To run a mutation, you first call `useCreateLessonGMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLessonGMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLessonGMutation, { data, loading, error }] = useCreateLessonGMutation({
 *   variables: {
 *      name: // value for 'name'
 *      teacherFieldIds: // value for 'teacherFieldIds'
 *   },
 * });
 */
export function useCreateLessonGMutation(baseOptions?: Apollo.MutationHookOptions<CreateLessonGMutation, CreateLessonGMutationVariables>) {
        return Apollo.useMutation<CreateLessonGMutation, CreateLessonGMutationVariables>(CreateLessonGDocument, baseOptions);
      }
export type CreateLessonGMutationHookResult = ReturnType<typeof useCreateLessonGMutation>;
export type CreateLessonGMutationResult = Apollo.MutationResult<CreateLessonGMutation>;
export type CreateLessonGMutationOptions = Apollo.BaseMutationOptions<CreateLessonGMutation, CreateLessonGMutationVariables>;
export const EditLessonGDocument = gql`
    mutation EditLessonG($name: String, $_id: ObjectId!, $teacherFieldIds: [ObjectId!]!) {
  editLessonG(lesson: {name: $name, _id: $_id, teacherFieldIds: $teacherFieldIds}) {
    ...lessonG
  }
}
    ${LessonGFragmentDoc}`;
export type EditLessonGMutationFn = Apollo.MutationFunction<EditLessonGMutation, EditLessonGMutationVariables>;

/**
 * __useEditLessonGMutation__
 *
 * To run a mutation, you first call `useEditLessonGMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditLessonGMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editLessonGMutation, { data, loading, error }] = useEditLessonGMutation({
 *   variables: {
 *      name: // value for 'name'
 *      _id: // value for '_id'
 *      teacherFieldIds: // value for 'teacherFieldIds'
 *   },
 * });
 */
export function useEditLessonGMutation(baseOptions?: Apollo.MutationHookOptions<EditLessonGMutation, EditLessonGMutationVariables>) {
        return Apollo.useMutation<EditLessonGMutation, EditLessonGMutationVariables>(EditLessonGDocument, baseOptions);
      }
export type EditLessonGMutationHookResult = ReturnType<typeof useEditLessonGMutation>;
export type EditLessonGMutationResult = Apollo.MutationResult<EditLessonGMutation>;
export type EditLessonGMutationOptions = Apollo.BaseMutationOptions<EditLessonGMutation, EditLessonGMutationVariables>;
export const RemoveLessonGDocument = gql`
    mutation RemoveLessonG($_id: ObjectId!) {
  removeLessonG(_id: $_id) {
    ...removeResult
  }
}
    ${RemoveResultFragmentDoc}`;
export type RemoveLessonGMutationFn = Apollo.MutationFunction<RemoveLessonGMutation, RemoveLessonGMutationVariables>;

/**
 * __useRemoveLessonGMutation__
 *
 * To run a mutation, you first call `useRemoveLessonGMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveLessonGMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeLessonGMutation, { data, loading, error }] = useRemoveLessonGMutation({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useRemoveLessonGMutation(baseOptions?: Apollo.MutationHookOptions<RemoveLessonGMutation, RemoveLessonGMutationVariables>) {
        return Apollo.useMutation<RemoveLessonGMutation, RemoveLessonGMutationVariables>(RemoveLessonGDocument, baseOptions);
      }
export type RemoveLessonGMutationHookResult = ReturnType<typeof useRemoveLessonGMutation>;
export type RemoveLessonGMutationResult = Apollo.MutationResult<RemoveLessonGMutation>;
export type RemoveLessonGMutationOptions = Apollo.BaseMutationOptions<RemoveLessonGMutation, RemoveLessonGMutationVariables>;
export const AddTeacherFieldsToLessonDocument = gql`
    mutation AddTeacherFieldsToLesson($ids: [ObjectId!]!, $_id: ObjectId!) {
  addTeacherFieldsToLesson(ids: $ids, _id: $_id) {
    ...lessonG
  }
}
    ${LessonGFragmentDoc}`;
export type AddTeacherFieldsToLessonMutationFn = Apollo.MutationFunction<AddTeacherFieldsToLessonMutation, AddTeacherFieldsToLessonMutationVariables>;

/**
 * __useAddTeacherFieldsToLessonMutation__
 *
 * To run a mutation, you first call `useAddTeacherFieldsToLessonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddTeacherFieldsToLessonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addTeacherFieldsToLessonMutation, { data, loading, error }] = useAddTeacherFieldsToLessonMutation({
 *   variables: {
 *      ids: // value for 'ids'
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useAddTeacherFieldsToLessonMutation(baseOptions?: Apollo.MutationHookOptions<AddTeacherFieldsToLessonMutation, AddTeacherFieldsToLessonMutationVariables>) {
        return Apollo.useMutation<AddTeacherFieldsToLessonMutation, AddTeacherFieldsToLessonMutationVariables>(AddTeacherFieldsToLessonDocument, baseOptions);
      }
export type AddTeacherFieldsToLessonMutationHookResult = ReturnType<typeof useAddTeacherFieldsToLessonMutation>;
export type AddTeacherFieldsToLessonMutationResult = Apollo.MutationResult<AddTeacherFieldsToLessonMutation>;
export type AddTeacherFieldsToLessonMutationOptions = Apollo.BaseMutationOptions<AddTeacherFieldsToLessonMutation, AddTeacherFieldsToLessonMutationVariables>;
export const LessonMesagesDocument = gql`
    query LessonMesages($lessonId: ObjectId!, $skip: Int, $parentStudentId: ObjectId) {
  lessonMessages(lessonId: $lessonId, skip: $skip, parentStudentId: $parentStudentId) {
    ...lessonInbox
  }
}
    ${LessonInboxFragmentDoc}`;

/**
 * __useLessonMesagesQuery__
 *
 * To run a query within a React component, call `useLessonMesagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useLessonMesagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLessonMesagesQuery({
 *   variables: {
 *      lessonId: // value for 'lessonId'
 *      skip: // value for 'skip'
 *      parentStudentId: // value for 'parentStudentId'
 *   },
 * });
 */
export function useLessonMesagesQuery(baseOptions?: Apollo.QueryHookOptions<LessonMesagesQuery, LessonMesagesQueryVariables>) {
        return Apollo.useQuery<LessonMesagesQuery, LessonMesagesQueryVariables>(LessonMesagesDocument, baseOptions);
      }
export function useLessonMesagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LessonMesagesQuery, LessonMesagesQueryVariables>) {
          return Apollo.useLazyQuery<LessonMesagesQuery, LessonMesagesQueryVariables>(LessonMesagesDocument, baseOptions);
        }
export type LessonMesagesQueryHookResult = ReturnType<typeof useLessonMesagesQuery>;
export type LessonMesagesLazyQueryHookResult = ReturnType<typeof useLessonMesagesLazyQuery>;
export type LessonMesagesQueryResult = Apollo.QueryResult<LessonMesagesQuery, LessonMesagesQueryVariables>;
export const SendLessonMessageDocument = gql`
    mutation SendLessonMessage($lessonId: ObjectId!, $message: String!, $title: String!, $messageType: LessonMessageType!) {
  sendLessonMessage(data: {lessonId: $lessonId, message: $message, title: $title, messageType: $messageType}) {
    ...lessonInbox
  }
}
    ${LessonInboxFragmentDoc}`;
export type SendLessonMessageMutationFn = Apollo.MutationFunction<SendLessonMessageMutation, SendLessonMessageMutationVariables>;

/**
 * __useSendLessonMessageMutation__
 *
 * To run a mutation, you first call `useSendLessonMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendLessonMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendLessonMessageMutation, { data, loading, error }] = useSendLessonMessageMutation({
 *   variables: {
 *      lessonId: // value for 'lessonId'
 *      message: // value for 'message'
 *      title: // value for 'title'
 *      messageType: // value for 'messageType'
 *   },
 * });
 */
export function useSendLessonMessageMutation(baseOptions?: Apollo.MutationHookOptions<SendLessonMessageMutation, SendLessonMessageMutationVariables>) {
        return Apollo.useMutation<SendLessonMessageMutation, SendLessonMessageMutationVariables>(SendLessonMessageDocument, baseOptions);
      }
export type SendLessonMessageMutationHookResult = ReturnType<typeof useSendLessonMessageMutation>;
export type SendLessonMessageMutationResult = Apollo.MutationResult<SendLessonMessageMutation>;
export type SendLessonMessageMutationOptions = Apollo.BaseMutationOptions<SendLessonMessageMutation, SendLessonMessageMutationVariables>;
export const MessagesDocument = gql`
    query Messages($inboxId: ObjectId!, $skip: Int!) {
  messages(inboxId: $inboxId, skip: $skip) {
    ...message
  }
}
    ${MessageFragmentDoc}`;

/**
 * __useMessagesQuery__
 *
 * To run a query within a React component, call `useMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMessagesQuery({
 *   variables: {
 *      inboxId: // value for 'inboxId'
 *      skip: // value for 'skip'
 *   },
 * });
 */
export function useMessagesQuery(baseOptions?: Apollo.QueryHookOptions<MessagesQuery, MessagesQueryVariables>) {
        return Apollo.useQuery<MessagesQuery, MessagesQueryVariables>(MessagesDocument, baseOptions);
      }
export function useMessagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MessagesQuery, MessagesQueryVariables>) {
          return Apollo.useLazyQuery<MessagesQuery, MessagesQueryVariables>(MessagesDocument, baseOptions);
        }
export type MessagesQueryHookResult = ReturnType<typeof useMessagesQuery>;
export type MessagesLazyQueryHookResult = ReturnType<typeof useMessagesLazyQuery>;
export type MessagesQueryResult = Apollo.QueryResult<MessagesQuery, MessagesQueryVariables>;
export const SendMessageDocument = gql`
    mutation SendMessage($message: String!, $to: [ObjectId!]!) {
  sendMessage(message: {message: $message, to: $to}) {
    ...message
  }
}
    ${MessageFragmentDoc}`;
export type SendMessageMutationFn = Apollo.MutationFunction<SendMessageMutation, SendMessageMutationVariables>;

/**
 * __useSendMessageMutation__
 *
 * To run a mutation, you first call `useSendMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendMessageMutation, { data, loading, error }] = useSendMessageMutation({
 *   variables: {
 *      message: // value for 'message'
 *      to: // value for 'to'
 *   },
 * });
 */
export function useSendMessageMutation(baseOptions?: Apollo.MutationHookOptions<SendMessageMutation, SendMessageMutationVariables>) {
        return Apollo.useMutation<SendMessageMutation, SendMessageMutationVariables>(SendMessageDocument, baseOptions);
      }
export type SendMessageMutationHookResult = ReturnType<typeof useSendMessageMutation>;
export type SendMessageMutationResult = Apollo.MutationResult<SendMessageMutation>;
export type SendMessageMutationOptions = Apollo.BaseMutationOptions<SendMessageMutation, SendMessageMutationVariables>;
export const MessageReadDocument = gql`
    mutation MessageRead($messageId: ObjectId!) {
  messageRead(messageId: $messageId) {
    success
  }
}
    `;
export type MessageReadMutationFn = Apollo.MutationFunction<MessageReadMutation, MessageReadMutationVariables>;

/**
 * __useMessageReadMutation__
 *
 * To run a mutation, you first call `useMessageReadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMessageReadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [messageReadMutation, { data, loading, error }] = useMessageReadMutation({
 *   variables: {
 *      messageId: // value for 'messageId'
 *   },
 * });
 */
export function useMessageReadMutation(baseOptions?: Apollo.MutationHookOptions<MessageReadMutation, MessageReadMutationVariables>) {
        return Apollo.useMutation<MessageReadMutation, MessageReadMutationVariables>(MessageReadDocument, baseOptions);
      }
export type MessageReadMutationHookResult = ReturnType<typeof useMessageReadMutation>;
export type MessageReadMutationResult = Apollo.MutationResult<MessageReadMutation>;
export type MessageReadMutationOptions = Apollo.BaseMutationOptions<MessageReadMutation, MessageReadMutationVariables>;
export const InboxNotificationDocument = gql`
    subscription InboxNotification {
  inboxNotification {
    ...message
  }
}
    ${MessageFragmentDoc}`;

/**
 * __useInboxNotificationSubscription__
 *
 * To run a query within a React component, call `useInboxNotificationSubscription` and pass it any options that fit your needs.
 * When your component renders, `useInboxNotificationSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInboxNotificationSubscription({
 *   variables: {
 *   },
 * });
 */
export function useInboxNotificationSubscription(baseOptions?: Apollo.SubscriptionHookOptions<InboxNotificationSubscription, InboxNotificationSubscriptionVariables>) {
        return Apollo.useSubscription<InboxNotificationSubscription, InboxNotificationSubscriptionVariables>(InboxNotificationDocument, baseOptions);
      }
export type InboxNotificationSubscriptionHookResult = ReturnType<typeof useInboxNotificationSubscription>;
export type InboxNotificationSubscriptionResult = Apollo.SubscriptionResult<InboxNotificationSubscription>;
export const StudentNotificationsDocument = gql`
    query StudentNotifications($skip: Int, $parentStudentId: ObjectId) {
  studentNotifications(skip: $skip, parentStudentId: $parentStudentId) {
    ...notification
  }
}
    ${NotificationFragmentDoc}`;

/**
 * __useStudentNotificationsQuery__
 *
 * To run a query within a React component, call `useStudentNotificationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useStudentNotificationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStudentNotificationsQuery({
 *   variables: {
 *      skip: // value for 'skip'
 *      parentStudentId: // value for 'parentStudentId'
 *   },
 * });
 */
export function useStudentNotificationsQuery(baseOptions?: Apollo.QueryHookOptions<StudentNotificationsQuery, StudentNotificationsQueryVariables>) {
        return Apollo.useQuery<StudentNotificationsQuery, StudentNotificationsQueryVariables>(StudentNotificationsDocument, baseOptions);
      }
export function useStudentNotificationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StudentNotificationsQuery, StudentNotificationsQueryVariables>) {
          return Apollo.useLazyQuery<StudentNotificationsQuery, StudentNotificationsQueryVariables>(StudentNotificationsDocument, baseOptions);
        }
export type StudentNotificationsQueryHookResult = ReturnType<typeof useStudentNotificationsQuery>;
export type StudentNotificationsLazyQueryHookResult = ReturnType<typeof useStudentNotificationsLazyQuery>;
export type StudentNotificationsQueryResult = Apollo.QueryResult<StudentNotificationsQuery, StudentNotificationsQueryVariables>;
export const StudentNotificationsStatusUpdateDocument = gql`
    mutation studentNotificationsStatusUpdate($state: StudentNotificationState!, $ids: [ObjectId!]!) {
  studentNotificationsStatusUpdate(state: $state, ids: $ids) {
    ...updateResults
  }
}
    ${UpdateResultsFragmentDoc}`;
export type StudentNotificationsStatusUpdateMutationFn = Apollo.MutationFunction<StudentNotificationsStatusUpdateMutation, StudentNotificationsStatusUpdateMutationVariables>;

/**
 * __useStudentNotificationsStatusUpdateMutation__
 *
 * To run a mutation, you first call `useStudentNotificationsStatusUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStudentNotificationsStatusUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [studentNotificationsStatusUpdateMutation, { data, loading, error }] = useStudentNotificationsStatusUpdateMutation({
 *   variables: {
 *      state: // value for 'state'
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useStudentNotificationsStatusUpdateMutation(baseOptions?: Apollo.MutationHookOptions<StudentNotificationsStatusUpdateMutation, StudentNotificationsStatusUpdateMutationVariables>) {
        return Apollo.useMutation<StudentNotificationsStatusUpdateMutation, StudentNotificationsStatusUpdateMutationVariables>(StudentNotificationsStatusUpdateDocument, baseOptions);
      }
export type StudentNotificationsStatusUpdateMutationHookResult = ReturnType<typeof useStudentNotificationsStatusUpdateMutation>;
export type StudentNotificationsStatusUpdateMutationResult = Apollo.MutationResult<StudentNotificationsStatusUpdateMutation>;
export type StudentNotificationsStatusUpdateMutationOptions = Apollo.BaseMutationOptions<StudentNotificationsStatusUpdateMutation, StudentNotificationsStatusUpdateMutationVariables>;
export const StudentNotificationUpdatedDocument = gql`
    subscription studentNotificationUpdated {
  studentNotificationUpdated {
    ...notification
  }
}
    ${NotificationFragmentDoc}`;

/**
 * __useStudentNotificationUpdatedSubscription__
 *
 * To run a query within a React component, call `useStudentNotificationUpdatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useStudentNotificationUpdatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStudentNotificationUpdatedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useStudentNotificationUpdatedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<StudentNotificationUpdatedSubscription, StudentNotificationUpdatedSubscriptionVariables>) {
        return Apollo.useSubscription<StudentNotificationUpdatedSubscription, StudentNotificationUpdatedSubscriptionVariables>(StudentNotificationUpdatedDocument, baseOptions);
      }
export type StudentNotificationUpdatedSubscriptionHookResult = ReturnType<typeof useStudentNotificationUpdatedSubscription>;
export type StudentNotificationUpdatedSubscriptionResult = Apollo.SubscriptionResult<StudentNotificationUpdatedSubscription>;
export const MyChildrenDocument = gql`
    query MyChildren {
  myChildren {
    ...person
  }
}
    ${PersonFragmentDoc}`;

/**
 * __useMyChildrenQuery__
 *
 * To run a query within a React component, call `useMyChildrenQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyChildrenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyChildrenQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyChildrenQuery(baseOptions?: Apollo.QueryHookOptions<MyChildrenQuery, MyChildrenQueryVariables>) {
        return Apollo.useQuery<MyChildrenQuery, MyChildrenQueryVariables>(MyChildrenDocument, baseOptions);
      }
export function useMyChildrenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyChildrenQuery, MyChildrenQueryVariables>) {
          return Apollo.useLazyQuery<MyChildrenQuery, MyChildrenQueryVariables>(MyChildrenDocument, baseOptions);
        }
export type MyChildrenQueryHookResult = ReturnType<typeof useMyChildrenQuery>;
export type MyChildrenLazyQueryHookResult = ReturnType<typeof useMyChildrenLazyQuery>;
export type MyChildrenQueryResult = Apollo.QueryResult<MyChildrenQuery, MyChildrenQueryVariables>;
export const ParentsDocument = gql`
    query Parents($studentId: ObjectId!) {
  studentParents(studentId: $studentId) {
    ...user
  }
}
    ${UserFragmentDoc}`;

/**
 * __useParentsQuery__
 *
 * To run a query within a React component, call `useParentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useParentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useParentsQuery({
 *   variables: {
 *      studentId: // value for 'studentId'
 *   },
 * });
 */
export function useParentsQuery(baseOptions?: Apollo.QueryHookOptions<ParentsQuery, ParentsQueryVariables>) {
        return Apollo.useQuery<ParentsQuery, ParentsQueryVariables>(ParentsDocument, baseOptions);
      }
export function useParentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ParentsQuery, ParentsQueryVariables>) {
          return Apollo.useLazyQuery<ParentsQuery, ParentsQueryVariables>(ParentsDocument, baseOptions);
        }
export type ParentsQueryHookResult = ReturnType<typeof useParentsQuery>;
export type ParentsLazyQueryHookResult = ReturnType<typeof useParentsLazyQuery>;
export type ParentsQueryResult = Apollo.QueryResult<ParentsQuery, ParentsQueryVariables>;
export const RemoveParentDocument = gql`
    mutation RemoveParent($studentId: ObjectId!, $parentId: ObjectId!) {
  removeParent(studentId: $studentId, parentId: $parentId) {
    ...removeResult
  }
}
    ${RemoveResultFragmentDoc}`;
export type RemoveParentMutationFn = Apollo.MutationFunction<RemoveParentMutation, RemoveParentMutationVariables>;

/**
 * __useRemoveParentMutation__
 *
 * To run a mutation, you first call `useRemoveParentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveParentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeParentMutation, { data, loading, error }] = useRemoveParentMutation({
 *   variables: {
 *      studentId: // value for 'studentId'
 *      parentId: // value for 'parentId'
 *   },
 * });
 */
export function useRemoveParentMutation(baseOptions?: Apollo.MutationHookOptions<RemoveParentMutation, RemoveParentMutationVariables>) {
        return Apollo.useMutation<RemoveParentMutation, RemoveParentMutationVariables>(RemoveParentDocument, baseOptions);
      }
export type RemoveParentMutationHookResult = ReturnType<typeof useRemoveParentMutation>;
export type RemoveParentMutationResult = Apollo.MutationResult<RemoveParentMutation>;
export type RemoveParentMutationOptions = Apollo.BaseMutationOptions<RemoveParentMutation, RemoveParentMutationVariables>;
export const MyParentApplicationsDocument = gql`
    query MyParentApplications {
  myParentApplications {
    ...parentApplication
  }
}
    ${ParentApplicationFragmentDoc}`;

/**
 * __useMyParentApplicationsQuery__
 *
 * To run a query within a React component, call `useMyParentApplicationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyParentApplicationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyParentApplicationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyParentApplicationsQuery(baseOptions?: Apollo.QueryHookOptions<MyParentApplicationsQuery, MyParentApplicationsQueryVariables>) {
        return Apollo.useQuery<MyParentApplicationsQuery, MyParentApplicationsQueryVariables>(MyParentApplicationsDocument, baseOptions);
      }
export function useMyParentApplicationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyParentApplicationsQuery, MyParentApplicationsQueryVariables>) {
          return Apollo.useLazyQuery<MyParentApplicationsQuery, MyParentApplicationsQueryVariables>(MyParentApplicationsDocument, baseOptions);
        }
export type MyParentApplicationsQueryHookResult = ReturnType<typeof useMyParentApplicationsQuery>;
export type MyParentApplicationsLazyQueryHookResult = ReturnType<typeof useMyParentApplicationsLazyQuery>;
export type MyParentApplicationsQueryResult = Apollo.QueryResult<MyParentApplicationsQuery, MyParentApplicationsQueryVariables>;
export const ParentApplicationsDocument = gql`
    query ParentApplications($studentId: ObjectId!) {
  parentApplications(studentId: $studentId) {
    ...parentApplication
  }
}
    ${ParentApplicationFragmentDoc}`;

/**
 * __useParentApplicationsQuery__
 *
 * To run a query within a React component, call `useParentApplicationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useParentApplicationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useParentApplicationsQuery({
 *   variables: {
 *      studentId: // value for 'studentId'
 *   },
 * });
 */
export function useParentApplicationsQuery(baseOptions?: Apollo.QueryHookOptions<ParentApplicationsQuery, ParentApplicationsQueryVariables>) {
        return Apollo.useQuery<ParentApplicationsQuery, ParentApplicationsQueryVariables>(ParentApplicationsDocument, baseOptions);
      }
export function useParentApplicationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ParentApplicationsQuery, ParentApplicationsQueryVariables>) {
          return Apollo.useLazyQuery<ParentApplicationsQuery, ParentApplicationsQueryVariables>(ParentApplicationsDocument, baseOptions);
        }
export type ParentApplicationsQueryHookResult = ReturnType<typeof useParentApplicationsQuery>;
export type ParentApplicationsLazyQueryHookResult = ReturnType<typeof useParentApplicationsLazyQuery>;
export type ParentApplicationsQueryResult = Apollo.QueryResult<ParentApplicationsQuery, ParentApplicationsQueryVariables>;
export const InvitationParentDocument = gql`
    mutation invitationParent($studentId: ObjectId!, $email: String!) {
  invitationParent(studentId: $studentId, email: $email) {
    ...parentApplication
  }
}
    ${ParentApplicationFragmentDoc}`;
export type InvitationParentMutationFn = Apollo.MutationFunction<InvitationParentMutation, InvitationParentMutationVariables>;

/**
 * __useInvitationParentMutation__
 *
 * To run a mutation, you first call `useInvitationParentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInvitationParentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [invitationParentMutation, { data, loading, error }] = useInvitationParentMutation({
 *   variables: {
 *      studentId: // value for 'studentId'
 *      email: // value for 'email'
 *   },
 * });
 */
export function useInvitationParentMutation(baseOptions?: Apollo.MutationHookOptions<InvitationParentMutation, InvitationParentMutationVariables>) {
        return Apollo.useMutation<InvitationParentMutation, InvitationParentMutationVariables>(InvitationParentDocument, baseOptions);
      }
export type InvitationParentMutationHookResult = ReturnType<typeof useInvitationParentMutation>;
export type InvitationParentMutationResult = Apollo.MutationResult<InvitationParentMutation>;
export type InvitationParentMutationOptions = Apollo.BaseMutationOptions<InvitationParentMutation, InvitationParentMutationVariables>;
export const PositionNotificationDocument = gql`
    subscription PositionNotification {
  positionNotification {
    ...positionType
  }
}
    ${PositionTypeFragmentDoc}`;

/**
 * __usePositionNotificationSubscription__
 *
 * To run a query within a React component, call `usePositionNotificationSubscription` and pass it any options that fit your needs.
 * When your component renders, `usePositionNotificationSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePositionNotificationSubscription({
 *   variables: {
 *   },
 * });
 */
export function usePositionNotificationSubscription(baseOptions?: Apollo.SubscriptionHookOptions<PositionNotificationSubscription, PositionNotificationSubscriptionVariables>) {
        return Apollo.useSubscription<PositionNotificationSubscription, PositionNotificationSubscriptionVariables>(PositionNotificationDocument, baseOptions);
      }
export type PositionNotificationSubscriptionHookResult = ReturnType<typeof usePositionNotificationSubscription>;
export type PositionNotificationSubscriptionResult = Apollo.SubscriptionResult<PositionNotificationSubscription>;
export const SchoolsDocument = gql`
    query Schools($institutionId: ObjectId) {
  schools(institutionId: $institutionId) {
    ...school
  }
}
    ${SchoolFragmentDoc}`;

/**
 * __useSchoolsQuery__
 *
 * To run a query within a React component, call `useSchoolsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSchoolsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSchoolsQuery({
 *   variables: {
 *      institutionId: // value for 'institutionId'
 *   },
 * });
 */
export function useSchoolsQuery(baseOptions?: Apollo.QueryHookOptions<SchoolsQuery, SchoolsQueryVariables>) {
        return Apollo.useQuery<SchoolsQuery, SchoolsQueryVariables>(SchoolsDocument, baseOptions);
      }
export function useSchoolsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SchoolsQuery, SchoolsQueryVariables>) {
          return Apollo.useLazyQuery<SchoolsQuery, SchoolsQueryVariables>(SchoolsDocument, baseOptions);
        }
export type SchoolsQueryHookResult = ReturnType<typeof useSchoolsQuery>;
export type SchoolsLazyQueryHookResult = ReturnType<typeof useSchoolsLazyQuery>;
export type SchoolsQueryResult = Apollo.QueryResult<SchoolsQuery, SchoolsQueryVariables>;
export const CreateSchoolDocument = gql`
    mutation CreateSchool($_id: ObjectId, $name: String!, $eOkulCode: String, $schoolKindId: ObjectId) {
  createSchool(data: {_id: $_id, name: $name, eOkulCode: $eOkulCode, schoolKindId: $schoolKindId}) {
    ...school
  }
}
    ${SchoolFragmentDoc}`;
export type CreateSchoolMutationFn = Apollo.MutationFunction<CreateSchoolMutation, CreateSchoolMutationVariables>;

/**
 * __useCreateSchoolMutation__
 *
 * To run a mutation, you first call `useCreateSchoolMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSchoolMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSchoolMutation, { data, loading, error }] = useCreateSchoolMutation({
 *   variables: {
 *      _id: // value for '_id'
 *      name: // value for 'name'
 *      eOkulCode: // value for 'eOkulCode'
 *      schoolKindId: // value for 'schoolKindId'
 *   },
 * });
 */
export function useCreateSchoolMutation(baseOptions?: Apollo.MutationHookOptions<CreateSchoolMutation, CreateSchoolMutationVariables>) {
        return Apollo.useMutation<CreateSchoolMutation, CreateSchoolMutationVariables>(CreateSchoolDocument, baseOptions);
      }
export type CreateSchoolMutationHookResult = ReturnType<typeof useCreateSchoolMutation>;
export type CreateSchoolMutationResult = Apollo.MutationResult<CreateSchoolMutation>;
export type CreateSchoolMutationOptions = Apollo.BaseMutationOptions<CreateSchoolMutation, CreateSchoolMutationVariables>;
export const SchoolDocument = gql`
    query School($id: ObjectId!) {
  school(id: $id) {
    ...school
  }
}
    ${SchoolFragmentDoc}`;

/**
 * __useSchoolQuery__
 *
 * To run a query within a React component, call `useSchoolQuery` and pass it any options that fit your needs.
 * When your component renders, `useSchoolQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSchoolQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSchoolQuery(baseOptions?: Apollo.QueryHookOptions<SchoolQuery, SchoolQueryVariables>) {
        return Apollo.useQuery<SchoolQuery, SchoolQueryVariables>(SchoolDocument, baseOptions);
      }
export function useSchoolLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SchoolQuery, SchoolQueryVariables>) {
          return Apollo.useLazyQuery<SchoolQuery, SchoolQueryVariables>(SchoolDocument, baseOptions);
        }
export type SchoolQueryHookResult = ReturnType<typeof useSchoolQuery>;
export type SchoolLazyQueryHookResult = ReturnType<typeof useSchoolLazyQuery>;
export type SchoolQueryResult = Apollo.QueryResult<SchoolQuery, SchoolQueryVariables>;
export const SchoolsClassesNameDocument = gql`
    query SchoolsClassesName($institutionId: ObjectId) {
  schools(institutionId: $institutionId) {
    _id
    name
    classes {
      _id
      level
      code
      code1
      name
    }
  }
}
    `;

/**
 * __useSchoolsClassesNameQuery__
 *
 * To run a query within a React component, call `useSchoolsClassesNameQuery` and pass it any options that fit your needs.
 * When your component renders, `useSchoolsClassesNameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSchoolsClassesNameQuery({
 *   variables: {
 *      institutionId: // value for 'institutionId'
 *   },
 * });
 */
export function useSchoolsClassesNameQuery(baseOptions?: Apollo.QueryHookOptions<SchoolsClassesNameQuery, SchoolsClassesNameQueryVariables>) {
        return Apollo.useQuery<SchoolsClassesNameQuery, SchoolsClassesNameQueryVariables>(SchoolsClassesNameDocument, baseOptions);
      }
export function useSchoolsClassesNameLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SchoolsClassesNameQuery, SchoolsClassesNameQueryVariables>) {
          return Apollo.useLazyQuery<SchoolsClassesNameQuery, SchoolsClassesNameQueryVariables>(SchoolsClassesNameDocument, baseOptions);
        }
export type SchoolsClassesNameQueryHookResult = ReturnType<typeof useSchoolsClassesNameQuery>;
export type SchoolsClassesNameLazyQueryHookResult = ReturnType<typeof useSchoolsClassesNameLazyQuery>;
export type SchoolsClassesNameQueryResult = Apollo.QueryResult<SchoolsClassesNameQuery, SchoolsClassesNameQueryVariables>;
export const SchoolsTeachersDocument = gql`
    query SchoolsTeachers {
  schools {
    _id
    classes {
      _id
      classroomTeacher {
        _id
        firstName
        lastName
        fullName
      }
    }
  }
}
    `;

/**
 * __useSchoolsTeachersQuery__
 *
 * To run a query within a React component, call `useSchoolsTeachersQuery` and pass it any options that fit your needs.
 * When your component renders, `useSchoolsTeachersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSchoolsTeachersQuery({
 *   variables: {
 *   },
 * });
 */
export function useSchoolsTeachersQuery(baseOptions?: Apollo.QueryHookOptions<SchoolsTeachersQuery, SchoolsTeachersQueryVariables>) {
        return Apollo.useQuery<SchoolsTeachersQuery, SchoolsTeachersQueryVariables>(SchoolsTeachersDocument, baseOptions);
      }
export function useSchoolsTeachersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SchoolsTeachersQuery, SchoolsTeachersQueryVariables>) {
          return Apollo.useLazyQuery<SchoolsTeachersQuery, SchoolsTeachersQueryVariables>(SchoolsTeachersDocument, baseOptions);
        }
export type SchoolsTeachersQueryHookResult = ReturnType<typeof useSchoolsTeachersQuery>;
export type SchoolsTeachersLazyQueryHookResult = ReturnType<typeof useSchoolsTeachersLazyQuery>;
export type SchoolsTeachersQueryResult = Apollo.QueryResult<SchoolsTeachersQuery, SchoolsTeachersQueryVariables>;
export const SchoolsClassesSchoolKindDocument = gql`
    query SchoolsClassesSchoolKind {
  schools {
    _id
    name
    schoolKindId
    schoolKindName
    classes {
      _id
      name
      level
      code
      code1
    }
  }
}
    `;

/**
 * __useSchoolsClassesSchoolKindQuery__
 *
 * To run a query within a React component, call `useSchoolsClassesSchoolKindQuery` and pass it any options that fit your needs.
 * When your component renders, `useSchoolsClassesSchoolKindQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSchoolsClassesSchoolKindQuery({
 *   variables: {
 *   },
 * });
 */
export function useSchoolsClassesSchoolKindQuery(baseOptions?: Apollo.QueryHookOptions<SchoolsClassesSchoolKindQuery, SchoolsClassesSchoolKindQueryVariables>) {
        return Apollo.useQuery<SchoolsClassesSchoolKindQuery, SchoolsClassesSchoolKindQueryVariables>(SchoolsClassesSchoolKindDocument, baseOptions);
      }
export function useSchoolsClassesSchoolKindLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SchoolsClassesSchoolKindQuery, SchoolsClassesSchoolKindQueryVariables>) {
          return Apollo.useLazyQuery<SchoolsClassesSchoolKindQuery, SchoolsClassesSchoolKindQueryVariables>(SchoolsClassesSchoolKindDocument, baseOptions);
        }
export type SchoolsClassesSchoolKindQueryHookResult = ReturnType<typeof useSchoolsClassesSchoolKindQuery>;
export type SchoolsClassesSchoolKindLazyQueryHookResult = ReturnType<typeof useSchoolsClassesSchoolKindLazyQuery>;
export type SchoolsClassesSchoolKindQueryResult = Apollo.QueryResult<SchoolsClassesSchoolKindQuery, SchoolsClassesSchoolKindQueryVariables>;
export const MyLessonsDocument = gql`
    query MyLessons($week: Int, $classes: [ObjectId!], $notMine: Boolean, $teacherId: ObjectId) {
  schools {
    _id
    name
    educationYears {
      ...educationYear
    }
    weeklyHour {
      ...weeklyHour
    }
    classes {
      _id
      code
      name
      level
      code1
      fullName
      lessons(query: {week: $week, classes: $classes, notMine: $notMine, teacherId: $teacherId}) {
        ...lesson
      }
    }
  }
}
    ${EducationYearFragmentDoc}
${WeeklyHourFragmentDoc}
${LessonFragmentDoc}`;

/**
 * __useMyLessonsQuery__
 *
 * To run a query within a React component, call `useMyLessonsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyLessonsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyLessonsQuery({
 *   variables: {
 *      week: // value for 'week'
 *      classes: // value for 'classes'
 *      notMine: // value for 'notMine'
 *      teacherId: // value for 'teacherId'
 *   },
 * });
 */
export function useMyLessonsQuery(baseOptions?: Apollo.QueryHookOptions<MyLessonsQuery, MyLessonsQueryVariables>) {
        return Apollo.useQuery<MyLessonsQuery, MyLessonsQueryVariables>(MyLessonsDocument, baseOptions);
      }
export function useMyLessonsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyLessonsQuery, MyLessonsQueryVariables>) {
          return Apollo.useLazyQuery<MyLessonsQuery, MyLessonsQueryVariables>(MyLessonsDocument, baseOptions);
        }
export type MyLessonsQueryHookResult = ReturnType<typeof useMyLessonsQuery>;
export type MyLessonsLazyQueryHookResult = ReturnType<typeof useMyLessonsLazyQuery>;
export type MyLessonsQueryResult = Apollo.QueryResult<MyLessonsQuery, MyLessonsQueryVariables>;
export const SchoolGDocument = gql`
    query SchoolG($id: ObjectId!) {
  schoolG(id: $id) {
    ...schoolG
  }
}
    ${SchoolGFragmentDoc}`;

/**
 * __useSchoolGQuery__
 *
 * To run a query within a React component, call `useSchoolGQuery` and pass it any options that fit your needs.
 * When your component renders, `useSchoolGQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSchoolGQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSchoolGQuery(baseOptions?: Apollo.QueryHookOptions<SchoolGQuery, SchoolGQueryVariables>) {
        return Apollo.useQuery<SchoolGQuery, SchoolGQueryVariables>(SchoolGDocument, baseOptions);
      }
export function useSchoolGLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SchoolGQuery, SchoolGQueryVariables>) {
          return Apollo.useLazyQuery<SchoolGQuery, SchoolGQueryVariables>(SchoolGDocument, baseOptions);
        }
export type SchoolGQueryHookResult = ReturnType<typeof useSchoolGQuery>;
export type SchoolGLazyQueryHookResult = ReturnType<typeof useSchoolGLazyQuery>;
export type SchoolGQueryResult = Apollo.QueryResult<SchoolGQuery, SchoolGQueryVariables>;
export const SchoolsGDocument = gql`
    query SchoolsG {
  schoolsG {
    ...schoolG
  }
}
    ${SchoolGFragmentDoc}`;

/**
 * __useSchoolsGQuery__
 *
 * To run a query within a React component, call `useSchoolsGQuery` and pass it any options that fit your needs.
 * When your component renders, `useSchoolsGQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSchoolsGQuery({
 *   variables: {
 *   },
 * });
 */
export function useSchoolsGQuery(baseOptions?: Apollo.QueryHookOptions<SchoolsGQuery, SchoolsGQueryVariables>) {
        return Apollo.useQuery<SchoolsGQuery, SchoolsGQueryVariables>(SchoolsGDocument, baseOptions);
      }
export function useSchoolsGLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SchoolsGQuery, SchoolsGQueryVariables>) {
          return Apollo.useLazyQuery<SchoolsGQuery, SchoolsGQueryVariables>(SchoolsGDocument, baseOptions);
        }
export type SchoolsGQueryHookResult = ReturnType<typeof useSchoolsGQuery>;
export type SchoolsGLazyQueryHookResult = ReturnType<typeof useSchoolsGLazyQuery>;
export type SchoolsGQueryResult = Apollo.QueryResult<SchoolsGQuery, SchoolsGQueryVariables>;
export const SchoolGClassesDocument = gql`
    query SchoolGClasses($id: ObjectId!) {
  schoolG(id: $id) {
    ...schoolG
  }
}
    ${SchoolGFragmentDoc}`;

/**
 * __useSchoolGClassesQuery__
 *
 * To run a query within a React component, call `useSchoolGClassesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSchoolGClassesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSchoolGClassesQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSchoolGClassesQuery(baseOptions?: Apollo.QueryHookOptions<SchoolGClassesQuery, SchoolGClassesQueryVariables>) {
        return Apollo.useQuery<SchoolGClassesQuery, SchoolGClassesQueryVariables>(SchoolGClassesDocument, baseOptions);
      }
export function useSchoolGClassesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SchoolGClassesQuery, SchoolGClassesQueryVariables>) {
          return Apollo.useLazyQuery<SchoolGClassesQuery, SchoolGClassesQueryVariables>(SchoolGClassesDocument, baseOptions);
        }
export type SchoolGClassesQueryHookResult = ReturnType<typeof useSchoolGClassesQuery>;
export type SchoolGClassesLazyQueryHookResult = ReturnType<typeof useSchoolGClassesLazyQuery>;
export type SchoolGClassesQueryResult = Apollo.QueryResult<SchoolGClassesQuery, SchoolGClassesQueryVariables>;
export const CreateSchoolGDocument = gql`
    mutation CreateSchoolG($name: String!, $classes: [ClassesGInput!]!) {
  createSchoolG(data: {name: $name, classes: $classes}) {
    ...schoolG
  }
}
    ${SchoolGFragmentDoc}`;
export type CreateSchoolGMutationFn = Apollo.MutationFunction<CreateSchoolGMutation, CreateSchoolGMutationVariables>;

/**
 * __useCreateSchoolGMutation__
 *
 * To run a mutation, you first call `useCreateSchoolGMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSchoolGMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSchoolGMutation, { data, loading, error }] = useCreateSchoolGMutation({
 *   variables: {
 *      name: // value for 'name'
 *      classes: // value for 'classes'
 *   },
 * });
 */
export function useCreateSchoolGMutation(baseOptions?: Apollo.MutationHookOptions<CreateSchoolGMutation, CreateSchoolGMutationVariables>) {
        return Apollo.useMutation<CreateSchoolGMutation, CreateSchoolGMutationVariables>(CreateSchoolGDocument, baseOptions);
      }
export type CreateSchoolGMutationHookResult = ReturnType<typeof useCreateSchoolGMutation>;
export type CreateSchoolGMutationResult = Apollo.MutationResult<CreateSchoolGMutation>;
export type CreateSchoolGMutationOptions = Apollo.BaseMutationOptions<CreateSchoolGMutation, CreateSchoolGMutationVariables>;
export const ActiveStudentDocument = gql`
    query ActiveStudent {
  activeStudent {
    ...person
  }
}
    ${PersonFragmentDoc}`;

/**
 * __useActiveStudentQuery__
 *
 * To run a query within a React component, call `useActiveStudentQuery` and pass it any options that fit your needs.
 * When your component renders, `useActiveStudentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useActiveStudentQuery({
 *   variables: {
 *   },
 * });
 */
export function useActiveStudentQuery(baseOptions?: Apollo.QueryHookOptions<ActiveStudentQuery, ActiveStudentQueryVariables>) {
        return Apollo.useQuery<ActiveStudentQuery, ActiveStudentQueryVariables>(ActiveStudentDocument, baseOptions);
      }
export function useActiveStudentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ActiveStudentQuery, ActiveStudentQueryVariables>) {
          return Apollo.useLazyQuery<ActiveStudentQuery, ActiveStudentQueryVariables>(ActiveStudentDocument, baseOptions);
        }
export type ActiveStudentQueryHookResult = ReturnType<typeof useActiveStudentQuery>;
export type ActiveStudentLazyQueryHookResult = ReturnType<typeof useActiveStudentLazyQuery>;
export type ActiveStudentQueryResult = Apollo.QueryResult<ActiveStudentQuery, ActiveStudentQueryVariables>;
export const StudentDocument = gql`
    query Student($studentId: ObjectId, $citizenshipId: String) {
  student(studentId: $studentId, citizenshipId: $citizenshipId) {
    ...student
  }
}
    ${StudentFragmentDoc}`;

/**
 * __useStudentQuery__
 *
 * To run a query within a React component, call `useStudentQuery` and pass it any options that fit your needs.
 * When your component renders, `useStudentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStudentQuery({
 *   variables: {
 *      studentId: // value for 'studentId'
 *      citizenshipId: // value for 'citizenshipId'
 *   },
 * });
 */
export function useStudentQuery(baseOptions?: Apollo.QueryHookOptions<StudentQuery, StudentQueryVariables>) {
        return Apollo.useQuery<StudentQuery, StudentQueryVariables>(StudentDocument, baseOptions);
      }
export function useStudentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StudentQuery, StudentQueryVariables>) {
          return Apollo.useLazyQuery<StudentQuery, StudentQueryVariables>(StudentDocument, baseOptions);
        }
export type StudentQueryHookResult = ReturnType<typeof useStudentQuery>;
export type StudentLazyQueryHookResult = ReturnType<typeof useStudentLazyQuery>;
export type StudentQueryResult = Apollo.QueryResult<StudentQuery, StudentQueryVariables>;
export const StudentsDocument = gql`
    query Students($schoolId: ObjectId, $classId: ObjectId, $notClass: Boolean, $studentIds: [ObjectId!], $search: String, $page: Int) {
  students(query: {schoolId: $schoolId, classId: $classId, notClass: $notClass, studentIds: $studentIds, search: $search, page: $page}) {
    ...student
  }
}
    ${StudentFragmentDoc}`;

/**
 * __useStudentsQuery__
 *
 * To run a query within a React component, call `useStudentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useStudentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStudentsQuery({
 *   variables: {
 *      schoolId: // value for 'schoolId'
 *      classId: // value for 'classId'
 *      notClass: // value for 'notClass'
 *      studentIds: // value for 'studentIds'
 *      search: // value for 'search'
 *      page: // value for 'page'
 *   },
 * });
 */
export function useStudentsQuery(baseOptions?: Apollo.QueryHookOptions<StudentsQuery, StudentsQueryVariables>) {
        return Apollo.useQuery<StudentsQuery, StudentsQueryVariables>(StudentsDocument, baseOptions);
      }
export function useStudentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StudentsQuery, StudentsQueryVariables>) {
          return Apollo.useLazyQuery<StudentsQuery, StudentsQueryVariables>(StudentsDocument, baseOptions);
        }
export type StudentsQueryHookResult = ReturnType<typeof useStudentsQuery>;
export type StudentsLazyQueryHookResult = ReturnType<typeof useStudentsLazyQuery>;
export type StudentsQueryResult = Apollo.QueryResult<StudentsQuery, StudentsQueryVariables>;
export const StudentCountDocument = gql`
    query StudentCount($schoolId: ObjectId, $classId: ObjectId) {
  studentCount(query: {schoolId: $schoolId, classId: $classId}) {
    studentCount
  }
}
    `;

/**
 * __useStudentCountQuery__
 *
 * To run a query within a React component, call `useStudentCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useStudentCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStudentCountQuery({
 *   variables: {
 *      schoolId: // value for 'schoolId'
 *      classId: // value for 'classId'
 *   },
 * });
 */
export function useStudentCountQuery(baseOptions?: Apollo.QueryHookOptions<StudentCountQuery, StudentCountQueryVariables>) {
        return Apollo.useQuery<StudentCountQuery, StudentCountQueryVariables>(StudentCountDocument, baseOptions);
      }
export function useStudentCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StudentCountQuery, StudentCountQueryVariables>) {
          return Apollo.useLazyQuery<StudentCountQuery, StudentCountQueryVariables>(StudentCountDocument, baseOptions);
        }
export type StudentCountQueryHookResult = ReturnType<typeof useStudentCountQuery>;
export type StudentCountLazyQueryHookResult = ReturnType<typeof useStudentCountLazyQuery>;
export type StudentCountQueryResult = Apollo.QueryResult<StudentCountQuery, StudentCountQueryVariables>;
export const TransferStudentsDocument = gql`
    mutation transferStudents($schoolId: ObjectId!, $classId: ObjectId, $students: [ObjectId!]!) {
  transferStudents(data: {schoolId: $schoolId, classId: $classId, students: $students}) {
    code
    success
  }
}
    `;
export type TransferStudentsMutationFn = Apollo.MutationFunction<TransferStudentsMutation, TransferStudentsMutationVariables>;

/**
 * __useTransferStudentsMutation__
 *
 * To run a mutation, you first call `useTransferStudentsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTransferStudentsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [transferStudentsMutation, { data, loading, error }] = useTransferStudentsMutation({
 *   variables: {
 *      schoolId: // value for 'schoolId'
 *      classId: // value for 'classId'
 *      students: // value for 'students'
 *   },
 * });
 */
export function useTransferStudentsMutation(baseOptions?: Apollo.MutationHookOptions<TransferStudentsMutation, TransferStudentsMutationVariables>) {
        return Apollo.useMutation<TransferStudentsMutation, TransferStudentsMutationVariables>(TransferStudentsDocument, baseOptions);
      }
export type TransferStudentsMutationHookResult = ReturnType<typeof useTransferStudentsMutation>;
export type TransferStudentsMutationResult = Apollo.MutationResult<TransferStudentsMutation>;
export type TransferStudentsMutationOptions = Apollo.BaseMutationOptions<TransferStudentsMutation, TransferStudentsMutationVariables>;
export const EditStudentCitizenshipIdDocument = gql`
    mutation editStudentCitizenshipId($studentId: ObjectId!, $citizenshipId: String!) {
  editStudentCitizenshipId(data: {studentId: $studentId, citizenshipId: $citizenshipId}) {
    success
  }
}
    `;
export type EditStudentCitizenshipIdMutationFn = Apollo.MutationFunction<EditStudentCitizenshipIdMutation, EditStudentCitizenshipIdMutationVariables>;

/**
 * __useEditStudentCitizenshipIdMutation__
 *
 * To run a mutation, you first call `useEditStudentCitizenshipIdMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditStudentCitizenshipIdMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editStudentCitizenshipIdMutation, { data, loading, error }] = useEditStudentCitizenshipIdMutation({
 *   variables: {
 *      studentId: // value for 'studentId'
 *      citizenshipId: // value for 'citizenshipId'
 *   },
 * });
 */
export function useEditStudentCitizenshipIdMutation(baseOptions?: Apollo.MutationHookOptions<EditStudentCitizenshipIdMutation, EditStudentCitizenshipIdMutationVariables>) {
        return Apollo.useMutation<EditStudentCitizenshipIdMutation, EditStudentCitizenshipIdMutationVariables>(EditStudentCitizenshipIdDocument, baseOptions);
      }
export type EditStudentCitizenshipIdMutationHookResult = ReturnType<typeof useEditStudentCitizenshipIdMutation>;
export type EditStudentCitizenshipIdMutationResult = Apollo.MutationResult<EditStudentCitizenshipIdMutation>;
export type EditStudentCitizenshipIdMutationOptions = Apollo.BaseMutationOptions<EditStudentCitizenshipIdMutation, EditStudentCitizenshipIdMutationVariables>;
export const AddStudentDocument = gql`
    mutation AddStudent($firstName: String!, $lastName: String!, $citizenshipId: String!, $school: ObjectId, $class: ObjectId, $profilePhotoBase64: String, $schoolNo: String) {
  addStudent(student: {firstName: $firstName, lastName: $lastName, citizenshipId: $citizenshipId, school: $school, class: $class, profilePhotoBase64: $profilePhotoBase64, schoolNo: $schoolNo}) {
    ...student
  }
}
    ${StudentFragmentDoc}`;
export type AddStudentMutationFn = Apollo.MutationFunction<AddStudentMutation, AddStudentMutationVariables>;

/**
 * __useAddStudentMutation__
 *
 * To run a mutation, you first call `useAddStudentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddStudentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addStudentMutation, { data, loading, error }] = useAddStudentMutation({
 *   variables: {
 *      firstName: // value for 'firstName'
 *      lastName: // value for 'lastName'
 *      citizenshipId: // value for 'citizenshipId'
 *      school: // value for 'school'
 *      class: // value for 'class'
 *      profilePhotoBase64: // value for 'profilePhotoBase64'
 *      schoolNo: // value for 'schoolNo'
 *   },
 * });
 */
export function useAddStudentMutation(baseOptions?: Apollo.MutationHookOptions<AddStudentMutation, AddStudentMutationVariables>) {
        return Apollo.useMutation<AddStudentMutation, AddStudentMutationVariables>(AddStudentDocument, baseOptions);
      }
export type AddStudentMutationHookResult = ReturnType<typeof useAddStudentMutation>;
export type AddStudentMutationResult = Apollo.MutationResult<AddStudentMutation>;
export type AddStudentMutationOptions = Apollo.BaseMutationOptions<AddStudentMutation, AddStudentMutationVariables>;
export const DismissStudentDocument = gql`
    mutation DismissStudent($studentId: ObjectId!, $level: Int!) {
  dismissStudent(studentId: $studentId, level: $level) {
    ...removeResult
  }
}
    ${RemoveResultFragmentDoc}`;
export type DismissStudentMutationFn = Apollo.MutationFunction<DismissStudentMutation, DismissStudentMutationVariables>;

/**
 * __useDismissStudentMutation__
 *
 * To run a mutation, you first call `useDismissStudentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDismissStudentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [dismissStudentMutation, { data, loading, error }] = useDismissStudentMutation({
 *   variables: {
 *      studentId: // value for 'studentId'
 *      level: // value for 'level'
 *   },
 * });
 */
export function useDismissStudentMutation(baseOptions?: Apollo.MutationHookOptions<DismissStudentMutation, DismissStudentMutationVariables>) {
        return Apollo.useMutation<DismissStudentMutation, DismissStudentMutationVariables>(DismissStudentDocument, baseOptions);
      }
export type DismissStudentMutationHookResult = ReturnType<typeof useDismissStudentMutation>;
export type DismissStudentMutationResult = Apollo.MutationResult<DismissStudentMutation>;
export type DismissStudentMutationOptions = Apollo.BaseMutationOptions<DismissStudentMutation, DismissStudentMutationVariables>;
export const DeleteSchoolDocument = gql`
    mutation DeleteSchool($schoolId: ObjectId!) {
  deleteSchool(schoolId: $schoolId) {
    ...removeResult
  }
}
    ${RemoveResultFragmentDoc}`;
export type DeleteSchoolMutationFn = Apollo.MutationFunction<DeleteSchoolMutation, DeleteSchoolMutationVariables>;

/**
 * __useDeleteSchoolMutation__
 *
 * To run a mutation, you first call `useDeleteSchoolMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSchoolMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSchoolMutation, { data, loading, error }] = useDeleteSchoolMutation({
 *   variables: {
 *      schoolId: // value for 'schoolId'
 *   },
 * });
 */
export function useDeleteSchoolMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSchoolMutation, DeleteSchoolMutationVariables>) {
        return Apollo.useMutation<DeleteSchoolMutation, DeleteSchoolMutationVariables>(DeleteSchoolDocument, baseOptions);
      }
export type DeleteSchoolMutationHookResult = ReturnType<typeof useDeleteSchoolMutation>;
export type DeleteSchoolMutationResult = Apollo.MutationResult<DeleteSchoolMutation>;
export type DeleteSchoolMutationOptions = Apollo.BaseMutationOptions<DeleteSchoolMutation, DeleteSchoolMutationVariables>;
export const StudentResetPasswordDocument = gql`
    mutation StudentResetPassword($studentId: ObjectId!) {
  resetStudentPassword(studentId: $studentId) {
    password
  }
}
    `;
export type StudentResetPasswordMutationFn = Apollo.MutationFunction<StudentResetPasswordMutation, StudentResetPasswordMutationVariables>;

/**
 * __useStudentResetPasswordMutation__
 *
 * To run a mutation, you first call `useStudentResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStudentResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [studentResetPasswordMutation, { data, loading, error }] = useStudentResetPasswordMutation({
 *   variables: {
 *      studentId: // value for 'studentId'
 *   },
 * });
 */
export function useStudentResetPasswordMutation(baseOptions?: Apollo.MutationHookOptions<StudentResetPasswordMutation, StudentResetPasswordMutationVariables>) {
        return Apollo.useMutation<StudentResetPasswordMutation, StudentResetPasswordMutationVariables>(StudentResetPasswordDocument, baseOptions);
      }
export type StudentResetPasswordMutationHookResult = ReturnType<typeof useStudentResetPasswordMutation>;
export type StudentResetPasswordMutationResult = Apollo.MutationResult<StudentResetPasswordMutation>;
export type StudentResetPasswordMutationOptions = Apollo.BaseMutationOptions<StudentResetPasswordMutation, StudentResetPasswordMutationVariables>;
export const StudentSignInDocument = gql`
    mutation StudentSignIn($username: String!, $password: String!) {
  studentSignIn(username: $username, password: $password) {
    token
  }
}
    `;
export type StudentSignInMutationFn = Apollo.MutationFunction<StudentSignInMutation, StudentSignInMutationVariables>;

/**
 * __useStudentSignInMutation__
 *
 * To run a mutation, you first call `useStudentSignInMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStudentSignInMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [studentSignInMutation, { data, loading, error }] = useStudentSignInMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useStudentSignInMutation(baseOptions?: Apollo.MutationHookOptions<StudentSignInMutation, StudentSignInMutationVariables>) {
        return Apollo.useMutation<StudentSignInMutation, StudentSignInMutationVariables>(StudentSignInDocument, baseOptions);
      }
export type StudentSignInMutationHookResult = ReturnType<typeof useStudentSignInMutation>;
export type StudentSignInMutationResult = Apollo.MutationResult<StudentSignInMutation>;
export type StudentSignInMutationOptions = Apollo.BaseMutationOptions<StudentSignInMutation, StudentSignInMutationVariables>;
export const StudiesDocument = gql`
    query Studies($week: Int, $query: StudyQuery, $teacherId: ObjectId) {
  studies(week: $week, query: $query, teacherId: $teacherId) {
    ...study
  }
}
    ${StudyFragmentDoc}`;

/**
 * __useStudiesQuery__
 *
 * To run a query within a React component, call `useStudiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useStudiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStudiesQuery({
 *   variables: {
 *      week: // value for 'week'
 *      query: // value for 'query'
 *      teacherId: // value for 'teacherId'
 *   },
 * });
 */
export function useStudiesQuery(baseOptions?: Apollo.QueryHookOptions<StudiesQuery, StudiesQueryVariables>) {
        return Apollo.useQuery<StudiesQuery, StudiesQueryVariables>(StudiesDocument, baseOptions);
      }
export function useStudiesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StudiesQuery, StudiesQueryVariables>) {
          return Apollo.useLazyQuery<StudiesQuery, StudiesQueryVariables>(StudiesDocument, baseOptions);
        }
export type StudiesQueryHookResult = ReturnType<typeof useStudiesQuery>;
export type StudiesLazyQueryHookResult = ReturnType<typeof useStudiesLazyQuery>;
export type StudiesQueryResult = Apollo.QueryResult<StudiesQuery, StudiesQueryVariables>;
export const CreateStudyDocument = gql`
    mutation CreateStudy($lessonId: ObjectId, $date: DateTime!, $duration: Int!, $subject: String!, $detail: String, $public: Boolean, $capacity: Int, $permissionClasses: [ObjectId!]) {
  createStudy(data: {lessonId: $lessonId, date: $date, duration: $duration, subject: $subject, detail: $detail, public: $public, capacity: $capacity, permissionClasses: $permissionClasses}) {
    ...study
  }
}
    ${StudyFragmentDoc}`;
export type CreateStudyMutationFn = Apollo.MutationFunction<CreateStudyMutation, CreateStudyMutationVariables>;

/**
 * __useCreateStudyMutation__
 *
 * To run a mutation, you first call `useCreateStudyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateStudyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createStudyMutation, { data, loading, error }] = useCreateStudyMutation({
 *   variables: {
 *      lessonId: // value for 'lessonId'
 *      date: // value for 'date'
 *      duration: // value for 'duration'
 *      subject: // value for 'subject'
 *      detail: // value for 'detail'
 *      public: // value for 'public'
 *      capacity: // value for 'capacity'
 *      permissionClasses: // value for 'permissionClasses'
 *   },
 * });
 */
export function useCreateStudyMutation(baseOptions?: Apollo.MutationHookOptions<CreateStudyMutation, CreateStudyMutationVariables>) {
        return Apollo.useMutation<CreateStudyMutation, CreateStudyMutationVariables>(CreateStudyDocument, baseOptions);
      }
export type CreateStudyMutationHookResult = ReturnType<typeof useCreateStudyMutation>;
export type CreateStudyMutationResult = Apollo.MutationResult<CreateStudyMutation>;
export type CreateStudyMutationOptions = Apollo.BaseMutationOptions<CreateStudyMutation, CreateStudyMutationVariables>;
export const DeleteStudyDocument = gql`
    mutation DeleteStudy($studyId: ObjectId!) {
  deleteStudy(studyId: $studyId) {
    ...removeResult
  }
}
    ${RemoveResultFragmentDoc}`;
export type DeleteStudyMutationFn = Apollo.MutationFunction<DeleteStudyMutation, DeleteStudyMutationVariables>;

/**
 * __useDeleteStudyMutation__
 *
 * To run a mutation, you first call `useDeleteStudyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteStudyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteStudyMutation, { data, loading, error }] = useDeleteStudyMutation({
 *   variables: {
 *      studyId: // value for 'studyId'
 *   },
 * });
 */
export function useDeleteStudyMutation(baseOptions?: Apollo.MutationHookOptions<DeleteStudyMutation, DeleteStudyMutationVariables>) {
        return Apollo.useMutation<DeleteStudyMutation, DeleteStudyMutationVariables>(DeleteStudyDocument, baseOptions);
      }
export type DeleteStudyMutationHookResult = ReturnType<typeof useDeleteStudyMutation>;
export type DeleteStudyMutationResult = Apollo.MutationResult<DeleteStudyMutation>;
export type DeleteStudyMutationOptions = Apollo.BaseMutationOptions<DeleteStudyMutation, DeleteStudyMutationVariables>;
export const JoinStudyDocument = gql`
    mutation JoinStudy($studyId: ObjectId!, $r: Boolean) {
  joinStudy(studyId: $studyId, r: $r) {
    ...study
  }
}
    ${StudyFragmentDoc}`;
export type JoinStudyMutationFn = Apollo.MutationFunction<JoinStudyMutation, JoinStudyMutationVariables>;

/**
 * __useJoinStudyMutation__
 *
 * To run a mutation, you first call `useJoinStudyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useJoinStudyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [joinStudyMutation, { data, loading, error }] = useJoinStudyMutation({
 *   variables: {
 *      studyId: // value for 'studyId'
 *      r: // value for 'r'
 *   },
 * });
 */
export function useJoinStudyMutation(baseOptions?: Apollo.MutationHookOptions<JoinStudyMutation, JoinStudyMutationVariables>) {
        return Apollo.useMutation<JoinStudyMutation, JoinStudyMutationVariables>(JoinStudyDocument, baseOptions);
      }
export type JoinStudyMutationHookResult = ReturnType<typeof useJoinStudyMutation>;
export type JoinStudyMutationResult = Apollo.MutationResult<JoinStudyMutation>;
export type JoinStudyMutationOptions = Apollo.BaseMutationOptions<JoinStudyMutation, JoinStudyMutationVariables>;
export const AcceptJoinStudyDocument = gql`
    mutation AcceptJoinStudy($studentId: ObjectId!, $studyId: ObjectId!, $r: Boolean, $status: StudyStudentStatus) {
  acceptJoinStudy(studentId: $studentId, studyId: $studyId, r: $r, status: $status) {
    ...study
  }
}
    ${StudyFragmentDoc}`;
export type AcceptJoinStudyMutationFn = Apollo.MutationFunction<AcceptJoinStudyMutation, AcceptJoinStudyMutationVariables>;

/**
 * __useAcceptJoinStudyMutation__
 *
 * To run a mutation, you first call `useAcceptJoinStudyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptJoinStudyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptJoinStudyMutation, { data, loading, error }] = useAcceptJoinStudyMutation({
 *   variables: {
 *      studentId: // value for 'studentId'
 *      studyId: // value for 'studyId'
 *      r: // value for 'r'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useAcceptJoinStudyMutation(baseOptions?: Apollo.MutationHookOptions<AcceptJoinStudyMutation, AcceptJoinStudyMutationVariables>) {
        return Apollo.useMutation<AcceptJoinStudyMutation, AcceptJoinStudyMutationVariables>(AcceptJoinStudyDocument, baseOptions);
      }
export type AcceptJoinStudyMutationHookResult = ReturnType<typeof useAcceptJoinStudyMutation>;
export type AcceptJoinStudyMutationResult = Apollo.MutationResult<AcceptJoinStudyMutation>;
export type AcceptJoinStudyMutationOptions = Apollo.BaseMutationOptions<AcceptJoinStudyMutation, AcceptJoinStudyMutationVariables>;
export const UpdateStudyDocument = gql`
    mutation UpdateStudy($studyId: ObjectId!, $studyStudentId: ObjectId!) {
  updateStudyState(studyStudentId: $studyStudentId, studyId: $studyId) {
    ...study
  }
}
    ${StudyFragmentDoc}`;
export type UpdateStudyMutationFn = Apollo.MutationFunction<UpdateStudyMutation, UpdateStudyMutationVariables>;

/**
 * __useUpdateStudyMutation__
 *
 * To run a mutation, you first call `useUpdateStudyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateStudyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateStudyMutation, { data, loading, error }] = useUpdateStudyMutation({
 *   variables: {
 *      studyId: // value for 'studyId'
 *      studyStudentId: // value for 'studyStudentId'
 *   },
 * });
 */
export function useUpdateStudyMutation(baseOptions?: Apollo.MutationHookOptions<UpdateStudyMutation, UpdateStudyMutationVariables>) {
        return Apollo.useMutation<UpdateStudyMutation, UpdateStudyMutationVariables>(UpdateStudyDocument, baseOptions);
      }
export type UpdateStudyMutationHookResult = ReturnType<typeof useUpdateStudyMutation>;
export type UpdateStudyMutationResult = Apollo.MutationResult<UpdateStudyMutation>;
export type UpdateStudyMutationOptions = Apollo.BaseMutationOptions<UpdateStudyMutation, UpdateStudyMutationVariables>;
export const TeachersFullnameDocument = gql`
    query TeachersFullname {
  teachers {
    _id
    firstName
    lastName
    fullName
  }
}
    `;

/**
 * __useTeachersFullnameQuery__
 *
 * To run a query within a React component, call `useTeachersFullnameQuery` and pass it any options that fit your needs.
 * When your component renders, `useTeachersFullnameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTeachersFullnameQuery({
 *   variables: {
 *   },
 * });
 */
export function useTeachersFullnameQuery(baseOptions?: Apollo.QueryHookOptions<TeachersFullnameQuery, TeachersFullnameQueryVariables>) {
        return Apollo.useQuery<TeachersFullnameQuery, TeachersFullnameQueryVariables>(TeachersFullnameDocument, baseOptions);
      }
export function useTeachersFullnameLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TeachersFullnameQuery, TeachersFullnameQueryVariables>) {
          return Apollo.useLazyQuery<TeachersFullnameQuery, TeachersFullnameQueryVariables>(TeachersFullnameDocument, baseOptions);
        }
export type TeachersFullnameQueryHookResult = ReturnType<typeof useTeachersFullnameQuery>;
export type TeachersFullnameLazyQueryHookResult = ReturnType<typeof useTeachersFullnameLazyQuery>;
export type TeachersFullnameQueryResult = Apollo.QueryResult<TeachersFullnameQuery, TeachersFullnameQueryVariables>;
export const DismissTeacherDocument = gql`
    mutation DismissTeacher($teacherId: ObjectId!) {
  dismissTeacher(teacherId: $teacherId) {
    ...removeResult
  }
}
    ${RemoveResultFragmentDoc}`;
export type DismissTeacherMutationFn = Apollo.MutationFunction<DismissTeacherMutation, DismissTeacherMutationVariables>;

/**
 * __useDismissTeacherMutation__
 *
 * To run a mutation, you first call `useDismissTeacherMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDismissTeacherMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [dismissTeacherMutation, { data, loading, error }] = useDismissTeacherMutation({
 *   variables: {
 *      teacherId: // value for 'teacherId'
 *   },
 * });
 */
export function useDismissTeacherMutation(baseOptions?: Apollo.MutationHookOptions<DismissTeacherMutation, DismissTeacherMutationVariables>) {
        return Apollo.useMutation<DismissTeacherMutation, DismissTeacherMutationVariables>(DismissTeacherDocument, baseOptions);
      }
export type DismissTeacherMutationHookResult = ReturnType<typeof useDismissTeacherMutation>;
export type DismissTeacherMutationResult = Apollo.MutationResult<DismissTeacherMutation>;
export type DismissTeacherMutationOptions = Apollo.BaseMutationOptions<DismissTeacherMutation, DismissTeacherMutationVariables>;
export const JobRequestDocument = gql`
    query JobRequest {
  jobRequests {
    ...teacherApplication
  }
}
    ${TeacherApplicationFragmentDoc}`;

/**
 * __useJobRequestQuery__
 *
 * To run a query within a React component, call `useJobRequestQuery` and pass it any options that fit your needs.
 * When your component renders, `useJobRequestQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useJobRequestQuery({
 *   variables: {
 *   },
 * });
 */
export function useJobRequestQuery(baseOptions?: Apollo.QueryHookOptions<JobRequestQuery, JobRequestQueryVariables>) {
        return Apollo.useQuery<JobRequestQuery, JobRequestQueryVariables>(JobRequestDocument, baseOptions);
      }
export function useJobRequestLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<JobRequestQuery, JobRequestQueryVariables>) {
          return Apollo.useLazyQuery<JobRequestQuery, JobRequestQueryVariables>(JobRequestDocument, baseOptions);
        }
export type JobRequestQueryHookResult = ReturnType<typeof useJobRequestQuery>;
export type JobRequestLazyQueryHookResult = ReturnType<typeof useJobRequestLazyQuery>;
export type JobRequestQueryResult = Apollo.QueryResult<JobRequestQuery, JobRequestQueryVariables>;
export const TeacherApplicationsDocument = gql`
    query TeacherApplications {
  teacherApplications {
    ...teacherApplication
  }
}
    ${TeacherApplicationFragmentDoc}`;

/**
 * __useTeacherApplicationsQuery__
 *
 * To run a query within a React component, call `useTeacherApplicationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTeacherApplicationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTeacherApplicationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useTeacherApplicationsQuery(baseOptions?: Apollo.QueryHookOptions<TeacherApplicationsQuery, TeacherApplicationsQueryVariables>) {
        return Apollo.useQuery<TeacherApplicationsQuery, TeacherApplicationsQueryVariables>(TeacherApplicationsDocument, baseOptions);
      }
export function useTeacherApplicationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TeacherApplicationsQuery, TeacherApplicationsQueryVariables>) {
          return Apollo.useLazyQuery<TeacherApplicationsQuery, TeacherApplicationsQueryVariables>(TeacherApplicationsDocument, baseOptions);
        }
export type TeacherApplicationsQueryHookResult = ReturnType<typeof useTeacherApplicationsQuery>;
export type TeacherApplicationsLazyQueryHookResult = ReturnType<typeof useTeacherApplicationsLazyQuery>;
export type TeacherApplicationsQueryResult = Apollo.QueryResult<TeacherApplicationsQuery, TeacherApplicationsQueryVariables>;
export const InvitationTeachersDocument = gql`
    mutation InvitationTeachers($emails: [String!]!) {
  invitationTeachers(emails: $emails) {
    ...teacherApplication
  }
}
    ${TeacherApplicationFragmentDoc}`;
export type InvitationTeachersMutationFn = Apollo.MutationFunction<InvitationTeachersMutation, InvitationTeachersMutationVariables>;

/**
 * __useInvitationTeachersMutation__
 *
 * To run a mutation, you first call `useInvitationTeachersMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInvitationTeachersMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [invitationTeachersMutation, { data, loading, error }] = useInvitationTeachersMutation({
 *   variables: {
 *      emails: // value for 'emails'
 *   },
 * });
 */
export function useInvitationTeachersMutation(baseOptions?: Apollo.MutationHookOptions<InvitationTeachersMutation, InvitationTeachersMutationVariables>) {
        return Apollo.useMutation<InvitationTeachersMutation, InvitationTeachersMutationVariables>(InvitationTeachersDocument, baseOptions);
      }
export type InvitationTeachersMutationHookResult = ReturnType<typeof useInvitationTeachersMutation>;
export type InvitationTeachersMutationResult = Apollo.MutationResult<InvitationTeachersMutation>;
export type InvitationTeachersMutationOptions = Apollo.BaseMutationOptions<InvitationTeachersMutation, InvitationTeachersMutationVariables>;
export const DeleteInvitationDocument = gql`
    mutation DeleteInvitation($applicationId: ObjectId!) {
  deleteInvitation(applicationId: $applicationId) {
    _id
  }
}
    `;
export type DeleteInvitationMutationFn = Apollo.MutationFunction<DeleteInvitationMutation, DeleteInvitationMutationVariables>;

/**
 * __useDeleteInvitationMutation__
 *
 * To run a mutation, you first call `useDeleteInvitationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteInvitationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteInvitationMutation, { data, loading, error }] = useDeleteInvitationMutation({
 *   variables: {
 *      applicationId: // value for 'applicationId'
 *   },
 * });
 */
export function useDeleteInvitationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteInvitationMutation, DeleteInvitationMutationVariables>) {
        return Apollo.useMutation<DeleteInvitationMutation, DeleteInvitationMutationVariables>(DeleteInvitationDocument, baseOptions);
      }
export type DeleteInvitationMutationHookResult = ReturnType<typeof useDeleteInvitationMutation>;
export type DeleteInvitationMutationResult = Apollo.MutationResult<DeleteInvitationMutation>;
export type DeleteInvitationMutationOptions = Apollo.BaseMutationOptions<DeleteInvitationMutation, DeleteInvitationMutationVariables>;
export const ReSendInvitationDocument = gql`
    mutation ReSendInvitation($applicationId: ObjectId!) {
  reSendInvitation(applicationId: $applicationId) {
    success
  }
}
    `;
export type ReSendInvitationMutationFn = Apollo.MutationFunction<ReSendInvitationMutation, ReSendInvitationMutationVariables>;

/**
 * __useReSendInvitationMutation__
 *
 * To run a mutation, you first call `useReSendInvitationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReSendInvitationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reSendInvitationMutation, { data, loading, error }] = useReSendInvitationMutation({
 *   variables: {
 *      applicationId: // value for 'applicationId'
 *   },
 * });
 */
export function useReSendInvitationMutation(baseOptions?: Apollo.MutationHookOptions<ReSendInvitationMutation, ReSendInvitationMutationVariables>) {
        return Apollo.useMutation<ReSendInvitationMutation, ReSendInvitationMutationVariables>(ReSendInvitationDocument, baseOptions);
      }
export type ReSendInvitationMutationHookResult = ReturnType<typeof useReSendInvitationMutation>;
export type ReSendInvitationMutationResult = Apollo.MutationResult<ReSendInvitationMutation>;
export type ReSendInvitationMutationOptions = Apollo.BaseMutationOptions<ReSendInvitationMutation, ReSendInvitationMutationVariables>;
export const TeacherFieldsDocument = gql`
    query TeacherFields {
  teacherFields {
    ...teacherField
  }
}
    ${TeacherFieldFragmentDoc}`;

/**
 * __useTeacherFieldsQuery__
 *
 * To run a query within a React component, call `useTeacherFieldsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTeacherFieldsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTeacherFieldsQuery({
 *   variables: {
 *   },
 * });
 */
export function useTeacherFieldsQuery(baseOptions?: Apollo.QueryHookOptions<TeacherFieldsQuery, TeacherFieldsQueryVariables>) {
        return Apollo.useQuery<TeacherFieldsQuery, TeacherFieldsQueryVariables>(TeacherFieldsDocument, baseOptions);
      }
export function useTeacherFieldsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TeacherFieldsQuery, TeacherFieldsQueryVariables>) {
          return Apollo.useLazyQuery<TeacherFieldsQuery, TeacherFieldsQueryVariables>(TeacherFieldsDocument, baseOptions);
        }
export type TeacherFieldsQueryHookResult = ReturnType<typeof useTeacherFieldsQuery>;
export type TeacherFieldsLazyQueryHookResult = ReturnType<typeof useTeacherFieldsLazyQuery>;
export type TeacherFieldsQueryResult = Apollo.QueryResult<TeacherFieldsQuery, TeacherFieldsQueryVariables>;
export const RemoveTeacherFieldDocument = gql`
    mutation RemoveTeacherField($_id: ObjectId!) {
  removeTeacherField(_id: $_id) {
    ...removeResult
  }
}
    ${RemoveResultFragmentDoc}`;
export type RemoveTeacherFieldMutationFn = Apollo.MutationFunction<RemoveTeacherFieldMutation, RemoveTeacherFieldMutationVariables>;

/**
 * __useRemoveTeacherFieldMutation__
 *
 * To run a mutation, you first call `useRemoveTeacherFieldMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveTeacherFieldMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeTeacherFieldMutation, { data, loading, error }] = useRemoveTeacherFieldMutation({
 *   variables: {
 *      _id: // value for '_id'
 *   },
 * });
 */
export function useRemoveTeacherFieldMutation(baseOptions?: Apollo.MutationHookOptions<RemoveTeacherFieldMutation, RemoveTeacherFieldMutationVariables>) {
        return Apollo.useMutation<RemoveTeacherFieldMutation, RemoveTeacherFieldMutationVariables>(RemoveTeacherFieldDocument, baseOptions);
      }
export type RemoveTeacherFieldMutationHookResult = ReturnType<typeof useRemoveTeacherFieldMutation>;
export type RemoveTeacherFieldMutationResult = Apollo.MutationResult<RemoveTeacherFieldMutation>;
export type RemoveTeacherFieldMutationOptions = Apollo.BaseMutationOptions<RemoveTeacherFieldMutation, RemoveTeacherFieldMutationVariables>;
export const EditTeacherFieldDocument = gql`
    mutation EditTeacherField($name: String!) {
  editTeacherField(data: {name: $name}) {
    ...teacherField
  }
}
    ${TeacherFieldFragmentDoc}`;
export type EditTeacherFieldMutationFn = Apollo.MutationFunction<EditTeacherFieldMutation, EditTeacherFieldMutationVariables>;

/**
 * __useEditTeacherFieldMutation__
 *
 * To run a mutation, you first call `useEditTeacherFieldMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditTeacherFieldMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editTeacherFieldMutation, { data, loading, error }] = useEditTeacherFieldMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useEditTeacherFieldMutation(baseOptions?: Apollo.MutationHookOptions<EditTeacherFieldMutation, EditTeacherFieldMutationVariables>) {
        return Apollo.useMutation<EditTeacherFieldMutation, EditTeacherFieldMutationVariables>(EditTeacherFieldDocument, baseOptions);
      }
export type EditTeacherFieldMutationHookResult = ReturnType<typeof useEditTeacherFieldMutation>;
export type EditTeacherFieldMutationResult = Apollo.MutationResult<EditTeacherFieldMutation>;
export type EditTeacherFieldMutationOptions = Apollo.BaseMutationOptions<EditTeacherFieldMutation, EditTeacherFieldMutationVariables>;
export const UniversitiesDocument = gql`
    query Universities {
  universities {
    ...university
  }
}
    ${UniversityFragmentDoc}`;

/**
 * __useUniversitiesQuery__
 *
 * To run a query within a React component, call `useUniversitiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useUniversitiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUniversitiesQuery({
 *   variables: {
 *   },
 * });
 */
export function useUniversitiesQuery(baseOptions?: Apollo.QueryHookOptions<UniversitiesQuery, UniversitiesQueryVariables>) {
        return Apollo.useQuery<UniversitiesQuery, UniversitiesQueryVariables>(UniversitiesDocument, baseOptions);
      }
export function useUniversitiesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UniversitiesQuery, UniversitiesQueryVariables>) {
          return Apollo.useLazyQuery<UniversitiesQuery, UniversitiesQueryVariables>(UniversitiesDocument, baseOptions);
        }
export type UniversitiesQueryHookResult = ReturnType<typeof useUniversitiesQuery>;
export type UniversitiesLazyQueryHookResult = ReturnType<typeof useUniversitiesLazyQuery>;
export type UniversitiesQueryResult = Apollo.QueryResult<UniversitiesQuery, UniversitiesQueryVariables>;
export const EditUniversityDocument = gql`
    mutation EditUniversity($_id: ObjectId, $name: String!, $universityLogoFile: Upload) {
  editUniversity(_id: $_id, name: $name, universityLogoFile: $universityLogoFile) {
    ...university
  }
}
    ${UniversityFragmentDoc}`;
export type EditUniversityMutationFn = Apollo.MutationFunction<EditUniversityMutation, EditUniversityMutationVariables>;

/**
 * __useEditUniversityMutation__
 *
 * To run a mutation, you first call `useEditUniversityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditUniversityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editUniversityMutation, { data, loading, error }] = useEditUniversityMutation({
 *   variables: {
 *      _id: // value for '_id'
 *      name: // value for 'name'
 *      universityLogoFile: // value for 'universityLogoFile'
 *   },
 * });
 */
export function useEditUniversityMutation(baseOptions?: Apollo.MutationHookOptions<EditUniversityMutation, EditUniversityMutationVariables>) {
        return Apollo.useMutation<EditUniversityMutation, EditUniversityMutationVariables>(EditUniversityDocument, baseOptions);
      }
export type EditUniversityMutationHookResult = ReturnType<typeof useEditUniversityMutation>;
export type EditUniversityMutationResult = Apollo.MutationResult<EditUniversityMutation>;
export type EditUniversityMutationOptions = Apollo.BaseMutationOptions<EditUniversityMutation, EditUniversityMutationVariables>;
export const PersonDocument = gql`
    query Person($personId: ObjectId!) {
  person(personId: $personId) {
    ...person
  }
}
    ${PersonFragmentDoc}`;

/**
 * __usePersonQuery__
 *
 * To run a query within a React component, call `usePersonQuery` and pass it any options that fit your needs.
 * When your component renders, `usePersonQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePersonQuery({
 *   variables: {
 *      personId: // value for 'personId'
 *   },
 * });
 */
export function usePersonQuery(baseOptions?: Apollo.QueryHookOptions<PersonQuery, PersonQueryVariables>) {
        return Apollo.useQuery<PersonQuery, PersonQueryVariables>(PersonDocument, baseOptions);
      }
export function usePersonLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PersonQuery, PersonQueryVariables>) {
          return Apollo.useLazyQuery<PersonQuery, PersonQueryVariables>(PersonDocument, baseOptions);
        }
export type PersonQueryHookResult = ReturnType<typeof usePersonQuery>;
export type PersonLazyQueryHookResult = ReturnType<typeof usePersonLazyQuery>;
export type PersonQueryResult = Apollo.QueryResult<PersonQuery, PersonQueryVariables>;
export const ActiveUserDocument = gql`
    query ActiveUser {
  activeUser {
    ...person
  }
}
    ${PersonFragmentDoc}`;

/**
 * __useActiveUserQuery__
 *
 * To run a query within a React component, call `useActiveUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useActiveUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useActiveUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useActiveUserQuery(baseOptions?: Apollo.QueryHookOptions<ActiveUserQuery, ActiveUserQueryVariables>) {
        return Apollo.useQuery<ActiveUserQuery, ActiveUserQueryVariables>(ActiveUserDocument, baseOptions);
      }
export function useActiveUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ActiveUserQuery, ActiveUserQueryVariables>) {
          return Apollo.useLazyQuery<ActiveUserQuery, ActiveUserQueryVariables>(ActiveUserDocument, baseOptions);
        }
export type ActiveUserQueryHookResult = ReturnType<typeof useActiveUserQuery>;
export type ActiveUserLazyQueryHookResult = ReturnType<typeof useActiveUserLazyQuery>;
export type ActiveUserQueryResult = Apollo.QueryResult<ActiveUserQuery, ActiveUserQueryVariables>;
export const SiginUserDocument = gql`
    mutation SiginUser($password: String!, $email: String!) {
  signIn(data: {password: $password, email: $email}) {
    token
  }
}
    `;
export type SiginUserMutationFn = Apollo.MutationFunction<SiginUserMutation, SiginUserMutationVariables>;

/**
 * __useSiginUserMutation__
 *
 * To run a mutation, you first call `useSiginUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSiginUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [siginUserMutation, { data, loading, error }] = useSiginUserMutation({
 *   variables: {
 *      password: // value for 'password'
 *      email: // value for 'email'
 *   },
 * });
 */
export function useSiginUserMutation(baseOptions?: Apollo.MutationHookOptions<SiginUserMutation, SiginUserMutationVariables>) {
        return Apollo.useMutation<SiginUserMutation, SiginUserMutationVariables>(SiginUserDocument, baseOptions);
      }
export type SiginUserMutationHookResult = ReturnType<typeof useSiginUserMutation>;
export type SiginUserMutationResult = Apollo.MutationResult<SiginUserMutation>;
export type SiginUserMutationOptions = Apollo.BaseMutationOptions<SiginUserMutation, SiginUserMutationVariables>;
export const UserDocument = gql`
    query User($userId: ObjectId!) {
  user(userId: $userId) {
    ...user
  }
}
    ${UserFragmentDoc}`;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useUserQuery(baseOptions?: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>) {
        return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, baseOptions);
      }
export function useUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, baseOptions);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;
export const FindUserDocument = gql`
    query FindUser($search: String!) {
  findUser(search: $search) {
    ...user
  }
}
    ${UserFragmentDoc}`;

/**
 * __useFindUserQuery__
 *
 * To run a query within a React component, call `useFindUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindUserQuery({
 *   variables: {
 *      search: // value for 'search'
 *   },
 * });
 */
export function useFindUserQuery(baseOptions?: Apollo.QueryHookOptions<FindUserQuery, FindUserQueryVariables>) {
        return Apollo.useQuery<FindUserQuery, FindUserQueryVariables>(FindUserDocument, baseOptions);
      }
export function useFindUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindUserQuery, FindUserQueryVariables>) {
          return Apollo.useLazyQuery<FindUserQuery, FindUserQueryVariables>(FindUserDocument, baseOptions);
        }
export type FindUserQueryHookResult = ReturnType<typeof useFindUserQuery>;
export type FindUserLazyQueryHookResult = ReturnType<typeof useFindUserLazyQuery>;
export type FindUserQueryResult = Apollo.QueryResult<FindUserQuery, FindUserQueryVariables>;
export const TeachersDocument = gql`
    query Teachers {
  teachers {
    _id
    firstName
    lastName
    fullName
    educations {
      departmentId
      department {
        _id
        name
      }
    }
  }
}
    `;

/**
 * __useTeachersQuery__
 *
 * To run a query within a React component, call `useTeachersQuery` and pass it any options that fit your needs.
 * When your component renders, `useTeachersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTeachersQuery({
 *   variables: {
 *   },
 * });
 */
export function useTeachersQuery(baseOptions?: Apollo.QueryHookOptions<TeachersQuery, TeachersQueryVariables>) {
        return Apollo.useQuery<TeachersQuery, TeachersQueryVariables>(TeachersDocument, baseOptions);
      }
export function useTeachersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TeachersQuery, TeachersQueryVariables>) {
          return Apollo.useLazyQuery<TeachersQuery, TeachersQueryVariables>(TeachersDocument, baseOptions);
        }
export type TeachersQueryHookResult = ReturnType<typeof useTeachersQuery>;
export type TeachersLazyQueryHookResult = ReturnType<typeof useTeachersLazyQuery>;
export type TeachersQueryResult = Apollo.QueryResult<TeachersQuery, TeachersQueryVariables>;
export const AddTeacherDocument = gql`
    mutation AddTeacher($applicationId: ObjectId!) {
  addTeacher(applicationId: $applicationId) {
    ...user
  }
}
    ${UserFragmentDoc}`;
export type AddTeacherMutationFn = Apollo.MutationFunction<AddTeacherMutation, AddTeacherMutationVariables>;

/**
 * __useAddTeacherMutation__
 *
 * To run a mutation, you first call `useAddTeacherMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddTeacherMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addTeacherMutation, { data, loading, error }] = useAddTeacherMutation({
 *   variables: {
 *      applicationId: // value for 'applicationId'
 *   },
 * });
 */
export function useAddTeacherMutation(baseOptions?: Apollo.MutationHookOptions<AddTeacherMutation, AddTeacherMutationVariables>) {
        return Apollo.useMutation<AddTeacherMutation, AddTeacherMutationVariables>(AddTeacherDocument, baseOptions);
      }
export type AddTeacherMutationHookResult = ReturnType<typeof useAddTeacherMutation>;
export type AddTeacherMutationResult = Apollo.MutationResult<AddTeacherMutation>;
export type AddTeacherMutationOptions = Apollo.BaseMutationOptions<AddTeacherMutation, AddTeacherMutationVariables>;
export const EditUserDocument = gql`
    mutation EditUser($firstName: String!, $lastName: String!, $phone: String, $address: AddressInput, $birthDate: DateTime) {
  editUser(data: {firstName: $firstName, lastName: $lastName, phone: $phone, birthDate: $birthDate, addressData: $address}) {
    ...user
  }
}
    ${UserFragmentDoc}`;
export type EditUserMutationFn = Apollo.MutationFunction<EditUserMutation, EditUserMutationVariables>;

/**
 * __useEditUserMutation__
 *
 * To run a mutation, you first call `useEditUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editUserMutation, { data, loading, error }] = useEditUserMutation({
 *   variables: {
 *      firstName: // value for 'firstName'
 *      lastName: // value for 'lastName'
 *      phone: // value for 'phone'
 *      address: // value for 'address'
 *      birthDate: // value for 'birthDate'
 *   },
 * });
 */
export function useEditUserMutation(baseOptions?: Apollo.MutationHookOptions<EditUserMutation, EditUserMutationVariables>) {
        return Apollo.useMutation<EditUserMutation, EditUserMutationVariables>(EditUserDocument, baseOptions);
      }
export type EditUserMutationHookResult = ReturnType<typeof useEditUserMutation>;
export type EditUserMutationResult = Apollo.MutationResult<EditUserMutation>;
export type EditUserMutationOptions = Apollo.BaseMutationOptions<EditUserMutation, EditUserMutationVariables>;
export const AddParentDocument = gql`
    mutation AddParent($applicationId: ObjectId!) {
  addParent(applicationId: $applicationId) {
    ...user
  }
}
    ${UserFragmentDoc}`;
export type AddParentMutationFn = Apollo.MutationFunction<AddParentMutation, AddParentMutationVariables>;

/**
 * __useAddParentMutation__
 *
 * To run a mutation, you first call `useAddParentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddParentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addParentMutation, { data, loading, error }] = useAddParentMutation({
 *   variables: {
 *      applicationId: // value for 'applicationId'
 *   },
 * });
 */
export function useAddParentMutation(baseOptions?: Apollo.MutationHookOptions<AddParentMutation, AddParentMutationVariables>) {
        return Apollo.useMutation<AddParentMutation, AddParentMutationVariables>(AddParentDocument, baseOptions);
      }
export type AddParentMutationHookResult = ReturnType<typeof useAddParentMutation>;
export type AddParentMutationResult = Apollo.MutationResult<AddParentMutation>;
export type AddParentMutationOptions = Apollo.BaseMutationOptions<AddParentMutation, AddParentMutationVariables>;
export const UserChangePhotoDocument = gql`
    mutation UserChangePhoto($profilePhotoBase64: String!) {
  changeUserPhoto(profilePhotoBase64: $profilePhotoBase64) {
    success
  }
}
    `;
export type UserChangePhotoMutationFn = Apollo.MutationFunction<UserChangePhotoMutation, UserChangePhotoMutationVariables>;

/**
 * __useUserChangePhotoMutation__
 *
 * To run a mutation, you first call `useUserChangePhotoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserChangePhotoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userChangePhotoMutation, { data, loading, error }] = useUserChangePhotoMutation({
 *   variables: {
 *      profilePhotoBase64: // value for 'profilePhotoBase64'
 *   },
 * });
 */
export function useUserChangePhotoMutation(baseOptions?: Apollo.MutationHookOptions<UserChangePhotoMutation, UserChangePhotoMutationVariables>) {
        return Apollo.useMutation<UserChangePhotoMutation, UserChangePhotoMutationVariables>(UserChangePhotoDocument, baseOptions);
      }
export type UserChangePhotoMutationHookResult = ReturnType<typeof useUserChangePhotoMutation>;
export type UserChangePhotoMutationResult = Apollo.MutationResult<UserChangePhotoMutation>;
export type UserChangePhotoMutationOptions = Apollo.BaseMutationOptions<UserChangePhotoMutation, UserChangePhotoMutationVariables>;
export const ResetPasswordDocument = gql`
    mutation ResetPassword($token: String!, $_id: ObjectId!, $password: String) {
  resetPassword(data: {token: $token, _id: $_id, password: $password}) {
    success
  }
}
    `;
export type ResetPasswordMutationFn = Apollo.MutationFunction<ResetPasswordMutation, ResetPasswordMutationVariables>;

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
 *   variables: {
 *      token: // value for 'token'
 *      _id: // value for '_id'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useResetPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ResetPasswordMutation, ResetPasswordMutationVariables>) {
        return Apollo.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument, baseOptions);
      }
export type ResetPasswordMutationHookResult = ReturnType<typeof useResetPasswordMutation>;
export type ResetPasswordMutationResult = Apollo.MutationResult<ResetPasswordMutation>;
export type ResetPasswordMutationOptions = Apollo.BaseMutationOptions<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const ReSendConfirmEmailDocument = gql`
    mutation ReSendConfirmEmail($email: String!, $password: String!) {
  reSendConfirmEmail(data: {email: $email, password: $password}) {
    success
  }
}
    `;
export type ReSendConfirmEmailMutationFn = Apollo.MutationFunction<ReSendConfirmEmailMutation, ReSendConfirmEmailMutationVariables>;

/**
 * __useReSendConfirmEmailMutation__
 *
 * To run a mutation, you first call `useReSendConfirmEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReSendConfirmEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reSendConfirmEmailMutation, { data, loading, error }] = useReSendConfirmEmailMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useReSendConfirmEmailMutation(baseOptions?: Apollo.MutationHookOptions<ReSendConfirmEmailMutation, ReSendConfirmEmailMutationVariables>) {
        return Apollo.useMutation<ReSendConfirmEmailMutation, ReSendConfirmEmailMutationVariables>(ReSendConfirmEmailDocument, baseOptions);
      }
export type ReSendConfirmEmailMutationHookResult = ReturnType<typeof useReSendConfirmEmailMutation>;
export type ReSendConfirmEmailMutationResult = Apollo.MutationResult<ReSendConfirmEmailMutation>;
export type ReSendConfirmEmailMutationOptions = Apollo.BaseMutationOptions<ReSendConfirmEmailMutation, ReSendConfirmEmailMutationVariables>;
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email) {
    success
  }
}
    `;
export type ForgotPasswordMutationFn = Apollo.MutationFunction<ForgotPasswordMutation, ForgotPasswordMutationVariables>;

/**
 * __useForgotPasswordMutation__
 *
 * To run a mutation, you first call `useForgotPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordMutation, { data, loading, error }] = useForgotPasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useForgotPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>) {
        return Apollo.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument, baseOptions);
      }
export type ForgotPasswordMutationHookResult = ReturnType<typeof useForgotPasswordMutation>;
export type ForgotPasswordMutationResult = Apollo.MutationResult<ForgotPasswordMutation>;
export type ForgotPasswordMutationOptions = Apollo.BaseMutationOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($password: String!, $rePassword: String!) {
  changePassword(data: {password: $password, rePassword: $rePassword}) {
    success
  }
}
    `;
export type ChangePasswordMutationFn = Apollo.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      password: // value for 'password'
 *      rePassword: // value for 'rePassword'
 *   },
 * });
 */
export function useChangePasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
        return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, baseOptions);
      }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const ConfirmEmailDocument = gql`
    mutation ConfirmEmail($token: String!, $email: String!) {
  confirmEmail(data: {token: $token, email: $email}) {
    success
  }
}
    `;
export type ConfirmEmailMutationFn = Apollo.MutationFunction<ConfirmEmailMutation, ConfirmEmailMutationVariables>;

/**
 * __useConfirmEmailMutation__
 *
 * To run a mutation, you first call `useConfirmEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConfirmEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [confirmEmailMutation, { data, loading, error }] = useConfirmEmailMutation({
 *   variables: {
 *      token: // value for 'token'
 *      email: // value for 'email'
 *   },
 * });
 */
export function useConfirmEmailMutation(baseOptions?: Apollo.MutationHookOptions<ConfirmEmailMutation, ConfirmEmailMutationVariables>) {
        return Apollo.useMutation<ConfirmEmailMutation, ConfirmEmailMutationVariables>(ConfirmEmailDocument, baseOptions);
      }
export type ConfirmEmailMutationHookResult = ReturnType<typeof useConfirmEmailMutation>;
export type ConfirmEmailMutationResult = Apollo.MutationResult<ConfirmEmailMutation>;
export type ConfirmEmailMutationOptions = Apollo.BaseMutationOptions<ConfirmEmailMutation, ConfirmEmailMutationVariables>;
export const CreateUserDocument = gql`
    mutation CreateUser($firstName: String!, $lastName: String!, $password: String!, $email: String!, $token: String) {
  createUser(inputData: {firstName: $firstName, lastName: $lastName, password: $password, email: $email, token: $token}) {
    _id
    firstName
    lastName
    email
    createdAt
  }
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      firstName: // value for 'firstName'
 *      lastName: // value for 'lastName'
 *      password: // value for 'password'
 *      email: // value for 'email'
 *      token: // value for 'token'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, baseOptions);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const CreateInstUserDocument = gql`
    mutation CreateInstUser($firstName: String!, $lastName: String!, $password: String!, $email: String!, $token: String, $institutionName: String!, $phone: String!) {
  createInst(inputData: {firstName: $firstName, lastName: $lastName, password: $password, email: $email, token: $token, institutionName: $institutionName, phone: $phone}) {
    _id
    firstName
    lastName
    email
    createdAt
  }
}
    `;
export type CreateInstUserMutationFn = Apollo.MutationFunction<CreateInstUserMutation, CreateInstUserMutationVariables>;

/**
 * __useCreateInstUserMutation__
 *
 * To run a mutation, you first call `useCreateInstUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateInstUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createInstUserMutation, { data, loading, error }] = useCreateInstUserMutation({
 *   variables: {
 *      firstName: // value for 'firstName'
 *      lastName: // value for 'lastName'
 *      password: // value for 'password'
 *      email: // value for 'email'
 *      token: // value for 'token'
 *      institutionName: // value for 'institutionName'
 *      phone: // value for 'phone'
 *   },
 * });
 */
export function useCreateInstUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateInstUserMutation, CreateInstUserMutationVariables>) {
        return Apollo.useMutation<CreateInstUserMutation, CreateInstUserMutationVariables>(CreateInstUserDocument, baseOptions);
      }
export type CreateInstUserMutationHookResult = ReturnType<typeof useCreateInstUserMutation>;
export type CreateInstUserMutationResult = Apollo.MutationResult<CreateInstUserMutation>;
export type CreateInstUserMutationOptions = Apollo.BaseMutationOptions<CreateInstUserMutation, CreateInstUserMutationVariables>;
export const ConfirmParentEmailDocument = gql`
    mutation ConfirmParentEmail($token: String!, $unVerifiedEmail: String!) {
  parentConfirmEmail(data: {token: $token, unVerifiedEmail: $unVerifiedEmail}) {
    token
    _id
  }
}
    `;
export type ConfirmParentEmailMutationFn = Apollo.MutationFunction<ConfirmParentEmailMutation, ConfirmParentEmailMutationVariables>;

/**
 * __useConfirmParentEmailMutation__
 *
 * To run a mutation, you first call `useConfirmParentEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConfirmParentEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [confirmParentEmailMutation, { data, loading, error }] = useConfirmParentEmailMutation({
 *   variables: {
 *      token: // value for 'token'
 *      unVerifiedEmail: // value for 'unVerifiedEmail'
 *   },
 * });
 */
export function useConfirmParentEmailMutation(baseOptions?: Apollo.MutationHookOptions<ConfirmParentEmailMutation, ConfirmParentEmailMutationVariables>) {
        return Apollo.useMutation<ConfirmParentEmailMutation, ConfirmParentEmailMutationVariables>(ConfirmParentEmailDocument, baseOptions);
      }
export type ConfirmParentEmailMutationHookResult = ReturnType<typeof useConfirmParentEmailMutation>;
export type ConfirmParentEmailMutationResult = Apollo.MutationResult<ConfirmParentEmailMutation>;
export type ConfirmParentEmailMutationOptions = Apollo.BaseMutationOptions<ConfirmParentEmailMutation, ConfirmParentEmailMutationVariables>;
export const ParentForgotPasswordDocument = gql`
    mutation ParentForgotPassword($email: String!) {
  parentForgotPassword(email: $email) {
    success
  }
}
    `;
export type ParentForgotPasswordMutationFn = Apollo.MutationFunction<ParentForgotPasswordMutation, ParentForgotPasswordMutationVariables>;

/**
 * __useParentForgotPasswordMutation__
 *
 * To run a mutation, you first call `useParentForgotPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useParentForgotPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [parentForgotPasswordMutation, { data, loading, error }] = useParentForgotPasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useParentForgotPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ParentForgotPasswordMutation, ParentForgotPasswordMutationVariables>) {
        return Apollo.useMutation<ParentForgotPasswordMutation, ParentForgotPasswordMutationVariables>(ParentForgotPasswordDocument, baseOptions);
      }
export type ParentForgotPasswordMutationHookResult = ReturnType<typeof useParentForgotPasswordMutation>;
export type ParentForgotPasswordMutationResult = Apollo.MutationResult<ParentForgotPasswordMutation>;
export type ParentForgotPasswordMutationOptions = Apollo.BaseMutationOptions<ParentForgotPasswordMutation, ParentForgotPasswordMutationVariables>;
export const ParentResendConfimEmailDocument = gql`
    mutation ParentResendConfimEmail($unVerifiedEmail: String!, $citizenshipId: String!) {
  parentResendConfirmEmail(data: {unVerifiedEmail: $unVerifiedEmail, citizenshipId: $citizenshipId}) {
    success
  }
}
    `;
export type ParentResendConfimEmailMutationFn = Apollo.MutationFunction<ParentResendConfimEmailMutation, ParentResendConfimEmailMutationVariables>;

/**
 * __useParentResendConfimEmailMutation__
 *
 * To run a mutation, you first call `useParentResendConfimEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useParentResendConfimEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [parentResendConfimEmailMutation, { data, loading, error }] = useParentResendConfimEmailMutation({
 *   variables: {
 *      unVerifiedEmail: // value for 'unVerifiedEmail'
 *      citizenshipId: // value for 'citizenshipId'
 *   },
 * });
 */
export function useParentResendConfimEmailMutation(baseOptions?: Apollo.MutationHookOptions<ParentResendConfimEmailMutation, ParentResendConfimEmailMutationVariables>) {
        return Apollo.useMutation<ParentResendConfimEmailMutation, ParentResendConfimEmailMutationVariables>(ParentResendConfimEmailDocument, baseOptions);
      }
export type ParentResendConfimEmailMutationHookResult = ReturnType<typeof useParentResendConfimEmailMutation>;
export type ParentResendConfimEmailMutationResult = Apollo.MutationResult<ParentResendConfimEmailMutation>;
export type ParentResendConfimEmailMutationOptions = Apollo.BaseMutationOptions<ParentResendConfimEmailMutation, ParentResendConfimEmailMutationVariables>;
export const VoyageDocument = gql`
    query Voyage($voyageId: ObjectId!) {
  voyage(voyageId: $voyageId) {
    ...voyage
  }
}
    ${VoyageFragmentDoc}`;

/**
 * __useVoyageQuery__
 *
 * To run a query within a React component, call `useVoyageQuery` and pass it any options that fit your needs.
 * When your component renders, `useVoyageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVoyageQuery({
 *   variables: {
 *      voyageId: // value for 'voyageId'
 *   },
 * });
 */
export function useVoyageQuery(baseOptions?: Apollo.QueryHookOptions<VoyageQuery, VoyageQueryVariables>) {
        return Apollo.useQuery<VoyageQuery, VoyageQueryVariables>(VoyageDocument, baseOptions);
      }
export function useVoyageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<VoyageQuery, VoyageQueryVariables>) {
          return Apollo.useLazyQuery<VoyageQuery, VoyageQueryVariables>(VoyageDocument, baseOptions);
        }
export type VoyageQueryHookResult = ReturnType<typeof useVoyageQuery>;
export type VoyageLazyQueryHookResult = ReturnType<typeof useVoyageLazyQuery>;
export type VoyageQueryResult = Apollo.QueryResult<VoyageQuery, VoyageQueryVariables>;
export const VoyagesDocument = gql`
    query Voyages {
  voyages {
    ...voyage
  }
}
    ${VoyageFragmentDoc}`;

/**
 * __useVoyagesQuery__
 *
 * To run a query within a React component, call `useVoyagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useVoyagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVoyagesQuery({
 *   variables: {
 *   },
 * });
 */
export function useVoyagesQuery(baseOptions?: Apollo.QueryHookOptions<VoyagesQuery, VoyagesQueryVariables>) {
        return Apollo.useQuery<VoyagesQuery, VoyagesQueryVariables>(VoyagesDocument, baseOptions);
      }
export function useVoyagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<VoyagesQuery, VoyagesQueryVariables>) {
          return Apollo.useLazyQuery<VoyagesQuery, VoyagesQueryVariables>(VoyagesDocument, baseOptions);
        }
export type VoyagesQueryHookResult = ReturnType<typeof useVoyagesQuery>;
export type VoyagesLazyQueryHookResult = ReturnType<typeof useVoyagesLazyQuery>;
export type VoyagesQueryResult = Apollo.QueryResult<VoyagesQuery, VoyagesQueryVariables>;
export const StudentVoyagesDocument = gql`
    query StudentVoyages($parentStudentId: ObjectId!) {
  studentVoyages(parentStudentId: $parentStudentId) {
    ...voyage
  }
}
    ${VoyageFragmentDoc}`;

/**
 * __useStudentVoyagesQuery__
 *
 * To run a query within a React component, call `useStudentVoyagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useStudentVoyagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStudentVoyagesQuery({
 *   variables: {
 *      parentStudentId: // value for 'parentStudentId'
 *   },
 * });
 */
export function useStudentVoyagesQuery(baseOptions?: Apollo.QueryHookOptions<StudentVoyagesQuery, StudentVoyagesQueryVariables>) {
        return Apollo.useQuery<StudentVoyagesQuery, StudentVoyagesQueryVariables>(StudentVoyagesDocument, baseOptions);
      }
export function useStudentVoyagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StudentVoyagesQuery, StudentVoyagesQueryVariables>) {
          return Apollo.useLazyQuery<StudentVoyagesQuery, StudentVoyagesQueryVariables>(StudentVoyagesDocument, baseOptions);
        }
export type StudentVoyagesQueryHookResult = ReturnType<typeof useStudentVoyagesQuery>;
export type StudentVoyagesLazyQueryHookResult = ReturnType<typeof useStudentVoyagesLazyQuery>;
export type StudentVoyagesQueryResult = Apollo.QueryResult<StudentVoyagesQuery, StudentVoyagesQueryVariables>;
export const CreateVoyageDocument = gql`
    mutation CreateVoyage($title: String!, $times: [VoyageTimeInput!]!, $institutionId: ObjectId!, $schoolId: ObjectId!) {
  createVoyage(data: {title: $title, times: $times, institutionId: $institutionId, schoolId: $schoolId}) {
    ...voyage
  }
}
    ${VoyageFragmentDoc}`;
export type CreateVoyageMutationFn = Apollo.MutationFunction<CreateVoyageMutation, CreateVoyageMutationVariables>;

/**
 * __useCreateVoyageMutation__
 *
 * To run a mutation, you first call `useCreateVoyageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateVoyageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createVoyageMutation, { data, loading, error }] = useCreateVoyageMutation({
 *   variables: {
 *      title: // value for 'title'
 *      times: // value for 'times'
 *      institutionId: // value for 'institutionId'
 *      schoolId: // value for 'schoolId'
 *   },
 * });
 */
export function useCreateVoyageMutation(baseOptions?: Apollo.MutationHookOptions<CreateVoyageMutation, CreateVoyageMutationVariables>) {
        return Apollo.useMutation<CreateVoyageMutation, CreateVoyageMutationVariables>(CreateVoyageDocument, baseOptions);
      }
export type CreateVoyageMutationHookResult = ReturnType<typeof useCreateVoyageMutation>;
export type CreateVoyageMutationResult = Apollo.MutationResult<CreateVoyageMutation>;
export type CreateVoyageMutationOptions = Apollo.BaseMutationOptions<CreateVoyageMutation, CreateVoyageMutationVariables>;
export const RemoveStudentVoyageDocument = gql`
    mutation RemoveStudentVoyage($studentId: ObjectId!, $voyageId: ObjectId!) {
  removeStudentVoyage(studentId: $studentId, voyageId: $voyageId) {
    success
  }
}
    `;
export type RemoveStudentVoyageMutationFn = Apollo.MutationFunction<RemoveStudentVoyageMutation, RemoveStudentVoyageMutationVariables>;

/**
 * __useRemoveStudentVoyageMutation__
 *
 * To run a mutation, you first call `useRemoveStudentVoyageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveStudentVoyageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeStudentVoyageMutation, { data, loading, error }] = useRemoveStudentVoyageMutation({
 *   variables: {
 *      studentId: // value for 'studentId'
 *      voyageId: // value for 'voyageId'
 *   },
 * });
 */
export function useRemoveStudentVoyageMutation(baseOptions?: Apollo.MutationHookOptions<RemoveStudentVoyageMutation, RemoveStudentVoyageMutationVariables>) {
        return Apollo.useMutation<RemoveStudentVoyageMutation, RemoveStudentVoyageMutationVariables>(RemoveStudentVoyageDocument, baseOptions);
      }
export type RemoveStudentVoyageMutationHookResult = ReturnType<typeof useRemoveStudentVoyageMutation>;
export type RemoveStudentVoyageMutationResult = Apollo.MutationResult<RemoveStudentVoyageMutation>;
export type RemoveStudentVoyageMutationOptions = Apollo.BaseMutationOptions<RemoveStudentVoyageMutation, RemoveStudentVoyageMutationVariables>;
export const SetVoyageOrderLastDocument = gql`
    mutation SetVoyageOrderLast($voyageId: ObjectId!, $studentId: ObjectId!) {
  setVoyageOrderLast(studentId: $studentId, voyageId: $voyageId) {
    success
  }
}
    `;
export type SetVoyageOrderLastMutationFn = Apollo.MutationFunction<SetVoyageOrderLastMutation, SetVoyageOrderLastMutationVariables>;

/**
 * __useSetVoyageOrderLastMutation__
 *
 * To run a mutation, you first call `useSetVoyageOrderLastMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetVoyageOrderLastMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setVoyageOrderLastMutation, { data, loading, error }] = useSetVoyageOrderLastMutation({
 *   variables: {
 *      voyageId: // value for 'voyageId'
 *      studentId: // value for 'studentId'
 *   },
 * });
 */
export function useSetVoyageOrderLastMutation(baseOptions?: Apollo.MutationHookOptions<SetVoyageOrderLastMutation, SetVoyageOrderLastMutationVariables>) {
        return Apollo.useMutation<SetVoyageOrderLastMutation, SetVoyageOrderLastMutationVariables>(SetVoyageOrderLastDocument, baseOptions);
      }
export type SetVoyageOrderLastMutationHookResult = ReturnType<typeof useSetVoyageOrderLastMutation>;
export type SetVoyageOrderLastMutationResult = Apollo.MutationResult<SetVoyageOrderLastMutation>;
export type SetVoyageOrderLastMutationOptions = Apollo.BaseMutationOptions<SetVoyageOrderLastMutation, SetVoyageOrderLastMutationVariables>;
export const AddStudentVoyageDocument = gql`
    mutation AddStudentVoyage($voyageId: ObjectId!, $studentId: ObjectId!) {
  addStudentVoyage(studentId: $studentId, voyageId: $voyageId) {
    success
  }
}
    `;
export type AddStudentVoyageMutationFn = Apollo.MutationFunction<AddStudentVoyageMutation, AddStudentVoyageMutationVariables>;

/**
 * __useAddStudentVoyageMutation__
 *
 * To run a mutation, you first call `useAddStudentVoyageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddStudentVoyageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addStudentVoyageMutation, { data, loading, error }] = useAddStudentVoyageMutation({
 *   variables: {
 *      voyageId: // value for 'voyageId'
 *      studentId: // value for 'studentId'
 *   },
 * });
 */
export function useAddStudentVoyageMutation(baseOptions?: Apollo.MutationHookOptions<AddStudentVoyageMutation, AddStudentVoyageMutationVariables>) {
        return Apollo.useMutation<AddStudentVoyageMutation, AddStudentVoyageMutationVariables>(AddStudentVoyageDocument, baseOptions);
      }
export type AddStudentVoyageMutationHookResult = ReturnType<typeof useAddStudentVoyageMutation>;
export type AddStudentVoyageMutationResult = Apollo.MutationResult<AddStudentVoyageMutation>;
export type AddStudentVoyageMutationOptions = Apollo.BaseMutationOptions<AddStudentVoyageMutation, AddStudentVoyageMutationVariables>;
export const VoyageTimeDocument = gql`
    query VoyageTime($voyageTimeId: ObjectId!, $voyageId: ObjectId!) {
  voyageTime(voyageTimeId: $voyageTimeId, voyageId: $voyageId) {
    ...voyageTime
  }
}
    ${VoyageTimeFragmentDoc}`;

/**
 * __useVoyageTimeQuery__
 *
 * To run a query within a React component, call `useVoyageTimeQuery` and pass it any options that fit your needs.
 * When your component renders, `useVoyageTimeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVoyageTimeQuery({
 *   variables: {
 *      voyageTimeId: // value for 'voyageTimeId'
 *      voyageId: // value for 'voyageId'
 *   },
 * });
 */
export function useVoyageTimeQuery(baseOptions?: Apollo.QueryHookOptions<VoyageTimeQuery, VoyageTimeQueryVariables>) {
        return Apollo.useQuery<VoyageTimeQuery, VoyageTimeQueryVariables>(VoyageTimeDocument, baseOptions);
      }
export function useVoyageTimeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<VoyageTimeQuery, VoyageTimeQueryVariables>) {
          return Apollo.useLazyQuery<VoyageTimeQuery, VoyageTimeQueryVariables>(VoyageTimeDocument, baseOptions);
        }
export type VoyageTimeQueryHookResult = ReturnType<typeof useVoyageTimeQuery>;
export type VoyageTimeLazyQueryHookResult = ReturnType<typeof useVoyageTimeLazyQuery>;
export type VoyageTimeQueryResult = Apollo.QueryResult<VoyageTimeQuery, VoyageTimeQueryVariables>;
export const UpdatePositionDocument = gql`
    mutation UpdatePosition($position: PositionInput!, $voyageId: ObjectId!, $timeId: ObjectId!, $sessionId: ObjectId!) {
  updatePosition(data: {position: $position, voyageId: $voyageId, timeId: $timeId, sessionId: $sessionId}) {
    ...positionType
  }
}
    ${PositionTypeFragmentDoc}`;
export type UpdatePositionMutationFn = Apollo.MutationFunction<UpdatePositionMutation, UpdatePositionMutationVariables>;

/**
 * __useUpdatePositionMutation__
 *
 * To run a mutation, you first call `useUpdatePositionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePositionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePositionMutation, { data, loading, error }] = useUpdatePositionMutation({
 *   variables: {
 *      position: // value for 'position'
 *      voyageId: // value for 'voyageId'
 *      timeId: // value for 'timeId'
 *      sessionId: // value for 'sessionId'
 *   },
 * });
 */
export function useUpdatePositionMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePositionMutation, UpdatePositionMutationVariables>) {
        return Apollo.useMutation<UpdatePositionMutation, UpdatePositionMutationVariables>(UpdatePositionDocument, baseOptions);
      }
export type UpdatePositionMutationHookResult = ReturnType<typeof useUpdatePositionMutation>;
export type UpdatePositionMutationResult = Apollo.MutationResult<UpdatePositionMutation>;
export type UpdatePositionMutationOptions = Apollo.BaseMutationOptions<UpdatePositionMutation, UpdatePositionMutationVariables>;
export const StartPositionDocument = gql`
    mutation StartPosition($position: PositionInput!, $voyageId: ObjectId!, $timeId: ObjectId!) {
  startPosition(data: {position: $position, voyageId: $voyageId, timeId: $timeId}) {
    ...voyageTime
  }
}
    ${VoyageTimeFragmentDoc}`;
export type StartPositionMutationFn = Apollo.MutationFunction<StartPositionMutation, StartPositionMutationVariables>;

/**
 * __useStartPositionMutation__
 *
 * To run a mutation, you first call `useStartPositionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStartPositionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [startPositionMutation, { data, loading, error }] = useStartPositionMutation({
 *   variables: {
 *      position: // value for 'position'
 *      voyageId: // value for 'voyageId'
 *      timeId: // value for 'timeId'
 *   },
 * });
 */
export function useStartPositionMutation(baseOptions?: Apollo.MutationHookOptions<StartPositionMutation, StartPositionMutationVariables>) {
        return Apollo.useMutation<StartPositionMutation, StartPositionMutationVariables>(StartPositionDocument, baseOptions);
      }
export type StartPositionMutationHookResult = ReturnType<typeof useStartPositionMutation>;
export type StartPositionMutationResult = Apollo.MutationResult<StartPositionMutation>;
export type StartPositionMutationOptions = Apollo.BaseMutationOptions<StartPositionMutation, StartPositionMutationVariables>;
export const StopPositionDocument = gql`
    mutation StopPosition($voyageId: ObjectId!, $timeId: ObjectId!) {
  stopPosition(data: {voyageId: $voyageId, timeId: $timeId}) {
    ...voyageTime
  }
}
    ${VoyageTimeFragmentDoc}`;
export type StopPositionMutationFn = Apollo.MutationFunction<StopPositionMutation, StopPositionMutationVariables>;

/**
 * __useStopPositionMutation__
 *
 * To run a mutation, you first call `useStopPositionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStopPositionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [stopPositionMutation, { data, loading, error }] = useStopPositionMutation({
 *   variables: {
 *      voyageId: // value for 'voyageId'
 *      timeId: // value for 'timeId'
 *   },
 * });
 */
export function useStopPositionMutation(baseOptions?: Apollo.MutationHookOptions<StopPositionMutation, StopPositionMutationVariables>) {
        return Apollo.useMutation<StopPositionMutation, StopPositionMutationVariables>(StopPositionDocument, baseOptions);
      }
export type StopPositionMutationHookResult = ReturnType<typeof useStopPositionMutation>;
export type StopPositionMutationResult = Apollo.MutationResult<StopPositionMutation>;
export type StopPositionMutationOptions = Apollo.BaseMutationOptions<StopPositionMutation, StopPositionMutationVariables>;
export const AddVoyageTimeDocument = gql`
    mutation addVoyageTime($voyageId: ObjectId!, $day: Int!, $hour: Time!, $isTakeSchool: Boolean!) {
  addVoyageTime(data: {day: $day, hour: $hour, isTakeSchool: $isTakeSchool}, voyageId: $voyageId) {
    ...voyageTime
  }
}
    ${VoyageTimeFragmentDoc}`;
export type AddVoyageTimeMutationFn = Apollo.MutationFunction<AddVoyageTimeMutation, AddVoyageTimeMutationVariables>;

/**
 * __useAddVoyageTimeMutation__
 *
 * To run a mutation, you first call `useAddVoyageTimeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddVoyageTimeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addVoyageTimeMutation, { data, loading, error }] = useAddVoyageTimeMutation({
 *   variables: {
 *      voyageId: // value for 'voyageId'
 *      day: // value for 'day'
 *      hour: // value for 'hour'
 *      isTakeSchool: // value for 'isTakeSchool'
 *   },
 * });
 */
export function useAddVoyageTimeMutation(baseOptions?: Apollo.MutationHookOptions<AddVoyageTimeMutation, AddVoyageTimeMutationVariables>) {
        return Apollo.useMutation<AddVoyageTimeMutation, AddVoyageTimeMutationVariables>(AddVoyageTimeDocument, baseOptions);
      }
export type AddVoyageTimeMutationHookResult = ReturnType<typeof useAddVoyageTimeMutation>;
export type AddVoyageTimeMutationResult = Apollo.MutationResult<AddVoyageTimeMutation>;
export type AddVoyageTimeMutationOptions = Apollo.BaseMutationOptions<AddVoyageTimeMutation, AddVoyageTimeMutationVariables>;
export const RemoveVoyageTimeDocument = gql`
    mutation removeVoyageTime($voyageId: ObjectId!, $timeId: ObjectId!) {
  removeVoyageTime(timeId: $timeId, voyageId: $voyageId) {
    ...removeResult
  }
}
    ${RemoveResultFragmentDoc}`;
export type RemoveVoyageTimeMutationFn = Apollo.MutationFunction<RemoveVoyageTimeMutation, RemoveVoyageTimeMutationVariables>;

/**
 * __useRemoveVoyageTimeMutation__
 *
 * To run a mutation, you first call `useRemoveVoyageTimeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveVoyageTimeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeVoyageTimeMutation, { data, loading, error }] = useRemoveVoyageTimeMutation({
 *   variables: {
 *      voyageId: // value for 'voyageId'
 *      timeId: // value for 'timeId'
 *   },
 * });
 */
export function useRemoveVoyageTimeMutation(baseOptions?: Apollo.MutationHookOptions<RemoveVoyageTimeMutation, RemoveVoyageTimeMutationVariables>) {
        return Apollo.useMutation<RemoveVoyageTimeMutation, RemoveVoyageTimeMutationVariables>(RemoveVoyageTimeDocument, baseOptions);
      }
export type RemoveVoyageTimeMutationHookResult = ReturnType<typeof useRemoveVoyageTimeMutation>;
export type RemoveVoyageTimeMutationResult = Apollo.MutationResult<RemoveVoyageTimeMutation>;
export type RemoveVoyageTimeMutationOptions = Apollo.BaseMutationOptions<RemoveVoyageTimeMutation, RemoveVoyageTimeMutationVariables>;
export const CreateHoursDocument = gql`
    mutation CreateHours($_id: ObjectId, $schoolId: ObjectId!, $name: String!, $hour: [HourInput!]!) {
  createHour(data: {_id: $_id, schoolId: $schoolId, name: $name, hour: $hour}) {
    ...weeklyHour
  }
}
    ${WeeklyHourFragmentDoc}`;
export type CreateHoursMutationFn = Apollo.MutationFunction<CreateHoursMutation, CreateHoursMutationVariables>;

/**
 * __useCreateHoursMutation__
 *
 * To run a mutation, you first call `useCreateHoursMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateHoursMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createHoursMutation, { data, loading, error }] = useCreateHoursMutation({
 *   variables: {
 *      _id: // value for '_id'
 *      schoolId: // value for 'schoolId'
 *      name: // value for 'name'
 *      hour: // value for 'hour'
 *   },
 * });
 */
export function useCreateHoursMutation(baseOptions?: Apollo.MutationHookOptions<CreateHoursMutation, CreateHoursMutationVariables>) {
        return Apollo.useMutation<CreateHoursMutation, CreateHoursMutationVariables>(CreateHoursDocument, baseOptions);
      }
export type CreateHoursMutationHookResult = ReturnType<typeof useCreateHoursMutation>;
export type CreateHoursMutationResult = Apollo.MutationResult<CreateHoursMutation>;
export type CreateHoursMutationOptions = Apollo.BaseMutationOptions<CreateHoursMutation, CreateHoursMutationVariables>;