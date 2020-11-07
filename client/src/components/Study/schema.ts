import * as Joi from "joi";

export default Joi.object().keys({
  lessonId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .label("Ders"),
  date: Joi.date()
    .min(new Date(Date.now()))
    .required()
    .label("Tarih"),
  duration: Joi.number()
    .integer()
    .min(0)
    .max(480)
    .required()
    .label("Ders süresi"),
  subject: Joi.string()
    .min(2)
    .max(70)
    .required()
    .label("Konu"),
  detail: Joi.string()
    .min(2)
    .max(280)
    .label("Detay"),
  public: Joi.boolean().label("Açık"),
  capacity: Joi.number()
    .integer()
    .min(0)
    .label("Kapasite"),
  permissionClasses: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
});
