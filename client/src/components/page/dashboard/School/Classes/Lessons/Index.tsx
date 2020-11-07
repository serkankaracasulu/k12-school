import clsx from "clsx";
import * as React from "react";
import { useParams } from "react-router-dom";

import {
  Badge,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  MenuItem,
  Paper,
  Select,
  Tooltip,
  Typography,
} from "@material-ui/core/";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  Add as AddIcon,
  Book as BookIcon,
  Delete as RemoveIcon,
  Edit as EditIcon,
} from "@material-ui/icons";

import {
  LessonInput,
  LessonsQuery,
  useClassQuery,
  useLessonsLazyQuery,
  useSchoolQuery,
} from "../../../../../../generated/graphql";
import ClassContex from "../ClassContex";
import AddLesson from "./Add";
import DeleteLesson from "./Delete";
import WeeklySchedule from "./WeeklySchedule/Index";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      overflowX: "auto",
    },
    container: {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
      position: "relative",
    },
    cell: {
      maxWidth: "1rem",
    },
    nonSelect: {
      WebkitTouchCallout: "none",
      WebkitUserSelect: "none",
      KhtmlUserSelect: "none",
      MozUserSelect: "none",
      msUserSelect: "none",
      userSelect: "none",
    },
    chips: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      "& > *": {
        margin: theme.spacing(0.5),
      },
    },
    lessonAction: {
      display: "flex",
      flexDirection: "column",
    },
    lessonText: {
      marginRight: theme.spacing(5),
      maxWidth: "250px",
      "& span": {
        whiteSpace: "nowrap",
        display: "inline-block",
        maxWidth: "250px",
        textOverflow: "ellipsis",
        overflow: "hidden",
      },
    },
    lessonItem: {
      border: "1px solid rgba(224, 224, 224, 1)",
      borderRadius: "4px",
      padding: theme.spacing(2),
      backgroundColor: theme.palette.background.paper,
    },
    lessonList: {
      display: "flex",
      flexWrap: "wrap",
      "& li": {
        margin: theme.spacing(1),
      },
    },
    lessonSubHeader: {
      width: "100%",
    },
    lesssonAdd: {
      maxWidth: "fit-content",
    },
    menu: {
      padding: theme.spacing(1),
    },
  })
);

type ParamType = {
  schoolId: string;
  classId: string;
};
export default function LessonsMain() {
  const { schoolId, classId } = useParams<ParamType>();
  const { setClassName } = React.useContext(ClassContex);
  const classes = useStyles();
  const [removedLesson, setRemovedLesson] = React.useState<
    LessonsQuery["lessons"][0]
  >();
  const [defaultEducationYear, setDefaultEducationYear] = React.useState<
    string
  >("");
  const { data } = useClassQuery({
    variables: { schoolId, classId },
    onCompleted: (tData) => {
      setClassName(tData.class.fullName);
    },
  });
  const [get, { data: lessonsData, loading }] = useLessonsLazyQuery();
  const schoolData = useSchoolQuery({
    variables: { id: schoolId },
  });
  React.useEffect(() => {
    if (
      schoolData.data &&
      schoolData.data.school &&
      schoolData.data.school.educationYears &&
      schoolData.data.school.educationYears.length > 0
    ) {
      const { educationYears } = schoolData.data.school;
      const [educationYear] = educationYears;
      if (educationYear) {
        setDefaultEducationYear(educationYear._id);
        get({
          variables: { schoolId, classId, educationYearId: educationYear._id },
        });
      }
    }
  }, [schoolData.data, classId, get, schoolId]);
  const handleChange = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => {
    if (typeof event.target.value === "string") {
      get({
        variables: { schoolId, classId, educationYearId: event.target.value },
      });
      setDefaultEducationYear(event.target.value);
    }
  };
  function selectedEducationYearUpToDate() {
    return (
      schoolData &&
      schoolData.data?.school &&
      schoolData.data.school.educationYears[0] &&
      schoolData.data.school.educationYears[0]._id === defaultEducationYear
    );
  }
  const [variables, setVariables] = React.useState<LessonInput>();
  const handleAddLesson = () => {
    defaultEducationYear && setVariables({ schoolId, classId, weeklyHour: 0 });
  };
  const handleEditLesson = (lesson: LessonsQuery["lessons"][0]) => {
    setVariables({
      schoolId,
      _id: lesson._id,
      classId,
      lessonId: lesson.lessonId || undefined,
      name: lesson.name || undefined,
      teacherId: lesson.teacherId || undefined,
      weeklyHour: lesson.weeklyHour,
    });
  };

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container justify="flex-start" spacing={3}>
        {variables && !variables._id && schoolData.data && data && (
          <AddLesson
            schoolKindId={schoolData.data.school.schoolKindId || ""}
            editLessonData={variables}
            level={data.class.level}
            close={() => setVariables(undefined)}
            educationYearId={defaultEducationYear}
          />
        )}
        {variables && variables._id && schoolData.data && data && (
          <AddLesson
            schoolKindId={schoolData.data.school.schoolKindId || ""}
            editLessonData={variables}
            level={data.class.level}
            close={() => setVariables(undefined)}
            educationYearId={defaultEducationYear}
          />
        )}
        <Grid container className={classes.menu} direction="column">
          {loading && <LinearProgress />}

          <Grid container justify="space-between">
            <Typography color="textSecondary">Dersler</Typography>
            {schoolData.data &&
              schoolData.data.school &&
              schoolData.data.school.educationYears.length > 0 && (
                <FormControl>
                  <InputLabel id="educationYears">Eğitim Dönemi</InputLabel>
                  <Select
                    labelId="educationYears"
                    value={defaultEducationYear}
                    onChange={handleChange}
                  >
                    {schoolData.data.school.educationYears.map((eduYear) => (
                      <MenuItem value={eduYear._id} key={eduYear._id}>
                        {eduYear.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
          </Grid>
        </Grid>

        <div className={clsx(classes.chips, classes.nonSelect)}>
          <List
            className={classes.lessonList}
            subheader={
              !defaultEducationYear ? (
                <ListSubheader>
                  {"Eğtim yılı ve saati ayarlanmadan ders eklenemez"}
                </ListSubheader>
              ) : undefined
            }
          >
            {defaultEducationYear && selectedEducationYearUpToDate() && (
              <ListItem
                className={clsx(classes.lessonItem, classes.lesssonAdd)}
              >
                <ListItemIcon>
                  <Tooltip title="Ders ekle">
                    <IconButton onClick={handleAddLesson}>
                      <AddIcon fontSize="large" color="primary" />
                    </IconButton>
                  </Tooltip>
                </ListItemIcon>
              </ListItem>
            )}
            {lessonsData &&
              lessonsData.lessons.map((le) => (
                <ListItem className={classes.lessonItem} key={le._id}>
                  <ListItemIcon>
                    <Badge
                      color="primary"
                      badgeContent={
                        le.weeklyHour - le.lessonWeeklySchedules.length
                      }
                    >
                      <BookIcon />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText
                    primary={le.lessonName || le.name}
                    secondary={
                      le.teacher
                        ? `${le.teacher.firstName} ${le.teacher.lastName}`
                        : "-"
                    }
                    className={classes.lessonText}
                  />
                  <ListItemSecondaryAction className={classes.lessonAction}>
                    <Tooltip title="Dersi sil">
                      <IconButton
                        edge="end"
                        onClick={() => setRemovedLesson(le)}
                      >
                        <RemoveIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Dersi düzenle">
                      <IconButton
                        edge="end"
                        onClick={() => handleEditLesson(le)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
          </List>
        </div>
        <Paper>
          {schoolData.data &&
            lessonsData &&
            schoolId &&
            classId &&
            schoolData.data.school.weeklyHour && (
              <WeeklySchedule
                schoolId={schoolId}
                classId={classId}
                lessons={lessonsData.lessons}
                hours={schoolData.data.school.weeklyHour}
              />
            )}
        </Paper>
      </Grid>
      {data && removedLesson && schoolId && (
        <DeleteLesson
          lesson={removedLesson}
          close={() => setRemovedLesson(undefined)}
          schoolId={schoolId}
          classId={data.class._id}
          educationYearId={defaultEducationYear}
        />
      )}
    </Container>
  );
}
