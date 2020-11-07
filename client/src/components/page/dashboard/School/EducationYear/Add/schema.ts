import * as Joi from "joi";

export const termSchema = Joi.object().keys({
  name: Joi.string()
    .min(2)
    .max(255)
    .required(),
  start: Joi.date().required(),
  finish: Joi.date().required()
});
export const nameSchema = Joi.object().keys({
  name: Joi.string()
    .min(2)
    .max(255)
    .required()
});
export const educationYearSchema = Joi.object().keys({
  schoolId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  name: Joi.string()
    .min(2)
    .max(255)
    .required(),
  terms: Joi.array()
    .required()
    .min(1)
    .items(termSchema)
});
