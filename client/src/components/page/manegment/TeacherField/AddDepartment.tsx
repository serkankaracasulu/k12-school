import * as React from "react";

import { Button, TextField } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";

import {
  DepartmentsQuery,
  useAddDepartmentsToTeacherFieldMutation,
  useDepartmentsQuery,
} from "../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
  generateValidateError,
} from "../../../../helper/generateMessage";
import validate from "../../../../helper/validate";
import DialogWrapper from "../../../DialogW";
import { SetSnackBarProp } from "../../../myTypes";
import { deparmentSchema } from "./schema";

type PropsType = {
  id: string;
  close(): void;
  setSnackBarProp: SetSnackBarProp;
};

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    float: "right",
    marginTop: theme.spacing(2),
  },
  selectRoot: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  option: {
    zIndex: theme.zIndex.modal + 1,
  },
}));
const messageBox = {
  success: { message: "Kayıt edildi.", variant: "success" },
  code100: {
    messageeOkulCode: "Bu E-Okul koduna sahip başka okul var",
    messagename: "Bu isme sahip başka okul var",
    variant: "info",
  },
  code102: {
    message: "Kayıt edilecek okul bulunamadı",
    messageHour: "Dönem bulunmadı",
    variant: "warning",
  },
  code103: { message: "Değişiklik olmadı", variant: "info" },
  codeBAD_USER_INPUT: { message: "Hatalı veri giriş", variant: "error" },
  failed: { message: "Kayıt başarısız.", variant: "error" },
};
export default function AddDepartment(props: PropsType) {
  const { id, close, setSnackBarProp } = props;
  const classes = useStyles();
  const { data, loading } = useDepartmentsQuery();

  const [addDepartments] = useAddDepartmentsToTeacherFieldMutation({
    onCompleted: () => generateSuccess(setSnackBarProp, messageBox),
    onError: (cError) => generateError(cError, setSnackBarProp, messageBox),
  });
  const [value, setValue] = React.useState<
    DepartmentsQuery["departments"] | null
  >(null);
  const handleSave = () => {
    const ids = value && value.map((val) => val._id);
    if (ids) {
      const validateError = validate(ids, deparmentSchema);
      if (validateError) generateValidateError(setSnackBarProp, validateError);
      addDepartments({ variables: { _id: id, ids } });
      close();
    }
  };
  return (
    <DialogWrapper title="Department" setOpen={close} maxWidth="sm">
      <Autocomplete
        multiple
        options={data ? data.departments : []}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Program/Fakülte"
            fullWidth
          />
        )}
        onChange={(e, newValue) => setValue(newValue)}
        loading={loading}
        classes={{
          root: classes.selectRoot,
        }}
      />
      <Button
        color="primary"
        variant="contained"
        className={classes.button}
        onClick={handleSave}
      >
        Kaydet
      </Button>
    </DialogWrapper>
  );
}
