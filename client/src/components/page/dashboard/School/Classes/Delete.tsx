import * as React from "react";

import { Box, Button, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import {
  ClassQuery,
  SchoolDocument,
  SchoolQuery,
  SchoolQueryVariables,
  useDeleteClassTypeMutation,
} from "../../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
  generateValidateError,
} from "../../../../../helper/generateMessage";
import validate from "../../../../../helper/validate";
import SchoolContext from "../../../../Context";
import DialogWrapper from "../../../../DialogW";
import messageBox from "./messageBox";
import { deleteClassSchema as schema } from "./schema";

type PropsType = {
  setOpen(): void;
  classData: ClassQuery["class"];
  schoolId: string;
};
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rightButton: {
      marginLeft: theme.spacing(1),
    },
  })
);

export default function Dismiss(props: PropsType) {
  const { setOpen, classData, schoolId } = props;
  const { setPr } = React.useContext(SchoolContext);
  const classes = useStyles();
  const [deleteClass, { loading }] = useDeleteClassTypeMutation({
    onCompleted: () => {
      generateSuccess(setPr, messageBox);
      setOpen();
    },
    onError: (cError) => generateError(cError, setPr, messageBox),
  });

  const handleDismiss = () => {
    const variables = { schoolId, classId: classData._id };
    const valiadteError = validate(variables, schema);
    if (valiadteError) {
      generateValidateError(setPr, valiadteError);
      return;
    }
    deleteClass({
      variables,
      update: (proxy, mutationResult) => {
        const { data } = mutationResult;
        const schoolQuery = proxy.readQuery<SchoolQuery, SchoolQueryVariables>({
          query: SchoolDocument,
          variables: { id: schoolId },
        });
        if (schoolQuery && schoolQuery.school && data) {
          const otherClasses = schoolQuery.school.classes.filter(
            (c) => c._id !== classData._id
          );
          proxy.writeQuery<SchoolQuery, SchoolQueryVariables>({
            query: SchoolDocument,
            variables: { id: schoolId },
            data: { school: { ...schoolQuery.school, classes: otherClasses } },
          });
        }
      },
    });
  };
  return (
    <DialogWrapper
      title={`${classData.level} ${classData.code ? classData.code : ""} ${
        classData.code1 ? classData.code1 : ""
      }`}
      setOpen={setOpen}
      maxWidth="sm"
      loading={loading}
    >
      <Typography id="discrete-slider" gutterBottom>
        Bu sınıfı silmek istediğinizden emin misiniz?
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
          SİL
        </Button>
      </Box>
    </DialogWrapper>
  );
}
