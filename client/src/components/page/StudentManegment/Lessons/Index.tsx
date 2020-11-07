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
  Menu,
  MenuItem,
  Tooltip,
} from "@material-ui/core/";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  Announcement as AnnouncementIcon,
  MoreVert as MoreVertIcon,
} from "@material-ui/icons";

import { useMyLessonsStudentQuery } from "../../../../generated/graphql";
import Context from "../../../Context";
import ExamPage from "./Exam/Index";
import LessonMessages from "./LessonMessages";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
      position: "relative",
      [theme.breakpoints.down("sm")]: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
      },
    },
    lessonAction: {
      display: "flex",
      alignSelf: "flex-end",
    },
    lessonText: {
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
      width: "auto",
      maxWidth: "300px",
      [theme.breakpoints.down("sm")]: { width: "100%" },
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
  })
);
export function Index() {
  const classes = useStyles();
  const { url } = useRouteMatch();
  const { studentIndex } = React.useContext(Context);
  const { data } = useMyLessonsStudentQuery({
    variables: { parentStudentId: studentIndex },
  });
  const [lessonId, setLessonId] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
  const handleClick = (lessonID: string) => (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget);
    setLessonId(lessonID);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container justify="flex-start" spacing={3} direction="column">
        <List className={classes.lessonList}>
          {data &&
            data.studentMyLessons.map((lesson) => (
              <ListItem className={classes.lessonItem} key={lesson._id}>
                <ListItemText
                  primary={lesson.lessonName || lesson.name}
                  secondary={`${lesson.lessonWeeklySchedules.length} ders saati`}
                  className={classes.lessonText}
                />
                <div className={classes.lessonAction}>
                  <Tooltip title="Ders bilgilendirme">
                    <IconButton
                      to={pather.join(url, lesson._id, "information")}
                      component={RouterLink}
                    >
                      <AnnouncementIcon />
                    </IconButton>
                  </Tooltip>
                  <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={handleClick(lesson._id)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </div>
              </ListItem>
            ))}
        </List>
      </Grid>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem>
          <Link to={pather.join(url, lessonId, "exam")} component={RouterLink}>
            Sınavlar
          </Link>
        </MenuItem>
      </Menu>
    </Container>
  );
}
export default function Lessons() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path}>
        <Index />
      </Route>
      <Route path={pather.join(path, ":lessonId", "information", ":targetId")}>
        <LessonMessages />
      </Route>
      <Route path={pather.join(path, ":lessonId", "information")}>
        <LessonMessages />
      </Route>
      <Route path={pather.join(path, ":lessonId", "exam", ":examId")}>
        <ExamPage />
      </Route>
      <Route path={pather.join(path, ":lessonId", "exam")}>
        <ExamPage />
      </Route>
    </Switch>
  );
}
