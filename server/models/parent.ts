import { Field, ObjectType, ID, registerEnumType } from "type-graphql";
import { Schema, Types, Document } from "mongoose";
import { Student } from "./student";
import { Institution } from "./Institution";
import { ObjectId } from "mongodb";

export enum ParentType {
  Mother = "Mother",
  Father = "Father",
}
registerEnumType(ParentType, {
  name: "ParentType",
});

@ObjectType()
export class ParentStudent {
  @Field(() => ID)
  _id: ObjectId;

  @Field(() => ID)
  studentId: Student["_id"];

  @Field(() => ID)
  institutionId: Institution["_id"];

  @Field(() => ParentType, { nullable: true })
  parentType?: ParentType;
}
export interface IParentStudent extends ParentStudent, Document {
  _id: ObjectId;
}

export const parentStudentSchema = new Schema<IParentStudent>({
  studentId: Schema.Types.ObjectId,
  institutionId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  parentType: {
    type: Schema.Types.String,
    enum: Object.values(ParentType),
    required: true,
  },
});

export interface IParentStudent extends ParentStudent, Document {}
/*
parentSchema.methods.generateParentAuthToken = async function () {
  let roles = [Role.PARENT, Role.USER];
  if (typeof process.env.SECRET_KEY === "string") {
    const students = await StudentModel.find(
      { _id: { $in: this.studentIds } },
      {
        school: "",
        class: "",
      }
    );
    const studentInfos: StudentInfo[] = [];
    for (const student of students) {
      studentInfos.push({
        _id: student._id.toHexString(),
        schoolId: student.school?.toHexString(),
        classId: student.class?.toHexString(),
      });
    }
    const activeUser: IActiveUser = {
      _id: this.id,
      roles,
      institution: this.institutionId?.toHexString(),
      students: studentInfos,
      fullName: this.firstName + " " + this.lastName,
      institutions: [],
    };
    return jwt.sign(activeUser, process.env.SECRET_KEY, { expiresIn: "2h" });
  }
};
export const ParentModel = PersonModel.discriminator<IParent>(
  "Parent",
  parentSchema
);
*/
