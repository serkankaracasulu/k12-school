import * as React from "react";

import { Box, Button, Typography } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";

import {
  SchoolFragment,
  SchoolsDocument,
  SchoolsQuery,
  SchoolsQueryVariables,
  useDeleteSchoolMutation,
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
import { deleteSchema as schema } from "./schoolSchema";

type PropsType = {
  setOpen(): void;
  school: SchoolFragment;
};
const useStyles = makeStyles((theme: Theme) => ({
  rightButton: {
    marginLeft: theme.spacing(1),
  },
}));

export default function Dismiss(props: PropsType) {
  const { setOpen, school } = props;
  const { setPr } = React.useContext(SchoolContext);
  const classes = useStyles();
  const [deleteSchool, { loading }] = useDeleteSchoolMutation({
    onCompleted: () => {
      generateSuccess(setPr, messageBox);
      setOpen();
    },
    onError: (cError) => generateError(cError, setPr, messageBox),
  });

  const handleDismiss = () => {
    const variables = { schoolId: school._id };
    const valiadteError = validate(variables, schema);
    if (valiadteError) {
      generateValidateError(setPr, valiadteError);
      return;
    }
    deleteSchool({
      variables,
      update: (proxy, mutationResult) => {
        const { data } = mutationResult;
        const schoolsQuery = proxy.readQuery<
          SchoolsQuery,
          SchoolsQueryVariables
        >({
          query: SchoolsDocument,
        });
        if (schoolsQuery && schoolsQuery.schools && data) {
          const schools = schoolsQuery.schools.filter(
            (s) => s._id !== data.deleteSchool._id
          );
          proxy.writeQuery<SchoolsQuery, SchoolsQueryVariables>({
            query: SchoolsDocument,
            data: { schools },
          });
        }
      },
    });
  };
  return (
    <DialogWrapper
      title={school.name}
      setOpen={setOpen}
      maxWidth="sm"
      loading={loading}
    >
      <Typography id="discrete-slider" gutterBottom>
        Bu okulu silmek istediğinizden emin misiniz?
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
