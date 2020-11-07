import * as Joi from "joi";

export default Joi.object().keys({
  email: Joi.string()
    .required()
    .email()
    .label("E-mail"),
  password: Joi.string()
    .required()
    .label("Şifre")
    .min(6)
    .max(20)
});
