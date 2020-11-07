import * as React from "react";

import { useMutation } from "@apollo/client";
import { Box, Button, Slider, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import {
  Student,
  StudentFragment,
  useDismissStudentMutation,
} from "../../../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
  generateValidateError,
} from "../../../../../../helper/generateMessage";
import validate from "../../../../../../helper/validate";
import SchoolContext from "../../../../../Context";
import DialogWrapper from "../../../../../DialogW";
import messageBox from "./messageBox";
import { dismissSchema as schema } from "./schema";

type PropsType = {
  setOpen(): void;
  student: StudentFragment;
  refetch(): Promise<any>;
};
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rightButton: {
      marginLeft: theme.spacing(1),
    },
  })
);
const status = [
  "İşlemi Seçiniz",
  "Sınıftan çıkart",
  "Okuldan çıkart",
  "Öğrenciyi kalıcı olarak sil",
];

export default function Dismiss(props: PropsType) {
  const { setOpen, student, refetch } = props;
  const { setPr } = React.useContext(SchoolContext);
  const classes = useStyles();
  const [text, setText] = React.useState(0);
  const [dismiss, { loading }] = useDismissStudentMutation({
    onCompleted: () => {
      generateSuccess(setPr, messageBox);
      refetch();
      setOpen();
    },
    onError: (cError) => generateError(cError, setPr, messageBox),
  });

  const valuetext = (value: number) => {
    setText(value);
    return value.toString();
  };
  const handleDismiss = () => {
    const variables = { studentId: student._id, level: text };
    const valiadteError = validate(variables, schema);
    if (valiadteError) {
      generateValidateError(setPr, valiadteError);
      return;
    }
    dismiss({ variables });
  };
  return (
    <DialogWrapper
      title={student.fullName}
      setOpen={setOpen}
      maxWidth="sm"
      loading={loading}
    >
      <Typography id="discrete-slider" gutterBottom>
        {status[text]}
      </Typography>
      <Slider
        defaultValue={0}
        aria-labelledby="discrete-slider"
        step={1}
        getAriaValueText={valuetext}
        min={0}
        max={3}
      />
      <Box
        display="flex"
        justifyContent="flex-end"
        marginTop={2}
        marginBottom={2}
      >
        <Button onClick={setOpen}>İPTAL</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDismiss}
          className={classes.rightButton}
        >
          Kaydet
        </Button>
      </Box>
    </DialogWrapper>
  );
}
