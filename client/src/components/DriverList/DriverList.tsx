import pather from "path";
import * as React from "react";
import { Link as RouterLink } from "react-router-dom";

import { useQuery } from "@apollo/client";
import {
  IconButton,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Delete as DeleteIcon, MoreVert } from "@material-ui/icons";

import {
  DriversDocument,
  DriversWithAppDocument,
  DriversWithAppQuery,
  DriversWithAppQueryVariables,
} from "../../generated/graphql";
import getUserToken from "../../helper/getUserToken";
import Context from "../Context";
import { Role } from "../myTypes";
import UserProfileAvatar from "../page/dashboard/UserAvatar";
import SendMessageButton from "../SendMessageButton";
import Dismiss from "./Dismiss/Index";
import DriverStudentButton from "./DriverStudentButton/Index";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    list: {
      display: "flex",
      flexWrap: "wrap",
      "& li": {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
      },
    },
    listItem: {
      border: "1px solid rgba(224, 224, 224, 1)",
      borderRadius: "4px",
      width: "300px",
      height: "90px",
      padding: theme.spacing(2),
    },
    subHeader: {
      width: "100%!important",
    },

    avatar: {
      borderRadius: "4px",
    },
    iconTop: {
      position: "absolute",
      top: 0,
      right: 0,
    },
    iconBottom: {
      position: "absolute",
      bottom: 0,
      right: 0,
    },
  })
);
type PropsType = {
  studentId?: string;
  title: string;
};
type LocalUser = DriversWithAppQuery["drivers"][0];
export default function DriverList({ studentId, title }: PropsType) {
  const classes = useStyles();
  const { data } = useQuery<DriversWithAppQuery, DriversWithAppQueryVariables>(
    studentId ? DriversWithAppDocument : DriversDocument,
    {
      variables: { parentStudentId: studentId || "" },
    }
  );
  const { studentIndex } = React.useContext(Context);
  const [driver, setDriver] = React.useState<LocalUser | void>();
  const [openDismiss, setOpenDismiss] = React.useState(false);
  const user = getUserToken();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (selectedDriver: LocalUser) => (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorEl(event.currentTarget);
    setDriver(selectedDriver);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setOpenDismiss(false);
  };
  const handleOpen = () => {
    setOpenDismiss(true);
    setAnchorEl(null);
  };
  if (!user) return <span />;
  return (
    <div className={classes.root}>
      <List
        className={classes.list}
        subheader={
          <ListSubheader className={classes.subHeader}>{title}</ListSubheader>
        }
      >
        {data &&
          data.drivers.map((driver) => (
            <ListItem key={driver._id} className={classes.listItem}>
              <ListItemAvatar>
                <UserProfileAvatar personId={driver._id} size="small" />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Link
                    component={RouterLink}
                    to={pather.join("/user", driver._id)}
                  >
                    {driver.fullName}
                  </Link>
                }
                secondary={
                  studentIndex &&
                  user.roles.includes(Role.parent) && (
                    <DriverStudentButton
                      applicaiton={driver.driver?.requestApp}
                      driverId={driver._id}
                      studentId={studentIndex}
                    />
                  )
                }
              />
              {user.roles.includes(Role.owner || Role.admin) && (
                <>
                  <IconButton
                    onClick={handleClick(driver)}
                    className={classes.iconTop}
                  >
                    <MoreVert />
                  </IconButton>
                  <div className={classes.iconBottom}>
                    <SendMessageButton to={driver._id} />
                  </div>
                </>
              )}
            </ListItem>
          ))}
      </List>
      {user.roles.includes(Role.owner || Role.admin) && (
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleOpen}>
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText>Kurumdan çıkart</ListItemText>
          </MenuItem>
        </Menu>
      )}
      {driver && openDismiss && (
        <Dismiss driver={driver} setOpen={handleClose} />
      )}
    </div>
  );
}
