import clsx from "clsx";
import * as React from "react";

import { AppBar, IconButton, Toolbar, useMediaQuery } from "@material-ui/core/";
import { makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import { Menu as MenuIcon } from "@material-ui/icons";

import { Role } from "../generated/graphql";
import getUserToken from "../helper/getUserToken";
import DriverJobInvitation from "./DriverJobInvitation";
import JobInvitation from "./JobInvitation";
import MainBottomBar from "./MainBottomBar";
import MessageIcon from "./MessageIcon";
import StudentNotification from "./page/StudentManegment/Notification";
import ParentRequestPage from "./ParentRequest/Index";
import TeacherApplication from "./TeacherApplicatonDropDown";
import UserAvatar from "./UserAvatar/UserAvatar";

const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) => ({
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  logo: {
    flexGrow: 1,
  },
}));
type PropsType = {
  open: boolean;
  setOpen(): void;
};
export default function MainAppBar(props: PropsType) {
  const { open, setOpen } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const user = getUserToken();
  const classes = useStyles();
  const handleDrawerOpen = () => {
    setOpen();
  };
  return (
    <nav>
      {fullScreen && <MainBottomBar />}
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <div className={classes.logo}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              className={clsx(
                classes.menuButton,
                open && classes.menuButtonHidden
              )}
            >
              <MenuIcon />
            </IconButton>
          </div>
          <MessageIcon />
          {user &&
            user.roles.length === 1 &&
            user.roles.includes(Role.User) && <JobInvitation />}
          {user && user.roles.includes(Role.Driver) && <DriverJobInvitation />}
          {user && <ParentRequestPage />}
          {user &&
            user.roles.some(
              (r) =>
                r === Role.SuperAdmin || r === Role.Admin || r === Role.Owner
            ) && <TeacherApplication />}
          {user && user.roles.includes(Role.Student) && <StudentNotification />}
          {!fullScreen && <UserAvatar />}
        </Toolbar>
      </AppBar>
    </nav>
  );
}
