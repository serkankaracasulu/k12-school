import * as Joi from "joi";

export default Joi.object().keys({
  name: Joi.string()
    .min(3)
    .max(255)
    .required()
});
