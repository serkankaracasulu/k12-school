import * as React from "react";
import { useHistory } from "react-router-dom";

import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import { makeStyles, Theme } from "@material-ui/core/styles";
import AccountCircle from "@material-ui/icons/AccountCircle";
import HomeIcon from "@material-ui/icons/Home";

import {
  Role,
  useActiveStudentQuery,
  useActiveUserQuery,
} from "../generated/graphql";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: "fixed",
    bottom: 0,
    zIndex: theme.zIndex.drawer + 1,
    width: "100%",
    borderTop: "1px solid rgba(224, 224, 224, 1)",
  },
}));

export default function MainBottomBar() {
  const { data } = useActiveUserQuery();
  const { data: dataStudent } = useActiveStudentQuery();
  const classes = useStyles();
  const history = useHistory();
  let pathNumber = 0;
  const [value, setValue] = React.useState(pathNumber);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: any) => {
    setValue(newValue);
    if (newValue === 0) {
      if (
        data &&
        data.activeUser &&
        data.activeUser.roles.some((r) => r === Role.Teacher)
      )
        history.push("/teacher");
      else if (
        data &&
        data.activeUser &&
        data.activeUser.roles.some((r) => r === Role.Owner || r === Role.Admin)
      )
        history.push("/myschools");
      else if (dataStudent && dataStudent.activeStudent)
        history.push("/student");
      pathNumber = 0;
    } else if (newValue === 1) {
      history.push("/profilesetting");
      pathNumber = 1;
    }
  };
  if ((data && data.activeUser) || (dataStudent && dataStudent.activeStudent))
    return (
      <BottomNavigation
        value={value}
        onChange={handleChange}
        showLabels
        className={classes.root}
      >
        <BottomNavigationAction label="Ana Sayfa" icon={<HomeIcon />} />
        <BottomNavigationAction label="Profil" icon={<AccountCircle />} />
      </BottomNavigation>
    );
  return <></>;
}
