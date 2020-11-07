const { model } = require("../../../models");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { expect } = require("chai");
const mongoose = require("mongoose");
describe("user.generateAuthToken", () => {
  it("should return a valid JWT", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      email: "sample@mail.com"
    };
    const user = new model.User(payload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    expect(decoded).to.contain(payload);
  });
});

describe("user.verifyPasswordResetToken", function() {
  it("should return a true for verify password reset token", async () => {
    let password;
    bcrypt.hash("123456", 10).then(hash => {
      password = hash;
    });
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      email: "sample@mail.com",
      password: password
    };
    const user = new model.User(payload);
    const token = user.generatePasswordResetToken();
    const decoded = await user.verifyPasswordResetToken(token, user.id);
    expect(decoded).to.be.true;
  });
  it("should return a false for bad token", async () => {
    let password;
    bcrypt.hash("123456", 10).then(hash => {
      password = hash;
    });
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      email: "sample@mail.com",
      password: password
    };
    const user = new model.User(payload);
    const token = "asdasdas54sd465ds54";
    const decoded = await user.verifyPasswordResetToken(token, user.id);
    expect(decoded).to.be.false;
  });
  it("should return a false for bad id", async () => {
    let password;
    bcrypt.hash("123456", 10).then(hash => {
      password = hash;
    });
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      email: "sample@mail.com",
      password: password
    };
    const token = jwt.sign(
      { _id: new mongoose.Types.ObjectId().toHexString() },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h"
      }
    );
    const user = new model.User(payload);
    const decoded = await user.verifyPasswordResetToken(token, user.id);
    expect(decoded).to.be.false;
  });
  it("should return a false for bad secret", async () => {
    let password;
    bcrypt.hash("123456", 10).then(hash => {
      password = hash;
    });
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      email: "sample@mail.com",
      password: password
    };
    const user = new model.User(payload);
    const token = jwt.sign({ _id: user.id }, "fakesecret", {
      expiresIn: "1h"
    });
    const decoded = await user.verifyPasswordResetToken(token, user.id);
    expect(decoded).to.be.false;
  });
});
