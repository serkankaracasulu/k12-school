import * as Joi from "joi";

export default Joi.object().keys({
  email: Joi.string()
    .required()
    .email()
    .label("E-mail")
    .min(5)
    .max(255),
  password: Joi.string()
    .required()
    .label("Şifre")
    .min(5)
    .max(255)
});
export const schemaSignUp = Joi.object().keys({
  firstName: Joi.string()
    .required()
    .label("Ad"),
  lastName: Joi.string()
    .required()
    .label("Soyad"),
  email: Joi.string()
    .required()
    .label("E-Mail"),
  password: Joi.string()
    .required()
    .label("Şifre"),
  token: Joi.string().optional()
});
export const schemaResetPassword = Joi.object().keys({
  token: [Joi.string(), Joi.number()],
  _id: Joi.string(),
  password: Joi.string()
    .min(5)
    .max(255)
    .required()
    .label("Şifre")
});
