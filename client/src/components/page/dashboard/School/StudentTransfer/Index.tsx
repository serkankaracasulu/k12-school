import * as React from "react";
import { useParams } from "react-router-dom";

import { Box, Button } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import {
  TransferStudentsMutationVariables,
  useStudentsQuery,
  useTransferStudentsMutation,
} from "../../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
  generateValidateError,
} from "../../../../../helper/generateMessage";
import validate from "../../../../../helper/validate";
import SchoolContext from "../../../../Context";
import DialogWrapper from "../../../../DialogW";
import StudentSelect from "../../../../StudentSelect";
import messageBox from "./messageBox";
import schema from "./schema";

type PropsType = {
  setOpen(): void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    right: {
      float: "right",
      marginLeft: theme.spacing(1),
    },
    selectForm: {
      display: "flex",
      marginTop: theme.spacing(1),
    },
    select: {
      flexGrow: 1,
    },
    rightButton: {
      marginLeft: theme.spacing(1),
    },
    textField: {
      marginTop: theme.spacing(1),
      zIndex: 0,
    },
    selectRoot: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(3),
    },
    option: {
      zIndex: theme.zIndex.modal + 1,
    },
    icon: {
      color: theme.palette.text.secondary,
      marginRight: theme.spacing(2),
    },
  })
);

type ParamType = {
  schoolId: string;
  classId: string;
};

export default function Add(props: PropsType) {
  const classes = useStyles();
  const { setOpen } = props;
  const { schoolId, classId } = useParams<ParamType>();
  const { setPr } = React.useContext(SchoolContext);
  const [value, setValue] = React.useState("");
  const [variables, setVariables] = React.useState<
    TransferStudentsMutationVariables
  >({
    schoolId,
    classId,
    students: [],
  });
  const [transfer, { loading: mutationLoading }] = useTransferStudentsMutation({
    onCompleted: () => {
      generateSuccess(setPr, messageBox);
      setOpen();
    },
    onError: (cError) => generateError(cError, setPr, messageBox),
  });
  const { data } = useStudentsQuery({
    variables: {
      schoolId,
      notClass: true,
      classId,
    },
  });
  const handleChange = (studentIds: string[]) => {
    setVariables({
      ...variables,
      students: studentIds,
    });
  };
  const handleTransfer = () => {
    const validateError = validate(variables, schema);
    if (validateError) {
      generateValidateError(setPr, validateError);
      return;
    }
    transfer({
      variables,
      update: () => {},
    });
  };
  return (
    <DialogWrapper
      title="Öğrenci Aktar"
      setOpen={setOpen}
      maxWidth="sm"
      loading={mutationLoading}
    >
      <StudentSelect
        multiple={true}
        value={value}
        setValue={setValue}
        students={data?.students || []}
        loading
        setStudentId={handleChange}
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
          className={classes.rightButton}
          onClick={handleTransfer}
        >
          Aktar
        </Button>
      </Box>
    </DialogWrapper>
  );
}
