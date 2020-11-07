import * as Joi from "joi";

export default Joi.object().keys({
  lessonId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  message: Joi.string()
    .min(1)
    .max(500)
    .required()
    .label("Mesaj"),
  title: Joi.string()
    .min(3)
    .max(60)
    .required()
    .label("Başlık"),
  messageType: Joi.string()
});

export const homeworkSchema = Joi.object().keys({
  lessonId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  message: Joi.string()
    .min(1)
    .max(500)
    .required()
    .label("Mesaj"),
  title: Joi.string()
    .min(3)
    .max(60)
    .required()
    .label("Başlık"),
  homeWorkFile: Joi.object()
});
