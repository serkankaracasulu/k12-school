import * as Joi from "joi";

export default Joi.object().keys({
  _id: Joi.string()
    .optional()
    .regex(/^[0-9a-fA-F]{24}$/),
  name: Joi.string().min(2).max(255).required(),
  teacherFieldIds: Joi.array()
    .unique()
    .sparse()
    .optional()
    .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
});
