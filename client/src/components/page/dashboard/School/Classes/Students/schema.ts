import * as Joi from "joi";

export default Joi.object().keys({
  schoolId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  classId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  students: Joi.array()
    .required()
    .min(1)
    .items(Joi.string())
});
export const dismissSchema = Joi.object().keys({
  studentId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  level: Joi.number()
    .integer()
    .min(1)
    .max(3)
    .required()
});
