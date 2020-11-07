import pather from "path";
import * as React from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import {
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import HomeIcon from "@material-ui/icons/Home";
import LaunchIcon from "@material-ui/icons/Launch";
import StartIcon from "@material-ui/icons/PlayCircleFilledWhite";
import RemoveIcon from "@material-ui/icons/Remove";
import SchoolIcon from "@material-ui/icons/School";
import StopIcon from "@material-ui/icons/Stop";

import {
  VoyageFragment,
  VoyageTimeFragment,
} from "../../../../../generated/graphql";
import getUserToken from "../../../../../helper/getUserToken";
import days from "../../../../days";
import { isAuthenticationDriverforVoyage } from "../../Auth";
import RemovePage from "./Remove/Index";

type PropsType = {
  time: VoyageTimeFragment;
  voyage: VoyageFragment;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      marginRight: theme.spacing(2),
    },
  })
);

export default function VoyageTimeItem({ time, voyage }: PropsType) {
  const classes = useStyles();
  const token = getUserToken();
  const [openRemove, setOpenRemove] = React.useState(false);
  const { url } = useRouteMatch();
  const history = useHistory();
  const handleOpenDetail = () => {
    history.push(pather.join(url, voyage._id, time._id));
  };
  return (
    <>
      <ListItem>
        <ListItemAvatar className={classes.avatar}>
          {time.isTakeSchool ? (
            <>
              <SchoolIcon fontSize="small" />
              <ArrowRightIcon fontSize="small" />
              <HomeIcon fontSize="small" />
            </>
          ) : (
            <>
              <HomeIcon fontSize="small" />
              <ArrowRightIcon fontSize="small" />
              <SchoolIcon fontSize="small" />
            </>
          )}
        </ListItemAvatar>
        <ListItemText
          primary={days[time.day]}
          secondary={
            <>
              {time.hour}
              {time.isStart ? (
                <Tooltip title="Seferi başlamış">
                  <StartIcon />
                </Tooltip>
              ) : (
                <Tooltip title="Sefer bitmiş">
                  <StopIcon />
                </Tooltip>
              )}
            </>
          }
        />
        {isAuthenticationDriverforVoyage(voyage, token) && (
          <ListItemSecondaryAction>
            <Tooltip title="Sefer detayları">
              <IconButton onClick={handleOpenDetail}>
                <LaunchIcon />
              </IconButton>
            </Tooltip>
            <IconButton onClick={() => setOpenRemove(true)}>
              <RemoveIcon />
            </IconButton>
          </ListItemSecondaryAction>
        )}
      </ListItem>
      {openRemove && (
        <RemovePage
          variables={{ voyageId: voyage._id, timeId: time._id }}
          setOpen={() => setOpenRemove(false)}
        />
      )}
    </>
  );
}
