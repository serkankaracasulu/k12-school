import * as Joi from "joi";

export default Joi.object().keys({
  _id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
  schoolKindId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
  name: Joi.string()
    .required()
    .label("Ad")
    .min(2)
    .max(255),
  eOkulCode: Joi.string()
    .label("E-Okul kodu")
    .optional()
    .allow("", null)
    .min(8)
    .max(8)
});
export const deleteSchema = Joi.object().keys({
  schoolId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
});
