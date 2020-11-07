import { SetSnackBarProp } from "../components/myTypes";
import { ApolloError } from "apollo-client";
type Variant = "error" | "info" | "success" | "warning";
type MessageType = {
  failed: { message: string; variant: Variant };
  success: {
    message: string;
    variant: Variant;
  };
};
export function generateSuccess(set: SetSnackBarProp, message: any) {
  set({
    variant: message.success.variant,
    message: message.success.message,
    open: true
  });
}
export function generateError(
  error: ApolloError,
  set: SetSnackBarProp,
  messageBox: any
) {
  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    if (error.graphQLErrors[0].extensions) {
      const { code } = error.graphQLErrors[0].extensions;
      const { is } = error.graphQLErrors[0].extensions.exception;
      const { validationErrors } = error.graphQLErrors[0].extensions.exception;
      const codeProp = `code${code}`;
      let messsage = "";
      if (is) {
        const messsageProp = `message${Object.keys(is)[0]}`;

        messsage = messageBox[codeProp][messsageProp];
      } else if (validationErrors) {
        const [validateError] = validationErrors;
        if (validateError) {
          const { constraints } = validateError;
          if (constraints) {
            const keys = Object.keys(constraints);
            const errorMessage = constraints[keys[0]];
            if (typeof errorMessage === "string") messsage = errorMessage;
          }
        }
      } else messsage = messageBox[codeProp] && messageBox[codeProp].message;
      const variant =
        (messageBox[codeProp] && messageBox[codeProp].variant) || "error";
      set({
        variant,
        message: messsage,
        open: true
      });
    }
  } else
    set({
      variant: "error",
      message: messageBox.failed.message,
      open: true
    });
}

export function generateValidateError(set: SetSnackBarProp, errors: any) {
  if (typeof errors === "object") {
    const keys = Object.keys(errors);
    if (Array.isArray(keys)) {
      const error = errors[keys[0]];
      if (typeof error === "string")
        set({
          variant: "warning",
          message: error,
          open: true
        });
    }
  }
}
