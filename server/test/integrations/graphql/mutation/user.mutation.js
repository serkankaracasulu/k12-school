require("dotenv").config();
process.env.NODE_ENV = "test";
const { createTestClient } = require("apollo-server-testing");
const {
  SIGNIN_USER,
  CREATE_USER,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  CONFIRM_EMAIL,
  RESEND_CONFIRM_EMAIL
} = require("../../queris");
const { expect } = require("chai");
require("chai").should();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { server } = require("../../constructTestServer");
const { model } = require("../../../../models");
const payload = {
  firstName: "SfirstName",
  lastName: "SlastName",
  password: "password123",
  email: "sample@mail.com"
};
const payloadInst = {
  firstName: "SfirstName",
  lastName: "SlastName",
  password: "password123",
  email: "sample@mail.com",
  institutionName: "Corp",
  phone: "4464564654"
};
const payloadResetPassword = {
  token: "sdfsdfs645sd465sdf654sdfmnksd654",
  _id: mongoose.Types.ObjectId().toHexString()
};
const { mutate } = createTestClient(server);

describe("createUser", function() {
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
    mongoose.set("useCreateIndex", true);
  });
  after(async function() {
    var db = mongoose.connection;
    mongoose.models = {};
    mongoose.modelSchemas = {};
    await db.close();
  });
  afterEach(async function() {
    await model.Institution.deleteMany({});
    await model.User.deleteMany({});
    await model.Token.deleteMany({});
  });
  it("createUser should return BAD_USER_INPUT for bad email", async function() {
    const variables = { ...payload, email: "asda" };
    const result = await mutate({
      mutation: CREATE_USER,
      variables
    });
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "BAD_USER_INPUT"
    });
  });
  it("createUser should return code: 100 for exist email", async function() {
    const user = new model.User(payload);
    await user.save();

    const result = await mutate({
      mutation: CREATE_USER,
      variables: payload
    });
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: 100,
      isUser: true,
      exception: { isUser: true }
    });
  });

  it("createUser should return BAD_USER_INPUT for bad institutionName", async function() {
    const variables = { ...payloadInst, institutionName: "2" };
    const result = await mutate({
      mutation: CREATE_USER,
      variables
    });
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "BAD_USER_INPUT"
    });
  });
  it("createUser should return code: 100 for exist institutionName", async function() {
    await mutate({
      mutation: CREATE_USER,
      variables: payloadInst
    });
    const result = await mutate({
      mutation: CREATE_USER,
      variables: { ...payloadInst, email: "sample7g33@mail.co" }
    });
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: 100,
      isInstitution: true,
      exception: { isInstitution: true }
    });
  });
  it("createUser should return user for institution", async function() {
    const { password, institutionName, phone, ...rest } = payloadInst;
    const result = await mutate({
      mutation: CREATE_USER,
      variables: payloadInst
    });
    expect(result.data.createUser).to.contain(rest);
  });
  it("createUser should return user ", async function() {
    const { password, ...user } = payload;
    const result = await mutate({
      mutation: CREATE_USER,
      variables: payload
    });
    expect(result.data.createUser).to.contain(user);
  });
});

describe("signIn", function() {
  before(async function() {
    this.enableTimeouts(false);
    await mongoose.connect("mongodb://localhost/k12-school-test", {
      useNewUrlParser: true,
      useCreateIndex: true
    });
    mongoose.set("useCreateIndex", true);
  });
  after(async function() {
    var db = mongoose.connection;
    mongoose.models = {};
    mongoose.modelSchemas = {};
    await db.close();
  });
  afterEach(async function() {
    await model.Institution.deleteMany({});
    await model.User.deleteMany({});
    await model.Token.deleteMany({});
  });

  it("should return BAD_USER_INPUT for bad mail", async function() {
    const result = await mutate({
      mutation: SIGNIN_USER,
      variables: { email: "asdsa", password: "445465ad54a4" }
    });
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "BAD_USER_INPUT"
    });
  });
  it("should return BAD_USER_INPUT for bad password", async function() {
    const result = await mutate({
      mutation: SIGNIN_USER,
      variables: { email: payload.email, password: "1" }
    });
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "BAD_USER_INPUT"
    });
  });
  it("should return code 102 for wrong password", async function() {
    const user = new model.User(payload);
    await user.save();
    const result = await mutate({
      mutation: SIGNIN_USER,
      variables: { email: payload.email, password: "65+as56ads654asd4f38jf" }
    });
    expect(result.errors[0]).to.have.deep.property("extensions", { code: 102 });
  });
  it("should return code: 103 for not confirm email", async function() {
    const user = new model.User(payload);
    await user.save();
    const result = await mutate({
      mutation: SIGNIN_USER,
      variables: { email: payload.email, password: payload.password }
    });
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: 103
    });
  });
  it("should return token", async function() {
    const user = new model.User(payload);
    user.isVerified = true;
    await user.save();
    const result = await mutate({
      mutation: SIGNIN_USER,
      variables: { email: payload.email, password: payload.password }
    });
    expect(result.data.signIn).to.have.key("token");
  });
});

describe("forgotPassword", function() {
  before(async function() {
    this.enableTimeouts(false);
    await mongoose.connect("mongodb://localhost/k12-school-test", {
      useNewUrlParser: true,
      useCreateIndex: true
    });
    mongoose.set("useCreateIndex", true);
  });
  after(async function() {
    var db = mongoose.connection;
    await db.close();
    mongoose.models = {};
    mongoose.modelSchemas = {};
  });
  afterEach(async function() {
    await model.Institution.deleteMany({});
    await model.User.deleteMany({});
    await model.Token.deleteMany({});
  });
  it("should return email validate error", async function() {
    const result = await mutate({
      mutation: FORGOT_PASSWORD,
      variables: { email: "sfsdf@e" }
    });
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "BAD_USER_INPUT"
    });
  });
  it("should return code 102 for unregistered email", async function() {
    const result = await mutate({
      mutation: FORGOT_PASSWORD,
      variables: { email: "fakeemail@fmail.com" }
    });
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: 102
    });
  });
  it("should return true for valid", async function() {
    await new model.User(payload).save();
    const result = await mutate({
      mutation: FORGOT_PASSWORD,
      variables: { email: payload.email }
    });
    expect(result.data.forgotPassword).to.deep.include({ success: true });
  });
});

describe("resetPassword", function() {
  before(async function() {
    this.enableTimeouts(false);
    await mongoose.connect("mongodb://localhost/k12-school-test", {
      useNewUrlParser: true,
      useCreateIndex: true
    });
    mongoose.set("useCreateIndex", true);
  });

  after(async function() {
    var db = mongoose.connection;
    mongoose.models = {};
    mongoose.modelSchemas = {};
    await db.close();
  });

  afterEach(async function() {
    await model.Institution.deleteMany({});
    await model.User.deleteMany({});
    await model.Token.deleteMany({});
  });
  it("should return code : 102 for not exist user id", async function() {
    const result = await mutate({
      mutation: RESET_PASSWORD,
      variables: payloadResetPassword
    });
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: 102
    });
  });

  it("should return code 102 for bed id", async function() {
    const result = await mutate({
      mutation: RESET_PASSWORD,
      variables: payloadResetPassword
    });
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: 102
    });
  });

  it("should return code 104 for bed token", async function() {
    const user = await new model.User(payload).save();
    const variables = {
      _id: user.id,
      token: "dsfsdfdsfsdfds654654sdf"
    };

    const result = await mutate({
      mutation: RESET_PASSWORD,
      variables
    });
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: 104
    });
  });

  it("should return code 104 for token bad id", async function() {
    const user = await new model.User(payload).save();
    const secret = "asdsadsadasd";
    const token = jwt.sign(
      { userid: mongoose.Types.ObjectId().toHexString() },
      secret,
      { expiresIn: "1h" }
    );
    const variables = {
      _id: user.id,
      token
    };

    const result = await mutate({
      mutation: RESET_PASSWORD,
      variables
    });
    expect(result.errors[0]).to.have.deep.property("extensions", { code: 104 });
  });
  it("should return true", async function() {
    const user = await new model.User(payload).save();
    const token = user.generatePasswordResetToken();
    const variables = {
      _id: user.id,
      token
    };

    const result = await mutate({
      mutation: RESET_PASSWORD,
      variables
    });
    expect(result.data.resetPassword).to.deep.include({
      success: false
    });
  });
  it("should return result", async function() {
    const user = await new model.User(payload).save();
    const token = user.generatePasswordResetToken();
    const variables = {
      _id: user.id,
      password: "newpassword",
      token
    };

    const result = await mutate({
      mutation: RESET_PASSWORD,
      variables
    });
    expect(result.data.resetPassword).to.deep.include({
      success: true
    });
  });
});

describe("confimEmail", function() {
  before(async function() {
    this.enableTimeouts(false);
    await mongoose.connect("mongodb://localhost/k12-school-test", {
      useNewUrlParser: true,
      useCreateIndex: true
    });
    mongoose.set("useCreateIndex", true);
    mongoose.set("useFindAndModify", false);
  });

  after(async function() {
    var db = mongoose.connection;
    mongoose.models = {};
    mongoose.modelSchemas = {};
    await db.close();
  });

  afterEach(async function() {
    await model.Institution.deleteMany({});
    await model.User.deleteMany({});
    await model.Token.deleteMany({});
  });
  it("should return code 102 for bad token", async function() {
    const user = await new model.User(payload).save();

    const result = await mutate({
      mutation: CONFIRM_EMAIL,
      variables: { token: "sfsdfsdf54sd54sdf", email: user.email }
    });
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: 102
    });
  });
  it("should return code 102 for wrong email", async function() {
    const result1 = await mutate({
      mutation: CREATE_USER,
      variables: payload
    });
    const userToken = await model.Token.findOne({
      _userId: result1.data.createUser._id
    });
    const result = await mutate({
      mutation: CONFIRM_EMAIL,
      variables: { token: userToken.token, email: "fakeemail1@mail.com" }
    });
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: 102
    });
  });
  it("should return code 100 for already confirm email", async function() {
    const result1 = await mutate({
      mutation: CREATE_USER,
      variables: payload
    });
    const userToken = await model.Token.findOne({
      _userId: result1.data.createUser._id
    });
    await model.User.findOneAndUpdate(result1.data.createUser._id, {
      $set: { isVerified: true }
    });
    const result = await mutate({
      mutation: CONFIRM_EMAIL,
      variables: { token: userToken.token, email: payload.email }
    });
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: 100
    });
  });
  it("should return true", async function() {
    const result1 = await mutate({
      mutation: CREATE_USER,
      variables: payload
    });
    const userToken = await model.Token.findOne({
      _userId: result1.data.createUser._id
    });
    const result = await mutate({
      mutation: CONFIRM_EMAIL,
      variables: { token: userToken.token, email: payload.email }
    });
    expect(result.data.confirmEmail).to.have.deep.include({
      success: true
    });
  });
});

describe("reSendConfirmEmail", function() {
  before(async function() {
    await mongoose.connect("mongodb://localhost/k12-school-test", {
      useNewUrlParser: true,
      useCreateIndex: true
    });
    mongoose.set("useCreateIndex", true);
    mongoose.set("useFindAndModify", false);
  });

  after(async function() {
    var db = mongoose.connection;
    mongoose.models = {};
    mongoose.modelSchemas = {};
    await db.close();
  });

  afterEach(async function() {
    await model.Institution.deleteMany({});
    await model.User.deleteMany({});
    await model.Token.deleteMany({});
  });
  it("should return code 102 for unregistered email", async function() {
    const result = await mutate({
      mutation: RESEND_CONFIRM_EMAIL,
      variables: { email: "fakeemail@hmail.com", password: "password123456" }
    });
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: 102
    });
  });
  it("should return BAD_USER_INPUT for wrong password", async function() {
    await new model.User(payload).save();
    const result = await mutate({
      mutation: RESEND_CONFIRM_EMAIL,
      variables: { email: payload.email, password: "wrongpassword" }
    });
    expect(result.errors[0]).to.have.deep.property("extensions", {
      code: "BAD_USER_INPUT"
    });
  });
  it("should return true for valid", async function() {
    await new model.User(payload).save();
    const result = await mutate({
      mutation: RESEND_CONFIRM_EMAIL,
      variables: { email: payload.email, password: payload.password }
    });
    expect(result.data.reSendConfirmEmail).to.deep.include({ success: true });
  });
});
