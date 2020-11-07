import * as Joi from "joi";

export default Joi.object().keys({
  citizenshipId: Joi.string()
    .regex(/[0-9]{11}$/)
    .min(11)
    .max(11)
    .label("T.C"),
  studentId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  firstName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .label("Ad"),
  lastName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .label("Soyad"),
  unVerifiedEmail: Joi.string()
    .email()
    .required()
    .label("E-Mail"),
  phone: Joi.string().label("Telefon"),
  birthDate: Joi.date(),
  parentType: Joi.string().required()
});
