import * as React from "react";

import { makeStyles, Theme } from "@material-ui/core/styles";
import { InfoBox, Marker } from "@react-google-maps/api";

import { StudentVoyegeInfoFragment } from "../../../generated/graphql";

type PropTypes = {
  studentInfo: StudentVoyegeInfoFragment;
  showInfoId: string;
  closeInfo(): void;
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

export default function StudentInfoMarker({
  studentInfo,
  showInfoId,
  closeInfo,
}: PropTypes) {
  const classes = useStyles();
  const [lat, lng] = studentInfo.student?.address?.location.coordinates || [
    0,
    0,
  ];
  if (lat === 0 && lng === 0) return <span />;
  return (
    <Marker
      label={`${studentInfo.student?.firstName
        .split(" ")
        .map((a) => a[0])
        .join(".")}.${studentInfo.student?.lastName[0]}`}
      position={new window.google.maps.LatLng(lat, lng)}
      onClick={closeInfo}
    >
      {showInfoId === studentInfo._id && (
        <InfoBox>
          <div className={classes.infoBox}>
            <p>{studentInfo.student?.fullName}</p>
          </div>
        </InfoBox>
      )}
    </Marker>
  );
}
