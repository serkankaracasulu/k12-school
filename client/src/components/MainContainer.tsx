/* eslint-disable react/prop-types */
import clsx from "clsx";
import * as React from "react";

import { Divider, Drawer, IconButton, List } from "@material-ui/core/";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

import getUserToken from "../helper/getUserToken";
import Context from "./Context";
import MainAppBar from "./MainAppBar";
import { SnackBarProp } from "./myTypes";
import MessageMenu from "./page/Message/MessageFixed";
import SnackBar from "./SnackBar";

const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    toolbarIcon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0 8px",
      ...theme.mixins.toolbar,
    },
    appBarSpacer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      height: "100vh",
      overflow: "auto",
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: "hidden",
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9) + 1,
      },
    },
    drawer: {
      flexShrink: 0,
      whiteSpace: "nowrap",
    },
  })
);
type PropsType = {
  ListItems(): JSX.Element;
};
const Dashboard: React.FC<PropsType> = (props) => {
  const { ListItems, children } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [studentIndex, setStudentIndex] = React.useState<string | undefined>();
  const toState = React.useState<string>("");
  const [snackBarProp, setSnackBarProp] = React.useState<SnackBarProp>({
    variant: "error",
    message: "",
    open: false,
  });
  const user = getUserToken();
  const handleDrawerClose = () => {
    setOpen(false);
  };

  if (user)
    return (
      <div className={classes.root}>
        <Context.Provider
          value={{
            setPr: setSnackBarProp,
            studentIndex,
            setStudentIndex,
            toState,
          }}
        >
          <MainAppBar open={open} setOpen={() => setOpen(true)} />
          <Drawer
            variant="permanent"
            className={clsx(classes.drawer, {
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            })}
            classes={{
              paper: clsx({
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
              }),
            }}
          >
            <div className={classes.toolbarIcon}>
              <IconButton onClick={handleDrawerClose}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <Divider />
            <List>
              <ListItems />
            </List>
          </Drawer>
          {toState[0] && <MessageMenu />}
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            {children}
            <div className={classes.appBarSpacer} />
          </main>
        </Context.Provider>
        <SnackBar pr={snackBarProp} setPr={setSnackBarProp} />
      </div>
    );
  return <></>;
};
export default Dashboard;
