import * as React from "react";
import { useParams } from "react-router-dom";

import { useConfirmEmailMutation } from "../../../generated/graphql";
import Loading from "../../Loading";
import Message from "../../Message";

const message = {
  cOk: "Hesabınız onaylandı",
  c100: "Hesabınız zaten onaylanmış",
  c102: "Böyle bir kullanıcı bulunamadı yada Hesabınız zaten onaylanmış",
};

type ParamType = {
  token: string;
  email: string;
};
export default function ConfirmEmail() {
  const { token, email } = useParams<ParamType>();
  const [result, setResult] = React.useState<"cOk" | "c100" | "c102">();
  const [
    confirmEmail,
    { error, data, loading, called },
  ] = useConfirmEmailMutation({
    onError: (err) => {
      if (err.graphQLErrors.length > 0) {
        if (err.graphQLErrors[0].extensions) {
          const { code } = err.graphQLErrors[0].extensions;
          if (code === "cOk" || code === "c100" || code === "c102")
            setResult(code);
        }
      }
    },
    onCompleted: () => {
      setResult("cOk");
    },
  });
  if (!called && !error && !loading && !data) {
    confirmEmail({ variables: { token, email } });
  }
  return (
    <>
      {loading && <Loading />}
      <div />
      {result && (
        <Message
          title={result !== "cOk" ? "error" : ""}
          message={message[result]}
        />
      )}
    </>
  );
}
