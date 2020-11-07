import * as React from "react";
import {
  List,
  Grid,
  ListSubheader,
  ListItem,
  ListItemAvatar,
  Avatar,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import StudentAddIcon from "@material-ui/icons/PersonAddRounded";
import StudentTransfer from "../StudentTransfer/Index";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import InSchoolStudentList from "./../../Students/InSchool";
import { useSchoolQuery } from "../../../../../generated/graphql";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    subHeader: {
      width: "100%,",
    },
    listItemAdd: {
      padding: theme.spacing(1),
    },
    avatarAdd: {
      border: "1px solid rgba(224, 224, 224, 1)",
      borderRadius: "4px",
      padding: theme.spacing(1),
      "& div": {
        backgroundColor: theme.palette.primary.main,
      },
    },
    avatar: {
      borderRadius: "4px",
    },
  })
);

type ParamType = {
  schoolId: string;
};

export default function StudentPage() {
  const [openTransferStudents, setOpenTransferStudents] = React.useState(false);
  const classes = useStyles();
  const { schoolId } = useParams<ParamType>();

  const { data } = useSchoolQuery({
    variables: { id: schoolId },
  });
  return (
    <Grid direction="column" container xl={8}>
      {data && (
        <List
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
          <InSchoolStudentList school={data.school} />
        </List>
      )}
      {openTransferStudents && (
        <StudentTransfer setOpen={() => setOpenTransferStudents(false)} />
      )}
    </Grid>
  );
}
