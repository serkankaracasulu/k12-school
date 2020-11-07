import { DateTime } from "luxon";
import * as React from "react";
import { useParams } from "react-router-dom";

import {
  Container,
  Grow,
  LinearProgress,
  List,
  ListItemText,
  ListSubheader,
  Typography,
} from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { ExpandMore } from "@material-ui/icons/";

import {
  LessonMessageType,
  Role,
  useGetLessonQuery,
  useLessonMesagesQuery,
} from "../../../../generated/graphql";
import getUserToken from "../../../../helper/getUserToken";
import Context from "../../../Context";
import SendMessage from "../../teacherManegment/Lessons/SendLessonMessage";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    "@keyframes back": {
      from: { backgroundColor: theme.palette.action.selected },
      to: { backgroundColor: "inherit" },
    },
    root: {
      marginTop: theme.spacing(3),
      [theme.breakpoints.down("sm")]: {
        marginTop: theme.spacing(1),
        padding: 0,
      },
      height: `calc(100vh - ${
        theme.mixins.toolbar.minHeight
      }px - ${theme.spacing(5)}px)`,
      overflow: "hidden",
      [theme.breakpoints.down("sm")]: {
        height: `calc(100vh - 2 * ${
          theme.mixins.toolbar.minHeight
        }px - ${theme.spacing(5)}px)`,
      },
    },
    container: {
      height: `calc(100% - ${theme.mixins.toolbar.minHeight}px)`,
      display: "flex",
      flexDirection: "column",
    },
    listroot: {
      width: "100%",
      backgroundColor: theme.palette.background.paper,
      overflowY: "auto",
    },
    inline: {
      display: "inline",
    },
    target: {
      animationName: "$back",
      animationDuration: "0.5s",
      animationTimingFunction: "linear",
      animationIterationCount: 4,
    },
    time: {
      marginLeft: theme.spacing(1),
      "&::before": {
        content: "'•'",
        marginRight: theme.spacing(1),
      },
    },
    header: {
      display: "flex",
      alignItems: "center",
      "&::before": {
        content: "''",
        marginRight: theme.spacing(2),
        borderTop: " 1px solid rgba(0,0,0,.25)",
        flexGrow: 1,
        display: "block",
      },
      "&::after": {
        content: "''",
        marginLeft: theme.spacing(2),
        borderTop: " 1px solid rgba(0,0,0,.25)",
        flexGrow: 1,
        display: "block",
      },
    },
    subHeader: {
      paddingTop: theme.spacing(1),
    },
    form: {
      bottom: 0,
      left: 0,
      backgroundColor: "white",
    },
  })
);
const messageTypeTr: { [K in LessonMessageType]: string } = {
  announcement: "Duyuru",
  homework: "Ödev",
};

type ParamType = {
  lessonId: string;
  targetId: string;
};

export default function () {
  const { lessonId, targetId } = useParams<ParamType>();
  const { studentIndex } = React.useContext(Context);
  const { data: dataLesson } = useGetLessonQuery({
    variables: { lessonId },
  });
  const user = getUserToken();
  const classes = useStyles();
  const { data, loading, fetchMore } = useLessonMesagesQuery({
    variables: { lessonId, parentStudentId: studentIndex },
    fetchPolicy: "cache-and-network",
    onError: () => {},
  });
  const handleFetchMore = () => {
    fetchMore<any>({
      variables: { lessonId, skip: data ? data.lessonMessages.length : 0 },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          lessonMessages: [
            ...prev.lessonMessages,
            ...fetchMoreResult.lessonMessages,
          ],
        };
      },
    });
  };
  return (
    <Container maxWidth="md" className={classes.root}>
      <Typography
        gutterBottom
        variant="h5"
        color="textSecondary"
        component="p"
        style={{ width: "100%", marginLeft: "16px" }}
      >
        Ders Bilgilendirme
      </Typography>
      <div className={classes.container}>
        <List
          className={classes.listroot}
          subheader={
            dataLesson &&
            dataLesson.getLesson && (
              <ListSubheader className={classes.subHeader}>
                <Typography variant="body1" color="textPrimary">
                  {dataLesson.getLesson.lessonName || dataLesson.getLesson.name}
                </Typography>
                {dataLesson.getLesson.teacher && (
                  <Typography variant="body2">
                    {dataLesson.getLesson.teacher.fullName}
                  </Typography>
                )}
              </ListSubheader>
            )
          }
        >
          {loading && (
            <ListItem>
              <ListItemText>
                <LinearProgress />
              </ListItemText>
            </ListItem>
          )}
          <ListItem
            button
            style={{ justifyContent: "center" }}
            onClick={handleFetchMore}
          >
            <ExpandMore />
          </ListItem>
          {data &&
            data.lessonMessages.map((message) => {
              const messageItem = (
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="h6">{message.title}</Typography>
                    }
                    secondary={
                      <Typography color="textPrimary" variant="body2">
                        {message.message}
                      </Typography>
                    }
                  />
                </ListItem>
              );
              return (
                <React.Fragment key={message._id}>
                  <Typography
                    align="center"
                    className={classes.header}
                    color="textSecondary"
                    component="li"
                  >
                    {messageTypeTr[message.messageType]}
                    <Typography
                      component="time"
                      dateTime={message.sent}
                      className={classes.time}
                      variant="body2"
                    >
                      {DateTime.fromISO(message.sent).toLocaleString({
                        weekday: "short",
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </Typography>
                  {targetId === message._id ? (
                    <Grow in={true} timeout={1000}>
                      {messageItem}
                    </Grow>
                  ) : (
                    messageItem
                  )}
                </React.Fragment>
              );
            })}
        </List>
        {user && user.roles.includes(Role.Teacher) && (
          <div className={classes.form}>
            <SendMessage lessonId={lessonId} />
          </div>
        )}
      </div>
    </Container>
  );
}
