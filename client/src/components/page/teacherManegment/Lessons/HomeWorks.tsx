import { DateTime } from "luxon";
import * as querystring from "querystring";
import * as React from "react";
import { useParams } from "react-router-dom";

import {
  Button,
  Container,
  IconButton,
  LinearProgress,
  List,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
} from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";
import { blue } from "@material-ui/core/colors";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import { makeStyles, Theme } from "@material-ui/core/styles";
import {
  Description as FileIcon,
  ExpandLess,
  ExpandMore,
} from "@material-ui/icons/";

import {
  useGetLessonQuery,
  useHomeWorksQuery,
} from "../../../../generated/graphql";

const useStyles = makeStyles((theme: Theme) => ({
  root: { marginTop: theme.spacing(3) },
  listroot: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
  target: { backgroundColor: blue[100] },
}));

type ParamType = {
  lessonId: string;
  homeworkId: string;
};

export default function () {
  const { lessonId, homeworkId } = useParams<ParamType>();
  const classes = useStyles();
  const [open, setOpen] = React.useState("");
  const { data, loading, fetchMore } = useHomeWorksQuery({
    variables: { lessonId },
    fetchPolicy: "cache-and-network",
  });
  const { data: dataLesson } = useGetLessonQuery({
    variables: { lessonId },
  });
  const handleClick = (id: string) => {
    setOpen(open === id ? "" : id);
  };
  const handleFetchMore = () => {
    fetchMore<any>({
      variables: { lessonId, skip: data ? data.homeWorks.length : 0 },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          homeWorks: [...prev.homeWorks, ...fetchMoreResult.homeWorks],
        };
      },
    });
  };
  return (
    <Container maxWidth="md" className={classes.root}>
      <List
        className={classes.listroot}
        subheader={
          dataLesson &&
          dataLesson.getLesson && (
            <ListSubheader>
              {dataLesson.getLesson.lessonName || dataLesson.getLesson.name}
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
        {data &&
          data.homeWorks.map((homeWork) => (
            <React.Fragment key={homeWork._id}>
              <List>
                <ListItem
                  button
                  onClick={() => handleClick(homeWork._id)}
                  className={
                    homeworkId === homeWork._id ? classes.target : undefined
                  }
                >
                  <ListItemText
                    primary={homeWork.title}
                    secondary={DateTime.fromISO(homeWork.sent).toISODate()}
                  />

                  {open === homeWork._id ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse
                  in={open === homeWork._id}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    <ListItem>
                      <ListItemText secondary={homeWork.message} />
                      {homeWork.file && (
                        <ListItemSecondaryAction>
                          <Button
                            target="_blank"
                            startIcon={<FileIcon />}
                            color="primary"
                            href={`${"http://localhost:4000"}/homework?${querystring.stringify(
                              {
                                lessonId: homeWork.lessonId,
                                homeWorkId: homeWork._id,
                                fileName: homeWork.file,
                                t: localStorage.getItem("token"),
                              }
                            )}`}
                          >
                            Ödev
                          </Button>
                        </ListItemSecondaryAction>
                      )}
                    </ListItem>
                  </List>
                </Collapse>
              </List>
              <Divider variant="middle" component="ul" />
            </React.Fragment>
          ))}
        <ListItem
          button
          style={{ justifyContent: "center" }}
          onClick={handleFetchMore}
        >
          <IconButton>
            <ExpandMore />
          </IconButton>
        </ListItem>
      </List>
    </Container>
  );
}
