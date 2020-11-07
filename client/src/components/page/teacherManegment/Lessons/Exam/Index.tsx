import * as React from "react";
import { useParams } from "react-router-dom";

import {
  Button,
  Container,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core/";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import DoneIcon from "@material-ui/icons/Done";
import EditIcon from "@material-ui/icons/Edit";

import {
  ExamFragment,
  ExamsDocument,
  ExamsQuery,
  ExamsQueryVariables,
  GradeFragment,
  HourFragment,
  LessonFragment,
  SetExamGradeMutationVariables,
  StudentFragment,
  TermFragment,
  useExamsQuery,
  useMyLessonsQuery,
  useSetExamGradeMutation,
  useStudentsQuery,
} from "../../../../../generated/graphql";
import {
  generateError,
  generateSuccess,
} from "../../../../../helper/generateMessage";
import TeacherContext from "../../../../Context";
import StudentAvatar from "../../../dashboard/StudentAvatar";
import Detail from "./Detail";
import messageBox from "./messageBoxExamGrade";
import SendExam from "./Send";
import { HeaderType } from "./type";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
      position: "relative",
    },
    border: {
      border: "1px solid rgba(224, 224, 224, 1)",
    },
    divider: {
      padding: 0,
    },
    flexBox: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    name: {
      marginLeft: theme.spacing(1),
    },
    sticky: {
      top: theme.mixins.toolbar.minHeight,
    },
  })
);

type ParamType = {
  lessonId: string;
  classId: string;
  schoolId: string;
};

export default function ExamList() {
  const classes = useStyles();
  const { schoolId, lessonId, classId } = useParams<ParamType>();
  const [open, setOpen] = React.useState(false);
  const { setPr } = React.useContext(TeacherContext);
  const gradeRef = React.useRef<HTMLInputElement | null>(null);
  const [detail, setDetail] = React.useState<ExamFragment | void>();
  const [termHeader, setTermHeader] = React.useState<HeaderType[]>([]);
  const [terms, setTerms] = React.useState<TermFragment[]>([]);
  const [
    examGrade,
    setExamGrade,
  ] = React.useState<SetExamGradeMutationVariables | void>();
  const [hours, setHours] = React.useState<HourFragment[]>([]);
  const [lesson, setLesson] = React.useState<LessonFragment | void>();
  const [setExamGradeMutate] = useSetExamGradeMutation({
    onCompleted: () => {
      generateSuccess(setPr, messageBox);
    },
    onError: (cError) => generateError(cError, setPr, messageBox),
  });
  const { data: dataStudents } = useStudentsQuery({
    variables: { schoolId, classId },
  });
  useMyLessonsQuery({
    onCompleted: (tData) => {
      const school = tData.schools.find(
        (schoolValue) => schoolValue._id === schoolId
      );
      if (school) {
        const [educationYear] = school.educationYears;
        const hoursValue = school.weeklyHour?.hour;
        if (educationYear) {
          setTerms(educationYear.terms);
        }
        if (hoursValue) setHours(hoursValue);
        const cl = school.classes.find(
          (classValue) => classValue._id === classId
        );
        if (cl) {
          const lessonItem = cl.lessons?.find(
            (lessonValue) => lessonValue._id === lessonId
          );
          if (lessonItem) setLesson(lessonItem);
        }
      }
    },
  });
  const { data, refetch } = useExamsQuery({
    variables: { lessonId },
  });

  React.useEffect(() => {
    if (data && terms.length > 0) {
      const termHeader: HeaderType[] = [];
      if (data) {
        let count = 0;
        let prevTermId = "";
        data.exams.forEach((exam) => {
          if (prevTermId !== exam.termId) {
            prevTermId = exam.termId;
            count = data.exams.filter(
              (examValue) => examValue.termId === prevTermId
            ).length;
            const term = terms.find(
              (termValue) => termValue._id === prevTermId
            );
            termHeader.push({
              name: term?.name || "",
              count,
            });
          }
        });
      }
      setTermHeader(termHeader);
    }
  }, [terms, data]);

  const handleSetExamGrade = () => {
    if (gradeRef && examGrade && gradeRef.current) {
      const grade = gradeRef.current.valueAsNumber;
      if (grade !== examGrade.grade)
        setExamGradeMutate({
          variables: { ...examGrade, grade },
          update: (cache, result) => {
            if (data && result && result.data) {
              const { setExamGrade } = result.data;
              const exams = data.exams.map((examValue) => {
                if (examValue._id === examGrade.examId) {
                  const editGrades = new Set<GradeFragment>([
                    setExamGrade,
                    ...examValue.grades,
                  ]);
                  const grades: GradeFragment[] = [...editGrades];
                  return { ...examValue, grades };
                } else return examValue;
              });
              cache.writeQuery<ExamsQuery, ExamsQueryVariables>({
                query: ExamsDocument,
                variables: { lessonId },
                data: { exams },
              });
            }
          },
          optimisticResponse: {
            setExamGrade: {
              _id: Math.round(Math.random() * -20000).toString(),
              grade,
              studentId: examGrade.studentId,
              __typename: "Grade",
            },
          },
        });
    }
    setExamGrade();
  };

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Button onClick={() => setOpen(true)}>Ekle</Button>

      {data && (
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {termHeader.map((headerValue) => (
                <TableCell
                  key={headerValue.name}
                  colSpan={headerValue.count}
                  className={classes.border}
                >
                  {headerValue.name}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              {data.exams.map((examValue, index) => (
                <TableCell key={examValue._id} className={classes.sticky}>
                  <Button onClick={() => setDetail(examValue)}>
                    {index + 1}. Sınav
                  </Button>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dataStudents &&
              dataStudents.students.map((student) => (
                <React.Fragment key={student._id}>
                  <TableRow>
                    <TableCell
                      component="th"
                      scope="row"
                      colSpan={data.exams.length}
                    >
                      <div className={classes.flexBox}>
                        <StudentAvatar studentId={student._id} size="small" />
                        <span className={classes.name}>{student.fullName}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    {data.exams.map((examValue) => (
                      <TableCell key={examValue._id}>
                        {examGrade &&
                        examGrade.examId === examValue._id &&
                        examGrade.studentId === student._id ? (
                          <>
                            <TextField inputRef={gradeRef} type="number" />
                            <IconButton
                              size="small"
                              onClick={() => setExamGrade()}
                            >
                              <CancelIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={handleSetExamGrade}
                            >
                              <DoneIcon />
                            </IconButton>
                          </>
                        ) : (
                          <StudentGrade
                            student={student}
                            exam={examValue}
                            set={setExamGrade}
                          />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={data.exams.length}
                      className={classes.divider}
                    >
                      <Divider />
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
          </TableBody>
        </Table>
      )}
      {open && lesson && (
        <SendExam
          setOpen={() => setOpen(false)}
          terms={terms}
          hours={hours}
          lesson={lesson}
          refetch={refetch}
        />
      )}
      {detail && lesson && (
        <Detail
          setOpen={() => setDetail()}
          exam={detail}
          terms={terms}
          hours={hours}
          lesson={lesson}
          refetch={refetch}
        />
      )}
    </Container>
  );
}
const getStudentGrade = (studentId: string, grades: GradeFragment[]) => {
  const grade = grades.find((gradeValue) => gradeValue.studentId === studentId);
  if (grade) return grade.grade;
};
type PropsGrade = {
  student: StudentFragment;
  exam: ExamFragment;
  set: React.Dispatch<
    React.SetStateAction<void | SetExamGradeMutationVariables | undefined>
  >;
};

function StudentGrade(props: PropsGrade) {
  const { student, exam, set } = props;
  const grade = getStudentGrade(student._id, exam.grades);

  return (
    <>
      {grade}
      {new Date(exam.date).valueOf() < Date.now() && (
        <IconButton
          size="small"
          onClick={() =>
            set({
              examId: exam._id,
              studentId: student._id,
              grade: grade || 0,
              lessonId: exam.lessonId,
            })
          }
        >
          <EditIcon />
        </IconButton>
      )}
    </>
  );
}
