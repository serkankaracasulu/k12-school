import * as Joi from "joi";

const classJoiSchema = Joi.object().keys({
  level: Joi.number()
    .min(0)
    .max(50)
    .required()
});
export default Joi.object().keys({
  name: Joi.string()
    .min(2)
    .max(255)
    .required(),
  classes: Joi.array()
    .unique()
    .min(1)
    .max(50)
    .items(classJoiSchema)
});
export const schemaAddLesson = Joi.object().keys({
  schoolId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  classId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  lessonId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  count: Joi.number().integer(),
  required: Joi.boolean()
});

export const schemaRemoveLesson = Joi.object().keys({
  schoolId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  classId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  _id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
});
