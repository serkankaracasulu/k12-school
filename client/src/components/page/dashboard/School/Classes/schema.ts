import * as Joi from "joi";

export default Joi.object().keys({
  _id: Joi.string().optional(),
  schoolId: Joi.string().required(),
  name: Joi.string()
    .min(2)
    .max(255)
    .empty(""),
  level: Joi.number()
    .min(0)
    .max(50),
  code: Joi.string()
    .max(3)
    .empty(""),
  code1: Joi.string()
    .min(2)
    .max(255)
    .empty(""),
  group: Joi.string()
});
export const setClassroomTeacherSchema = Joi.object().keys({
  schoolId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  classId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
});
export const deleteClassSchema = Joi.object().keys({
  schoolId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  classId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
});
