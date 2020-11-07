import * as pather from "path";
import * as React from "react";
import {
  Link as RouterLink,
  Route,
  Switch,
  useRouteMatch,
} from "react-router-dom";

import {
  Container,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  Tooltip,
} from "@material-ui/core/";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  Announcement as AnnouncementIcon,
  MoreVert as MoreVertIcon,
  Person as StudentIcon,
} from "@material-ui/icons";

import {
  LessonFragment,
  LessonMessageType,
  MyLessonsQuery,
  useMyLessonsQuery,
} from "../../../../generated/graphql";
import LessonInformation from "../../StudentManegment/Lessons/LessonMessages";
import Exams from "./Exam/Index";
import LessonMessageForm from "./SendLessonMessage";
import Students from "./Students/Index";

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
      alignSelf: "flex-end",
      alignItems: "center",
    },
    classAction: {
      display: "flex",
      alignSelf: "flex-start",
    },
    lessonText: {
      maxWidth: "250px",
      "& span": {
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
      width: "auto",
      maxWidth: "300px",
      [theme.breakpoints.down("sm")]: {
        width: "100%",
      },
    },
    lessonList: {
      display: "flex",
      flexWrap: "wrap",
      "& li": {
        margin: theme.spacing(1),
        flexDirection: "column",
      },
    },
    lessonSubHeader: {
      width: "100%",
    },
    classItem: {
      padding: 0,
      margin: "0!important",
    },

    lesssonAdd: {
      maxWidth: "fit-content",
    },
    menu: {
      padding: theme.spacing(1),
    },
    header: {
      width: "100%",
    },
    wrap: {
      flexWrap: "wrap",
    },
  })
);

export function Index() {
  const classes = useStyles();
  const { data } = useMyLessonsQuery({
    fetchPolicy: "cache-and-network",
  });
  const { url } = useRouteMatch();
  const [schoolId, setSchoolId] = React.useState("");
  const [classId, setClassId] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
  const [
    activeLesson,
    setActiveLesson,
  ] = React.useState<LessonFragment | void>();
  const [openSendLessonMessage, setOpenSendLessonMessage] = React.useState<
    | {
        title: string;
        lessonId: string;
        messageType: LessonMessageType;
      }
    | false
  >(false);
  const [openStudents, setOpenStudents] = React.useState<{
    schoolId: string;
    classData: MyLessonsQuery["schools"][0]["classes"][0];
  } | void>();
  const handleClick = (
    lesson: LessonFragment,
    schoolId: string,
    classId: string
  ) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setActiveLesson(lesson);
    setSchoolId(schoolId);
    setClassId(classId);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setActiveLesson();
    setSchoolId("");
    setClassId("");
  };
  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container justify="flex-start" spacing={3} direction="column">
        {data &&
          data.schools.map((school) => (
            <List
              key={school._id}
              subheader={<ListSubheader>{school.name}</ListSubheader>}
            >
              <ListItem className={classes.wrap}>
                {school.classes.map(
                  (cl) =>
                    cl.lessons &&
                    cl.lessons.length > 0 && (
                      <List
                        className={classes.header}
                        key={cl._id}
                        subheader={
                          <ListSubheader>
                            {cl.level} {cl.code} {cl.code1}
                          </ListSubheader>
                        }
                      >
                        <ListItem>
                          <List className={classes.lessonList}>
                            {cl.lessons &&
                              cl.lessons.map((lesson, index) => (
                                <React.Fragment key={lesson._id}>
                                  {index === 0 && (
                                    <ListItem className={classes.classItem}>
                                      <div className={classes.classAction}>
                                        <Tooltip title="Öğrenciler">
                                          <IconButton
                                            onClick={() =>
                                              setOpenStudents({
                                                schoolId: school._id,
                                                classData: cl,
                                              })
                                            }
                                          >
                                            <StudentIcon />
                                          </IconButton>
                                        </Tooltip>
                                      </div>
                                    </ListItem>
                                  )}
                                  <ListItem
                                    className={classes.lessonItem}
                                    key={lesson._id}
                                  >
                                    <ListItemText
                                      primary={lesson.lessonName || lesson.name}
                                      secondary={`${lesson.lessonWeeklySchedules.length} ders saati`}
                                      className={classes.lessonText}
                                    />
                                    <div className={classes.lessonAction}>
                                      <Link
                                        component={RouterLink}
                                        to={pather.join(
                                          url,
                                          lesson._id,
                                          "information"
                                        )}
                                      >
                                        <AnnouncementIcon />
                                      </Link>
                                      <IconButton
                                        aria-label="more"
                                        aria-controls="long-menu"
                                        aria-haspopup="true"
                                        onClick={handleClick(
                                          lesson,
                                          school._id,
                                          cl._id
                                        )}
                                      >
                                        <MoreVertIcon />
                                      </IconButton>
                                    </div>
                                  </ListItem>
                                </React.Fragment>
                              ))}
                          </List>
                        </ListItem>
                      </List>
                    )
                )}
              </ListItem>
            </List>
          ))}
      </Grid>
      {activeLesson && (
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem>
            <Link
              to={pather.join(url, activeLesson._id, "exam", schoolId, classId)}
              component={RouterLink}
            >
              Sınavlar
            </Link>
          </MenuItem>
        </Menu>
      )}
      {openStudents && (
        <Students {...openStudents} setOpen={() => setOpenStudents()} />
      )}
      {openSendLessonMessage && (
        <LessonMessageForm
          setOpen={() => setOpenSendLessonMessage(false)}
          {...openSendLessonMessage}
        />
      )}
    </Container>
  );
}

export default function LessonsList() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path}>
        <Index />
      </Route>
      <Route path={pather.join(path, ":lessonId", "information")}>
        <LessonInformation />
      </Route>
      <Route
        path={pather.join(path, ":lessonId", "exam", ":schoolId", ":classId")}
      >
        <Exams />
      </Route>
    </Switch>
  );
}
