import * as Joi from "joi";

export default Joi.object().keys({
  password: Joi.string()
    .required()
    .min(5)
    .max(15)
    .label("Şifre"),
  rePassword: Joi.ref("password")
});
