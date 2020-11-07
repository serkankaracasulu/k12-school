// @flow
import * as Joi from "joi";

export default Joi.object().keys({
  _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  lessonId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
  day: Joi.number().integer().min(0).max(6).required(),
  hourCode: Joi.number().integer().min(0).max(25).required(),
});

export const removeLessonSchema = Joi.object().keys({
  lessonId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
});
