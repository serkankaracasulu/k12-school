import * as React from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
} from "@material-ui/core";

import { useRemoveScheduleToLessonMutation } from "../../../../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
} from "../../../../../../../helper/generateMessage";
import SchoolContext from "../../../../../../Context";
import days from "../../../../../../days";
import messageBox from "../messageBox";
import { Edit } from "./flowTypes";

type PropsType = {
  variables: Edit;
  open: boolean;
  setOpen(): void;
  setCloseDetail(): void;
};
export default function RemoveSchedule(props: PropsType) {
  const { variables, setOpen, open, setCloseDetail } = props;
  const { setPr } = React.useContext(SchoolContext);
  const [removeSchedule, { loading }] = useRemoveScheduleToLessonMutation({
    onCompleted: () => {
      generateSuccess(setPr, messageBox);
    },
    onError: (cError) => generateError(cError, setPr, messageBox),
  });
  const handleRemove = () => {
    removeSchedule({
      variables: {
        lessonId: variables.lesson._id,
        scheduleId: variables.schedule._id,
      },
    });
    setCloseDetail();
  };
  return (
    <Dialog
      open={open}
      onClose={setOpen}
      aria-labelledby="schedule-remove"
      aria-describedby="schedule-remove-yes-no"
    >
      {loading && <LinearProgress />}
      <DialogTitle>{`${
        variables.lesson.lessonName || variables.lesson.name
      }`}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {`${days[variables.schedule.day]} ${
            variables.schedule.hourCode
          }. ders kaldırmak istediğinize emin misiniz?`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={setOpen}>Hayır</Button>
        <Button
          variant="contained"
          color="primary"
          autoFocus
          onClick={handleRemove}
        >
          Evet
        </Button>
      </DialogActions>
    </Dialog>
  );
}
