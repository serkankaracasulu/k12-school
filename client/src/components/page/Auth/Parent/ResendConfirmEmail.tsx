import * as React from "react";

import {
  Button,
  DialogActions,
  TextField,
  Typography,
} from "@material-ui/core";

import { useParentResendConfimEmailMutation } from "../../../../generated/graphql";
import DialogWrapper from "../../../DialogW";

type PropsType = {
  setOpen(): void;
  unVerifiedEmail: string;
};

export default function ResenConfirmEmailForm(props: PropsType) {
  const { setOpen, unVerifiedEmail } = props;
  const citizenshipIdRef = React.useRef<HTMLInputElement | null>(null);
  const [send, { loading, error, data }] = useParentResendConfimEmailMutation({
    onCompleted: () => {},
    onError: () => {},
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const citizenshipId = citizenshipIdRef.current?.value;
    citizenshipId && send({ variables: { citizenshipId, unVerifiedEmail } });
  };

  return (
    <DialogWrapper
      setOpen={setOpen}
      title="Email Onaylama"
      maxWidth="sm"
      loading={loading}
    >
      <form onSubmit={handleSubmit}>
        <TextField
          inputRef={citizenshipIdRef}
          variant="outlined"
          margin="normal"
          placeholder="T.C kimlik no"
          required
          fullWidth
          autoFocus
        />
        {data && (
          <Typography>
            Onaylama bilgilerini mail adresinize gönderdik.
          </Typography>
        )}
        {error && <Typography>Bir sorun oluştu</Typography>}
        <DialogActions>
          <Button color="primary" onClick={setOpen}>
            İPTAL
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading || !!data}
          >
            YENİ ONAYLAMA LİNKİ İSTE
          </Button>
        </DialogActions>
      </form>
    </DialogWrapper>
  );
}
