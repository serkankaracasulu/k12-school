import * as React from "react";
import { useParams } from "react-router-dom";

import {
  Avatar,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListSubheader,
  Tooltip,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import StudentAddIcon from "@material-ui/icons/PersonAddRounded";

import StudentList from "../../../Students/StudentsList";
import TransferStundets from "../../StudentTransfer/Index";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      display: "flex",
      flexWrap: "wrap",
      "& li": {
        margin: theme.spacing(1),
      },
    },
    listItem: {
      border: "1px solid rgba(224, 224, 224, 1)",
      borderRadius: "4px",
      width: "265px",
      height: "80px",
      padding: theme.spacing(2),
    },
    listItemAdd: {
      padding: theme.spacing(1),
    },
    subHeader: {
      width: "100%!important",
    },
    container: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      position: "relative",
    },
    avatar: {
      borderRadius: "4px",
    },
    avatarAdd: {
      border: "1px solid rgba(224, 224, 224, 1)",
      borderRadius: "4px",
      padding: theme.spacing(1),
      "& div": {
        backgroundColor: theme.palette.primary.main,
      },
    },
    menu: {
      position: "absolute",
      top: 0,
      right: 0,
    },
  })
);

type ParamType = {
  schoolId: string;
  classId: string;
};

export default function StudentsClass() {
  const classes = useStyles();
  const { schoolId, classId } = useParams<ParamType>();
  const [openTransferStudents, setOpenTransferStudents] = React.useState(false);
  return (
    <Container maxWidth="lg" className={classes.container}>
      <List
        className={classes.list}
        subheader={
          <ListSubheader className={classes.subHeader}>
            Öğrenciler
          </ListSubheader>
        }
      >
        <ListItem className={classes.listItemAdd}>
          <ListItemAvatar className={classes.avatarAdd}>
            <Avatar className={classes.avatar}>
              <Tooltip title="Öğrenci aktar">
                <IconButton
                  color="secondary"
                  onClick={() => setOpenTransferStudents(true)}
                >
                  <StudentAddIcon />
                </IconButton>
              </Tooltip>
            </Avatar>
          </ListItemAvatar>
        </ListItem>
        <StudentList schoolId={schoolId} classId={classId} />
      </List>
      {openTransferStudents && (
        <TransferStundets setOpen={() => setOpenTransferStudents(false)} />
      )}
    </Container>
  );
}
