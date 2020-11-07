import * as React from "react";
import url from "url";

import { IconButton, Typography } from "@material-ui/core";
import { LocationSearching } from "@material-ui/icons";
import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
} from "@react-google-maps/api";

import { UserMapEditProps } from "./type";

export default function UserMap(props: UserMapEditProps) {
  const { setVariables } = props;
  const [myLocation, setMylocation] = React.useState<
    google.maps.LatLngLiteral
  >();
  const [map, setMap] = React.useState<google.maps.Map<Element>>();
  const [personAddressLoc, setPersonAddressLoc] = React.useState<
    google.maps.LatLngLiteral
  >();
  const [, setGeoAddress] = React.useState("");

  const onLoad = React.useCallback(
    function callback(mapItem: google.maps.Map<Element>) {
      const bounds = new window.google.maps.LatLngBounds();
      mapItem.fitBounds(bounds);
      setMap(mapItem);
    },
    [setMap]
  );

  const onUnmount = React.useCallback(
    function callback() {
      setMap(undefined);
    },
    [setMap]
  );

  const goCurrentLocaiton = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((l) => {
        setMylocation({ lat: l.coords.latitude, lng: l.coords.longitude });
      });
    }
  };

  return (
    <div>
      <Typography>
        Servis aracının öğrenciyi almaya geleceği konumunu, harita üzerine
        tıklayarak hatasız bir şekilde belirleyiniz
      </Typography>
      <div style={{ height: "400px", width: "100%" }}>
        <LoadScript googleMapsApiKey="AIzaSyDnBo9R9nd69wNMSl2iGyFRVypavjV79wg">
          <GoogleMap
            mapContainerStyle={{
              width: "100%",
              height: "100%",
            }}
            center={myLocation}
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
                  setVariables((prevData) => {
                    return {
                      ...prevData,
                      ...position,
                      description:
                        prevData.title || frmAddress?.formatted_address,
                    };
                  });
                });
              setPersonAddressLoc(position);
            }}
            onUnmount={onUnmount}
          >
            {/* Child components, such as markers, info windows, etc. */}
            {personAddressLoc && (
              <Marker
                title={"Adres konumu"}
                position={personAddressLoc}
                onDblClick={() => map?.setCenter(personAddressLoc)}
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
            <IconButton
              style={{
                position: "absolute",
                bottom: "190px",
                right: "8px",
                backgroundColor: "white",
              }}
              onClick={goCurrentLocaiton}
            >
              <LocationSearching />
            </IconButton>
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}
type Geocode = {
  plus_code: {
    compound_code: string;
    global_code: string;
  };
  results: { formatted_address: string }[];
};
