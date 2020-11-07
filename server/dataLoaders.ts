import DataLoader from "dataloader";
import models from "./models";
import { IDataLoader, QueryType, LessonAndInstId, IActiveUser } from "./types";
import stringify from "json-stable-stringify";
import { Student, IStudent } from "./models/student";
import sift from "sift";
import { IUser } from "./models/user";
import { ILessonG, Lesson } from "./models/lessonGModel";
import findLessonWithoutSchool from "./helper/findLessonWithoutSchool";
import { IPerson } from "./models/person";
import { ObjectId } from "mongodb";
import { IInstitution, InstitutionModel } from "./models/Institution";

const { model } = models;

async function batchInstitution(ids: readonly ObjectId[]) {
  let institutions: IInstitution[] = [];
  if (ids.length === 1) {
    const institution = await InstitutionModel.findById(ids[0]);
    if (institution) institutions.push(institution);
    else {
      institutions = await InstitutionModel.find({ _id: { $in: [...ids] } });
    }
  }
  return ids.map((key) => institutions.find((i) => i._id.equals(key)));
}
async function batchLessonGbyId(ids: readonly ObjectId[]) {
  let lessons: ILessonG[] = [];
  if (ids.length === 1) {
    const lesson = await Lesson.findById(ids[0]);
    if (lesson) lessons = [lesson];
  } else {
    lessons = await Lesson.find({ _id: { $in: [...ids] } });
  }
  return ids.map((key) =>
    lessons.find((lessonValue) => lessonValue.id === key.toString())
  );
}
async function batchUserbyId(ids: readonly ObjectId[]) {
  let users: IUser[] = [];
  if (ids.length === 1) {
    const user = await model.User.findById(ids[0]);
    if (user) users = [user];
  } else {
    users = await model.User.find({ _id: { $in: [...ids] } });
  }
  return ids.map((key) =>
    users.find((userValue) => userValue.id === key.toString())
  );
}

async function batchPersonbyId(ids: readonly ObjectId[]) {
  let people: IPerson[] | IUser[] | IStudent[] = [];
  if (ids.length === 1) {
    const person = await model.Person.findById(ids[0]);
    if (person) people = [person];
  } else {
    people = await model.Person.find({ _id: { $in: [...ids] } });
  }
  return ids.map((key) =>
    people.find((userValue) => userValue.id === key.toString())
  );
}
/**
 *don't use loadmany
 */
async function batchStudentbyQuery(query: readonly any[]) {
  const students = await model.Student.find(
    query.length === 1 ? query[0] : { $or: [...query] }
  );
  /*
  return query.map((queryValue) => students.filter(sift(queryValue)));
  */
  return [students];
}

async function batchStudentbyId(studentIds: readonly ObjectId[]) {
  const students: IStudent[] = [];
  if (studentIds.length === 1) {
    const student = await model.Student.findById(studentIds[0]);
    if (student) students.push(student);
  } else {
    const studenList = await model.Student.find({
      _id: { $in: [...studentIds] },
    });
    studenList.forEach((s) => students.push(s));
  }
  return studentIds.map((id) => students.find((s) => s.id === id.toString()));
}

export default (user?: IActiveUser): IDataLoader => ({
  lessonGLoader: new DataLoader(
    (ids: readonly ObjectId[]) => batchLessonGbyId(ids),
    {
      cacheKeyFn: (key) => key.toString(),
    }
  ),
  userLoader: new DataLoader((ids: readonly ObjectId[]) => batchUserbyId(ids), {
    cacheKeyFn: (key) => key.toString(),
  }),
  personLoader: new DataLoader(
    (ids: readonly ObjectId[]) => batchPersonbyId(ids),
    {
      cacheKeyFn: (key) => key.toString(),
    }
  ),
  studentLoader: new DataLoader(
    (query: readonly QueryType<Student>[]) => batchStudentbyQuery(query),
    {
      cacheKeyFn: (key) => stringify(key),
    }
  ),
  lessonLoader: new DataLoader(
    (query: readonly ObjectId[]) => findLessonWithoutSchool(query, user),
    {
      cacheKeyFn: (key) => stringify(key),
    }
  ),
  studentLoaderById: new DataLoader(
    (ids: readonly ObjectId[]) => batchStudentbyId(ids),
    {
      cacheKeyFn: (key) => key.toHexString(),
    }
  ),
  institutionLoaderById: new DataLoader(
    (ids: readonly ObjectId[]) => batchInstitution(ids),
    {
      cacheKeyFn: (key) => key.toHexString(),
    }
  ),
});
