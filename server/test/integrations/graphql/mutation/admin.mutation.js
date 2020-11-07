require("dotenv").config();
process.env.NODE_ENV = "test";
const { createTestClient } = require("apollo-server-testing");
const jwt = require("jsonwebtoken");
const {
  CREATE_LESSON,
  EDIT_LESSON,
  CREATE_SCHOOLG,
  ADD_LESSON_TO_CLASS,
  ADD_TEACHERFIELDS_TO_LESSON,
  EDIT_TEACHER_FIELD,
  EDIT_DEPARTMENT,
  ADD_DEPARTMENTS_TO_TEACHERFIELD,
  REMOVE_DEPARTMENTS_TO_TEACHERFIELD
} = require("../../adminQueries");
const { expect } = require("chai");
const chai = require("chai");
const chaiAnyEql = require("chai-any-eql");
const mongoose = require("mongoose");
const { server } = require("../../constructTestServer");
const { mutate } = createTestClient(server);
const { model } = require("../../../../models");
chai.use(chaiAnyEql);
let activeUser = {};
async function createActiveUser() {
  const user = new model.User({
    firstName: "name",
    lastName: "lastname",
    email: "mail@email.com",
    password: "12345678",
    institutionName: "Corp",
    phone: "4464564654",
    superAdmin: true
  });
  await user.save();
  const token = user.generateAuthToken();
  activeUser = jwt.verify(token, process.env.SECRET_KEY);
  return activeUser;
}
const lessonToClassPayload = {
  schoolId: mongoose.Types.ObjectId().toHexString(),
  classId: mongoose.Types.ObjectId().toHexString(),
  lessonId: mongoose.Types.ObjectId().toHexString(),
  required: true,
  count: 5
};
describe("createLesson", function() {
  before(async function() {
    this.enableTimeouts(false);
    try {
      await mongoose.connect("mongodb://localhost/k12-school-test", {
        useNewUrlParser: true,
        useCreateIndex: true
      });
    } catch (error) {
      console.log(error);
    }
    await model.User.deleteMany({});
    await model.Lesson.deleteMany({});
    await createActiveUser();
    mongoose.set("useCreateIndex", true);
  });
  afterEach(async function() {
    await model.Lesson.deleteMany({});
  });
  after(async function() {
    await model.User.deleteMany({});
    await model.Lesson.deleteMany({});
    var db = mongoose.connection;
    mongoose.models = {};
    mongoose.modelSchemas = {};
    await db.close();
  });
  it("should return code: UNAUTHENTICATED for UNAUTHENTICATED user", async function() {
    server.context = null;
    const result = await mutate({
      query: CREATE_LESSON,
      variables: { name: "lorem ipsum" }
    });

    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "UNAUTHENTICATED"
    });
  });
  it("should return code: BAD_USER_INPUT for bad lesson name", async function() {
    server.context = { activeUser };
    const result = await mutate({
      query: CREATE_LESSON,
      variables: { name: "l" }
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "BAD_USER_INPUT"
    });
  });
  it("should return code: BAD_USER_INPUT for bad teacherField id", async function() {
    server.context = { activeUser };
    const result = await mutate({
      query: CREATE_LESSON,
      variables: { name: "ldr", teacherFields: ["sdfsd", "sdfsdf44d"] }
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "BAD_USER_INPUT"
    });
  });
  it("should return lesson for valid lesson", async function() {
    server.context = { activeUser };
    const payload = { name: "ldr" };
    const result = await mutate({
      query: CREATE_LESSON,
      variables: payload
    });
    expect(result.data).not.to.be.undefined;
    expect(result.data).to.anyEql({
      createLessonG: { ...payload, teacherFields: [], _id: chai.ANY }
    });
  });
  it("should return lesson for valid lesson", async function() {
    server.context = { activeUser };
    const payload = { name: "ldr" };
    const result = await mutate({
      query: CREATE_LESSON,
      variables: payload
    });
    expect(result.data).not.to.be.undefined;
    expect(result.data).to.anyEql({
      createLessonG: { ...payload, teacherFields: [], _id: chai.ANY }
    });
  });
});
describe("editLesson", function() {
  before(async function() {
    this.enableTimeouts(false);
    try {
      await mongoose.connect("mongodb://localhost/k12-school-test", {
        useNewUrlParser: true,
        useCreateIndex: true
      });
    } catch (error) {
      console.log(error);
    }
    await model.User.deleteMany({});
    await createActiveUser();
    mongoose.set("useCreateIndex", true);
  });
  afterEach(async function() {
    await model.Lesson.deleteMany({});
  });
  after(async function() {
    await model.User.deleteMany({});
    await model.Lesson.deleteMany({});
    var db = mongoose.connection;
    mongoose.models = {};
    mongoose.modelSchemas = {};
    await db.close();
  });
  it("should return code: UNAUTHENTICATED for UNAUTHENTICATED user", async function() {
    server.context = null;
    const result = await mutate({
      query: EDIT_LESSON,
      variables: {
        name: "lorem ipsum",
        _id: new mongoose.Types.ObjectId().toHexString()
      }
    });

    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "UNAUTHENTICATED"
    });
  });
  it("should return code: BAD_USER_INPUT for bad lesson name", async function() {
    server.context = { activeUser };
    const result = await mutate({
      query: EDIT_LESSON,
      variables: { name: "l", _id: new mongoose.Types.ObjectId().toHexString() }
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "BAD_USER_INPUT"
    });
  });
  it("should return code: BAD_USER_INPUT for bad _id", async function() {
    server.context = { activeUser };
    const result = await mutate({
      query: EDIT_LESSON,
      variables: { name: "l", _id: "54asd54as4d5" }
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "BAD_USER_INPUT"
    });
  });
  it("should return code: BAD_USER_INPUT for bad teacherField id", async function() {
    server.context = { activeUser };
    const result = await mutate({
      query: EDIT_LESSON,
      variables: {
        name: "ldr",
        teacherFields: ["sdfsd", "sdfsdf44d"],
        _id: new mongoose.Types.ObjectId().toHexString()
      }
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "BAD_USER_INPUT"
    });
  });
  it("should return lesson for valid lesson", async function() {
    server.context = { activeUser };
    const payload = { name: "ldr" };
    const lesson = await mutate({
      query: CREATE_LESSON,
      variables: payload
    });
    const variables = { ...lesson.data.createLessonG, name: "7f8df5" };
    const result = await mutate({
      query: EDIT_LESSON,
      variables: variables
    });
    expect(result.data).not.to.be.undefined;
    expect(result.data).to.eql({
      editLessonG: variables
    });
  });
});
describe("createSchoolG", function() {
  before(async function() {
    this.enableTimeouts(false);
    try {
      await mongoose.connect("mongodb://localhost/k12-school-test", {
        useNewUrlParser: true,
        useCreateIndex: true
      });
    } catch (error) {
      console.log(error);
    }
    await model.User.deleteMany({});
    await createActiveUser();
    mongoose.set("useCreateIndex", true);
  });
  afterEach(async function() {
    await model.School.deleteMany({});
  });
  after(async function() {
    await model.User.deleteMany({});
    await model.School.deleteMany({});
    var db = mongoose.connection;
    mongoose.models = {};
    mongoose.modelSchemas = {};
    await db.close();
  });
  it("should return code: UNAUTHENTICATED for UNAUTHENTICATED user", async function() {
    server.context = null;
    const result = await mutate({
      query: CREATE_SCHOOLG,
      variables: {
        name: "lorem ipsum",
        classes: [{ level: 1 }, { level: 2 }, { level: 3 }, { level: 4 }]
      }
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "UNAUTHENTICATED"
    });
  });
  it("should return code: BAD_USER_INPUT for bad school name", async function() {
    server.context = { activeUser };
    const result = await mutate({
      query: CREATE_SCHOOLG,
      variables: {
        name: "l",
        classes: [{ level: 1 }, { level: 2 }, { level: 3 }, { level: 4 }]
      }
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "BAD_USER_INPUT"
    });
  });
  it("should return code: BAD_USER_INPUT for bad school name", async function() {
    server.context = { activeUser };
    const result = await mutate({
      query: CREATE_SCHOOLG,
      variables: {
        name: "lore cdf",
        classes: [{ level: 1 }, { level: 1 }, { level: 3 }, { level: 4 }]
      }
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "BAD_USER_INPUT"
    });
  });
  it("should return school for valid school", async function() {
    server.context = { activeUser };
    const paylaod = {
      name: "lorem ipsum",
      classes: [{ level: 1 }, { level: 2 }, { level: 3 }, { level: 4 }]
    };
    const rePayload = {
      name: paylaod.name,
      classes: paylaod.classes.map(c => {
        return { _id: chai.ANY, lessons: [], ...c };
      })
    };
    const result = await mutate({
      query: CREATE_SCHOOLG,
      variables: paylaod
    });
    expect(result.data).not.to.be.undefined;
    expect(result.data).to.anyEql({
      createSchoolG: { ...rePayload, _id: chai.ANY }
    });
  });
});
describe("addLessonToClass", function() {
  before(async function() {
    this.enableTimeouts(false);
    try {
      await mongoose.connect("mongodb://localhost/k12-school-test", {
        useNewUrlParser: true,
        useCreateIndex: true
      });
    } catch (error) {
      console.log(error);
    }
    await model.User.deleteMany({});
    await createActiveUser();
    mongoose.set("useCreateIndex", true);
  });
  afterEach(async function() {
    await model.School.deleteMany({});
  });
  after(async function() {
    await model.User.deleteMany({});
    await model.School.deleteMany({});
    var db = mongoose.connection;
    mongoose.models = {};
    mongoose.modelSchemas = {};
    await db.close();
  });
  it("should return code: UNAUTHENTICATED for UNAUTHENTICATED user", async function() {
    server.context = null;
    const result = await mutate({
      query: ADD_LESSON_TO_CLASS,
      variables: lessonToClassPayload
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "UNAUTHENTICATED"
    });
  });
  it("should return code: BAD_USER_INPUT for bad id", async function() {
    server.context = { activeUser };
    const result = await mutate({
      query: ADD_LESSON_TO_CLASS,
      variables: { ...lessonToClassPayload, schoolId: "5" }
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "BAD_USER_INPUT"
    });
  });
  it("should return school for valid school", async function() {
    server.context = { activeUser };
    const school = await mutate({
      query: CREATE_SCHOOLG,
      variables: { name: "school", classes: [{ level: 1 }] }
    });
    const result = await mutate({
      query: ADD_LESSON_TO_CLASS,
      variables: {
        ...lessonToClassPayload,
        schoolId: school.data.createSchoolG._id,
        classId: school.data.createSchoolG.classes[0]._id
      }
    });
    // eslint-disable-next-line no-unused-vars
    const { schoolId, classId, ...rest } = lessonToClassPayload;
    expect(result.data).not.to.be.undefined;
    expect(result.data).to.anyEql({
      addLessonToClass: {
        _id: school.data.createSchoolG.classes[0]._id,
        level: 1,
        lessons: [{ ...rest, _id: chai.ANY }]
      }
    });
  });
});
describe("addTeacherFieldsToLesson", function() {
  before(async function() {
    this.enableTimeouts(false);
    try {
      await mongoose.connect("mongodb://localhost/k12-school-test", {
        useNewUrlParser: true,
        useCreateIndex: true
      });
    } catch (error) {
      console.log(error);
    }
    await model.User.deleteMany({});
    await createActiveUser();
    mongoose.set("useCreateIndex", true);
  });
  afterEach(async function() {
    await model.Lesson.deleteMany({});
  });
  after(async function() {
    await model.User.deleteMany({});
    await model.Lesson.deleteMany({});
    var db = mongoose.connection;
    mongoose.models = {};
    mongoose.modelSchemas = {};
    await db.close();
  });
  it("should return code: UNAUTHENTICATED for UNAUTHENTICATED user", async function() {
    server.context = null;
    const result = await mutate({
      query: ADD_TEACHERFIELDS_TO_LESSON,
      variables: {
        _id: new mongoose.Types.ObjectId().toHexString(),
        ids: [
          new mongoose.Types.ObjectId().toHexString(),
          new mongoose.Types.ObjectId().toHexString()
        ]
      }
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "UNAUTHENTICATED"
    });
  });
  it("should return code: BAD_USER_INPUT for bad id", async function() {
    server.context = { activeUser };
    const result = await mutate({
      query: ADD_TEACHERFIELDS_TO_LESSON,
      variables: {
        _id: new mongoose.Types.ObjectId().toHexString(),
        ids: ["445", "asdsa"]
      }
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "BAD_USER_INPUT"
    });
  });
  it("should return code: BAD_USER_INPUT for bad _id", async function() {
    server.context = { activeUser };
    const result = await mutate({
      query: ADD_TEACHERFIELDS_TO_LESSON,
      variables: {
        _id: "54asd54as4d5",
        ids: [
          new mongoose.Types.ObjectId().toHexString(),
          new mongoose.Types.ObjectId().toHexString()
        ]
      }
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "BAD_USER_INPUT"
    });
  });
  it("should return lesson for valid lesson", async function() {
    server.context = { activeUser };
    const lesson = await mutate({
      query: CREATE_LESSON,
      variables: { name: "ldr" }
    });
    const variables = {
      _id: lesson.data.createLessonG._id,
      ids: [
        new mongoose.Types.ObjectId().toHexString(),
        new mongoose.Types.ObjectId().toHexString()
      ]
    };
    const result = await mutate({
      query: ADD_TEACHERFIELDS_TO_LESSON,
      variables: variables
    });
    expect(result.data).not.to.be.undefined;
    expect(result.data).to.eql({
      addTeacherFieldsToLesson: {
        teacherFields: [],
        _id: variables._id,
        name: lesson.data.createLessonG.name
      }
    });
  });
});
describe("editTeacherField", function() {
  before(async function() {
    this.enableTimeouts(false);
    try {
      await mongoose.connect("mongodb://localhost/k12-school-test", {
        useNewUrlParser: true,
        useCreateIndex: true
      });
    } catch (error) {
      console.log(error);
    }
    await model.User.deleteMany({});
    await createActiveUser();
    mongoose.set("useCreateIndex", true);
  });
  afterEach(async function() {
    await model.TeacherField.deleteMany({});
  });
  after(async function() {
    await model.User.deleteMany({});
    await model.TeacherField.deleteMany({});
    var db = mongoose.connection;
    mongoose.models = {};
    mongoose.modelSchemas = {};
    await db.close();
  });
  it("should return code: UNAUTHENTICATED for UNAUTHENTICATED user", async function() {
    server.context = null;
    const result = await mutate({
      query: EDIT_TEACHER_FIELD,
      variables: {
        name: "lorem ipsum"
      }
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "UNAUTHENTICATED"
    });
  });
  it("should return code: BAD_USER_INPUT for bad name", async function() {
    server.context = { activeUser };
    const result = await mutate({
      query: EDIT_TEACHER_FIELD,
      variables: {
        name: "lo"
      }
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "BAD_USER_INPUT"
    });
  });
  it("should return lesson for valid lesson", async function() {
    server.context = { activeUser };
    const variables = {
      name: "lorem ipsum"
    };
    const result = await mutate({
      query: EDIT_TEACHER_FIELD,
      variables: variables
    });
    expect(result.data).not.to.be.undefined;
    expect(result.data).to.anyEql({
      editTeacherField: { ...variables, _id: chai.ANY }
    });
  });
});
describe("editDepartment", function() {
  before(async function() {
    this.enableTimeouts(false);
    try {
      await mongoose.connect("mongodb://localhost/k12-school-test", {
        useNewUrlParser: true,
        useCreateIndex: true
      });
    } catch (error) {
      console.log(error);
    }
    await model.User.deleteMany({});
    await createActiveUser();
    mongoose.set("useCreateIndex", true);
  });
  afterEach(async function() {
    await model.Department.deleteMany({});
  });
  after(async function() {
    await model.User.deleteMany({});
    await model.Department.deleteMany({});
    var db = mongoose.connection;
    mongoose.models = {};
    mongoose.modelSchemas = {};
    await db.close();
  });
  it("should return code: UNAUTHENTICATED for UNAUTHENTICATED user", async function() {
    server.context = null;
    const result = await mutate({
      query: EDIT_DEPARTMENT,
      variables: {
        name: "lorem ipsum"
      }
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "UNAUTHENTICATED"
    });
  });
  it("should return code: BAD_USER_INPUT for bad name", async function() {
    server.context = { activeUser };
    const result = await mutate({
      query: EDIT_DEPARTMENT,
      variables: {
        name: "lo"
      }
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "BAD_USER_INPUT"
    });
  });
  it("should return lesson for valid lesson", async function() {
    server.context = { activeUser };
    const variables = {
      name: "lorem ipsum"
    };
    const result = await mutate({
      query: EDIT_DEPARTMENT,
      variables: variables
    });
    expect(result.data).not.to.be.undefined;
    expect(result.data).to.anyEql({
      editDepartment: { ...variables, _id: chai.ANY }
    });
  });
});
describe("addDepartmentsToTeacherField", function() {
  before(async function() {
    this.enableTimeouts(false);
    try {
      await mongoose.connect("mongodb://localhost/k12-school-test", {
        useNewUrlParser: true,
        useCreateIndex: true
      });
    } catch (error) {
      console.log(error);
    }
    await model.User.deleteMany({});
    await createActiveUser();
    mongoose.set("useCreateIndex", true);
  });
  afterEach(async function() {
    await model.TeacherField.deleteMany({});
  });
  after(async function() {
    await model.User.deleteMany({});
    await model.TeacherField.deleteMany({});
    var db = mongoose.connection;
    mongoose.models = {};
    mongoose.modelSchemas = {};
    await db.close();
  });
  it("should return code: UNAUTHENTICATED for UNAUTHENTICATED user", async function() {
    server.context = null;
    const result = await mutate({
      query: ADD_DEPARTMENTS_TO_TEACHERFIELD,
      variables: {
        _id: new mongoose.Types.ObjectId().toHexString(),
        ids: [
          new mongoose.Types.ObjectId().toHexString(),
          new mongoose.Types.ObjectId().toHexString()
        ]
      }
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "UNAUTHENTICATED"
    });
  });
  it("should return code: BAD_USER_INPUT for bad id", async function() {
    server.context = { activeUser };
    const result = await mutate({
      query: ADD_DEPARTMENTS_TO_TEACHERFIELD,
      variables: {
        _id: new mongoose.Types.ObjectId().toHexString(),
        ids: ["445", "asdsa"]
      }
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "BAD_USER_INPUT"
    });
  });
  it("should return code: BAD_USER_INPUT for bad _id", async function() {
    server.context = { activeUser };
    const result = await mutate({
      query: ADD_DEPARTMENTS_TO_TEACHERFIELD,
      variables: {
        _id: "54asd54as4d5",
        ids: [
          new mongoose.Types.ObjectId().toHexString(),
          new mongoose.Types.ObjectId().toHexString()
        ]
      }
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "BAD_USER_INPUT"
    });
  });
  it("should return teacherField for valid teacherField", async function() {
    server.context = { activeUser };
    const teacherField = await mutate({
      query: EDIT_TEACHER_FIELD,
      variables: { name: "ldr" }
    });
    const variables = {
      _id: teacherField.data.editTeacherField._id,
      ids: [
        new mongoose.Types.ObjectId().toHexString(),
        new mongoose.Types.ObjectId().toHexString()
      ]
    };
    const result = await mutate({
      query: ADD_DEPARTMENTS_TO_TEACHERFIELD,
      variables: variables
    });
    expect(result.data).not.to.be.undefined;
    expect(result.data).to.eql({
      addDepartmentsToTeacherField: {
        departments: [],
        _id: variables._id,
        name: teacherField.data.editTeacherField.name
      }
    });
  });
});
describe("removeDepartmentsToTeacherField", function() {
  before(async function() {
    this.enableTimeouts(false);
    try {
      await mongoose.connect("mongodb://localhost/k12-school-test", {
        useNewUrlParser: true,
        useCreateIndex: true
      });
    } catch (error) {
      console.log(error);
    }
    await model.User.deleteMany({});
    await createActiveUser();
    mongoose.set("useCreateIndex", true);
  });
  afterEach(async function() {
    await model.TeacherField.deleteMany({});
  });
  after(async function() {
    await model.User.deleteMany({});
    await model.TeacherField.deleteMany({});
    var db = mongoose.connection;
    mongoose.models = {};
    mongoose.modelSchemas = {};
    await db.close();
  });
  it("should return code: UNAUTHENTICATED for UNAUTHENTICATED user", async function() {
    server.context = null;
    const result = await mutate({
      query: REMOVE_DEPARTMENTS_TO_TEACHERFIELD,
      variables: {
        _id: new mongoose.Types.ObjectId().toHexString(),
        id: new mongoose.Types.ObjectId().toHexString()
      }
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "UNAUTHENTICATED"
    });
  });
  it("should return code: BAD_USER_INPUT for bad id", async function() {
    server.context = { activeUser };
    const result = await mutate({
      query: REMOVE_DEPARTMENTS_TO_TEACHERFIELD,
      variables: {
        _id: new mongoose.Types.ObjectId().toHexString(),
        id: "445"
      }
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "BAD_USER_INPUT"
    });
  });
  it("should return code: BAD_USER_INPUT for bad _id", async function() {
    server.context = { activeUser };
    const result = await mutate({
      query: REMOVE_DEPARTMENTS_TO_TEACHERFIELD,
      variables: {
        _id: "54asd54as4d5",
        id: new mongoose.Types.ObjectId().toHexString()
      }
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "BAD_USER_INPUT"
    });
  });
  it("should return teacherField for valid teacherField", async function() {
    server.context = { activeUser };
    const teacherField = await mutate({
      query: EDIT_TEACHER_FIELD,
      variables: { name: "ldr" }
    });
    const departmentId = new mongoose.Types.ObjectId().toHexString();
    await mutate({
      query: ADD_DEPARTMENTS_TO_TEACHERFIELD,
      variables: {
        _id: teacherField.data.editTeacherField._id,
        ids: [departmentId]
      }
    });
    const variables = {
      _id: teacherField.data.editTeacherField._id,
      id: departmentId
    };
    const result = await mutate({
      query: REMOVE_DEPARTMENTS_TO_TEACHERFIELD,
      variables: variables
    });
    expect(result.data).not.to.be.undefined;
    expect(result.data).to.eql({
      removeDepartmentsToTeacherField: {
        departments: [],
        _id: variables._id,
        name: teacherField.data.editTeacherField.name
      }
    });
  });
});
