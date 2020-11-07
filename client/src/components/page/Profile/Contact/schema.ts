import * as Joi from "joi";

export default Joi.object().keys({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .optional(),
  lastName: Joi.string()
    .min(2)
    .max(50)
    .optional(),
  email: Joi.string()
    .min(5)
    .max(255)
    .email({
      minDomainAtoms: 2,
      tldWhitelist: { allow: ["com", "net"] }
    })
    .optional(),
  phone: Joi.string()
    .trim()
    .empty(null)
    .regex(/^[0-9]{7,10}$/)
    .optional(),
  birthDate: Joi.date().optional(),
  address: Joi.object().keys({
    ilId: Joi.number()
      .required()
      .min(1)
      .max(81),
    il: Joi.string()
      .required()
      .min(2)
      .max(255),
    ilce: Joi.string()
      .required()
      .min(2)
      .max(255)
  })
});
