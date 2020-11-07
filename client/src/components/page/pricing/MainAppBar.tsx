import * as React from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";

import {
  AppBar,
  Box,
  Link,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import {
  useActiveStudentQuery,
  useActiveUserQuery,
} from "../../../generated/graphql";
import v from "../../../v.json";
import UserAvatar from "../../UserAvatar/UserAvatar";

const useStyles = makeStyles((theme) => ({
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: "wrap",
  },
  toolbarTitle: {
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      display: "block",
      marginLeft: 15,
    },
    textDecoration: "none",
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
}));

const MainAppBar = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { data } = useActiveUserQuery();
  const { data: dataStudent } = useActiveStudentQuery();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <>
      <AppBar
        position="fixed"
        color="default"
        elevation={0}
        className={classes.appBar}
      >
        <Toolbar className={classes.toolbar}>
          <Box flexGrow={1}>
            <Link to="/" component={RouterLink}>
              <Typography
                variant="h6"
                color="inherit"
                noWrap
                className={classes.toolbarTitle}
              >
                {v.name}
              </Typography>
            </Link>
          </Box>
          {!data && !dataStudent && (
            <>
              <Link
                variant="button"
                color="textPrimary"
                to="/signup"
                className={classes.link}
                component={RouterLink}
              >
                {t("bar.signUp")}
              </Link>
              <Button
                aria-controls="singIn-menu"
                aria-haspopup="true"
                onClick={handleClick}
              >
                {t("bar.signIn")}
              </Button>
            </>
          )}
          {(data || dataStudent) && !fullScreen && <UserAvatar />}
        </Toolbar>
      </AppBar>
      <Menu
        id="singIn-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          <Link
            variant="button"
            color="textPrimary"
            to="/signin"
            className={classes.link}
            component={RouterLink}
          >
            {t("bar.signIn")}
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link
            variant="button"
            color="textPrimary"
            to="/signinstudent"
            className={classes.link}
            component={RouterLink}
          >
            ÖĞRENCİ
          </Link>
        </MenuItem>
      </Menu>
    </>
  );
};
export default MainAppBar;
