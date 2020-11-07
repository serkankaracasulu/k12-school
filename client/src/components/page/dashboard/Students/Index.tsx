import * as React from "react";

import {
  Avatar,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListSubheader,
  Paper,
  Tooltip,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import StudentAddIcon from "@material-ui/icons/PersonAddRounded";

import { useSchoolsQuery } from "../../../../generated/graphql";
import StudentAdd from "./Add";
import InSchool from "./InSchool";
import SList from "./StudentsList";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      borderRadius: "4px",
      width: "60px",
      height: "60px",
    },
    listItemAdd: {
      padding: theme.spacing(1),
    },
    avatarAdd: {
      border: "1px solid rgba(224, 224, 224, 1)",
      borderRadius: "4px",
      padding: theme.spacing(1),
      "& div": {
        backgroundColor: "white",
      },
    },
    paper: {
      margin: theme.spacing(1),
    },
  })
);
export default function StudentPage() {
  const classes = useStyles();
  const [openAdd, setOpenAdd] = React.useState(false);
  const { data: schoolData } = useSchoolsQuery();
  return (
    <>
      <List>
        <>
          <ListItem className={classes.listItemAdd}>
            <ListItemAvatar className={classes.avatarAdd}>
              <Avatar className={classes.avatar}>
                <Tooltip title="Öğrenci ekle">
                  <IconButton color="primary" onClick={() => setOpenAdd(true)}>
                    <StudentAddIcon />
                  </IconButton>
                </Tooltip>
              </Avatar>
            </ListItemAvatar>
          </ListItem>
          <Grid direction="column" container xl={8}>
            {schoolData && (
              <>
                <Paper className={classes.paper}>
                  <List
                    subheader={<ListSubheader>Okul Atanmayanlar</ListSubheader>}
                  >
                    <Divider variant="middle" component="li" />
                    <SList />
                  </List>
                  <Divider />
                </Paper>
                {schoolData.schools.map((sc) => (
                  <InSchool school={sc} key={sc._id} />
                ))}
              </>
            )}
          </Grid>
        </>
      </List>
      {openAdd && <StudentAdd setOpen={() => setOpenAdd(false)} />}
    </>
  );
}
