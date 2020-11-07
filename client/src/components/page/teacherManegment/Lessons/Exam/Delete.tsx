import React from "react";

import { Button, DialogActions, Typography } from "@material-ui/core";

import {
  ExamFragment,
  ExamsDocument,
  ExamsQuery,
  ExamsQueryVariables,
  useDeleteExamMutation,
} from "../../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
} from "../../../../../helper/generateMessage";
import TeacherContext from "../../../../Context";
import DialogWrapper from "../../../../DialogW";
import messageBox from "./messageBox";

type PropType = {
  exam: ExamFragment;
  setOpen(): void;
};
export default function ExamDetail(props: PropType) {
  const { exam, setOpen } = props;
  const { setPr } = React.useContext(TeacherContext);
  const [deleteExam] = useDeleteExamMutation({
    onCompleted: (tData) => {
      if (tData.deleteExam.success) {
        generateSuccess(setPr, messageBox);
        setOpen();
      }
    },
    onError: (cError) => generateError(cError, setPr, messageBox),
  });
  const handleDelete = () => {
    deleteExam({
      variables: { lessonId: exam.lessonId, examId: exam._id },
      update: (cache, result) => {
        if (result.data && result.data.deleteExam.success) {
          const examsQuery = cache.readQuery<ExamsQuery, ExamsQueryVariables>({
            query: ExamsDocument,
            variables: { lessonId: exam.lessonId },
          });
          if (examsQuery) {
            const { exams } = examsQuery;
            const updatedExams = exams.filter(
              (examValue) => examValue._id !== exam._id
            );
            cache.writeQuery<ExamsQuery, ExamsQueryVariables>({
              query: ExamsDocument,
              variables: { lessonId: exam.lessonId },
              data: { exams: updatedExams },
            });
          }
        }
      },
    });
  };
  return (
    <DialogWrapper title="Sınav" setOpen={setOpen} maxWidth="xs">
      <div>
        <Typography variant="body2" component="span">
          Tarih :
        </Typography>{" "}
        <Typography component="span" variant="body1">
          {new Date(exam.date).toLocaleDateString()}
        </Typography>
      </div>
      <Typography variant="body2" component="span">
        Ders saati :
      </Typography>{" "}
      <Typography component="span" variant="body1">
        {exam.lessonHourCode.join(", ")}{" "}
      </Typography>
      <Typography variant="body1">
        Bu sınavı silmek istediğinize emin misiniz?
      </Typography>
      <DialogActions>
        <Button color="primary" variant="contained" onClick={handleDelete}>
          EVET
        </Button>
        <Button onClick={setOpen}>HAYIR</Button>
      </DialogActions>
    </DialogWrapper>
  );
}
