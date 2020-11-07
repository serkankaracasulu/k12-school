import * as React from "react";

import { Typography } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { InfoBox } from "@react-google-maps/api";

type PropsType = {
  leg: google.maps.DirectionsLeg;
};

const useStyles = makeStyles((theme: Theme) => ({
  infoBox: {
    backgroundColor: "white",
    padding: theme.spacing(0.5),
    borderRadius: 4,
    borderColor: theme.palette.grey[300],
    borderWidth: 0.5,
    borderStyle: "solid",
  },
}));

export default function DirectionRoadInfo({ leg }: PropsType) {
  const classes = useStyles();
  const halfDistance = leg.distance.value / 2;
  let totalDistance = 0;
  let stepIndex = 0;
  while (totalDistance < halfDistance && stepIndex < leg.steps.length) {
    stepIndex++;
    totalDistance += leg.steps[stepIndex].distance.value;
  }
  return (
    <InfoBox position={leg.steps[stepIndex]?.start_location}>
      <div className={classes.infoBox}>
        <Typography variant="subtitle2" component="p" noWrap>
          {leg.duration.text}
        </Typography>
        <Typography variant="caption">{leg.distance.text}</Typography>
      </div>
    </InfoBox>
  );
}
