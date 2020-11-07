/* eslint-disable no-unused-vars */

import {
  Resolver,
  Mutation,
  Ctx,
  Arg,
  InputType,
  Field,
  Int,
  Query,
  ResolverInterface,
  FieldResolver,
  Root,
  Authorized,
} from "type-graphql";
import { Types } from "mongoose";
import {
  RemoveResult,
  UpdateResults,
  Result,
  AddressInput,
  ObjectIdScalar,
} from "./types";
import models from "../models";
import {
  Context,
  ApolloError,
  UserInputError,
  AuthenticationError,
  ForbiddenError,
} from "apollo-server-core";
import { Lesson } from "./../models/lessonSchema";
import { Student, IStudent, StudentPassword } from "../models/student";
import { UpdateResult } from "./types";
import { LoginToken } from "./types";
import {
  StudentNotificationState,
  Notification,
} from "../models/studentNotification";
import { Hour } from "../models/hourSchema";
import { CContext } from "../types";
import { IsMongoId, Length, ArrayUnique, Min } from "class-validator";
import { NotificationService } from "../services/notification";
import { Role } from "../models/person";
import { StudentBuilPath } from "./../helper/StudentBuildPath";
import { Person } from "../models/person";
import { Container } from "typedi";
import { ClassService } from "./../services/classType";
import { SchoolService } from "./../services/school";
import { StudentService } from "./../services/student";
import { WeeklyHourService } from "./../services/weeklyHour";
import { ObjectType } from "type-graphql";
import { Address } from "../models/address";
import { AddressLocationService } from "./../services/addressLocation";
import { ObjectId } from "mongodb";
import { LessonService } from "./../services/lesson";
const { model } = models;

@InputType()
class ChangePasswordInput implements Partial<Student> {
  @Length(6, 15)
  @Field()
  password: string;

  @Length(6, 15)
  @Field()
  rePassword: string;
}

@InputType()
class StudentCitizenshipInput implements Partial<Student> {
  @Length(6, 15)
  @Field()
  citizenshipId: string;

  @Field(() => ObjectIdScalar)
  studentId: Student["_id"];
}

@InputType()
class StudentsInput {
  @Field(() => ObjectIdScalar, { nullable: true })
  schoolId: ObjectId;

  @Field(() => ObjectIdScalar, { nullable: true })
  classId?: ObjectId;

  @Field({ nullable: true })
  notClass?: boolean;

  @ArrayUnique()
  @Field(() => [ObjectIdScalar], { nullable: true })
  studentIds?: ObjectId[];

  @Field({ nullable: true })
  search?: string;

  @Min(1)
  @Field(() => Int, { nullable: true })
  page?: number;
}

@InputType()
class StudentInput implements Partial<Student> {
  @Length(2, 50)
  @Field()
  firstName: string;

  @Length(2, 50)
  @Field()
  lastName: string;

  @Length(2, 12)
  @Field()
  citizenshipId: string;

  @Length(3, 255)
  @Field({ nullable: true })
  foreignLanguage?: string;

  @Field(() => ObjectIdScalar, { nullable: true })
  school?: ObjectId;

  @Field(() => ObjectIdScalar, { nullable: true })
  class?: ObjectId;

  @Field({ nullable: true })
  eOkulCode?: string;

  @Field({ nullable: true })
  profilePhotoBase64?: string;

  @Length(1, 55)
  @Field({ nullable: true })
  schoolNo?: string;
}

@InputType()
class StudentDriverInput {
  @Field()
  search: string;

  @Field(() => ObjectIdScalar)
  institutionId: ObjectId;

  @Field(() => [ObjectIdScalar], { nullable: true })
  studentIds?: ObjectId[];
}

@InputType()
class TransferInput {
  @Field(() => ObjectIdScalar)
  schoolId: ObjectId;

  @Field(() => ObjectIdScalar, { nullable: true })
  classId?: ObjectId;

  @Field(() => [ObjectIdScalar!]!, { nullable: true })
  students: ObjectId[];
}
@InputType()
class StudentCountInput {
  @Field(() => ObjectIdScalar, { nullable: true })
  schoolId?: ObjectId;

  @Field(() => ObjectIdScalar, { nullable: true })
  classId?: ObjectId;
}
@ObjectType()
class StudentCount {
  @Field(() => Int)
  studentCount: number;
}

@Resolver(() => Student)
export class StudentFieldResolver implements ResolverInterface<Student> {
  constructor(
    private readonly classService: ClassService,
    private readonly schoolService: SchoolService
  ) {
    this.classService = Container.get(ClassService);
    this.schoolService = Container.get(SchoolService);
  }
  @FieldResolver(() => String)
  async className(
    @Root() student: IStudent | Student,
    @Ctx() ctx: Context<CContext>
  ) {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    if (!student.class) return "";
    const errorMessage = "Sınıf bulunamadı";
    if (!student.school || !student.class) return errorMessage;
    const classData = await this.classService.getById(
      student.institutionId,
      student.school,
      student.class
    );
    if (classData) {
      return `${classData.level} ${classData.code} ${classData.code1}`;
    }
    return errorMessage;
  }
  @FieldResolver(() => String)
  async schoolName(
    @Root() student: IStudent | Student,
    @Ctx() ctx: Context<CContext>
  ): Promise<string> {
    const { activeUser } = ctx;
    const errorMessage = "Okul bulunamadı";
    if (!activeUser) throw new AuthenticationError("");
    if (!student.school) return "";
    const school = await this.schoolService.getById(
      student.institutionId,
      student.school
    );
    if (school) return school.name;
    return errorMessage;
  }
  @FieldResolver(() => Address)
  async address(
    @Root() student: IStudent | Student,
    @Ctx() ctx: Context<CContext>
  ) {
    return student.address;
  }
}
@Resolver()
export class StudentResolver {
  /**
   *
   */
  constructor(
    private readonly studentService: StudentService,
    private readonly schoolService: SchoolService,
    private readonly weeklyHourService: WeeklyHourService,
    private readonly notificationService: NotificationService,
    private readonly addressLocationService: AddressLocationService,
    private readonly lessonService: LessonService
  ) {
    this.studentService = Container.get(StudentService);
    this.lessonService = Container.get(LessonService);
    this.schoolService = Container.get(SchoolService);
    this.weeklyHourService = Container.get(WeeklyHourService);
    this.notificationService = Container.get(NotificationService);
    this.addressLocationService = Container.get(AddressLocationService);
  }

  @Authorized(Role.OWNER, Role.ADMIN, Role.TEACHER)
  @Query(() => [Student])
  async students(
    @Ctx() ctx: Context<CContext>,
    @Arg("query", () => StudentsInput) query: StudentsInput
  ): Promise<Student[]> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const students = await this.studentService.getByQuery({
      ...query,
      institutionId: new ObjectId(activeUser.teacher.institutionId),
    });
    if (students) return students;
    throw new ApolloError("Students didn't find");
  }
  @Authorized(Role.DRIVER)
  @Query(() => [Student])
  async studentsDriver(
    @Ctx() ctx: Context<CContext>,
    @Arg("query", () => StudentDriverInput) query: StudentDriverInput
  ): Promise<Student[]> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.driver) throw new AuthenticationError("");
    const studentIds = activeUser.driver.find(
      (i) => i.institutionId === query.institutionId.toHexString()
    )?.studentIds;
    if (!studentIds) throw new AuthenticationError("");
    const students = await this.studentService.getManyForDriver(
      query.search,
      studentIds.map((s) => new ObjectId(s)),
      query.studentIds
    );
    return students || [];
  }
  @Authorized(Role.OWNER, Role.ADMIN, Role.TEACHER)
  @Query(() => StudentCount)
  async studentCount(
    @Ctx() ctx: Context<CContext>,
    @Arg("query", () => StudentCountInput) query: StudentCountInput
  ): Promise<StudentCount> {
    const count = await this.studentService.getCount(query);
    return { studentCount: count };
  }
  @Authorized(Role.STUDENT, Role.PARENT)
  @Query(() => [Hour])
  async myHour(
    @Arg("parentStudentId", () => ObjectIdScalar, { nullable: true })
    parentStudentId: ObjectId,
    @Ctx() ctx: Context<CContext>
  ): Promise<Hour[]> {
    const { activeUser, requestParent } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new ApolloError("");
    let schoolId = activeUser.student?.classId;
    if (activeUser.roles.includes(Role.PARENT) && requestParent) {
      const student = await this.studentService.getStudentById(
        new ObjectId(requestParent.studentId)
      );
      if (!student) throw new ForbiddenError("");
      if (student && student.school) {
        schoolId = student.school.toHexString();
      }
    }
    const weeklyHour = await this.weeklyHourService.getById(
      new ObjectId(activeUser.teacher.institutionId),
      new ObjectId(schoolId)
    );
    if (weeklyHour) return weeklyHour.hour;
    return [];
  }
  @Authorized(Role.OWNER, Role.ADMIN)
  @Query(() => Student)
  async student(
    @Ctx() ctx: Context<CContext>,
    @Arg("studentId", () => ObjectIdScalar, { nullable: true })
    studentId?: ObjectId,
    @Arg("citizenshipId", { nullable: true }) citizenshipId?: string
  ): Promise<Student> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    if (studentId) {
      const student = await this.studentService.getStudentById(studentId);
      if (student) return student;
      throw new ApolloError("Student didn't find");
    }
    if (citizenshipId) {
      const student = await this.studentService.getStudentByCitizenshipId(
        citizenshipId,
        new ObjectId(activeUser.teacher.institutionId)
      );
      if (student) return student;
    }
    throw new ApolloError("Student didn't find");
  }
  @Authorized(Role.STUDENT)
  @Query(() => Person)
  async activeStudent(@Ctx() ctx: Context<CContext>): Promise<Person> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    const student = await this.studentService.getStudentById(
      new ObjectId(activeUser._id)
    );
    if (student) return student;
    throw new ApolloError("");
  }
  @Authorized(Role.STUDENT, Role.PARENT)
  @Query(() => [Lesson])
  async studentMyLessons(
    @Arg("parentStudentId", () => ObjectIdScalar, { nullable: true })
    parentStudentId: ObjectId,
    @Ctx() ctx: Context<CContext>
  ): Promise<Lesson[]> {
    const { activeUser, requestParent } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    let schoolId: ObjectId | null = null;
    let classId: ObjectId | null = null;
    let institutionId: ObjectId | null = null;
    if (activeUser.student) {
      schoolId = new ObjectId(activeUser.student.classId);
      classId = new ObjectId(activeUser.student.classId);
      institutionId = new ObjectId(activeUser.student.institutionId);
    }
    if (activeUser.roles.includes(Role.PARENT) && requestParent) {
      const student = await this.studentService.getStudentById(
        new ObjectId(requestParent.studentId)
      );
      if (!student) throw new ApolloError("Student didn't find");
      if (!student.school || !student.class) return [];
      schoolId = student.school;
      classId = student.class;
      institutionId = student.institutionId;
    }
    if (!institutionId || !schoolId || !classId) throw new ForbiddenError("");
    const school = await this.schoolService.getById(institutionId, schoolId);
    if (!school) throw new ApolloError("school didn't find");
    const [educationYear] = school.educationYears;
    return this.lessonService.getManyByEducationYearId(
      institutionId,
      schoolId,
      classId,
      educationYear._id
    );
  }
  @Authorized(Role.STUDENT, Role.PARENT)
  @Query(() => [Notification])
  async studentNotifications(
    @Ctx() ctx: Context<CContext>,
    @Arg("parentStudentId", () => ObjectIdScalar, { nullable: true })
    parentStudentId?: ObjectId,
    @Arg("skip", () => Int, { nullable: true }) skip?: number
  ): Promise<Notification[]> {
    const { activeUser, requestParent } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    let _id = new ObjectId(activeUser._id);
    if (requestParent && activeUser.roles.includes(Role.PARENT)) {
      _id = new ObjectId(requestParent.studentId);
    }
    return await this.notificationService.getByUserId(_id, skip || 0);
  }

  @Authorized(Role.OWNER, Role.ADMIN)
  @Mutation(() => Student)
  async addStudent(
    @Arg("student") student: StudentInput,
    @Ctx() ctx: Context<CContext>
  ): Promise<Student> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const { eOkulCode, profilePhotoBase64, ...studentData } = student;
    let schoolId: ObjectId | null = null;
    if (eOkulCode) {
      const school = await this.schoolService.getByEOkulCode(
        new ObjectId(activeUser.teacher.institutionId),
        eOkulCode
      );
      if (school) {
        schoolId = school._id;
      }
    }

    const findedStudent = await this.studentService.getStudentByCitizenshipId(
      studentData.citizenshipId,
      new ObjectId(activeUser.teacher.institutionId)
    );
    const id = new Types.ObjectId();
    const studentId = findedStudent ? findedStudent._id : id;
    if (profilePhotoBase64) {
      await this.studentService.updatePhoto(
        profilePhotoBase64,
        studentId,
        new StudentBuilPath(activeUser.teacher.institutionId)
      );
    }
    if (findedStudent) {
      const student = await this.studentService.updateStudent(
        { ...studentData, profilePhoto: !!profilePhotoBase64 },
        studentId
      );
      if (student) return student;
    } else {
      return this.studentService.createStudent({
        ...studentData,
        _id: id,
        school: studentData.school || schoolId || undefined,
        institutionId: new ObjectId(activeUser.teacher.institutionId),
        profilePhoto: !!profilePhotoBase64,
      });
    }
    throw new ApolloError("");
  }
  @Authorized(Role.OWNER, Role.ADMIN)
  @Mutation(() => UpdateResult)
  async transferStudents(
    @Arg("data", () => TransferInput) data: TransferInput,
    @Ctx() ctx: Context<CContext>
  ): Promise<UpdateResult> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      return { success: false, code: "200" };
    const { schoolId, classId, students } = data;
    if (!classId) {
      const result = await this.studentService.transferSchoolMany(
        new ObjectId(activeUser.teacher.institutionId),
        students,
        schoolId
      );
      return { code: "200", success: result };
    }
    const result = await this.studentService.transferClassMany(
      new ObjectId(activeUser.teacher.institutionId),
      students,
      schoolId,
      classId
    );
    return { code: "200", success: result };
  }
  @Authorized(Role.OWNER, Role.ADMIN)
  @Mutation(() => StudentPassword)
  async resetStudentPassword(
    @Arg("studentId", () => ObjectIdScalar) studentId: ObjectId,
    @Ctx() ctx: Context<CContext>
  ): Promise<StudentPassword> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const student = await this.studentService.getStudentById(
      new ObjectId(studentId)
    );
    if (
      !student ||
      !student.institutionId.equals(activeUser.teacher?.institutionId)
    )
      throw new ForbiddenError("");
    const password = await this.studentService.resetPassword(student._id);
    return { password };
  }
  @Authorized(Role.USER)
  @Mutation(() => Result)
  async changePassword(
    @Ctx() ctx: Context<CContext>,
    @Arg("data", () => ChangePasswordInput)
    data: ChangePasswordInput
  ): Promise<Result> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    if (data.password !== data.rePassword)
      throw new UserInputError("password and repassword not equel");
    const result = await this.studentService.changePassword(
      data.password,
      new ObjectId(activeUser._id)
    );
    return { success: result };
  }
  @Authorized(Role.OWNER, Role.ADMIN)
  @Mutation(() => RemoveResult)
  async editStudentCitizenshipId(
    @Arg("data") data: StudentCitizenshipInput,
    @Ctx() ctx: Context<CContext>
  ): Promise<Result> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const { citizenshipId, studentId } = data;
    const student = await this.studentService.getStudentByCitizenshipId(
      citizenshipId,
      new ObjectId(activeUser.teacher.institutionId)
    );
    if (student)
      throw new ApolloError(
        "There are already student with this citizenship id ",
        "103"
      );
    const updateStudent = await this.studentService.updateStudent(
      { citizenshipId },
      studentId
    );
    if (!updateStudent) throw new ApolloError("Student didn't find");
    return { success: true };
  }
  @Authorized(Role.OWNER, Role.ADMIN)
  @Mutation(() => RemoveResult)
  async dismissStudent(
    @Arg("studentId", () => ObjectIdScalar) studentId: ObjectId,
    @Arg("level", () => Int) level: number,
    @Ctx() ctx: Context<CContext>
  ): Promise<RemoveResult> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    let result = false;
    switch (level) {
      case 1:
        result = await this.studentService.dismissClass(
          new ObjectId(activeUser.teacher.institutionId),
          studentId
        );
        return { code: "200", success: result, _id: studentId.toHexString() };
      case 2:
        result = await this.studentService.dismissSchool(
          new ObjectId(activeUser.teacher.institutionId),
          studentId
        );
        return { code: "200", success: result, _id: studentId.toHexString() };
      case 3:
        result = await this.studentService.studentDelete(
          new ObjectId(activeUser.teacher.institutionId),
          studentId
        );
        return { code: "200", success: result, _id: studentId.toHexString() };
      default:
        throw new ApolloError("");
    }
  }

  @Mutation(() => LoginToken)
  async studentSignIn(
    @Arg("username") username: string,
    @Arg("password") password: string
  ): Promise<LoginToken> {
    const student = await model.Student.findOne({ username });
    if (!student) throw new ApolloError("Username or password is wrong", "102");
    const isValid = await student.passwordEqualAsync(password);
    if (!isValid) throw new ApolloError("Username or password is wrong", "102");
    const token = student.generateAuthToken();
    await student.updateLastLogin();
    if (token) return { token };
    throw new AuthenticationError("");
  }
  @Authorized(Role.STUDENT)
  @Mutation(() => UpdateResults)
  async studentNotificationsStatusUpdate(
    @Arg("ids", () => [ObjectIdScalar]) ids: ObjectId[],
    @Arg("state", () => StudentNotificationState)
    state: StudentNotificationState,
    @Ctx() ctx: Context<CContext>
  ): Promise<UpdateResults> {
    const { activeUser } = ctx;
    if (!activeUser) return { code: "200", success: false, _ids: [] };
    const result = await this.notificationService.update(ids, state);
    return {
      code: "200",
      success: result,
      _ids: ids.map((e) => e.toHexString()),
    };
  }
  @Authorized(Role.PARENT)
  @Mutation(() => Address)
  async updateStudentAddress(
    @Arg("i", () => ObjectIdScalar) i: ObjectId,
    @Arg("data", () => AddressInput)
    data: AddressInput,
    @Ctx() ctx: Context<CContext>
  ): Promise<Address> {
    const { lat, lng, ...restAddress } = data;
    const location = this.addressLocationService.create(lat, lng);
    const address = await this.studentService.updateAddress(
      { ...restAddress, location, _id: new ObjectId() },
      i
    );
    if (address) return address;
    throw new ApolloError("Failed");
  }
}
