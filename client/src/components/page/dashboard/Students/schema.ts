import * as Joi from "joi";

export default Joi.object().keys({
  firstName: Joi.string().min(2).max(50).required().label("İsim"),
  lastName: Joi.string().min(2).max(50).required().label("Soyad"),
  citizenshipId: Joi.string().min(2).max(12).required().label("TC kimlik no"),
  foreignLanguage: Joi.string().label("Yabancı dil"),
  schoolNo: Joi.string().allow("").label("Okul no"),
  school: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  class: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  profilePhotoBase64: Joi.string(),
});
export const deleteSchema = Joi.object().keys({
  studentId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  level: Joi.number().integer().min(3).max(3).required(),
});
