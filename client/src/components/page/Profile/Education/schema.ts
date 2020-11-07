import * as Joi from "joi";

export default Joi.object().keys({
  educationLevel: Joi.number()
    .integer()
    .min(0)
    .max(3)
    .required(),
  educationLevelName: Joi.string()
    .min(3)
    .max(250)
    .required(),
  educationType: Joi.number()
    .integer()
    .min(0)
    .max(1)
    .required(),
  educationTypeName: Joi.string()
    .min(3)
    .max(250)
    .required(),
  educationlanguage: Joi.number()
    .integer()
    .min(0)
    .max(100)
    .required(),
  educationlanguageName: Joi.string()
    .min(3)
    .max(250)
    .required(),
  startDate: Joi.date().required(),
  finishDate: Joi.date(),
  university: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  universityName: Joi.string()
    .min(3)
    .max(250)
    .required(),
  department: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
});
