import pather from "path";
import * as querystring from "querystring";
import * as React from "react";
import { useHistory, useLocation } from "react-router-dom";

import { Typography } from "@material-ui/core";

import { useConfirmParentEmailMutation } from "../../../../generated/graphql";
import { generateError } from "../../../../helper/generateMessage";
import Loading from "../../../Loading";
import { SnackBarProp } from "../../../myTypes";
import SnackBar from "../../../SnackBar";

const message = {
  code103: {
    message: "Hatalı adres.",
    variant: "error",
  },
  code102: {
    message: "Böyle bir kullanıcı bulunamadı.",
    variant: "error",
  },
  failed: { message: "Onaylama başarısız.", variant: "error" },
};
function useQuery() {
  return new URLSearchParams(useLocation().search);
}
export default function ConfirmEmail() {
  const query = useQuery();
  const token = query.get("token");
  const email = query.get("email");
  const history = useHistory();
  const [snackBarProp, setSnackBarProp] = React.useState<SnackBarProp>({
    variant: "error",
    message: "",
    open: false,
  });
  if (!token || !email) throw new Error("");
  const [
    confirmParentEmail,
    { loading, data, error },
  ] = useConfirmParentEmailMutation({
    onError: (err) => generateError(err, setSnackBarProp, message),
    onCompleted: (tData) => {
      const queryString = querystring.stringify({
        token: tData.parentConfirmEmail.token,
        _id: tData.parentConfirmEmail._id,
      });
      history.push(pather.join("/", `recoveryp?${queryString}`));
    },
  });
  React.useState(() => {
    if (!loading && !data) {
      confirmParentEmail({ variables: { token, unVerifiedEmail: email } });
    }
  });
  return (
    <>
      {loading && <Loading />}
      {data && (
        <Typography align="center" variant="h5">
          Hesabınız onaylanmıştır
        </Typography>
      )}
      {error && (
        <Typography color="error" variant="h5">
          Bir hata oluştu
        </Typography>
      )}
      <div />
      <SnackBar pr={snackBarProp} setPr={setSnackBarProp} />
    </>
  );
}
