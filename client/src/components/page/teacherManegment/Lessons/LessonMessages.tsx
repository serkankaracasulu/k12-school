import * as React from "react";
import { useParams } from "react-router-dom";

import {
  Container,
  IconButton,
  LinearProgress,
  List,
  ListItemText,
} from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { ExpandLess, ExpandMore } from "@material-ui/icons/";

import { useLessonMesagesQuery } from "../../../../generated/graphql";

const useStyles = makeStyles((theme: Theme) => ({
  root: { marginTop: theme.spacing(3) },
  listroot: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
}));

type ParamType = {
  lessonId: string;
};

export default function () {
  const { lessonId } = useParams<ParamType>();
  const classes = useStyles();
  const [open, setOpen] = React.useState("");
  const { data, loading, fetchMore } = useLessonMesagesQuery({
    variables: { lessonId },
    fetchPolicy: "cache-and-network",
  });
  const handleClick = (id: string) => {
    setOpen(open === id ? "" : id);
  };
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
      <List className={classes.listroot}>
        {loading && (
          <ListItem>
            <ListItemText>
              <LinearProgress />
            </ListItemText>
          </ListItem>
        )}
        {data &&
          data.lessonMessages.map((message) => (
            <React.Fragment key={message._id}>
              <List>
                <ListItem button onClick={() => handleClick(message._id)}>
                  <ListItemText
                    primary={
                      <>
                        {message.title}
                        <time dateTime={message.sent}></time>
                      </>
                    }
                  />
                  {open === message._id ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse
                  in={open === message._id}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    <ListItem>
                      <ListItemText secondary={message.message} />
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
