import * as Joi from "joi";

export default Joi.object().keys({
  firstName: Joi.string()
    .alphanum()
    .required()
    .label("Ad"),
  lastName: Joi.string()
    .required()
    .label("Soyad"),
  email: Joi.string()
    .required()
    .label("Email"),
  institutionName: Joi.string()
    .min(3)
    .max(255)
    .required()
    .label("Kurum adı"),
  phone: Joi.string()
    .trim()
    .regex(/^[0-9]{7,10}$/)
    .required()
    .label("Telefon"),
  password: Joi.string()
    .required()
    .label("Şifre")
});
