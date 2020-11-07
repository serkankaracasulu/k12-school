const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
module.exports = {
  _id: new ObjectId("5d8f31015b1eed0780b2f115"),
  isVerified: true,
  firstName: "name",
  lastName: "lastname",
  email: "serkankaracasulu@gmail.com",
  password: "$2b$10$6.Zthd60RlXvcCgiARbyD.NVUYskxS.Tl5jORCVaQe7X1gIrrmUqq",
  institution: {
    _id: new ObjectId("5d8f31015b1eed0780b2f117"),
    roles: [
      {
        _id: new ObjectId("5d8f31015b1eed0780b2f118"),
        role: "OWNER"
      }
    ],
    institution: new ObjectId("5d8f31015b1eed0780b2f116")
  }
};
