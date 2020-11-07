import * as Joi from "joi";

export default Joi.object().keys({
  _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  schoolId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  classId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  lessonId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
  name: Joi.string()
    .min(2)
    .max(255)
    .allow("", null)
    .optional(),
  weeklyHour: Joi.number()
    .integer()
    .min(0)
    .max(49)
    .required(),
  teacherId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional()
});

export const removeLessonSchema = Joi.object().keys({
  schoolId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  classId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  lessonId: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
});
