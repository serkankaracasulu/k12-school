import * as Joi from "joi";
import { KeysMatching } from "../components/myTypes";
const object = Joi.object();
const array = Joi.array();
type ObjectSchemaType = typeof object;
type ArraySchemaType = typeof array;

export default function getValidateMessage<T extends object>(
  variables: T,
  schema: ObjectSchemaType | ArraySchemaType
): KeysMatching<T> | void {
  const validateResult = schema.validate(variables);
  if (validateResult.error) {
    const validateErrors: Partial<KeysMatching<T>> = {};
    const lang = navigator.language;
    if (lang !== "tr-TR" && lang !== "tr") {
      validateResult.error.details.forEach(err => {
        const path = err.path[0];
        if (Object.keys(variables).includes(path))
          validateErrors[path as keyof T] = err.message;
        return validateErrors;
      });
    }
    validateResult.error.details.forEach(err => {
      let message;
      switch (err.type) {
        case "any.required":
          message = (err.context && err.context.label) || err.path[0];
          message += " alanı boş bırakılamaz.";
          break;
        case "any.empty":
          message = (err.context && err.context.label) || err.path[0];
          message += " alanı boş bırakılamaz.";
          break;
        case "string.min":
          message = (err.context && err.context.label) || err.path[0];
          if (err.context)
            message += ` alanı en az ${err.context.limit} karakter olmalıdır.`;
          break;
        case "string.empty":
          message = (err.context && err.context.label) || err.path[0];
          message += ` alanı boş olamaz.`;
          break;
        case "date.less":
          message = (err.context && err.context.label) || err.path[0];
          message += ` alanı daha küçük olmalı.`;
          break;
        case "date.greater":
          message = (err.context && err.context.label) || err.path[0];
          message += ` alanı daha büyük olmalı.`;
          break;
        case "date.min":
          message = (err.context && err.context.label) || err.path[0];
          message += ` ${
            err.context ? err.context.limit : ""
          } tarihinden büyük veya eşit olmalıdır.`;
          break;
        case "string.base":
          message = (err.context && err.context.label) || err.path[0];
          message += ` alanı string türünde olmalıdır`;
          break;
        case "string.max":
          message = (err.context && err.context.label) || err.path[0];
          if (err.context)
            message += ` alanı en fazla ${err.context.limit} karakter olmalıdır.`;
          break;
        case "string.regex.base":
          message = (err.context && err.context.label) || err.path[0];
          message += ` hatalı.`;
          break;
        case "string.email":
          message = "Geçerli bir email alanı olmalıdır.";
          break;
        case "array.min":
          message = (err.context && err.context.label) || err.path[0];
          if (err.context)
            message += ` alanı en az ${err.context.limit} nesne içermelidir.`;
          break;
        case "number.max":
          message = (err.context && err.context.label) || err.path[0];
          if (err.context)
            message += ` alanı en az veya eşit ${err.context.limit} olmalıdır.`;
          break;
        case "number.min":
          message = (err.context && err.context.label) || err.path[0];
          if (err.context)
            message += ` alanı en çok veya eşit ${err.context.limit} olmalıdır.`;
          break;
        default:
          console.log("err  type: ", err.type);
          console.log("err : ", err);
          message = " " + (err.context && err.context.label) || err.path[0];
          break;
      }
      const path = err.path[0];
      validateErrors[path as keyof T] = message;
    });
    return validateErrors as KeysMatching<T>;
  }
  return undefined;
}
