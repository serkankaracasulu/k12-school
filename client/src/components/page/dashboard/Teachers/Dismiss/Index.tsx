import * as React from "react";

import { Button, DialogActions, Typography } from "@material-ui/core";

import {
  TeachersQuery,
  useDismissTeacherMutation,
} from "../../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
} from "../../../../../helper/generateMessage";
import SchoolContext from "../../../../Context";
import DialogWrapper from "../../../../DialogW";
import messageBox from "../messageBox";

type PropsType = {
  teacher: TeachersQuery["teachers"][0];
  setOpen(): void;
};
export default function Dismiss(props: PropsType) {
  const { teacher, setOpen } = props;
  const { setPr } = React.useContext(SchoolContext);
  const [dismissTeacher] = useDismissTeacherMutation({
    onCompleted: () => {
      generateSuccess(setPr, messageBox);
    },
    onError: (cError) => generateError(cError, setPr, messageBox),
  });
  const handleDismiss = () => {
    dismissTeacher({ variables: { teacherId: teacher._id } });
  };
  return (
    <DialogWrapper title={teacher?.fullName || ""} setOpen={setOpen}>
      <Typography variant="h6">
        Öğretmeni kurumdan çıkarmak istediğinizden emin misiniz?
      </Typography>
      <DialogActions>
        <Button onClick={setOpen}>Hayır</Button>
        <Button variant="contained" color="secondary" onClick={handleDismiss}>
          Evet
        </Button>
      </DialogActions>
    </DialogWrapper>
  );
}
