import * as React from "react";
import url from "url";

import {
  Grid,
  IconButton,
  LinearProgress,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Business as SchoolIcon, LocationSearching } from "@material-ui/icons";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";

import { useSchoolQuery } from "../../../../generated/graphql";
import AddAddressButton from "../AddAddresSchoolButton";

export default function MapPage({ schoolId }: { schoolId: string }) {
  const [center, setCenter] = React.useState<google.maps.LatLngLiteral>();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDnBo9R9nd69wNMSl2iGyFRVypavjV79wg",
  });
  const getMyLocation = async () => {
    if (navigator.geolocation) {
      try {
        const position = await new Promise<Position>((res, rej) => {
          navigator.geolocation.getCurrentPosition(res, rej);
        });
        return {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      } catch (error) {
        //
      }
    }
  };

  const goCurrentLocaiton = async () => {
    const location = await getMyLocation();
    location && setMylocation(location);
  };
  const [myLocation, setMylocation] = React.useState<
    google.maps.LatLngLiteral
  >();
  const [map, setMap] = React.useState<google.maps.Map<Element>>();
  const { data } = useSchoolQuery({
    variables: { id: schoolId },
    onCompleted: (Tdata) => {
      const { address } = Tdata.school;
      if (!address) {
        return;
      }
      const [lat, lng] = address.coordinates;
      const loc = { lat, lng };
      setSchoolLoc(loc);
    },
  });
  const [schoolLoc, setSchoolLoc] = React.useState<google.maps.LatLngLiteral>();
  const [newSchoolLoc, newSetSchoolLoc] = React.useState<
    google.maps.LatLngLiteral
  >();
  const [geoAddress, setGeoAddress] = React.useState("");

  const onLoad = React.useCallback(
    function callback(mapItem: google.maps.Map<Element>) {
      const bounds = new window.google.maps.LatLngBounds();
      mapItem.fitBounds(bounds);
      setMap(mapItem);
    },
    [setMap]
  );
  React.useEffect(() => {
    goCurrentLocaiton();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  const onUnmount = React.useCallback(
    function callback() {
      setMap(undefined);
    },
    [setMap]
  );
  console.log(center);

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }
  if (isLoaded)
    return (
      <Grid container direction="row" style={{ height: "80%" }}>
        <Grid item style={{ height: "100%", width: "100%" }}>
          <GoogleMap
            mapContainerStyle={{
              width: "100%",
              height: "100%",
            }}
            center={center}
            options={{
              streetViewControl: false,
            }}
            zoom={30}
            onLoad={onLoad}
            onClick={(e) => {
              const { latLng } = e;
              const position = latLng.toJSON();
              fetch(
                url.resolve(
                  "https://maps.googleapis.com/maps/api/geocode/json?",
                  `json?latlng=${position.lat},${
                    position.lng
                  }&key=${"AIzaSyDnBo9R9nd69wNMSl2iGyFRVypavjV79wg"}`
                )
              )
                .then((responce) => responce.json())
                .then((result: Geocode) => {
                  if (!result) return;
                  const [frmAddress] = result.results;
                  setGeoAddress(frmAddress?.formatted_address || "");
                });
              newSetSchoolLoc(position);
            }}
            onUnmount={onUnmount}
          >
            {/* Child components, such as markers, info windows, etc. */}
            {schoolLoc && (
              <Marker
                title={data?.school.name}
                position={schoolLoc}
                icon={{
                  path:
                    "M17,11V3H7v4H3v14h8v-4h2v4h8V11H17z M7,19H5v-2h2V19z M7,15H5v-2h2V15z M7,11H5V9h2V11z M11,15H9v-2h2V15z M11,11H9V9h2 V11z M11,7H9V5h2V7z M15,15h-2v-2h2V15z M15,11h-2V9h2V11z M15,7h-2V5h2V7z M19,19h-2v-2h2V19z M19,15h-2v-2h2V15z",
                  fillColor: "#FF0000",
                  fillOpacity: 0.6,
                  anchor: new window.google.maps.Point(0, 0),
                  strokeWeight: 0,
                  scale: 1,
                }}
                onDblClick={() => setCenter(schoolLoc)}
              />
            )}
            {newSchoolLoc && (
              <Marker
                title="Yeni Okul Adresi"
                label="Yeni adres"
                position={newSchoolLoc}
                onDblClick={() => setCenter(newSchoolLoc)}
              />
            )}
            {myLocation && (
              <InfoWindow position={myLocation}>
                <div>
                  <Typography>Konumum</Typography>
                  <Typography color="textSecondary" variant="caption">
                    Konumunuz kesin bilgi değildir
                  </Typography>
                </div>
              </InfoWindow>
            )}
            <Tooltip title="Konumum">
              <IconButton
                style={{
                  position: "absolute",
                  bottom: "190px",
                  right: "8px",
                  backgroundColor: "white",
                }}
                onClick={() => setCenter(myLocation)}
              >
                <LocationSearching />
              </IconButton>
            </Tooltip>
            <Tooltip title="Okul Konumu">
              <IconButton
                style={{
                  position: "absolute",
                  bottom: "124px",
                  right: "8px",
                  backgroundColor: "white",
                }}
                onClick={() => setCenter(schoolLoc)}
              >
                <SchoolIcon />
              </IconButton>
            </Tooltip>
          </GoogleMap>
        </Grid>
        <Grid item>
          {newSchoolLoc && (
            <div style={{ marginTop: "8px" }}>
              <AddAddressButton {...newSchoolLoc} schoolId={schoolId} />
            </div>
          )}
          <Typography>{geoAddress}</Typography>
        </Grid>
      </Grid>
    );
  return <LinearProgress />;
}
type Geocode = {
  plus_code: {
    compound_code: string;
    global_code: string;
  };
  results: { formatted_address: string }[];
};
