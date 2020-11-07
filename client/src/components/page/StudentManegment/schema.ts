import * as Joi from "joi";

export default Joi.object().keys({
  username: Joi.string()
    .required()
    .label("Kullanıcı adı")
    .min(5)
    .max(255),
  password: Joi.string()
    .required()
    .label("Şifre")
    .min(5)
    .max(255)
});
export const schemaSignUp = Joi.object()
  .keys({
    firstName: Joi.string()
      .required()
      .label("Ad"),
    lastName: Joi.string()
      .required()
      .label("Soyad"),
    email: Joi.string()
      .email({ minDomainAtoms: 2, tldWhitelist: { allow: ["com", "net"] } })
      .required()
      .label("E-Mail"),
    password: Joi.string()
      .required()
      .label("Şifre"),
    token: Joi.string().optional(),
    institution: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional()
  })
  .with("token", "institution");
export const schemaResetPassword = Joi.object().keys({
  token: [Joi.string(), Joi.number()],
  _id: Joi.string(),
  password: Joi.string()
    .min(5)
    .max(255)
    .required()
    .label("Şifre")
});
