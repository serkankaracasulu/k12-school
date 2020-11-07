import React from "react";

import { Button, DialogActions, Typography } from "@material-ui/core";

import {
  ExamFragment,
  HourFragment,
  LessonFragment,
  SetExamMutationVariables,
  TermFragment,
} from "../../../../../generated/graphql";
import DialogWrapper from "../../../../DialogW";
import DeleteForm from "./Delete";
import EditForm from "./Send";

type PropType = {
  exam: ExamFragment;
  setOpen(): void;
  lesson: LessonFragment;
  hours: HourFragment[];
  terms: TermFragment[];
  refetch(): Promise<any>;
};
export default function ExamDetail(props: PropType) {
  const { exam, setOpen, hours, terms, refetch, lesson } = props;
  const date = new Date(exam.date);
  const [deleteExam, openDelete] = React.useState(false);
  const [openEditExam, setOpenEditExam] = React.useState<
    SetExamMutationVariables | false
  >(false);
  const now = Date.now();
  return (
    <DialogWrapper title="Sınav" setOpen={setOpen} maxWidth="xs">
      <div>
        <Typography variant="body2" component="span">
          Tarih :
        </Typography>{" "}
        <Typography component="span" variant="body1">
          {date.toLocaleDateString()}
        </Typography>
      </div>
      <Typography variant="body2" component="span">
        Ders saati :
      </Typography>{" "}
      <Typography component="span" variant="body1">
        {exam.lessonHourCode.join(", ")}{" "}
      </Typography>
      <DialogActions>
        {now <= date.valueOf() && (
          <Button
            variant="contained"
            onClick={() =>
              setOpenEditExam({
                lessonId: lesson._id,
                date: exam.date,
                lessonHourCode: exam.lessonHourCode,
                _id: exam._id,
              })
            }
          >
            DÜZENLE
          </Button>
        )}
        <Button
          color="secondary"
          variant="contained"
          onClick={() => openDelete(true)}
        >
          SİL
        </Button>
      </DialogActions>
      {deleteExam && <DeleteForm exam={exam} setOpen={setOpen} />}
      {openEditExam && (
        <EditForm
          terms={terms}
          hours={hours}
          lesson={lesson}
          refetch={refetch}
          setOpen={setOpen}
          editVariables={openEditExam}
        />
      )}
    </DialogWrapper>
  );
}
