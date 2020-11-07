import * as Joi from "joi";

const hourValidateSchema = Joi.object().keys({
  _id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
  code: Joi.number()
    .min(1)
    .max(18)
    .required(),
  start: Joi.string()
    .regex(/^((?:[01]\d|2[0-3]):[0-5]\d$)/)
    .required(),
  finish: Joi.string()
    .regex(/^((?:[01]\d|2[0-3]):[0-5]\d$)/)
    .required()
});

export default Joi.object().keys({
  _id: Joi.string().optional(),
  name: Joi.string()
    .min(2)
    .max(50)
    .required(),
  hour: Joi.array()
    .min(1)
    .max(18)
    .required()
    .items(hourValidateSchema),
  schoolId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
});

export const optionsSchema = Joi.object().keys({
  hourCount: Joi.number()
    .integer()
    .label("Ders sayısı")
    .max(18)
    .required(),
  lessonTime: Joi.number()
    .integer()
    .label("Ders süresi")
    .max(1200)
    .required(),
  breathingTime: Joi.number()
    .integer()
    .label("Ders arası")
    .max(400)
    .required(),
  kind: Joi.string()
    .min(2)
    .max(50)
    .required(),
  startHour: Joi.string()
    .regex(/^((?:[01]\d|2[0-3]):[0-5]\d$)/)
    .required()
});
