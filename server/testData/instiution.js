const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
module.exports = {
  _id: new ObjectId("5d8f31015b1eed0780b2f116"),
  name: "test corp",
  creator: new ObjectId("5d8f31015b1eed0780b2f115"),
  schools: [
    {
      _id: new ObjectId("5d8f3909966c533bc85c25d5"),
      name: "High School1",
      eOkulCode: "12345678",
      hours: [],
      terms: [],
      teachers: [],
      classes: []
    }
  ]
};
