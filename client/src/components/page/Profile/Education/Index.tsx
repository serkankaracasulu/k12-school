import { DateTime } from "luxon";
import * as React from "react";

import {
  Avatar,
  Container,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Paper,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  Add as AddIcon,
  Delete as RemoveIcon,
  Edit as EditIcon,
} from "@material-ui/icons";

import { useEducationsQuery } from "../../../../generated/graphql";
import AddEducation from "./Add";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
      position: "relative",
      [theme.breakpoints.down("sm")]: {
        paddingRight: 0,
        paddingLeft: 0,
      },
    },
    paper: {
      padding: theme.spacing(2),
      position: "relative",
      [theme.breakpoints.down("sm")]: {
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
    fab: {
      position: "absolute",
      top: theme.spacing(2),
      right: theme.spacing(2),
      zIndex: theme.zIndex.drawer - 1,
      boxShadow: "none",
      borderRadius: "4px",
    },
    addIcon: {
      marginRight: theme.spacing(1),
    },
    department: {
      display: "inline",
      fontWeight: 500,
    },
    action: {
      display: "flex",
      flexDirection: "column",
    },
    item: {
      border: "1px solid rgba(224, 224, 224, 1)",
      borderRadius: "4px",
      padding: theme.spacing(2),
      marginBottom: theme.spacing(1),
      [theme.breakpoints.down("sm")]: {
        borderBottom: "1px solid rgba(224, 224, 224, 1)",
        borderTop: 0,
        borderLeft: 0,
        borderRight: 0,
        borderRadius: 0,
      },
    },
  })
);
export default function Education() {
  const classes = useStyles();
  const [openAdd, setAddOpen] = React.useState(false);
  const { data } = useEducationsQuery();
  const handleAdd = () => {
    setAddOpen(true);
  };
  return (
    <Container maxWidth="md" className={classes.container}>
      <Paper className={classes.paper}>
        <Fab
          color="primary"
          aria-label="edit contact"
          className={classes.fab}
          size="small"
          variant="extended"
          onClick={handleAdd}
        >
          <AddIcon className={classes.addIcon} />
          EĞİTİM EKLE
        </Fab>
        <List subheader={<ListSubheader>Eğitim</ListSubheader>}>
          {data &&
            data.educations.map((ed) => (
              <ListItem className={classes.item} key={ed._id}>
                <ListItemAvatar>
                  <Avatar>{ed.universityName?.substr(0, 1)}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={ed.universityName}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="textPrimary"
                      >
                        {ed.department && ed.department.name}
                      </Typography>
                      {`  ${DateTime.fromISO(
                        ed.startDate.toString()
                      ).toISODate()} - ${
                        ed.finishDate
                          ? DateTime.fromISO(
                              ed.finishDate.toString()
                            ).toISODate()
                          : ""
                      }`}
                    </>
                  }
                />
                <ListItemSecondaryAction className={classes.action}>
                  <IconButton edge="end" onClick={() => {}}>
                    <RemoveIcon />
                  </IconButton>
                  <IconButton edge="end">
                    <EditIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
        </List>
      </Paper>
      {openAdd && <AddEducation setOpen={() => setAddOpen(false)} />}
    </Container>
  );
}
