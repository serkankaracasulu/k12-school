import clsx from "clsx";
import React from "react";
import { useParams } from "react-router-dom";

import { Container, Divider, Grid, Typography } from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import {
  useGetLessonQuery,
  useMyExamsQuery,
} from "../../../../../generated/graphql";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(3),
    },
    exam: {
      padding: theme.spacing(1),
    },
    border: {
      borderStyle: "solid",
      borderWidth: "1px",
      borderColor: "rgba(0, 0, 0, 0.12)",
    },
    container: {
      margin: theme.spacing(1),
    },
    target: { backgroundColor: blue[100] },
  })
);

type ParamType = {
  lessonId: string;
  examId: string;
};

export default function ExamList() {
  const { lessonId, examId } = useParams<ParamType>();
  const classes = useStyles();
  const { data } = useMyExamsQuery({
    variables: { lessonId },
    fetchPolicy: "cache-and-network",
  });
  const { data: dataLesson } = useGetLessonQuery({
    variables: { lessonId },
    onError: () => {},
  });
  const terms = data && [
    ...new Set<string>(data.myExams.map((examValue) => examValue.termId)),
  ];
  return (
    <Container maxWidth="md" className={classes.root}>
      <Typography gutterBottom variant="h5" color="textSecondary" component="p">
        Sınavlar
      </Typography>
      {dataLesson && (
        <Typography variant="h6" component="p" color="textSecondary">
          {dataLesson.getLesson.lessonName || dataLesson.getLesson.name}
        </Typography>
      )}
      {terms &&
        data &&
        terms.map((termValue) => (
          <Grid key={termValue}>
            <Typography align="center" color="textSecondary">
              {
                data.myExams.find((examValue) => examValue.termId === termValue)
                  ?.termName
              }
            </Typography>

            <Divider />
            <Grid container className={classes.container}>
              {data.myExams
                .filter((examValue) => examValue.termId === termValue)
                .map((examValue, index, arr) => (
                  <React.Fragment key={examValue._id}>
                    <Grid
                      className={clsx(
                        classes.exam,
                        examValue._id === examId ? classes.target : undefined
                      )}
                    >
                      <Typography variant="caption">
                        {index + 1} {".Sınav"}
                      </Typography>
                      <Typography variant="body2">
                        {new Date(examValue.date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2">
                        {examValue.lessonHourCode.join(", ")}
                        {". ders"}
                      </Typography>
                      <Typography
                        variant="body2"
                        align="center"
                        style={{ fontWeight: "bold" }}
                      >
                        {examValue.grades.map((gradeValue) => gradeValue.grade)}
                      </Typography>
                    </Grid>
                    {arr.length - 1 !== index && (
                      <Grid>
                        <Divider variant="middle" orientation="vertical" />
                      </Grid>
                    )}
                  </React.Fragment>
                ))}
            </Grid>
          </Grid>
        ))}
    </Container>
  );
}
