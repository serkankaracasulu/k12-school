import * as Joi from "joi";

export default Joi.object().keys({
  schoolId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  classId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  students: Joi.array()
    .required()
    .min(1)
    .items(Joi.string())
});
