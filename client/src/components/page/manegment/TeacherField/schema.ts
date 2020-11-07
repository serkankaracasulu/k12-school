import * as Joi from "joi";

export default Joi.object().keys({
  name: Joi.string()
    .min(3)
    .max(255)
    .required()
});
export const deparmentSchema = Joi.array()
  .required()
  .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/));
