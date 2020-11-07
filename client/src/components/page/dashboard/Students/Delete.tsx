import * as React from "react";

import { Box, Button, Typography } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";

import {
  StudentQuery,
  StudentsDocument,
  StudentsQuery,
  StudentsQueryVariables,
  useDismissStudentMutation,
} from "../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
  generateValidateError,
} from "../../../../helper/generateMessage";
import validate from "../../../../helper/validate";
import SchoolContext from "../../../Context";
import DialogWrapper from "../../../DialogW";
import messageBox from "./messageBox";
import { deleteSchema as schema } from "./schema";

type PropsType = {
  setOpen(): void;
  student: StudentQuery["student"];
};
const useStyles = makeStyles((theme: Theme) => ({
  rightButton: {
    marginLeft: theme.spacing(1),
  },
}));

export default function Dismiss(props: PropsType) {
  const { setOpen, student } = props;
  const { setPr } = React.useContext(SchoolContext);
  const classes = useStyles();
  const [deleteStudent, { loading }] = useDismissStudentMutation({
    onCompleted: (tData) => {
      if (tData.dismissStudent.success) {
        generateSuccess(setPr, messageBox);
        setOpen();
      }
    },
    onError: (cError) => generateError(cError, setPr, messageBox),
  });

  const handleDismiss = () => {
    const variables = { studentId: student._id, level: 3 };
    const valiadteError = validate(variables, schema);
    if (valiadteError) {
      generateValidateError(setPr, valiadteError);
      return;
    }
    deleteStudent({
      variables,
      update: (proxy, mutationResult) => {
        const studentsQuery = proxy.readQuery<
          StudentsQuery,
          StudentsQueryVariables
        >({
          query: StudentsDocument,
        });
        const { data } = mutationResult;
        if (
          studentsQuery &&
          studentsQuery.students &&
          data &&
          data.dismissStudent.success
        ) {
          const otherStudents = studentsQuery.students.filter(
            (st) => st._id !== data.dismissStudent._id
          );
          proxy.writeQuery<StudentsQuery, StudentsQueryVariables>({
            query: StudentsDocument,
            data: { students: otherStudents },
          });
        }
      },
    });
  };
  return (
    <DialogWrapper
      title={student.fullName}
      setOpen={setOpen}
      maxWidth="sm"
      loading={loading}
    >
      <Typography id="discrete-slider" gutterBottom>
        Öğrenciyi silmek istediğinizden emin misiniz?
      </Typography>
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
