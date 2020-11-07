import * as React from "react";

import { Divider, List, ListSubheader, Paper } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import { SchoolFragment } from "../../../../generated/graphql";
import SList from "./StudentsList";

type PropsType = {
  school: SchoolFragment;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      margin: theme.spacing(1),
    },
  })
);

export default function InSchoolStudentList(props: PropsType) {
  const classes = useStyles();
  const { school } = props;
  return (
    <Paper className={classes.paper}>
      <List subheader={<ListSubheader>{school.name}</ListSubheader>}>
        <Divider variant="middle" component="li" />
        <SList schoolId={school._id} title="Sınıfa Atanmayanlar" />
        {school.classes.map((cl) => (
          <React.Fragment key={cl._id}>
            <SList
              classId={cl._id}
              schoolId={school._id}
              title={`${cl.level} ${cl.code || ""}`}
            />
          </React.Fragment>
        ))}
      </List>
      <Divider />
    </Paper>
  );
}
