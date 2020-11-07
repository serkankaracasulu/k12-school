import * as Joi from "joi";
declare module "Joi" {
  interface EmailOptions {
    tlds?: string[] | object;
  }
}
export const emailSchema = Joi.string()
  .email()
  .required();

export default Joi.object().keys({
  emails: Joi.array().items(emailSchema)
});
