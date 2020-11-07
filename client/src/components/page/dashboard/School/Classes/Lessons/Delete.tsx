import * as React from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core/";

import {
  LessonsDocument,
  LessonsQuery,
  LessonsQueryVariables,
  useRemoveLessonMutation,
} from "../../../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
  generateValidateError,
} from "../../../../../../helper/generateMessage";
import validate from "../../../../../../helper/validate";
import SchoolContext from "../../../../../Context";
import messageBox from "./messageBox";
import { removeLessonSchema } from "./schema";

type PropsType = {
  schoolId: string;
  classId: string;
  educationYearId: string;
  lesson: LessonsQuery["lessons"][0];
  close(): void;
};
export default function (props: PropsType) {
  const { schoolId, classId, lesson, close, educationYearId } = props;
  const { setPr } = React.useContext(SchoolContext);
  const [removeLesson] = useRemoveLessonMutation({
    onCompleted: () => {
      generateSuccess(setPr, messageBox);
    },
    onError: (cError) => generateError(cError, setPr, messageBox),
  });
  const handleDeleteLesson = () => {
    const variables = { schoolId, classId, lessonId: lesson._id };
    const validateError = validate(variables, removeLessonSchema);
    if (validateError) {
      generateValidateError(setPr, validateError);
      return;
    }
    removeLesson({
      variables,
      update: (cache, result) => {
        if (result.data) {
          const { _id } = result.data.removeLesson;
          const lessonQuery = cache.readQuery<
            LessonsQuery,
            LessonsQueryVariables
          >({
            query: LessonsDocument,
            variables: { schoolId, classId, educationYearId },
          });
          if (lessonQuery) {
            const otherLesson = lessonQuery.lessons.filter(
              (le) => le._id !== _id
            );
            cache.writeQuery<LessonsQuery, LessonsQueryVariables>({
              query: LessonsDocument,
              variables: { schoolId, classId, educationYearId },
              data: { lessons: otherLesson },
            });
          }
        }
      },
    });
    close();
  };
  return (
    <div>
      <Dialog
        open={Boolean(lesson)}
        onClose={close}
        aria-labelledby="lesson-remove"
        aria-describedby="lesson-remove-yes-no"
      >
        <DialogTitle>{lesson.lessonName || lesson.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bu dersi silmek istediğinizden emin misiniz?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>Hayır</Button>
          <Button
            onClick={handleDeleteLesson}
            variant="contained"
            color="primary"
            autoFocus
          >
            Evet
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
