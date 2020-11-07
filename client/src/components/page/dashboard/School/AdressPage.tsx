import * as React from "react";
import { useParams } from "react-router-dom";

import { Container, Typography } from "@material-ui/core";

import MapPage from "./MapPage";

type ParamType = {
  schoolId: string;
};
export default function AddressPage() {
  const { schoolId } = useParams<ParamType>();
  return (
    <Container style={{ height: "80%" }}>
      <Typography>Adres</Typography>
      <MapPage schoolId={schoolId} />
    </Container>
  );
}
