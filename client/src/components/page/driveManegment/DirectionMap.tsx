import { useCurrentPosition } from "google-map-hooks";
import { DateTime } from "luxon";
import * as React from "react";

import { FormControlLabel, Switch, Typography } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import {
  DirectionsRenderer,
  DirectionsService,
  GoogleMap,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";

import {
  usePositionNotificationSubscription,
  VoyageTimeFragment,
} from "../../../generated/graphql";
import ErrorPage from "../../ErrorPage";
import DirectionRoadInfo from "./DirectionRoadInfo";
import StudentInfoMarker from "./StudentInfoMarker";

type PropTypes = {
  schoolLocation: google.maps.LatLngLiteral;
  voyageTime: VoyageTimeFragment;
  institutionId: string;
};

const useStyles = makeStyles((theme: Theme) => ({
  switchDirection: {
    position: "absolute",
    bottom: theme.spacing(2),
    left: theme.spacing(0.5),
  },
}));

export default function DirectionMap({
  voyageTime,
  schoolLocation,
}: PropTypes) {
  const classes = useStyles();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDnBo9R9nd69wNMSl2iGyFRVypavjV79wg",
  });
  const [currentSubPosition, setCurrentSubPosition] = React.useState<
    google.maps.LatLng
  >();
  usePositionNotificationSubscription({
    onSubscriptionData: (tData) => {
      if (tData.subscriptionData.data) {
        const { positionNotification } = tData.subscriptionData.data;
        setCurrentSubPosition(
          new window.google.maps.LatLng(
            positionNotification.coords.point.coordinates[0],
            positionNotification.coords.point.coordinates[1]
          )
        );
      }
    },
  });
  //start ile start update edilir ilk konum, stop ile son konum eklenicekkonumlar kaydedilecek
  // driving mod ile render edilcek belki daha sonra bitiş saaatini belli bir süre geçince otomatik iptal edilcek
  const [startHour, starMinute] = voyageTime.hour.split(":");
  const [drirectionMod, setDirectionMod] = React.useState(false);
  const startDate = DateTime.local()
    .startOf("week")
    .plus({ day: voyageTime.day })
    .plus({ hours: +startHour, minutes: +starMinute });

  const { myLocation, loading, error } = useCurrentPosition();
  const [openStudentInfo, setOpenStudentInfo] = React.useState("");
  const [waypoints, setWaypoints] = React.useState<google.maps.LatLng[]>([]);
  const [lastStudentCord, setlastStudentCord] = React.useState<
    google.maps.LatLng
  >();
  const [directions, setDirections] = React.useState<
    google.maps.DirectionsResult
  >();
  React.useEffect(() => {
    if (window.google) {
      const wayPointLatLongList: google.maps.LatLng[] = [];
      for (const [index, studentInfo] of voyageTime.studentInfos.entries()) {
        const coordinates = studentInfo.student?.address?.location.coordinates;
        if (coordinates) {
          const coordinat = new window.google.maps.LatLng(
            coordinates[0],
            coordinates[1],
            true
          );
          if (index === voyageTime.studentInfos.length - 1)
            setlastStudentCord(coordinat);
          else wayPointLatLongList.push(coordinat);
        }
      }
      waypoints.length === 0 &&
        wayPointLatLongList.length > 0 &&
        setWaypoints(wayPointLatLongList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.google]);
  if (loadError) return <ErrorPage />;
  if (error) return <Typography>Lütfen konum takibini açınız.</Typography>;
  if (isLoaded && !loading && myLocation)
    return (
      <GoogleMap
        id="direction-map"
        mapContainerStyle={{
          height: "400px",
          maxWidth: "100vh",
        }}
        options={{ streetViewControl: false }}
        zoom={12}
        center={currentSubPosition || schoolLocation}
      >
        <FormControlLabel
          className={classes.switchDirection}
          control={
            <Switch
              checked={drirectionMod}
              onChange={() => setDirectionMod((p) => !p)}
              color="primary"
            />
          }
          label="Yön modu"
        />
        {drirectionMod && (
          <DirectionsService
            callback={(result, status) => {
              !directions &&
                status === window.google.maps.DirectionsStatus.OK &&
                setDirections(result);
            }}
            options={{
              waypoints: waypoints.map((w) => {
                return {
                  location: w,
                };
              }),
              drivingOptions: {
                departureTime:
                  startDate.toJSDate().valueOf() > Date.now()
                    ? startDate.toJSDate()
                    : new Date(Date.now()),
              },
              destination: voyageTime.isTakeSchool
                ? schoolLocation
                : lastStudentCord,
              origin: voyageTime.isTakeSchool
                ? lastStudentCord
                : schoolLocation,
              travelMode: window.google.maps.TravelMode.DRIVING,
              optimizeWaypoints: true,
            }}
          />
        )}

        {directions && drirectionMod && (
          <DirectionsRenderer
            options={{
              directions,
              hideRouteList: false,
            }}
          />
        )}
        {drirectionMod &&
          directions &&
          directions.routes[0]?.legs.map((leg, index) => (
            <DirectionRoadInfo leg={leg} key={index} />
          ))}
        <Marker
          position={schoolLocation}
          label="Okul"
          icon={{
            path:
              "M17,11V3H7v4H3v14h8v-4h2v4h8V11H17z M7,19H5v-2h2V19z M7,15H5v-2h2V15z M7,11H5V9h2V11z M11,15H9v-2h2V15z M11,11H9V9h2 V11z M11,7H9V5h2V7z M15,15h-2v-2h2V15z M15,11h-2V9h2V11z M15,7h-2V5h2V7z M19,19h-2v-2h2V19z M19,15h-2v-2h2V15z",
            fillColor: "#FF0000",
            fillOpacity: 0.6,
            anchor: new window.google.maps.Point(0, 0),
            strokeWeight: 0,
            scale: 1,
          }}
        />
        {!drirectionMod &&
          voyageTime.studentInfos.map((studentInfo) => (
            <StudentInfoMarker
              studentInfo={studentInfo}
              closeInfo={() =>
                setOpenStudentInfo((prev) =>
                  prev === studentInfo._id ? "" : studentInfo._id
                )
              }
              showInfoId={openStudentInfo}
              key={studentInfo._id}
            />
          ))}
        {currentSubPosition && (
          <Marker
            position={currentSubPosition}
            label="Servis aracı konum"
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: "#FF0000",
              fillOpacity: 0.6,
              anchor: new window.google.maps.Point(0, 0),
              strokeWeight: 0,
              scale: 5,
            }}
            animation={window.google.maps.Animation.BOUNCE}
          >
            <div>Bazı</div>
          </Marker>
        )}
      </GoogleMap>
    );
  return <span></span>;
}
