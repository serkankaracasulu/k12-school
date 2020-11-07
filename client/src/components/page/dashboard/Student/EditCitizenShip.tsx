import * as React from "react";

import { Button, DialogActions, TextField } from "@material-ui/core";

import {
  EditStudentCitizenshipIdMutationVariables,
  StudentQueryVariables,
  useEditStudentCitizenshipIdMutation,
} from "../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
} from "../../../../helper/generateMessage";
import Context from "../../../Context";
import DialogWrapper from "../../../DialogW";
import messageBox from "./messageBox";

type PropsType = {
  setOpen(): void;
  iVariables: EditStudentCitizenshipIdMutationVariables;
  refetch(variables?: StudentQueryVariables | undefined): Promise<any>;
};
export default function EditCitizenShipForm(props: PropsType) {
  const { setOpen, iVariables, refetch } = props;
  const { setPr } = React.useContext(Context);
  const [variables, setVariables] = React.useState<
    EditStudentCitizenshipIdMutationVariables
  >(iVariables);
  const [edit, { loading }] = useEditStudentCitizenshipIdMutation({
    onCompleted: () => {
      generateSuccess(setPr, messageBox);
      refetch();
      setOpen();
    },
    onError: (tError) => {
      generateError(tError, setPr, messageBox);
    },
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    edit({ variables });
  };
  return (
    <DialogWrapper setOpen={setOpen} title="T.C Düzenle" loading={loading}>
      <form onSubmit={handleSubmit}>
        <TextField
          label="T.C"
          variant="outlined"
          fullWidth
          value={variables.citizenshipId}
          onChange={(event) =>
            setVariables({
              ...variables,
              citizenshipId: event.currentTarget.value,
            })
          }
        />
        <DialogActions>
          <Button onClick={setOpen}>İptal</Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
          >
            Kaydet
          </Button>
        </DialogActions>
      </form>
    </DialogWrapper>
  );
}
