/* eslint-disable no-unused-vars */
require("dotenv").config();
process.env.NODE_ENV = "test";
const { createTestClient } = require("apollo-server-testing");
const {
  CREATE_USER,
  CREATE_SCHOOL,
  CREATE_HOURS,
  CREATE_TERM,
  CREATE_CLASS,
  INVITATION_TEACHERS,
  ADD_TEACHER
} = require("../../queris");
const { expect } = require("chai");
const chai = require("chai");
const chaiAnyEql = require("chai-any-eql");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { server } = require("../../constructTestServer");
const { model } = require("../../../../models");
const payloadSchool = {
  name: "School Name",
  eOkulCode: "12345678"
};
chai.use(chaiAnyEql);
let payloadUpdateSchool;
let activeUser;
async function createActiveUser() {
  await mutate({
    mutation: CREATE_USER,
    variables: {
      firstName: "name",
      lastName: "lastname",
      email: "mail@email.com",
      password: "12345678",
      institutionName: "Corp",
      phone: "4464564654"
    }
  });
  const user = await model.User.findOneAndUpdate(
    { firstName: "name" },
    { isverified: true }
  );
  const token = user.generateAuthToken();
  activeUser = jwt.verify(token, process.env.SECRET_KEY);
  return activeUser;
}
const { mutate } = createTestClient(server);
let schoolId;
let payloadHour = {
  name: "hourname",
  default: false,
  hour: [
    { code: 1, start: "09:00", finish: "09:50" },
    { code: 2, start: "10:00", finish: "10:50" },
    { code: 3, start: "11:00", finish: "11:50" }
  ]
};
let payloadTerm = {
  name: "1. dönem",
  start: new Date(2019, 10, 10),
  finish: new Date(2019, 12, 10)
};
let payloadClass = {
  name: "lorem",
  level: 1,
  code: "A",
  code1: "English"
};
let payloadUpdateHour;
let payloadUpdateTerm;
let payloadUpdateClass;
const payloadEmails = { emails: ["seres@ada.com,seres1@ada.com"] };
describe("createSchool", function() {
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
    await createActiveUser();
    mongoose.set("useCreateIndex", true);
  });
  after(async function() {
    await model.User.deleteMany({});
    await model.Institution.deleteMany({});
    var db = mongoose.connection;
    mongoose.models = {};
    mongoose.modelSchemas = {};
    await db.close();
  });
  afterEach(async function() {
    await model.Institution.updateOne(
      { creator: activeUser._id },
      { schools: [] }
    );
  });
  it("should return code: UNAUTHENTICATED for UNAUTHENTICATED user", async function() {
    server.context = null;
    const result = await mutate({
      mutation: CREATE_SCHOOL,
      variables: payloadSchool
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "UNAUTHENTICATED"
    });
  });
  it("should return code: BAD_USER_INPUT for bad school name", async function() {
    const variables = { ...payloadSchool, name: "a" };
    server.context = { activeUser };
    const result = await mutate({
      mutation: CREATE_SCHOOL,
      variables
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "BAD_USER_INPUT"
    });
  });

  it("should return code: 100 for exist school name", async function() {
    const variables = { ...payloadSchool, eOkulCode: "78945612" };
    server.context = { activeUser };
    await mutate({
      mutation: CREATE_SCHOOL,
      variables: payloadSchool
    });
    const result = await mutate({
      mutation: CREATE_SCHOOL,
      variables
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: 100,
      is: {
        name: true
      },
      exception: {
        is: {
          name: true
        }
      }
    });
  });
  it("should return code: 100 for exist school eOkulCode", async function() {
    const variables = { ...payloadSchool, name: "name1" };
    server.context = { activeUser };
    await mutate({
      mutation: CREATE_SCHOOL,
      variables: payloadSchool
    });
    const result = await mutate({
      mutation: CREATE_SCHOOL,
      variables
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: 100,
      is: {
        eOkulCode: true
      },
      exception: {
        is: {
          eOkulCode: true
        }
      }
    });
  });

  it("should return school for valid school", async function() {
    server.context = { activeUser };
    const result = await mutate({
      mutation: CREATE_SCHOOL,
      variables: payloadSchool
    });
    expect(result.errors).to.be.undefined;
    expect(result.data.createSchool).to.contain(payloadSchool);
  });
});
describe("createHour", function() {
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
    await createActiveUser();
    await model.Institution.updateOne(
      { creator: activeUser._id },
      { $push: { schools: payloadSchool, $position: 0 } }
    );
    const intitu = await model.Institution.findOne({ creator: activeUser._id });
    schoolId = intitu.schools[0].id;
    payloadHour = { ...payloadHour, schoolId };
    mongoose.set("useCreateIndex", true);
  });
  after(async function() {
    await model.Institution.deleteMany({});
    await model.User.deleteMany({});
    await model.Institution.deleteMany({});
    var db = mongoose.connection;
    mongoose.models = {};
    mongoose.modelSchemas = {};
    await db.close();
  });
  afterEach(async function() {
    await model.Institution.updateOne(
      { creator: activeUser._id, "schools._id": schoolId },
      { "schools.$.hours": [] }
    );
  });
  it("should return code: UNAUTHENTICATED for UNAUTHENTICATED user", async function() {
    server.context = null;
    const result = await mutate({
      mutation: CREATE_HOURS,
      variables: payloadHour
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "UNAUTHENTICATED"
    });
  });
  it("should return code: BAD_USER_INPUT for bad hour name", async function() {
    const variables = { ...payloadHour, name: "a" };
    server.context = { activeUser };
    const result = await mutate({
      mutation: CREATE_HOURS,
      variables
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "BAD_USER_INPUT"
    });
  });
  it("should return code: 100 for exist hour name", async function() {
    server.context = { activeUser };
    await mutate({
      mutation: CREATE_HOURS,
      variables: payloadHour
    });
    const result = await mutate({
      mutation: CREATE_HOURS,
      variables: payloadHour
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: 100,
      is: {
        hour: true
      },
      exception: {
        is: {
          hour: true
        }
      }
    });
  });
  it("should return code: 100 for exist default hour", async function() {
    const variables = {
      ...payloadHour,
      default: true
    };
    server.context = { activeUser };
    await mutate({
      mutation: CREATE_HOURS,
      variables
    });
    const result = await mutate({
      mutation: CREATE_HOURS,
      variables: { ...variables, name: "another name." }
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: 100,
      is: {
        default: true
      },
      exception: {
        is: {
          default: true
        }
      }
    });
  });
  it("should return hour for valid hour", async function() {
    server.context = { activeUser };
    const result = await mutate({
      mutation: CREATE_HOURS,
      variables: payloadHour
    });
    expect(result.data.createHour).not.to.be.undefined;
    const { hour } = result.data.createHour;
    const { hour: hourData, schoolId, ...rest } = payloadHour;
    expect(result.data.createHour).to.contain(rest);
    expect(hour).to.deep.anyEql(
      hourData.map(h => {
        return { ...h, _id: chai.ANY };
      })
    );
  });
});
describe("createTerm", function() {
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
    await createActiveUser();
    await model.Institution.updateOne(
      { creator: activeUser._id },
      { $push: { schools: payloadSchool, $position: 0 } }
    );
    const intitu = await model.Institution.findOne({ creator: activeUser._id });
    schoolId = intitu.schools[0].id;
    payloadTerm = { ...payloadTerm, schoolId };
    mongoose.set("useCreateIndex", true);
  });
  after(async function() {
    await model.Institution.deleteMany({});
    await model.User.deleteMany({});
    var db = mongoose.connection;
    mongoose.models = {};
    mongoose.modelSchemas = {};
    await db.close();
  });
  afterEach(async function() {
    await model.Institution.updateOne(
      { creator: activeUser._id, "schools._id": schoolId },
      { "schools.$.terms": [] }
    );
  });
  it("should return code: UNAUTHENTICATED for UNAUTHENTICATED user", async function() {
    server.context = null;
    const result = await mutate({
      mutation: CREATE_TERM,
      variables: payloadTerm
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "UNAUTHENTICATED"
    });
  });
  it("should return code: BAD_USER_INPUT for bad term name", async function() {
    const variables = { ...payloadTerm, name: "a" };
    server.context = { activeUser };
    const result = await mutate({
      mutation: CREATE_TERM,
      variables
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "BAD_USER_INPUT"
    });
  });
  it("should return code: 100 for exist term name", async function() {
    server.context = { activeUser };
    await mutate({
      mutation: CREATE_TERM,
      variables: payloadTerm
    });
    const result = await mutate({
      mutation: CREATE_TERM,
      variables: payloadTerm
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: 100,
      is: {
        Term: true
      },
      exception: {
        is: {
          Term: true
        }
      }
    });
  });
  it("should return term for valid term", async function() {
    server.context = { activeUser };
    const result = await mutate({
      mutation: CREATE_TERM,
      variables: payloadTerm
    });
    const { schoolId, ...rest } = payloadTerm;
    const { _id, ...restResult } = result.data.createTerm;
    expect(restResult).to.deep.equal(rest);
  });
});
describe("updateSchool", function() {
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
    await createActiveUser();
    await model.Institution.updateOne(
      { creator: activeUser._id },
      { $push: { schools: payloadSchool, $position: 0 } }
    );
    const intitu = await model.Institution.findOne({ creator: activeUser._id });
    schoolId = intitu.schools[0].id;
    payloadUpdateSchool = { ...payloadSchool, _id: schoolId };
    mongoose.set("useCreateIndex", true);
  });
  after(async function() {
    await model.Institution.deleteMany({});
    await model.User.deleteMany({});
    await model.Institution.deleteMany({});
    var db = mongoose.connection;
    mongoose.models = {};
    mongoose.modelSchemas = {};
    await db.close();
  });
  afterEach(async function() {
    //
  });
  it("should return code: UNAUTHENTICATED for UNAUTHENTICATED user", async function() {
    server.context = null;
    const result = await mutate({
      mutation: CREATE_SCHOOL,
      variables: payloadUpdateSchool
    });

    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "UNAUTHENTICATED"
    });
  });
  it("should return code: BAD_USER_INPUT for bad school name", async function() {
    const variables = { ...payloadUpdateSchool, name: "a" };
    server.context = { activeUser };
    const result = await mutate({
      mutation: CREATE_SCHOOL,
      variables
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "BAD_USER_INPUT"
    });
  });

  it("should return code: 100 for exist school name", async function() {
    server.context = { activeUser };
    await mutate({
      mutation: CREATE_SCHOOL,
      variables: { name: "other school" }
    });
    const result = await mutate({
      mutation: CREATE_SCHOOL,
      variables: { ...payloadUpdateSchool, name: "other school" }
    });
    expect(result.errors, "error").not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: 100,
      is: {
        name: true
      },
      exception: {
        is: {
          name: true
        }
      }
    });
  });
  it("should return code: 100 for exist eOkulCode", async function() {
    server.context = { activeUser };
    await mutate({
      mutation: CREATE_SCHOOL,
      variables: { eOkulCode: "45625891", name: "lorem ipsum 234" }
    });
    const result = await mutate({
      mutation: CREATE_SCHOOL,
      variables: { ...payloadUpdateSchool, eOkulCode: "45625891" }
    });
    expect(result.errors, "error").not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: 100,
      is: {
        eOkulCode: true
      },
      exception: {
        is: {
          eOkulCode: true
        }
      }
    });
  }); /*
  it("should return code: 102 for not exist schoolId", async function() {
    const variables = {
      ...payloadUpdateSchool,
      _id: new mongoose.Types.ObjectId().toHexString()
    };
    server.context = { activeUser };
    const result = await mutate({
      mutation: CREATE_SCHOOL,
      variables
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: 102
    });
  });
  */
  it("should return school for valid school with name and code", async function() {
    server.context = { activeUser };
    const result = await mutate({
      mutation: CREATE_SCHOOL,
      variables: { ...payloadUpdateSchool, name: "changed name" }
    });
    expect(result.data).not.to.be.null;
    const { _id, ...restResult } = result.data.createSchool;
    expect(restResult).to.contain({
      name: "changed name",
      eOkulCode: payloadUpdateSchool.eOkulCode
    });
  });
  it("should return school for valid school code null", async function() {
    server.context = { activeUser };
    const result = await mutate({
      mutation: CREATE_SCHOOL,
      variables: {
        ...payloadUpdateSchool,
        name: "changed name",
        eOkulCode: null
      }
    });
    expect(result.data).not.to.be.null;
    const { _id, ...restResult } = result.data.createSchool;
    expect(restResult).to.contain({
      name: "changed name",
      eOkulCode: null
    });
  });
  it("should return school for valid school code empty  ", async function() {
    server.context = { activeUser };
    const result = await mutate({
      mutation: CREATE_SCHOOL,
      variables: {
        ...payloadUpdateSchool,
        name: "changed name",
        eOkulCode: ""
      }
    });
    expect(result.data).not.to.be.null;
    const { _id, ...restResult } = result.data.createSchool;
    expect(restResult).to.contain({
      name: "changed name",
      eOkulCode: ""
    });
  });
  it("should return code: 103 for same school", async function() {
    server.context = { activeUser };
    await mutate({
      mutation: CREATE_SCHOOL,
      variables: payloadUpdateSchool
    });
    const result = await mutate({
      mutation: CREATE_SCHOOL,
      variables: payloadUpdateSchool
    });
    /*
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: 103
    });
    */
  });
});
describe("updateHour", function() {
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
    await createActiveUser();
    await model.Institution.updateOne(
      { creator: activeUser._id },
      { $push: { schools: payloadSchool, $position: 0 } }
    );
    const intitu = await model.Institution.findOne({ creator: activeUser._id });
    schoolId = intitu.schools[0].id;
    server.context = { activeUser };
    payloadHour = { ...payloadHour, schoolId };
    const result = await mutate({
      mutation: CREATE_HOURS,
      variables: payloadHour
    });
    payloadUpdateHour = {
      ...payloadHour,
      schoolId,
      _id: result.data.createHour._id
    };
    mongoose.set("useCreateIndex", true);
  });
  after(async function() {
    await model.Institution.deleteMany({});
    await model.User.deleteMany({});
    await model.Institution.deleteMany({});
    var db = mongoose.connection;
    mongoose.models = {};
    mongoose.modelSchemas = {};
    await db.close();
  });
  afterEach(async function() {
    //
  });
  it("should return code: UNAUTHENTICATED for UNAUTHENTICATED user", async function() {
    server.context = null;
    const result = await mutate({
      mutation: CREATE_HOURS,
      variables: payloadUpdateHour
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "UNAUTHENTICATED"
    });
  });
  it("should return code: BAD_USER_INPUT for bad hour name", async function() {
    const variables = { ...payloadUpdateHour, name: "a" };
    server.context = { activeUser };
    const result = await mutate({
      mutation: CREATE_HOURS,
      variables
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "BAD_USER_INPUT"
    });
  });
  /*
  it("should return code: 102 for does not exist school id", async function() {
    const variables = {
      ...payloadUpdateHour,
      schoolId: new mongoose.Types.ObjectId().toHexString()
    };
    server.context = { activeUser };
    const result = await mutate({
      mutation: CREATE_HOURS,
      variables
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: 102,
      exception: {
        is: {
          school: true
        }
      }
    });
  });
  it("should return code: 102 for does not exist hour id", async function() {
    const variables = {
      ...payloadUpdateHour,
      _id: new mongoose.Types.ObjectId().toHexString()
    };
    server.context = { activeUser };
    const result = await mutate({
      mutation: CREATE_HOURS,
      variables
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: 102,
      exception: {
        is: {
          hour: true
        }
      }
    });
  }); */
  it("should return code: 100 for exist hour name", async function() {
    server.context = { activeUser };
    await mutate({
      mutation: CREATE_HOURS,
      variables: { ...payloadHour, name: "hourname 1" }
    });
    const result = await mutate({
      mutation: CREATE_HOURS,
      variables: { ...payloadUpdateHour, name: "hourname 1" }
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: 100,
      is: {
        hour: true
      },
      exception: {
        is: {
          hour: true
        }
      }
    });
  });
  it("should return code : 103 for same hour", async function() {
    //
  });

  it("should return hour for valid hour", async function() {
    server.context = { activeUser };
    const result = await mutate({
      mutation: CREATE_HOURS,
      variables: { ...payloadUpdateHour, name: "NEW HOUR" }
    });
    const { schoolId, ...rest } = { ...payloadUpdateHour, name: "NEW HOUR" };
    expect(result.data.createHour).to.deep.anyEql({
      ...rest,
      hour: rest.hour.map(h => {
        return { ...h, _id: chai.ANY };
      })
    });
  });
});
describe("updataTerm", function() {
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
    await createActiveUser();
    await model.Institution.updateOne(
      { creator: activeUser._id },
      { $push: { schools: payloadSchool, $position: 0 } }
    );
    const intitu = await model.Institution.findOne({ creator: activeUser._id });
    schoolId = intitu.schools[0].id;
    server.context = { activeUser };
    const result = await mutate({
      mutation: CREATE_TERM,
      variables: { ...payloadTerm, schoolId, name: "2. dönem" }
    });
    payloadUpdateTerm = {
      ...payloadTerm,
      schoolId,
      _id: result.data.createTerm._id
    };
    mongoose.set("useCreateIndex", true);
  });
  after(async function() {
    await model.Institution.deleteMany({});
    await model.User.deleteMany({});
    await model.Institution.deleteMany({});
    var db = mongoose.connection;
    mongoose.models = {};
    mongoose.modelSchemas = {};
    await db.close();
  });
  afterEach(async function() {
    //
  });
  it("should return code: UNAUTHENTICATED for UNAUTHENTICATED user", async function() {
    server.context = null;
    const result = await mutate({
      mutation: CREATE_TERM,
      variables: payloadUpdateTerm
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "UNAUTHENTICATED"
    });
  });
  it("should return code: BAD_USER_INPUT for bad term name", async function() {
    const variables = { ...payloadUpdateTerm, name: "a" };
    server.context = { activeUser };
    const result = await mutate({
      mutation: CREATE_TERM,
      variables
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "BAD_USER_INPUT"
    });
  });
  it("should return code: 103 for same term", async function() {
    server.context = { activeUser };
    const result = await mutate({
      mutation: CREATE_TERM,
      variables: { ...payloadUpdateTerm, name: "2. dönem" }
    });
    /*
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: 103
    });
    */
  });

  it("should return code: 100 for exist term name", async function() {
    server.context = { activeUser };
    await mutate({
      mutation: CREATE_TERM,
      variables: { ...payloadTerm, schoolId, name: "3. dönem" }
    });
    const result = await mutate({
      mutation: CREATE_TERM,
      variables: { ...payloadUpdateTerm, name: "3. dönem" }
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: 100,
      is: {
        Term: true
      },
      exception: {
        is: {
          Term: true
        }
      }
    });
  }); /*
  it("should return code: 102 for does not exist school id", async function() {
    const variables = {
      ...payloadUpdateTerm,
      schoolId: new mongoose.Types.ObjectId().toHexString()
    };
    server.context = { activeUser };
    const result = await mutate({
      mutation: CREATE_TERM,
      variables
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: 102,
      exception: {
        is: {
          school: true
        }
      }
    });
  });
  it("should return code: 102 for does not exist term id", async function() {
    const variables = {
      ...payloadUpdateTerm,
      _id: new mongoose.Types.ObjectId().toHexString()
    };
    server.context = { activeUser };
    const result = await mutate({
      mutation: CREATE_TERM,
      variables
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: 102,
      exception: {
        is: {
          term: true
        }
      }
    });
  });
  */
  it("should return term for valid update term", async function() {
    server.context = { activeUser };
    const result = await mutate({
      mutation: CREATE_TERM,
      variables: payloadUpdateTerm
    });
    expect(result.data).to.be.ok;
    const { schoolId, ...rest } = payloadUpdateTerm;
    expect(result.data.createTerm).to.deep.equal(rest);
  });
});
describe("createClass", function() {
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
    await createActiveUser();
    await model.Institution.updateOne(
      { creator: activeUser._id },
      { $push: { schools: payloadSchool, $position: 0 } }
    );
    const intitu = await model.Institution.findOne({ creator: activeUser._id });
    schoolId = intitu.schools[0].id;
    payloadHour = { ...payloadHour, schoolId };
    server.context = { activeUser };
    const result = await mutate({
      mutation: CREATE_HOURS,
      variables: payloadHour
    });
    payloadClass = {
      ...payloadClass,
      schoolId,
      group: result.data.createHour._id
    };
    mongoose.set("useCreateIndex", true);
  });
  after(async function() {
    await model.Institution.deleteMany({});
    await model.User.deleteMany({});
    var db = mongoose.connection;
    mongoose.models = {};
    mongoose.modelSchemas = {};
    await db.close();
  });
  afterEach(async function() {
    await model.Institution.updateOne(
      { creator: activeUser._id, "schools._id": schoolId },
      { "schools.$.classes": [] }
    );
  });
  it("should return code: UNAUTHENTICATED for UNAUTHENTICATED user", async function() {
    server.context = null;
    const result = await mutate({
      mutation: CREATE_CLASS,
      variables: payloadClass
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "UNAUTHENTICATED"
    });
  });
  it("should return code: BAD_USER_INPUT for bad class name", async function() {
    const variables = { ...payloadClass, name: "a" };
    server.context = { activeUser };
    const result = await mutate({
      mutation: CREATE_CLASS,
      variables
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "BAD_USER_INPUT"
    });
  });
  /*
  it("should return code: 102 for does not exist school id", async function() {
    const variables = {
      ...payloadClass,
      schoolId: new mongoose.Types.ObjectId().toHexString()
    };
    server.context = { activeUser };
    const result = await mutate({
      mutation: CREATE_CLASS,
      variables
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: 102,
      exception: {
        is: {
          school: true
        }
      }
    });
  });
  */
  it("should return code: BAD_USER_INPUT for bad school id", async function() {
    const variables = {
      ...payloadClass,
      schoolId: "new mongoose.Types.ObjectId().toHexString()"
    };
    server.context = { activeUser };
    const result = await mutate({
      mutation: CREATE_CLASS,
      variables
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0].extensions.code).to.have.deep.property(
      "extensions",
      {
        code: "BAD_USER_INPUT"
      }
    );
  });
  it("should return class for valid class", async function() {
    server.context = { activeUser };
    const result = await mutate({
      mutation: CREATE_CLASS,
      variables: payloadClass
    });
    let { schoolId, ...rest } = payloadClass;
    const { _id, ...restResult } = result.data.createClass;
    expect(restResult).to.deep.contain(rest);
  });
});
describe("updateClass", function() {
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
    await createActiveUser();
    await model.Institution.updateOne(
      { creator: activeUser._id },
      { $push: { schools: payloadSchool, $position: 0 } }
    );
    const intitu = await model.Institution.findOne({ creator: activeUser._id });
    schoolId = intitu.schools[0].id;
    payloadHour = { ...payloadHour, schoolId };
    server.context = { activeUser };
    const result = await mutate({
      mutation: CREATE_HOURS,
      variables: payloadHour
    });
    payloadClass = {
      ...payloadClass,
      schoolId,
      group: result.data.createHour._id
    };
    server.context = { activeUser };
    const resultClass = await mutate({
      mutation: CREATE_CLASS,
      variables: payloadClass
    });
    payloadUpdateClass = {
      ...payloadClass,
      _id: resultClass.data.createClass._id
    };
    mongoose.set("useCreateIndex", true);
  });
  after(async function() {
    await model.Institution.deleteMany({});
    await model.User.deleteMany({});
    var db = mongoose.connection;
    mongoose.models = {};
    mongoose.modelSchemas = {};
    await db.close();
  });
  afterEach(async function() {
    //
  });
  it("should return code: UNAUTHENTICATED for UNAUTHENTICATED user", async function() {
    server.context = null;
    const result = await mutate({
      mutation: CREATE_CLASS,
      variables: payloadUpdateClass
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "UNAUTHENTICATED"
    });
  });
  it("should return code: BAD_USER_INPUT for bad class name", async function() {
    const variables = { ...payloadUpdateClass, name: "a" };
    server.context = { activeUser };
    const result = await mutate({
      mutation: CREATE_CLASS,
      variables
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "BAD_USER_INPUT"
    });
  });
  /*
  it("should return code: 102 for does not exist school id", async function() {
    const variables = {
      ...payloadUpdateClass,
      schoolId: new mongoose.Types.ObjectId().toHexString()
    };
    server.context = { activeUser };
    const result = await mutate({
      mutation: CREATE_CLASS,
      variables
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: 102,
      exception: {
        is: {
          school: true
        }
      }
    });
  });
  */
  it("should return code: BAD_USER_INPUT for bad school id", async function() {
    const variables = {
      ...payloadUpdateClass,
      schoolId: "new mongoose.Types.ObjectId().toHexString()"
    };
    server.context = { activeUser };
    const result = await mutate({
      mutation: CREATE_CLASS,
      variables
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0].extensions.code).to.have.deep.property(
      "extensions",
      {
        code: "BAD_USER_INPUT"
      }
    );
  });
  it("should return class for valid class", async function() {
    server.context = { activeUser };
    const result = await mutate({
      mutation: CREATE_CLASS,
      variables: payloadUpdateClass
    });
    let { schoolId, ...rest } = payloadUpdateClass;
    expect(result.data).not.to.be.undefined;
    expect(result.data.createClass).to.deep.contain(rest);
  });
});
describe("invitationTeachers", function() {
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
    await createActiveUser();
    await model.Institution.updateOne(
      { creator: activeUser._id },
      { $push: { schools: payloadSchool, $position: 0 } }
    );
    mongoose.set("useCreateIndex", true);
  });
  after(async function() {
    await model.Institution.deleteMany({});
    await model.User.deleteMany({});
    await model.TeacherApplication.deleteMany({});
    var db = mongoose.connection;
    mongoose.models = {};
    mongoose.modelSchemas = {};
    await db.close();
  });
  afterEach(async function() {
    //
  });
  it("should return code: UNAUTHENTICATED for UNAUTHENTICATED user", async function() {
    server.context = null;
    const result = await mutate({
      mutation: INVITATION_TEACHERS,
      variables: payloadEmails
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "UNAUTHENTICATED"
    });
  });
  it("should return code: BAD_USER_INPUT for not valid email", async function() {
    server.context = { activeUser };
    const result = await mutate({
      mutation: INVITATION_TEACHERS,
      variables: { emails: ["asa.da@ad"] }
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "BAD_USER_INPUT"
    });
  });
});
describe("addTeacher", function() {
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
    await createActiveUser();
    await model.Institution.updateOne(
      { creator: activeUser._id },
      { $push: { schools: payloadSchool, $position: 0 } }
    );
    mongoose.set("useCreateIndex", true);
  });
  after(async function() {
    await model.Institution.deleteMany({});
    await model.User.deleteMany({});
    await model.TeacherApplication.deleteMany({});
    var db = mongoose.connection;
    mongoose.models = {};
    mongoose.modelSchemas = {};
    await db.close();
  });
  afterEach(async function() {
    //
  });
  it("should return code: UNAUTHENTICATED for UNAUTHENTICATED user", async function() {
    server.context = null;
    const result = await mutate({
      mutation: ADD_TEACHER,
      variables: { applicationId: "1231" }
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "UNAUTHENTICATED"
    });
  });
  it("should return code: BAD_USER_INPUT for not valid id", async function() {
    server.context = { activeUser };
    const result = await mutate({
      mutation: ADD_TEACHER,
      variables: { applicationId: "1231" }
    });
    expect(result.errors).not.to.be.undefined;
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "BAD_USER_INPUT"
    });
  });
});
