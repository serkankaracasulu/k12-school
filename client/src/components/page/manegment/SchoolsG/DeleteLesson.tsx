import * as React from "react";

import { Box, Button, Typography } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";

import {
  RemoveLessonToClassMutationVariables,
  useRemoveLessonToClassMutation,
} from "../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
  generateValidateError,
} from "../../../../helper/generateMessage";
import validate from "../../../../helper/validate";
import DialogWrapper from "../../../DialogW";
import { SetSnackBarProp } from "../../../myTypes";
import messageBox from "./messageBox";
import { schemaRemoveLesson } from "./schema";

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    marginLeft: theme.spacing(1),
  },
}));

type PropsType = {
  variables: RemoveLessonToClassMutationVariables;
  label: {
    name: string;
    schoolName: string;
    className: number;
  };
  setRemove(): void;
  setSnackBarProp: SetSnackBarProp;
};
export default function Delete(props: PropsType) {
  const { variables, label, setRemove, setSnackBarProp } = props;
  const { name, schoolName, className } = label;
  const classes = useStyles();
  const [removeLessonToClass] = useRemoveLessonToClassMutation({
    onCompleted: () => generateSuccess(setSnackBarProp, messageBox),
    onError: (tError) => generateError(tError, setSnackBarProp, messageBox),
  });
  const handleRemove = () => {
    const validateError = validate(variables, schemaRemoveLesson);
    if (validateError) {
      generateValidateError(setSnackBarProp, validateError);
      setRemove();
    }
    removeLessonToClass({ variables });
    setRemove();
  };
  return (
    <DialogWrapper title="Lesson Remove" setOpen={setRemove}>
      <Typography>{`${schoolName} okulu ${className} sınıfından`}</Typography>
      <Typography>{`${name} dersini çıkarmak istediğinize emin misiniz ?`}</Typography>
      <Box display="flex" justifyContent="flex-end">
        <Button onClick={() => setRemove()}>İPTAL</Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={handleRemove}
        >
          KAYDET
        </Button>
      </Box>
    </DialogWrapper>
  );
}
